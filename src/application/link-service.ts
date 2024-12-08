import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../infrastructure/types";
import { LinkRepo } from "../infrastructure/repositories/link";
import { openai } from "../utils/openai";
import { CategoryRepo } from "../infrastructure/repositories/category";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../infrastructure/errors";
import { InsertLink } from "../infrastructure/interfaces/link";
import { Link } from "@prisma/client";

@injectable()
export class LinkService {
  constructor(
    @inject(TYPES.linkRepo) private linkRepo: LinkRepo,
    @inject(TYPES.categoryRepo) private categoryRepo: CategoryRepo
  ) {}

  async getLinksByUser(userId: string, title: string | undefined, category: string | undefined) {
    return await this.linkRepo.getLinksByUser(userId, title, category);
  }

  async createLink(link: string, userId: string) {
    const categories = await this.categoryRepo.getCategoriesByUser(userId, undefined);

    if (categories.length === 0) {
      throw new NotFoundError("Category not found. Create one first!");
    
    }

    const urlRegex =  /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    if(!urlRegex.test(link)){
      throw new BadRequestError("URL format is not valid!");
    }



    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: `Decide one category of the inputed URL, create summary about the URL, and add title about the URL\n\nIMPORTANT\nthe category provided is below. You should choose one the most related category from the URL\n${JSON.stringify(
                categories
              )}\n\nIMPORTANT\nThe summary must consist of maximal 100 characters.\n\nIMPORTANT\nThe title must consist of maximal 50 characters\n\nIMPORTANT\nThe output should be in JSON format with attribute as folows\nurl: the inputted url\ncategory: {id: choosen category id, name: choosen category name}\nsummary: summary of url content\ntitle: title of the url`,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              text: `${link}`,
              type: "text",
            },
          ],
        },
      ],
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices[0].message.content;
    if (content) {
      const output = JSON.parse(content);
      const { summary, category, title } = output;
      const data: InsertLink = {
        link,
        userId,
        title,
        summary,
        categoryId: category.id,
      };

      return await this.linkRepo.createLink(data);
    }
  }

  async updateLink(data: Partial<Link>, id: string) {
    const updatedLink = await this.linkRepo.getLinkById(id);

    if (updatedLink?.userId !== data.userId) {
      throw new UnauthorizedError("You dont have access to this resource!");
    }

    const choosenCategory = await this.categoryRepo.getCategoryById(
      data.categoryId as string
    );

    if (!choosenCategory) {
      throw new NotFoundError("Category not found");
    }

    return await this.linkRepo.updateLink(data, id);
  }

  async deleteLink(id: string, userId: string) {
    const deleteLink = await this.linkRepo.getLinkById(id);

    if (deleteLink?.userId !== userId) {
      throw new UnauthorizedError("You dont have access to this resource!");
    }

    return await this.linkRepo.deleteLink(id);
  }
}

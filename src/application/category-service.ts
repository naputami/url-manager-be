import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../infrastructure/types";
import { CategoryRepo } from "../infrastructure/repositories/category";
import { ForbiddenError } from "../infrastructure/errors";
import { NotFoundError } from "elysia";

@injectable()
export class CategoryService {
  constructor(@inject(TYPES.categoryRepo) private categoryRepo: CategoryRepo) {}

  async getCategoriesByUser(userId: string, name: string | undefined) {
    return await this.categoryRepo.getCategoriesByUser(userId, name);
  }

  async createCategory(name: string, userId: string) {
    return await this.categoryRepo.createCategory(name, userId);
  }

  async updateCategory(newName: string, id: string, userId: string) {
    const updatedCategory = await this.categoryRepo.getCategoryById(id);

    if(!updatedCategory){
      throw new NotFoundError("Category not found");
    }

    if (updatedCategory.userId !== userId) {
      throw new ForbiddenError();
    }

    return await this.categoryRepo.updateCategory(newName, id);
  }

  async deleteCategory(id: string, userId: string) {
    const deletedCategory = await this.categoryRepo.getCategoryById(id);

    if (deletedCategory?.userId !== userId) {
      throw new ForbiddenError();
    }

    return await this.categoryRepo.deleteCategory(id);
  }
}

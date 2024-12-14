import "reflect-metadata";
import { injectable } from "inversify";
import { prisma } from "../../utils/prisma";
import { Link } from "@prisma/client";
import { InsertLink, ILink } from "../interfaces/link";

@injectable()
export class LinkRepo implements ILink {
  async getLinksByUser(
    userId: string,
    title: string | undefined,
    category: string | undefined
  ): Promise<Partial<Link>[]> {
    if (category && title) {
      return await prisma.link.findMany({
        where: {
          AND: [
            {
              title: {
                contains: title,
                mode: "insensitive",
              },
            },
            {
              categoryId: {
                equals: category,
              },
            },
            {
              userId: {
                equals: userId,
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          link: true,
          summary: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }
    if (title) {
      return await prisma.link.findMany({
        where: {
          title: {
            contains: title,
            mode: "insensitive",
          },
          userId: {
            equals: userId,
          },
        },
        select: {
          id: true,
          title: true,
          link: true,
          summary: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    if (category) {
      return await prisma.link.findMany({
        where: {
          categoryId: {
            equals: category,
          },
          userId: {
            equals: userId,
          },
        },
        select: {
          id: true,
          title: true,
          link: true,
          summary: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    return await prisma.link.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        link: true,
        summary: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getLinkById(id: string): Promise<Link | null> {
    return await prisma.link.findUnique({
      where: {
        id,
      },
    });
  }

  async createLink(data: InsertLink): Promise<Link> {
    return await prisma.link.create({
      data: {
        userId: data.userId,
        categoryId: data.categoryId,
        title: data.title,
        summary: data.summary,
        link: data.link,
      },
    });
  }

  async updateLink(data: Partial<Link>, id: string): Promise<Link | null> {
    return await prisma.link.update({
      where: {
        id,
      },
      data: {
        categoryId: data.categoryId,
        title: data.title,
        summary: data.summary,
        link: data.link,
      },
    });
  }

  async deleteLink(id: string): Promise<Link | null> {
    return await prisma.link.delete({
      where: {
        id,
      },
    });
  }

  async getLatestLinksByUser(userId: string) : Promise<Partial<Link>[]> {
    return await prisma.link.findMany({
      where: {
        userId
      },
      orderBy: [{createdAt: 'desc'}],
      take: 5,
      select: {
        id: true,
        title: true,
        link: true,
        summary: true,
        category: {
          select: {
            name: true 
          }
        },
        createdAt: true
      }
    })
  }
}

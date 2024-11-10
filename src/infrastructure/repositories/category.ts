import "reflect-metadata";
import { ICategory } from "../interfaces/category";
import { Category } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { injectable } from "inversify";

@injectable()
export class CategoryRepo implements ICategory {
  async getCategoriesByUser(userId: string): Promise<Partial<Category>[]> {
    return await prisma.category.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
      }
    });
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async createCategory(name: string, userId: string): Promise<Category> {
    return await prisma.category.create({
      data: {
        name,
        userId,
      },
    });
  }

  async updateCategory(name: string, id: string): Promise<Category> {
    return await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async deleteCategory(id: string): Promise<Category> {
    return await prisma.category.delete({
      where: {
        id,
      },
    });
  }
}

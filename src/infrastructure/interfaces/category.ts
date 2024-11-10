import { Category} from "@prisma/client";

export interface ICategory {
    getCategoriesByUser: (userId: string) => Promise<CategoryItemList[]>;
    createCategory: (name: string, userId: string) => Promise<Category>;
    updateCategory: (name: string, id: string) => Promise<Category | null>;
    deleteCategory: (id: string) => Promise<Category | null>;
    getCategoryById: (id: string) => Promise<Category | null>;
}

export type CategoryItemList = Omit<Category, "userId">
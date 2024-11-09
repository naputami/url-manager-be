import {User} from "@prisma/client";

export interface IUser {
    createUser: (data: InsertUser) => Promise<User>;
    findUserByEmail: (email: string) => Promise<User | null>;
}

export type InsertUser =  Omit<User, "id"|"createdAt"|"updatedAt">;
export type LoginUser = Pick<User, "email" | "password">;
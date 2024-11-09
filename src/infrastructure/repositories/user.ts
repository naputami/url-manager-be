import { User } from "@prisma/client";
import { IUser, InsertUser } from "../interfaces/user";
import { prisma } from "../../utils/prisma";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class UserRepo implements IUser {
  async createUser(
    data: InsertUser
  ): Promise<User> {
    return await prisma.user.create({
      data: {
        name: data.name,
        password: data.password,
        email: data.email,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}

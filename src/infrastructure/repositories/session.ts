import { injectable } from "inversify";
import { ISession } from "../interfaces/session";
import "reflect-metadata";
import { Session, User } from "@prisma/client";
import { SessionWithUser } from "../interfaces/session";
import { prisma } from "../../utils/prisma";

@injectable()
export class SessionRepo implements ISession {
  async getToken(id: string): Promise<SessionWithUser | null> {
    return await prisma.session.findFirst({
      where: {
        id,
      },
      include: {
        user: true
      }
    });
  }

  async generateToken(user: User): Promise<Session> {
    return await prisma.session.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async deleteToken(id: string): Promise<Session | null> {
    return await prisma.session.delete({
      where: {
        id,
      },
    });
  }
}

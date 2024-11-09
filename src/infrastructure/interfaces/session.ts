import { Session, User, Prisma } from "@prisma/client";

export interface ISession {
    getToken: (id: string) => Promise<SessionWithUser | null>;
    generateToken: (user: User) => Promise<Session>;
    deleteToken: (id: string) => Promise<Session | null>;
}

export type SessionWithUser = Prisma.SessionGetPayload<{
    include: { user: true }
  }>;
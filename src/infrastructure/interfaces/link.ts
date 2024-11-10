import { Link } from "@prisma/client";

export interface ILink {
  getLinksByUser: (userId: string) => Promise<Partial<Link>[]>;
  getLinkById: (id: string) => Promise<Link | null>;
  createLink: (data: InsertLink) => Promise<Link>;
  updateLink: (data: Partial<Link>, id: string) => Promise<Link | null>;
  deleteLink: (id: string) => Promise<Link | null>;
}

export type InsertLink = {
  link: string;
  summary: string;
  title: string;
  userId: string;
  categoryId: string;
};


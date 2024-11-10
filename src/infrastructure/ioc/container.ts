import { Container } from "inversify";
import { UserRepo } from "../repositories/user";
import { SessionRepo } from "../repositories/session";
import { TYPES } from "../types";
import { AuthService } from "../../application/auth-service";
import { CategoryRepo } from "../repositories/category";
import { CategoryService } from "../../application/category-service";
import { LinkRepo } from "../repositories/link";
import { LinkService } from "../../application/link-service";

const container = new Container();

container.bind<UserRepo>(TYPES.UserRepo).to(UserRepo);
container.bind<SessionRepo>(TYPES.SessionRepo).to(SessionRepo);
container.bind<CategoryRepo>(TYPES.CategoryRepo).to(CategoryRepo);
container.bind<LinkRepo>(TYPES.LinkRepo).to(LinkRepo);
container.bind<AuthService>(AuthService).toSelf();
container.bind<CategoryService>(CategoryService).toSelf();
container.bind<LinkService>(LinkService).toSelf();

export const authService = container.get<AuthService>(AuthService);
export const categoryService = container.get<CategoryService>(CategoryService);
export const linkService = container.get<LinkService>(LinkService)
import { Container } from "inversify";
import { UserRepo } from "../repositories/user";
import { SessionRepo } from "../repositories/session";
import { TYPES } from "../types";
import { AuthService } from "../../application/auth-service";
import { CategoryRepo } from "../repositories/category";
import { CategoryService } from "../../application/category-service";
import { LinkRepo } from "../repositories/link";
import { LinkService } from "../../application/link-service";
import { LoggerDev } from "../logger/logger-dev";
import { LoggerProd } from "../logger/logger-prod";
import { ILogger } from "../interfaces/logger";

const container = new Container();

container.bind(TYPES.userRepo).to(UserRepo);
container.bind(TYPES.sessionRepo).to(SessionRepo);
container.bind(TYPES.categoryRepo).to(CategoryRepo);
container.bind(TYPES.linkRepo).to(LinkRepo);

if (process.env.NODE_ENV === "production") {
    container.bind(TYPES.logger).to(LoggerProd);
  } else {
    container.bind(TYPES.logger).to(LoggerDev);
  }
  

container.bind(AuthService).toSelf();
container.bind<CategoryService>(CategoryService).toSelf();
container.bind<LinkService>(LinkService).toSelf();

export const authService = container.get<AuthService>(AuthService);
export const categoryService = container.get<CategoryService>(CategoryService);
export const linkService = container.get<LinkService>(LinkService)
export const loggerService = container.get<ILogger>(TYPES.logger);
import { Container } from "inversify";
import { UserRepo } from "../repositories/user";
import { SessionRepo } from "../repositories/session";
import { TYPES } from "../types";
import { AuthService } from "../../application/auth-service";

const container = new Container();

container.bind<UserRepo>(TYPES.UserRepo).to(UserRepo);
container.bind<SessionRepo>(TYPES.SessionRepo).to(SessionRepo);
container.bind<AuthService>(AuthService).toSelf();

export const authService = container.get<AuthService>(AuthService);
import { inject, injectable } from "inversify";
import { UserRepo } from "../infrastructure/repositories/user";
import { TYPES } from "../infrastructure/types";
import "reflect-metadata";
import { InsertUser, LoginUser } from "../infrastructure/interfaces/user";
import {
  EmailAlreadyRegisteredError,
  InvalidPasswordError,
  ServerError,
  SessionNotFoundError,
  UserNotFoundError,
} from "../infrastructure/errors";
import { SessionRepo } from "../infrastructure/repositories/session";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepo) private userRepo: UserRepo,
    @inject(TYPES.SessionRepo) private sessionRepo: SessionRepo
  ) {}

  async register(data: InsertUser) {
    const { email, name, password } = data;
    const user = await this.userRepo.findUserByEmail(email);

    if (user) {
      throw new EmailAlreadyRegisteredError();
    }

    try {
      const hashPassword = await Bun.password.hash(password, "argon2d");
      return await this.userRepo.createUser({
        email: email,
        name: name,
        password: hashPassword,
      });
    } catch (_e) {
      throw new ServerError();
    }
  }

  async login(data: LoginUser) {
    const { email, password } = data;

    const user = await this.userRepo.findUserByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const isValid = await Bun.password.verify(password, user.password);

    if (!isValid) {
      throw new InvalidPasswordError();
    }

    try {
      const session = await this.sessionRepo.generateToken(user);
      return { user, session };
    } catch (_e) {
      throw new ServerError();
    }
  }

  async logout(token: string) {
      return this.sessionRepo.deleteToken(token);
  }

  async getSession(token: string) {
    const session = await this.sessionRepo.getToken(token);

    if (!session) {
      throw new SessionNotFoundError();
    }

    return session;
  }
}

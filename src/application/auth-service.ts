import { inject, injectable } from "inversify";
import { UserRepo } from "../infrastructure/repositories/user";
import { TYPES } from "../infrastructure/types";
import "reflect-metadata";
import { InsertUser, LoginUser } from "../infrastructure/interfaces/user";
import {
  EmailAlreadyRegisteredError,
  InvalidCredential,
  NotFoundError,
} from "../infrastructure/errors";
import { SessionRepo } from "../infrastructure/repositories/session";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.userRepo) private userRepo: UserRepo,
    @inject(TYPES.sessionRepo) private sessionRepo: SessionRepo,
  ) {}

  async register(data: InsertUser) {
    const { email, name, password } = data;
    const user = await this.userRepo.findUserByEmail(email);

    if (user) {
      throw new EmailAlreadyRegisteredError();
    }

    const hashPassword = await Bun.password.hash(password, "argon2d");
    return await this.userRepo.createUser({
      email: email,
      name: name,
      password: hashPassword,
    });
  }

  async login(data: LoginUser) {
    const { email, password } = data;

    const user = await this.userRepo.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const isValid = await Bun.password.verify(password, user.password);

    if (!isValid) {
      throw new InvalidCredential("Invalid credential");
    }

    const session = await this.sessionRepo.generateToken(user);
    return { user, session };
  }

  async logout(token: string) {
    return this.sessionRepo.deleteToken(token);
  }

  async getSession(token: string) {
    const session = await this.sessionRepo.getToken(token);

    if (!session) {
      throw new NotFoundError("Session not found");
    }

    return session;
  }
}

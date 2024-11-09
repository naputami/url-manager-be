import { Context } from "elysia";

import { authService } from "../../infrastructure/ioc/container";
import { UnauthorizedError } from "../../infrastructure/errors";

export async function sessionMiddleware({ cookie: { session }, set }: Context) {
  if (!session?.value) {
    set.status = 401;
    throw new UnauthorizedError();
  }

  const {user} = await authService.getSession(session.value);

  if (!user) {
    set.status = 401;
    throw new UnauthorizedError();
  }

  return {user};
}
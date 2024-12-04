import { Elysia, t } from "elysia";
import { authService } from "../../infrastructure/ioc/container";
import { BadRequestError } from "../../infrastructure/errors";

export const authRouter = new Elysia()
  .guard({
    tags: ["auth"],
  })
  .post(
    "/register",
    async ({ body, set }) => {
      const user = await authService.register(body);
      set.status = 201;
      return {
        success: true,
        message: "You can login using you registered account",
        data: {
          name: user.name,
          email: user.email,
        },
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3, maxLength: 50 }),
        email: t.String({ minLength: 1, maxLength: 50, format: "email" }),
        password: t.String({ minLength: 4, maxLength: 20 }),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set, cookie: { session } }) => {
      const { user, session: newSession } = await authService.login(body);
      session.set({
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        value: newSession.id,
        sameSite: "none",
      });

      set.status = 200;

      return {
        success: true,
        message: "Logged in",
        data: {
          sessionId: newSession.id,
          email: user.email,
          name: user.name,
        },
      };
    },
    {
      body: t.Object({
        email: t.String({ minLength: 1, maxLength: 50, format: "email" }),
        password: t.String(),
      }),
    }
  )
  .post("/logout", async ({ cookie: { session } }) => {
    const sessionId = session.value;

    if (!sessionId) {
       throw new BadRequestError("You are not logged in")
    }

    await authService.logout(sessionId);
    session.remove();
    return { success: true, message: "Logged out"};
  });

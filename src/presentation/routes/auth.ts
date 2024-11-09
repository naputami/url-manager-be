import { Elysia, t } from "elysia";
import { authService } from "../../infrastructure/ioc/container";
import {
  EmailAlreadyRegisteredError,
  InvalidPasswordError,
  ServerError,
  UserNotFoundError,
} from "../../infrastructure/errors";

export const authRouter = new Elysia()
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const user = await authService.register(body);
        set.status = 201;
        return {
          message: "Registration success",
          user: {
            name: user.name,
            email: user.email,
          },
        };
      } catch (error) {
        if (error instanceof EmailAlreadyRegisteredError) {
          set.status = 400;
          return { message: error.message };
        } else if (error instanceof ServerError) {
          set.status = 500;
          return { message: error.message };
        } else {
          set.status = 500;
          return { message: "Unknown error" };
        }
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3, maxLength: 50 }),
        email: t.String({ minLength: 1, maxLength: 50, format: "email" }),
        password: t.String(),
      }),
      tags: ["auth"],
    }
  )
  .post(
    "/login",
    async ({ body, set, cookie: { session } }) => {
      try {
        const { user, session: newSession } = await authService.login(body);
        session.set({
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          value: newSession.id,
        });

        set.status = 200;

        return {
          message: "Login success",
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          set.status = 400;
          return { message: error.message };
        } else if (error instanceof InvalidPasswordError) {
          set.status = 400;
          return { message: error.message };
        } else if (error instanceof ServerError) {
          set.status = 500;
          return { message: error.message };
        } else {
          set.status = 500;
          return { message: "Unknown error" };
        }
      }
    },
    {
      body: t.Object({
        email: t.String({ minLength: 1, maxLength: 50, format: "email" }),
        password: t.String(),
      }),
      tags: ["auth"],
    }
  )
  .post(
    "/logout",
    async ({ set, cookie: { session } }) => {
      const sessionId = session.value;

      if (!sessionId) {
        set.status = 400;
        throw Error("You are not logged in");
      }

      try {
        await authService.logout(sessionId);
        session.remove();
        return { message: "Logout successfull" };
      } catch (_e) {
        set.status = 500;
        return {
          message: "Server error",
        };
      }
    },
    {
      tags: ["auth"],
    }
  );

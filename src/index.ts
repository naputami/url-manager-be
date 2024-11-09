import { Elysia } from "elysia";
import { authRouter } from "./presentation/routes/auth";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(
    swagger({
      path: "/docs",
      autoDarkMode: true,
      documentation: {
        info: {
          title: "URL Manager API",
          version: "1.0.0",
          description: "URL Manager API Documentation",
        },
      },
    })
  )
  .group("/api/v1", (app) => app.use(authRouter))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

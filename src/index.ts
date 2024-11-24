import { Elysia } from "elysia";
import { authRouter } from "./presentation/routes/auth";
import { swagger } from "@elysiajs/swagger";
import { errorHandler } from "./presentation/middlewares/error-middleware";
import { categoryRouter } from "./presentation/routes/category";
import { linkRouter } from "./presentation/routes/link";
import { cors } from '@elysiajs/cors'

const app = new Elysia()
  .use(cors())
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
  .use(errorHandler)
  .group("/api/v1", (app) =>
    app.use(authRouter).use(categoryRouter).use(linkRouter)
  )
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

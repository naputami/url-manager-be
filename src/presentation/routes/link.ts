import { Elysia, t } from "elysia";
import { sessionMiddleware } from "../middlewares/session-middleware";
import { linkService } from "../../infrastructure/ioc/container";

export const linkRouter = new Elysia()
  .derive(sessionMiddleware)
  .guard({
    tags: ["links"],
  })
  .get(
    "/links",
    async ({ user, set, query }) => {
      set.status = 200;
      const data = await linkService.getLinksByUser(
        user.id,
        query.title,
        query.category
      );
      return {
        success: true,
        data,
      };
    },
    {
      query: t.Object({
        title: t.Optional(t.String()),
        category: t.Optional(t.String()),
      }),
    }
  )
  .get("/latest-links", async ({ user, set }) => {
    set.status = 200;
    const data = await linkService.getLatestLinks(user.id);
    return {
      success: true,
      data: data,
    };
  })
  .post(
    "/links",
    async ({ user, body, set }) => {
      const data = await linkService.createLink(body.link, user.id);
      set.status = 201;
      return {
        success: true,
        data,
      };
    },
    {
      body: t.Object({
        link: t.String(),
      }),
    }
  )
  .patch(
    "/links/:id",
    async ({ user, body, set, params: { id } }) => {
      const data = { ...body, userId: user.id };
      const updatedLink = await linkService.updateLink(data, id);
      set.status = 200;
      return {
        success: true,
        data: updatedLink,
      };
    },
    {
      body: t.Object({
        link: t.String(),
        title: t.String(),
        summary: t.String(),
        categoryId: t.String(),
      }),
    }
  )
  .delete("/links/:id", async ({ user, params: { id }, set }) => {
    const deletedLink = await linkService.deleteLink(id, user.id);
    set.status = 200;
    return {
      success: true,
      data: deletedLink,
    };
  });

import { Elysia, t } from "elysia";
import { categoryService } from "../../infrastructure/ioc/container";
import { sessionMiddleware } from "../middlewares/session-middleware";

export const categoryRouter = new Elysia()
  .derive(sessionMiddleware)
  .guard({
    tags: ["categories"],
  })
  .get("/categories", async ({ user, set }) => {
    const categories = await categoryService.getCategoriesByUser(user.id);
    set.status = 200;
    return {
      message: "Categories are sucessfully loaded",
      data: categories,
    };
  })
  .post(
    "/categories",
    async ({ user, body, set }) => {
      const newCategory = await categoryService.createCategory(
        body.name,
        user.id
      );
      set.status = 201;
      return {
        message: "Category is created",
        data: newCategory,
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3, maxLength: 20 }),
      }),
    }
  )
  .patch(
    "/categories/:id",
    async ({ user, body, set, params: { id } }) => {
      const updatedCategory = await categoryService.updateCategory(
        body.name,
        id,
        user.id
      );
      set.status = 200;
      return {
        message: "Update category success",
        data: updatedCategory,
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3, maxLength: 20 }),
      }),
    }
  )
  .delete("/categories/:id", async ({ user, set, params: { id } }) => {
    const deletedCategory = await categoryService.deleteCategory(id, user.id);
    set.status = 200;
    return {
      message: "Delete category success",
      data: deletedCategory,
    };
  });

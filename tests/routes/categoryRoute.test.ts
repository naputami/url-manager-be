import { Elysia } from "elysia";
import { categoryRouter } from "../../src/presentation/routes/category";
import { categoryService } from "../../src/infrastructure/ioc/container";
import { authService } from "../../src/infrastructure/ioc/container";
import { errorHandler } from "../../src/presentation/middlewares/error-middleware";
import {
  jest,
  test,
  expect,
  afterEach,
  spyOn,
  describe,
} from "bun:test";

const mockUser = {
  id: "mock_id",
  name: "John",
  email: "john@example.com",
  createdAt: new Date("2024-11-27"),
  updatedAt: new Date("2024-11-27"),
  password: "mock_password",
};

const mockSession = {
  id: "mock_session_id",
  createdAt: new Date("2024-11-27"),
  userId: "mock_user_id",
};

const app = new Elysia()
  .use(errorHandler)
  .group("/api/v1", (app) => app.use(categoryRouter));

describe("Category Route - Get All Category", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should return 200 and category list when success", async () => {
    spyOn(authService, "getSession").mockResolvedValue({...mockSession, user: mockUser});
    const mockCategories = [{ id: "cat1", name: "Category 1" }];
    spyOn(categoryService, "getCategoriesByUser").mockResolvedValue(mockCategories);

    const response = await app.handle(
        new Request("http://localhost/api/v1/categories", {
          method: "GET",
          headers: { "Content-Type": "application/json", Cookie: `session=${mockSession.id}` },
        })
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({
      success: true,
      data: mockCategories,
    });

    expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
    expect(categoryService.getCategoriesByUser).toHaveBeenCalledWith(mockUser.id);

  });
});

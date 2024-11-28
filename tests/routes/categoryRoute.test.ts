import { Elysia, NotFoundError } from "elysia";
import { categoryRouter } from "../../src/presentation/routes/category";
import { categoryService } from "../../src/infrastructure/ioc/container";
import { authService } from "../../src/infrastructure/ioc/container";
import { errorHandler } from "../../src/presentation/middlewares/error-middleware";
import { mockCategory, mockSession, mockUser } from "../mock-data";
import { jest, test, expect, afterEach, spyOn, describe, beforeAll } from "bun:test";

const app = new Elysia()
  .use(errorHandler)
  .group("/api/v1", (app) => app.use(categoryRouter));

describe("Category Route Test ", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe("Category Route - Get All Category", () => {
    test("Should return 200 and category list when success", async () => {
      spyOn(authService, "getSession").mockResolvedValue({
        ...mockSession,
        user: mockUser,
      });
      const mockCategories = [{ id: "cat1", name: "Category 1" }];
      spyOn(categoryService, "getCategoriesByUser").mockResolvedValue(
        mockCategories
      );
  
      const response = await app.handle(
        new Request("http://localhost/api/v1/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
        })
      );
  
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        success: true,
        data: mockCategories,
      });
  
      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
      expect(categoryService.getCategoriesByUser).toHaveBeenCalledWith(
        mockUser.id
      );
    });
  
    test("Should return 401 when no session id in cookie", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
  
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          success: false,
        })
      );
    });
  });
  
  describe("Category Route - Create New Category", () => {
    beforeAll(() => {
      spyOn(authService, "getSession").mockResolvedValue({
        ...mockSession,
        user: mockUser,
      });
    });
  
    test("Should return 201 and created category when success", async () => {
     
      spyOn(categoryService, "createCategory").mockResolvedValue(
        mockCategory
      );
  
      const response = await app.handle(
        new Request("http://localhost/api/v1/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
          body: JSON.stringify({
            name: mockCategory.name
          })
        })
      );
  
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toEqual({
        success: true,
        data: expect.objectContaining({
          name: mockCategory.name,
          id: mockCategory.id,
          userId: mockCategory.userId,
          createdAt: mockCategory.createdAt.toISOString(),
          updatedAt: mockCategory.updatedAt.toISOString(),
        }),
      });
  
      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
      expect(categoryService.createCategory).toHaveBeenCalledWith(
        mockCategory.name,
        mockUser.id
      );
    });
  
    test("Should return 400 when name is more than 20 characters", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
          body: JSON.stringify({
            name: "Lorem ipsum dolor sit amet"
          })
        })
      );
  
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          success: false,
        })
      );
  
      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
    });
  });

  describe("Category Route - Update Category", () => {
    beforeAll(() => {
      spyOn(authService, "getSession").mockResolvedValue({
        ...mockSession,
        user: mockUser,
      });
    });
  
    test("Should return 200 and updated category when success", async () => {
     
      spyOn(categoryService, "updateCategory").mockResolvedValue(
        mockCategory
      );
  
      const response = await app.handle(
        new Request(`http://localhost/api/v1/categories/${mockCategory.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
          body: JSON.stringify({
            name: mockCategory.name
          })
        })
      );
  
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        success: true,
        data: expect.objectContaining({
          name: mockCategory.name,
          id: mockCategory.id,
          userId: mockCategory.userId,
          createdAt: mockCategory.createdAt.toISOString(),
          updatedAt: mockCategory.updatedAt.toISOString(),
        }),
      });
  
      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
      expect(categoryService.updateCategory).toHaveBeenCalledWith(
        mockCategory.name,
        mockCategory.id,
        mockUser.id
      );
    });
  
    test("Should return 404 when category id is not found", async () => {
      spyOn(categoryService, "updateCategory").mockImplementation(() => {
        throw new NotFoundError("Category not found");
      })
      const response = await app.handle(
        new Request("http://localhost/api/v1/categories/cat2", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
          body: JSON.stringify({
            name: "Lorem ipsum"
          })
        })
      );
  
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          success: false,
        })
      );
  
      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
    });
  })

  describe("Category Route - Delete Category", () => {
    beforeAll(() => {
      spyOn(authService, "getSession").mockResolvedValue({
        ...mockSession,
        user: mockUser,
      });
    });
  
    test("Should return 200 and deleted category when success", async () => {
     
      spyOn(categoryService, "deleteCategory").mockResolvedValue(
        mockCategory
      );
  
      const response = await app.handle(
        new Request(`http://localhost/api/v1/categories/${mockCategory.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
        })
      );
  
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        success: true,
        data: expect.objectContaining({
          name: mockCategory.name,
          id: mockCategory.id,
          userId: mockCategory.userId,
          createdAt: mockCategory.createdAt.toISOString(),
          updatedAt: mockCategory.updatedAt.toISOString(),
        }),
      });
  
      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
      expect(categoryService.deleteCategory).toHaveBeenCalledWith(
        mockCategory.id,
        mockUser.id
      );
    });
  
    test("Should return 404 when category id is not found", async () => {
      spyOn(categoryService, "deleteCategory").mockImplementation(() => {
        throw new NotFoundError("Category not found");
      })
      const response = await app.handle(
        new Request("http://localhost/api/v1/categories/cat2", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
        })
      );
  
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          success: false,
        })
      );
  
      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
    });
  })

  
})



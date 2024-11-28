import { Elysia, NotFoundError } from "elysia";
import { linkRouter } from "../../src/presentation/routes/link";
import { linkService } from "../../src/infrastructure/ioc/container";
import { authService } from "../../src/infrastructure/ioc/container";
import { errorHandler } from "../../src/presentation/middlewares/error-middleware";
import {
  mockUser,
  mockUpdatedLink,
  mockLink,
  mockSession,
  mockLinkItemList,
} from "../mock-data";
import {
  jest,
  test,
  expect,
  afterEach,
  spyOn,
  describe,
  beforeAll,
} from "bun:test";
import { BadRequestError } from "../../src/infrastructure/errors";

const app = new Elysia()
  .use(errorHandler)
  .group("/api/v1", (app) => app.use(linkRouter));

describe("Link Route Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Link Route - Get All links", () => {
    test("Should return 200 and category list when success", async () => {
      spyOn(authService, "getSession").mockResolvedValue({
        ...mockSession,
        user: mockUser,
      });
      const mockLinks = [mockLinkItemList];
      spyOn(linkService, "getLinksByUser").mockResolvedValue(mockLinks);

      const response = await app.handle(
        new Request("http://localhost/api/v1/links", {
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
        data: [mockLinkItemList],
      });

      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
      expect(linkService.getLinksByUser).toHaveBeenCalledWith(mockUser.id);
    });

    test("Should return 401 when no session id in cookie", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/links", {
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

  describe("Link route - Create new link", () => {
    beforeAll(() => {
      spyOn(authService, "getSession").mockResolvedValue({
        ...mockSession,
        user: mockUser,
      });
    });

    test("Should return 201 and created link when success", async () => {
      spyOn(linkService, "createLink").mockResolvedValue(mockLink);

      const response = await app.handle(
        new Request("http://localhost/api/v1/links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
          body: JSON.stringify({
            link: mockLink.link,
          }),
        })
      );

      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toEqual({
        success: true,
        data: expect.objectContaining({
          title: mockLink.title,
          id: mockLink.id,
          summary: mockLink.summary,
          categoryId: mockLink.categoryId,
          userId: mockLink.userId,
          createdAt: mockLink.createdAt.toISOString(),
          updatedAt: mockLink.updatedAt.toISOString(),
        }),
      });

      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
      expect(linkService.createLink).toHaveBeenCalledWith(
        mockLink.link,
        mockUser.id
      );
    });

    test("Should return 400 when link doesnt have URL valid format", async () => {
      spyOn(linkService, "createLink").mockImplementation(() => {
        throw new BadRequestError("Link format must be a valid URL Format");
      });
      const response = await app.handle(
        new Request("http://localhost/api/v1/links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
          body: JSON.stringify({
            link: "not-valid-url",
          }),
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
  describe("Link Route - Update Link", () => {
    beforeAll(() => {
      spyOn(authService, "getSession").mockResolvedValue({
        ...mockSession,
        user: mockUser,
      });
    });

    test("Should return 200 and updated category when success", async () => {
      spyOn(linkService, "updateLink").mockResolvedValue(mockLink);

      const response = await app.handle(
        new Request(`http://localhost/api/v1/links/${mockLink.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
          body: JSON.stringify(mockUpdatedLink),
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        success: true,
        data: expect.objectContaining({
          title: mockLink.title,
          id: mockLink.id,
          summary: mockLink.summary,
          categoryId: mockLink.categoryId,
          userId: mockLink.userId,
          createdAt: mockLink.createdAt.toISOString(),
          updatedAt: mockLink.updatedAt.toISOString(),
        }),
      });

      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
      expect(linkService.updateLink).toHaveBeenCalled();
    });

    test("Should return 404 when link id is not found", async () => {
      spyOn(linkService, "updateLink").mockImplementation(() => {
        throw new NotFoundError("Link not found");
      });
      const response = await app.handle(
        new Request("http://localhost/api/v1/links/link2", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${mockSession.id}`,
          },
          body: JSON.stringify(mockLink),
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
  });
  describe("Category Route - Delete Category", () => {
    beforeAll(() => {
      spyOn(authService, "getSession").mockResolvedValue({
        ...mockSession,
        user: mockUser,
      });
    });
  
    test("Should return 200 and deleted link when success", async () => {
     
      spyOn(linkService, "deleteLink").mockResolvedValue(
        mockLink
      );
  
      const response = await app.handle(
        new Request(`http://localhost/api/v1/links/${mockLink.id}`, {
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
          title: mockLink.title,
          id: mockLink.id,
          summary: mockLink.summary,
          categoryId: mockLink.categoryId,
          userId: mockLink.userId,
          createdAt: mockLink.createdAt.toISOString(),
          updatedAt: mockLink.updatedAt.toISOString(),
        }),
      });
  
      expect(authService.getSession).toHaveBeenCalledWith(mockSession.id);
      expect(linkService.deleteLink).toHaveBeenCalledWith(
        mockLink.id,
        mockUser.id
      );
    });
  
    test("Should return 404 when link id is not found", async () => {
      spyOn(linkService, "deleteLink").mockImplementation(() => {
        throw new NotFoundError("Category not found");
      })
      const response = await app.handle(
        new Request("http://localhost/api/v1/links/link2", {
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

});

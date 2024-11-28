import { Elysia } from "elysia";
import { authRouter } from "../../src/presentation/routes/auth";
import { authService } from "../../src/infrastructure/ioc/container";
import { errorHandler } from "../../src/presentation/middlewares/error-middleware";
import {
  jest,
  beforeAll,
  test,
  expect,
  afterEach,
  spyOn,
  describe,
} from "bun:test";
import { InvalidCredential } from "../../src/infrastructure/errors";

const app = new Elysia().use(errorHandler).group("/api/v1", (app) => app.use(authRouter));

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

describe("Auth route test", ()=> {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Auth routes - Register", () => {
    beforeAll(() => {
      Bun.password.hash = jest.fn().mockResolvedValue("mocked_hashed_password");
      spyOn(authService, "register").mockResolvedValue(mockUser);
    });
  
    test("should return 201 and user data on successful registration", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: mockUser.name,
            email: mockUser.email,
            password: mockUser.password,
          }),
        })
      );
  
      const json = await response.json();
  
      expect(response.status).toBe(201);
      expect(json).toEqual({
        success: true,
        data: {
          name: mockUser.name,
          email: mockUser.email,
        },
      });
      expect(authService.register).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      });
    });
  
    test("should return 400 when body is invalid", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "invalid-email",
            password: "pass",
          }),
        })
      );
  
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        })
      );
    });
  });
  
  describe("Auth routes - Login", () => {
  
    test("should return 200, user data, and sessionId on successful login", async () => {
      spyOn(authService, "login").mockResolvedValue({
          user: mockUser,
          session: mockSession,
        });
      const response = await app.handle(
        new Request("http://localhost/api/v1/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: mockUser.email,
            password: mockUser.password,
          }),
        })
      );
  
      const json = await response.json();
  
      expect(response.status).toBe(200);
      expect(json).toEqual({
        success: true,
        data: {
          sessionId: mockSession.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });
      expect(authService.login).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
      });
    });
    test("should return 400 and error message when user use invalid creadentials", async () => {
      spyOn(authService, "login").mockImplementation(() => {
          throw new InvalidCredential("Invalid credential");
      });
      const response = await app.handle(
        new Request("http://localhost/api/v1/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: mockUser.email,
            password: mockUser.password,
          }),
        })
      );
  
      const json = await response.json();
      console.log(json);
  
      expect(response.status).toBe(400);
      expect(json).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            success: false
          })
        );
      expect(authService.login).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
      });
    });
  });
  
  describe("Auth routes - Logout", () => {
      beforeAll(() => {
          spyOn(authService, "logout").mockResolvedValue(mockSession);
        });
    
      test("should return 200 when user logout successfully", async () => {
  
      const response = await app.handle(
          new Request("http://localhost/api/v1/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `session=${mockSession.id}`,
            },
          })
        );
    
        const json = await response.json();
  
      expect(response.status).toBe(200);
      expect(json).toEqual({
        success: true,
      });
      expect(authService.logout).toHaveBeenCalledWith(mockSession.id);
      });
  
  
      test("should return 400 if session cookie is missing", async () => {
          const response = await app.handle(
            new Request("http://localhost/api/v1/logout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })
          );
      
          const json = await response.json();
      
          expect(response.status).toBe(400);
          expect(json).toEqual({
            success: false,
            message: "You are not logged in",
          });
          expect(authService.logout).not.toHaveBeenCalled();
        });
    });
    
})


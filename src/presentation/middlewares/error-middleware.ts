import { Elysia } from "elysia";
import { AppError } from "../../infrastructure/errors";

export const errorHandler = (app: Elysia) =>
  app.onError(({ code, error, set }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        error: true,
        message: error.message,
        code: error.code,
      };
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return {
        error: true,
        message: error.message,
        code: "VALIDATION_ERROR",
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: true,
        message: error.message,
        code: "NOT_FOUND",
      };
    }

    console.error("Unhandled error:", error);

    set.status = 500;
    return {
      error: true,
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    };
  });

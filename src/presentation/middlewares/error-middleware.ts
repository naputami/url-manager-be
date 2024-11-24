import { Elysia } from "elysia";
import { AppError } from "../../infrastructure/errors";
import { loggerService } from "../../infrastructure/ioc/container";

export const errorHandler = (app: Elysia) =>
  app.onError(({ code, error, set }) => {
    if (error instanceof AppError) {
      loggerService.error(error.message);
      set.status = error.statusCode;
      return {
        success: false,
        message: error.message,
        code: error.statusCode,
      };
    }

    if (code === "VALIDATION") {
      loggerService.error(error.message);
      set.status = 400;
      return {
        success: false,
        message: error.message,
        code: 400,
      };
    }

    if (code === "NOT_FOUND") {
      loggerService.error(error.message);
      set.status = 404;
      return {
        success: false,
        message: error.message,
        code: 404,
      };
    }

    loggerService.error(error.message);
    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
      code: 500,
    };
  });

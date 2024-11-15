export class AppError extends Error {
  constructor(message: string, public statusCode: number, public code: string) {
    super(message);
    this.name = "AppError";
  }
}

export class EmailAlreadyRegisteredError extends AppError {
  constructor(message: string = "Email is already registered") {
    super(message, 409, "EMAIL_REGISTERED_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "You are not allowed to access this resource") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class InvalidCredential extends AppError {
  constructor(message: string) {
    super(message, 400, "INVALID_CREDENTIAL");
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, "BAD_REQUEST");
  }
}

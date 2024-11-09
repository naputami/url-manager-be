export class EmailAlreadyRegisteredError extends Error {
  constructor(message: string = "Email is already registered") {
    super(message);
    this.name = "EmailAlreadyRegisteredError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "Unauthorized";
  }
}


export class UserNotFoundError extends Error {
    constructor(message: string = "User is not found") {
      super(message);
      this.name = "UserNotFoundError";
    }
}

export class InvalidPasswordError extends Error {
    constructor(message: string = "Invalid password") {
      super(message);
      this.name = "InvalidPassword";
    }
}

export class SessionNotFoundError extends Error {
  constructor(message: string = "Session not found") {
    super(message);
    this.name = "SessionNotFound";
  }
}


export class ServerError extends Error {
  constructor(message: string = "An unexpected error occurred") {
    super(message);
    this.name = "ServerError";
  }
}

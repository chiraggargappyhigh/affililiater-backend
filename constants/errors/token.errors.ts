import { AppError } from "../../interfaces";

const TOKEN_NOT_FOUND: AppError = {
  status: 404,
  userTitle: "Token not found",
  userMessage: "The token you are looking for does not exist",
  developerMessage: "Token not found",
  errorCode: "token/missing",
};

const INVALID_TOKEN: AppError = {
  status: 401,
  userTitle: "Unauthorized",
  userMessage: "The token you are using is invalid",
  developerMessage: "Token is invalid",
  errorCode: "token/invalid",
};

const TOKEN_EXPIRED: AppError = {
  status: 401,
  userTitle: "Unauthorized",
  userMessage: "The token you are using has expired",
  developerMessage: "Token has expired",
  errorCode: "token/expired",
};

enum TokenError {
  TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",
}

export { TOKEN_NOT_FOUND, INVALID_TOKEN, TOKEN_EXPIRED, TokenError };

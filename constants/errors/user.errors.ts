import { AppError } from "../../interfaces";

const USER_NOT_FOUND: AppError = {
  status: 404,
  userTitle: "User not found",
  userMessage: "The user you are looking for does not exist",
  developerMessage: "User not found",
  errorCode: "user/missing",
};

const USER_NOT_ADMIN: AppError = {
  status: 403,
  userTitle: "Forbidden",
  userMessage: "You are not allowed to perform this action",
  developerMessage: "User is not an admin",
  errorCode: "user/forbidden",
};

const USER_NOT_AUTHORIZED: AppError = {
  status: 401,
  userTitle: "Unauthorized",
  userMessage: "You are not authorized to perform this action",
  developerMessage: "User is not authorized",
  errorCode: "user/unauthorized",
};

const USER_NOT_LOGGED_IN: AppError = {
  status: 401,
  userTitle: "Unauthorized",
  userMessage: "You are not logged in",
  developerMessage: "User is not logged in",
  errorCode: "user/not-logged-in",
};

enum UserError {
  USER_NOT_FOUND = "USER_NOT_FOUND", // "user/missing
  USER_NOT_ADMIN = "USER_NOT_ADMIN", // "user/forbidden
  USER_NOT_AUTHORIZED = "USER_NOT_AUTHORIZED", // "user/unauthorized
  USER_NOT_LOGGED_IN = "USER_NOT_LOGGED_IN", // "user/not-logged-in
}

export {
  USER_NOT_FOUND,
  USER_NOT_ADMIN,
  USER_NOT_AUTHORIZED,
  USER_NOT_LOGGED_IN,
  UserError,
};

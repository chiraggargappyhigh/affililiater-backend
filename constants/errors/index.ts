import {
  TOKEN_NOT_FOUND,
  INVALID_TOKEN,
  TOKEN_EXPIRED,
  TokenError,
} from "./token.errors";
import {
  USER_NOT_ADMIN,
  USER_NOT_AUTHORIZED,
  USER_NOT_FOUND,
  USER_NOT_LOGGED_IN,
  UserError,
} from "./user.errors";

const ERRORS = {
  TOKEN_NOT_FOUND,
  INVALID_TOKEN,
  TOKEN_EXPIRED,
  USER_NOT_ADMIN,
  USER_NOT_AUTHORIZED,
  USER_NOT_FOUND,
  USER_NOT_LOGGED_IN,
};

export { ERRORS, TokenError, UserError };

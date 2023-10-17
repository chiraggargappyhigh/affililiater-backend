"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = exports.TokenError = exports.ERRORS = void 0;
const token_errors_1 = require("./token.errors");
Object.defineProperty(exports, "TokenError", { enumerable: true, get: function () { return token_errors_1.TokenError; } });
const user_errors_1 = require("./user.errors");
Object.defineProperty(exports, "UserError", { enumerable: true, get: function () { return user_errors_1.UserError; } });
const ERRORS = {
    TOKEN_NOT_FOUND: token_errors_1.TOKEN_NOT_FOUND,
    INVALID_TOKEN: token_errors_1.INVALID_TOKEN,
    TOKEN_EXPIRED: token_errors_1.TOKEN_EXPIRED,
    USER_NOT_ADMIN: user_errors_1.USER_NOT_ADMIN,
    USER_NOT_AUTHORIZED: user_errors_1.USER_NOT_AUTHORIZED,
    USER_NOT_FOUND: user_errors_1.USER_NOT_FOUND,
    USER_NOT_LOGGED_IN: user_errors_1.USER_NOT_LOGGED_IN,
};
exports.ERRORS = ERRORS;

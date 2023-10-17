"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenError = exports.TOKEN_EXPIRED = exports.INVALID_TOKEN = exports.TOKEN_NOT_FOUND = void 0;
const TOKEN_NOT_FOUND = {
    status: 404,
    userTitle: "Token not found",
    userMessage: "The token you are looking for does not exist",
    developerMessage: "Token not found",
    errorCode: "token/missing",
};
exports.TOKEN_NOT_FOUND = TOKEN_NOT_FOUND;
const INVALID_TOKEN = {
    status: 401,
    userTitle: "Unauthorized",
    userMessage: "The token you are using is invalid",
    developerMessage: "Token is invalid",
    errorCode: "token/invalid",
};
exports.INVALID_TOKEN = INVALID_TOKEN;
const TOKEN_EXPIRED = {
    status: 401,
    userTitle: "Unauthorized",
    userMessage: "The token you are using has expired",
    developerMessage: "Token has expired",
    errorCode: "token/expired",
};
exports.TOKEN_EXPIRED = TOKEN_EXPIRED;
var TokenError;
(function (TokenError) {
    TokenError["TOKEN_NOT_FOUND"] = "TOKEN_NOT_FOUND";
    TokenError["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    TokenError["INVALID_TOKEN"] = "INVALID_TOKEN";
})(TokenError || (exports.TokenError = TokenError = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = exports.USER_NOT_LOGGED_IN = exports.USER_NOT_AUTHORIZED = exports.USER_NOT_ADMIN = exports.USER_NOT_FOUND = void 0;
const USER_NOT_FOUND = {
    status: 404,
    userTitle: "User not found",
    userMessage: "The user you are looking for does not exist",
    developerMessage: "User not found",
    errorCode: "user/missing",
};
exports.USER_NOT_FOUND = USER_NOT_FOUND;
const USER_NOT_ADMIN = {
    status: 403,
    userTitle: "Forbidden",
    userMessage: "You are not allowed to perform this action",
    developerMessage: "User is not an admin",
    errorCode: "user/forbidden",
};
exports.USER_NOT_ADMIN = USER_NOT_ADMIN;
const USER_NOT_AUTHORIZED = {
    status: 401,
    userTitle: "Unauthorized",
    userMessage: "You are not authorized to perform this action",
    developerMessage: "User is not authorized",
    errorCode: "user/unauthorized",
};
exports.USER_NOT_AUTHORIZED = USER_NOT_AUTHORIZED;
const USER_NOT_LOGGED_IN = {
    status: 401,
    userTitle: "Unauthorized",
    userMessage: "You are not logged in",
    developerMessage: "User is not logged in",
    errorCode: "user/not-logged-in",
};
exports.USER_NOT_LOGGED_IN = USER_NOT_LOGGED_IN;
var UserError;
(function (UserError) {
    UserError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    UserError["USER_NOT_ADMIN"] = "USER_NOT_ADMIN";
    UserError["USER_NOT_AUTHORIZED"] = "USER_NOT_AUTHORIZED";
    UserError["USER_NOT_LOGGED_IN"] = "USER_NOT_LOGGED_IN";
})(UserError || (exports.UserError = UserError = {}));

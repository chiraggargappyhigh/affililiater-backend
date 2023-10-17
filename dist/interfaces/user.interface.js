"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginMethodValues = exports.UserLoginMethod = exports.UserTypeValues = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType[UserType["ADMIN"] = 0] = "ADMIN";
    UserType[UserType["AFFILIATE"] = 1] = "AFFILIATE";
})(UserType || (exports.UserType = UserType = {}));
var UserLoginMethod;
(function (UserLoginMethod) {
    UserLoginMethod["GOOGLE"] = "google";
    UserLoginMethod["EMAIL"] = "email";
})(UserLoginMethod || (exports.UserLoginMethod = UserLoginMethod = {}));
const UserTypeValues = Object.values(UserType).filter((value) => typeof value === "number");
exports.UserTypeValues = UserTypeValues;
const UserLoginMethodValues = Object.values(UserLoginMethod).filter((value) => typeof value === "string");
exports.UserLoginMethodValues = UserLoginMethodValues;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class UserController {
    constructor() {
        this.userService = new services_1.UserService();
        this.login = this.login.bind(this);
        this.update = this.update.bind(this);
        this.read = this.read.bind(this);
        this.refreshTokens = this.refreshTokens.bind(this);
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idToken, userType, loginMethod, userName } = req.body;
                const user = yield this.userService.create(idToken, userType, loginMethod, userName);
                if (!user) {
                    res.status(400).json({
                        status: "error",
                        message: "User not found",
                    });
                    return;
                }
                const accessToken = this.userService.generateAccessToken(user);
                res.status(200).json({
                    status: "success",
                    message: "User logged in successfully",
                    user,
                    accessToken,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, user: { _id: id }, } = req.body;
                const user = yield this.userService.update(id, {
                    $set: data,
                });
                if (!user)
                    throw new Error("User not found");
                const accessToken = this.userService.generateAccessToken(user);
                res.status(200).json({
                    status: "success",
                    message: "User updated successfully",
                    user,
                    accessToken,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    read(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { _id: id }, } = req.body;
                const user = yield this.userService.read(id);
                res.status(200).json({
                    status: "success",
                    message: "User retrieved successfully",
                    user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    refreshTokens(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { _id: id }, } = req.body;
                const user = yield this.userService.read(id);
                const accessToken = this.userService.generateAccessToken(user);
                res.status(200).json({
                    status: "success",
                    message: "Tokens refreshed successfully ",
                    accessToken,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;

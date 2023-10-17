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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
const interfaces_1 = require("../../interfaces");
const errors_1 = require("../../constants/errors");
class AuthMiddleware {
    constructor() {
        this.UserModel = models_1.UserModel;
        this.privateKey = fs_1.default
            .readFileSync(path_1.default.join(__dirname, "..", "..", "secrets", "private.pem"))
            .toString();
        this.publicKey = fs_1.default
            .readFileSync(path_1.default.join(__dirname, "..", "..", "secrets", "public.pem"))
            .toString();
        this.authenticate = this.authenticate.bind(this);
        this.authorize = this.authorize.bind(this);
        this.authenticatePublicWebhook = this.authenticatePublicWebhook.bind(this);
    }
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorization } = req.headers;
                if (!authorization) {
                    throw new Error(errors_1.TokenError.TOKEN_NOT_FOUND);
                }
                const token = authorization.split(" ")[1];
                if (!token) {
                    throw new Error(errors_1.TokenError.TOKEN_NOT_FOUND);
                }
                const decoded = jsonwebtoken_1.default.verify(token, this.publicKey);
                if (!decoded || typeof decoded === "string" || !(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                    throw new Error(errors_1.TokenError.INVALID_TOKEN);
                }
                const user = yield this.UserModel.findById(decoded.id);
                if (!user) {
                    throw new Error(errors_1.UserError.USER_NOT_FOUND);
                }
                if (!["GET, DELETE"].includes(req.method)) {
                    req.body = {
                        data: req.body,
                        user,
                    };
                }
                else {
                    req.body = {
                        user,
                    };
                }
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    authorize(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                if (user.userType !== interfaces_1.UserType.ADMIN) {
                    throw new Error(errors_1.UserError.USER_NOT_ADMIN);
                }
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    authenticatePublicWebhook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorization } = req.headers;
                if (!authorization) {
                    throw new Error(errors_1.TokenError.TOKEN_NOT_FOUND);
                }
                const token = authorization.split(" ")[1];
                if (!token) {
                    throw new Error(errors_1.TokenError.TOKEN_NOT_FOUND);
                }
                const decoded = jsonwebtoken_1.default.verify(token, this.publicKey, {
                    ignoreExpiration: true,
                });
                if (!decoded) {
                    throw new Error(errors_1.TokenError.INVALID_TOKEN);
                }
                req.body = {
                    data: req.body,
                };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockRequestsFroBrowser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAgent = req.headers["user-agent"];
            if (!userAgent) {
                return next();
            }
            else {
                return res.status(403).json({
                    status: "error",
                    message: "You are not allowed to access this resource from a browser",
                });
            }
        });
    }
}
exports.default = AuthMiddleware;

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
const _1 = require(".");
const interfaces_1 = require("../../interfaces");
const models_1 = require("../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const errors_1 = require("../../constants/errors");
class UserService {
    constructor() {
        this.firebaseService = _1.firebaseService;
        this.UserModel = models_1.UserModel;
        this.privateKey = fs_1.default
            .readFileSync(path_1.default.join(__dirname, "..", "..", "secrets", "private.pem"))
            .toString();
        this.publicKey = fs_1.default
            .readFileSync(path_1.default.join(__dirname, "..", "..", "secrets", "public.pem"))
            .toString();
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.read = this.read.bind(this);
        this.generateAccessToken = this.generateAccessToken.bind(this);
    }
    create(idToken, userType = interfaces_1.UserType.AFFILIATE, loginMethod = interfaces_1.UserLoginMethod.GOOGLE, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.firebaseService.getUserByIdToken(idToken);
            if (!user)
                throw new Error(errors_1.UserError.USER_NOT_FOUND);
            const existingUser = yield this.UserModel.findOne({
                firebaseUid: user.firebaseUid,
            });
            console.log(existingUser);
            if (existingUser)
                return existingUser;
            const newUser = new this.UserModel(Object.assign(Object.assign(Object.assign(Object.assign({}, user), (loginMethod === interfaces_1.UserLoginMethod.EMAIL && { name: userName })), { userType,
                loginMethod }), (userType === interfaces_1.UserType.AFFILIATE && {
                totalEarnings: 0,
                totalReferrals: 0,
                totalSales: 0,
            })));
            return yield newUser.save();
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.UserModel.findByIdAndUpdate(id, data, {
                new: true,
            });
            if (!user)
                throw new Error(errors_1.UserError.USER_NOT_FOUND);
            return user;
        });
    }
    read(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserModel.findById(id);
            if (!user)
                throw new Error(errors_1.UserError.USER_NOT_FOUND);
            return user;
        });
    }
    getIdByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.UserModel.findOne({ email }).select("_id");
            if (!userId)
                throw new Error(errors_1.UserError.USER_NOT_FOUND);
            return userId._id;
        });
    }
    generateAccessToken(user) {
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            name: user.name,
            userType: user.userType,
        }, this.privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
        });
        return token;
    }
}
exports.default = UserService;

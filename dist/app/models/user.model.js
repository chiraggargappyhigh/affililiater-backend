"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const interfaces_1 = require("../../interfaces");
const UserSchema = new mongoose_1.default.Schema({
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    userType: {
        type: Number,
        enum: interfaces_1.UserTypeValues,
        default: interfaces_1.UserType.AFFILIATE,
    },
    loginMethod: {
        type: String,
        enum: interfaces_1.UserLoginMethodValues,
        default: interfaces_1.UserLoginMethod.GOOGLE,
    },
    photoUrl: { type: String },
    totalEarnings: { type: Number, default: 0 },
    totalReferrals: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRefunds: { type: Number, default: 0 },
    totalRedeemed: { type: Number, default: 0 },
}, { timestamps: true });
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;

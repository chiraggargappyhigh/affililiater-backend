"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const interfaces_1 = require("../../interfaces");
const ProductSchema = new mongoose_1.default.Schema({
    members: [
        {
            user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
            role: {
                type: Number,
                enum: interfaces_1.ProductRoleValues,
                default: interfaces_1.ProductRole.MEMBER,
            },
            permissions: [
                {
                    type: Number,
                    enum: interfaces_1.ProductPermissionValues,
                    default: interfaces_1.ProductPermission.READ,
                },
            ],
        },
    ],
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String },
    urls: {
        home: { type: String, required: true },
        privacyPolicy: { type: String, required: true },
        termsOfService: { type: String, required: true },
        redirect: { type: String, required: true },
    },
    contactEmail: { type: String, required: true },
    defaultConfig: {
        couponDiscount: { type: Number, default: 0 },
        commissions: { type: Object, default: {} },
        bufferDays: { type: Number, default: 0 },
    },
    stripeKey: { type: String, required: true },
    promotionalAssets: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Asset" }],
}, { timestamps: true });
const ProductModel = mongoose_1.default.model("Product", ProductSchema);
exports.default = ProductModel;

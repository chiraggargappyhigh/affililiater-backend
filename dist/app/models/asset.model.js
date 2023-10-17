"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const interfaces_1 = require("../../interfaces");
const assetSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    type: {
        type: Number,
        enum: interfaces_1.AssetTypeValues,
        default: interfaces_1.AssetType.IMAGE,
    },
    theme: {
        type: Number,
        enum: interfaces_1.AssetThemeValues,
        default: interfaces_1.AssetTheme.ALL,
    },
    dimensions: {
        width: { type: Number },
        height: { type: Number },
        unit: { type: String },
    },
}, { timestamps: true });
const AssetModel = mongoose_1.default.model("Asset", assetSchema);
exports.default = AssetModel;

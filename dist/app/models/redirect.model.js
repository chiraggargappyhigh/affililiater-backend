"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const redirectSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    referredFrom: { type: String, required: true },
    referredTo: { type: String, required: true },
    codeApplied: { type: String, default: null },
}, { timestamps: true });
const RedirectModel = mongoose_1.default.model("Redirect", redirectSchema);
exports.default = RedirectModel;

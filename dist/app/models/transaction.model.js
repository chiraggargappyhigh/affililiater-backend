"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const interfaces_1 = require("../../interfaces");
const transactionSchema = new mongoose_1.default.Schema({
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
    stripeProductId: { type: String, required: true },
    paymentIntentId: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    codeUsed: { type: String, index: true, required: true },
    sale: {
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
    },
    commission: {
        amount: { type: Number, required: true },
        amountInUsd: { type: Number, required: true },
        percent: { type: Number, required: true },
    },
    status: {
        type: Number,
        enum: interfaces_1.TransactionStatusValues,
        default: interfaces_1.TransactionStatus.Created,
    },
}, { timestamps: true });
const TransactionModel = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = TransactionModel;

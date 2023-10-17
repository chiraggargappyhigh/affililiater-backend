"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const affiliateSchema = new mongoose_1.default.Schema({
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
    config: {
        couponDiscount: { type: Number, default: 0 },
        commissions: { type: Object, default: {} },
        bufferDays: { type: Number, default: 0 },
    },
    promotionDetails: {
        code: { type: String, index: true, unique: true },
        codeId: { type: String, index: true, unique: true },
        defaultLink: { type: String, index: true, unique: true },
        extraLinks: [
            {
                type: String,
                index: true,
            },
        ],
    },
    earnings: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    refunds: { type: Number, default: 0 },
    payout: {
        paypalEmail: { type: String },
        lastPayout: { type: Date },
        nextPayout: { type: Date },
    },
    payment: {
        redeemable: { type: Number, default: 0 },
        totalRedeemed: { type: Number, default: 0 },
        lastRedeemed: { type: Number, default: 0 },
        inBuffer: { type: Number, default: 0 },
    },
}, { timestamps: true });
const AffiliateModel = mongoose_1.default.model("Affiliate", affiliateSchema);
exports.default = AffiliateModel;

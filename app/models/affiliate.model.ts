import mongoose from "mongoose";
import { AffiliateDocument } from "../../interfaces";

const affiliateSchema = new mongoose.Schema<AffiliateDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
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
      paypalName: { type: String },
    },
    payment: {
      redeemable: { type: Number, default: 0 },
      totalRedeemed: { type: Number, default: 0 },
      lastRedeemed: { type: Date },
      inBuffer: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const AffiliateModel = mongoose.model<AffiliateDocument>(
  "Affiliate",
  affiliateSchema
);

export default AffiliateModel;

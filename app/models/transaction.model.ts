import mongoose from "mongoose";
import {
  Transaction,
  TransactionStatusValues,
  TransactionStatus,
} from "../../interfaces";

const transactionSchema = new mongoose.Schema<Transaction>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    stripeProductId: { type: String },
    stripePriceId: { type: String },
    subscriptionId: { type: String },
    paymentIntentId: {
      type: String,
      index: true,
      unique: true,
    },
    codeUsed: { type: String, index: true },
    linkId: { type: String, index: true },
    sale: {
      amount: { type: Number },
      currency: { type: String },
    },
    commission: {
      amount: { type: Number },
      amountInUsd: { type: Number },
      percent: { type: Number },
    },
    status: {
      type: Number,
      enum: TransactionStatusValues,
      default: TransactionStatus.Created,
    },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model<Transaction>(
  "Transaction",
  transactionSchema
);

export default TransactionModel;

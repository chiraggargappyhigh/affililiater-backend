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
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stripeProductId: { type: String, required: true },
    stripePriceId: { type: String, required: true },
    paymentIntentId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    codeUsed: { type: String, index: true },
    linkId: { type: String, index: true },
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

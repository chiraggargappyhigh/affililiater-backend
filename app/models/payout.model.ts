import mongoose from "mongoose";
import {
  PayoutDocument,
  PayoutStatusValues,
  PayoutStatus,
} from "../../interfaces/payout.interface";

const PayoutSchema = new mongoose.Schema<PayoutDocument>(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    status: {
      type: String,
      required: true,
      enum: [...PayoutStatusValues],
      default: PayoutStatus.REQUESTED,
    },
    payPalBatchId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PayoutModel = mongoose.model<PayoutDocument>("Payout", PayoutSchema);

export default PayoutModel;

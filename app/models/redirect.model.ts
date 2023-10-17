import mongoose from "mongoose";
import { Redirect } from "../../interfaces";

const redirectSchema = new mongoose.Schema<Redirect>(
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
    referredFrom: { type: String, required: true },
    referredTo: { type: String, required: true },
    codeApplied: { type: String, default: null },
  },
  { timestamps: true }
);

const RedirectModel = mongoose.model<Redirect>("Redirect", redirectSchema);

export default RedirectModel;

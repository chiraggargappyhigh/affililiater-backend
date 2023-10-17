import mongoose from "mongoose";
import {
  AssetDocument,
  AssetTheme,
  AssetThemeValues,
  AssetType,
  AssetTypeValues,
} from "../../interfaces";

const assetSchema = new mongoose.Schema<AssetDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    type: {
      type: Number,
      enum: AssetTypeValues,
      default: AssetType.IMAGE,
    },
    theme: {
      type: Number,
      enum: AssetThemeValues,
      default: AssetTheme.ALL,
    },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
      unit: { type: String },
    },
  },
  { timestamps: true }
);

const AssetModel = mongoose.model<AssetDocument>("Asset", assetSchema);

export default AssetModel;

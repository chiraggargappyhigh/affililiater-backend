import mongoose from "mongoose";
import {
  ProductDocument,
  ProductPermissionValues,
  ProductRoleValues,
  ProductPermission,
  ProductRole,
} from "../../interfaces";

const ProductSchema = new mongoose.Schema<ProductDocument>(
  {
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: Number,
          enum: ProductRoleValues,
          default: ProductRole.MEMBER,
        },
        permissions: [
          {
            type: Number,
            enum: ProductPermissionValues,
            default: ProductPermission.READ,
          },
        ],
      },
    ],
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String },
    urls: {
      home: { type: String, required: true },
      privacyPolicy: { type: String, required: true },
      termsOfService: { type: String, required: true },
      redirect: { type: String, required: true },
    },
    contactEmail: { type: String, required: true },
    defaultConfig: {
      couponDiscount: { type: Number, default: 0 },
      commissions: { type: Object, default: {} },
      bufferDays: { type: Number, default: 0 },
    },
    stripeKey: { type: String, required: true },
    promotionalAssets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Asset" }],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model<ProductDocument>("Product", ProductSchema);

export default ProductModel;

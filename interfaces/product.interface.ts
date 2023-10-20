import { Document } from "mongoose";
import { UserDocument, User } from "./user.interface";
import { Asset, AssetDocument } from "./assets.interface";
import Stripe from "stripe";
enum ProductRole {
  ADMIN = 0,
  MEMBER = 1,
}

enum ProductPermission {
  READ = 0,
  WRITE = 1,
  DELETE = 2,
}

interface Product {
  members: Array<{
    user: string | Partial<User> | Partial<UserDocument>;
    role: ProductRole;
    permissions: Array<ProductPermission>;
  }>;
  name: string;
  description: string;
  logo?: string;
  urls: {
    home: string;
    privacyPolicy: string;
    termsOfService: string;
    redirect: string;
  };
  contactEmail: string;
  defaultConfig: {
    couponDiscount: number;
    commissions: {
      [stripeProductId: string]: number;
    };
    bufferDays: number;
  };
  stripeKey: string;
  stripeProducts?: Array<{
    name: string;
    description: string | null;
    image?: string;
    prices?: {
      interval: string | null;
      prices: {
        [currency: string]: number;
      };
      name?: string;
    }[];
    commission?: number;
  }>;
  promotionalAssets: Array<string | Partial<Asset> | Partial<AssetDocument>>;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductDocument extends Product, Document {}

const ProductRoleValues = Object.values(ProductRole).filter(
  (value) => typeof value === "number"
);

const ProductPermissionValues = Object.values(ProductPermission).filter(
  (value) => typeof value === "number"
);

export {
  Product,
  ProductDocument,
  ProductRole,
  ProductRoleValues,
  ProductPermission,
  ProductPermissionValues,
};

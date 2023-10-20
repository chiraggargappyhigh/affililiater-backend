import { Document } from "mongoose";
import { UserDocument, User } from "./user.interface";
import { ProductDocument, Product } from "./product.interface";

interface Affiliate {
  user: string | Partial<User> | Partial<UserDocument>;
  product: string | Partial<Product> | Partial<ProductDocument>;
  config: {
    couponDiscount: number;
    commissions: {
      [stripeProductId: string]: number;
    };
    bufferDays: number;
  };
  promotionDetails: {
    code: string;
    codeId: string;
    defaultLink: string;
    extraLinks: string[];
  };
  earnings: number;
  referrals: number;
  sales: number;
  refunds: number;
  payout: {
    paypalEmail: string;
    paypalName: string;
  };
  payment: {
    redeemable: number;
    totalRedeemed: number;
    lastRedeemed: Date;
    inBuffer: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface AffiliateDocument extends Affiliate, Document {}

export { Affiliate, AffiliateDocument };

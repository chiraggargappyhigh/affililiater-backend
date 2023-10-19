import { Document } from "mongoose";
import { User, UserDocument } from "./user.interface";
import { Product, ProductDocument } from "./product.interface";

enum TransactionStatus {
  Created = 0,
  REDEEMABLE = 1,
  REDEEMED = 2,
  REFUNDED = 3,
}

interface Transaction {
  user: string | Partial<User> | Partial<UserDocument>;
  product: string | Partial<Product> | Partial<ProductDocument>;
  stripeProductId: string;
  paymentIntentId: string;
  codeUsed: string;
  stripeProduct?: {
    name: string;
    description: string;
    image?: string;
    interval?: string;
  };
  sale: {
    amount: number;
    currency: string;
  };
  commission: {
    amount: number;
    amountInUsd: number;
    percent: number;
  };
  status: TransactionStatus;
}

interface TransactionDocument extends Transaction, Document {}

interface TransactionPayload {
  code: string;
  stripeProductId: string;
  paymentIntentId: string;
  linkId?: string;
  sale: {
    amount: number;
    currency: string;
  };
}

const TransactionStatusValues = Object.values(TransactionStatus).filter(
  (value) => typeof value === "number"
);

export {
  Transaction,
  TransactionDocument,
  TransactionPayload,
  TransactionStatusValues,
  TransactionStatus,
};

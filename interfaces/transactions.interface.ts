import { Document } from "mongoose";
import { User, UserDocument } from "./user.interface";
import { Product, ProductDocument } from "./product.interface";

enum TransactionStatus {
  Created = 0,
  COMMISSION_ALLOCATED = 1,
  REDEEMABLE = 2,
  REDEEMED = 3,
  REFUNDED = 4,
}

interface Transaction {
  user: string | Partial<User> | Partial<UserDocument>;
  product: string | Partial<Product> | Partial<ProductDocument>;
  stripeProductId: string;
  stripePriceId: string;
  paymentIntentId: string;
  subscriptionId: string;
  codeUsed?: string;
  linkId?: string;
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

interface CreateTransactionPayload {
  subscriptionId: string;
  refId: string;
}

interface TransactionPayload {
  code: string;
  subscriptionId: string;
  stripeProductId: string;
  stripePriceId: string;
  paymentIntentId: string;
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
  CreateTransactionPayload,
};

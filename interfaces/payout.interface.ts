import { Document } from "mongoose";
import { Affiliate, AffiliateDocument } from "./affiliate.interface";

enum PayoutStatus {
  REQUESTED = "REQUESTED",
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  DENIED = "DENIED",
  UNCLAIMED = "UNCLAIMED",
  RETURNED = "RETURNED",
  ONHOLD = "ONHOLD",
  BLOCKED = "BLOCKED",
  REFUNDED = "REFUNDED",
  REVERSED = "REVERSED",
}
interface Payout {
  affiliate: string | Partial<Affiliate> | Partial<AffiliateDocument>;
  amount: number;
  currency: string;
  status: PayoutStatus;
  payPalBatchId: string;
  payPalSenderBatchId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PayoutDocument extends Payout, Document {}

const PayoutStatusValues = new Set(Object.values(PayoutStatus));

export { Payout, PayoutDocument, PayoutStatus, PayoutStatusValues };

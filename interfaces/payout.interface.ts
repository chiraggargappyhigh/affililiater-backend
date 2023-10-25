import { Document } from "mongoose";
import { Affiliate, AffiliateDocument } from "./affiliate.interface";
interface Payout {
  affiliate: string | Partial<Affiliate> | Partial<AffiliateDocument>;
  amount: number;
}

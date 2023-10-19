import { Document } from "mongoose";
import { User, UserDocument } from "./user.interface";
import { Product, ProductDocument } from "./product.interface";

interface Redirect {
  user: string | Partial<User> | Partial<UserDocument>;
  product: string | Partial<Product> | Partial<ProductDocument>;
  referredFrom: string;
  referredTo: string;
  codeApplied: string | null;
}

interface RedirectDocument extends Redirect, Document {}

interface RedirectPayload {
  referredFrom: string;
  referredTo: string;
  user: string;
  product: string;
}

export { Redirect, RedirectDocument, RedirectPayload };

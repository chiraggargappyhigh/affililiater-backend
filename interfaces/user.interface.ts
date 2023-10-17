import { Document } from "mongoose";

enum UserType {
  ADMIN = 0,
  AFFILIATE = 1,
}

enum UserLoginMethod {
  GOOGLE = "google",
  EMAIL = "email",
}

interface User {
  firebaseUid: string;
  email: string;
  name: string;
  userType: UserType;
  loginMethod: UserLoginMethod;
  photoUrl?: string;
  totalEarnings: number;
  totalReferrals: number;
  totalSales: number;
  totalRefunds: number;
  totalRedeemed: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDocument extends User, Document {}

const UserTypeValues = Object.values(UserType).filter(
  (value) => typeof value === "number"
);

const UserLoginMethodValues = Object.values(UserLoginMethod).filter(
  (value) => typeof value === "string"
);

export {
  User,
  UserDocument,
  UserType,
  UserTypeValues,
  UserLoginMethod,
  UserLoginMethodValues,
};

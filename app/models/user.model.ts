import mongoose from "mongoose";
import {
  UserDocument,
  UserTypeValues,
  UserLoginMethodValues,
  UserLoginMethod,
  UserType,
} from "../../interfaces";

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    userType: {
      type: Number,
      enum: UserTypeValues,
      default: UserType.AFFILIATE,
    },
    loginMethod: {
      type: String,
      enum: UserLoginMethodValues,
      default: UserLoginMethod.GOOGLE,
    },
    photoUrl: { type: String },
    totalEarnings: { type: Number, default: 0 },
    totalReferrals: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRefunds: { type: Number, default: 0 },
    totalRedeemed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;

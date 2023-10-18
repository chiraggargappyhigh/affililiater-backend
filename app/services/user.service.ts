import { firebaseService, FirebaseService } from ".";
import { UserDocument, UserType, UserLoginMethod } from "../../interfaces";
import { UserModel } from "../models";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { UserError } from "../../constants/errors";
import { QueryOptions } from "mongoose";

class UserService {
  private firebaseService: FirebaseService;
  private UserModel: typeof UserModel;
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.firebaseService = firebaseService;
    this.UserModel = UserModel;
    this.privateKey = fs
      .readFileSync(path.join(__dirname, "..", "..", "secrets", "private.pem"))
      .toString();
    this.publicKey = fs
      .readFileSync(path.join(__dirname, "..", "..", "secrets", "public.pem"))
      .toString();

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.read = this.read.bind(this);
    this.generateAccessToken = this.generateAccessToken.bind(this);
  }

  public async create(
    idToken: string,
    userType: UserType = UserType.AFFILIATE,
    loginMethod: UserLoginMethod = UserLoginMethod.GOOGLE,
    userName?: string
  ) {
    const user = await this.firebaseService.getUserByIdToken(idToken);
    if (!user) throw new Error(UserError.USER_NOT_FOUND);
    const existingUser = await this.UserModel.findOne({
      firebaseUid: user.firebaseUid,
    });
    console.log(existingUser);
    if (existingUser) return existingUser;
    const newUser: UserDocument = new this.UserModel({
      ...user,
      ...(loginMethod === UserLoginMethod.EMAIL && { name: userName }),
      userType,
      loginMethod,
      ...(userType === UserType.AFFILIATE && {
        totalEarnings: 0,
        totalReferrals: 0,
        totalSales: 0,
      }),
    });
    return await newUser.save();
  }

  public async update(id: string, data: QueryOptions<UserDocument>) {
    const user = this.UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!user) throw new Error(UserError.USER_NOT_FOUND);
    return user;
  }

  public async read(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) throw new Error(UserError.USER_NOT_FOUND);
    return user;
  }

  public async getIdByEmail(email: string) {
    const userId = await this.UserModel.findOne({ email }).select("_id");
    if (!userId) throw new Error(UserError.USER_NOT_FOUND);
    return userId._id;
  }

  public generateAccessToken(user: UserDocument) {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      },
      this.privateKey,
      {
        algorithm: "RS256",
      }
    );

    return token;
  }
}

export default UserService;

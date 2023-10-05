/**
 * auth.js
 * @description :: functions used in authentication
 */

const { OAuth2Client } = require("google-auth-library");
const FireBaseAdmin = require("../config/firebaseAdmin");
const User = require("../models/user");
const dbService = require("../utils/dbService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
/**
 * @description : generate JWT token for authentication.
 * @param {Object} user : user who wants to login.
 * @param {string} secret : secret for JWT.
 * @return {string}  : returns JWT token.
 */
const generateToken = (user, secret) => {
  return jwt.sign(user, secret, { algorithm: "RS256" });
};

const verifyGoogleOneTap = async (token) => {
  const payload = await FireBaseAdmin.admin.auth().verifyIdToken(token);
  console.log(payload);
  const { name, email, picture } = payload;
  return {
    name,
    email,
    picture,
  };
};

const changePassword = async (params) => {
  try {
    let password = params.newPassword;
    let oldPassword = params.oldPassword;
    let where = {
      _id: params.userId,
      isActive: true,
      isDeleted: false,
    };
    let user = await dbService.findOne(User, where);
    if (user && user.id) {
      let isPasswordMatch = await user.isPasswordMatch(oldPassword);
      if (!isPasswordMatch) {
        return {
          flag: true,
          data: "Incorrect old password",
        };
      }
      password = await bcrypt.hash(password, 8);
      let updatedUser = dbService.updateOne(User, where, {
        password: password,
      });
      if (updatedUser) {
        return {
          flag: false,
          data: "Password changed successfully",
        };
      }
      return {
        flag: true,
        data: "password can not changed due to some error.please try again",
      };
    }
    return {
      flag: true,
      data: "User not found",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  generateToken,
  verifyGoogleOneTap,
};

/**
 * authConstant.js
 * @description :: constants used in authentication
 */

const GOOGLE_AUTH_API = 'https://oauth2.googleapis.com/tokeninfo';

const USER_TYPES = {
  User: 1,
};

const PLATFORM = {
  APP: 1,
};

const LOGIN_TYPE = {
  GOOGLE: 'GOOGLE',
  OTP: 'OTP',
  PASSWORD: 'PASSWORD',
  APPLE: 'APPLE',
  MAGIC_LINK: 'MAGIC_LINK',
};

const PROFESSION = {
  STUDENT: 'STUDENT',
  BUSINESS: 'BUSINESS',
  HOMEMAKER: 'HOMEMAKER',
  PROFESSIONAL: 'PROFESSIONAL',
  OTHER: 'OTHER',
};

const LOGIN_PLATFORM = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
  WEB: 'WEB',
};

const TYPE_USER = {
  FREE: 'FREE',
  CREATOR: 'CREATOR',
  ENTERPRISE: 'ENTERPRISE',
};

let LOGIN_ACCESS = {
  [USER_TYPES.User]: [PLATFORM.APP],
};

const MAX_LOGIN_RETRY_LIMIT = 3;
const LOGIN_REACTIVE_TIME = 20;

const FORGOT_PASSWORD_WITH = {
  LINK: {
    email: true,
    sms: false,
  },
  EXPIRE_TIME: 20,
};

module.exports = {
  USER_TYPES,
  PLATFORM,
  MAX_LOGIN_RETRY_LIMIT,
  LOGIN_REACTIVE_TIME,
  FORGOT_PASSWORD_WITH,
  LOGIN_ACCESS,
  PROFESSION,
  TYPE_USER,
  LOGIN_PLATFORM,
  LOGIN_TYPE,
  GOOGLE_AUTH_API,
};

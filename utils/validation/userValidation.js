/**
 * userValidation.js
 * @description :: validate each post and put request as per user model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');
const authConstantDefault = require('../../constants/authConstant');    
const { USER_TYPES } = require('../../constants/authConstant');
const { convertObjectToEnum } = require('../common');   

/** validation keys and properties of user */
exports.schemaKeys = joi.object({
  email: joi.string().allow(null).allow(''),
  name: joi.string().allow(null).allow(''),
  userType: joi.number().allow(0),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  phone: joi.number().integer().allow(0),
  countryCode: joi.string().allow(null).allow(''),
  avatar: joi.string().allow(null).allow(''),
  isIndividual: joi.boolean(),
  available_credits: joi.object({
    one_time:joi.number().integer(),
    subscription:joi.number().integer()
  }).allow(0),
  mobileNo: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  username: joi.string().allow(null).allow(''),
  resetPasswordLink: joi.object({
    code:joi.string(),
    expireTime:joi.date().options({ convert: true })
  })
}).unknown(true);

/** validation keys and properties of user for updation */
exports.updateSchemaKeys = joi.object({
  email: joi.string().allow(null).allow(''),
  name: joi.string().allow(null).allow(''),
  userType: joi.number().allow(0),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  phone: joi.number().integer().allow(0),
  countryCode: joi.string().allow(null).allow(''),
  avatar: joi.string().allow(null).allow(''),
  isIndividual: joi.boolean(),
  available_credits: joi.object({
    one_time:joi.number().integer(),
    subscription:joi.number().integer()
  }).allow(0),
  mobileNo: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  username: joi.string().allow(null).allow(''),
  resetPasswordLink: joi.object({
    code:joi.string(),
    expireTime:joi.date().options({ convert: true })
  }),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of user for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      email: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      phone: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      countryCode: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      avatar: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isIndividual: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      available_credits: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      mobileNo: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      password: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      username: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

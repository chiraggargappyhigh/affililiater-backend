/**
 * purchaseValidation.js
 * @description :: validate each post and put request as per purchase model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of purchase */
exports.schemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  product_id: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  payment_id: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  has_expiry: joi.boolean(),
  total_credits: joi.number().integer().allow(0),
  user_id: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  credits: joi.number().integer().allow(0)
}).unknown(true);

/** validation keys and properties of purchase for updation */
exports.updateSchemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  product_id: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  payment_id: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  has_expiry: joi.boolean(),
  total_credits: joi.number().integer().allow(0),
  user_id: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  credits: joi.number().integer().allow(0),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of purchase for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      product_id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      payment_id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      has_expiry: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      total_credits: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      user_id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      credits: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

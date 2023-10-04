/**
 * paymentValidation.js
 * @description :: validate each post and put request as per payment model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of payment */
exports.schemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  user: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  product: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  paymentAmount: joi.number().integer().allow(0),
  paymentType: joi.string().allow(null).allow(''),
  priceId: joi.string().allow(null).allow(''),
  subscriptionType: joi.string().allow(null).allow(''),
  paymentStatus: joi.string().allow(null).allow(''),
  data: joi.any(),
  currency: joi.string().allow(null).allow('')
}).unknown(true);

/** validation keys and properties of payment for updation */
exports.updateSchemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  user: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  product: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  paymentAmount: joi.number().integer().allow(0),
  paymentType: joi.string().allow(null).allow(''),
  priceId: joi.string().allow(null).allow(''),
  subscriptionType: joi.string().allow(null).allow(''),
  paymentStatus: joi.string().allow(null).allow(''),
  data: joi.any(),
  currency: joi.string().allow(null).allow(''),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of payment for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      user: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      product: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      paymentAmount: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      paymentType: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      priceId: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      subscriptionType: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      paymentStatus: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      data: joi.alternatives().try(joi.array().items(),joi.any(),joi.object()),
      currency: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

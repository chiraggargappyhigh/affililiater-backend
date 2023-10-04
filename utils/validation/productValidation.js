/**
 * productValidation.js
 * @description :: validate each post and put request as per product model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of product */
exports.schemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  name: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  type: joi.string().allow(null).allow(''),
  hasValidity: joi.boolean(),
  validity_in_days: joi.number().integer().allow(0),
  grace: joi.number().integer().allow(0),
  cost: joi.number().integer().allow(0),
  total_credits: joi.number().integer().allow(0),
  credits_add_frequency: joi.number().integer().allow(0),
  credits_count_per_frequency: joi.number().integer().allow(0)
}).unknown(true);

/** validation keys and properties of product for updation */
exports.updateSchemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  name: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  type: joi.string().allow(null).allow(''),
  hasValidity: joi.boolean(),
  validity_in_days: joi.number().integer().allow(0),
  grace: joi.number().integer().allow(0),
  cost: joi.number().integer().allow(0),
  total_credits: joi.number().integer().allow(0),
  credits_add_frequency: joi.number().integer().allow(0),
  credits_count_per_frequency: joi.number().integer().allow(0),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of product for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      description: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      type: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      hasValidity: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      validity_in_days: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      grace: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      cost: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      total_credits: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      credits_add_frequency: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      credits_count_per_frequency: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

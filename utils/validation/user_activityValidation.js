/**
 * user_activityValidation.js
 * @description :: validate each post and put request as per user_activity model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of user_activity */
exports.schemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  user: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  activity_id: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  activity_type: joi.string().allow(null).allow(''),
  credits_cost: joi.number().integer().allow(0),
  acitivty_date: joi.date().options({ convert: true }).allow(null).allow('')
}).unknown(true);

/** validation keys and properties of user_activity for updation */
exports.updateSchemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  user: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  activity_id: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  activity_type: joi.string().allow(null).allow(''),
  credits_cost: joi.number().integer().allow(0),
  acitivty_date: joi.date().options({ convert: true }).allow(null).allow(''),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of user_activity for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      user: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      activity_id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      activity_type: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      credits_cost: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      acitivty_date: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

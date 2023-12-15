const Joi = require('joi');
const { objectId } = require('./custom.validation');

const generateReward = {
  body: Joi.object().keys({
    description: Joi.string(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const transferReward = {
  params: Joi.object().keys({
    rewardId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    description: Joi.string(),
  }),
};

const reedemReward = {
  params: Joi.object().keys({
    rewardId: Joi.string().custom(objectId),
  }),
};

const fetchUsersReward = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = { generateReward, transferReward, reedemReward, fetchUsersReward };

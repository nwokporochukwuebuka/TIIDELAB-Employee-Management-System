const httpStatus = require('http-status');
const { Rewards } = require('../models');
const ApiError = require('../utils/ApiError');

const createReward = async (rewardBody) => {
  return await Rewards.create(rewardBody);
};

const bulkCreateReward = async (body) => {
  return await Rewards.insertMany(body);
};

const fetchAllRewardsForAnOrganization = async (organizationId, status) => {
  if (status) {
    return await Rewards.find({ organizationId: organizationId, status: status });
  } else {
    return await Rewards.find({ organizationId: organizationId });
  }
};

const fetchAllUsersRewards = async (userId, status) => {
  if (status) {
    return await Rewards.find({ recipientId: userId, status: status });
  }
  return await Rewards.find({ recipientId: userId });
};

const updateRewardStatus = async (organizationId, userId, rewardCode, status) => {
  const reward = await Rewards.find({ organizationId: organizationId, recipientId: userId, rewardCode: rewardCode });
  if (!reward) throw new ApiError(httpStatus.NOT_FOUND, 'Reward does not exist!');
  Object.assign(reward, status);
  await reward.save();
  return reward;
};

module.exports = {
  createReward,
  fetchAllRewardsForAnOrganization,
  fetchAllUsersRewards,
  updateRewardStatus,
  fetchAllUsersRewards,
  bulkCreateReward,
};

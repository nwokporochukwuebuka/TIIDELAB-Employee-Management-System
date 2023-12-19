const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { userService, rewarderServices, organizationService, staffService } = require('../services');
const { rewardStatus } = require('../config/reward-status');

function generateAlphanumericCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

const generateReward = catchAsync(async (req, res) => {
  const organization = await organizationService.fetchOrganizationByUserId(req.user.id);
  console.log(organization);
  const staff = await staffService.getStaffByUserId(req.params.userId);
  console.log(staff);
  const user = await userService.getUserById(req.params.userId);

  const reward = await rewarderServices.createReward({
    organizationId: organization.id,
    organizationCode: organization.organizationCode,
    rewarderId: req.user.id,
    description: req.body.description,
    recipientId: req.params.userId,
    rewardCode: generateAlphanumericCode(7),
    rewarderName: req.user.name,
    recipientName: user.name,
  });

  console.log(reward);

  let updatedOrganization;
  if (reward) {
    updatedOrganization = await organizationService.updateOrganization(organization.id, {
      numberOfRewardsGenerated: +organization.numberOfRewardsGenerated + 1,
    });
    await staffService.updateStaff(staff.id, { rewardsReceived: +staff.rewardsReceived + 1 });
  }
  return res.status(200).send({ reward, updatedOrganization });
});

const bulkGenerateReward = catchAsync(async (req, res) => {
  const rewardBody = [];

  const organizationId = req.body.organizationId;

  const organization = await organizationService.fetchOrganizationById(organizationId);
  const rewarderId = req.user.id;
  const rewarderName = req.user.name;

  req.body.userIds.forEach(async (userId) => {
    const rewardCode = generateAlphanumericCode(7);
    const description = req.body.description;
    const recipient = await userService.getUserById(userId);
    const recipientName = recipient.name;

    const eachRewardBody = {
      organizationId,
      organizationCode: organization.organizationCode,
      rewarderId,
      description,
      recipientId: userId,
      rewardCode,
      rewarderName,
      recipientName,
    };

    console.log('=========== rewards to be added =========');
    return rewardBody.push(eachRewardBody);
  });

  const bulkReward = await rewarderServices.bulkCreateReward(rewardBody);

  return res.status(200).send({ status: true, message: 'success', data: bulkReward });
});

const transferReward = catchAsync(async (req, res) => {
  const reward = await rewarderServices.fetchRewardById(req.params.rewardId);
  if (!reward) {
    return res.status(httpStatus.NOT_FOUND).send({ status: false, message: 'User does not have a reward' });
  }
  if (reward.status === rewardStatus.REDEEMED || reward.status === rewardStatus.TRANSFERRED) {
    return res.status(400).send({ status: false, message: `This reward has been ${reward.status} already` });
  }
  const user = await userService.getUserById(req.body.userId);
  const staff = await staffService.getStaffByUserId(req.user.id); // this is the rewarder

  // this is showing that the ereward has been transferred, so we will have to create a new one
  const updateReward = await rewarderServices.updateRewardStatus(reward.organizationId, req.user.id, reward.rewardCode, {
    status: rewardStatus.TRANSFERRED,
  });

  // now let's create a new reward
  await rewarderServices.createReward({
    orgainzationId: staff.organizationId,
    organizationCode: staff.organizationCode,
    status: rewardStatus.RECEIVED,
    rewarderId: req.user.id,
    description: req.body.description,
    recipientId: req.body.userId,
    rewardCode: reward.rewardCode,
    rewarderName: req.user.name,
    recipientName: user.name,
  });

  await staffService.updateStaff(staff.id, { rewardsTransferred: staff.rewardsTransferred + 1 });

  const rewardedStaff = await staffService.getStaffByUserId(req.body.userId);

  await staffService.updateStaff(rewardedStaff.id, { rewardsReceived: rewardedStaff.rewardsReceived + 1 });

  return res.status(200).send({ updateReward, staff });
});

const reedemReward = catchAsync(async (req, res) => {
  const reward = await rewarderServices.fetchRewardById(req.params.rewardId);
  console.log('reward', reward);
  if (!reward) {
    return res.status(404).json({ status: false, message: `Reward not found` });
  }

  if (reward.status === rewardStatus.REDEEMED || reward.status === rewardStatus.TRANSFERRED) {
    return res.status(400).json({ status: false, message: `This reward has been ${reward.status} already` });
  }
  const staff = await staffService.getStaffByUserId(req.user.id);
  const organization = await organizationService.fetchOrganizationById(staff.organizationId);
  console.log('organization', organization);

  const updatedReward = await rewarderServices.updateRewardStatus(organization.id, req.user.id, reward.rewardCode, {
    status: rewardStatus.REDEEMED,
  });
  const updatedOrganization = await organizationService.updateOrganization(organization.id, {
    numberOfRewardsRedeemed: organization.numberOfRewardsRedeemed + 1,
  });

  await staffService.updateStaff(staff.id, { rewardsRedeemed: staff.rewardsRedeemed + 1 });

  return res.status(200).send({ updatedReward, updatedOrganization, staff });
});

const fetchReward = catchAsync(async (req, res) => {
  const reward = await rewarderServices.fetchRewardById(req.params.rewardId);
  if (!reward) return res.status(404).json({ status: true, reward });
});

const fetchUsersReward = catchAsync(async (req, res) => {
  const rewards = await rewarderServices.fetchAllUsersRewards(
    req.user.role === 'staff' ? req.user.id : req.params.userId,
    req.query.status
  );
  return res.status(200).json({ rewards });
});

const fetchOrganizationReward = catchAsync(async (req, res) => {
  const rewards = await rewarderServices.fetchAllRewardsForAnOrganization(req.params.orgainzationId);
  return res.status(200).json({ rewards });
});

module.exports = {
  generateReward,
  bulkGenerateReward,
  transferReward,
  reedemReward,
  fetchUsersReward,
  fetchOrganizationReward,
  fetchReward,
};

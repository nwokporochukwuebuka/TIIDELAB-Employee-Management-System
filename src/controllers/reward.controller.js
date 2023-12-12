const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

function generateAlphanumericCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

const generateReward = catchAsync(async (req, res) => {});

const bulkGenerateReward = catchAsync(async (req, res) => {
  const rewardBody = [];
  const organizationId = req.body.organizationId;
  const rewarderId = req.user.id;
  const rewarderName = req.user.name;

  req.body.userIds.map(async (userId) => {
    const rewardCode = generateAlphanumericCode(7);
    const description = req.body.description;
    const recipientId = userId;
    // const recipientName = await
  });
});

const transferReward = catchAsync(async (req, res) => {});

module.exports = {
  generateReward,
  bulkGenerateReward,
  transferReward,
};

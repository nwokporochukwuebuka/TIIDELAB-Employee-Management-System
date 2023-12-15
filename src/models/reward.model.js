const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { rewardStatus } = require('../config/reward-status');

async function generateRewardCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

const rewardSchema = mongoose.Schema(
  {
    orgainzationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
    },
    organizationCode: {
      type: String,
    },
    status: {
      type: String,
      enum: [rewardStatus.RECEIVED, rewardStatus.REDEEMED, rewardStatus.TRANSFERRED],
      default: rewardStatus.RECEIVED,
    },
    rewarderId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      required: false,
    },

    recipientId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },

    rewardCode: {
      type: String,
      required: true,
    },

    rewarderName: {
      type: String,
    },
    recipientName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

rewardSchema.plugin(toJSON);
rewardSchema.plugin(paginate);

/* 

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
 */

/* rewardSchema.pre('save', async (next) => {
  const reward = this;

  if (reward.isModified('rewardCode')) {
    reward.rewardCode = await generateRewardCode(7);
  }
  next();
}); */

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;

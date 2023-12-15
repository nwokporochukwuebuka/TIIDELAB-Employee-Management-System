const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const organizationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationCode: {
      type: String,
    },
    numberOfEmployees: {
      type: Number,
    },
    numberOfRewardsGenerated: {
      type: Number,
    },
    numberOfRewardsRedeemed: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);

organizationSchema.statics.isCodeTaken = async function (code, excludeUserId) {
  const organization = await this.findOne({ organizationCode: code, _id: { $ne: excludeUserId } });
  return !!organization;
};

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;

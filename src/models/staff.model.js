const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const staffSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    position: {
      type: String,
    },
    rewardsReceived: {
      type: Number,
    },
    rewardsTransferred: {
      type: Number,
    },
    rewardsRedeemed: {
      type: Number,
    },
    organizationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
      required: true,
    },
    organizationCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

staffSchema.plugin(toJSON);
staffSchema.plugin(paginate);

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;

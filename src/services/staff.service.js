const httpStatus = require('http-status');
const { Staff } = require('../models');
const ApiError = require('../utils/ApiError');

const createStaff = async (staffBody) => {
  return await Staff.create(staffBody);
};

const getStaffByUserId = async (id) => {
  return await Staff.findOne({ userId: id });
};

module.exports = { createStaff, getStaffByUserId };

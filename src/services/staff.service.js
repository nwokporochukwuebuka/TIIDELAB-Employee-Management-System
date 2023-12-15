const httpStatus = require('http-status');
const { Staff } = require('../models');
const ApiError = require('../utils/ApiError');

const createStaff = async (staffBody) => {
  return await Staff.create(staffBody);
};

const getStaffByUserId = async (id) => {
  return await Staff.findOne({ userId: id });
};

const getStaffById = async (id) => {
  return await Staff.findById(id);
};

const updateStaff = async (staffId, updateBody) => {
  const staff = await getStaffById(staffId);

  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Staff not found');
  }

  Object.assign(staff, updateBody);
  await staff.save();
  return staff;
};

module.exports = { createStaff, getStaffByUserId, updateStaff, getStaffById };

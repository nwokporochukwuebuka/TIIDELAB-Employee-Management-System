const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, staffService, organizationService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  // const filter = pick(req.query, [/* 'name', */ 'role', 'code']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(req.query.code, req.query.role);
  res.send(result);
});

const getUserProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.role === 'staff') {
    const staff = await staffService.getStaffByUserId(req.user.id);
    const organization = await organizationService.fetchOrganizationById(staff.organizationId);
    return res.send({ user, staff, organization });
  } else if (user.role === 'organization') {
    const organization = await organizationService.fetchOrganizationByUserId(req.user.id);
    return res.status(httpStatus.OK).send({ user, organization });
  }
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUserProfile,
  updateUser,
  deleteUser,
};

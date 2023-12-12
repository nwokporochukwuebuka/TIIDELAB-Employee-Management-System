const httpStatus = require('http-status');
const { Organization } = require('../models');
const ApiError = require('../utils/ApiError');

const createOrganization = async (organizationBody) => {
  if (await Organization.isCodeTaken(organizationBody.code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already Taken');
  }

  return Organization.create(organizationBody);
};

const fetchOrganizationById = async (id) => {
  return await Organization.findById(id);
};

const fetchOrganizationByUserId = async (userId) => {
  return await Organization.findOne({ userId: userId });
};

const fetchOrganizationByCode = async (code) => {
  return await Organization.findOne({ organizationCode: code });
};

module.exports = {
  createOrganization,
  fetchOrganizationById,
  fetchOrganizationByCode,
  fetchOrganizationByUserId,
};

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

const updateOrganization = async (id, updateBody) => {
  const organization = await fetchOrganizationById(id);

  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  Object.assign(organization, updateBody);
  await organization.save();
  return organization;
};

module.exports = {
  createOrganization,
  fetchOrganizationById,
  fetchOrganizationByCode,
  fetchOrganizationByUserId,
  updateOrganization,
};

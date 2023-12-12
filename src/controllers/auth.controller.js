const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, organizationService, staffService } = require('../services');

function generateAlphanumericCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

const register = catchAsync(async (req, res) => {
  if (req.body.role === 'organization') {
    req.body.code = generateAlphanumericCode(6);
    const user = await userService.createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'organization',
    });

    const organization = await organizationService.createOrganization({ userId: user.id, organizationCode: req.body.code });
    const tokens = await tokenService.generateAuthTokens(user);
    return res.status(httpStatus.CREATED).send({ user, tokens, organization });
  } else if (req.body.role === 'staff') {
    const user = await userService.createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'staff',
    });

    const organization = await organizationService.fetchOrganizationByCode(req.body.code);

    if (!organization) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ status: false, message: 'an organization with this id does not exist' });
    }

    console.log('====== Thsis is teh organization details ======', organization);
    const staff = await staffService.createStaff({
      userId: user.id,
      organizationId: organization._id,
      organizationCode: req.body.code,
    });

    const tokens = await tokenService.generateAuthTokens(user);

    return res.status(httpStatus.CREATED).send({ user, staff, organization, tokens });
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (user.role === 'staff') {
    const staff = await staffService.getStaffByUserId(user.id);
    const organization = await organizationService.fetchOrganizationByCode(staff.organizationCode);
    const tokens = await tokenService.generateAuthTokens(user);
    return res.send({ user, tokens, organization, staff });
  } else if (user.role === 'organization') {
    const organization = await organizationService.fetchOrganizationByUserId(user.id);
    const tokens = await tokenService.generateAuthTokens(user);
    return res.send({ user, tokens, organization });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};

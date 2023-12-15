const express = require('express');
const validate = require('../../middlewares/validate');
const rewardValidation = require('../../validations/reward.validation');

const auth = require('../../middlewares/auth');
const rewardController = require('../../controllers/reward.controller');

const router = express.Router();

router.post('/:userId', auth('manageUsers'), validate(rewardValidation.generateReward), rewardController.generateReward);

router.post(
  '/transfer/:rewardId',
  auth('staff'),
  validate(rewardValidation.transferReward),
  rewardController.transferReward
);

router.patch('/redeem/:rewardId', auth('staff'), validate(rewardValidation.reedemReward), rewardController.reedemReward);

router.get('/user/:rewardId', auth(), validate(rewardValidation.fetchUsersReward), rewardController.fetchUsersReward);

router.post(
  '/organization/:orgainzationId',
  auth('manageUsers'),
  validate(rewardValidation.fetchUsersReward),
  rewardController.fetchOrganizationReward
);

// router.
module.exports = router;

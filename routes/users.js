const router = require('express').Router();
const {
  getProfile,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getProfile);
router.patch('/me', updateProfile);

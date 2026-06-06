const express = require('express');

const { register, login } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/register',
  validateRequest([
    { field: 'name', required: true, minLength: 2, message: 'Name must be at least 2 characters' },
    { field: 'email', required: true, type: 'email', message: 'A valid email is required' },
    { field: 'password', required: true, minLength: 8, message: 'Password must be at least 8 characters' }
  ]),
  register
);

router.post(
  '/login',
  validateRequest([
    { field: 'email', required: true, type: 'email', message: 'A valid email is required' },
    { field: 'password', required: true, minLength: 1, message: 'Password is required' }
  ]),
  login
);

module.exports = router;
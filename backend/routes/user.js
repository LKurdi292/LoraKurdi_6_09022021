// Importations
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Appel des middlewares
const signUpCheck = require('../middleware/signupCheck');
const accountLimiter = require('../middleware/createAccountLimiter');
const connectionLimiter = require('../middleware/connectionRateLimiter');

// Les routes
router.post('/signup', accountLimiter, signUpCheck, userCtrl.signup);
router.post('/login', connectionLimiter, userCtrl.login);


module.exports = router;
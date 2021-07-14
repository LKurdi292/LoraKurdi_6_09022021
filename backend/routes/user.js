// Importations
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const signUpCheck = require('../middleware/signupCheck');

// Les routes
router.post('/signup', signUpCheck, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;
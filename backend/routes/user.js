// Importations
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Appel des middlewares
const signUpCheck = require('../middleware/signupCheck');
//const connectionLimiter = require('../middleware/connectionRateLimiter');


const rateLimit = require("express-rate-limit");

let limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5,  //limiter chaque adresse IP à 5 requêtes par fenêtre de tps (windowMs)
	headers: true,
	message:  "Trop de tentatives de connexion. Ré-essayez dans 15min"
});

// Les routes
router.post('/signup', signUpCheck, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);


module.exports = router;
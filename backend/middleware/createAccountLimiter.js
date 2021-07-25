// Middleware qui limite le nombre de création de compte par adresse IP

const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1h
	max: 5,  // Nombre de compte créés limité par fenêtre de tps (windowMs)
	headers: true,
	message:  "Trop de comptes créés depuis votre adresse IP. Ré-essayez dans une heure"
});

module.exports = (req, res, next) => {
	try {
		createAccountLimiter;
		next();
	} catch (error) {
		res.status(429).json({ error: "Trop de comptes créés depuis votre adresse IP. Ré-essayez dans une heure" });
	}
};
// Middleware qui limite le nombre de tentative de connexion sur la route Login (lorsque mdp incorrect)

const rateLimit = require("express-rate-limit");

let limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 2,  // limiter chaque adresse IP à 10 requêtes par fenêtre de tps (windowMs)
	headers: true,
	message:  "Trop de tentatives de connexion. Ré-essayez dans 15min"
});


module.exports = (req, res, next) => {
	try {
		limiter;
		next();
	} catch (error) {
		res.status(429).json({ error: "Trop de tentatives de connexion. Ré-essayez dans 15min" });
	}
};

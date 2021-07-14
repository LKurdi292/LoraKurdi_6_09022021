// Format email
const mailFormat = new RegExp("^[A-Za-z0-9-_.]+@[a-z]{3,}[.][a-z]{2,4}$");

// MDP: 8 caractères min, 1 maj, 1 min, 1 chiffre, 1 caractère spécial
const strongPW = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


module.exports = (req, res, next) => {
	try {
		const mail = req.body.email;
		const mdp = req.body.password;

		if (mailFormat.test(mail) && strongPW.test(mdp) ) {
			// si tout est ok, on peut passer la requête au prochain middleware
			console.log("ok");
			next();
		} else {
			throw 'Adresse email et/ou mot de passe non valable(s)! ';
		}
	} catch (error) {
		res.status(400).json({ error: 'Requête non valable !' });
	}
};
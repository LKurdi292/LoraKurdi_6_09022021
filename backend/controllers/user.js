//Importations
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJS = require('crypto-js');


// Middlewares d'authentification

exports.signup = (req, res, next) => {

	// Crypter l'email
	const key = cryptoJS.enc.Hex.parse(process.env.CryptojsKEY);
	const iv = cryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
	const encrypted = cryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();

	//hasher le mdp + nbr de tour de hashage
	bcrypt.hash(req.body.password, 10)

	.then(hash => {
		// nouvel utilisateur, enregistrement dans la bdd
		const user = new User({
			email: encrypted,
			password: hash
		});
		user.save()
		.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
		.catch(error => res.status(400).json({ error }));
	})
	.catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
	// Crypter le mail de la requete
	const key = cryptoJS.enc.Hex.parse(process.env.CryptojsKEY);
	const iv = cryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
	const encrypted = cryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
	
	// le chercher dans la base de donnée
	User.findOne({ email: encrypted })
	.then(user => {
		// vérifier que l'utilisateur existe
		if (!user) {
			return (res.status(401).json({ error: 'Utilisateur non trouvé!'}));
		} 
		// si oui, vérifier le mdp
		bcrypt.compare(req.body.password, user.password)
		.then( valid => {
			// si comparaison fausse
			if (!valid) {
				return (res.status(401).json({ error: 'Mot de passe incorrect!'}));
			}
			// comparaison true
			res.status(200).json({
				userId: user._id,
				token: jwt.sign(
					{ userId: user._id},
					process.env.TOKEN,
					{ expiresIn: '24h' }
				)
			});
		})
		.catch(error => res.status(500).json({ error }));
	})
	.catch(error => res.status(500).json({ error }));
};
// Importations
const Sauce = require('../models/Sauce');
const fs = require('fs');

// Exportations de méthodes pour les routes

	// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
	.then(sauces => res.status(200).json(sauces))
	.catch(error => res.status(400).json({error}));
};

	// Afficher une sauce
exports.getOneSauce = (req, res, next) =>  {
	// comparaison entre l'_id du paramètre url et l'id de l'objet envoyé par mongoDB
	Sauce.findOne({ _id : req.params.id })
	.then(sauce => res.status(200).json(sauce))
	.catch(error => res.status(404).json({ error }));
};

	// Créer une sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);

	const sauce = new Sauce({
		...sauceObject,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
		// récupération du segment de base de l'URL
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});
	// enregistrement dans la bdd
	sauce.save()
		// renvoyer une réponse positive sinon la requête du front va expirer
	.then(() => res.status(201).json({message: 'Objet enregistré !'}))
	// error = raccourci js de error: error
	.catch(error => res.status(400).json({ error }));
};


	// Modifier une sauce
exports.modifySauce = (req, res, next) => {
	const SauceObject = req.file ?
	{
		...JSON.parse(req.body.sauce),
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

	} : { ...req.body.sauce };

	Sauce.updateOne({ _id : req.params.id }, { ...SauceObject, _id : req.params.id })
	.then(() => res.status(200).json({message: 'Objet modifié !'}))
	.catch(error => res.status(400).json({ error }));
};

	// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id})
	.then(sauce => {
		// extraction du nom du fichier à supprimer
		const filename = sauce.imageUrl.split('/images/')[1];
		// supprimer
		fs.unlink(`images/${filename}`, () => {
			sauce.deleteOne({ _id : req.params.id})
			.then(() => res.status(200).json({message : 'Objet supprimé !'}))
			.catch(error => res.status(400).json({ error }));
		});
	})
	.catch(error => res.status(500).json({ error }));
};


	// Liker ou Disliker une sauce
exports.likeStatus = (req, res, next) => {
	const user = req.body.userId;
	const likeValue = req.body.like;

	console.log(user);
	console.log(likeValue);

	// const queryUsersLiked = Sauce.find({ 
	// 	usersLiked: {
	// 		$elemMatch: {
	// 			userId: user
	// 		}
	// 	}
	// }, function (err) {});

	// const queryUsersDisliked = Sauce.find({ 
	// 	usersDisliked: {
	// 		$elemMatch: {
	// 			userId: user
	// 		}
	// 	}
	// }, function (err) {});

	Sauce.findOne({ _id : req.params.id })
	.then(sauce => {
		// si un user like ou dislike la sauce, mettre à jour dans la bdd
		// le nombre de likes ou de dislikes
		// et les users qui ont liké ou disliké

		// && !queryUsersLiked
		if (likeValue === 1 ) {
			
			sauce.likes += 1;
			sauce.usersLiked.push(user);

		} else if (likeValue === -1 ) {
			// && !queryUsersDisliked
			sauce.dislikes -= 1;
			sauce.usersDisliked.push(req.body.userId);

		} else if (likeValue === 0) {
			sauce.likes -= 1
			sauce.dislikes += 1;
		}
		sauce.save()
		.then(() => res.status(201).json({ message: 'Statut j\'aime de la sauce mis à jour !' }))
		.catch(error => res.status(400).json({ error }));
	})
	.catch(error => res.status(500).json({ error }));
};


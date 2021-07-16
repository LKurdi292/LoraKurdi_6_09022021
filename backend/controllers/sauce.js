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
	// si nouvelle image
	if (req.file) {
		Sauce.findOne({ _id: req.params.id})
		.then(sauce => {
			// extraction du nom de l'ancienne image à supprimer
			const filename = sauce.imageUrl.split('/images/')[1];
			// supprimer la première image
			fs.unlink(`images/${filename}`, () => {
				const SauceObject = {
					...JSON.parse(req.body.sauce),
					imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
				}
				// mettre à jour la sauce
				Sauce.updateOne({ _id : req.params.id }, { ...SauceObject, _id : req.params.id })
				.then(() => res.status(200).json({message: 'Objet modifié !'}))
				.catch(error => res.status(400).json({ error }));
			});
		})
	} else {
		const SauceObject = { ...req.body.sauce };
	
		Sauce.updateOne({ _id : req.params.id }, { ...SauceObject, _id : req.params.id })
		.then(() => res.status(200).json({message: 'Objet modifié !'}))
		.catch(error => res.status(400).json({ error }));
	}
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
			.then(() => res.status(200).json({ message : 'Objet supprimé !'}))
			.catch(error => res.status(400).json({ error }));
		});
	})
	.catch(error => res.status(500).json({ error }));
};


	// Liker ou Disliker une sauce
exports.likeStatus = (req, res, next) => {
	// si un user like ou dislike une sauce:
	// maj le nombre de likes ou de dislikes
	// maj les tableaux des users qui ont liké ou disliké
	const user = req.body.userId;
	const likeValue = req.body.like;

	if (likeValue === 1 ) {
		Sauce.updateOne({ _id : req.params.id },
			{ $push: { usersLiked : user }, $inc: { likes: +1 }})
		.then(() => res.status(201).json({ message: 'Sauce aimée ! '}))
		.catch(error => { 
			console.log( error.message );
			return res.status(500).json({ error });
		});
	} else if (likeValue === -1 ) {
		Sauce.updateOne({ _id : req.params.id },
			{ $push: { usersDisliked : user },
			 $inc: { dislikes: +1 }
			})
		.then(() => res.status(201).json({ message: 'Sauce détestée ! '}))
		.catch(error => { 
			console.log( error.message );
			return res.status(500).json({ error });
		});
	} else if (likeValue === 0) {
		Sauce.findOne({ _id : req.params.id })
		.then((sauce) => {
			if (sauce.usersLiked.includes(user)) {
				Sauce.updateOne(
					{ _id: req.params.id },
					{
					$pull: { usersLiked: user },
					$inc: { likes: -1 },
					}
				)
				.then(() => res.status(200).json({ message: 'Vous n\'aimez plus cette sauce !' }))
				.catch((error) => res.status(500).json({ error }))
			}
			if (sauce.usersDisliked.includes(user)) {
				Sauce.updateOne(
				  { _id: req.params.id },
				  {
					$pull: { usersDisliked: user },
					$inc: { dislikes: -1 },
				  })
				  .then(() => res.status(200).json({ message: 'Vous ne détestez plus cette sauce !' }))
				  .catch((error) => res.status(500).json({ error }))
			}
		  })
		.catch((error) => res.status(404).json({ error }));
	}
};


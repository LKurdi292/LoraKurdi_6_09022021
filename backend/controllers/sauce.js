// Importations
const Sauce = require('../models/Sauce');
const fs = require('fs');

// Exportations de méthodes pour les routes

	// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
	.then(Sauces => res.status(200).json(Sauces))
	.catch(error => res.status(400).json({error}));
};

	// Afficher une sauce
exports.getOneSauce = (req, res, next) =>  {
	// req.params.id
	// comparaison entre l'id du paramètre url et l'_id de l'objet envoyé par mongoDB
	Sauce.findOne({ _id : req.params.id })
	.then(Sauce => res.status(200).json(Sauce))
	.catch(error => res.status(404).json({ error}));
};


	// Créer une sauce
exports.createSauce = (req, res, next) => {
	const SauceObject = JSON.parse(req.body.Sauce);

	// enlever le champ id du corps de la requete (car c'est mongo qui a le bon)
	delete SauceObject._id;

	const Sauce = new Sauce({
		...SauceObject,
		// récupération du segment de base de l'URL
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});
	// enregistrement dans la bdd
	Sauce.save()
	// renvoyer une réponse sinon la requête du front va expirer
	.then(() => res.status(201).json({message: 'Objet enregistré !'}))
	// error = raccourci js de error: error
	.catch(error => res.status(400).json({ error }));
};

	// Modifier une sauce
exports.modifySauce = (req, res, next) => {
	const SauceObject = req.file ?
	{
		...JSON.parse(req.body.Sauce),
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

	} : { ...req.body.Sauce };

	Sauce.updateOne({_id : req.params.id}, {...SauceObject, _id : req.params.id})
	.then(() => res.status(200).json({message: 'Objet modifié !'}))
	.catch(error => res.status(400).json({ error }));
};

	// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id})
	.then(Sauce => {
		// extraction du nom du fichier à supprimer
		const filename = Sauce.imageUrl.split('/images/')[1];
		// supprimer
		fs.unlink(`images/${filename}`, () => {
			Sauce.deleteOne({ _id : req.params.id})
			.then(() => res.status(200).json({message : 'Objet supprimé !'}))
			.catch(error => res.status(400).json({ error }));
		});
	})
	.catch(error => res.status(500).json({ error }));
};


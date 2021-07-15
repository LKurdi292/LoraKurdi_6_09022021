const fs = require('fs');

module.exports = (req, res, next) => {
	try {
		const sauce = JSON.parse(req.body.sauce);
	
		// enlever les espaces en début et fin de string
		const name = sauce.name.trim();
		const manufacturer = sauce.manufacturer.trim();
		const description = sauce.description.trim();
		const mainPepper = sauce.mainPepper.trim();
		
		// Vérifier que les champs texte soient remplis
		if (name.length > 0 && manufacturer.length > 0 && description.length > 0 && mainPepper.length > 0) {
			// si tout est ok, on peut passer la requête au prochain middleware
			// mais on vérifie avant s'il y a une nouvelle image, sinon on supprime l'ancienne image sauvegardée en doublon par multer

			if (req.file) {
				// il y a une nouvelle image
				console.log("les champs sont BONS, et il a une nouvelle image");
				next();
			} else {
				console.log("les champs sont BONS, et il n'y a pas de nouvelle image");
				console.log("unlink", req.file.filename);
				fs.unlink(`images/${req.file.filename}`, () => {
					res.status(400).json({ error: 'Requête non valable, l\'image a été supprimée' });
				})
			}
		} else {
			// champs texte non valables =>
			// suppression de l'image préalablement sauvegardée par multer (qu'il y ait une nouvelle image ou pas)
			console.log("les champs sont FAUX");
			console.log("unlink", req.file.filename);
			fs.unlink(`images/${req.file.filename}`, () => {
				res.status(400).json({ error: 'Requête non valable, l\'image a été supprimée' });
			})
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: 'Requête non valable' });
	}
};
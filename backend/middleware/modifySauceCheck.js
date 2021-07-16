const fs = require('fs');

module.exports = (req, res, next) => {
	try {
		// nouvelle image
		if (req.file) {
			console.log(req.body.sauce);
			console.log(req.file);

			const sauce = JSON.parse(req.body.sauce);
	
			// enlever les espaces en début et fin de string
			const name = sauce.name.trim();
			const manufacturer = sauce.manufacturer.trim();
			const description = sauce.description.trim();
			const mainPepper = sauce.mainPepper.trim();

			if (name.length > 0 && manufacturer.length > 0 && description.length > 0 && mainPepper.length > 0) {
				// si tout est ok, on peut passer la requête au prochain middleware
				// mais on vérifie avant s'il y a une nouvelle image, sinon on supprime l'ancienne image sauvegardée en doublon par multer
				next();
				console.log("les champs sont BONS, et il y a une nouvelle image");

			} else {
				console.log("les champs sont FAUX, et il y a une nouvelle image");
				fs.unlink(`images/${req.file.filename}`, () => {
					res.status(400).json({ error: 'Requête non valable, l\'image a été supprimée' });
				})
			}
		} else {
			// il n'y pas de nouvelle image
			console.log(req.body);

			// enlever les espaces en début et fin de string
			const name = req.body.name.trim();
			const manufacturer = req.body.manufacturer.trim();
			const description = req.body.description.trim();
			const mainPepper = req.body.mainPepper.trim();

			if (name.length > 0 && manufacturer.length > 0 && description.length > 0 && mainPepper.length > 0) {
				console.log("Les champs sont BONS, et il n'y a PAS de nouvelle image");
				next();
			} else {
				console.log("Les champs sont FAUX, et il n'y a PAS de nouvelle image");
				res.status(400).json({ error: 'Requête non valable' });
			}
		} 
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: 'Requête non valable' });
	}
};
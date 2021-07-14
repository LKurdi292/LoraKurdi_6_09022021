module.exports = (req, res, next) => {
	try {
		const sauce = JSON.parse(req.body.sauce);
	
		// enlever les espaces en début et fin de string
		const sauceName = sauce.name.trim();
		const manufacturer = sauce.manufacturer.trim();
		const description = sauce.description.trim();
		const mainPepper = sauce.mainPepper.trim();
		
		if (sauceName.length > 0 && manufacturer.length > 0 && description.length > 0 && mainPepper.length > 0) {
			// si tout est ok, on peut passer la requête au prochain middleware
			next();
		} else {
			const filename = sauce.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {
			res.status(400).json({ error: 'Requête non valable, l\'image a été supprimée' });
			})
		}

	} catch (error) {
		console.log(error);
		res.status(400).json({ error: 'Requête non valable' });
	}
};
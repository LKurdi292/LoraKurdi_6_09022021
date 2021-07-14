// Importations
const multer = require('multer');

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'jpg'
};

// Objet de configuration
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images')
	}, 
	filename: (req, file, callback) => {
		const name = file.originalname.split('.')[0];
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + '_' + Date.now() + '.' + extension);
	}
});

// module.exports = multer({ storage }).single('image');
module.exports = (req, res, next) => {
	multer({ storage }).single('image');
	next();
}
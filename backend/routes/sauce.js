//Importation
const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCheck = require('../middleware/createSauceCheck');

/******** Les routes *********/

// middleware de la route Afficher toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);

// middleware de la route Afficher une sauce
	// les : de express indique que c'est une valeur dynamique
router.get('/:id', auth, sauceCtrl.getOneSauce);

//middleware de la route Créer une sauce
router.post('/', auth, multer, sauceCheck, sauceCtrl.createSauce);

// middleware de la route modifier une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

//middleware de la route pour supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//middleware de la route pour liker ou disliker une sauce
router.post('/:id/like', auth, sauceCtrl.likeStatus);

module.exports = router;
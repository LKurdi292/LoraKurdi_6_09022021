//Importation
const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/******** Les routes *********/

//middleware de la route post
router.post('/', auth, multer, sauceCtrl.createSauce);

// middleware de la route PUT pour modifier une donnée dans la bdd
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

//middleware pour supprimer un objet de la bdd
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// middleware de la route get pour récupérer les infos d'un objet et les afficher dans une page produit
router.get('/:id', auth, sauceCtrl.getOneSauce);

// middleware de la route get /api/stuff pour récupérer tous les objets de la table (page 'accueil')
router.get('/', auth, sauceCtrl.getAllSauces);


module.exports = router;
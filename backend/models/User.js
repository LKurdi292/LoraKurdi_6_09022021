// Importations
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma User
const userSchema = mongoose.Schema({
	email: { type: String, required : true, unique: true },
	password: { type: String, required: true} 
});

// Application du validateur d'unicité au schéma (impossible d'avoir plusieurs utlisateurs avec plusieurs adresses mail)
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);
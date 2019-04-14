
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

const usuarioSchema = new Schema({
	nombre: {
		type : String,
		required : true
	},
	documento: {
		type : String,
		required : true,
		unique: true
	},	
	correo: {
		type : String,
		required : true
	},		
	password: {
		type : String,
		required : true,
		trim : true
	},
	telefono: {
		type : String,
		default : 0,
	},
	rol: {
		type : String,
		enum: ['Aspirante', 'Coordinador'],
		default : 'Aspirante',
		required : true
	}
});

usuarioSchema.plugin(uniqueValidator, { message: 'Error, ya existe un usuario con el documento ingresado.' });

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario
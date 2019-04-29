
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

const ofertaSchema = new Schema({
	numId: {
		type : Number,
		required : true,
		unique: true
	},
	nombre: {
		type : String,
		required : true
	},
	descripcion: {
		type : String,
		required : true
	},
	salario: {
		type : Number,
		required : true,		
	}	
});

ofertaSchema.plugin(uniqueValidator, { message: 'Error, ya existe una oferta con el id ingresado.' });
const Oferta = mongoose.model('Oferta', ofertaSchema);
module.exports = Oferta
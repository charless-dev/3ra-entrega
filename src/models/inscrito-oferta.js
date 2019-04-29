
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const inscritoOfertaSchema = new Schema({
	documento: {
		type : String,
		required : true
	},
	ofertas: [],	
	nombre: { 
		type : String,
		required : true
	},
	correo: {
		type : String,
		required : true
	},
	telefono: {
		type : String,
		default : 0,
	}
});

/*inscritoOfertaSchema.plugin(uniqueValidator, { message: 'Error, ya se ha matriculado en este curso.' });*/
const InscritoOferta = mongoose.model('InscritoOferta', inscritoOfertaSchema);
module.exports = InscritoOferta
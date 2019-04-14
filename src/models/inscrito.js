
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const inscritoSchema = new Schema({
	documento: {
		type : String,
		required : true
	},
	cursos: [],	
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

/*inscritoSchema.plugin(uniqueValidator, { message: 'Error, ya se ha matriculado en este curso.' });*/
const Inscrito = mongoose.model('Inscrito', inscritoSchema);
module.exports = Inscrito
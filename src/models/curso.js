
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

const cursoSchema = new Schema({
	numId: {
		type : Number,
		required : true,
		unique: true
	},
	nombre: {
		type : String,
		required : true
	},
	modalidad: {
		type : String,
		default: 'Presencial'
	},
	intensidad: {
		type : Number,
		default: 0
	},
	descripcion: {
		type : String,
		required : true
	},
	valor: {
		type : Number,
		required : true,
		default: 0
	},
	estado: {
		type: String,
		default: 'Disponible'
	}			
});

cursoSchema.plugin(uniqueValidator, { message: 'Error, ya existe un curso con el id ingresado.' });
const Curso = mongoose.model('Curso', cursoSchema);
module.exports = Curso
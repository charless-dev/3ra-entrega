
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

const boletinSchema = new Schema({
	email: {
		type : String,
		required : true,
		trim : true,
		unique: true
	}		
});

boletinSchema.plugin(uniqueValidator, { message: 'Error, ya se ha registrado este correo anteriormente.' });
const Boletin = mongoose.model('Boletin', boletinSchema);
module.exports = Boletin
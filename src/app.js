
//Requires
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

//Paths
const dirNode_modules = path.join(__dirname , '../node_modules');
const dirPublic = path.join(__dirname,'../public');

//Static
app.use(express.static(dirPublic));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

//Set session vars
app.use(session({
	secret: 'cat',
	resave: false,
	saveUninitialized: true
}));

//Middleware
app.use((req, res, next) => {
	res.locals.session = false;
	if (req.session.usuario) {
		res.locals.session = true;
		res.locals.nombre = req.session.nombre;
		if (req.session.rol == 'Coordinador') {
			res.locals.coordinador = true;
		}
	}
	next();
});

//Body parser
app.use(bodyParser.urlencoded({extended:false}));

//Routes
app.use(require('./routes/index'));

mongoose.connect('mongodb://localhost:27017/cursos', {useNewUrlParser: true}, (err,res) => {
	if (err) {
		return console.log(err);
	}
	console.log('Conectado')
});

app.listen(process.env.PORT,() => {
	console.log('Servidor corriendo en el puerto:' + process.env.PORT);
});
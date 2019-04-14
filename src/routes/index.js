//Requires
require('./../helpers/helpers');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const Curso = require('./../models/curso');
const Usuario = require('./../models/usuario');
const Inscrito = require('./../models/inscrito');
const session = require('express-session');

//Paths
const dirViews = path.join(__dirname,'../../template/views');
const dirPartials = path.join(__dirname,'../../template/partials');

//hbs
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);

app.use(session({
  secret: 'cat',
  resave: false,
  saveUninitialized: true
}))

//Routes
app.get('/', (req, res) => {
	res.render('index', {
		titulo: 'Inicio',
	});
});

app.get('/crear-curso',(req, res) => {
	if (!req.session.activo) {
		res.render('ingresar', {
			message: "<div class='alert alert-danger' role='alert'>Para ingresar a esta página debe estar logueado</div>"
		});	
	}	
	res.render('crearCurso', {
		titulo: 'Crear curso'
	});
});

app.post('/crear-curso',(req, res) => {
	let curso = new Curso({
		numId: req.body.numId,
		nombre: req.body.nombre,
		modalidad: req.body.modalidad,
		intensidad: req.body.intensidad,
		descripcion: req.body.descripcion,
		valor: req.body.valor,
		estado: req.body.estado
	});
	curso.save((err, result) => {
		if (err) {
			res.render('crearCurso', {
				message: "<div class='alert alert-danger' role='alert'>"+err+"</div>"
			})			
		}else{
			res.render('crearCurso', {
				message: "<div class='alert alert-success' role='alert'>Curso "+req.body.nombre+" creado con exito!</div>"
			});
		}
	});
});

app.get('/lista-cursos',(req, res) => {
	let usuario = {};
	if (req.session.activo) {
		usuario = {
			documento: req.session.documento,
			nombre: req.session.nombre,
			correo: req.session.correo,
			telefono: req.session.telefono
		};
	}

	let estado = "";

	if (req.session.rol == "Coordinador") {
		estado = "!";
	}else {
		estado = "Cerrado"
	}

	Curso.find({estado: {$ne: estado}}).exec((err, result) => {
		if (err) {
			res.render('listaCursos', {
				message: "<div class='alert alert-danger' role='alert'>Ha ocurrido un error.</div>"
			})
		}else {
			res.render('listaCursos', {
				titulo: 'Cursos disponibles',
				listado: result,
				activo: req.session.activo,
				objUser: usuario
			});			
		}	
	});

});

app.post('/lista-cursos', (req, res) => {

	let usuario = {};

	if (req.session.activo) {
		usuario = {
			documento: req.session.documento,
			nombre: req.session.nombre,
			correo: req.session.correo,
			telefono: req.session.telefono
		};
	}

	let lista = "";
	let estado = "";

	if (req.session.rol == "Coordinador") {
		estado = "!";
	}else {
		estado = "Cerrado"
	}

	Curso.find({estado: {$ne: estado}}).exec((err, resultados) => {
		lista = resultados;
	});

	Inscrito.findOne({documento: req.body.documento, cursos: { $in:[req.body.curso ] } },(err, result) => { 
		if (err) {
			res.render('listaCursos', {
				message: "<div class='alert alert-danger' role='alert'>Ha ocurrio un error.</div>",
				listado: lista,
				activo: req.session.activo,
				objUser: usuario
			}) 
		} else if (!result) {
			Inscrito.findOneAndUpdate({documento: req.body.documento},{ $push: { cursos: req.body.curso }}, (err, result) => {
				if (err) {
					res.render('listaCursos', {					
						message: "<div class='alert alert-danger' role='alert'>Ha ocurrio un error.</div>",
						listado: lista,
						activo: req.session.activo,
						objUser: usuario
					});	
				} else if (!result) {
					let inscrito = new Inscrito({
						documento: req.body.documento,
						cursos: [req.body.curso],
						nombre: req.body.nombre,
						correo: req.body.correo,
						telefono: req.body.telefono					
					});
					inscrito.save(inscrito);	
				}
				res.render('listaCursos', {
					message: "<div class='alert alert-success' role='alert'>El usuario "+req.body.documento+" se ha inscrito con exito en el curso "+req.body.curso+" con exito!</div>",
					listado: lista,
					activo: req.session.activo,
					objUser: usuario
				});
			});
		} else { 
			res.render('listaCursos', {
				message: "<div class='alert alert-danger' role='alert'>Ya se encuentra matriculado en este curso.</div>",
				listado: lista,
				activo: req.session.activo,
				objUser: usuario
			})				
		}
	});
});

app.get('/registro',(req, res) => {
	res.render('registro');
});

app.post('/registro', (req, res) => {
	let usuario = new Usuario({
		nombre: req.body.nombre,
		documento: req.body.documento,
		correo: req.body.correo,
		password: bcrypt.hashSync(req.body.password, 10),
		telefono: req.body.telefono,
		rol: req.body.rol
	});
	usuario.save((err, result) => {
		if (err) {
			res.render('registro', {
				message: "<div class='alert alert-danger' role='alert'>"+err+"</div>"
			})			
		}else{
			res.render('registro', {
				message: "<div class='alert alert-success' role='alert'>El usuario "+req.body.nombre+" se ha registrado con exito!</div>"
			});
		}
	});
});

app.get('/inscritos', (req, res) => {

	if (!req.session.activo) {
		res.render('ingresar', {
			message: "<div class='alert alert-danger' role='alert'>Para ingresar a esta página debe estar logueado</div>"
		});	
	}

	let listaCursos, listaInscritos = "";
	Curso.find({}).exec((err, resultados) => {
		listaCursos = resultados;
	});
	Inscrito.find({}).exec((err, resultados) => {
		listaInscritos = resultados;
		res.render('listaInscritos', {
			cursos: listaCursos,
			inscritos: listaInscritos
		});		
	});
});

app.post('/inscritos', (req, res) => {
	let listaCursos, listaInscritos = "";	
	if (req.body.eliminar) {
		Inscrito.findOneAndUpdate({documento: req.body.eliminar},{ $pullAll: {cursos: [req.body.nombreCurso] } }, (err, result) => {
			Curso.find({}).exec((err, resultados) => {
				listaCursos = resultados;
			});
			Inscrito.find({}).exec((err, resultados) => {
				listaInscritos = resultados;	
				res.render('listaInscritos', {
					message: "<div class='alert alert-success' role='alert'>Se ha eliminado el estudiante satisfactoriamente!</div>",
					cursos: listaCursos,
					inscritos: listaInscritos
				});		
			});		
		});
	}else{
		Curso.findOneAndUpdate({nombre: req.body.curso},{estado: "Cerrado"}, (err, result) => {
			Curso.find({}).exec((err, resultados) => {
				listaCursos = resultados;
			});
			Inscrito.find({}).exec((err, resultados) => {
				listaInscritos = resultados;	
				res.render('listaInscritos', {
					message: "<div class='alert alert-success' role='alert'>Se ha cerrado el curso: "+req.body.curso+"</div>",
					cursos: listaCursos,
					inscritos: listaInscritos
				});		
			});		
		});
	}
});

app.post('/ingresar', (req, res) => {
	Usuario.findOne({correo:req.body.correo},(err, result) => {
		if (err) {
			return res.render('ingresar', {
				message: "<div class='alert alert-danger' role='alert'>Ha ocurrido un error.</div>"				
			});
		}
		if (!result) {
			return res.render('ingresar', {
				message: "<div class='alert alert-danger' role='alert'>Usuario no encontrado</div>"				
			});
		}
		if (!bcrypt.compareSync(req.body.password, result.password)) {
			return res.render('ingresar', {
				message: "<div class='alert alert-danger' role='alert'>Contraseña incorrecta</div>"
			});
		}	

		req.session.usuario = result._id;
		req.session.documento = result.documento;
		req.session.nombre = result.nombre;
		req.session.correo = result.correo;
		req.session.telefono = result.telefono;
		req.session.rol = result.rol;
		req.session.activo = true;

		let coordinador = false;
		if (result.rol == 'Coordinador') {
			coordinador = true;
		}

		res.render('ingresar', {
			message: "<div class='alert alert-success' role='alert'>Bienvenido "+result.nombre+"</div>",
			session: true,
			nombre: result.nombre,
			coordinador: coordinador
		});
	});
});

app.get('/salir', (req, res) => {
	req.session.destroy(function(err) {
		res.render('index', {
			titulo: 'Inicio',
			session: false,
		});
	})
});

module.exports = app;
//Requires
const hbs = require('hbs');

hbs.registerHelper('listaCursos',(listado, loggueado, objUser) => {
	let lista = "<div id='accordion' class='mb-5 mt-4'>";
	let form = "";	
	listado.forEach(curso => {
		if (loggueado) {
			form = '<div>'
					   + '<form method="post" action="/lista-cursos">'
					   + '<input type="hidden" name="documento" value="'+objUser.documento+'">'
					   + '<input type="hidden" name="nombre" value="'+objUser.nombre+'">'
					   + '<input type="hidden" name="correo" value="'+objUser.correo+'">'
					   + '<input type="hidden" name="telefono" value="'+objUser.telefono+'">'
					   + '<input type="hidden" name="curso" value="'+curso.nombre+'">'
					   + '<button class="btn btn-primary">Inscribirme</button> '							  
					   + '</form>'
					   +'</div>';
		}
		lista += '<div class="card">'
				  +	'<div class="card-header">' 
					  + '<a class="card-link d-block" data-toggle="collapse" href="#curso'+curso.numId+'">'
						  + '<strong>Estado: </strong>'+curso.estado+'<br>'
						  + '<strong>Nombre del curso: </strong>'+curso.nombre+'<br>'
						  + '<strong>Descripción: </strong> '+curso.descripcion+'<br>'
						  + '<strong>Valor: </strong> '+curso.valor
					  + '</a>'
				  + '</div>'
				  + '<div id="curso'+curso.numId+'" class="collapse" data-parent="#accordion">'
					  + '<div class="card-body">'
						  + '<strong>Id del curso: </strong>'+curso.numId+'<br>'
						  + '<strong>Nombre del curso: </strong>'+curso.nombre+'<br>'
						  + '<strong>Descripción: </strong> '+curso.descripcion+'<br>'
						  + '<strong>Valor: </strong> '+curso.valor+'<br>'
						  + '<strong>Modalidad: </strong> '+curso.modalidad+'<br>'
						  + '<strong>Intensidad horaria: </strong> '+curso.intensidad
						  + form
					  + '</div>'
				  + '</div>'
			  + '</div>';
		}
	);
	lista += "</div>";
	return lista;
});

hbs.registerHelper('infoInscritosCursos', (listaCursos, listaInscritos) => {
	let infoInscritosCursos = "<p>Lista de cursos e inscritos:</p>";
	let form = "";
	listaCursos.forEach(curso => {
		infoInscritosCursos += "<h4>"+curso.nombre+" - <em>"+curso.estado+"</em></h4>";
		let ins = listaInscritos.filter(u => u.cursos.includes(curso.nombre));
		if (ins.length>0) {				
			infoInscritosCursos += "<p>Lista de inscritos:</p>";
			ins.forEach(inscrito => {
				form = '<div>'
					   + '<form method="post" action="/inscritos">'
					   + '<input type="hidden" name="nombreCurso" value="'+curso.nombre+'">'
					   + '<input type="hidden" name="eliminar" value="'+inscrito.documento+'">'
					   + '<button class="btn btn-danger">Eliminar del curso</button> '							  
					   + '</form>'
					   +'</div>';					
				infoInscritosCursos += "<p><strong>Documento: </strong>"+inscrito.documento+"<p/>"
									+ "<p><strong>Nombre: </strong>"+inscrito.nombre+"<p/>"		
									+ "<p><strong>Correo: </strong>"+inscrito.correo+"<p/>"		
									+ "<p><strong>Telefono: </strong>"+inscrito.telefono+"<p/>"
									+ form+"<span class='container border-top my-3 d-block'></span>";		
			});
		}else {
			infoInscritosCursos += "<p>Este curso no tiene inscritos</p>";
		}
	});
	return infoInscritosCursos;
});

hbs.registerHelper('listadoCursos', (listaCursos) => {
	let cursos = "";
	listaCursos.forEach(curso => {
		if (curso.estado === "Disponible") {
			cursos += "<option>"+curso.nombre+"</option>"
		}
	});
	return cursos;
});
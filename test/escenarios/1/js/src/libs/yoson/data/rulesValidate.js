var dataRules = {
	'#experienceF' : {
		'_otra_empresa' : {require : true},
		'_otro_rubro' : {type : 'all'},
		'_id_puesto' : {require : true},
		'_otro_puesto' : {require : true},
		'_id_nivel_puesto' : {require : true},
		'_otro_nivel_puesto' : {require : true},
		'_id_area' : {require : true},
		'_id_tipo_proyecto' : {require : true},
		'_nombre_proyecto' : {require : true},
		'_costo_proyecto' : {type : 'decimal'},
		'_inicio_mes' : {require : true},
		'_inicio_ano' : {require : true},
		'_fin_mes' : {require : true},
		'_fin_ano' : {require : true},
		'_comentarios' : {type : 'all'}
	},
	'#studyF' : {
		'_id_nivel_estudio' : {require : true},
		'_id_nivel_estudio_tipo' : {require : true},
		'_otro_estudio' : {require : true},
		'_colegiatura_numero' : {type : 'number'},
		'_institucion' : {require : true},
		'_pais_estudio' : {require : true},
		'_id_tipo_carrera' : {require : true},
		'_id_carrera' : {require : true},
		'_otro_carrera' : {require : true},
		'_otra_carrera' : {require : true},
		'_inicio_mes' : {require : true},
		'_inicio_ano' : {require : true},
		'_fin_mes' : {require : true},
		'_fin_ano' : {require : true}
	},
	'#studyOtherF' : {
		'_id_nivel_estudio_tipo' : {require : true},
		'_otro_estudio' : {require : true},
		'_otra_carrera' : {require : true},
		'_institucion' : {require : true},
		'_pais_estudio' : {require : true},
		'_inicio_mes' : {require : true},
		'_inicio_ano' : {require : true},
		'_fin_mes' : {require : true},
		'_fin_ano' : {require : true}
	},
	'#languagesF' : {
		'_id_idioma' : {require : true},
		'_nivel_idioma' : {require : true}
	},
	'#programsF' : {
		'_id_programa_computo' : {require : true},
		'_nivel' : {require : true}
	},
	'#referenceF' : {
		'_listaexperiencia' : {require : true},
		'_nombre' : {require : true},
		'_cargo' : {require : true},
		'_telefono' : {require : true, type: 'phone'},
		'_telefono2' : {type: 'phone'},
		'_email' : {type : 'email'}
	},
	'#preguntasF' : {
		'_pregunta' : {require : true}
	},
	'#frmContacSelection' : {
		'txtCompany' : {require : true},
		'txtPhoneCompany' : {require : true, type: 'phone'},
		'txtPhone' : {require : true, type: 'phone'},
		'txtContact' : {require : true},
		'txtEmail' : {require : true, type : 'email'},
		'txaMessage' : {require : true}
	},
	'#frmSendEmail' : {
		'nombreEmisor' : {require : true},
		'nombreReceptor' : {require : true},
		'correoEmisor' : {require : true, type : 'email'},
		'correoReceptor' : {require : true, type : 'email'}
    }
};
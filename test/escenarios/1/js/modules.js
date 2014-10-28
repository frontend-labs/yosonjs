
yOSON.AppSchema.modules = {
	'postulante': {
		controllers: {
			'mi-cuenta': {
				actions: {
					'index': function () {
						yOSON.AppCore.runModule('bar_animation');
					},
					'mis-experiencias': function () {
						console.log("debe llegar aqui...");
						yOSON.AppCore.runModule('mini_validate', {
							"Perfil_postulante" : { experiencia : { context: '#experienceF', btn: '#btnExperience' }}
						});
						yOSON.AppCore.runModule('skill_add', {
							"Perfil_postulante" : { experiencia : { context: '#experienceF', template: '#tplExperience', btn: '#btnExperience' }}
						});
						yOSON.AppCore.runModule('skill_edit', {
							"Perfil_postulante" : { experiencia : { context: '#experienceF' }}
						});
						yOSON.AppCore.runModule('skill_remove', {
							"Perfil_postulante" : { experiencia : { context: '#experienceF' }}
						});

						yOSON.AppCore.runModule('hide_skill_block',[
							{ context: '#experienceF', chkInput: '#chkExperience' }
						]);
						yOSON.AppCore.runModule('input_show_more', [{
							context: '#experienceF', inputTagName: '_lugar',
							option: [{name: '_tipo_proyecto'}, {name: '_nombre_proyecto'}, {name: '_costo_proyecto'}]
						},
						{
							context: '#experienceF', inputTagName: '_nivel_puesto',
							option: {'10' : [{name: '_otro_nivel_puesto'}]}
						},
						{
							context: '#experienceF', inputTagName: '_id_puesto',
							option: {'1292' : [{name: '_otro_puesto', title: 'first_title'}]}
						}]);
						yOSON.AppCore.runModule('count_character');
					},
					'mis-estudios' : function(){
						yOSON.AppCore.runModule('mini_validate', {
							"Perfil_postulante" : { estudio		: { context: '#studyF', btn: '#btnStudy' } }
						});
						yOSON.AppCore.runModule('skill_add', {
							"Perfil_postulante" : { estudio		: { context: '#studyF', template: '#tplStudy', btn: '#btnStudy' } }
						});
						yOSON.AppCore.runModule('skill_edit', {
							"Perfil_postulante" : { estudio		: { context: '#studyF' } }
						});
						yOSON.AppCore.runModule('skill_remove', {
							"Perfil_postulante" : { estudio		: { context: '#studyF' } }
						});

						yOSON.AppCore.runModule('study_options');
						yOSON.AppCore.runModule('autocomplete_text');
						yOSON.AppCore.runModule('combos_depends',[
							{ context: '#studyF', selParent: '_id_tipo_carrera', selChild: 'id_carrera',
								urlAjax: '/registro/filtrar-carrera/', paramAjax: 'id_tipo_carrera' },
							{ context: '#studyF', selParent: '_id_nivel_estudio', selChild: '_id_nivel_estudio_tipo',
								urlAjax: '/home/filtrar-tipo-estudio/', paramAjax: 'id_nivel_estudio', jsonDefault: false, arrExceptions: [0,1,2,3] }
						]);

						yOSON.AppCore.runModule('hide_skill_block',[
							{ context: '#studyF', chkInput: '#chkStudy' }
						]);
						yOSON.AppCore.runModule('input_show_more', [{
							context: '#studyF', inputTagName: '_id_carrera',
							option: {'Otros' : [{name: '_otro_carrera', title: 'first_title'}]},
							label : true
						},
						{
							context: '#studyF', inputTagName: '_id_nivel_estudio_tipo',
							option: {'18' : [{name: '_colegiatura_numero'}]}
						}]);
					},
					'mis-otros-estudios': function () {
						yOSON.AppCore.runModule('mini_validate', {
							"Perfil_postulante" : { otroEstudio : { context: '#studyOtherF', btn: '#btnOtherStudy' } }
						});
						yOSON.AppCore.runModule('skill_add', {
							"Perfil_postulante" : { otroEstudio : { context: '#studyOtherF', template: '#tplStudyOther', btn: '#btnOtherStudy' } }
						});
						yOSON.AppCore.runModule('skill_edit', {
							"Perfil_postulante" : { otroEstudio : { context: '#studyOtherF' } }
						});
						yOSON.AppCore.runModule('skill_remove', {
							"Perfil_postulante" : { otroEstudio : { context: '#studyOtherF' } }
						});
					},
					'mis-idiomas': function () {
						yOSON.AppCore.runModule('mini_validate', {
							"Perfil_postulante" : { idioma: { context: '#languagesF', btn: '#btnLanguage' } }
						});
						yOSON.AppCore.runModule('skill_add', {
							"Perfil_postulante" : { idioma: { context: '#languagesF', template: '#tplLanguage', btn: '#btnLanguage' , separate: 'nivel', validRepeat: true } }
						});
						yOSON.AppCore.runModule('skill_edit', {
							"Perfil_postulante" : { idioma: { context: '#languagesF', separate: 'nivel' } }
						});
						yOSON.AppCore.runModule('skill_remove', {
							"Perfil_postulante" : { idioma: { context: '#languagesF' } }
						});
					},
					'mis-programas': function () {
						yOSON.AppCore.runModule('mini_validate', {
							"Perfil_postulante" : { programs: { context: '#programsF', btn: '#btnPrograms' } }
						});
						yOSON.AppCore.runModule('skill_add', {
							"Perfil_postulante" : { programs: { context: '#programsF', template: '#tplPrograms', btn: '#btnPrograms' , separate: 'nivel', validRepeat: true } }
						});
						yOSON.AppCore.runModule('skill_edit', {
							"Perfil_postulante" : { programs: { context: '#programsF', separate: 'nivel' } }
						});
						yOSON.AppCore.runModule('skill_remove', { 
							"Perfil_postulante" : { programs: { context: '#programsF' } }
						});
					},
					'mis-referencias': function () {
						yOSON.AppCore.runModule('mini_validate', {
							"Perfil_postulante" : { programs	: { context: '#referenceF', btn: '#btnReference' } }
						});
						yOSON.AppCore.runModule('skill_add', {
							"Perfil_postulante" : { programs	: { context: '#referenceF', template: '#tplReference', btn: '#btnReference', separate: 'es'} }
						});
						yOSON.AppCore.runModule('skill_edit', {
							"Perfil_postulante" : { programs	: { context: '#referenceF', separate: 'es' } }
						});
						yOSON.AppCore.runModule('skill_remove', {
							"Perfil_postulante" : { programs	: { context: '#referenceF' } }
						});
					},
					'byDefault': function () {
					}
				},
				allActions: function () {
					yOSON.AppCore.runModule('update_date', [
						{selTag: '_inicio_ano', selDepend: '_fin_ano'},
						{selTag: '_inicio_mes', selDepend: '_fin_mes'}
					]);
					yOSON.AppCore.runModule('disable_combos',[
						{chkName: '_en_curso', disableds: ['_fin_mes','_fin_ano']}
					]);
				}
			},
			byDefault: function () {},
			allActions: function () {}
		},
		byDefault: function () {},
		allControllers: function () {}
	},

	byDefault: function () {},

	allModules: function (oMCA) {
		yOSON.AppCore.runModule('window_modal');
		yOSON.AppCore.runModule('modal_login');
		yOSON.AppCore.runModule('modal_register');
		yOSON.AppCore.runModule('forgot_password');
		yOSON.AppCore.runModule('placeholder_ie');
		yOSON.AppCore.runModule('validate_key',[
			{ txtInput: '.number', type: 'number' },
			{ txtInput: '.decimal', type: 'decimal' },
			{ txtInput: '.onlytext', type: 'text' }
		]);
	}
};

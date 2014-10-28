var dataTemplate = {
	'datos_usuario': {
		'skill_title': '<ul class="skill-title row"><li>{{=order}}. </li><li><b>{{=title1}}</b>{{ if(title2){ }} {{=separate}} <b>{{=title2}}</b>{{ } }}</li><li class="last"><a href="#Editar" class="action-icons edit" title="Editar"></a><a href="javascript:;" class="action-icons delete" title="Eliminar"></a></li></ul>',
		
		'update_title': '<b>{{=title1}}</b>{{ if(title2){ }} {{=separate}} <b>{{=title2}}</b>{{ } }}',
		
		'modal_delete': '<div class="center"><p class="mB10">{{=content}}</p><button type="button" id="btnAgree" class="btn btn-primary">Aceptar</button><button type="button" id="btnCancel" class="btn btn-default">Cancelar</button></div>'
	},
	'all': {
		'tpl_options' : '<option value="{{=value}}" label="{{=data}}">{{=data}}</option>'
	},
	'buscador_aptitus': {
		'search_list' : '<li><a href="{{=url}}" title="Ver búsqueda">{{=nombre}}</a><a href="javascript:;" data-id="{{=id}}" class="last" title="Eliminar búsqueda">X</a></li>'
	},
	'modal' : {
		'confirm' : '<p>{{=message}}</p><div class="txt_center mT10"><button id="btnConfirm" class="btn btn-primary">Aceptar</button><button id="btnCancel" class="btn btn-primary">Cancelar</button></div>'
	},
	'plugins' : {
		'switcher_check' : '<div class="checkSwitchInner"><div class="checkSwitchOn">Si</div><div class="checkSwitchHandle"></div><div class="checkSwitchOff">No</div></div>'
	}
};



//yOSON.AppSchema.modules[yOSON.modulo].controllers[yOSON.controller].actions[yOSON.action]
//dataTemplate[yOSON.modulo][yOSON.controller][yOSON.action]


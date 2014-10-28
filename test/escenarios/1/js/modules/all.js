yOSON.AppCore.addModule("accordion_effect", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: '',
      divAction: '.accordion',
      classOpenWrap: 'open',
      classCloseWrap: 'close',
      divIcon: '.icon-tiny',
      classOpen: 'up',
      classClose: 'down'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.divAction = $(this.st.divAction, this.st.context);
    },
    suscribeEvents: function() {
      this.dom.divAction.on('click', {
        inst: this
      }, this.eShowHideWrap);
    },
    eShowHideWrap: function(event) {
      var row, st, that, wrap, _this;
      event.stopPropagation();
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      wrap = _this.next();
      row = _this.find(st.divIcon);
      if (wrap.hasClass(st.classOpenWrap)) {
        wrap.slideUp('fast', function() {
          wrap.removeClass(st.classOpenWrap).addClass(st.classCloseWrap);
          row.addClass(st.classOpen).removeClass(st.classClose);
        });
      }
      if (wrap.hasClass(st.classCloseWrap)) {
        wrap.slideDown('fast', function() {
          wrap.removeClass(st.classCloseWrap).addClass(st.classOpenWrap);
          row.addClass(st.classClose).removeClass(st.classOpen);
        });
      }
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("busqueda_principal", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      frmSearch: '#frmSearch',
      btnSearch: '#btnSearch',
      txtSearch: '#fWordRS',
      filters: '.form-search',
      options: 'input:checkbox,input:radio',
      divModal: '#alertSearch',
      btnMotal: '.btn-primary',
      btnClose: '.closeWM',
      divMask: '.mask-search',
      url: '/buscar',
      isGet: false
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.frmSearch = $(this.st.frmSearch);
      this.dom.btnSearch = $(this.st.btnSearch, this.dom.frmSearch);
      this.dom.txtSearch = $(this.st.txtSearch, this.dom.frmSearch);
      this.dom.filters = $(this.st.filters);
      this.dom.options = $(this.st.options, this.dom.filters);
      this.dom.divModal = $(this.st.divModal);
      this.dom.btnMotal = $(this.st.btnMotal, this.dom.divModal);
      this.dom.btnClose = $(this.st.btnClose, this.dom.divModal);
      this.dom.divMask = $(this.st.divMask);
    },
    suscribeEvents: function() {
      this.dom.btnSearch.on('click', {
        inst: this
      }, this.eSearch);
      this.dom.btnMotal.on('click', {
        inst: this
      }, this.eSearch);
      this.dom.btnClose.on('click', {
        inst: this
      }, this.eCloseModal);
      this.dom.options.on('change', {
        inst: this
      }, this.eChangeOptions);
    },
    eSearch: function(event) {
      var data, dom, query, st, that, url, value;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      dom = that.dom;
      if (st.isGet) {
        dom.frmSearch.trigger('submit');
        return;
      }
      value = dom.txtSearch.val();
      query = '';
      url = '';
      data = '';
      $.each(dom.filters, function(i, elem) {
        var arrChecks, collection, flag, valData;
        elem = $(elem);
        arrChecks = elem.find(st.options);
        valData = '';
        flag = false;
        collection = [];
        $.each(arrChecks, function(i, chkTag) {
          var valueData;
          chkTag = $(chkTag);
          valueData = chkTag.val();
          if (chkTag.is(':checked') && $.inArray(valueData, collection) === -1) {
            flag = true;
            valData = valData + valueData + '--';
            collection.push(valueData);
          }
        });
        url = (flag ? '/' + elem.data('type') + '/' : '');
        valData = valData.substring(0, valData.length - 2);
        data = data + url + valData;
      });
      if (value !== '') {
        query = '/q/' + value;
      }
      window.location = yOSON.baseHost + st.url + query + data;
    },
    eChangeOptions: function(event) {
      var dom, that;
      that = event.data.inst;
      dom = that.dom;
      dom.divModal.show();
      dom.divMask.show();
    },
    eCloseModal: function(event) {
      var dom, that;
      that = event.data.inst;
      dom = that.dom;
      dom.divModal.hide();
      dom.divMask.hide();
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("file_uploader", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      frm: null,
      wrapFile: '#divWrapFile',
      customFil: {
        classesButton: 'btn btn-option',
        classesInput: 'customfile-filename',
        txtBtn: 'Sube tu foto',
        placeholder: 'Elige un archivo'
      },
      btnDelete: '#divDelFot',
      divImage: '#divImage',
      divInformationCv: '.message_upcv',
      filLogo: '#txtLogo',
      hidGaq: '#hidGaq',
      isImage: true,
      maxFileSize: '#MAX_FILE_SIZE',
      messageSize: '500kb',
      messageType: 'El archivo debe ser JPG o PNG.',
      regex: /\.(jpg|jpeg|png)$/i,
      response: '.response',
      srcDefault: yOSON.statHost + '/images/empresa/photoEmpDefault.jpg',
      urlDelete: '/empresa/registro-empresa/eliminarfoto',
      urlGetToken: '/registro/obtener-token/',
      urlUpload: '/registro/cargafoto/modulo/' + yOSON.modulo
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    beforeCathDom: function() {
      if ($('#' + this.st.frm).length === 0) {
        this.st.frm = document.forms[0].getAttribute('id');
      }
    },
    catchDom: function() {
      this.dom.frm = $('#' + this.st.frm);
      this.dom.wrapFile = $(this.st.wrapFile);
      this.dom.filLogo = $(this.st.filLogo, this.dom.wrapFile);
      this.dom.divImage = $(this.st.divImage, this.dom.wrapFile);
      this.dom.divInformationCv = $(this.st.divInformationCv);
      this.dom.btnDelete = $(this.st.btnDelete, this.dom.wrapFile);
      this.dom.response = $(this.st.response, this.dom.wrapFile);
      this.dom.maxFileSize = $(this.st.maxFileSize, this.dom.wrapFile);
      this.dom.hidGaq = $(this.st.hidGaq, this.dom.wrapFile);
    },
    afterCathDom: function() {
      this.dom.filLogo.customFile({
        classesButton: this.st.customFil.classesButton,
        classesInput: this.st.customFil.classesInput,
        txtBtn: this.st.customFil.txtBtn,
        placeholder: this.st.customFil.placeholder
      });
    },
    suscribeEvents: function() {
      this.dom.filLogo.on('change', {
        inst: this
      }, this.eValidateFile);
      this.dom.btnDelete.on('click', {
        inst: this
      }, this.eDeleteFile);
    },
    eValidateFile: function(event) {
      var dom, files, i, n, s, st, t, that, _this;
      that = event.data.inst;
      st = that.st;
      dom = that.dom;
      _this = $(this);
      dom.response.removeClass('bad');
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        files = event.originalEvent.target.files;
        i = 0;
        while (i < files.length) {
          n = files[i].name;
          s = files[i].size;
          t = files[i].type;
          if (s > dom.maxFileSize.val()) {
            dom.response.addClass('bad').text('El archivo "' + n + '" sobrepasa los ' + st.messageSize + ', seleccione otro.');
            dom.filLogo.val('');
          } else {
            that.fnUploadFile();
          }
          i++;
        }
      } else {
        that.fnUploadFile();
      }
    },
    eDeleteFile: function(event) {
      var dataAjax, dom, relID, st, that;
      that = event.data.inst;
      st = that.st;
      dom = that.dom;
      dataAjax = {};
      if (st.isImage) {
        relID = dom.btnDelete.data('rel');
        if (!dom.btnDelete.data('exits')) {
          dom.filLogo.val('');
          that.fnSuccesDelete();
          return false;
        }
        dataAjax.rel = relID;
      }
      utils.loader(dom.divImage, true, true);
      $.ajax({
        url: st.urlGetToken,
        type: 'POST',
        dataType: 'JSON',
        data: {
          csrfhash: $('body').attr('data-hash')
        },
        success: function(result) {
          dataAjax.csrfhash = result;
          $.ajax({
            type: 'POST',
            url: st.urlDelete,
            data: dataAjax,
            dataType: 'JSON',
            success: function(res) {
              utils.loader(dom.divImage, false, true);
              if (res.status === 1) {
                dom.filLogo.val('');
                if (!st.isImage) {
                  dom.divInformationCv.addClass('hide').find('.icon_doc').attr('href', '');
                } else {
                  that.fnSuccesDelete();
                }
              }
            },
            error: function(res) {
              utils.loader(dom.divImage, false, true);
            }
          });
        }
      });
    },
    fnUploadFile: function() {
      var dom, options, st;
      dom = this.dom;
      st = this.st;
      if (st.regex.test(dom.filLogo.val())) {
        utils.loader(dom.divImage, true, true);
        options = {
          frm: st.frm,
          onComplete: function(json) {
            var data;
            data = $.parseJSON(json);
            dom.frm.attr('action', '');
            dom.frm.attr('target', '');
            if (data['status'] === 1) {
              dom.response.text('');
              utils.loader(dom.divImage, false, true);
              $(':text', dom.wrapFile).val('');
              if (!st.isImage) {
                dom.divInformationCv.removeClass('hide').find('.icon_doc').attr('href', data['urlFile']);
              } else {
                dom.divImage.html('<img src="' + data['url'] + '">');
                dom.btnDelete.removeClass('hide');
              }
            } else {
              dom.response.addClass('bad').text(data['message']);
            }
          }
        };
        dom.frm.attr('action', st.urlUpload);
        $.fn.iframeUp('submit', options);
      } else {
        dom.filLogo.val('');
        dom.response.addClass('bad').text(st.messageType);
      }
    },
    fnSuccesDelete: function() {
      this.dom.divImage.html('<img src="' + this.st.srcDefault + '">');
      this.dom.btnDelete.addClass('hide');
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.beforeCathDom();
      this.catchDom();
      this.afterCathDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqIframeUp.js', '/src/libs/jquery/jqCustomfile.js']);

yOSON.AppCore.addModule("forgot_password", function(Sb) {
  var afterCathDom, catchDom, dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    contextLogin: '#loginP',
    context: '#cntForgotP',
    form: '#frmForgotPass',
    aForgot: '#forgotPass',
    aBack: '#backLogWM',
    response: '.response',
    txtEmail: '#textForgotP',
    button: '#sendForgotP',
    token: '#recuperar_token',
    rol: 'input[name="userPEI"]:checked',
    typeLoginF: '#typeLoginF',
    urlajax: '/auth/recuperar-clave/',
    regex: /^[\w-\.]+@[\w-]+(\.[A-Za-z_-]{2,4}){1,3}$/g
  };
  catchDom = function() {
    dom.context = $(st.context);
    dom.aForgot = $(st.aForgot);
    dom.token = $(st.token);
    dom.rol = $(st.rol);
    dom.form = $(st.form, dom.context);
    dom.aBack = $(st.aBack, dom.context);
    dom.txtEmail = $(st.txtEmail, dom.context);
    dom.response = $(st.response, dom.context);
    dom.button = $(st.button, dom.context);
    dom.typeLoginF = $(st.typeLoginF, dom.context);
  };
  afterCathDom = function() {
    if (window.location.hash.indexOf('recuperaClave') !== -1) {
      $.fancybox.open(st.context, {
        maxWidth: 460,
        minHeight: 162
      });
    }
  };
  suscribeEvents = function() {
    dom.aForgot.on('click', events.showWrapForgot);
    dom.aBack.on('click', events.showWrapLogin);
    dom.form.on('submit', events.executeForm);
  };
  events = {
    showWrapForgot: function(e) {
      $.fancybox.close();
      $.fancybox.open(st.context, {
        maxWidth: 460,
        minHeight: 162
      });
      dom.typeLoginF.text($(st.rol).val());
      dom.txtEmail.val('').focus();
      dom.response.text('');
    },
    showWrapLogin: function(e) {
      $.fancybox.close();
      $.fancybox.open(st.contextLogin, {
        minWidth: 705,
        padding: 0
      });
    },
    executeForm: function(e) {
      var value;
      e.preventDefault();
      value = $.trim(dom.txtEmail.val());
      st.regex.lastIndex = 0;
      if (!st.regex.test(value)) {
        dom.response.removeClass('good hide').addClass('bad').text('Debe ingresar su dirección e-mail.');
        return false;
      }
      utils.loader(dom.context, true, true);
      $.ajax({
        url: st.urlajax,
        type: 'POST',
        dataType: 'JSON',
        data: {
          email: value,
          recuperar_token: dom.token.val(),
          rol: $(st.rol).val()
        },
        success: function(res) {
          dom.token.val(res.hash_token);
          if (res.status === 'ok') {
            dom.response.removeClass('bad hide').addClass('good').text(res.msg);
            utils.loader(dom.context, false, true);
            setTimeout(function() {
              $.fancybox.close();
            }, 1000);
          } else {
            dom.response.removeClass('good hide').addClass('bad').text(res.msg);
            utils.loader(dom.context, false, true);
            dom.txtEmail.focus();
          }
        },
        error: function(res) {
          dom.response.removeClass('good hide').addClass('bad').text('Intente nuevamente');
          utils.loader(dom.context, false, true);
        }
      });
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    catchDom();
    afterCathDom();
    return suscribeEvents();
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqFancybox.js']);

yOSON.AppCore.addModule("lazy_load", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      wrap: '.recent-ads',
      parent: '#wrapper'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.wrap = $(this.st.wrap, this.st.parent);
    },
    afterCathDom: function() {
      this.dom.wrap.each(function(i, div) {
        var $div, imgsCollection;
        $div = $(div);
        imgsCollection = $div.find('img');
        return imgsCollection.each(function(i, e) {
          var $e, srcTemp;
          $e = $(e);
          srcTemp = $e.data('src');
          $e.removeAttr('data-src');
          return $e.attr('src', srcTemp);
        });
      });
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.afterCathDom();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("link_all_block", function(Sb) {
  var afterCatchDom, catchDom, dom, events, functions, initialize, st, suscribeEvents;
  dom = {};
  st = {
    blocks: '.types-membership .choose-ads',
    btnPrimary: '.btn-primary'
  };
  catchDom = function() {
    dom.blocks = $(st.blocks);
    dom.btnPrimary = $(st.btnPrimary);
  };
  afterCatchDom = function() {
    functions.fnPushHeight();
  };
  suscribeEvents = function() {
    dom.blocks.on('click', events.eRedirectBlock);
  };
  events = {
    eRedirectBlock: function(event) {
      var btn, _this;
      _this = $(this);
      btn = $(st.btnPrimary, _this);
      if (btn.hasClass('login_modal')) {
        if (!$(event.target).is(st.btnPrimary)) {
          btn.trigger('click');
        }
      } else {
        window.location.href = btn.attr('href');
      }
    }
  };
  functions = {
    fnPushHeight: function() {
      var arr;
      arr = [];
      $.each(dom.blocks, function(i, elem) {
        arr.push($(elem).outerHeight());
      });
      dom.blocks.css({
        'height': Math.max.apply(Math, arr),
        'cursor': 'pointer'
      });
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    catchDom();
    afterCatchDom();
    suscribeEvents();
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("mini_validate", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: null,
      rules: null,
      btn: '.wrap-btn .btn',
      divSkillTitle: '.skill-title',
      btnEdit: '.action-icons.edit',
      messageOk: '.',
      messageBad: 'No parece ser un campo válido.',
      messageReq: 'Campo Requerido',
      scrollActive: true
    };
    this.dom = {};
    this.op = op;
    this.collection = [];
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.context = $(this.st.context);
      this.dom.btn = $(this.st.btn, this.dom.context);
    },
    afterCatchDom: function() {
      if (this.st.rules === null) {
        this.st.rules = this.st.context;
      }
      $('input,textarea').on('keyup paste', this.eNoTypeScripts);
    },
    suscribeEvents: function() {
      this.dom.btn.on('click', {
        inst: this
      }, this.eValidate);
      this.dom.context.on('click', this.st.btnEdit, {
        inst: this,
        subContext: true
      }, this.eValidate);
    },
    eNoTypeScripts: function(event) {
      var regEx, value, _this;
      _this = $(this);
      regEx = /(<[^>]*>)/g;
      switch (event.type) {
        case 'keyup':
          value = _this.val();
          if (value.match(regEx)) {
            _this.val(value.replace(regEx, ''));
          } else {
            return false;
          }
          event.preventDefault();
          return false;
        case 'paste':
          setTimeout(function() {
            value = _this.val();
            if (value.match(regEx)) {
              return _this.val(value.replace(regEx, ''));
            } else {
              return false;
            }
          }, 100);
      }
    },
    eValidate: function(event) {
      var context, dom, st, that;
      that = event.data.inst;
      st = that.st;
      dom = that.dom;
      if (event.data.subContext) {
        context = $(this).parents(st.divSkillTitle).next();
      } else {
        context = that.dom.context;
      }
      that.collection = [];
      context.data('valid', false);
      that.fnScanningRules(that, context);
      return that.fnIsOrNotValidContext(that, context);
    },
    fnScanningRules: function(that, context) {
      var st;
      st = that.st;
      $.each(dataRules[st.rules], function(name, obj) {
        var _this;
        _this = $('[name$="' + name + '"]:visible', context);
        if (_this.length > 1) {
          $.each(_this, function(i, elem) {
            that.fnValidateRegex($(elem, context), obj);
          });
        } else if (_this.length === 1) {
          that.fnValidateRegex(_this, obj);
        }
      });
    },
    fnIsOrNotValidContext: function(that, context) {
      var eValidError, eValidSuccess, isAnyOkValid, st;
      st = that.st;
      isAnyOkValid = true;
      if (that.collection.length !== 0) {
        if (st.scrollActive) {
          $('html, body').animate({
            scrollTop: that.collection[0]
          }, 400);
        }
        eValidError = context.data('eValidError');
        if (eValidError !== void 0) {
          eValidError.call(this);
        }
        isAnyOkValid = false;
      } else {
        context.data('valid', true);
        eValidSuccess = context.data('eValidSuccess');
        if (eValidSuccess !== void 0) {
          eValidSuccess.call(this);
        }
      }
      return isAnyOkValid;
    },
    eValidateData: function(event) {
      var localName, value, _this;
      _this = $(this);
      value = _this.val();
      localName = _this[0].tagName;
      switch (localName) {
        case 'INPUT':
          if (value !== '') {
            event.data._message.addClass('hide');
          }
          break;
        case 'TEXTAREA':
          if (value !== '') {
            event.data._message.addClass('hide');
          }
          break;
        case 'SELECT':
          if (value !== 0) {
            event.data._message.addClass('hide');
          }
      }
    },
    fnValidateRegex: function(_this, obj) {
      var localName, message, position, regEx, value;
      message = _this.siblings('.response');
      position = parseInt(_this.offset().top) - 20;
      if (_this.hasClass('waiting')) {
        message.addClass('bad').removeClass('hide good').text(this.st.messageBad);
        this.collection.push(position);
      } else if (!_this.is(':disabled')) {
        value = $.trim(_this.val());
        regEx = this.fnOptionRegex(obj.type);
        localName = _this[0].tagName;
        _this.off('blur');
        _this.on('blur', {
          _message: message
        }, this.eValidateData);
        message.addClass('hide');
        if ((localName === 'INPUT' && value !== '') || (localName === 'SELECT' && value !== '0') || (localName === 'TEXTAREA' && value !== '')) {
          if (!regEx.test(value)) {
            message.addClass('bad').removeClass('hide good').text(this.st.messageBad);
            this.collection.push(position);
          } else {
            message.text('');
          }
        } else {
          if (typeof obj.require !== "undefined" && obj.require) {
            message.addClass('bad').removeClass('hide good').text(this.st.messageReq);
            this.collection.push(position);
          } else {
            message.text('');
          }
        }
      }
    },
    fnOptionRegex: function(type) {
      var regEx;
      if (type) {
        switch (type) {
          case 'number':
            regEx = /^[0-9]+$/g;
            break;
          case 'text':
            regEx = /^[a-z ñáéíóúÑÁÉÍÓÚ\,\n\r]+$/gi;
            break;
          case 'decimal':
            regEx = /^[0-9\.]+$/g;
            break;
          case 'email':
            regEx = /^(([a-z0-9_.-])+@([a-z-9_\.-])+\.([a-z])+([a-z])+)?$/gi;
            break;
          case 'celular':
            regEx = /^(\+?\d{2})?[\s#]?(\d{1,2})?(\d{9})$/g;
            break;
          case 'phone':
            regEx = /^(\+){0,1}(\d|\s|\(|\)){7,10}$/;
            break;
          case 'url':
            regEx = /^(http:\/\/)?([a-z0-9\-]+\.)?[a-z0-9\-]+\.[a-z0-9]{2,4}(\.[a-z0-9]{2,4})?(\/.*)?$/i;
            break;
          case 'phoneAll':
            regEx = /[^0-9 \.\(\)\-]/g;
            break;
          default:
            regEx = /^[a-z0-9 ñáéíóúÑÁÉÍÓÚ\@\&\_\.\,\-\(\)\?\¿\¡\!\°\/\n\r]+$/gi;
        }
      } else {
        regEx = /^[a-z0-9 ñáéíóúÑÁÉÍÓÚ\@\&\_\.\,\-\(\)\?\¿\¡\!\/\°\n\r]+$/gi;
      }
      return regEx;
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.afterCatchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    if (oP.hasOwnProperty('Perfil_postulante')) {
      $.each(oP["Perfil_postulante"], function(i, obj) {
        var instance;
        instance = new factory(obj);
        instance.execute();
      });
    } else {
      $.each(oP, function(i, obj) {
        var instance;
        instance = new factory(obj);
        instance.execute();
      });
    }
  };
  return {
    init: initialize
  };
}, ['src/libs/yoson/data/rulesValidate.js']);

yOSON.AppCore.addModule("modal_all", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      classDefault: '.fancy_modal',
      maxWidth: 482,
      maxHeight: 480
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.classDefault = $(this.st.classDefault);
    },
    afterCatchDom: function() {
      var dom, st, that;
      that = this;
      st = that.st;
      dom = that.dom;
      dom.classDefault.fancybox({
        maxWidth: st.maxWidth,
        maxHeight: st.maxHeight,
        helpers: {
          title: null
        }
      });
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.afterCatchDom();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqFancybox.js']);

yOSON.AppCore.addModule("modal_contact", function(Sb) {
  var afterCatchDom, catchDom, dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    modal: '#divWrapSelection',
    frm: '#frmContacSelection',
    btnModal: '#btnSendContact',
    btnInput: '.btn_contact',
    urlAjax: '/empresa/home/send-seleccion',
    response: '.response',
    txaMessage: '#txaMessage',
    hidData: '#hidMembresia'
  };
  catchDom = function() {
    dom.modal = $(st.modal);
    dom.btnInput = $(st.btnInput);
    dom.btnModal = $(st.btnModal, dom.modal);
    dom.frm = $(st.frm, dom.modal);
    dom.response = $(st.response, dom.modal);
    dom.txaMessage = $(st.txaMessage, dom.modal);
    dom.hidData = $(st.hidData, dom.modal);
  };
  afterCatchDom = function() {
    dom.frm.parsley();
  };
  suscribeEvents = function() {
    dom.btnInput.on('click', events.eShowModal);
    dom.frm.on('submit', events.eSubmit);
    dom.frm.parsley().subscribe('parsley:form:validate', events.eValidateForm);
  };
  events = {
    eShowModal: function(e) {
      $.fancybox.open(st.modal, {
        maxWidth: 482,
        maxHeight: 480,
        afterClose: function() {
          dom.frm.parsley().reset();
          dom.btnModal.attr('disabled', false);
          dom.btnModal.siblings(dom.response).addClass('hide');
        }
      });
      dom.hidData.val($(this).data('type'));
    },
    eSubmit: function(e) {
      e.preventDefault();
    },
    eValidateForm: function(formInstance) {
      if (formInstance.isValid()) {
        utils.loader(dom.frm, true, true);
        dom.btnModal.attr('disabled', true);
        $.ajax({
          url: st.urlAjax,
          type: 'POST',
          dataType: 'JSON',
          data: dom.frm.serialize(),
          success: function(response) {
            if (response.status === 'ok') {
              dom.btnModal.siblings(dom.response).removeClass('bad hide').addClass('good').text('Datos Enviados correctamente.');
              utils.loader(dom.frm, false, true);
              setTimeout(function() {
                $.fancybox.close();
                location.reload();
              }, 1000);
            } else {
              dom.btnModal.siblings(dom.response).removeClass('good hide').addClass('bad').text('Ingrese sus datos correctamente.');
              utils.loader(dom.frm, false, true);
            }
            dom.btnModal.attr('disabled', false);
          },
          error: function(response) {
            utils.loader(dom.frm, false, true);
          }
        });
      } else {
        $.fancybox.update();
        $.fancybox.reposition();
      }
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    catchDom();
    suscribeEvents();
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqFancybox.js']);

yOSON.AppCore.addModule("modal_login", function(Sb) {
  var afterCatchDom, catchDom, collection, dom, events, functions, initialize, st, suscribeEvents;
  st = {
    context: '#loginP',
    closeModal: '.icon-close',
    form: '#fLoginWMH',
    btnLogin: '.login_modal',
    btnSignIn: '#btnSignIn',
    divResponse: '.respW',
    divRespLogin: '#divRespLogin',
    divLoader: '.loading',
    txtEmail: '#wmMail',
    txtPass: '#wmPass',
    chkSave: '#saveKeyWM',
    chkTipo: 'input[name="userPEI"]',
    divPostulant: '.postulant',
    divCompany: '.company',
    divRegister: '.is-register',
    hidTarifa: '#hideLoginReg',
    hidToken: 'input#auth_token',
    hidReturn: 'input#return',
    returnPos: '/mi-cuenta',
    returnEmp: '/empresa/mi-cuenta',
    returnNormal: null,
    urlAjax: '/auth/login-ajax/'
  };
  dom = {};
  collection = [];
  catchDom = function() {
    dom.context = $(st.context);
    dom.closeModal = $(st.closeModal, st.context);
    dom.form = $(st.form);
    dom.txtEmail = $(st.txtEmail, dom.form);
    dom.txtPass = $(st.txtPass, dom.form);
    dom.chkSave = $(st.chkSave, dom.form);
    dom.chkTipo = $(st.chkTipo, dom.form);
    dom.btnSignIn = $(st.btnSignIn, dom.form);
    dom.divResponse = $(st.divResponse, dom.form);
    dom.divRespLogin = $(st.divRespLogin, dom.form);
    dom.btnLogin = $(st.btnLogin);
    dom.divLoader = $(st.divLoader, st.context);
    dom.divPostulant = $(st.divPostulant, st.context);
    dom.divCompany = $(st.divCompany, st.context);
    dom.divRegister = $(st.divRegister, st.context);
    dom.hidTarifa = $(st.hidTarifa, st.form);
    dom.hidToken = $(st.hidToken, st.form);
    dom.hidReturn = $(st.hidReturn, st.form);
  };
  afterCatchDom = function() {
    st.returnNormal = dom.hidReturn.val();
    if (window.location.hash.indexOf('loginP') !== -1) {
      $.fancybox.open(st.context, {
        minWidth: 705,
        padding: 0
      });
    }
  };
  suscribeEvents = function() {
    dom.btnLogin.on('click', events.loginAction);
    dom.btnSignIn.on('click', events.signInAction);
    dom.chkTipo.on('click', events.onChangeChk);
    dom.closeModal.on('click', events.onCloseModal);
  };
  events = {
    loginAction: function() {
      var _this;
      _this = $(this);
      dom.btnLogin.fancybox({
        minWidth: 705,
        padding: 0,
        arrows: false
      });
      dom.hidReturn.val(st.returnNormal);
      dom.hidTarifa.val('');
      dom.chkTipo.removeAttr('checked');
      if (yOSON.modulo === 'empresa') {
        $(st.chkTipo + '[value="empresa"]').attr('checked', true);
        dom.hidReturn.val(st.returnEmp);
      } else {
        $(st.chkTipo + '[value="postulante"]').attr('checked', true);
        dom.hidReturn.val(st.returnPos);
      }
      if (_this.data('id') !== void 0) {
        dom.hidTarifa.val(_this.data('id'));
      }
      if (_this.data('href') !== void 0) {
        dom.hidReturn.val(_this.data('href'));
      }
    },
    signInAction: function(e) {
      var flagIdSct, _this;
      e.preventDefault();
      _this = $(this);
      flagIdSct = $.trim(_this.attr('id'));
      if (!functions.validateEmail(dom.txtEmail) || !functions.validatePassword(dom.txtPass)) {
        return false;
      }
      dom.divResponse.text('');
      dom.divRespLogin.removeClass('bad').text('');
      dom.txtEmail.attr('disabled', true);
      dom.txtPass.attr('disabled', true);
      dom.btnSignIn.attr('disabled', true);
      dom.chkTipo.attr('disabled', true);
      dom.divLoader.addClass('active');
      $.ajax({
        url: st.urlAjax,
        type: 'POST',
        dataType: 'json',
        data: {
          userEmail: dom.txtEmail.val(),
          userPass: dom.txtPass.val(),
          tipo: $(st.chkTipo + ':checked', st.form).val(),
          auth_token: dom.hidToken.val(),
          id_tarifa: dom.hidTarifa.val(),
          save: Number(dom.chkSave.is(':checked'))
        },
        success: function(response) {
          if (response.status === 'ok') {
            dom.divLoader.css('background-image', 'none');
            dom.divLoader.find('.title').show();
            window.location = dom.hidReturn.val();
            if (window.location.hash === '#questionsWM') {
              window.location.reload();
            }
          } else {
            dom.txtEmail.attr('disabled', false);
            dom.txtPass.attr('disabled', false);
            dom.btnSignIn.attr('disabled', false);
            dom.chkTipo.attr('disabled', false);
            dom.divLoader.removeClass('active');
            dom.divRespLogin.addClass('bad').text(response.msg);
          }
        },
        error: function(response) {
          dom.form.removeClass('hide');
          dom.divRespLogin.text('Datos inválidos.');
        }
      });
    },
    onChangeChk: function() {
      var value;
      value = $(this).val();
      if (value === 'empresa') {
        dom.divCompany.addClass('active');
        dom.divPostulant.removeClass('active');
        dom.divRegister.addClass('hide');
        dom.hidReturn.val(st.returnEmp);
      } else if (value === 'postulante') {
        dom.divCompany.removeClass('active');
        dom.divPostulant.addClass('active');
        dom.divRegister.removeClass('hide');
        dom.hidReturn.val(st.returnPos);
      }
    },
    onCloseModal: function() {
      dom.context.removeClass('forgot-email');
    }
  };
  functions = {
    validatePassword: function(e) {
      var current, divResp, okL, value, _this;
      current = e.currentTarget || e[0];
      _this = $(current);
      value = $.trim(_this.val());
      divResp = _this.siblings('.respW');
      okL = 'readyLogin';
      if (value !== '') {
        _this.addClass(okL);
        divResp.addClass('good').removeClass('bad hide def').text('.');
        return true;
      } else {
        _this.removeClass(okL);
        divResp.addClass('bad').removeClass('good hide def').text('Debe ingresar una contraseña válida.');
        return false;
      }
    },
    validateEmail: function(e) {
      var current, divResp, okL, regEx, value, _this;
      current = e.currentTarget || e[0];
      _this = $(current);
      regEx = /^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/g;
      value = $.trim(_this.val());
      divResp = _this.siblings('.respW');
      okL = 'readyLogin';
      if (regEx.test(value) && value !== '') {
        divResp.removeClass('bad hide').addClass('good').text('.');
        _this.addClass(okL);
        return true;
      } else {
        divResp.removeClass('good hide').addClass('bad').text('Debe ingresar su dirección e-mail.');
        _this.removeClass(okL);
        return false;
      }
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    catchDom();
    afterCatchDom();
    suscribeEvents();
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqFancybox.js']);

yOSON.AppCore.addModule("modal_register", function(Sb) {
  var catchDom, dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    modal: '#regP',
    radioName: 'input:radio[name=userPE]',
    btnRegister: '.btn_register',
    button: '.btn'
  };
  catchDom = function() {
    dom.modal = $(st.modal);
    dom.btnRegister = $(st.btnRegister);
    dom.radioName = $(st.radioName, dom.modal);
    dom.button = $(st.button, dom.modal);
  };
  suscribeEvents = function() {
    dom.radioName.on('click', events.eToggleOption);
    dom.btnRegister.on('click', events.eShowModalRegister);
  };
  events = {
    eShowModalRegister: function(e) {
      $.fancybox.open(st.modal, {
        maxWidth: 326
      });
    },
    eToggleOption: function(e) {
      var value;
      value = $(this).val();
      if (value === 'Pos') {
        dom.button.attr('href', '/registro');
      } else if (value === 'Emp') {
        dom.button.attr('href', '/empresa/registro-empresa');
      }
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    catchDom();
    suscribeEvents();
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqFancybox.js']);

yOSON.AppCore.addModule("open_close_view_more", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      enviroment: '.option-list',
      aViewMore: '.view-more',
      divWrapMore: '.more_options',
      divOverflow: '.flow-list',
      textOpen: 'Ver todos',
      textClose: 'Ver menos',
      classOpen: 'openIt',
      flag: true
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.aViewMore = $(this.st.aViewMore);
    },
    suscribeEvents: function() {
      this.dom.aViewMore.on('click', {
        inst: this
      }, this.eToggleAcordion);
    },
    eToggleAcordion: function(event) {
      var divOverflow, divWrapMore, parent, st, that, _this;
      event.stopPropagation();
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      parent = _this.parents(st.enviroment);
      divWrapMore = $(st.divWrapMore, parent);
      divOverflow = $(st.divOverflow, parent);
      if (_this.hasClass(st.classOpen)) {
        _this.removeClass(st.classOpen);
        divWrapMore.stop(true, true).slideUp('meddium', function() {
          _this.text(st.textOpen);
          divOverflow.removeAttr('style');
        });
      } else {
        divOverflow.css('height', parseInt(divOverflow.height()));
        _this.addClass(st.classOpen);
        divWrapMore.stop(true, true).slideDown('meddium', function() {
          _this.text(st.textClose);
        });
      }
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("placeholder_ie", function(Sb) {
  var afterCathDom, catchDom, dom, events, initialize, st;
  dom = {};
  st = {
    inputs: ':text,textarea',
    "class": 'hasPlaceholder',
    frmAll: 'form'
  };
  catchDom = function() {
    dom.inputs = $(st.inputs);
    dom.frmAll = $(st.frmAll);
  };
  afterCathDom = function() {
    if (!$.support.cors) {
      dom.inputs.on('focus', events.onFocus);
      dom.inputs.on('blur', events.onBlur);
      dom.frmAll.on('submit', events.onSubmit);
      dom.inputs.blur();
      $(document.activeElement).focus();
    }
  };
  events = {
    onFocus: function(e) {
      var _this;
      _this = $(this);
      if (_this.attr('placeholder') !== '' && _this.val() === _this.attr('placeholder')) {
        _this.val('').removeClass('hasPlaceholder');
      }
    },
    onBlur: function(e) {
      var _this;
      _this = $(this);
      if (_this.attr('placeholder') !== '' && (_this.val() === '' || _this.val() === _this.attr('placeholder'))) {
        _this.val(_this.attr('placeholder')).addClass('hasPlaceholder');
      }
    },
    onSubmit: function(e) {
      $(this).find('.hasPlaceholder').each(function() {
        var i;
        i = $(this);
        if (i.val() === i.attr('placeholder')) {
          i.val('');
        }
      });
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    catchDom();
    afterCathDom();
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("plugin_switcher", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: '.dataGrid',
      checkSwitchWrap: '.checkSwitchWrap',
      inputAction: '.checkSwitch',
      templateHtmlTitle: null,
      urlAjaxOn: '/admin/gestion/mostrar-aviso-portada',
      urlAjaxOff: '/admin/gestion/quitar-aviso-portada'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.inputAction = $(this.st.inputAction);
      this.dom.context = $(this.st.context);
      this.dom.checkSwitchWrap = $(this.st.checkSwitchWrap);
    },
    afterCatchDom: function() {
      this.st.templateHtmlTitle = dataTemplate['plugins'].switcher_check;
      this.fnBuildSwitcher();
    },
    suscribeEvents: function() {
      $(document).on('click', this.st.inputAction, {
        inst: this
      }, this.eChange);
    },
    eChange: function(event) {
      var chkInput, dataAjax, dom, st, that, _this;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      dom = that.dom;
      _this = $(this);
      chkInput = $('input[type=checkbox]', _this);
      dataAjax = {
        rel: chkInput.data('rel')
      };
      if (_this.hasClass('off')) {
        dataAjax['url'] = st.urlAjaxOn;
        dataAjax['type'] = 'on';
      } else if (_this.hasClass('on')) {
        dataAjax['url'] = st.urlAjaxOff;
        dataAjax['type'] = 'off';
      }
      that.fnCheckAction(_this, chkInput);
      that.fnExecAjax(_this, dataAjax);
    },
    fnExecAjax: function(_this, dataAjax) {
      var dom, st, that;
      that = this;
      dom = that.dom;
      st = that.st;
      utils.loader(_this.parent(), true, false, 'bgTrasparent');
      $.fancybox.showLoading();
      $.ajax({
        url: dataAjax.url,
        type: 'POST',
        dataType: 'JSON',
        data: {
          idAviso: dataAjax.rel
        },
        success: function(res) {
          utils.loader(_this.parent(), false, false, 'bgTrasparent');
          $.fancybox.hideLoading();
          utils.boxMessage(dom.context.parent(), 'prepend', res.msg, 2000);
          if (res.success === 0) {
            that.fnCheckAction(_this, $('input[type=checkbox]', _this));
          }
        },
        error: function(res) {
          $.fancybox.hideLoading();
          utils.boxMessage(dom.context.parent(), 'prepend', res.msg, 2000);
        }
      });
    },
    fnBuildSwitcher: function() {
      var dom, st, that;
      that = this;
      dom = that.dom;
      st = that.st;
      if (dom.inputAction.is(':checked')) {
        dom.inputAction.wrap('<div class="checkSwitch on" />');
      } else {
        dom.inputAction.wrap('<div class="checkSwitch off" />');
      }
      dom.inputAction.parent().append(st.templateHtmlTitle);
    },
    fnCheckAction: function(_this, chkInput) {
      if (_this.hasClass('off')) {
        _this.addClass('on').removeClass('off');
        chkInput.attr('checked', true);
      } else if (_this.hasClass('on')) {
        _this.addClass('off').removeClass('on');
        chkInput.attr('checked', false);
      }
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.afterCatchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, ['src/libs/underscore.js']);

yOSON.AppCore.addModule("show_tooltip", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      tagInput: '.tooltip_ui'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.tagInput = $(this.st.tagInput);
    },
    showTooltip: function() {
      this.dom.tagInput.tooltip({
        position: {
          my: "center bottom-20",
          at: "center top",
          using: function(position, feedback) {
            $(this).css(position);
            $("<div>").addClass("arrow").addClass(feedback.vertical).addClass(feedback.horizontal).appendTo(this);
          }
        }
      });
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.showTooltip();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqUIcustom.js']);

yOSON.AppCore.addModule("unique_click", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      frm: null,
      btn: null
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.frm = $(this.st.frm);
      this.dom.btn = $(this.st.btn);
    },
    suscribeEvents: function() {
      this.dom.btn.on('click', {
        inst: this
      }, this.eValidateKey);
    },
    eValidateKey: function(event) {
      var dom, tagName, that, _this;
      event.preventDefault();
      that = event.data.inst;
      dom = that.dom;
      _this = $(this);
      if (_this[0].clicked !== void 0) {
        return;
      }
      tagName = _this[0].tagName;
      if (tagName === 'A') {
        window.location = _this.attr('href');
      } else if ((tagName === 'INPUT') || (tagName === 'BUTTON')) {
        try {
          dom.frm.trigger('submit');
        } catch (_error) {
          console.log('Require tag <> form');
        }
      }
      _this[0].clicked = true;
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("validate_input_ajax", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: null,
      txtInput: '',
      classLoading: 'input_loading',
      classError: 'parsley-error',
      classSuccess: 'parsley-success',
      divMessage: '.parsley_info',
      urlGetToken: '/registro/obtener-token/',
      urlAjaxValidate: '',
      dataAjaxAttr: {},
      dataAjax: {},
      xhrGetToken: null,
      xhrValidateInput: null
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.context = $(this.st.context);
      this.dom.txtInput = $(this.st.txtInput, this.dom.context);
    },
    suscribeEvents: function() {
      this.dom.context.on('keyup', this.st.txtInput, {
        inst: this
      }, this.eCleanMessages);
      this.dom.context.on('blur', this.st.txtInput, {
        inst: this
      }, this.eValidateInput);
    },
    eCleanMessages: function(event) {
      var st, that, _this;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      _this.removeClass(st.classLoading + ' ' + st.classSuccess);
      that.fnCleanXhrs();
      utils.responseParsley('error', false, _this.siblings(st.divMessage));
      utils.responseParsley('success', false, _this.siblings(st.divMessage));
    },
    eValidateInput: function(event) {
      var st, that, _this;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      if (_this.hasClass(st.classSuccess)) {
        _this.addClass(st.classLoading + ' waiting');
        that.fnCleanXhrs();
        that.fnGetToken(_this);
      }
    },
    fnCleanXhrs: function() {
      var st, that;
      that = this;
      st = that.st;
      if (st.xhrGetToken) {
        st.xhrGetToken.abort();
      }
      if (st.xhrValidateInput) {
        st.xhrValidateInput.abort();
      }
    },
    fnGetToken: function(_this) {
      var st, that;
      that = this;
      st = that.st;
      st.xhrGetToken = $.ajax({
        url: st.urlGetToken,
        type: 'POST',
        dataType: 'json',
        success: function(result) {
          st.dataAjax.token = result;
          that.fnPutInObject(_this);
          that.fnValidateInputAjax(_this);
        }
      });
    },
    fnPutInObject: function(_this) {
      var st, that;
      that = this;
      st = that.st;
      $.each(st.dataAjaxAttr, function(alias, value) {
        st.dataAjax[alias] = _this.attr(value);
      });
    },
    fnValidateInputAjax: function(_this) {
      var st, that;
      that = this;
      st = that.st;
      st.xhrValidateInput = $.ajax({
        url: st.urlAjaxValidate,
        type: 'POST',
        data: st.dataAjax,
        dataType: 'json',
        success: function(response) {
          _this.removeClass(st.classLoading + ' ' + st.classSuccess);
          if (response.status === true) {
            _this.removeClass('waiting');
            utils.responseParsley('success', true, _this.siblings(st.divMessage), response.msg);
          } else {
            utils.responseParsley('error', true, _this.siblings(st.divMessage), response.msg);
          }
        },
        error: function(response) {
          _this.removeClass(st.classLoading + ' ' + st.classSuccess);
          utils.responseParsley('error', true, _this.siblings(st.divMessage), 'Error en la solicitud');
        }
      });
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("validate_key", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      txtInput: null,
      type: null
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.txtInput = $(this.st.txtInput);
    },
    suscribeEvents: function() {
      $(document).on('keyup', this.st.txtInput, {
        inst: this
      }, this.eValidateKey);
      $(document).on('blur', this.st.txtInput, {
        inst: this
      }, this.eValidateKey);
      $(document).on('paste', this.st.txtInput, {
        inst: this
      }, this.eValidatePaste);
    },
    eValidateKey: function(event) {
      var regEx, st, that, value, _this;
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      value = _this.val();
      regEx = that.fnOptionRegex(st.type);
      if (value.match(regEx)) {
        _this.val(value.replace(regEx, ''));
      } else {
        return false;
      }
      event.preventDefault();
    },
    eValidatePaste: function(event) {
      var regEx, st, that, _this;
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      regEx = that.fnOptionRegex(st.type);
      setTimeout((function() {
        var value;
        value = _this.val();
        if (value.match(regEx)) {
          _this.val(value.replace(regEx, ''));
        } else {
          return false;
        }
      }), 100);
    },
    fnOptionRegex: function(type) {
      var regEx;
      switch (type) {
        case 'number':
          regEx = /[^0-9]/g;
          break;
        case 'text':
          regEx = /[^a-z ñáéíóúÑÁÉÍÓÚ]/gi;
          break;
        case 'decimal':
          regEx = /[^0-9\.]/g;
          break;
        case 'no_arroba':
          regEx = /[@]/g;
          break;
        case 'all':
          regEx = /[^a-zA-Z0-9 ñáéíóúÑÁÉÍÓÚ\@\&\_\.\,\-\(\)]/g;
      }
      return regEx;
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("window_modal", function(Sb) {
  var afterCathDom, catchDom, collection, dom, events, functions, initialize, st, suscribeEvents;
  st = {
    winModal: '.winModal',
    mask: '#mask',
    divWindow: '.window',
    closeWM: '.closeWM'
  };
  dom = {};
  collection = [];
  catchDom = function() {
    dom.winModal = $(st.winModal);
    dom.mask = $(st.mask);
    dom.divWindow = $(st.divWindow);
    dom.closeWM = $(st.closeWM, dom.divWindow);
  };
  afterCathDom = function() {
    var hash, url;
    collection = ['#loginP'];
    hash = [''];
    if (window.location.hash.length > 1) {
      hash = $.trim(window.location.hash).split('-');
    }
    url = location.href.substring(7, location.href.length).split('/');
    if (hash.length > 0 && hash[0] !== '' && url[1].substring(0, url[1].length - 1) !== 'postulaciones') {
      if ($('body').find('"' + hash[0] + '"').size() > 0 && $.inArray(hash[0], collection) === -1) {
        $('html, body').animate({
          scrollTop: 0
        }, 'fast');
        functions.showWrapModal(hash[0]);
      }
      if (hash.length === 2) {
        $(hash[0] + ' input[name=return]').val(Base64.decode(hash[1]));
      }
    }
  };
  suscribeEvents = function() {
    $(document).on('click', st.mask, events.onClose);
    $(document).on('keyup', events.onClose);
    $(document).on('click', st.winModal, events.onShowModal);
    dom.closeWM.on('click', events.onCloseModal);
  };
  events = {
    onClose: function(e) {
      if (e.type === "keyup") {
        if (e.keyCode === 27) {
          dom.closeWM.trigger('click');
        }
      } else if (e.type === "click") {
        dom.closeWM.trigger('click');
      }
    },
    onCloseModal: function(e) {
      var content, inputsNRP, _this;
      e.preventDefault();
      _this = $(this);
      content = _this.parent();
      dom.mask.hide();
      dom.divWindow.hide();
      if (_this.hasClass('closeRegiFast')) {
        inputsNRP = content.find('input.inputRpm');
        $.each(inputsNRP, function(i, val) {
          var inptRPEA;
          inptRPEA = inputsNRP.eq(i);
          if ($.trim(inptRPEA.val()) !== '') {
            inptRPEA.val('').removeClass('ready bienRegFast malRegFast').parents('.placeHRel').find('.txtPlaceHR').removeClass('hide');
          } else {
            inptRPEA.val('').removeClass('ready bienRegFast malRegFast');
          }
        });
        content.find('.respW').removeClass('bad good').text('');
      }
    },
    onShowModal: function(e) {
      var hidReturn, _this;
      e.preventDefault();
      _this = $(this);
      if (!_this.hasClass('noScrollTop')) {
        $('html, body').animate({
          scrollTop: 0
        }, 'fast');
      }
      functions.showWrapModal(_this.attr('href'));
      hidReturn = _this.attr('return');
      if (hidReturn) {
        $('#return').val(hidReturn);
      }
    }
  };
  functions = {
    showWrapModal: function(wrap) {
      dom.mask.css({
        height: $(document).height()
      });
      dom.mask.fadeTo('fast', 0.80);
      dom.divWindow.hide();
      $(wrap).show();
    }
  };
  initialize = function(oP) {
    catchDom();
    afterCathDom();
    suscribeEvents();
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("animate_logo_companies", function(Sb) {
  var afterCathDom, catchDom, dom, functions, initialize, st;
  dom = {};
  st = {
    listOverflow: '#divCompanies',
    companyBox: 'li',
    rowContent: '.overview',
    viewport: '.viewport',
    divLookJobs: '#divLookJobs'
  };
  catchDom = function() {
    dom.listOverflow = $(st.listOverflow);
    dom.rowContent = $(st.rowContent, st.listOverflow);
    dom.companyBox = $(st.companyBox, st.listOverflow);
    dom.viewport = $(st.viewport, st.listOverflow);
    dom.divLookJobs = $(st.divLookJobs);
  };
  afterCathDom = function() {
    functions.fnAnimateLogoTCN();
    functions.fnAnimateLogoCompanies();
  };
  functions = {
    fnAnimateLogoTCN: function() {
      dom.divLookJobs.tinycarousel({
        buttons: false,
        interval: true,
        duration: 500
      });
    },
    fnAnimateLogoCompanies: function() {
      var clock, heightOver, heightRow, tmp;
      heightOver = 220;
      heightRow = parseInt(dom.rowContent.height()) - 40;
      tmp = 0;
      clock = void 0;
      if (!$.support.cors) {
        dom.rowContent.height(heightRow + 40);
      }
      if (dom.companyBox.size() > 14) {
        clock = setInterval(function() {
          tmp = tmp + heightOver;
          if (tmp >= heightRow) {
            tmp = 0;
          }
          dom.viewport.animate({
            scrollTop: tmp
          }, '500', 'swing');
        }, 5000);
      }
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
}, ['/src/libs/jquery/jqTinycarousel.js']);

yOSON.AppCore.addModule("applicant_registration", function(Sb) {
  var afterCathDom, catchDom, dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    frm: '#frmPostulantRegistration',
    selDocument: '#fSelDoc',
    txtDocument: '#txtDocument, #txtDocumentCe',
    txtPassword: '#txtPassword',
    txtRepeatPassword: '#txtRepeatPassword',
    btnPostulantRegister: '#btnPostulantRegister',
    divMessage: '.parsley_info',
    xhrGetToken: null,
    xhrValidateInput: null
  };
  catchDom = function() {
    dom.frm = $(st.frm);
    dom.selDocument = $(st.selDocument, dom.frm);
    dom.txtDocument = $(st.txtDocument, dom.frm);
    dom.txtPassword = $(st.txtPassword, dom.frm);
    dom.txtRepeatPassword = $(st.txtRepeatPassword, dom.frm);
    dom.btnPostulantRegister = $(st.btnPostulantRegister, dom.frm);
  };
  afterCathDom = function() {
    dom.txtPassword.pstrength();
    dom.txtPassword.trigger('keyup');
  };
  suscribeEvents = function() {
    dom.txtPassword.on('keyup', events.eCleanRepeatPassword);
    dom.selDocument.on('change', events.eChangeTypeDocument);
    dom.frm.on('submit', events.eSubmit);
    dom.frm.parsley().subscribe('parsley:form:validate', events.eValidateForm);
  };
  events = {
    eCleanRepeatPassword: function() {
      dom.txtRepeatPassword.val('');
    },
    eChangeTypeDocument: function() {
      dom.txtDocument.focus();
      dom.txtDocument.val('');
      dom.txtDocument.parsley().destroy();
      utils.responseParsley('error', false, dom.txtDocument.siblings(st.divMessage));
      utils.responseParsley('success', false, dom.txtDocument.siblings(st.divMessage));
      switch ($(this).val()) {
        case 'dni#8':
          dom.txtDocument.removeAttr('minlength');
          dom.txtDocument.attr({
            'id': 'txtDocument',
            'maxlength': '8',
            'data-parsley-minlength': '8',
            'data-parsley-type': 'digits',
            'data-parsley-minlength-message': 'El DNI debe ser de 8 dígitos',
            'data-parsley-type-message': 'Ingrese un DNI válido'
          }).addClass('number');
          break;
        case 'ce#15':
          dom.txtDocument.attr({
            'id': 'txtDocumentCe',
            'maxlength': '20',
            'minlength': '8',
            'data-parsley-minlength': '8',
            'data-parsley-type': 'alphanum',
            'data-parsley-minlength-message': 'Ingrese carné de extranjería válido',
            'data-parsley-type-message': 'Ingrese carné de extranjería válido'
          }).removeClass('number');
      }
      dom.txtDocument.parsley();
    },
    eSubmit: function(event) {
      event.preventDefault();
    },
    eValidateForm: function(formInstance) {
      if (formInstance.isValid()) {
        if ($('.waiting', dom.frm).size() === 0) {
          dom.btnPostulantRegister.attr('disabled', true);
          document.getElementById(st.frm.substring(1)).submit();
        } else {
          $('html, body').scrollTop(parseInt($('.waiting', dom.frm).offset().top) - 100);
        }
      }
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    catchDom();
    afterCathDom();
    suscribeEvents();
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqPstrength.min.js']);

yOSON.AppCore.addModule("autocomplete_text", function(Sb) {
  var dom, factory, initialize, st;
  factory = function(op) {
    this.st = {
      txtAutocomplete: '_institucion',
      selDepend: '_id_nivel_estudio',
      divWrap: '.skill-content',
      model: 'institucion',
      widthList: 252,
      classLoading: 'ui-autocomplete-loading',
      urlGetToken: '/registro/obtener-token/',
      urlAjax: '/mi-cuenta/busqueda-general/',
      xhrGetToken: null,
      xhrRequest: null
    };
    this.dom = {};
    this.op = op;
  };
  dom = {};
  st = factory.prototype = {
    eAutocomplete: function(event) {
      st = this.st;
      $('[name$="' + st.txtAutocomplete + '"]').autocomplete({
        source: function(request, response) {
          var value, wrap, _this;
          _this = this.element;
          value = _this.val();
          wrap = _this.parents(st.divWrap).parent();
          if (st.xhrGetToken) {
            st.xhrGetToken.abort();
          }
          if (st.xhrRequest) {
            st.xhrRequest.abort();
          }
          st.xhrGetToken = $.ajax({
            url: st.urlGetToken,
            type: 'POST',
            dataType: 'JSON',
            data: {
              csrfhash: $('body').attr('data-hash')
            },
            success: function(result) {
              st.xhrRequest = $.ajax({
                url: st.urlAjax,
                type: 'POST',
                dataType: 'JSON',
                data: {
                  csrfhash: result,
                  q: value,
                  model: st.model,
                  nivel: $('[name$="' + st.selDepend + '"]', wrap).val()
                },
                success: function(data) {
                  response($.map(data, function(item) {
                    return {
                      label: item.label,
                      value: item.value
                    };
                  }));
                  _this.removeClass(st.classLoading);
                },
                error: function(res) {}
              });
            }
          });
        },
        minLength: 3,
        open: function() {
          $(this).autocomplete("widget").addClass("txt_autocomplete").width(st.widthList);
          $(this).removeClass(st.classLoading);
        },
        close: function() {
          $(this).autocomplete("widget").removeClass("txt_autocomplete");
        },
        create: function() {
          $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
            return $("<li>").attr("data-value", item.value).append($("<a>").html(item.label)).appendTo(ul);
          };
        }
      });
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.eAutocomplete();
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

yOSON.AppCore.addModule("bar_animation", function(Sb) {
  var afterCathDom, dom, events, initialize, st;
  dom = {};
  st = {
    spanPercent: '.percent',
    divRank: '.rank',
    spanBar: '.rank span'
  };
  afterCathDom = function() {
    dom.spanPercent = $(st.spanPercent);
    dom.divRank = $(st.divRank);
    dom.spanBar = $(st.spanBar);
  };
  events = {
    eAnimationBar: function(e) {
      var i, percent, valueTime;
      percent = parseInt(dom.divRank.data('percent'));
      i = 0;
      valueTime = setInterval(function() {
        if (i <= percent) {
          dom.spanBar.css('width', i + '%');
          dom.spanPercent.html(i + '%');
          i++;
        } else {
          clearInterval(valueTime);
        }
      }, 10);
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    afterCathDom();
    events.eAnimationBar();
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("combos_depends", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: null,
      selParent: null,
      selChild: null,
      arrExceptions: [],
      jsonDefault: true,
      divskillContent: '.skill-content',
      urlGetToken: '/registro/obtener-token/',
      urlAjax: null,
      paramAjax: null,
      templateHtmlOption: null,
      xhrGetToken: null,
      xhrGetList: null
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.context = $(this.st.context);
    },
    afterCatchDom: function() {
      this.st.templateHtmlOption = dataTemplate['all'].tpl_options;
    },
    suscribeEvents: function() {
      this.dom.context.on('change', '[name$="' + this.st.selParent + '"]', {
        inst: this
      }, this.eShowHideOptions);
    },
    eShowHideOptions: function(event) {
      var parentWrap, selChild, st, that, valueParent, _this;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      valueParent = Number(_this.val());
      if (st.xhrGetToken) {
        st.xhrGetToken.abort();
      }
      if (st.xhrGetList) {
        st.xhrGetList.abort();
      }
      if ($.inArray(valueParent, st.arrExceptions) !== -1) {
        return;
      }
      parentWrap = _this.parents(st.divskillContent).parent();
      selChild = $('[name$="' + st.selChild + '"]', parentWrap);
      selChild.addClass('waiting').attr('disabled', true);
      if (valueParent === 0) {
        selChild.find('option:first').siblings().remove();
      }
      st.xhrGetToken = $.ajax({
        url: st.urlGetToken,
        type: 'POST',
        dataType: 'JSON',
        data: {
          csrfhash: $('body').attr('data-hash')
        },
        success: function(result) {
          var dataToAjax;
          dataToAjax = {
            csrfhash: result
          };
          dataToAjax[st.paramAjax] = valueParent;
          st.xhrGetList = $.ajax({
            url: st.urlAjax,
            type: 'POST',
            dataType: 'JSON',
            data: dataToAjax,
            success: function(response) {
              var anyData;
              anyData = true;
              if ($.isEmptyObject(response)) {
                anyData = false;
              } else {
                if (response.length === 0) {
                  anyData = false;
                }
              }
              if (anyData) {
                selChild.find('option:first').siblings().remove();
                $.each(response, function(i, data) {
                  var compiled_template, objModel;
                  if (st.jsonDefault) {
                    objModel = {
                      value: i,
                      data: data
                    };
                  } else {
                    $.each(data, function(i, v) {
                      objModel = {
                        value: v.id,
                        data: v.nombre
                      };
                    });
                  }
                  compiled_template = _.template(st.templateHtmlOption, objModel);
                  selChild.append(compiled_template);
                });
                selChild.attr('disabled', false);
              }
              selChild.removeClass('waiting');
            },
            error: function(res) {
              selChild.find('option:first').siblings().remove();
              selChild.removeClass('waiting').attr('disabled', true);
            }
          });
        }
      });
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

yOSON.AppCore.addModule("count_character", function(Sb) {
  var afterCatchDom, dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    input: '_comentarios',
    countLetter: '.count-letter',
    countChar: '#count-char',
    wrapSkills: '.wrap-skills',
    frmHorizontal: '.frm-horizontal',
    maxCharacter: 140
  };
  afterCatchDom = function() {
    if ($('> li', st.wrapSkills).length !== 0) {
      $.each($('> li', st.wrapSkills), function(i, elem) {
        var _thisCountChar, _thisInput;
        _thisInput = $('[id$="' + st.input + '"]', $(elem));
        _thisCountChar = $(st.countChar, $(elem));
        _thisCountChar.text(st.maxCharacter - _thisInput.val().length);
        _thisInput.on('keyup', events.eTypeWords);
      });
    } else {
      $(st.countChar).text(st.maxCharacter - $('[id$="' + st.input + '"]').val().length);
    }
  };
  suscribeEvents = function() {
    if ($('> li', st.wrapSkills).length !== 0) {
      $('.wrap-btn .btn', st.frmHorizontal).on('click', events.addSkill);
    } else {
      $(document).on('keyup', '[id$="' + st.input + '"]', events.eTypeWords);
    }
  };
  events = {
    addSkill: function() {
      var _thisInput;
      _thisInput = $('> li:last-child [id$="' + st.input + '"]', st.wrapSkills);
      _thisInput.on('keyup', events.eTypeWords);
    },
    eTypeWords: function(e) {
      var _this;
      _this = $(this);
      _this.siblings(st.countLetter).find(st.countChar).text(st.maxCharacter - _this.val().length);
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    afterCatchDom();
    suscribeEvents();
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("disable_combos", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      chkName: null,
      disableds: [],
      divWrap: '.skill-content'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    suscribeEvents: function() {
      $(document).on('change', '[name$="' + this.st.chkName + '"]', {
        inst: this
      }, this.onTagsDisableds);
    },
    onTagsDisableds: function(event) {
      var st, that, wrap, _this;
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      wrap = _this.parents(st.divWrap).parent();
      $.each(st.disableds, function(i, elemId) {
        var elem, localName;
        elem = $('[name$="' + elemId + '"]', wrap);
        localName = elem[0].tagName;
        switch (localName) {
          case 'INPUT':
            if (elem.attr('readonly')) {
              elem.attr('readonly', false);
            } else {
              elem.attr('readonly', true);
            }
            break;
          case 'SELECT':
            if (elem.is(':disabled')) {
              elem.attr('disabled', false);
            } else {
              elem.attr('disabled', true);
            }
        }
      });
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
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

yOSON.AppCore.addModule("featured_profile", function(Sb) {
  var afterCathDom, catchDom, dom, events, functions, initialize, st, suscribeEvents;
  dom = {};
  st = {
    frm: '#frmFeaturedProfile',
    rdTipoDoc: 'input[name="radioTipoDoc"]',
    divBoleta: '#divBoleta',
    divFactura: '#divFactura',
    txtRuc: '#txtRuc',
    txtName: '#txtName',
    selVia: '#selVia',
    txtLocation: '#txtLocation',
    btnPay: '#btnPay',
    hidEnteRuc: '#hidEnteRuc',
    hidRucAdecsys: '#hidRucAdecsys',
    classInputLoading: 'input_loading',
    classControlGroup: '.control-group',
    urlGetToken: '/registro/obtener-token/',
    urlAjax: '/perfil-destacado/valida-ruc-adecsys',
    xhrGetToken: null,
    xhrGetList: null
  };
  catchDom = function() {
    dom.frm = $(st.frm);
    dom.rdTipoDoc = $(st.rdTipoDoc, dom.frm);
    dom.divBoleta = $(st.divBoleta, dom.frm);
    dom.divFactura = $(st.divFactura, dom.frm);
    dom.txtRuc = $(st.txtRuc, dom.frm);
    dom.txtName = $(st.txtName, dom.frm);
    dom.btnPay = $(st.btnPay, dom.frm);
    dom.hidEnteRuc = $(st.hidEnteRuc, dom.frm);
    dom.hidRucAdecsys = $(st.hidRucAdecsys, dom.frm);
    dom.selVia = $(st.selVia, dom.frm);
    dom.txtLocation = $(st.txtLocation, dom.frm);
  };
  afterCathDom = function() {};
  suscribeEvents = function() {
    dom.rdTipoDoc.on('change', events.eChangeOption);
    dom.txtRuc.on('keyup', events.eSearchRucData);
  };
  events = {
    eChangeOption: function(e) {
      dom.divBoleta.toggle();
      dom.divFactura.toggle();
      dom.txtRuc.val('');
      dom.txtName.attr('readonly', false).val('');
      dom.selVia.attr('disabled', false).val('');
      dom.txtLocation.attr('readonly', false).val('');
      dom.txtRuc.parents(st.classControlGroup).siblings('div').addClass('hide');
      if ($(st.rdTipoDoc + ':checked').val() === 'factura') {
        dom.btnPay.attr('disabled', true);
      } else {
        dom.btnPay.attr('disabled', false);
      }
    },
    eSearchRucData: function(e) {
      var value, _this;
      _this = $(this);
      value = _this.val();
      dom.txtRuc.siblings('.invalid_ruc').remove();
      if (value.length === 11) {
        if (!functions.fnValidateRuc(value)) {
          $('<span/>', {
            "class": 'invalid_ruc response bad',
            text: 'Ruc inválido'
          }).insertAfter(st.txtRuc);
          dom.txtRuc.parents(st.classControlGroup).siblings('.control-group').addClass('hide');
          dom.btnPay.attr('disabled', true);
          return false;
        }
        _this.addClass(st.classInputLoading);
        if (st.xhrGetToken) {
          st.xhrGetToken.abort();
        }
        if (st.xhrGetList) {
          st.xhrGetList.abort();
        }
        st.xhrGetToken = $.ajax({
          url: st.urlGetToken,
          type: 'POST',
          dataType: 'JSON',
          data: {
            csrfhash: $('body').attr('data-hash')
          },
          success: function(result) {
            st.xhrGetList = $.ajax({
              url: st.urlAjax,
              type: 'POST',
              dataType: 'JSON',
              data: {
                csrfhash: result,
                ruc: value
              },
              success: function(response) {
                _this.removeClass(st.classInputLoading);
                dom.btnPay.attr('disabled', false);
                if (response.success === 1) {
                  dom.txtName.attr('readonly', true).val(response.nombreEmpresa);
                  dom.selVia.attr('disabled', true).val(response.via);
                  dom.txtLocation.attr('readonly', true).val(response.dir);
                } else {
                  dom.txtName.attr('readonly', false).val('');
                  dom.selVia.attr('disabled', false).val('');
                  dom.txtLocation.attr('readonly', false).val('');
                }
                dom.hidRucAdecsys.val(response.success);
                dom.hidEnteRuc.val(response.id);
                _this.parents(st.classControlGroup).siblings().removeClass('hide');
              },
              error: function(res) {}
            });
          }
        });
      } else {
        dom.txtRuc.parents(st.classControlGroup).siblings('.control-group').addClass('hide');
        dom.btnPay.attr('disabled', true);
      }
    }
  };
  functions = {
    fnValidateRuc: function(value) {
      var dig, dig_valid, dig_verif, dig_verif_aux, factor, flag_dig, i, item, j, narray, residuo, resta, suma;
      factor = "5432765432";
      if (typeof value === "undefined" || value.length !== 11) {
        return false;
      }
      dig_valid = [10, 20, 17, 15];
      dig = value.substr(0, 2);
      flag_dig = dig_valid.indexOf(parseInt(dig));
      if (flag_dig === -1) {
        return false;
      }
      dig_verif = value.substr(10, 1);
      narray = [];
      i = 0;
      while (i < 10) {
        item = value.substr(i, 1) * factor.substr(i, 1);
        narray.push(item);
        i++;
      }
      suma = 0;
      j = 0;
      while (j < narray.length) {
        suma = suma + narray[j];
        j++;
      }
      residuo = suma % 11;
      resta = 11 - residuo;
      dig_verif_aux = resta.toString().substr(-1);
      if (dig_verif === dig_verif_aux) {
        return true;
      } else {
        return false;
      }
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    afterCathDom();
    catchDom();
    suscribeEvents();
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("hide_skill_block", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: null,
      chkInput: null,
      ulSkillWrap: '.wrap-skills',
      divBtnWrap: '.wrap-btn'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.context = $(this.st.context);
      this.dom.chkInput = $(this.st.chkInput, this.dom.context);
      this.dom.ulSkillWrap = $(this.st.ulSkillWrap, this.dom.context);
      this.dom.divBtnWrap = $(this.st.divBtnWrap, this.dom.context);
    },
    suscribeEvents: function() {
      this.dom.chkInput.on('change', {
        inst: this
      }, this.eShowHideBlock);
    },
    eShowHideBlock: function(event) {
      var dom, st, that;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      dom = that.dom;
      dom.ulSkillWrap.toggle();
      dom.divBtnWrap.toggle();
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
}, ['src/libs/underscore.js']);

yOSON.AppCore.addModule("input_show_more", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: null,
      inputTagName: null,
      option: {},
      divControls: '.control-group',
      divWrap: '.skill-content',
      label: false,
      classFirstTitle: '.first_title',
      classSecondTitle: '.second_title'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.context = $(this.st.context);
    },
    suscribeEvents: function() {
      this.dom.context.on('change', '[name$="' + this.st.inputTagName + '"]', {
        inst: this
      }, this.eShowHideInputs);
    },
    eShowHideInputs: function(event) {
      var st, that, wrap, _this;
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      if (_this.data('functionLock') === 1) {
        return;
      }
      wrap = _this.parents(st.divWrap).parent();
      switch (_this[0].tagName) {
        case 'SELECT':
          that.fnInputSel(wrap, _this);
          break;
        case 'INPUT':
          that.fnInput(wrap, _this);
      }
    },
    fnInputSel: function(wrap, _this) {
      var that;
      that = this;
      $.each(that.st.option, function(i, obj) {
        var value;
        if (that.st.label) {
          value = $('option:selected', _this).attr('label');
        } else {
          value = $('option:selected', _this).val();
        }
        if (value === i) {
          $.each(obj, function(i, arr) {
            var tag;
            tag = $('[name$="' + arr.name + '"]', wrap);
            tag.parents(that.st.divControls).removeClass('hide');
            if (arr.hasOwnProperty('title')) {
              wrap.find('.' + arr.title).removeClass(arr.title).attr('data-title', arr.title);
              return tag.addClass(arr.title);
            }
          });
        } else {
          $.each(obj, function(i, arr) {
            var tag;
            tag = $('[name$="' + arr.name + '"]', wrap);
            tag.parents(that.st.divControls).addClass('hide');
            if (arr.hasOwnProperty('title')) {
              tag = wrap.find('[data-title="' + arr.title + '"]');
              if (tag.length !== 0) {
                wrap.find('.' + arr.title).removeClass(arr.title);
                return tag.removeAttr('data-title').addClass(arr.title);
              }
            }
          });
        }
      });
    },
    fnInput: function(wrap, _this) {
      var that;
      that = this;
      $.each(that.st.option, function(i, arr) {
        var tag;
        tag = $('[name$="' + arr.name + '"]', wrap);
        if (tag.is(':hidden')) {
          tag.parents(that.st.divControls).removeClass('hide');
        } else {
          tag.parents(that.st.divControls).addClass('hide');
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

yOSON.AppCore.addModule("lazy_facebook_load", function(Sb) {
  var beforeCatchDom, catchDom, dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    wrapHTML: null,
    wrapFacebook: '#fbLikeBox',
    isRunScript: false,
    url: "http://connect.facebook.net/es_ES/all.js"
  };
  beforeCatchDom = function() {
    st.wrapHTML = $.browser.webkit ? "body" : "html";
  };
  catchDom = function() {
    dom.wrapHTML = $(st.wrapHTML);
    dom.wrapFacebook = $(st.wrapFacebook);
  };
  suscribeEvents = function() {
    $(window).on('scroll', events.eLoadPlugin);
  };
  events = {
    eLoadPlugin: function(e) {
      var posHtml, posWrap;
      posHtml = dom.wrapHTML.scrollTop() + dom.wrapHTML.height();
      posWrap = parseInt(dom.wrapFacebook.offset().top);
      if (!st.isRunScript && posHtml > posWrap) {
        st.isRunScript = true;
        $.ajaxSetup({
          cache: true
        });
        $.getScript([st.url], function() {
          FB.init({
            appId: tmp.appIdFacebook,
            status: true,
            xfbml: true
          });
        });
      }
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    beforeCatchDom();
    catchDom();
    suscribeEvents();
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("location_job", function(Sb) {
  var afterCatchDom, catchDom, dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    context: '#frmPublishAd',
    selPais: '#fPais',
    selDepartamento: '#fDepart',
    selProvincia: '#fProvin',
    selDistrito: '#fDistri',
    urlGetToken: '/registro/obtener-token/',
    urlAjax: '/registro/filtrar-distritos/',
    dataPaisPeru: '2533',
    dataCallao: '3285',
    dataProvinciaLima: '3927',
    dataDepartamentoLima: '3926',
    templateHtmlOption: null,
    xhrGetList: null
  };
  catchDom = function() {
    dom.context = $(st.context);
    dom.selPais = $(st.selPais, dom.context);
    dom.selDepartamento = $(st.selDepartamento, dom.context);
    dom.selProvincia = $(st.selProvincia, dom.context);
    dom.selDistrito = $(st.selDistrito, dom.context);
  };
  afterCatchDom = function() {
    st.templateHtmlOption = dataTemplate['all'].tpl_options;
  };
  suscribeEvents = function() {
    dom.selPais.on('change', events.eChangeCountry);
    dom.selDepartamento.on('change', events.eChangeDepartment);
    dom.selProvincia.on('change', events.eChangeProvince);
  };
  events = {
    eChangeCountry: function(e) {
      var value, _this;
      _this = $(this);
      value = _this.val();
      if (st.xhrGetList) {
        st.xhrGetList.abort();
      }
      if (typeof window.Parsley !== 'undefined') {
        dom.selDepartamento.parsley().reset();
        dom.selProvincia.parsley().reset();
        dom.selDistrito.parsley().reset();
      }
      dom.selDepartamento.attr('disabled', true).val(0);
      dom.selProvincia.attr('disabled', true).val(0);
      dom.selDistrito.attr('disabled', true).val(0);
      if (value === st.dataPaisPeru) {
        dom.selDepartamento.attr('disabled', false);
      }
    },
    eChangeDepartment: function(e) {
      var value, _this;
      _this = $(this);
      value = _this.val();
      if (st.xhrGetList) {
        st.xhrGetList.abort();
      }
      if (typeof window.Parsley !== 'undefined') {
        dom.selProvincia.parsley().reset();
        dom.selDistrito.parsley().reset();
      }
      dom.selProvincia.attr('disabled', true).val(0);
      dom.selDistrito.attr('disabled', true).val(0);
      if (value === st.dataDepartamentoLima) {
        dom.selProvincia.attr('disabled', false);
      }
    },
    eChangeProvince: function(e) {
      var value, _this;
      _this = $(this);
      value = _this.val();
      if (st.xhrGetList) {
        st.xhrGetList.abort();
      }
      if (typeof window.Parsley !== 'undefined') {
        dom.selDistrito.parsley().reset();
      }
      dom.selDistrito.attr('disabled', true);
      dom.selDistrito.find('option:first').siblings().remove();
      if (value === st.dataProvinciaLima || value === st.dataCallao) {
        st.xhrGetList = $.ajax({
          url: st.urlGetToken,
          type: 'POST',
          dataType: 'JSON',
          data: {
            csrfhash: $('body').attr('data-hash')
          },
          success: function(result) {
            st.xhrGetList = $.ajax({
              url: st.urlAjax,
              type: 'POST',
              dataType: 'JSON',
              data: {
                csrfhash: result,
                id_ubigeo: value
              },
              success: function(response) {
                $.each(response, function(i, data) {
                  var compiled_template, objModel;
                  objModel = {
                    value: i,
                    data: data
                  };
                  compiled_template = _.template(st.templateHtmlOption, objModel);
                  dom.selDistrito.append(compiled_template);
                });
                dom.selDistrito.attr('disabled', false);
              },
              error: function(res) {
                dom.selDistrito.find('option:first').siblings().remove();
                dom.selDistrito.attr('disabled', false);
              }
            });
          }
        });
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
}, ['src/libs/underscore.js']);

yOSON.AppCore.addModule("parsley_validation", function(Sb) {
  var afterCatchDom, catchDom, dom, functions, initialize, st;
  dom = {};
  st = {
    frm: '#frmRegisterUPC',
    selDocument: '#selDocument',
    txtDocument: '#txtDocument',
    txtApeMat: '#txtApeMat',
    rdNacionalidad: 'input[name="rdNacionalidad"]',
    classSchedule: '.upc_schedule',
    classAccordeon: '.accordeon'
  };
  catchDom = function() {
    dom.txtDocument = $(st.txtDocument);
    dom.txtApeMat = $(st.txtApeMat);
    dom.selDocument = $(st.selDocument);
    dom.rdNacionalidad = $(st.rdNacionalidad);
    dom.frm = $(st.frm);
    dom.classAccordeon = $(st.classAccordeon);
    dom.classSchedule = $(st.classSchedule);
  };
  afterCatchDom = function() {
    dom.classAccordeon.on('click', functions.onClickWrap);
  };
  functions = {
    onClickWrap: function(e) {
      $(this).parent().siblings().find('.open').removeClass('open').addClass('close').slideUp('fast');
      $(this).parents(st.classSchedule).siblings(st.classSchedule).find('.open').removeClass('open').addClass('close').slideUp('fast');
    },
    validate: function() {
      dom.frm.parsley({
        rules: {
          SelectName: {
            valueNotEquals: "0"
          }
        }
      });
      dom.rdNacionalidad.on('change', function() {
        dom.txtApeMat.parsley().destroy();
        switch ($(this).val()) {
          case 'Extranjera':
            dom.txtApeMat.removeAttr('required');
            break;
          case 'Peruana':
            dom.txtApeMat.attr('required', '');
        }
        dom.txtApeMat.parsley();
      });
      dom.selDocument.on('change', function() {
        dom.txtDocument.focus();
        dom.txtDocument.val('');
        dom.txtDocument.parsley().destroy();
        switch (parseInt($(this).val())) {
          case 1:
            dom.txtDocument.attr({
              'maxlength': '8',
              'data-parsley-minlength': '8',
              'data-parsley-type': 'digits',
              'data-parsley-minlength-message': 'El DNI debe ser de 8 dígitos',
              'data-parsley-type-message': 'Ingrese un DNI válido'
            });
            break;
          case 2:
            dom.txtDocument.attr({
              'maxlength': '20',
              'minlength': '8',
              'data-parsley-minlength': '8',
              'data-parsley-type': 'alphanum',
              'data-parsley-minlength-message': 'Ingrese un pasaporte válido',
              'data-parsley-type-message': 'Ingrese un pasaporte válido'
            });
            break;
          case 3:
            dom.txtDocument.attr({
              'maxlength': '20',
              'minlength': '8',
              'data-parsley-minlength': '8',
              'data-parsley-type': 'digits',
              'data-parsley-minlength-message': 'Ingrese carné de extranjería válido',
              'data-parsley-type-message': 'Ingrese carné de extranjería válido'
            });
        }
        dom.txtDocument.parsley();
      });
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    catchDom();
    afterCatchDom();
    functions.validate();
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("search_filters", function(Sb) {
  var catchDom, dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    divForm: '#formFind',
    txtSearch: '#fieldSearch',
    selArea: 'select[name=areas]',
    selUbicacion: 'select[name=ubicaciones]',
    selNivel: 'select[name=nivelPuestos]'
  };
  catchDom = function() {
    dom.divForm = $(st.divForm);
    dom.txtSearch = $(st.txtSearch, dom.divForm);
    dom.selArea = $(st.selArea, dom.divForm);
    dom.selUbicacion = $(st.selUbicacion, dom.divForm);
    dom.selNivel = $(st.selNivel, dom.divForm);
  };
  suscribeEvents = function() {
    dom.divForm.on('submit', events.onSubmit);
  };
  events = {
    onSubmit: function(e) {
      var area, cadena, nivelpuestos, returnString, ubicaciones;
      e.preventDefault();
      returnString = function(val) {
        val = val.replace(/-+/g, ' ');
        val = val.replace(/_+/g, ' ');
        val = val.replace(/\.+/g, '');
        val = val.replace(/\s/g, '+');
        val = val.replace(/,+/g, '');
        val = val.replace(/\%+/g, ' ');
        return val;
      };
      area = dom.selArea.val();
      nivelpuestos = dom.selNivel.val();
      ubicaciones = dom.selUbicacion.val();
      cadena = this.action + '/q/' + returnString($.trim(dom.txtSearch.val()));
      if (area !== 'none') {
        cadena += '/areas/' + area;
      }
      if (nivelpuestos !== 'none') {
        cadena += '/nivel/' + nivelpuestos;
      }
      if (ubicaciones !== 'none') {
        cadena += '/ubicacion/' + ubicaciones;
      }
      window.location = cadena;
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
}, []);

yOSON.AppCore.addModule("search_tcn", function(Sb) {
  var afterCathDom, catchDom, dom, functions, initialize, st;
  dom = {};
  st = {
    frmSearchTcn: '#frmSearchTcn',
    txtSearch: '#txtSearch',
    btnSearch: '#btnSearch'
  };
  afterCathDom = function() {
    dom.frmSearchTcn = $(st.frmSearchTcn);
    dom.txtSearch = $(st.txtSearch, dom.frmSearchTcn);
    dom.btnSearch = $(st.btnSearch, dom.frmSearchTcn);
  };
  catchDom = function() {
    dom.frmSearchTcn.on('submit', functions.fnSearchTcn);
  };
  functions = {
    fnSearchTcn: function(e) {
      var url, valueSearch;
      e.preventDefault();
      valueSearch = dom.txtSearch.val();
      url = '/bolsas-de-trabajo';
      if ($.trim(valueSearch) !== '') {
        url = url + '/index/razonsocial/' + valueSearch;
      }
      window.location = url;
    }
  };
  initialize = function(oP) {
    $.extend(st, oP);
    afterCathDom();
    catchDom();
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("show_hide_options", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: null,
      selParent: null,
      selChild: null,
      divskillContent: '.skill-content'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.context = $(this.st.context);
    },
    suscribeEvents: function() {
      this.dom.context.on('change', '[name$="' + this.st.selParent + '"]', {
        inst: this
      }, this.eShowHideOptions);
    },
    eShowHideOptions: function(event) {
      var parentWrap, selChild, st, that, valueParent, _this;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      valueParent = _this.val();
      parentWrap = _this.parents(st.divskillContent).parent();
      selChild = $('[name$="' + st.selChild + '"]', parentWrap);
      selChild.attr('disabled', false).find('option[value="0"]').attr('selected', true);
      $.each(selChild.find('option'), function(i, elem) {
        var elemOption, rel;
        elemOption = $(elem);
        rel = elemOption.attr('rel');
        if (i !== 0) {
          if ($.inArray(valueParent, rel.split(/,/g)) !== -1) {
            elemOption.show();
          } else {
            elemOption.hide();
          }
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
}, ['src/libs/underscore.js']);

yOSON.AppCore.addModule("skill_add", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: null,
      separate: 'en',
      btn: '.wrap-btn .btn',
      ulSkillWrap: '.wrap-skills',
      divSkillContent: '.skill-content',
      divSkilltitle: '.skill-title',
      divNoSkill: '.no_skill',
      spanMessage: '.wrap-btn .response',
      classFirstTitle: '.first_title',
      classSecondTitle: '.second_title',
      classNumber: '.number',
      template: null,
      templateHtmlTitle: null,
      templateHtmlContent: null,
      validRepeat: false
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.context = $(this.st.context);
      this.dom.btn = $(this.st.btn, this.dom.context);
      this.dom.ulSkillWrap = $(this.st.ulSkillWrap, this.dom.context);
      this.dom.divNoSkill = $(this.st.divNoSkill, this.dom.context);
      this.dom.spanMessage = $(this.st.spanMessage, this.dom.context);
      this.dom.template = $(this.st.template);
    },
    afterCatchDom: function() {
      this.st.templateHtmlTitle = dataTemplate['datos_usuario'].skill_title;
      this.st.templateHtmlContent = this.dom.template.html();
    },
    suscribeEvents: function() {
      this.dom.btn.on('click', {
        inst: this
      }, this.eAddSkill);
    },
    eAddSkill: function(event, dataTrigger) {
      var compiled_template, compiled_template2, dom, lastSkill, newIndex, objModel, skillWrap, spanNumber, st, that;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      dom = that.dom;
      skillWrap = $('> li', dom.ulSkillWrap);
      lastSkill = skillWrap.last();
      if (!dom.context.data('valid')) {
        dom.spanMessage.removeClass('hide').text('Debe completar todos los campos requeridos');
        return;
      }
      if (st.validRepeat) {
        if (!that.fnRepeatTitles(lastSkill.siblings(), that.fnCaptureValue($(st.classFirstTitle, lastSkill)))) {
          dom.spanMessage.removeClass('hide').text('No se permiten campos repetidos');
          return;
        }
      }
      lastSkill.siblings().find(st.divSkillContent).slideUp('fast');
      dom.spanMessage.addClass('hide').text('');
      that.fnCompleteTitle(lastSkill);
      if (skillWrap.size() > 0) {
        dom.divNoSkill.slideUp('fast');
        dom.btn.text(dom.btn.data('more'));
      }
      objModel = {
        order: skillWrap.length,
        title1: that.fnCaptureValue($(st.classFirstTitle, lastSkill)),
        separate: st.separate,
        title2: that.fnCaptureValue($(st.classSecondTitle, lastSkill))
      };
      if (!dataTrigger) {
        $('html, body').animate({
          scrollTop: dom.context.offset().top - 40
        }, 400);
      }
      compiled_template = _.template(st.templateHtmlTitle, objModel);
      lastSkill.prepend($(compiled_template).hide().fadeIn());
      lastSkill.find(st.divSkillContent).hide();
      newIndex = parseInt(lastSkill.data('index')) + 1;
      compiled_template2 = st.templateHtmlContent.replace(/_blank_/g, '_' + newIndex + '_');
      dom.ulSkillWrap.append(compiled_template2);
      spanNumber = dom.context.prev().find(st.classNumber);
      if (spanNumber.length !== 0) {
        spanNumber.text('(' + skillWrap.length + ')');
      }
      $('> li:last', dom.ulSkillWrap).attr('data-index', newIndex);
    },
    fnCaptureValue: function($elem) {
      var tagName, value;
      if ($elem.length !== 0) {
        tagName = $elem[0].tagName;
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          value = $elem.val();
        } else if (tagName === 'SELECT') {
          value = $.trim($('option:selected', $elem).text());
        }
      } else {
        value = null;
      }
      return value;
    },
    fnRepeatTitles: function($listLi, valueTitle) {
      var flag, that;
      that = this;
      flag = true;
      $.each($listLi, function(i, elem) {
        var title;
        title = $.trim($(this).find(that.st.divSkilltitle).find('li:eq(1)').find('b:eq(0)').text());
        if (title === valueTitle) {
          flag = false;
        }
      });
      return flag;
    },
    fnCompleteTitle: function(lastSkill) {
      var st, that;
      that = this;
      st = that.st;
      $.each(lastSkill.siblings(), function(i, skill) {
        var compiled_template, objModel, _thisSkill;
        _thisSkill = $(skill);
        if (_thisSkill.find(st.divSkilltitle).size() === 0) {
          objModel = {
            order: _thisSkill.index() + 1,
            title1: that.fnCaptureValue($(st.classFirstTitle, _thisSkill)),
            separate: st.separate,
            title2: that.fnCaptureValue($(st.classSecondTitle, _thisSkill))
          };
          compiled_template = _.template(st.templateHtmlTitle, objModel);
          _thisSkill.prepend($(compiled_template).hide().fadeIn());
        }
      });
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.afterCatchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP['Perfil_postulante'], function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, ['src/libs/underscore.js']);

yOSON.AppCore.addModule("skill_edit", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: null,
      ulWrap: '.wrap-skills',
      btn: '.wrap-btn .btn',
      divSkillTitle: '.skill-title',
      divSkillContent: '.skill-content',
      btnEdit: '.action-icons.edit',
      spanFirstTitle: '.first_title',
      spanSecondTitle: '.second_title',
      templateHtmlTitle: null,
      separate: 'en'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.context = $(this.st.context);
      this.dom.btnEdit = $(this.st.btnEdit, this.dom.context);
      this.dom.btn = $(this.st.btn, this.dom.context);
    },
    afterCatchDom: function() {
      this.st.templateHtmlTitle = dataTemplate['datos_usuario'].update_title;
    },
    suscribeEvents: function() {
      this.dom.context.on('click', this.st.btnEdit, {
        inst: this
      }, this.eOpenWrap);
    },
    eOpenWrap: function(event) {
      var listLI, skillContent, skillTitle, st, that, wrap, _this;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      _this = $(this);
      wrap = _this.parents(st.ulWrap);
      listLI = $('> li:not(:last)', wrap);
      skillTitle = _this.parents(st.divSkillTitle);
      skillContent = skillTitle.next();
      if (!skillContent.data('valid')) {
        return false;
      }
      if (skillContent.is(':visible')) {
        that.fnUpdateTitle(skillTitle.parent());
      }
      if (skillContent.is(':visible')) {
        skillContent.slideUp('fast');
      } else {
        skillContent.slideDown('fast');
      }
    },
    fnUpdateTitle: function(listLI) {
      var compiled_template, liContent, objModel, that;
      that = this;
      liContent = $(listLI);
      objModel = {
        title1: that.fnCaptureValue(liContent.find(that.st.spanFirstTitle)),
        separate: that.st.separate,
        title2: that.fnCaptureValue(liContent.find(that.st.spanSecondTitle + ':visible'))
      };
      compiled_template = _.template(that.st.templateHtmlTitle, objModel);
      liContent.find(that.st.divSkillTitle).find('li').eq(1).html(compiled_template);
    },
    fnCaptureValue: function($elem) {
      var tagName, value;
      if ($elem.length !== 0) {
        tagName = $elem[0].tagName;
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          value = $elem.val();
        } else if (tagName === 'SELECT') {
          value = $.trim($('option:selected', $elem).text());
        }
      } else {
        value = null;
      }
      return value;
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.catchDom();
      this.afterCatchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    return $.each(oP['Perfil_postulante'], function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("skill_remove", function(Sb) {
  var factory, initialize;
  factory = function(op) {
    this.st = {
      context: null,
      btnEdit: '.action-icons.delete',
      ulSkillWrap: '.wrap-skills',
      ulTitle: '.skill-title',
      classNumber: '.number',
      divNoSkill: '.no_skill',
      btnAgree: '#btnAgree',
      btnClose: '#btnCancel',
      boxMessage: '.box-message',
      hidReference: '.delete_reference',
      templateHtmlTitle: null,
      urlGetToken: '/registro/obtener-token/'
    };
    this.dom = {};
    this.op = op;
  };
  factory.prototype = {
    catchDom: function() {
      this.dom.context = $(this.st.context);
      this.dom.ulSkillWrap = $(this.st.ulSkillWrap, this.dom.context);
      this.dom.divNoSkill = $(this.st.divNoSkill, this.dom.context);
      this.dom.hidReference = $(this.st.hidReference, this.dom.context);
    },
    afterCatchDom: function() {
      this.st.templateHtmlTitle = dataTemplate['datos_usuario'].modal_delete;
    },
    suscribeEvents: function() {
      this.dom.ulSkillWrap.on('click', this.st.btnEdit, {
        inst: this
      }, this.eShowModal);
      $(document).on('click', this.st.btnClose, this.eCloseModal);
      $(document).on('click', this.st.btnAgree, {
        inst: this
      }, this.eDeleteSkill);
    },
    eShowModal: function(event) {
      var block, dom, objModel, st, that, _this;
      event.preventDefault();
      that = event.data.inst;
      st = that.st;
      dom = that.dom;
      _this = $(this);
      block = _this.parents(st.ulTitle).parent();
      objModel = {
        content: '¿Está seguro que desea eliminarlo?'
      };
      $.fancybox({
        content: _.template(st.templateHtmlTitle, objModel),
        afterLoad: function() {
          dom.ulSkillWrap.data('dataBlock', block);
        }
      });
    },
    eCloseModal: function() {
      $.fancybox.close();
    },
    eDeleteSkill: function(event) {
      var divTodelete, dom, st, that;
      that = event.data.inst;
      dom = that.dom;
      st = that.st;
      $.fancybox.close();
      divTodelete = dom.ulSkillWrap.data('dataBlock');
      if (!divTodelete) {
        return false;
      }
      if (divTodelete.data('rol')) {
        $.fancybox.showLoading();
        $.ajax({
          url: st.urlGetToken,
          type: 'POST',
          dataType: 'JSON',
          success: function(result) {
            $.fancybox.showLoading();
            $.ajax({
              url: dom.context.data('delete'),
              type: 'POST',
              dataType: 'JSON',
              data: {
                id: divTodelete.data('rol'),
                idPost: divTodelete.data('rel'),
                csrfhash: result
              },
              success: function(res) {
                $.fancybox.hideLoading();
                if (res.status === 'ok') {
                  that.fnShowMessage(divTodelete);
                } else {
                  utils.boxMessage(dom.ulSkillWrap, 'prepend', res);
                }
              },
              error: function(res) {
                $.fancybox.hideLoading();
                utils.boxMessage(dom.ulSkillWrap, 'prepend', 'Error en la solicitud');
              }
            });
          }
        });
      } else {
        that.fnShowMessage(divTodelete);
      }
    },
    fnEnumeracionBlock: function() {
      var listLi, spanNumber, that;
      that = this;
      listLi = $('> li', that.dom.ulSkillWrap);
      $.each(listLi, function(i, elem) {
        var pos;
        elem = $(elem);
        pos = elem.index();
        $(that.st.ulTitle + ' li:first', elem).eq(0).text(pos + '. ');
      });
      spanNumber = that.dom.context.prev().find(that.st.classNumber);
      if (spanNumber.length !== 0) {
        if (listLi.length > 1) {
          spanNumber.text('(' + (listLi.length - 1) + ')');
        } else {
          spanNumber.text('');
        }
      }
    },
    fnShowMessage: function(divTodelete) {
      var dom, that;
      that = this;
      dom = that.dom;
      divTodelete.fadeOut(function() {
        var skillWrap, _this;
        _this = $(this);
        that.fnUpdateReference(_this);
        _this.remove();
        dom.ulSkillWrap.removeData();
        utils.boxMessage(dom.ulSkillWrap, 'prepend', 'Se eliminó correctamente');
        that.fnEnumeracionBlock();
        skillWrap = $('> li', dom.ulSkillWrap);
        if (skillWrap.size() === 1) {
          dom.divNoSkill.slideDown('fast');
        }
      });
    },
    fnUpdateReference: function(divTodelete) {
      var dom, index, value;
      dom = this.dom;
      value = dom.hidReference.val();
      index = divTodelete.data('index');
      if (index || index !== 'blank') {
        if (value === '') {
          dom.hidReference.val(index);
        } else {
          dom.hidReference.val(value + ',' + index);
        }
      }
    },
    execute: function() {
      this.st = $.extend({}, this.st, this.op);
      this.afterCatchDom();
      this.catchDom();
      this.suscribeEvents();
    }
  };
  initialize = function(oP) {
    $.each(oP['Perfil_postulante'], function(i, obj) {
      var instance;
      instance = new factory(obj);
      instance.execute();
    });
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqFancybox.js']);

yOSON.AppCore.addModule("study_options", function(Sb) {
  var catchDom, dom, events, functions, initialize, st, suscribeEvents;
  dom = {};
  st = {
    context: '#studyF',
    inputTagName: '_id_nivel_estudio',
    divWrap: '.skill-content',
    divControls1: '.control-group',
    divControls2: '.cgroup-inline',
    classFirstTitle: 'first_title',
    classSecondTitle: 'second_title',
    selTipoEstudio: '_id_nivel_estudio_tipo',
    chkColegiatura: '_colegiatura',
    chkColegiaturaNum: '_colegiatura_numero',
    txtIntitucion: '_institucion',
    selPais: '_pais_estudio',
    selTipoCarrera: '_id_tipo_carrera',
    selCarrera: '_id_carrera',
    txtOtraCarrera: '_otro_carrera',
    selIniMes: '_inicio_mes',
    selIniAnio: '_inicio_ano',
    selFinMes: '_fin_mes',
    selFinAnio: '_fin_ano',
    chkEnCurso: '_en_curso'
  };
  catchDom = function() {
    dom.context = $(st.context);
  };
  suscribeEvents = function() {
    dom.context.on('change', '[id$="' + st.inputTagName + '"]', events.eChangeStudy);
  };
  events = {
    eChangeStudy: function(e) {
      var inputCarrera, value, wrap, _this;
      _this = $(this);
      wrap = _this.parents(st.divWrap).parent();
      value = parseInt($('option:selected', _this).val());
      $('[name$="' + st.txtIntitucion + '"]', wrap).addClass(st.classSecondTitle);
      functions.fnDisabledInputs({
        disabled: false,
        arr: [st.txtIntitucion, st.selIniMes, st.selIniAnio, st.selFinMes, st.selFinAnio, st.chkEnCurso, st.selTipoCarrera]
      }, wrap);
      $('[name$="' + st.selPais + '"]', wrap).attr('disabled', false);
      $('[name$="' + st.selTipoEstudio + '"]', wrap).parents(st.divControls1).removeClass('hide');
      $('[name$="' + st.selTipoCarrera + '"]', wrap).parents(st.divControls1).removeClass('hide');
      $('[name$="' + st.chkColegiatura + '"]', wrap).parents(st.divControls2).addClass('hide');
      $('[name$="' + st.chkColegiaturaNum + '"]', wrap).parents(st.divControls1).addClass('hide');
      if (value === 1 || value === 2 || value === 3) {
        $('[name$="' + st.selTipoEstudio + '"]', wrap).parents(st.divControls1).addClass('hide');
        $('[name$="' + st.selTipoCarrera + '"]', wrap).parents(st.divControls1).addClass('hide');
        inputCarrera = $('[name$="' + st.selCarrera + '"]', wrap);
        inputCarrera.parents(st.divControls1).addClass('hide');
        inputCarrera.removeClass(st.classFirstTitle);
        _this.addClass(st.classFirstTitle);
        if (value === 1) {
          $('[name$="' + st.txtIntitucion + '"]', wrap).removeClass(st.classSecondTitle);
          functions.fnDisabledInputs({
            disabled: true,
            arr: [st.txtIntitucion, st.selIniMes, st.selIniAnio, st.selFinMes, st.selFinAnio, st.chkEnCurso]
          }, wrap);
          $('[name$="' + st.selPais + '"]', wrap).attr('disabled', true);
        }
      } else {
        inputCarrera = $('[name$="' + st.selCarrera + '"]', wrap);
        inputCarrera.addClass(st.classFirstTitle);
        inputCarrera.parents(st.divControls1).removeClass('hide');
        _this.removeClass(st.classFirstTitle);
      }
    }
  };
  functions = {
    fnDisabledInputs: function(obj, wrap) {
      $.each(obj.arr, function(i, elem) {
        var input;
        input = $('[name$="' + elem + '"]', wrap);
        if (obj.disabled) {
          functions.fnCleanInput(input);
        }
        input.attr('disabled', obj.disabled);
      });
    },
    fnCleanInput: function($elem) {
      var tagName;
      tagName = $elem[0].tagName;
      if (tagName === 'INPUT') {
        $elem.val('');
      } else if (tagName === 'SELECT') {
        $('option:eq(0)', $elem).attr('selected', true);
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
}, []);

yOSON.AppCore.addModule("update_date", function(Sb) {
  var dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    selTag: null,
    selDepend: null,
    divWrap: '.skill-content'
  };
  suscribeEvents = function() {
    $(document).on('change', '[id$="' + st.selTag + '"]', {
      selDep: st.selDepend
    }, events.eUpdate);
  };
  events = {
    eUpdate: function(e) {
      var tag, value, wrap, _this;
      _this = $(this);
      value = _this.val();
      wrap = _this.parents(st.divWrap).parent();
      tag = $('[id$="' + e.data.selDep + '"]', wrap);
      tag.find('option:selected').attr('disabled', false);
      tag.find('option[value="' + value + '"]').attr('selected', true);
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      $.extend(st, obj);
      suscribeEvents();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("validate_daybitrh", function(Sb) {
  var afterCatchDom, catchDom, dom, initialize, st;
  dom = {};
  st = {
    dia: ":input[name=selDia]",
    mes: ":input[name=selMes]",
    year: ":input[name=selAnio]"
  };
  catchDom = function() {
    dom.dia = $(st.dia);
    dom.mes = $(st.mes);
    dom.year = $(st.year);
  };
  afterCatchDom = function() {
    $().dateSelectBoxes(dom.mes, dom.dia, dom.year);
  };
  initialize = function(oP) {
    $.extend(st, oP);
    catchDom();
    afterCatchDom();
  };
  return {
    init: initialize
  };
}, ['/src/libs/jquery/jqDateSelectBoxes.js']);

yOSON.AppCore.addModule("validate_skill_form", function(Sb) {
  var catchDom, dom, events, initialize, st, suscribeEvents;
  dom = {};
  st = {
    frm: '#frmSkills',
    chkExperience: '#chkExperience',
    chkStudy: '#chkStudy',
    spanREsponse: '#spanResponse',
    messageComplete: 'Debe completar el nivel de estudio y/o experiencia para poder continuar.',
    messageAgree: 'Debe Aceptar los términos y condiciones.',
    chkTerms: '#chkTerms',
    chkSendEmail: '#chkSendEmail',
    chkSendEmailAds: '#chkSendEmailAds',
    btnExperience: '#btnExperience',
    btnStudy: '#btnStudy',
    wrapExperience: '#experienceF',
    wrapStudy: '#studyF',
    wrapSkills: '.wrap-skills'
  };
  catchDom = function() {
    dom.frm = $(st.frm);
    dom.wrapExperience = $(st.wrapExperience);
    dom.wrapStudy = $(st.wrapStudy);
    dom.chkExperience = $(st.chkExperience, dom.frm);
    dom.chkStudy = $(st.chkStudy, dom.frm);
    dom.spanResponse = $(st.spanREsponse, dom.frm);
    dom.chkTerms = $(st.chkTerms, dom.frm);
    dom.chkSendEmail = $(st.chkSendEmail, dom.frm);
    dom.chkSendEmailAds = $(st.chkSendEmailAds, dom.frm);
    dom.btnExperience = $(st.btnExperience, dom.wrapExperience);
    dom.btnStudy = $(st.btnStudy, dom.wrapStudy);
  };
  suscribeEvents = function() {
    dom.frm.on('submit', events.eValidate);
  };
  events = {
    eValidate: function(event) {
      var wrapSkillsEst, wrapSkillsExp;
      if (dom.chkTerms.is(':checked')) {
        wrapSkillsExp = dom.wrapExperience.find(st.wrapSkills);
        if (wrapSkillsExp.is(':visible') && wrapSkillsExp.find('> li').length <= 1) {
          if (!dom.wrapExperience.data('valid')) {
            dom.btnExperience.trigger('click', {
              scroll: false
            });
            if (!dom.wrapExperience.data('valid')) {
              dom.spanResponse.removeClass('hide').text(st.messageComplete);
              return false;
            }
          }
        }
        wrapSkillsEst = dom.wrapStudy.find(st.wrapSkills);
        if (wrapSkillsEst.is(':visible') && wrapSkillsEst.find('> li').length <= 1) {
          if (!dom.wrapStudy.data('valid')) {
            dom.btnStudy.trigger('click', {
              scroll: false
            });
            if (!dom.wrapStudy.data('valid')) {
              dom.spanResponse.removeClass('hide').text(st.messageComplete);
              return false;
            }
          }
        }
      } else {
        dom.spanResponse.removeClass('hide').text(st.messageAgree);
        return false;
      }
      return dom.spanResponse.addClass('hide');
    }
  };
  initialize = function(oP) {
    $.each(oP, function(i, obj) {
      $.extend(st, obj);
      catchDom();
      suscribeEvents();
    });
  };
  return {
    init: initialize
  };
}, []);

yOSON.AppCore.addModule("viewmore_tooltip", function(Sb) {
  var catchDom, collection, dom, events, initialize, st, suscribeEvents;
  st = {
    winIModal: '.winIModal',
    moreWM: '.moreWM',
    closeH0WM: '.closeH0WM',
    rdInputs: '.iptRadioBA'
  };
  dom = {};
  collection = [];
  catchDom = function() {
    dom.winIModal = $(st.winIModal);
    dom.moreWM = $(st.moreWM);
    dom.closeH0WM = $(st.closeH0WM);
    dom.rdInputs = $(st.rdInputs);
  };
  suscribeEvents = function() {
    dom.winIModal.on('click', events.eShowTooltip);
    dom.closeH0WM.on('click', events.eHideTooltip);
    dom.rdInputs.on('change', events.eShowHideWrap);
  };
  events = {
    eShowTooltip: function(e) {
      var idH, tP, wrap, _this;
      e.preventDefault();
      _this = $(this);
      wrap = _this.attr('href');
      tP = _this.position().top;
      idH = $(wrap).height();
      dom.moreWM.hide();
      $(wrap).css('top', tP - idH - 30).fadeIn('fast');
      $(document).keyup(function(e) {
        if (e.keyCode === 27) {
          dom.closeH0WM.trigger('click');
        }
      });
    },
    eHideTooltip: function(e) {
      e.preventDefault();
      dom.moreWM.fadeOut('fast');
    },
    eShowHideWrap: function(e) {
      var alfabetico, cntList, numerico, _this;
      _this = $(this);
      cntList = _this.parents('.rel').next();
      numerico = $('.numerico', cntList);
      alfabetico = $('.alfabetico', cntList);
      if (_this.val() === 'numerico') {
        alfabetico.hide();
        numerico.show();
      } else {
        numerico.hide();
        alfabetico.show();
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
}, []);

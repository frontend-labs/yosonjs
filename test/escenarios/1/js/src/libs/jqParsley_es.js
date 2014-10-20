// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

window.ParsleyConfig.i18n.es = $.extend(window.ParsleyConfig.i18n.es || {}, {
  defaultMessage: "Este valor parece ser inválido.",
  type: {
    email:        "Ingrese un email válido.",
    url:          "Ingrese una URL válida.",
    number:       "Ingrese un número válido.",
    integer:      "Ingrese un número válido.",
    digits:       "Ingrese solo números.",
    alphanum:     "Ingrese un valor alfanumérico."
  },
  notblank:       "Este campo no debe estar en blanco.",
  required:       "Este campo es requerido.",
  pattern:        "Este campo es incorrecto.",
  min:            "Este valor no debe ser menor que %s.",
  max:            "Este valor no debe ser mayor que %s.",
  range:          "Este valor debe estar entre %s y %s.",
  minlength:      "La longitud mínima es de %s caracteres.",
  maxlength:      "La longitud máxima es de %s caracteres.",
  length:         "La longitud de este campo debe estar entre %s y %s caracteres.",
  mincheck:       "Debe seleccionar al menos %s opciones.",
  maxcheck:       "Debe seleccionar %s opciones o menos.",
  rangecheck:     "Debe seleccionar entre %s y %s opciones.",
  equalto:        "Este valor debe ser idéntico."
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('es', window.ParsleyConfig.i18n.es, true);

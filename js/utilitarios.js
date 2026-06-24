function obtenerElemento(id) {
  return document.getElementById(id);
}

function existeElemento(id) {
  return obtenerElemento(id) !== null;
}

function textoSeguro(id, texto) {
  let elemento = obtenerElemento(id);

  if (elemento !== null) {
    elemento.innerText = texto;
  }
}

function obtenerValor(id) {
  let elemento = obtenerElemento(id);

  if (elemento === null) {
    return "";
  }

  return elemento.value.trim();
}

function obtenerNumero(id) {
  let valor = parseFloat(obtenerValor(id));

  if (isNaN(valor)) {
    return 0;
  }

  return valor;
}

function mostrarTexto(id, texto) {
  let elemento = obtenerElemento(id);

  if (elemento !== null) {
    elemento.innerText = texto;
  }
}

function dinero(valor) {
  return "$" + Number(valor).toFixed(2);
}

function marcarError(id, mensaje) {
  let campo = obtenerElemento(id);

  if (campo !== null) {
    campo.classList.add("input-error");
    campo.focus();
  }

  alert(mensaje);
}

function limpiarErrores() {
  let campos = document.querySelectorAll(".input-error");

  for (let i = 0; i < campos.length; i++) {
    campos[i].classList.remove("input-error");
  }
}

function guardarLocal(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

function leerLocal(clave, valorPorDefecto) {
  let datos = localStorage.getItem(clave);

  if (datos === null) {
    return valorPorDefecto;
  }

  return JSON.parse(datos);
}

// validaciones

function validarCampo(idInput, idError, mensaje) {
  let input = obtenerElemento(idInput);
  let error = obtenerElemento(idError);

  let valor = input.value.trim();

  if (valor === "") {
    input.classList.add("input-error");
    error.classList.add("error-text");
    error.innerText = mensaje;
    return false;
  }

  input.classList.remove("input-error");
  error.classList.remove("error-text");
  error.innerText = "";
  return true;
}
function validarSelect(idInput) {
  let input = obtenerElemento(idInput);

  let valor = input.value.trim();

  if (valor === "") {
    input.classList.add("input-error");
    return false;
  }
  input.classList.remove("input-error");
  return true;
}

function validarRucBasico(ruc) {
  if (ruc.length === 13 && !isNaN(ruc)) {
    return true;
  } else {
    return false;
  }
}

let accionModalReusable = null;

function abrirModalReusable(configuracion) {
  let modal = obtenerElemento(configuracion.idModal);

  if (modal === null) {
    console.error("No existe el modal:", configuracion.idModal);
    return;
  }

  if (configuracion.idTitulo) {
    mostrarTexto(configuracion.idTitulo, configuracion.titulo || "");
  }

  if (configuracion.idTexto) {
    mostrarTexto(configuracion.idTexto, configuracion.texto || "");
  }

  accionModalReusable = configuracion.accion || null;
  modal.classList.add("show");
}

function cerrarModalReusable(idModal) {
  let modal = obtenerElemento(idModal);

  if (modal !== null) {
    modal.classList.remove("show");
  }

  accionModalReusable = null;
}

function confirmarModalReusable(idModal) {
  if (accionModalReusable !== null) {
    accionModalReusable();
  }

  cerrarModalReusable(idModal);
}

/* ======================================================
  UTILIDADES REUSABLES PARA MOVIMIENTOS
====================================================== */

function obtenerSecuenciaLocal(clave, valorInicial) {
  let secuencia = parseInt(
    localStorage.getItem(clave) || valorInicial || "1",
    10,
  );
  return isNaN(secuencia) ? Number(valorInicial || 1) : secuencia;
}

function generarCodigoSecuencial(prefijo, claveSecuencia, digitos) {
  let secuencia = obtenerSecuenciaLocal(claveSecuencia, 1);
  return prefijo + "-" + String(secuencia).padStart(digitos || 6, "0");
}

function avanzarSecuenciaLocal(claveSecuencia) {
  localStorage.setItem(
    claveSecuencia,
    obtenerSecuenciaLocal(claveSecuencia, 1) + 1,
  );
}

function calcularMovimiento(base, tarifa) {
  let baseNumero = Number(base || 0);
  let tarifaNumero = Number(tarifa || 0);
  let iva = baseNumero * (tarifaNumero / 100);

  return {
    iva: iva,
    total: baseNumero + iva,
  };
}

function limpiarCampos(ids) {
  for (let i = 0; i < ids.length; i++) {
    let elemento = obtenerElemento(ids[i].id);
    if (elemento !== null) {
      elemento.value = ids[i].valor;
    }
  }
}

function filtrarPorPeriodo(lista, idMes, idAnio) {
  let mesFiltro = obtenerValor(idMes);
  let anioFiltro = obtenerValor(idAnio);

  return lista.filter(function (item) {
    let clave = item.periodoClave || obtenerClavePeriodoPorFecha(item.fecha);
    let coincideMes = mesFiltro === "" || clave.startsWith(mesFiltro + "-");
    let coincideAnio = anioFiltro === "" || clave.endsWith("-" + anioFiltro);
    return coincideMes && coincideAnio;
  });
}

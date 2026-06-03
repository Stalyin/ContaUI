function obtener(id) {
  return document.getElementById(id);
}

function obtenerValor(id) {
  let elemento = obtener(id);

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
  let elemento = obtener(id);

  if (elemento !== null) {
    elemento.innerText = texto;
  }
}

function dinero(valor) {
  return "$" + Number(valor).toFixed(2);
}

function marcarError(id, mensaje) {
  let campo = obtener(id);

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

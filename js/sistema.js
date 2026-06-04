let configuracionSistema = {
  nombre: "",
  apellido: "",
  razonSocial: "",
  ruc: "",
  regimen: "",
};

let calculoActual = {
  ventas15: 0,
  ventas0: 0,
  compras15: 0,
  compras0: 0,
  ivaVentas: 0,
  ivaCompras: 0,
  creditoAnterior: 0,
  ivaPagar: 0,
};

function cambiarTemaSistema() {
  let actual = document.documentElement.getAttribute("data-theme") || "light";
  let nuevo = actual === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", nuevo);
  localStorage.setItem("temaSistemaContaUI", nuevo);
  actualizarIconoTemaSistema();
}

function actualizarIconoTemaSistema() {
  let boton = obtenerElemento("themeSistemaBtn");

  if (boton === null) {
    return;
  }

  let actual = document.documentElement.getAttribute("data-theme") || "light";

  if (actual === "light") {
    boton.innerHTML = "<i class='bx bx-moon'></i>";
  } else {
    boton.innerHTML = "<i class='bx bx-sun'></i>";
  }
}

function alternarSubmenuSistema(idSubmenu) {
  obtenerElemento(idSubmenu).classList.toggle("open");
}

function mostrarModuloSistema(modulo) {
  let vistas = document.querySelectorAll(".system-view");

  for (let i = 0; i < vistas.length; i++) {
    vistas[i].classList.remove("active");
  }

  let botones = ["btnConfigSistema", "btnFormSistema", "btnConsultasSistema"];

  for (let i = 0; i < botones.length; i++) {
    obtenerElemento(botones[i]).classList.remove("active");
  }

  if (modulo === "configuracion") {
    obtenerElemento("viewConfiguracion").classList.add("active");
    obtenerElemento("btnConfigSistema").classList.add("active");
  }

  if (modulo === "formulario104") {
    if (!configuracionCompleta()) {
      alert("Primero guarda la configuración del contribuyente.");
      mostrarModuloSistema("configuracion");
      return;
    }

    obtenerElemento("viewFormulario104").classList.add("active");
    obtenerElemento("btnFormSistema").classList.add("active");
    actualizarPagoSistema();
  }

  if (modulo === "consultas") {
    obtenerElemento("viewConsultas").classList.add("active");
    obtenerElemento("btnConsultasSistema").classList.add("active");
    pintarConsultasSistema();
  }
}

function configuracionCompleta() {
  return (
    configuracionSistema.nombre !== "" &&
    configuracionSistema.apellido !== "" &&
    configuracionSistema.razonSocial !== "" &&
    configuracionSistema.ruc !== "" &&
    configuracionSistema.regimen !== ""
  );
}

function guardarConfiguracionSistema() {
  limpiarErrores();

  configuracionSistema.nombre = obtenerValor("cfgNombre");
  configuracionSistema.apellido = obtenerValor("cfgApellido");
  configuracionSistema.razonSocial = obtenerValor("cfgRazonSocial");
  configuracionSistema.ruc = obtenerValor("cfgRuc");
  configuracionSistema.regimen = obtenerValor("cfgRegimen");

  if (configuracionSistema.nombre === "") {
    validarCampo("cfgNombre", "txtNombre", "El nombre es Obligatorio");
    return;
  }
  if (configuracionSistema.apellido === "") {
    validarCampo("cfgApellido", "txtApellido", "El apellido es Obligatorio");
    return;
  }
  if (configuracionSistema.razonSocial === "") {
    validarCampo("cfgRazonSocial", "txtRazonSocial", "El campo es Obligatorio");
    return;
  }

  if (!validarRucBasico(configuracionSistema.ruc)) {
    validarCampo("cfgRuc", "txtRuc", "El ruc debe contener 13 digitos");
    return;
  }

  if (configuracionSistema.regimen === "") {
    validarCampo("cfgRegimen", "txtRegimen", "");
    return;
  }

  guardarLocal("configuracionContaUI", configuracionSistema);
  actualizarSidebarSistema();

  abrirModalConfiguracionGuardada();
}

function irFormularioDesdeConfig() {
  guardarConfiguracionSistema();

  if (configuracionCompleta()) {
    mostrarModuloSistema("formulario104");
  }
}

function cargarConfiguracionSistema() {
  configuracionSistema = leerLocal(
    "configuracionContaUI",
    configuracionSistema,
  );

  if (configuracionSistema.nombre !== "") {
    obtenerElemento("cfgNombre").value = configuracionSistema.nombre;
    obtenerElemento("cfgApellido").value = configuracionSistema.apellido;
    obtenerElemento("cfgRazonSocial").value = configuracionSistema.razonSocial;
    obtenerElemento("cfgRuc").value = configuracionSistema.ruc;
    obtenerElemento("cfgRegimen").value = configuracionSistema.regimen;
  }

  actualizarSidebarSistema();
}

function obtenerNombreRegimen(valor) {
  if (valor === "general") {
    return "Régimen General";
  }

  if (valor === "negocio-popular") {
    return "RIMPE Negocio Popular";
  }

  if (valor === "rimpe") {
    return "RIMPE Emprendedor";
  }

  return "Seleccione régimen";
}

function obtenerNombreObligacion(valor) {
  if (valor === "2011") {
    return "2011 - Declaración mensual de IVA";
  }

  if (valor === "2021") {
    return "2021 - Declaración semestral de IVA";
  }

  return "-";
}

function actualizarSidebarSistema() {
  let nombreCompleto =
    configuracionSistema.nombre + " " + configuracionSistema.apellido;

  mostrarTexto(
    "sidebarContribuyente",
    nombreCompleto.trim() || "Sin configurar",
  );
  mostrarTexto(
    "sidebarRegimen",
    obtenerNombreRegimen(configuracionSistema.regimen),
  );
}

function validarPeriodo() {
  limpiarErrores();

  if (obtenerValor("periodoObligacion") === "") {
    validarSelect("periodoObligacion");
    return false;
  }

  if (obtenerValor("periodoMes") === "") {
    validarSelect("periodoMes");
    return false;
  }

  if (obtenerNumero("periodoAnio") <= 0) {
    validarSelect("periodoAnio");
    return false;
  }

  return true;
}

function validarPreguntas() {
  limpiarErrores();

  if (obtenerValor("preguntaVentas") === "") {
    marcarError("preguntaVentas", "Responde si tuviste ventas.");
    return false;
  }

  if (obtenerValor("preguntaCompras") === "") {
    marcarError("preguntaCompras", "Responde si tuviste compras.");
    return false;
  }

  return true;
}

function validarFormulario104() {
  limpiarErrores();

  let ventas15 = obtenerNumero("ventas15");
  let ventas0 = obtenerNumero("ventas0");
  let compras15 = obtenerNumero("compras15");
  let compras0 = obtenerNumero("compras0");

  if (ventas15 === 0 && ventas0 === 0 && compras15 === 0 && compras0 === 0) {
    marcarError("ventas15", "Ingresa al menos un valor en ventas o compras.");
    return false;
  }

  return true;
}

function mostrarPaso104(paso) {
  if (paso === "preguntas" && !validarPeriodo()) {
    return;
  }

  if (paso === "formulario" && !validarPeriodo()) {
    return;
  }

  if (paso === "pago" && (!validarPeriodo() || !validarFormulario104())) {
    return;
  }

  let pasos = document.querySelectorAll(".form104-step");
  let tabs = ["Periodo", "Preguntas", "Formulario", "Pago"];

  for (let i = 0; i < pasos.length; i++) {
    pasos[i].classList.remove("active");
  }

  for (let i = 0; i < tabs.length; i++) {
    obtenerElemento("tab" + tabs[i]).classList.remove("active");
  }

  if (paso === "periodo") {
    obtenerElemento("pasoPeriodo").classList.add("active");
    obtenerElemento("tabPeriodo").classList.add("active");
  }

  if (paso === "preguntas") {
    obtenerElemento("pasoPreguntas").classList.add("active");
    obtenerElemento("tabPreguntas").classList.add("active");
  }

  if (paso === "formulario") {
    obtenerElemento("pasoFormulario").classList.add("active");
    obtenerElemento("tabFormulario").classList.add("active");
    calcularFormulario104Sistema();
  }

  if (paso === "pago") {
    calcularFormulario104Sistema();
    actualizarPagoSistema();
    obtenerElemento("pasoPago").classList.add("active");
    obtenerElemento("tabPago").classList.add("active");
  }
}

function continuarDesdePeriodo() {
  if (validarPeriodo()) {
    mostrarPaso104("preguntas");
  }
}

function continuarDesdePreguntas() {
  if (validarPreguntas()) {
    mostrarPaso104("formulario");
  }
}

function continuarDesdeFormulario() {
  calcularFormulario104Sistema();

  if (validarFormulario104()) {
    mostrarPaso104("pago");
  }
}

function calcularFormulario104Sistema() {
  let ventas15 = obtenerNumero("ventas15");
  let ventas0 = obtenerNumero("ventas0");
  let compras15 = obtenerNumero("compras15");
  let compras0 = obtenerNumero("compras0");
  let porcentaje = obtenerNumero("ivaDeclaracion");
  let creditoAnterior = obtenerNumero("creditoAnterior");

  let ivaVentas = ventas15 * (porcentaje / 100);
  let ivaCompras = compras15 * (porcentaje / 100);
  let ivaPagar = ivaVentas - ivaCompras - creditoAnterior;

  if (ivaPagar < 0) {
    ivaPagar = 0;
  }

  calculoActual.ventas15 = ventas15;
  calculoActual.ventas0 = ventas0;
  calculoActual.compras15 = compras15;
  calculoActual.compras0 = compras0;
  calculoActual.ivaVentas = ivaVentas;
  calculoActual.ivaCompras = ivaCompras;
  calculoActual.creditoAnterior = creditoAnterior;
  calculoActual.ivaPagar = ivaPagar;

  let totalVentas = ventas15 + ventas0;
  let totalCompras = compras15 + compras0;

  mostrarTexto("netoVentas15", dinero(ventas15));
  mostrarTexto("impVentas15", dinero(ivaVentas));
  mostrarTexto("netoVentas0", dinero(ventas0));
  mostrarTexto("totalBrutoVentas", dinero(totalVentas));
  mostrarTexto("totalNetoVentas", dinero(totalVentas));
  mostrarTexto("totalImpuestoVentas", dinero(ivaVentas));

  mostrarTexto("netoCompras15", dinero(compras15));
  mostrarTexto("impCompras15", dinero(ivaCompras));
  mostrarTexto("netoCompras0", dinero(compras0));
  mostrarTexto("totalBrutoCompras", dinero(totalCompras));
  mostrarTexto("totalNetoCompras", dinero(totalCompras));
  mostrarTexto("totalImpuestoCompras", dinero(ivaCompras));

  mostrarTexto("resIvaVentas", dinero(ivaVentas));
  mostrarTexto("resIvaCompras", dinero(ivaCompras));
  mostrarTexto("resCreditoAnterior", dinero(creditoAnterior));
  mostrarTexto("resIvaPagar", dinero(ivaPagar));

  actualizarPagoSistema();
}

function actualizarPagoSistema() {
  let nombre = (
    configuracionSistema.nombre +
    " " +
    configuracionSistema.apellido
  ).trim();
  let periodo = obtenerValor("periodoMes") + " " + obtenerValor("periodoAnio");
  let obligacion = obtenerNombreObligacion(obtenerValor("periodoObligacion"));

  mostrarTexto("pagoContribuyente", nombre || "Sin configurar");
  mostrarTexto("pagoRuc", configuracionSistema.ruc || "-");
  mostrarTexto("pagoObligacion", obligacion);
  mostrarTexto("pagoPeriodo", periodo.trim());
  mostrarTexto("pagoTotal", dinero(calculoActual.ivaPagar));
}

function ejecutarGuardarDeclaracionSistema() {
  if (!validarPeriodo() || !validarFormulario104()) {
    return;
  }

  calcularFormulario104Sistema();

  let declaraciones = leerLocal("declaracionesContaUI", []);

  let nuevaDeclaracion = {
    fecha: new Date().toLocaleString(),
    contribuyente: (
      configuracionSistema.nombre +
      " " +
      configuracionSistema.apellido
    ).trim(),
    ruc: configuracionSistema.ruc,
    regimen: obtenerNombreRegimen(configuracionSistema.regimen),
    obligacion: obtenerNombreObligacion(obtenerValor("periodoObligacion")),
    periodo: obtenerValor("periodoMes") + " " + obtenerValor("periodoAnio"),
    ventas15: calculoActual.ventas15,
    ventas0: calculoActual.ventas0,
    compras15: calculoActual.compras15,
    compras0: calculoActual.compras0,
    ivaVentas: calculoActual.ivaVentas,
    ivaCompras: calculoActual.ivaCompras,
    creditoAnterior: calculoActual.creditoAnterior,
    ivaPagar: calculoActual.ivaPagar,
  };

  declaraciones.push(nuevaDeclaracion);
  guardarLocal("declaracionesContaUI", declaraciones);

  // Reinicia el Formulario 104 para que la próxima declaración empiece desde Período fiscal.
  reiniciarFormulario104DespuesDeGuardar();

  // Luego muestra el listado de consultas con la declaración recién guardada.
  mostrarModuloSistema("consultas");
}

function pintarConsultasSistema() {
  let declaraciones = leerLocal("declaracionesContaUI", []);
  let contenedor = obtenerElemento("listaConsultasSistema");

  contenedor.innerHTML = "";

  if (declaraciones.length === 0) {
    contenedor.innerHTML = "<p>No existen declaraciones guardadas.</p>";
    return;
  }

  for (let i = declaraciones.length - 1; i >= 0; i--) {
    let item = declaraciones[i];

    let card = document.createElement("article");

    card.innerHTML = `
        <div class="consulta-card"> 
            <div>
            <strong>${item.periodo}</strong> 
            <span>${item.obligacion}</span>
            <small>${item.fecha}</small>
            </div>

            <div>
            <span>Contribuyente: ${item.contribuyente}</span>
            <span>RUC: ${item.ruc}</span>
            <span>IVA ventas: ${dinero(item.ivaVentas)}</span>
            <span>IVA compras: ${dinero(item.ivaCompras)}</span>
            </div>
            <div>
            <strong class="consulta-total">A Pagar: ${dinero(item.ivaPagar)}</strong>
            </div>
        </div>
        `;

    contenedor.appendChild(card);
  }
}

function reiniciarFormulario104DespuesDeGuardar() {
  // Limpia únicamente la declaración actual, no borra la configuración del contribuyente.
  obtenerElemento("periodoObligacion").value = "";
  obtenerElemento("periodoMes").value = "";
  obtenerElemento("periodoAnio").value = "2026";

  obtenerElemento("preguntaVentas").value = "";
  obtenerElemento("preguntaCompras").value = "";
  obtenerElemento("preguntaCredito").value = "no";

  obtenerElemento("ventas15").value = "";
  obtenerElemento("ventas0").value = "";
  obtenerElemento("compras15").value = "";
  obtenerElemento("compras0").value = "";
  obtenerElemento("ivaDeclaracion").value = "15";
  obtenerElemento("creditoAnterior").value = "0";

  calculoActual = {
    ventas15: 0,
    ventas0: 0,
    compras15: 0,
    compras0: 0,
    ivaVentas: 0,
    ivaCompras: 0,
    creditoAnterior: 0,
    ivaPagar: 0,
  };

  calcularFormulario104Sistema();

  mostrarPaso104("periodo");
}

function abrirModalConfiguracionGuardada() {
  obtenerElemento("configSuccessModal").classList.add("show");
}

function cerrarModalConfiguracionGuardada() {
  obtenerElemento("configSuccessModal").classList.remove("show");
}

function irFormularioDesdeModal() {
  cerrarModalConfiguracionGuardada();
  mostrarModuloSistema("formulario104");
}

function abrirModalGuardarDeclaracion() {
  if (!validarPeriodo() || !validarFormulario104()) {
    return;
  }

  calcularFormulario104Sistema();
  obtenerElemento("sistemaConfirmModal").classList.add("show");
}

function cerrarModalGuardarDeclaracion() {
  obtenerElemento("sistemaConfirmModal").classList.remove("show");
}

function confirmarGuardarDeclaracionSistema() {
  cerrarModalGuardarDeclaracion();
  ejecutarGuardarDeclaracionSistema();
}

function limpiarSistemaDemo() {
  let confirmar = confirm("¿Seguro que deseas reiniciar el demo?");

  if (!confirmar) {
    return;
  }

  localStorage.removeItem("configuracionContaUI");
  localStorage.removeItem("declaracionesContaUI");
  location.reload();
}

cargarConfiguracionSistema();
actualizarIconoTemaSistema();
calcularFormulario104Sistema();

/* ======================================================
  NUEVO: SIDEBAR RESPONSIVE DEL SISTEMA
====================================================== */
function alternarSidebarSistemaMobile() {
  let sidebar = document.querySelector(".sistema-sidebar-left");
  let backdrop = document.getElementById("systemSidebarBackdrop");

  if (sidebar !== null) {
    sidebar.classList.toggle("open");
  }

  if (backdrop !== null) {
    backdrop.classList.toggle("show");
  }
}

function cerrarSidebarSistemaMobile() {
  let sidebar = document.querySelector(".sistema-sidebar-left");
  let backdrop = document.getElementById("systemSidebarBackdrop");

  if (sidebar !== null) {
    sidebar.classList.remove("open");
  }

  if (backdrop !== null) {
    backdrop.classList.remove("show");
  }
}

document.addEventListener("click", function (event) {
  let botonSidebarSistema = event.target.closest(
    ".sistema-sidebar-left button",
  );

  if (botonSidebarSistema !== null) {
    setTimeout(function () {
      cerrarSidebarSistemaMobile();
    }, 120);
  }
});

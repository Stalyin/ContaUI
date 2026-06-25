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
  saldoTributario: 0,
  creditoProximo: 0,
};

let ventasSistema = [];
let comprasSistema = [];
let creditosTributariosSistema = leerLocal("creditosTributariosContaUI", {});

function cambiarTemaSistema() {
  let actual = document.documentElement.getAttribute("data-theme") || "light";
  let nuevo = actual === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", nuevo);
  localStorage.setItem("temaSistemaContaUI", nuevo);
  actualizarIconoTemaSistema();
}

function actualizarIconoTemaSistema() {
  let boton = obtenerElemento("botonTemaSistema");

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

  let botones = [
    "botonConfiguracion",
    "botonRegistrarVenta",
    "botonConsultasVentas",
    "botonRegistrarCompra",
    "botonConsultasCompras",
    "botonFormulario",
    "botonConsultas",
  ];

  for (let i = 0; i < botones.length; i++) {
    let boton = obtenerElemento(botones[i]);

    if (boton !== null) {
      boton.classList.remove("active");
    }
  }

  if (modulo === "configuracion") {
    obtenerElemento("vistaConfiguracion").classList.add("active");
    obtenerElemento("botonConfiguracion").classList.add("active");
  }

  if (modulo === "ventas") {
    if (!configuracionCompleta()) {
      alert("Primero guarda la configuración del contribuyente.");
      mostrarModuloSistema("configuracion");
      return;
    }

    obtenerElemento("vistaVentas").classList.add("active");
    obtenerElemento("botonRegistrarVenta").classList.add("active");
    prepararVistaVentas();
  }

  if (modulo === "consultasVentas") {
    if (!configuracionCompleta()) {
      alert("Primero guarda la configuración del contribuyente.");
      mostrarModuloSistema("configuracion");
      return;
    }

    obtenerElemento("vistaConsultasVentas").classList.add("active");
    obtenerElemento("botonConsultasVentas").classList.add("active");
    pintarVentasSistema();
  }

  if (modulo === "compras") {
    if (!configuracionCompleta()) {
      alert("Primero guarda la configuración del contribuyente.");
      mostrarModuloSistema("configuracion");
      return;
    }

    obtenerElemento("vistaCompras").classList.add("active");
    obtenerElemento("botonRegistrarCompra").classList.add("active");
    prepararVistaCompras();
  }

  if (modulo === "consultasCompras") {
    if (!configuracionCompleta()) {
      alert("Primero guarda la configuración del contribuyente.");
      mostrarModuloSistema("configuracion");
      return;
    }

    obtenerElemento("vistaConsultasCompras").classList.add("active");
    obtenerElemento("botonConsultasCompras").classList.add("active");
    pintarOpcionesFiltroCompras();
    pintarComprasSistema();
  }

  if (modulo === "formulario104") {
    if (!configuracionCompleta()) {
      alert("Primero guarda la configuración del contribuyente.");
      mostrarModuloSistema("configuracion");
      return;
    }

    obtenerElemento("vistaFormulario104").classList.add("active");
    obtenerElemento("botonFormulario").classList.add("active");
    actualizarMesesDisponibles104();
    autocompletarCreditoAnterior();
    cargarMovimientosDelPeriodoSeleccionado();
    actualizarPagoSistema();
  }

  if (modulo === "consultas") {
    obtenerElemento("vistaConsultas").classList.add("active");
    obtenerElemento("botonConsultas").classList.add("active");
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

  if (obtenerValor("preguntaCredito") === "") {
    marcarError(
      "preguntaCredito",
      "Responde si tienes crédito tributario anterior.",
    );
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

  if (paso === "formulario" && (!validarPeriodo() || !validarPreguntas())) {
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
    cargarMovimientosDelPeriodoSeleccionado();
    autocompletarPreguntasPeriodo();
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
  let diferencia = ivaVentas - ivaCompras - creditoAnterior;
  let ivaPagar = diferencia > 0 ? diferencia : 0;
  let saldoTributario = diferencia < 0 ? Math.abs(diferencia) : 0;

  calculoActual.ventas15 = ventas15;
  calculoActual.ventas0 = ventas0;
  calculoActual.compras15 = compras15;
  calculoActual.compras0 = compras0;
  calculoActual.ivaVentas = ivaVentas;
  calculoActual.ivaCompras = ivaCompras;
  calculoActual.creditoAnterior = creditoAnterior;
  calculoActual.ivaPagar = ivaPagar;
  calculoActual.saldoTributario = saldoTributario;
  calculoActual.creditoProximo = saldoTributario;

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

  let resumen = obtenerElemento("resIvaPagar");
  if (resumen !== null && saldoTributario > 0) {
    resumen.innerText = "Crédito A favor " + dinero(saldoTributario);
  }

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
  let textoTotal = dinero(calculoActual.ivaPagar);

  if (calculoActual.saldoTributario > 0) {
    textoTotal =
      dinero(calculoActual.ivaPagar) +
      " · Crédito próximo " +
      dinero(calculoActual.saldoTributario);
  }

  mostrarTexto("pagoContribuyente", nombre || "Sin configurar");
  mostrarTexto("pagoRuc", configuracionSistema.ruc || "-");
  mostrarTexto("pagoObligacion", obligacion);
  mostrarTexto("pagoPeriodo", periodo.trim());
  mostrarTexto("pagoFechaMaxima", obtenerFechaMaximaPagoDeclaracion());
  mostrarTexto("pagoTotal", textoTotal);
}

function ejecutarGuardarDeclaracionSistema() {
  if (!validarPeriodo() || !validarFormulario104()) {
    return;
  }

  calcularFormulario104Sistema();

  let declaraciones = leerLocal("declaracionesContaUI", []);

  let nuevaDeclaracion = {
    id: Date.now(),
    numeroSerie: generarNumeroSerieDeclaracion(),
    fecha: new Date().toLocaleString(),
    fechaISO: new Date().toISOString(),
    fechaMaximaPago: obtenerFechaMaximaPagoDeclaracion(),
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
    saldoTributario: calculoActual.saldoTributario,
    creditoProximo: calculoActual.creditoProximo,
  };

  declaraciones.push(nuevaDeclaracion);
  guardarLocal("declaracionesContaUI", declaraciones);
  guardarCreditoTributarioPeriodo(calculoActual.creditoProximo);
  reiniciarFormulario104DespuesDeGuardar();
  mostrarModuloSistema("consultas");
}

function pintarConsultasSistema() {
  let declaraciones = leerLocal("declaracionesContaUI", []);
  let contenedor = obtenerElemento("listaConsultasSistema");

  contenedor.innerHTML = "";

  if (declaraciones.length === 0) {
    contenedor.innerHTML = `
      <tr>
        <td colspan="7">No existen declaraciones guardadas.</td>
      </tr>
    `;
    return;
  }

  for (let i = 0; i < declaraciones.length; i++) {
    let item = declaraciones[i];
    let fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.periodo}</td>
      <td>${item.obligacion}</td>
      <td>${item.fecha || "Pendiente"}</td>
      <td class="ivaDetalle">${dinero(item.ivaVentas)}</td>
      <td class="ivaDetalle">${dinero(item.ivaCompras)}</td>
      <td class="ivaPagar">${dinero(item.ivaPagar)}</td>
      <td>
        <button class="primary-btn" onclick="abrirComprobanteDeclaracion(${i})">
          <i class='bx bx-printer'></i>
          Imprimir
        </button>
      </td>
    `;

    contenedor.appendChild(fila);
  }
}

function reiniciarFormulario104DespuesDeGuardar() {
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
    saldoTributario: 0,
    creditoProximo: 0,
  };

  calcularFormulario104Sistema();

  mostrarPaso104("periodo");
}

function generarNumeroSerieDeclaracion() {
  let secuencia = leerLocal("secuenciaDeclaracionesContaUI", 872176019280);
  secuencia = Number(secuencia) + 1;
  guardarLocal("secuenciaDeclaracionesContaUI", secuencia);
  return String(secuencia);
}

function obtenerFechaMaximaPagoDeclaracion() {
  return new Date().toLocaleDateString("es-EC");
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
  localStorage.removeItem("ventasContaUI");
  localStorage.removeItem("comprasContaUI");
  localStorage.removeItem("secuenciaComprasContaUI");
  localStorage.removeItem("creditosTributariosContaUI");
  localStorage.removeItem("secuenciaDeclaracionesContaUI");
  location.reload();
}

cargarConfiguracionSistema();
cargarVentasSistema();
cargarComprasSistema();
prepararFechasSistema();
actualizarIconoTemaSistema();
calcularFormulario104Sistema();

//  MODULO DE VENTAS - Sonicse

function cargarVentasSistema() {
  ventasSistema = leerLocal("ventasContaUI", []);
}

function prepararVistaVentas() {
  if (existeElemento("ventaFecha") && obtenerValor("ventaFecha") === "") {
    obtenerElemento("ventaFecha").value = obtenerFechaActualISO();
  }

  actualizarPreviewVenta();
}

function obtenerSecuenciaVenta() {
  return obtenerSecuenciaLocal("secuenciaVentasContaUI", 1);
}

function generarNumeroComprobanteVenta() {
  return generarCodigoSecuencial("VENT", "secuenciaVentasContaUI", 6);
}

function avanzarSecuenciaVenta() {
  avanzarSecuenciaLocal("secuenciaVentasContaUI");
}

function obtenerTarifaVenta() {
  return obtenerNumero("ventaTarifa");
}

function actualizarPreviewVenta() {
  let preview = obtenerElemento("ventaComprobantePreview");
  if (preview !== null) {
    preview.innerText = generarNumeroComprobanteVenta();
  }

  let base = obtenerNumero("ventaBase");
  let tarifa = obtenerTarifaVenta();
  let calculo = calcularMovimiento(base, tarifa);

  mostrarTexto("previewVentaBase", dinero(base));
  mostrarTexto("previewVentaIva", dinero(calculo.iva));
  mostrarTexto("previewVentaTotal", dinero(calculo.total));
}

function crearMovimientoSistema(configuracion) {
  let fecha = obtenerValor(configuracion.idFecha) || obtenerFechaActualISO();
  let descripcion = obtenerValor(configuracion.idDescripcion);
  let base = obtenerNumero(configuracion.idBase);
  let tarifa = configuracion.obtenerTarifa();

  if (fecha === "") {
    validarCampo(
      configuracion.idFecha,
      configuracion.idErrorFecha,
      "Selecciona una fecha.",
    );
    return null;
  }

  if (base <= 0) {
    validarCampo(
      configuracion.idBase,
      configuracion.idErrorBase,
      "Ingresa un valor base mayor a 0.",
    );
    return null;
  }

  let calculo = calcularMovimiento(base, tarifa);

  return {
    id: Date.now(),
    comprobante: configuracion.generarComprobante(),
    cliente: obtenerValor(configuracion.cliente) || "Consumidor Final",
    fecha: fecha,
    periodoClave: obtenerClavePeriodoPorFecha(fecha),
    descripcion: descripcion || configuracion.descripcionDefault,
    base: base,
    tarifa: tarifa,
    iva: calculo.iva,
    total: calculo.total,
  };
}

function agregarVentaSistema() {
  limpiarErrores();

  let venta = crearMovimientoSistema({
    cliente: "ventaCliente",
    idFecha: "ventaFecha",
    idErrorFecha: "txtVentaFecha",
    idDescripcion: "ventaDescripcion",
    idBase: "ventaBase",
    idErrorBase: "txtVentaBase",
    descripcionDefault: "Venta sin descripción",
    obtenerTarifa: obtenerTarifaVenta,
    generarComprobante: generarNumeroComprobanteVenta,
  });

  if (venta === null) {
    return;
  }

  ventasSistema.push(venta);
  guardarLocal("ventasContaUI", ventasSistema);
  avanzarSecuenciaVenta();

  limpiarCampos([
    { id: "ventaFecha", valor: obtenerFechaActualISO() },
    { id: "ventaCliente", valor: "" },
    { id: "ventaDescripcion", valor: "" },
    { id: "ventaBase", valor: "" },
    { id: "ventaTarifa", valor: "15" },
  ]);

  actualizarPreviewVenta();
  pintarVentasSistema();
  actualizarMesesDisponibles104();

  let mensaje = obtenerElemento("mensajeVentaAgregada");
  if (mensaje !== null) {
    mensaje.innerText =
      "✓ Venta " +
      venta.comprobante +
      " agregada para " +
      venta.periodoClave.replace("-", " ") +
      ".";
  }
}

function pintarOpcionesFiltroVentas() {
  pintarOpcionesMeses("filtroVentasMes");
}

function pintarOpcionesMeses(idSelect) {
  let select = obtenerElemento(idSelect);
  if (select === null) {
    return;
  }

  let valorActual = select.value;
  select.innerHTML = '<option value="">Todos los meses</option>';

  for (let i = 0; i < mesesSistema.length; i++) {
    select.innerHTML +=
      '<option value="' +
      mesesSistema[i] +
      '">' +
      mesesSistema[i] +
      "</option>";
  }

  select.value = valorActual;
}

function crearFilaMovimiento(item, claseFila, funcionEliminar) {
  let fila = document.createElement("div");
  fila.className = "ventas-row " + claseFila;

  fila.innerHTML = `
    <span data-label="Comprobante">${item.comprobante || "Pendiente"}</span>
    <span data-label="Cliente">${item.cliente || "Consumidor Final"} </span>
    <span data-label="Fecha">${formatearFechaCorta(item.fecha)}</span>
    <span data-label="Descripción">${item.descripcion}</span>
    <span data-label="Tarifa">${item.tarifa}%</span>
    <span data-label="Base">${dinero(item.base)}</span>
    <span data-label="IVA">${dinero(item.iva)}</span>
    <span data-label="Total">${dinero(item.total)}</span>
    <span data-label="Acciones">
      <button class="dashboard-btn danger" onclick="${funcionEliminar}(${item.id})">
        <i class="bx bx-trash"></i>
      </button>
    </span>
  `;

  return fila;
}

function pintarVentasSistema() {
  let contenedor = obtenerElemento("ventasBody");

  if (contenedor === null) {
    return;
  }

  pintarOpcionesFiltroVentas();

  let ventasFiltradas = filtrarPorPeriodo(
    ventasSistema,
    "filtroVentasMes",
    "filtroVentasAnio",
  );

  contenedor.innerHTML = "";

  if (ventasFiltradas.length === 0) {
    contenedor.innerHTML =
      '<div class="ventas-empty"><span>No hay ventas para este filtro.</span></div>';
    calcularTotalesVentas(ventasFiltradas);
    return;
  }

  for (let i = 0; i < ventasFiltradas.length; i++) {
    contenedor.appendChild(
      crearFilaMovimiento(
        ventasFiltradas[i],
        "ventas-row-fecha movimientos-row",
        "eliminarVentaSistema",
      ),
    );
  }

  calcularTotalesVentas(ventasFiltradas);
}

function calcularTotalesMovimientos(lista) {
  let totalBase15 = 0;
  let totalBase0 = 0;
  let totalIva = 0;
  let totalGeneral = 0;

  for (let i = 0; i < lista.length; i++) {
    let item = lista[i];

    if (item.tarifa === 0) {
      totalBase0 += item.base;
    } else {
      totalBase15 += item.base;
    }

    totalIva += item.iva;
    totalGeneral += item.total;
  }

  return {
    base15: totalBase15,
    base0: totalBase0,
    iva: totalIva,
    total: totalGeneral,
  };
}

function calcularTotalesVentas(lista) {
  let totales = calcularTotalesMovimientos(lista || ventasSistema);

  mostrarTexto("totalVentas15", dinero(totales.base15));
  mostrarTexto("totalVentas0", dinero(totales.base0));
  mostrarTexto("totalVentasIva", dinero(totales.iva));
  mostrarTexto("totalVentasGeneral", dinero(totales.total));
  mostrarTexto("kpiVentas15", dinero(totales.base15));
  mostrarTexto("kpiVentas0", dinero(totales.base0));
  mostrarTexto("kpiVentasIva", dinero(totales.iva));
  mostrarTexto("kpiVentasTotal", dinero(totales.total));

  return totales;
}

function eliminarVentaSistema(id) {
  ventasSistema = ventasSistema.filter(function (venta) {
    return venta.id !== id;
  });

  guardarLocal("ventasContaUI", ventasSistema);
  pintarVentasSistema();
  actualizarMesesDisponibles104();
}

function limpiarVentasSistema() {
  if (ventasSistema.length === 0) {
    return;
  }

  let confirmar = confirm(
    "¿Seguro que deseas vaciar todas las ventas registradas?",
  );

  if (!confirmar) {
    return;
  }

  ventasSistema = [];
  guardarLocal("ventasContaUI", ventasSistema);
  pintarVentasSistema();
  actualizarMesesDisponibles104();
}

function enviarVentasAlFormulario104() {
  if (ventasSistema.length === 0) {
    alert("Primero registra al menos una venta.");
    return;
  }

  let totales = calcularTotalesVentas();

  obtenerElemento("ventas15").value = totales.base15 > 0 ? totales.base15 : "";
  obtenerElemento("ventas0").value = totales.base0 > 0 ? totales.base0 : "";

  calcularFormulario104Sistema();
  mostrarModuloSistema("formulario104");

  if (
    obtenerValor("periodoObligacion") !== "" &&
    obtenerValor("periodoMes") !== ""
  ) {
    mostrarPaso104("formulario");
  } else {
    mostrarPaso104("periodo");
  }
}

//  NUEVO: SIDEBAR RESPONSIVE DEL SISTEMA

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
  let boton = event.target.closest(".sistema-sidebar-left button");

  if (boton === null) {
    return;
  }

  let esDropdown = boton.parentElement.classList.contains("sidebar-dropdown");

  if (esDropdown) {
    return;
  }

  setTimeout(function () {
    cerrarSidebarSistemaMobile();
  }, 120);
});

/* ============================================================
   MODULO DE COMPRAS Y PERIODOS 104
   ============================================================ */

const mesesSistema = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function obtenerFechaActualISO() {
  return new Date().toISOString().slice(0, 10);
}

function prepararFechasSistema() {
  if (existeElemento("ventaFecha")) {
    obtenerElemento("ventaFecha").value = obtenerFechaActualISO();
  }
  if (existeElemento("compraFecha")) {
    obtenerElemento("compraFecha").value = obtenerFechaActualISO();
  }
  if (existeElemento("filtroComprasAnio")) {
    obtenerElemento("filtroComprasAnio").value = new Date().getFullYear();
  }
  actualizarMesesDisponibles104();
}

function formatearFechaCorta(fecha) {
  if (!fecha) {
    return "-";
  }
  let partes = fecha.split("-");
  if (partes.length !== 3) {
    return fecha;
  }
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function obtenerClavePeriodoPorFecha(fecha) {
  if (!fecha) {
    return "";
  }
  let partes = fecha.split("-");
  if (partes.length !== 3) {
    return "";
  }
  let anio = partes[0];
  let mesIndex = parseInt(partes[1], 10) - 1;
  return mesesSistema[mesIndex] + "-" + anio;
}

function obtenerClavePeriodoSeleccionado() {
  let mes = obtenerValor("periodoMes");
  let anio = obtenerValor("periodoAnio");
  if (mes === "" || anio === "") {
    return "";
  }
  return mes + "-" + anio;
}

function obtenerPeriodoAnterior(clavePeriodo) {
  if (!clavePeriodo) {
    return "";
  }
  let partes = clavePeriodo.split("-");
  let mesIndex = mesesSistema.indexOf(partes[0]);
  let anio = parseInt(partes[1], 10);
  if (mesIndex <= 0) {
    return "Diciembre-" + (anio - 1);
  }
  return mesesSistema[mesIndex - 1] + "-" + anio;
}

function prepararVistaCompras() {
  if (existeElemento("compraFecha") && obtenerValor("compraFecha") === "") {
    obtenerElemento("compraFecha").value = obtenerFechaActualISO();
  }
  actualizarPreviewCompra();
}

function cargarComprasSistema() {
  comprasSistema = leerLocal("comprasContaUI", []);
}

function obtenerSecuenciaCompra() {
  return obtenerSecuenciaLocal("secuenciaComprasContaUI", 1);
}

function generarNumeroComprobanteCompra() {
  return generarCodigoSecuencial("COMP", "secuenciaComprasContaUI", 6);
}

function avanzarSecuenciaCompra() {
  avanzarSecuenciaLocal("secuenciaComprasContaUI");
}

function obtenerTarifaCompra() {
  let seleccion = obtenerValor("compraTarifa");
  if (seleccion === "personalizado") {
    return obtenerNumero("compraTarifaPersonalizada");
  }
  return parseFloat(seleccion || "0");
}

function actualizarPreviewCompra() {
  let preview = obtenerElemento("compraComprobantePreview");
  if (preview !== null) {
    preview.innerText = generarNumeroComprobanteCompra();
  }

  let grupoPersonalizado = obtenerElemento("grupoIvaPersonalizado");
  if (grupoPersonalizado !== null) {
    if (obtenerValor("compraTarifa") === "personalizado") {
      grupoPersonalizado.classList.remove("hidden-field");
    } else {
      grupoPersonalizado.classList.add("hidden-field");
    }
  }

  let base = obtenerNumero("compraBase");
  let tarifa = obtenerTarifaCompra();
  let calculo = calcularMovimiento(base, tarifa);

  mostrarTexto("previewCompraBase", dinero(base));
  mostrarTexto("previewCompraIva", dinero(calculo.iva));
  mostrarTexto("previewCompraTotal", dinero(calculo.total));
}

function agregarCompraSistema() {
  limpiarErrores();

  let compra = crearMovimientoSistema({
    idFecha: "compraFecha",
    idErrorFecha: "txtCompraFecha",
    idDescripcion: "compraDescripcion",
    idBase: "compraBase",
    idErrorBase: "txtCompraBase",
    descripcionDefault: "Compra sin descripción",
    obtenerTarifa: obtenerTarifaCompra,
    generarComprobante: generarNumeroComprobanteCompra,
  });

  if (compra === null) {
    return;
  }

  comprasSistema.push(compra);
  guardarLocal("comprasContaUI", comprasSistema);
  avanzarSecuenciaCompra();

  limpiarCampos([
    { id: "compraFecha", valor: obtenerFechaActualISO() },
    { id: "compraDescripcion", valor: "" },
    { id: "compraBase", valor: "" },
    { id: "compraTarifa", valor: "15" },
    { id: "compraTarifaPersonalizada", valor: "15" },
  ]);

  actualizarPreviewCompra();
  pintarOpcionesFiltroCompras();
  actualizarMesesDisponibles104();

  let mensaje = obtenerElemento("mensajeCompraAgregada");
  if (mensaje !== null) {
    mensaje.innerText =
      "✓ Compra " +
      compra.comprobante +
      " agregada para " +
      compra.periodoClave.replace("-", " ") +
      ".";
  }
}

function pintarOpcionesFiltroCompras() {
  pintarOpcionesMeses("filtroComprasMes");
}

function pintarComprasSistema() {
  let contenedor = obtenerElemento("comprasBody");
  if (contenedor === null) {
    return;
  }

  let comprasFiltradas = filtrarPorPeriodo(
    comprasSistema,
    "filtroComprasMes",
    "filtroComprasAnio",
  );

  contenedor.innerHTML = "";

  if (comprasFiltradas.length === 0) {
    contenedor.innerHTML =
      '<div class="ventas-empty"><span>No hay compras para este filtro.</span></div>';
    calcularTotalesCompras(comprasFiltradas);
    return;
  }

  for (let i = 0; i < comprasFiltradas.length; i++) {
    contenedor.appendChild(
      crearFilaMovimiento(
        comprasFiltradas[i],
        "compras-row movimientos-row",
        "eliminarCompraSistema",
      ),
    );
  }

  calcularTotalesCompras(comprasFiltradas);
}

function calcularTotalesCompras(lista) {
  let totales = calcularTotalesMovimientos(lista || comprasSistema);

  mostrarTexto("totalCompras15", dinero(totales.base15));
  mostrarTexto("totalCompras0", dinero(totales.base0));
  mostrarTexto("totalComprasIva", dinero(totales.iva));
  mostrarTexto("totalComprasGeneral", dinero(totales.total));

  return totales;
}

function eliminarCompraSistema(id) {
  comprasSistema = comprasSistema.filter(function (compra) {
    return compra.id !== id;
  });
  guardarLocal("comprasContaUI", comprasSistema);
  pintarComprasSistema();
  actualizarMesesDisponibles104();
}

function limpiarComprasSistema() {
  if (comprasSistema.length === 0) {
    return;
  }
  let confirmar = confirm(
    "¿Seguro que deseas vaciar todas las compras registradas?",
  );
  if (!confirmar) {
    return;
  }
  comprasSistema = [];
  guardarLocal("comprasContaUI", comprasSistema);
  pintarComprasSistema();
  actualizarMesesDisponibles104();
}

function obtenerMovimientosPeriodo(clavePeriodo) {
  let ventas = ventasSistema.filter(function (venta) {
    let clave = venta.periodoClave || obtenerClavePeriodoPorFecha(venta.fecha);
    return clave === clavePeriodo;
  });
  let compras = comprasSistema.filter(function (compra) {
    let clave =
      compra.periodoClave || obtenerClavePeriodoPorFecha(compra.fecha);
    return clave === clavePeriodo;
  });
  return { ventas: ventas, compras: compras };
}

function calcularTotalesVentasLista(lista) {
  let totalBase15 = 0;
  let totalBase0 = 0;
  let totalIva = 0;
  let totalGeneral = 0;
  for (let i = 0; i < lista.length; i++) {
    let venta = lista[i];
    if (venta.tarifa === 0) {
      totalBase0 += venta.base;
    } else {
      totalBase15 += venta.base;
    }
    totalIva += venta.iva;
    totalGeneral += venta.total;
  }
  return {
    base15: totalBase15,
    base0: totalBase0,
    iva: totalIva,
    total: totalGeneral,
  };
}

function cargarMovimientosDelPeriodoSeleccionado() {
  let clave = obtenerClavePeriodoSeleccionado();
  if (clave === "") {
    return;
  }

  let movimientos = obtenerMovimientosPeriodo(clave);
  let totalesVentas = calcularTotalesVentasLista(movimientos.ventas);
  let totalesCompras = calcularTotalesCompras(movimientos.compras);

  obtenerElemento("ventas15").value =
    totalesVentas.base15 > 0 ? totalesVentas.base15.toFixed(2) : "";
  obtenerElemento("ventas0").value =
    totalesVentas.base0 > 0 ? totalesVentas.base0.toFixed(2) : "";
  obtenerElemento("compras15").value =
    totalesCompras.base15 > 0 ? totalesCompras.base15.toFixed(2) : "";
  obtenerElemento("compras0").value =
    totalesCompras.base0 > 0 ? totalesCompras.base0.toFixed(2) : "";

  autocompletarCreditoAnterior();
  autocompletarPreguntasPeriodo();
  actualizarResumenPeriodo(movimientos, totalesVentas, totalesCompras);
  calcularFormulario104Sistema();
}

function actualizarResumenPeriodo(movimientos, totalesVentas, totalesCompras) {
  let resumen = obtenerElemento("periodoResumenMovimientos");
  if (resumen === null) {
    return;
  }
  resumen.innerText =
    "Período detectado: " +
    movimientos.ventas.length +
    " venta(s), " +
    movimientos.compras.length +
    " compra(s). Ventas " +
    dinero(totalesVentas.total) +
    " · Compras " +
    dinero(totalesCompras.total) +
    ".";
}

function autocompletarPreguntasPeriodo() {
  let clave = obtenerClavePeriodoSeleccionado();
  let movimientos = obtenerMovimientosPeriodo(clave);
  let tieneVentas =
    movimientos.ventas.length > 0 ||
    obtenerNumero("ventas15") > 0 ||
    obtenerNumero("ventas0") > 0;
  let tieneCompras =
    movimientos.compras.length > 0 ||
    obtenerNumero("compras15") > 0 ||
    obtenerNumero("compras0") > 0;
  let tieneCredito = obtenerNumero("creditoAnterior") > 0;

  if (existeElemento("preguntaVentas")) {
    obtenerElemento("preguntaVentas").value = tieneVentas ? "si" : "no";
  }
  if (existeElemento("preguntaCompras")) {
    obtenerElemento("preguntaCompras").value = tieneCompras ? "si" : "no";
  }
  if (existeElemento("preguntaCredito")) {
    obtenerElemento("preguntaCredito").value = tieneCredito ? "si" : "no";
  }
}

function actualizarMesesDisponibles104() {
  let select = obtenerElemento("periodoMes");
  if (select === null) {
    return;
  }
  let anio = obtenerValor("periodoAnio") || String(new Date().getFullYear());
  let mesesConDatos = {};

  for (let i = 0; i < ventasSistema.length; i++) {
    let claveVenta =
      ventasSistema[i].periodoClave ||
      obtenerClavePeriodoPorFecha(ventasSistema[i].fecha);
    mesesConDatos[claveVenta] = true;
  }
  for (let j = 0; j < comprasSistema.length; j++) {
    let claveCompra =
      comprasSistema[j].periodoClave ||
      obtenerClavePeriodoPorFecha(comprasSistema[j].fecha);
    mesesConDatos[claveCompra] = true;
  }

  let valorActual = select.value;
  for (let k = 0; k < select.options.length; k++) {
    let option = select.options[k];
    if (option.value === "") {
      option.disabled = false;
      continue;
    }
    let clave = option.value + "-" + anio;
    option.disabled = !mesesConDatos[clave];
  }

  if (valorActual !== "") {
    select.value = valorActual;
  }
}

function autocompletarCreditoAnterior() {
  let clave = obtenerClavePeriodoSeleccionado();
  if (clave === "") {
    return;
  }
  let anterior = obtenerPeriodoAnterior(clave);
  let credito = creditosTributariosSistema[anterior] || 0;
  if (existeElemento("creditoAnterior")) {
    obtenerElemento("creditoAnterior").value =
      credito > 0 ? credito.toFixed(2) : "0";
  }
}

function guardarCreditoTributarioPeriodo(valor) {
  let clave = obtenerClavePeriodoSeleccionado();
  if (clave === "") {
    return;
  }
  creditosTributariosSistema[clave] = Number(valor || 0);
  guardarLocal("creditosTributariosContaUI", creditosTributariosSistema);
}

function enviarComprasAlFormulario104() {
  if (comprasSistema.length === 0) {
    alert("Primero registra al menos una compra.");
    return;
  }

  mostrarModuloSistema("formulario104");
  let ultimaCompra = comprasSistema[comprasSistema.length - 1];
  let clave =
    ultimaCompra.periodoClave ||
    obtenerClavePeriodoPorFecha(ultimaCompra.fecha);
  let partes = clave.split("-");
  if (partes.length === 2) {
    obtenerElemento("periodoMes").value = partes[0];
    obtenerElemento("periodoAnio").value = partes[1];
  }
  cargarMovimientosDelPeriodoSeleccionado();
  mostrarPaso104("periodo");
}

function enviarVentasAlFormulario104() {
  if (ventasSistema.length === 0) {
    alert("Primero registra al menos una venta.");
    return;
  }

  mostrarModuloSistema("formulario104");
  let ultimaVenta = ventasSistema[ventasSistema.length - 1];
  let clave =
    ultimaVenta.periodoClave || obtenerClavePeriodoPorFecha(ultimaVenta.fecha);
  let partes = clave.split("-");
  if (partes.length === 2) {
    obtenerElemento("periodoMes").value = partes[0];
    obtenerElemento("periodoAnio").value = partes[1];
  }
  cargarMovimientosDelPeriodoSeleccionado();
  mostrarPaso104("periodo");
}

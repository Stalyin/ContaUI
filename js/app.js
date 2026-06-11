function irARecurso(tema) {
  mostrarVista("aprender", tema);

  let contenedorAprender = obtenerElemento("aprender");

  if (contenedorAprender !== null) {
    setTimeout(function () {
      contenedorAprender.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }
}

function mostrarVista(idVista, idTema = "overview") {
  let vistas = document.querySelectorAll(".view");

  for (let i = 0; i < vistas.length; i++) {
    vistas[i].classList.remove("view--active");
  }

  let vista = obtenerElemento(idVista);

  if (vista !== null) {
    vista.classList.add("view--active");
  }

  actualizarNavPrincipal(idVista);

  if (idVista === "aprender") {
    mostrarTema(idTema);
  }

  if (idVista === "quiz" && typeof prepararQuizAlEntrar === "function") {
    prepararQuizAlEntrar();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  cerrarMenu();
}

function actualizarNavPrincipal(idVista) {
  let enlaces = document.querySelectorAll(".nav-link");

  for (let i = 0; i < enlaces.length; i++) {
    enlaces[i].classList.remove("active");

    if (enlaces[i].dataset.section === idVista) {
      enlaces[i].classList.add("active");
    }
  }
}

function alternarSidebarRecursos() {
  let sidebar = document.querySelector(".docs-sidebar");
  let backdrop = obtenerElemento("docsSidebarBackdrop");

  if (sidebar !== null) {
    sidebar.classList.toggle("open");
  }

  if (backdrop !== null) {
    backdrop.classList.toggle("show");
  }
}

function cerrarSidebarRecursos() {
  let sidebar = document.querySelector(".docs-sidebar");
  let backdrop = document.getElementById("docsSidebarBackdrop");

  if (sidebar !== null) {
    sidebar.classList.remove("open");
  }

  if (backdrop !== null) {
    backdrop.classList.remove("show");
  }
}

function mostrarTema(idTema) {
  let temas = document.querySelectorAll(".topic");

  for (let i = 0; i < temas.length; i++) {
    temas[i].classList.remove("topic--active");
  }

  let tema = obtenerElemento("topic-" + idTema);

  if (tema !== null) {
    tema.classList.add("topic--active");
  }

  actualizarTemaActivo(idTema);
}

function actualizarTemaActivo(idTema) {
  let sideLinks = document.querySelectorAll(".side-link");
  let tabs = document.querySelectorAll(".tab-item");

  for (let i = 0; i < sideLinks.length; i++) {
    sideLinks[i].classList.remove("active");

    if (sideLinks[i].dataset.topic === idTema) {
      sideLinks[i].classList.add("active");
    }
  }

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");

    let texto = tabs[i].innerText.toLowerCase();

    if (
      (idTema === "overview" &&
        (texto.includes("inicio") || texto.includes("todos"))) ||
      (idTema === "iva" && texto === "iva") ||
      (idTema === "tarifa0" && texto.includes("tarifa")) ||
      (idTema === "subtotal" && texto.includes("subtotal")) ||
      (idTema === "total" && texto.includes("total")) ||
      (idTema === "electronica" && texto.includes("electrónica")) ||
      (idTema === "declaraciones" && texto.includes("declaraciones")) ||
      (idTema === "formulario104" && texto.includes("formulario"))
    ) {
      tabs[i].classList.add("active");
    }
  }
}

function alternarMenu() {
  let menu = obtenerElemento("mainNav");
  menu.classList.toggle("open");
}

function cerrarMenu() {
  let menu = obtenerElemento("mainNav");
  menu.classList.remove("open");
}

function contarGithub() {
  let clicks = localStorage.getItem("githubClicks");

  if (clicks === null) {
    clicks = 0;
  }

  clicks = parseInt(clicks) + 1;
  localStorage.setItem("githubClicks", clicks);
  obtenerElemento("contadorGithub").innerText = clicks;

  let url = "https://github.com/ScarlettCordova/contaUI";
  window.open(url, "_blank");
}

function cargarContadorGithub() {
  let clicks = localStorage.getItem("githubClicks");

  if (clicks === null) {
    clicks = 0;
  }

  obtenerElemento("contadorGithub").innerText = clicks;
}

cargarContadorGithub();

function obtenerTemaActual() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

function aplicarTema(tema, guardarPreferencia) {
  document.documentElement.setAttribute("data-theme", tema);

  if (guardarPreferencia === true) {
    localStorage.setItem("temaContaFacil", tema);
  }

  actualizarBotonTema();
}

function cambiarTema() {
  let temaActual = obtenerTemaActual();
  let nuevoTema = temaActual === "dark" ? "light" : "dark";

  aplicarTema(nuevoTema, true);
}

function actualizarBotonTema() {
  let botones = [
    document.getElementById("themeToggleBtn"),
    document.getElementById("themeToggleNavBtn"),
    document.getElementById("themeToggleFooterBtn"),
  ];

  let temaActual = obtenerTemaActual();
  let contenido = "";

  if (temaActual === "dark") {
    contenido = "<i class='bx bx-sun'></i>";
  } else {
    contenido = "<i class='bx bx-moon'></i>";
  }

  for (let i = 0; i < botones.length; i++) {
    if (botones[i] !== null) {
      botones[i].innerHTML = contenido;
    }
  }
}

function iniciarTemaSistema() {
  actualizarBotonTema();

  let mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  mediaQuery.addEventListener("change", function (evento) {
    let temaGuardado = localStorage.getItem("temaContaFacil");

    if (temaGuardado === "light" || temaGuardado === "dark") {
      return;
    }

    aplicarTema(evento.matches ? "light" : "dark", false);
  });
}

iniciarTemaSistema();


/* ============================================================
   Explorador interactivo del proyecto (seccion Developers)
   Movido aqui desde developers.js para centralizar la logica.
   ============================================================ */

const archivosDev = {
  index: {
    icono: "bxl-html5",
    nombre: "index.html",
    tipo: "Página HTML",
    desc: "Es la puerta de entrada del proyecto. Contiene el inicio, la sección de Recursos (la documentación), el cuestionario y la vista de Developers. Enlaza todos los estilos y scripts.",
    hace: [
      "Define la estructura de todas las vistas del sitio.",
      "Carga la hoja de estilos y los archivos JavaScript.",
      "Es la primera página que ve el usuario al entrar.",
    ],
  },
  sistemaHtml: {
    icono: "bxl-html5",
    nombre: "sistema.html",
    tipo: "Página HTML",
    desc: "La aplicación práctica del proyecto. Es un simulador donde el usuario registra ventas, compras e impuestos para armar un resumen educativo tipo Formulario 104.",
    hace: [
      "Ofrece un entorno de práctica separado del sitio principal.",
      "Permite registrar datos del contribuyente y sus operaciones.",
      "Muestra el cálculo del IVA a pagar paso a paso.",
    ],
  },
  style: {
    icono: "bxl-css3",
    nombre: "style.css",
    tipo: "Hoja de estilos",
    desc: "Una única hoja de estilos que define toda la apariencia del proyecto: colores, tipografía, espaciados y los temas claro y oscuro mediante variables CSS.",
    hace: [
      "Centraliza colores y medidas en variables dentro de :root.",
      "Da estilo a componentes reutilizables (cards, botones, tablas).",
      "Incluye diseño responsive y soporte de tema claro/oscuro.",
    ],
  },
  app: {
    icono: "bxl-javascript",
    nombre: "app.js",
    tipo: "JavaScript · Navegación",
    desc: "El cerebro de la navegación. Controla qué vista se muestra, el menú, los temas de la documentación y el cambio entre modo claro y oscuro.",
    hace: [
      "Cambia entre vistas (Inicio, Recursos, Quiz, Developers).",
      "Gestiona el tema claro/oscuro y lo guarda en el navegador.",
      "Activa el tema correcto dentro de la sección de Recursos.",
    ],
    funciones: ["mostrarVista()", "mostrarTema()", "cambiarTema()"],
  },
  utilitarios: {
    icono: "bxl-javascript",
    nombre: "utilitarios.js",
    tipo: "JavaScript · Utilidades",
    desc: "La caja de herramientas del proyecto. Reúne funciones cortas que se reutilizan en todas partes: obtener elementos, validar formularios, formatear dinero y manejar modales.",
    hace: [
      "Simplifica el acceso a elementos del HTML.",
      "Valida campos y muestra mensajes de error.",
      "Da formato a valores monetarios y controla los modales.",
    ],
    funciones: ["obtenerElemento()", "validarCampo()", "dinero()"],
  },
  calculator: {
    icono: "bxl-javascript",
    nombre: "dinamic-calculator.js",
    tipo: "JavaScript · Cálculos",
    desc: "Las calculadoras interactivas de la sección Recursos. Calculan IVA, subtotal, total e impuesto básico en tiempo real para que el usuario practique con sus propios números.",
    hace: [
      "Calcula IVA, subtotal y total de una factura.",
      "Resuelve el impuesto básico (base × tasa).",
      "Muestra los resultados con formato de dinero.",
    ],
    funciones: ["calcularIvaAprendizaje()", "calcularSubtotalAprendizaje()"],
  },
  data: {
    icono: "bxl-javascript",
    nombre: "data.js",
    tipo: "JavaScript · Datos",
    desc: "El banco de preguntas del cuestionario. Es un objeto que guarda todas las preguntas organizadas por tema, con sus opciones y la respuesta correcta.",
    hace: [
      "Almacena las preguntas separadas por tema.",
      "Define las opciones y la respuesta correcta de cada una.",
      "Alimenta al cuestionario sin mezclar lógica con contenido.",
    ],
  },
  quiz: {
    icono: "bxl-javascript",
    nombre: "quiz.js",
    tipo: "JavaScript · Cuestionario",
    desc: "La lógica del cuestionario. Registra al participante, arma las preguntas del tema elegido, lleva el puntaje y el tiempo, y muestra el resultado final.",
    hace: [
      "Registra al estudiante antes de empezar.",
      "Controla avance, puntaje y temporizador.",
      "Calcula el resultado y permite reforzar el tema.",
    ],
    funciones: ["iniciarCuestionarioPorTema()", "siguientePregunta()"],
  },
  dashboard: {
    icono: "bxl-javascript",
    nombre: "dashboard.js",
    tipo: "JavaScript · Panel",
    desc: "El panel de resultados. Lee los intentos guardados en la base de datos, calcula estadísticas como el promedio o los aprobados, y los muestra en una tabla.",
    hace: [
      "Carga los resultados guardados en Supabase.",
      "Calcula estadísticas (intentos, promedio, aprobados).",
      "Permite ver el detalle y eliminar registros.",
    ],
    funciones: ["cargarResultadosDashboard()", "verDetalleResultado()"],
  },
  sistema: {
    icono: "bxl-javascript",
    nombre: "sistema.js",
    tipo: "JavaScript · Simulador",
    desc: "La lógica del simulador del Formulario 104. Registra ventas y compras, calcula el IVA a pagar y arma el resumen de la declaración de forma educativa.",
    hace: [
      "Guarda los datos del contribuyente y sus operaciones.",
      "Calcula IVA de ventas, de compras y el valor a pagar.",
      "Tiene su propio control de tema claro/oscuro.",
    ],
  },
  supabase: {
    icono: "bxl-javascript",
    nombre: "supabase-config.js",
    tipo: "JavaScript · Conexión",
    desc: "La conexión con la base de datos. Configura el cliente de Supabase que permite guardar y leer los resultados del cuestionario en la nube.",
    hace: [
      "Define la URL y la llave pública del proyecto.",
      "Crea el cliente que usan el quiz y el dashboard.",
      "Centraliza la conexión en un solo lugar.",
    ],
  },
  widget: {
    icono: "bxl-javascript",
    nombre: "widget.js",
    tipo: "JavaScript · Extra",
    desc: "El botón flotante de WhatsApp que aparece en la esquina. Inserta el chat de contacto para que los usuarios escriban a un asesor.",
    hace: [
      "Carga el widget de chat de WhatsApp.",
      "Configura colores, mensaje de bienvenida y número.",
      "Se muestra de forma flotante en todas las páginas.",
    ],
  },
  images: {
    icono: "bx-image",
    nombre: "assets/images/",
    tipo: "Carpeta · Recursos",
    desc: "Guarda todas las imágenes del proyecto: logos, ilustraciones y gráficos que usan el inicio, las marcas y los testimonios.",
    hace: [
      "Almacena logotipos e ilustraciones del sitio.",
      "Mantiene los recursos visuales organizados.",
      "Se referencia desde el HTML y el CSS.",
    ],
  },
  video: {
    icono: "bx-movie-play",
    nombre: "assets/video/",
    tipo: "Carpeta · Recursos",
    desc: "Contiene los videos demostrativos que se reproducen en el inicio para mostrar cómo funciona el sistema.",
    hace: [
      "Almacena los clips de demostración.",
      "Se reproduce en la sección de oferta del sistema.",
      "Mantiene los videos separados de las imágenes.",
    ],
  },
};

function mostrarArchivoDev(clave) {
  let data = archivosDev[clave];

  if (!data) {
    return;
  }

  // Marcar el archivo activo en el árbol
  let botones = document.querySelectorAll(".dev-file");

  for (let i = 0; i < botones.length; i++) {
    botones[i].classList.remove("active");
  }

  let actual = document.querySelector('.dev-file[data-file="' + clave + '"]');

  if (actual !== null) {
    actual.classList.add("active");
  }

  // Construir la tarjeta de explicación
  let lista = "";

  for (let i = 0; i < data.hace.length; i++) {
    lista +=
      "<li><i class='bx bx-check-circle'></i><span>" + data.hace[i] + "</span></li>";
  }

  let html =
    '<div class="dev-info__head">' +
    '<div class="dev-info__icon"><i class="bx ' + data.icono + '"></i></div>' +
    "<div>" +
    "<h3>" + data.nombre + "</h3>" +
    '<span class="dev-tag">' + data.tipo + "</span>" +
    "</div>" +
    "</div>" +
    '<p class="dev-info__desc">' + data.desc + "</p>" +
    "<h4>¿Qué hace?</h4>" +
    "<ul>" + lista + "</ul>";

  if (data.funciones) {
    let chips = "";

    for (let i = 0; i < data.funciones.length; i++) {
      chips += "<span>" + data.funciones[i] + "</span>";
    }

    html += "<h4>Funciones clave</h4>";
    html += '<div class="dev-chips">' + chips + "</div>";
  }

  let contenedor = document.getElementById("devInfo");

  if (contenedor !== null) {
    contenedor.innerHTML = html;
  }
}

// Mostrar index.html seleccionado al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  mostrarArchivoDev("index");
});

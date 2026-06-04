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
  controlarTabs(idVista);

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
  let backdrop = document.getElementById("docsSidebarBackdrop");

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

function controlarTabs(idVista) {
  let tabs = obtenerElemento("topicTabs");

  if (tabs === null) {
    return;
  }

  if (idVista === "aprender") {
    tabs.classList.add("visible");
  } else {
    tabs.classList.remove("visible");
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

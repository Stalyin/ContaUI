let participante = {
  nombre: "",
  correo: "",
};

let temaSeleccionado = "todos";
let preguntasActuales = [];
let preguntaActual = 0;
let respuestasUsuario = [];
let tiempoInicioQuiz = null;
let intervaloTiempoQuiz = null;
let accionConfirmadaQuiz = null;
let ultimoResultadoQuiz = {
  correctas: 0,
  total: 0,
  tiempo: "00:00",
};

function guardarParticipanteLocal() {
  localStorage.setItem("participanteQuizContaUI", JSON.stringify(participante));
}

function prepararQuizAlEntrar() {
  let guardado = localStorage.getItem("participanteQuizContaUI");

  if (guardado === null) {
    mostrarPantallaQuiz("quizRegistro");
    return;
  }

  participante = JSON.parse(guardado);

  if (participante.nombre === "") {
    mostrarPantallaQuiz("quizRegistro");
    return;
  }

  if (obtenerElemento("nombreParticipante") !== null) {
    obtenerElemento("nombreParticipante").value = participante.nombre || "";
  }

  if (obtenerElemento("correoParticipante") !== null) {
    obtenerElemento("correoParticipante").value = participante.correo || "";
  }

  if (obtenerElemento("bienvenidaQuiz") !== null) {
    obtenerElemento("bienvenidaQuiz").innerText =
      "Bienvenido, " + participante.nombre;
  }

  cargarUltimasNotasTemas();
  mostrarPantallaQuiz("quizTemas");
}

function cargarParticipanteLocal() {
  let guardado = localStorage.getItem("participanteQuizContaUI");

  if (guardado === null) {
    return;
  }

  participante = JSON.parse(guardado);

  if (obtenerElemento("nombreParticipante") !== null) {
    obtenerElemento("nombreParticipante").value = participante.nombre || "";
  }

  if (obtenerElemento("correoParticipante") !== null) {
    obtenerElemento("correoParticipante").value = participante.correo || "";
  }

  if (
    obtenerElemento("bienvenidaQuiz") !== null &&
    participante.nombre !== ""
  ) {
    obtenerElemento("bienvenidaQuiz").innerText =
      "Bienvenido, " + participante.nombre;
  }
}

function mostrarPantallaQuiz(idPantalla) {
  let pantallas = document.querySelectorAll(".quiz-screen");

  for (let i = 0; i < pantallas.length; i++) {
    pantallas[i].classList.remove("quiz-screen--active");
  }

  let pantalla = obtenerElemento(idPantalla);

  if (pantalla !== null) {
    pantalla.classList.add("quiz-screen--active");
  }
}

function abrirModalQuiz(titulo, texto, accionConfirmacion) {
  let modal = obtenerElemento("quizConfirmModal");

  if (modal === null) {
    let continuar = confirm(texto);

    if (continuar && accionConfirmacion !== null) {
      accionConfirmacion();
    }

    return;
  }

  accionConfirmadaQuiz = accionConfirmacion;

  textoSeguro("quizModalTitle", titulo);
  textoSeguro("quizModalText", texto);
  modal.classList.add("show");
}

function cerrarModalQuiz() {
  let modal = obtenerElemento("quizConfirmModal");

  if (modal !== null) {
    modal.classList.remove("show");
  }

  accionConfirmadaQuiz = null;
}

function confirmarModalQuiz() {
  if (accionConfirmadaQuiz !== null) {
    accionConfirmadaQuiz();
  }

  cerrarModalQuiz();
}

function prepararModalQuiz() {
  let boton = obtenerElemento("quizModalConfirmBtn");

  if (boton !== null) {
    boton.onclick = confirmarModalQuiz;
  }
}

function registrarParticipante() {
  let nombre = obtenerElemento("nombreParticipante").value.trim();
  let correo = obtenerElemento("correoParticipante").value.trim();

  participante.nombre = nombre;
  participante.correo = correo;

  guardarParticipanteLocal();

  obtenerElemento("bienvenidaQuiz").innerText =
    "Bienvenido, " + participante.nombre;

  cargarUltimasNotasTemas();
  mostrarPantallaQuiz("quizTemas");
}

function mezclarArray(lista) {
  let copia = lista.slice();

  for (let i = copia.length - 1; i > 0; i--) {
    let posicionAleatoria = Math.floor(Math.random() * (i + 1));
    let temporal = copia[i];
    copia[i] = copia[posicionAleatoria];
    copia[posicionAleatoria] = temporal;
  }

  return copia;
}

function prepararPregunta(preguntaOriginal) {
  let opcionesMezcladas = mezclarArray(preguntaOriginal.opciones);

  return {
    texto: preguntaOriginal.texto,
    opciones: opcionesMezcladas,
    correcta: preguntaOriginal.correcta,
  };
}

function obtenerPreguntasPorTema(tema) {
  let preguntas = [];

  if (tema === "todos") {
    let temas = ["iva", "tarifa0", "subtotal", "formulario104"];

    for (let i = 0; i < temas.length; i++) {
      let preguntasTema = mezclarArray(bancoPreguntas[temas[i]]).slice(0, 2);

      for (let j = 0; j < preguntasTema.length; j++) {
        preguntas.push(preguntasTema[j]);
      }
    }

    preguntas = mezclarArray(preguntas);
  } else {
    preguntas = mezclarArray(bancoPreguntas[tema]).slice(0, 5);
  }

  let preparadas = [];

  for (let i = 0; i < preguntas.length; i++) {
    preparadas.push(prepararPregunta(preguntas[i]));
  }

  return preparadas;
}

function obtenerNombreTema(tema) {
  if (tema === "iva") {
    return "IVA";
  }

  if (tema === "tarifa0") {
    return "Productos tarifa 0%";
  }

  if (tema === "subtotal") {
    return "Subtotal y total factura";
  }

  if (tema === "formulario104") {
    return "Formulario 104";
  }

  return "Todos los temas";
}

function iniciarCuestionarioPorTema(tema) {
  temaSeleccionado = tema;
  preguntasActuales = obtenerPreguntasPorTema(tema);
  respuestasUsuario = new Array(preguntasActuales.length).fill(null);
  preguntaActual = 0;

  obtenerElemento("quizTemaActual").innerText =
    obtenerNombreTema(temaSeleccionado);
  obtenerElemento("quizTitulo").innerText =
    "Quiz: " + obtenerNombreTema(temaSeleccionado);

  iniciarTemporizadorQuiz();
  mostrarPantallaQuiz("quizPreguntas");
  pintarPregunta();
}

function pintarPregunta() {
  let pregunta = preguntasActuales[preguntaActual];

  obtenerElemento("questionNumber").innerText =
    "Pregunta " + (preguntaActual + 1);
  obtenerElemento("questionText").innerText = pregunta.texto;
  obtenerElemento("quizProgressText").innerText =
    preguntaActual + 1 + " / " + preguntasActuales.length;

  let porcentaje = ((preguntaActual + 1) / preguntasActuales.length) * 100;
  obtenerElemento("quizProgressBar").style.width = porcentaje + "%";

  let botonSiguiente = obtenerElemento("btnSiguienteQuiz");

  if (preguntaActual === preguntasActuales.length - 1) {
    botonSiguiente.innerText = "Finalizar";
  } else {
    botonSiguiente.innerText = "Siguiente";
  }

  let contenedor = obtenerElemento("answersContainer");
  contenedor.innerHTML = "";

  for (let i = 0; i < pregunta.opciones.length; i++) {
    let boton = document.createElement("button");
    boton.className = "answer-btn";
    boton.innerText = pregunta.opciones[i];

    if (respuestasUsuario[preguntaActual] !== null) {
      boton.disabled = true;
      boton.classList.add("locked");

      if (pregunta.opciones[i] === pregunta.correcta) {
        boton.classList.add("correct-answer");
      }

      if (
        respuestasUsuario[preguntaActual] === pregunta.opciones[i] &&
        respuestasUsuario[preguntaActual] !== pregunta.correcta
      ) {
        boton.classList.add("wrong-answer");
      }

      if (
        respuestasUsuario[preguntaActual] === pregunta.opciones[i] &&
        respuestasUsuario[preguntaActual] === pregunta.correcta
      ) {
        boton.classList.add("selected");
      }
    }

    boton.onclick = function () {
      seleccionarRespuesta(pregunta.opciones[i]);
    };

    contenedor.appendChild(boton);
  }

  pintarFeedbackPregunta();
  actualizarPuntaje();
  pintarListaPreguntas();
}

function seleccionarRespuesta(indiceRespuesta) {
  // Si ya respondió esta pregunta, no puede cambiar la selección.
  if (respuestasUsuario[preguntaActual] !== null) {
    return;
  }

  respuestasUsuario[preguntaActual] = indiceRespuesta;
  pintarPregunta();
}

function pintarFeedbackPregunta() {
  let feedbackAnterior = document.querySelector(".question-feedback");

  if (feedbackAnterior !== null) {
    feedbackAnterior.remove();
  }

  if (respuestasUsuario[preguntaActual] === null) {
    return;
  }

  let pregunta = preguntasActuales[preguntaActual];
  let esCorrecta = respuestasUsuario[preguntaActual] === pregunta.correcta;

  let feedback = document.createElement("div");
  feedback.className = "question-feedback";

  if (esCorrecta) {
    feedback.classList.add("feedback-ok");
    feedback.innerHTML =
      "<i class='bx bx-check-circle'></i><span>Correcto. Muy bien, continúa con la siguiente pregunta.</span>";
  } else {
    feedback.classList.add("feedback-bad");
    feedback.innerHTML =
      "<i class='bx bx-x-circle'></i><span>Respuesta incorrecta. La opción correcta era: <strong>" +
      pregunta.correcta +
      "</strong></span>";
  }

  let card = document.querySelector(".question-card");

  if (card !== null) {
    card.appendChild(feedback);
  }
}

function siguientePregunta() {
  if (respuestasUsuario[preguntaActual] === null) {
    alert("Selecciona una respuesta antes de continuar.");
    return;
  }

  if (preguntaActual < preguntasActuales.length - 1) {
    preguntaActual++;
    pintarPregunta();
  } else {
    finalizarCuestionario();
  }
}

function anteriorPregunta() {
  if (preguntaActual > 0) {
    preguntaActual--;
    pintarPregunta();
  }
}

function volverASeleccionTemas() {
  abrirModalQuiz(
    "¿Volver a temas?",
    "Si vuelves ahora, perderás el intento actual y deberás iniciar nuevamente el cuestionario.",
    function () {
      detenerTemporizadorQuiz();
      preguntasActuales = [];
      respuestasUsuario = [];
      preguntaActual = 0;
      cargarUltimasNotasTemas();
      mostrarPantallaQuiz("quizTemas");
    },
  );
}

function volverATemasDesdeResultado() {
  detenerTemporizadorQuiz();
  preguntasActuales = [];
  respuestasUsuario = [];
  preguntaActual = 0;
  cargarUltimasNotasTemas();
  mostrarPantallaQuiz("quizTemas");
}

function calcularCorrectas() {
  let correctas = 0;

  for (let i = 0; i < preguntasActuales.length; i++) {
    if (respuestasUsuario[i] === preguntasActuales[i].correcta) {
      correctas++;
    }
  }

  return correctas;
}

function actualizarPuntaje() {
  if (preguntasActuales.length === 0) {
    obtenerElemento("scorePercent").innerText = "0%";
    return;
  }

  let correctas = calcularCorrectas();
  let porcentaje = Math.round((correctas / preguntasActuales.length) * 100);

  obtenerElemento("scorePercent").innerText = porcentaje + "%";
}

function pintarListaPreguntas() {
  let lista = obtenerElemento("questionList");
  lista.innerHTML = "";

  for (let i = 0; i < preguntasActuales.length; i++) {
    let item = document.createElement("div");
    item.className = "question-pill";

    if (i === preguntaActual) {
      item.classList.add("current");
    }

    let icono = "bx-circle";

    if (respuestasUsuario[i] !== null) {
      if (respuestasUsuario[i] === preguntasActuales[i].correcta) {
        item.classList.add("correct");
        icono = "bxs-check-circle";
      } else {
        item.classList.add("wrong");
        icono = "bxs-x-circle";
      }
    }

    item.innerHTML = "<i class='bx " + icono + "'></i> Pregunta " + (i + 1);

    item.onclick = function () {
      preguntaActual = i;
      pintarPregunta();
    };

    lista.appendChild(item);
  }
}

function iniciarTemporizadorQuiz() {
  detenerTemporizadorQuiz();

  tiempoInicioQuiz = Date.now();
  actualizarTemporizadorQuiz();

  intervaloTiempoQuiz = setInterval(function () {
    actualizarTemporizadorQuiz();
  }, 1000);
}

function detenerTemporizadorQuiz() {
  if (intervaloTiempoQuiz !== null) {
    clearInterval(intervaloTiempoQuiz);
    intervaloTiempoQuiz = null;
  }
}

function obtenerTiempoTranscurridoTexto() {
  if (tiempoInicioQuiz === null) {
    return ultimoResultadoQuiz.tiempo || "00:00";
  }

  let segundosTotales = Math.floor((Date.now() - tiempoInicioQuiz) / 1000);
  let minutos = Math.floor(segundosTotales / 60);
  let segundos = segundosTotales % 60;

  let minutosTexto = minutos < 10 ? "0" + minutos : minutos;
  let segundosTexto = segundos < 10 ? "0" + segundos : segundos;

  return minutosTexto + ":" + segundosTexto;
}

function actualizarTemporizadorQuiz() {
  let timer = obtenerElemento("quizTimer");

  if (timer !== null) {
    timer.innerHTML =
      "<i class='bx bx-time-five'></i> " + obtenerTiempoTranscurridoTexto();
  }
}

function obtenerClaveNotaTema(tema) {
  return "ultimaNotaQuiz_" + tema;
}

function guardarUltimaNotaTema(tema, correctas, total) {
  let datos = {
    correctas: correctas,
    total: total,
    fecha: new Date().toLocaleString(),
  };

  localStorage.setItem(obtenerClaveNotaTema(tema), JSON.stringify(datos));
}

function obtenerUltimaNotaTema(tema) {
  let datos = localStorage.getItem(obtenerClaveNotaTema(tema));

  if (datos === null) {
    return null;
  }

  return JSON.parse(datos);
}

function cargarUltimasNotasTemas() {
  let mapa = [
    { tema: "todos", id: "scoreTemaTodos" },
    { tema: "iva", id: "scoreTemaIva" },
    { tema: "tarifa0", id: "scoreTemaTarifa0" },
    { tema: "subtotal", id: "scoreTemaSubtotal" },
    { tema: "formulario104", id: "scoreTemaFormulario104" },
  ];

  for (let i = 0; i < mapa.length; i++) {
    let elemento = obtenerElemento(mapa[i].id);

    if (elemento !== null) {
      let nota = obtenerUltimaNotaTema(mapa[i].tema);

      if (nota === null) {
        elemento.innerText = "";
        elemento.classList.remove("has-score");
      } else {
        elemento.innerText = nota.correctas + "/" + nota.total;
        elemento.classList.add("has-score");
      }
    }
  }
}

function finalizarCuestionario() {
  let correctas = calcularCorrectas();
  let total = preguntasActuales.length;
  let tiempoTexto = obtenerTiempoTranscurridoTexto();

  detenerTemporizadorQuiz();

  ultimoResultadoQuiz.correctas = correctas;
  ultimoResultadoQuiz.total = total;
  ultimoResultadoQuiz.tiempo = tiempoTexto;

  guardarUltimaNotaTema(temaSeleccionado, correctas, total);
  guardarResultadoLocalStorage(correctas, total, tiempoTexto);

  let resultadoCard = document.querySelector(".quiz-result-card");
  let botonReforzar = obtenerElemento("btnReforzarTema");

  if (resultadoCard !== null) {
    resultadoCard.classList.remove("success");
    resultadoCard.classList.remove("warning");
    resultadoCard.classList.remove("danger");
  }

  botonReforzar.style.display = "none";

  if (correctas >= Math.ceil(total * 0.8)) {
    resultadoCard.classList.add("success");
    obtenerElemento("resultadoTitulo").innerText =
      "Excelente, " + participante.nombre;
    obtenerElemento("resultadoDetalle").innerText =
      "Respondiste " + correctas + "/" + total + ". Pasaste el cuestionario.";
  } else if (correctas >= Math.ceil(total * 0.5)) {
    resultadoCard.classList.add("warning");
    obtenerElemento("resultadoTitulo").innerText =
      "Genial, " + participante.nombre;
    obtenerElemento("resultadoDetalle").innerText =
      "Respondiste " +
      correctas +
      "/" +
      total +
      ". Puedes repetir para mejorar tu resultado.";
  } else {
    resultadoCard.classList.add("danger");
    obtenerElemento("resultadoTitulo").innerText =
      "Losiento, " + participante.nombre;
    obtenerElemento("resultadoDetalle").innerText =
      "Respondiste " +
      correctas +
      "/" +
      total +
      ". Te recomendamos revisar nuevamente el tema antes de repetir.";
    botonReforzar.style.display = "inline-flex";
  }

  cargarUltimasNotasTemas();
  mostrarPantallaQuiz("quizResultado");
}

function volverATemasQuiz() {
  mostrarPantallaQuiz("quizTemas");
}

function repetirCuestionario() {
  iniciarCuestionarioPorTema(temaSeleccionado);
}

function reforzarTemaQuiz() {
  let tema = temaSeleccionado;

  if (tema === "todos") {
    tema = "overview";
  }

  let url = "index.html?tema=" + tema;
  window.open(url, "_blank");
}

function revisarParametroTema() {
  let parametros = new URLSearchParams(window.location.search);
  let tema = parametros.get("tema");

  if (tema !== null) {
    mostrarVista("aprender", tema);
  }
}

function guardarResultadoLocalStorage(correctas, total, tiempoTexto) {
  let resultados = localStorage.getItem("resultadosQuizContaUI");

  if (resultados === null) {
    resultados = [];
  } else {
    resultados = JSON.parse(resultados);
  }

  resultados.push({
    nombre: participante.nombre,
    correo: participante.correo,
    tema: obtenerNombreTema(temaSeleccionado),
    correctas: correctas,
    total: total,
    tiempo: tiempoTexto,
    fecha: new Date().toLocaleString(),
  });

  localStorage.setItem("resultadosQuizContaUI", JSON.stringify(resultados));
}

function enviarResultadoWhatsapp() {
  let correctas = ultimoResultadoQuiz.correctas || calcularCorrectas();
  let total = ultimoResultadoQuiz.total || preguntasActuales.length;
  let tiempoTexto =
    ultimoResultadoQuiz.tiempo || obtenerTiempoTranscurridoTexto();

  let numero = 593963313195;
  let mensaje =
    "Hola, soy " +
    participante.nombre +
    ". Mi resultado en el quiz de " +
    obtenerNombreTema(temaSeleccionado) +
    " fue " +
    correctas +
    "/" +
    total +
    ". Tiempo: " +
    tiempoTexto +
    ".";

  let url =
    "https://wa.me/" + `${numero}` + "?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank");
}

function cerrarSesionQuiz() {
  abrirModalQuiz(
    "Cerrar sesión",
    "Se borrará el registro local de este navegador y volverás a la pantalla de registro. Tus últimas notas también se limpiarán para este navegador.",
    function () {
      localStorage.removeItem("participanteQuizContaUI");
      localStorage.removeItem("ultimaNotaQuiz_todos");
      localStorage.removeItem("ultimaNotaQuiz_iva");
      localStorage.removeItem("ultimaNotaQuiz_tarifa0");
      localStorage.removeItem("ultimaNotaQuiz_subtotal");
      localStorage.removeItem("ultimaNotaQuiz_formulario104");

      participante = {
        nombre: "",
        correo: "",
      };

      preguntasActuales = [];
      respuestasUsuario = [];
      preguntaActual = 0;
      detenerTemporizadorQuiz();

      if (obtenerElemento("nombreParticipante") !== null) {
        obtenerElemento("nombreParticipante").value = "";
      }

      if (obtenerElemento("correoParticipante") !== null) {
        obtenerElemento("correoParticipante").value = "";
      }

      cargarUltimasNotasTemas();
      mostrarPantallaQuiz("quizRegistro");
    },
  );
}

prepararModalQuiz();
cargarParticipanteLocal();
cargarUltimasNotasTemas();
revisarParametroTema();

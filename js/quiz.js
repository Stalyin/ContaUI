let participante = {
  nombre: "",
  correo: "",
};

let temaSeleccionado = "todos";
let preguntasActuales = [];
let preguntaActual = 0;
let respuestasUsuario = [];

function obtenerElemento(id) {
  return document.getElementById(id);
}

function mostrarPantallaQuiz(idPantalla) {
  let pantallas = document.querySelectorAll(".quiz-screen");

  for (let i = 0; i < pantallas.length; i++) {
    pantallas[i].classList.remove("quiz-screen--active");
  }

  obtenerElemento(idPantalla).classList.add("quiz-screen--active");
}

function registrarParticipante() {
  let nombre = obtenerElemento("nombreParticipante").value.trim();
  let correo = obtenerElemento("correoParticipante").value.trim();

  if (nombre === "") {
    alert("Ingresa tu nombre para continuar.");
    return;
  }

  participante.nombre = nombre;
  participante.correo = correo;

  obtenerElemento("bienvenidaQuiz").innerText =
    "Bienvenido, " + participante.nombre;
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
      let preguntasTema = mezclarArray(bancoPreguntas[temas[i]]).slice(0, 3);

      for (let j = 0; j < preguntasTema.length; j++) {
        preguntas.push(preguntasTema[j]);
      }
    }

    preguntas = mezclarArray(preguntas);
  } else {
    preguntas = mezclarArray(bancoPreguntas[tema]).slice(0, 10);
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

    if (respuestasUsuario[preguntaActual] === pregunta.opciones[i]) {
      boton.classList.add("selected");
    }

    boton.onclick = function () {
      seleccionarRespuesta(pregunta.opciones[i]);
    };

    contenedor.appendChild(boton);
  }

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

function finalizarCuestionario() {
  let correctas = calcularCorrectas();
  let total = preguntasActuales.length;
  let resultadoCard = document.querySelector(".quiz-result-card");
  let botonReforzar = obtenerElemento("btnReforzarTema");

  resultadoCard.classList.remove("success");
  resultadoCard.classList.remove("warning");
  resultadoCard.classList.remove("danger");

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
      "Vas bien, " + participante.nombre;
    obtenerElemento("resultadoDetalle").innerText =
      "Respondiste " +
      correctas +
      "/" +
      total +
      ". Puedes repetir para mejorar tu resultado.";
  } else {
    resultadoCard.classList.add("danger");
    obtenerElemento("resultadoTitulo").innerText =
      "Necesitas reforzar, " + participante.nombre;
    obtenerElemento("resultadoDetalle").innerText =
      "Respondiste " +
      correctas +
      "/" +
      total +
      ". Te recomendamos revisar nuevamente el tema antes de repetir.";
    botonReforzar.style.display = "inline-flex";
  }

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

revisarParametroTema();

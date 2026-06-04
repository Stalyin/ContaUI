let resultadosDashboard = [];
let resultadoAEliminar = null;

async function cargarResultadosDashboard() {
  let tabla = document.getElementById("tablaResultadosDashboard");

  tabla.innerHTML = `
    <tr>
      <td colspan="8">Cargando resultados...</td>
    </tr>
  `;

  let respuesta = await supabaseClient
    .from("quiz_resultados")
    .select("*")
    .order("created_at", { ascending: false });

  if (respuesta.error) {
    console.log("Error al cargar resultados:", respuesta.error.message);

    tabla.innerHTML = `
      <tr>
        <td colspan="8">No se pudieron cargar los resultados.</td>
      </tr>
    `;

    return;
  }

  resultadosDashboard = respuesta.data || [];

  pintarEstadisticas();
  pintarTablaResultados();
}

function pintarEstadisticas() {
  let totalIntentos = resultadosDashboard.length;
  let sumaPorcentajes = 0;
  let aprobados = 0;
  let reforzar = 0;

  for (let i = 0; i < resultadosDashboard.length; i++) {
    let resultado = resultadosDashboard[i];

    sumaPorcentajes += resultado.porcentaje || 0;

    if ((resultado.porcentaje || 0) >= 70) {
      aprobados++;
    } else {
      reforzar++;
    }
  }

  let promedio = 0;

  if (totalIntentos > 0) {
    promedio = Math.round(sumaPorcentajes / totalIntentos);
  }

  document.getElementById("statIntentos").innerText = totalIntentos;
  document.getElementById("statPromedio").innerText = promedio + "%";
  document.getElementById("statAprobados").innerText = aprobados;
  document.getElementById("statReforzar").innerText = reforzar;
}

function pintarTablaResultados() {
  let tabla = document.getElementById("tablaResultadosDashboard");
  tabla.innerHTML = "";

  if (resultadosDashboard.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="8">Todavía no existen resultados registrados.</td>
      </tr>
    `;

    return;
  }

  for (let i = 0; i < resultadosDashboard.length; i++) {
    let resultado = resultadosDashboard[i];

    let fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${resultado.nombre || "-"}</td>
      <td>${resultado.correo || "-"}</td>
      <td>${resultado.tema || "-"}</td>
      <td>${resultado.correctas}/${resultado.total}</td>
      <td>
        <span class="dashboard-badge ${obtenerClasePorcentaje(resultado.porcentaje)}">
          ${resultado.porcentaje || 0}%
        </span>
      </td>
      <td>${resultado.tiempo || "-"}</td>
      <td>${formatearFechaResultado(resultado)}</td>
      <td>
        <div class="dashboard-actions">
          <button onclick="verDetalleResultado('${resultado.id}')" class="dashboard-btn">
            Ver detalle
          </button>

          <button onclick="eliminarResultado('${resultado.id}')" class="dashboard-btn danger">
            Eliminar
          </button>
        </div>
      </td>
    `;

    tabla.appendChild(fila);
  }
}

function obtenerClasePorcentaje(porcentaje) {
  if (porcentaje >= 80) {
    return "ok";
  }

  if (porcentaje >= 50) {
    return "warning";
  }

  return "bad";
}

function formatearFechaResultado(resultado) {
  if (resultado.fecha_local) {
    return resultado.fecha_local;
  }

  if (resultado.created_at) {
    return new Date(resultado.created_at).toLocaleString();
  }

  return "-";
}

function verDetalleResultado(id) {
  let resultado = buscarResultadoPorId(id);

  if (resultado === null) {
    return;
  }

  document.getElementById("detalleTitulo").innerText =
    resultado.nombre + " - " + resultado.tema;

  document.getElementById("detalleResumen").innerText =
    "Nota: " +
    resultado.correctas +
    "/" +
    resultado.total +
    " | Porcentaje: " +
    resultado.porcentaje +
    "% | Tiempo: " +
    resultado.tiempo;

  pintarDetallePreguntas(resultado.respuestas || []);

  document.getElementById("modalDetalleResultado").classList.add("show");
}

function pintarDetallePreguntas(respuestas) {
  let contenedor = document.getElementById("detallePreguntas");
  contenedor.innerHTML = "";

  if (respuestas.length === 0) {
    contenedor.innerHTML = "<p>No existe detalle de respuestas.</p>";
    return;
  }

  for (let i = 0; i < respuestas.length; i++) {
    let item = respuestas[i];

    let esCorrecta = item.estado === "correcta";

    let card = document.createElement("article");
    card.className = "detalle-card";

    if (esCorrecta) {
      card.classList.add("correcta");
    } else {
      card.classList.add("incorrecta");
    }

    card.innerHTML = `
      <div class="detalle-card__header">
        <strong>Pregunta ${item.numero || i + 1}</strong>
        <span>${esCorrecta ? "Correcta" : "Incorrecta"}</span>
      </div>

      <p>${item.pregunta}</p>

      <div class="detalle-respuesta">
        <span>Respuesta del estudiante:</span>
        <strong>${item.respuesta_usuario || "Sin respuesta"}</strong>
      </div>

      <div class="detalle-respuesta">
        <span>Respuesta correcta:</span>
        <strong>${item.respuesta_correcta}</strong>
      </div>
    `;

    contenedor.appendChild(card);
  }
}

function cerrarModalDetalle() {
  document.getElementById("modalDetalleResultado").classList.remove("show");
}

function buscarResultadoPorId(id) {
  for (let i = 0; i < resultadosDashboard.length; i++) {
    if (resultadosDashboard[i].id === id) {
      return resultadosDashboard[i];
    }
  }

  return null;
}

function eliminarResultado(id) {
  resultadoAEliminar = buscarResultadoPorId(id);

  if (resultadoAEliminar === null) {
    return;
  }

  document.getElementById("textoEliminarResultado").innerText =
    "¿Seguro que deseas eliminar el resultado de " +
    resultadoAEliminar.nombre +
    " en el tema " +
    resultadoAEliminar.tema +
    "? Esta acción no se puede deshacer.";

  document.getElementById("modalEliminarResultado").classList.add("show");
}

function cerrarModalEliminarResultado() {
  document.getElementById("modalEliminarResultado").classList.remove("show");
  resultadoAEliminar = null;
}

async function confirmarEliminarResultado() {
  if (resultadoAEliminar === null) {
    return;
  }

  let respuesta = await supabaseClient
    .from("quiz_resultados")
    .delete()
    .eq("id", resultadoAEliminar.id);

  if (respuesta.error) {
    console.log("Error al eliminar:", respuesta.error.message);
    alert("No se pudo eliminar el resultado.");
    return;
  }

  cerrarModalEliminarResultado();
  cargarResultadosDashboard();
}

cargarResultadosDashboard();

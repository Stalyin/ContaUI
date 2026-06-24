function textoComprobante(valor, respaldo) {
  if (valor === null || valor === undefined || valor === "") {
    return respaldo || "-";
  }

  return String(valor);
}

function abrirComprobanteDeclaracion(indice) {
  let declaraciones = leerLocal("declaracionesContaUI", []);
  let declaracion = declaraciones[indice];

  if (!declaracion) {
    alert("No se encontró la declaración seleccionada.");
    return;
  }

  let total = Number(declaracion.ivaPagar || 0);
  let fechaDeclaracion = textoComprobante(
    declaracion.fecha,
    new Date().toLocaleString("es-EC"),
  );

  let fechaPago = textoComprobante(
    declaracion.fechaMaximaPago,
    new Date().toLocaleDateString("es-EC"),
  );

  let serie = textoComprobante(declaracion.numeroSerie, "872176019280");

  let html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Comprobante ${serie}</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #e5e5e5;
      }

      .print-actions {
        width: 760px;
        margin: 20px auto;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }

      .print-actions button {
        padding: 10px 16px;
        border: 0;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 700;
      }

      .btn-primary {
        background: #164fa3;
        color: white;
      }

      .btn-secondary {
        background: white;
        color: #333;
      }

      .comprobante {
        width: 760px;
        margin: 0 auto 30px;
        background: white;
        border: 1px solid #bbb;
      }

      .header {
        height: 88px;
        background: #164fa3;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
      }

      .logo {
        font-size: 46px;
        font-weight: 900;
        font-style: italic;
      }

      .title {
        font-size: 26px;
        font-weight: 700;
        text-align: right;
      }

      .title small {
        display: block;
        font-size: 15px;
        font-weight: 400;
      }

      .body {
        padding: 34px 24px;
        color: #111;
        font-size: 15px;
      }

      .serie {
        text-align: right;
        margin-bottom: 28px;
      }

      .row {
        display: grid;
        grid-template-columns: 210px 1fr;
        gap: 8px;
        margin: 7px 0;
      }

      .two-cols {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }

      .two-cols .row {
        grid-template-columns: 130px 1fr;
      }

      .line {
        border-top: 1px solid #555;
        margin: 12px 0;
      }

      .section-title {
        margin: 10px 0;
        font-size: 18px;
        font-weight: 800;
      }

      .payment {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-top: 18px;
      }

      .payment-row {
        display: flex;
        gap: 80px;
      }

      .total-box {
        border: 1px solid #777;
        padding: 16px 22px;
        text-align: center;
      }

      .total-box span {
        display: block;
        font-weight: 700;
      }

      .total-box strong {
        display: block;
        color: red;
        margin-top: 8px;
        font-size: 20px;
      }

      .remember {
        margin-top: 44px;
        padding-top: 18px;
        border-top: 1px solid #777;
        font-weight: 700;
      }

      @media print {
        body {
          background: white;
        }

        .print-actions {
          display: none;
        }

        .comprobante {
          margin: 0;
          width: 100%;
          border: none;
        }
      }
    </style>
  </head>

  <body>
    <div class="print-actions">
      <button class="btn-secondary" onclick="window.close()">Cerrar</button>
      <button class="btn-primary" onclick="window.print()">Imprimir / Guardar PDF</button>
    </div>

    <main class="comprobante">
      <div class="header">
        <div class="logo">SRI</div>
        <div class="title">
          Comprobante
          <small>Pago en línea</small>
        </div>
      </div>

      <section class="body">
        <div class="serie">Número de serie: <strong>${serie}</strong></div>

        <div class="row">
          <strong>Contribuyente:</strong>
          <span>${textoComprobante(declaracion.contribuyente)}</span>
        </div>

        <div class="line"></div>

        <div class="two-cols">
          <div class="row">
            <strong>Identificación:</strong>
            <span>${textoComprobante(declaracion.ruc)}</span>
          </div>

          <div class="row">
            <strong>Fecha y hora de declaración:</strong>
            <span>${fechaDeclaracion}</span>
          </div>
        </div>

        <div class="line"></div>

        <div class="section-title">Detalle de las obligaciones pagadas</div>

        <div class="row">
          <strong>Periodo fiscal:</strong>
          <span>${textoComprobante(declaracion.periodo)}</span>
        </div>

        <div class="row">
          <strong>Impuesto:</strong>
          <span>${textoComprobante(declaracion.obligacion)}</span>
        </div>

        <div class="row">
          <strong>Tipo de declaración:</strong>
          <span>ORIGINAL</span>
        </div>

        <div class="row">
          <strong>Fecha máxima de pago:</strong>
          <span>${fechaPago}</span>
        </div>

        <div class="line"></div>

        <div class="section-title">Detalle forma de pago</div>

        <div class="payment">
          <div class="payment-row">
            <strong>Otras formas de pago</strong>
            <span>USD ${total.toFixed(2)}</span>
          </div>

          <div class="total-box">
            <span>Total valores a pagar</span>
            <strong>USD ${total.toFixed(2)}</strong>
          </div>
        </div>

        <div class="remember">
          Recuerde que puede cancelar el valor de USD ${total.toFixed(2)} hasta el ${fechaPago}.
        </div>
      </section>
    </main>
  </body>
  </html>
  `;

  let ventana = window.open("", "_blank");

  if (!ventana) {
    alert("Permite ventanas emergentes para generar el comprobante.");
    return;
  }

  ventana.document.open();
  ventana.document.write(html);
  ventana.document.close();
}

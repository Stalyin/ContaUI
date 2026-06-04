const bancoPreguntas = {
  iva: [
    {
      texto: "¿Qué significa IVA?",
      opciones: [
        "Impuesto al Valor Agregado",
        "Ingreso de Ventas Anuales",
        "Impuesto Variable Aduanero",
        "Inventario de Valores Activos",
      ],
      correcta: "Impuesto al Valor Agregado",
    },
    {
      texto: "¿Sobre qué valor se calcula el IVA en una factura?",
      opciones: [
        "Sobre el subtotal gravado",
        "Sobre el total incluyendo propina",
        "Sobre el nombre del cliente",
        "Sobre el número de factura",
      ],
      correcta: "Sobre el subtotal gravado",
    },
    {
      texto:
        "Si un producto cuesta $100 sin IVA y la tarifa es 15%, ¿cuánto IVA se genera?",
      opciones: ["$15", "$100", "$115", "$85"],
      correcta: "$15",
    },
    {
      texto: "¿Quién paga el IVA en una compra común?",
      opciones: [
        "El consumidor final",
        "El banco",
        "El proveedor de internet",
        "El municipio",
      ],
      correcta: "El consumidor final",
    },
    {
      texto: "¿Qué debe mostrar una factura cuando un producto grava IVA?",
      opciones: [
        "Subtotal, IVA y total",
        "Solo el precio final",
        "Solo el nombre del producto",
        "Solo la fecha",
      ],
      correcta: "Subtotal, IVA y total",
    },
  ],

  tarifa0: [
    {
      texto: "¿Qué significa tarifa 0% de IVA?",
      opciones: [
        "Que el producto se factura pero no genera IVA",
        "Que el producto no puede venderse",
        "Que el producto no tiene precio",
        "Que no debe registrarse",
      ],
      correcta: "Que el producto se factura pero no genera IVA",
    },
    {
      texto: "Si un producto tarifa 0% cuesta $45, ¿cuánto IVA genera?",
      opciones: ["$0", "$4.50", "$6.75", "$45"],
      correcta: "$0",
    },
    {
      texto: "¿Los productos tarifa 0% deben constar en la factura?",
      opciones: [
        "Sí, deben registrarse",
        "No, se eliminan",
        "Solo si cuestan más de $100",
        "Solo si son importados",
      ],
      correcta: "Sí, deben registrarse",
    },
    {
      texto: "¿Cuál de estos puede ser un ejemplo común de producto tarifa 0%?",
      opciones: ["Pan", "Televisor", "Perfume", "Videojuego"],
      correcta: "Pan",
    },
    {
      texto: "¿Cómo se refleja el IVA de un producto tarifa 0%?",
      opciones: [
        "Como $0.00 de IVA",
        "Como 15% obligatorio",
        "Como descuento",
        "Como recargo",
      ],
      correcta: "Como $0.00 de IVA",
    },
  ],

  subtotal: [
    {
      texto: "¿Qué es el subtotal en una factura?",
      opciones: [
        "El valor antes de impuestos y descuentos",
        "El valor final pagado",
        "El valor del IVA únicamente",
        "El número de autorización",
      ],
      correcta: "El valor antes de impuestos y descuentos",
    },
    {
      texto: "Si compras productos de $25, $40 y $60, ¿cuál es el subtotal?",
      opciones: ["$125", "$100", "$60", "$25"],
      correcta: "$125",
    },
    {
      texto:
        "¿Qué se suma al subtotal para obtener el total cuando hay productos gravados?",
      opciones: ["El IVA", "El RUC", "La razón social", "La fecha de emisión"],
      correcta: "El IVA",
    },
    {
      texto: "Si el subtotal es $200 y el IVA es $30, ¿cuál es el total?",
      opciones: ["$230", "$200", "$30", "$170"],
      correcta: "$230",
    },
    {
      texto: "¿Cuál fórmula es correcta?",
      opciones: [
        "Total = Subtotal + IVA - Descuentos",
        "Subtotal = IVA + RUC",
        "IVA = Total + Cliente",
        "Total = Fecha + Factura",
      ],
      correcta: "Total = Subtotal + IVA - Descuentos",
    },
  ],

  formulario104: [
    {
      texto: "¿Para qué se usa el Formulario 104 en Ecuador?",
      opciones: [
        "Para declarar IVA",
        "Para pagar matrículas",
        "Para registrar empleados",
        "Para emitir licencias",
      ],
      correcta: "Para declarar IVA",
    },
    {
      texto: "¿Qué valores se relacionan con el Formulario 104?",
      opciones: [
        "Ventas, compras, IVA generado e IVA pagado",
        "Solo sueldos",
        "Solo inventario físico",
        "Solo cuentas bancarias",
      ],
      correcta: "Ventas, compras, IVA generado e IVA pagado",
    },
    {
      texto: "¿Qué ayuda a calcular el IVA a pagar?",
      opciones: [
        "IVA ventas menos IVA compras y crédito tributario",
        "Nombre comercial menos dirección",
        "Ventas menos número de factura",
        "RUC más correo electrónico",
      ],
      correcta: "IVA ventas menos IVA compras y crédito tributario",
    },
    {
      texto:
        "Si el IVA en ventas es $750 y el IVA en compras es $450, ¿cuál sería el IVA a pagar sin crédito anterior?",
      opciones: ["$300", "$750", "$450", "$1,200"],
      correcta: "$300",
    },
    {
      texto: "¿Qué entidad administra la declaración de IVA en Ecuador?",
      opciones: [
        "SRI",
        "Registro Civil",
        "Municipio",
        "Ministerio de Educación",
      ],
      correcta: "SRI",
    },
  ],
};

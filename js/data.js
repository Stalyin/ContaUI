const temasUnidad = [
  {
    id: "iva",
    titulo: "Productos gravados con IVA",
    descripcion: "Bienes o servicios que generan Impuesto al Valor Agregado."
  },
  {
    id: "tarifa0",
    titulo: "Productos tarifa 0%",
    descripcion: "Productos que se facturan, pero no generan IVA."
  },
  {
    id: "subtotal",
    titulo: "Subtotal y total",
    descripcion: "Valor base, IVA, descuentos y total final."
  },
  {
    id: "formulario104",
    titulo: "Formulario 104",
    descripcion: "Documento usado para declarar IVA ante el SRI."
  }
];
 
const bancoPreguntas = {
  iva: [
    {
      texto: "¿Qué significa IVA?",
      opciones: ["Impuesto al Valor Agregado", "Inventario de Ventas Anuales", "Ingreso Variable Acumulado", "Informe de Valores Activos"],
      correcta: "Impuesto al Valor Agregado"
    },
    {
      texto: "¿Sobre qué valor se calcula normalmente el IVA?",
      opciones: ["Subtotal", "Nombre del cliente", "Número de factura", "Cantidad de empleados"],
      correcta: "Subtotal"
    },
    {
      texto: "Si el subtotal es $100 y el IVA es 15%, ¿cuánto es el IVA?",
      opciones: ["$15", "$100", "$115", "$85"],
      correcta: "$15"
    },
    {
      texto: "¿Quién paga finalmente el IVA en una compra común?",
      opciones: ["El consumidor final", "El navegador web", "El proveedor de internet", "El diseñador del sistema"],
      correcta: "El consumidor final"
    },
    {
      texto: "¿Dónde debe detallarse el IVA de una venta?",
      opciones: ["En la factura", "En el logo", "En el color del botón", "En el nombre del archivo CSS"],
      correcta: "En la factura"
    },
    {
      texto: "¿Cuál fórmula representa el cálculo del IVA?",
      opciones: ["IVA = Subtotal × Tasa", "IVA = Nombre + Apellido", "IVA = Stock - Imagen", "IVA = Fecha × Cliente"],
      correcta: "IVA = Subtotal × Tasa"
    },
    {
      texto: "Si un producto gravado cuesta $200 y el IVA es 15%, el total es:",
      opciones: ["$230", "$200", "$30", "$170"],
      correcta: "$230"
    },
    {
      texto: "Los productos gravados con IVA generan:",
      opciones: ["Un impuesto adicional", "Un descuento automático", "Una contraseña", "Una imagen"],
      correcta: "Un impuesto adicional"
    },
    {
      texto: "En el mini sistema, el IVA debe calcularse con:",
      opciones: ["JavaScript", "Solo imágenes", "Comentarios HTML", "El título de la página"],
      correcta: "JavaScript"
    },
    {
      texto: "¿Qué entidad administra los impuestos en Ecuador?",
      opciones: ["SRI", "CSS", "HTML", "GitHub"],
      correcta: "SRI"
    }
  ],
 
  tarifa0: [
    {
      texto: "¿Qué significa que un producto sea tarifa 0%?",
      opciones: ["Que no genera IVA", "Que no se puede vender", "Que no tiene precio", "Que no aparece en factura"],
      correcta: "Que no genera IVA"
    },
    {
      texto: "¿Los productos tarifa 0% deben registrarse en factura?",
      opciones: ["Sí", "No", "Solo si son caros", "Solo si tienen imagen"],
      correcta: "Sí"
    },
    {
      texto: "¿Cuál de estos puede ser ejemplo de tarifa 0%?",
      opciones: ["Pan", "Computadora gamer", "Servicio técnico privado", "Mueble decorativo"],
      correcta: "Pan"
    },
    {
      texto: "Si un producto tarifa 0% cuesta $45, su IVA es:",
      opciones: ["$0", "$45", "$6.75", "$15"],
      correcta: "$0"
    },
    {
      texto: "Tarifa 0% significa que:",
      opciones: ["Se factura, pero el IVA es cero", "No existe el producto", "No se registra nada", "Siempre tiene descuento"],
      correcta: "Se factura, pero el IVA es cero"
    },
    {
      texto: "¿Cuál de estos productos suele considerarse esencial?",
      opciones: ["Leche", "Audífonos de lujo", "Silla gamer", "Decoración premium"],
      correcta: "Leche"
    },
    {
      texto: "En una declaración, los productos tarifa 0%:",
      opciones: ["También pueden informarse", "Se borran automáticamente", "Se cambian por IVA 15%", "Se ocultan"],
      correcta: "También pueden informarse"
    },
    {
      texto: "¿Qué valor de tasa se usa para tarifa 0%?",
      opciones: ["0", "15", "100", "50"],
      correcta: "0"
    },
    {
      texto: "¿Qué opción describe mejor tarifa 0%?",
      opciones: ["Producto sin IVA, pero registrado", "Producto ilegal", "Producto sin nombre", "Producto sin factura"],
      correcta: "Producto sin IVA, pero registrado"
    },
    {
      texto: "¿Qué campo sería útil guardar en productos?",
      opciones: ["tipo_iva", "color_del_navbar", "nombre_del_css", "animacion"],
      correcta: "tipo_iva"
    }
  ],
 
  subtotal: [
    {
      texto: "¿Qué es el subtotal?",
      opciones: ["Valor antes de impuestos", "Valor después de cerrar sesión", "Nombre de la factura", "Código del repositorio"],
      correcta: "Valor antes de impuestos"
    },
    {
      texto: "Si compras $25 + $40 + $60, el subtotal es:",
      opciones: ["$125", "$100", "$60", "$25"],
      correcta: "$125"
    },
    {
      texto: "¿Qué se suma al subtotal para obtener el total cuando hay IVA?",
      opciones: ["IVA", "Logo", "Menú", "Correo"],
      correcta: "IVA"
    },
    {
      texto: "¿Qué representa el total factura?",
      opciones: ["El valor final a pagar", "El primer producto", "La cantidad de secciones", "El nombre del cliente únicamente"],
      correcta: "El valor final a pagar"
    },
    {
      texto: "Si subtotal es $200 e IVA es $30, el total es:",
      opciones: ["$230", "$200", "$30", "$170"],
      correcta: "$230"
    },
    {
      texto: "¿Cuál fórmula es correcta?",
      opciones: ["Total = Subtotal + IVA - Descuentos", "Total = Nombre + Apellido", "Total = CSS + HTML", "Total = Imagen - Botón"],
      correcta: "Total = Subtotal + IVA - Descuentos"
    },
    {
      texto: "Antes de calcular el IVA, primero se necesita:",
      opciones: ["Subtotal", "Contraseña de GitHub", "Color del botón", "Icono"],
      correcta: "Subtotal"
    },
    {
      texto: "Si no hay descuento, el total con IVA se calcula:",
      opciones: ["Subtotal + IVA", "Subtotal - IVA", "IVA solamente", "Descuento solamente"],
      correcta: "Subtotal + IVA"
    },
    {
      texto: "¿Qué debe calcular automáticamente el sistema?",
      opciones: ["Subtotal, IVA y total", "Solo el logo", "Solo el color", "Solo el menú"],
      correcta: "Subtotal, IVA y total"
    },
    {
      texto: "¿Qué tipo de dato usarías para precios?",
      opciones: ["Número decimal", "Imagen", "Botón", "Etiqueta title"],
      correcta: "Número decimal"
    }
  ],
 
  formulario104: [
    {
      texto: "¿Para qué se usa el Formulario 104 en Ecuador?",
      opciones: ["Para declarar IVA", "Para crear un logo", "Para diseñar un menú", "Para subir imágenes"],
      correcta: "Para declarar IVA"
    },
    {
      texto: "¿Qué puede usar el sistema para preparar un resumen 104?",
      opciones: ["Compras y ventas registradas", "Solo colores", "Solo iconos", "Solo el nombre del estudiante"],
      correcta: "Compras y ventas registradas"
    },
    {
      texto: "IVA ventas menos IVA compras puede ayudar a obtener:",
      opciones: ["IVA a pagar", "Color principal", "Nombre del archivo", "Imagen del sistema"],
      correcta: "IVA a pagar"
    },
    {
      texto: "¿Qué dato pertenece al Formulario 104?",
      opciones: ["Ventas gravadas", "Tipo de fuente", "Ruta del CSS", "Nombre de imagen"],
      correcta: "Ventas gravadas"
    },
    {
      texto: "¿Qué significa crédito tributario en este contexto básico?",
      opciones: ["IVA pagado en compras que puede restarse", "Un préstamo bancario personal", "Un botón de la página", "Un color del sistema"],
      correcta: "IVA pagado en compras que puede restarse"
    },
    {
      texto: "Si IVA ventas es $750 e IVA compras es $450, el IVA a pagar es:",
      opciones: ["$300", "$750", "$450", "$1200"],
      correcta: "$300"
    },
    {
      texto: "El mini sistema debe ser presentado como:",
      opciones: ["Simulador educativo", "Declaración oficial automática", "Banco real", "Servicio legal certificado"],
      correcta: "Simulador educativo"
    },
    {
      texto: "¿Qué entidad recibe declaraciones tributarias en Ecuador?",
      opciones: ["SRI", "Boxicons", "Vercel", "CSS"],
      correcta: "SRI"
    },
    {
      texto: "¿Qué documento ayuda a declarar IVA?",
      opciones: ["Formulario 104", "README solamente", "Hoja de estilos", "Archivo de imágenes"],
      correcta: "Formulario 104"
    },
    {
      texto: "¿Qué información debe almacenar el sistema para practicar?",
      opciones: ["Facturas de compra y venta", "Solo animaciones", "Solo redes sociales", "Solo el footer"],
      correcta: "Facturas de compra y venta"
    }
  ]
};
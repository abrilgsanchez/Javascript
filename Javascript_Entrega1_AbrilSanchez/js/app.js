

const catalogo = [
  { id: 1, nombre: "Auriculares", precio: 25000 },
  { id: 2, nombre: "Mouse", precio: 18000 },
  { id: 3, nombre: "Teclado", precio: 42000 },
  { id: 4, nombre: "Webcam", precio: 35000 },
  { id: 5, nombre: "Pad Mouse", precio: 9000 }
];

let carrito = [];

function mostrarCatalogo() {
  console.log("CATÁLOGO");
  console.table(catalogo);
}

function solicitarProducto() {
  const texto = prompt(
    "Ingresá un ID (o FIN para terminar):\n" +
    catalogo.map(function(p) { return p.id + " - " + p.nombre + " ($" + p.precio + ")"; }).join("\n")
  );
  if (texto === null) return null;
  if (texto.trim().toLowerCase() === "fin") return null;

  const id = Number(texto);
  if (Number.isNaN(id)) {
    alert("El ID debe ser numérico.");
    return solicitarProducto();
  }

  let prod = null;
  for (let i = 0; i < catalogo.length; i++) {
    if (catalogo[i].id === id) {
      prod = catalogo[i];
      break;
    }
  }
  if (!prod) {
    alert("No existe un producto con ese ID.");
    return solicitarProducto();
  }

  const cantStr = prompt("¿Cuántas unidades de " + prod.nombre + "?");
  if (cantStr === null) return null;
  const cantidad = Number(cantStr);
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    alert("La cantidad debe ser un entero positivo.");
    return solicitarProducto();
  }

  return { id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: cantidad };
}

function agregarAlCarrito(item) {
  let existe = false;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === item.id) {
      carrito[i].cantidad += item.cantidad;
      existe = true;
      break;
    }
  }
  if (!existe) {
    carrito.push(item);
  }
  console.log("+ " + item.cantidad + " x " + item.nombre);
}

function calcularTotal() {
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total += carrito[i].precio * carrito[i].cantidad;
  }
  return total;
}

function mostrarResumen() {
  if (carrito.length === 0) {
    alert("No agregaste productos.");
    console.log("Carrito vacío.");
    return;
  }

  const filas = carrito.map(function(it) {
    return {
      Producto: it.nombre,
      Cantidad: it.cantidad,
      "Precio Unit.": "$" + it.precio,
      Subtotal: "$" + (it.precio * it.cantidad)
    };
  });

  console.log("RESUMEN");
  console.table(filas);

  const total = calcularTotal();
  console.log("TOTAL: $" + total);
  alert("Gracias por tu compra!\nTOTAL: $" + total);


  const nombres = carrito.map(function(it) { return it.nombre; });
  console.log("map → nombres del carrito:", nombres);

  const caros = carrito.filter(function(it) { return it.precio > 20000; });
  console.log("filter → productos con precio > 20000:", caros);

  const mouse = catalogo.find(function(p) { return p.nombre === "Mouse"; });
  console.log("find → producto 'Mouse':", mouse);

  carrito.sort(function(a, b) { return a.precio - b.precio; });
  console.log("sort → carrito ordenado por precio:", carrito);

  console.log("forEach → detalle de cada producto:");
  carrito.forEach(function(it) {
    console.log(it.nombre + " x" + it.cantidad + " = $" + (it.precio * it.cantidad));
  });
}

function iniciarSimulador() {
  console.clear();
  console.log("Simulador Carrito (final simple)");
  mostrarCatalogo();

  while (true) {
    const eleccion = solicitarProducto();
    if (eleccion === null) break;
    agregarAlCarrito(eleccion);
  }

  mostrarResumen();
}

iniciarSimulador();

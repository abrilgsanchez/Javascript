//catalogo
const catalogo = [
  { id: 1, nombre: "Auriculares", precio: 25000 },
  { id: 2, nombre: "Mouse",      precio: 18000 },
  { id: 3, nombre: "Teclado",    precio: 42000 },
  { id: 4, nombre: "Webcam",     precio: 35000 },
  { id: 5, nombre: "Pad Mouse",  precio: 9000 }
];


let carrito = [];


const catalogoDiv = document.getElementById("catalogo");
const carritoDiv  = document.getElementById("carrito");
const totalP      = document.getElementById("total");


const STORAGE_KEY = "carrito:v1";

function guardarCarrito() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

function cargarCarrito() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    carrito = JSON.parse(data);
  }
}

function renderCatalogo() {
  catalogoDiv.innerHTML = "";

  for (let i = 0; i < catalogo.length; i++) {
    const p = catalogo[i];

    const card = document.createElement("div");
    card.setAttribute("data-id", p.id);

    const titulo = document.createElement("p");
    titulo.innerHTML = "<strong>" + p.nombre + "</strong> - $" + p.precio;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.value = "1";

    const btn = document.createElement("button");
    btn.textContent = "Agregar";
    btn.addEventListener("click", function () {
      const cant = Number(input.value);
      if (!Number.isInteger(cant) || cant <= 0) return; 
      agregarAlCarrito(p.id, cant);
    });

    card.appendChild(titulo);
    card.appendChild(input);
    card.appendChild(btn);
    catalogoDiv.appendChild(card);
  }
}


function renderCarrito() {
  carritoDiv.innerHTML = "";

  if (carrito.length === 0) {
    carritoDiv.textContent = "No hay productos en el carrito.";
    totalP.textContent = "Total: $0";
    return;
  }

  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];

    const row = document.createElement("div");
    row.setAttribute("data-id", item.id);

    const info = document.createElement("p");
    const subtotal = item.precio * item.cantidad;
    info.textContent = item.nombre + " x" + item.cantidad + " — $" + subtotal;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      eliminarDelCarrito(item.id);
    });

    row.appendChild(info);
    row.appendChild(btnEliminar);
    carritoDiv.appendChild(row);
  }

  totalP.textContent = "Total: $" + calcularTotal();
}


function agregarAlCarrito(idProducto, cantidad) {

  let prod = null;
  for (let i = 0; i < catalogo.length; i++) {
    if (catalogo[i].id === idProducto) {
      prod = catalogo[i];
      break;
    }
  }
  if (!prod) return;


  let encontrado = false;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === idProducto) {
      carrito[i].cantidad += cantidad;
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    carrito.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: cantidad
    });
  }

  guardarCarrito();
  renderCarrito();
}

function eliminarDelCarrito(idProducto) {
  //eliminar producto
  carrito = carrito.filter(function (item) {
    return item.id !== idProducto;
  });
  guardarCarrito();
  renderCarrito();
}

function calcularTotal() {
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total += carrito[i].precio * carrito[i].cantidad;
  }
  return total;
}

cargarCarrito();
renderCatalogo();
renderCarrito();

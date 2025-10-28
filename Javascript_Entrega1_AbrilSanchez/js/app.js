let catalogo = [];
let carrito = [];

const catalogoDiv = document.getElementById("catalogo");
const carritoDiv  = document.getElementById("carrito");
const totalP      = document.getElementById("total");

const formCompra       = document.getElementById("formCompra");
const inputNombre      = document.getElementById("compradorNombre");
const inputEmail       = document.getElementById("compradorEmail");
const inputDireccion   = document.getElementById("compradorDireccion");
const mensajeCompraDiv = document.getElementById("mensajeCompra");

const STORAGE_KEY = "carritoFinal";

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

    const itemCat = document.createElement("div");
    itemCat.className = "item-cat";
    itemCat.setAttribute("data-id", p.id);

    const info = document.createElement("div");
    info.className = "item-cat-info";
    info.innerHTML =
      "<span class='item-cat-titulo'>" +
      p.nombre +
      "</span> - $" +
      p.precio;

    const addBlock = document.createElement("div");
    addBlock.className = "add-block";

    const inputCant = document.createElement("input");
    inputCant.type = "number";
    inputCant.min = "1";
    inputCant.value = "1";

    const btnAgregar = document.createElement("button");
    btnAgregar.textContent = "Agregar";

    btnAgregar.addEventListener("click", function () {
      const cant = Number(inputCant.value);
      if (!Number.isInteger(cant) || cant <= 0) {
        return;
      }
      agregarAlCarrito(p.id, cant);
    });

    addBlock.appendChild(inputCant);
    addBlock.appendChild(btnAgregar);

    itemCat.appendChild(info);
    itemCat.appendChild(addBlock);

    catalogoDiv.appendChild(itemCat);
  }
}

//render carrito
function renderCarrito() {
  carritoDiv.innerHTML = "";

  if (carrito.length === 0) {
    carritoDiv.textContent = "No hay productos en el carrito.";
    totalP.textContent = "Total: $0";
    return;
  }

  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];

    const itemCart = document.createElement("div");
    itemCart.className = "item-cart";
    itemCart.setAttribute("data-id", item.id);

    const linea = document.createElement("div");
    linea.className = "item-cart-line";

    const subtotal = item.precio * item.cantidad;
    linea.textContent =
      item.nombre + " x" + item.cantidad + " — $" + subtotal;

    const controls = document.createElement("div");
    controls.className = "controls";

    const inputEditCant = document.createElement("input");
    inputEditCant.type = "number";
    inputEditCant.min = "1";
    inputEditCant.value = String(item.cantidad);

    inputEditCant.addEventListener("change", function () {
      const nuevaCantidad = Number(inputEditCant.value);
      if (!Number.isInteger(nuevaCantidad) || nuevaCantidad <= 0) {
        inputEditCant.value = String(item.cantidad);
        return;
      }
      item.cantidad = nuevaCantidad;
      guardarCarrito();
      renderCarrito();
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";

    btnEliminar.addEventListener("click", function () {
      eliminarDelCarrito(item.id);
    });

    controls.appendChild(inputEditCant);
    controls.appendChild(btnEliminar);

    itemCart.appendChild(linea);
    itemCart.appendChild(controls);

    carritoDiv.appendChild(itemCart);
  }

  totalP.textContent = "Total: $" + calcularTotal();
}

//logica carrito
function agregarAlCarrito(idProducto, cantidad) {

  let prod = null;
  for (let i = 0; i < catalogo.length; i++) {
    if (catalogo[i].id === idProducto) {
      prod = catalogo[i];
      break;
    }
  }
  if (!prod) {
    return;
  }


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
      cantidad: cantidad,
    });
  }

  guardarCarrito();
  renderCarrito();
}

function eliminarDelCarrito(idProducto) {
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

//finalizar compra
formCompra.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombreValor = inputNombre.value;
  const emailValor = inputEmail.value;
  const dirValor = inputDireccion.value;

  if (carrito.length === 0) {
    mensajeCompraDiv.textContent = "El carrito está vacío.";
    mensajeCompraDiv.style.color = "#dc3545";
    return;
  }

  if (nombreValor === "" || emailValor === "" || dirValor === "") {
    mensajeCompraDiv.textContent = "Completá los datos para finalizar.";
    mensajeCompraDiv.style.color = "#dc3545";
    return;
  }

  const totalFinal = calcularTotal();
  mensajeCompraDiv.textContent =
    "Compra realizada con éxito. Total: $" + totalFinal;
  mensajeCompraDiv.style.color = "#198754";


  carrito = [];
  guardarCarrito();
  renderCarrito();
});


function cargarCatalogoDesdeJSON() {
  fetch("./data/catalogo.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      catalogo = data; 
      renderCatalogo();
    })
    .catch(function () {
      catalogo = [];
      renderCatalogo();
    });
}

cargarCarrito();
cargarCatalogoDesdeJSON(); 
renderCarrito();           

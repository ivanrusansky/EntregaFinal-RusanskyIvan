// Recuperación del carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let contadorCarrito = carrito.length; // Actualización del contador con la longitud del carrito

// Actualización el contador del carrito en la carga de la página
actualizarContadorCarrito();

document.querySelectorAll('.agregar-carrito').forEach((button) => {
  button.addEventListener('click', () => {
    const codigoProducto = button.getAttribute('data-codigo');
    agregarAlCarrito(codigoProducto);
  });
});

function agregarAlCarrito(codigoProducto) {
  // Fetch del archivo JSON
  fetch('../index.json')
    .then(response => response.json())
    .then(data => {
      // Busqueda del producto por código en el JSON
      const producto = data.find(producto => producto.codigo === codigoProducto);

      if (producto) {
        // Agregar al carrito
        carrito.push(producto);
        // Guardar el carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        // Productos disponibles después de cada compra
        filtrarProductosDisponibles();
      } else {
        console.log('Producto no encontrado. Verifique el código.');
      }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Buscar una prenda por su código
function buscarPrenda(codigo) {
  return ropa.find(producto => producto.codigo === codigo);
}

// Actualización el contador del carrito
function actualizarContadorCarrito() {
  contadorCarrito = carrito.length; // Actualización del contador con la longitud del carrito
  document.getElementById('contador-carrito').innerText = contadorCarrito.toString();
}

// Filtrar productos disponibles después de cada compra utilizando fetch
function filtrarProductosDisponibles() {
  fetch('index.json')
    .then(response => response.json())
    .then(data => {
      ropa = data.filter(producto => !carrito.some(carritoProducto => carritoProducto.codigo === producto.codigo));
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

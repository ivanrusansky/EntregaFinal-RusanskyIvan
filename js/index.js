// Recuperación del carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let contadorCarrito = carrito.length; // Actualización del contador con la longitud del carrito

// Actualización del contador del carrito en la carga de la página
document.addEventListener('DOMContentLoaded', function () {
    // Obtener el contenedor del catálogo
    const catalogoContainer = document.getElementById('catalogo');

    // Verificar que el elemento catalogoContainer existe antes de usarlo
    if (catalogoContainer) {
        // Función para generar la tarjeta de producto
        function generarTarjetaProducto(producto) {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'content';
            tarjeta.innerHTML = `
                <h2>${producto.nombre}</h2>
                <div class="imgprod">
                    <img class="clo" src="${producto.imagen}" alt="" id="img-${producto.codigo}">
                </div>
                <p>${producto.nombre}</p>
                <h6>$${producto.precio}</h6>
                <button class="agregar-carrito" data-codigo="${producto.codigo}">Agregar al carrito</button>
            `;
            return tarjeta;
        }

        // Generar dinámicamente las tarjetas de productos
        fetch('../index.json')
            .then(response => response.json())
            .then(productos => {
                productos.forEach(producto => {
                    const tarjeta = generarTarjetaProducto(producto);
                    catalogoContainer.appendChild(tarjeta);
                });

                // Asociar eventos de clic a los botones "Agregar al carrito"
                document.querySelectorAll('.agregar-carrito').forEach((button) => {
                    button.addEventListener('click', () => {
                        const codigoProducto = button.getAttribute('data-codigo');
                        agregarAlCarrito(codigoProducto);
                        cargarProductos();
                    });
                });

                // Llamada a actualizarContadorCarrito después de cargar el contenido
                actualizarContadorCarrito();
            })
            .catch(error => {
                //SweetAlert de error en la carga del archivo JSON de productos
                Swal.fire({
                    title: 'Error',
                    text: 'Error al cargar el archivo JSON de productos: ' + error.message,
                    icon: 'error'
                });
            });
    } else {
        console.error("Elemento con ID 'catalogo' no encontrado.");
    }
});

// Función para agregar un producto al carrito
function agregarAlCarrito(codigoProducto) {
    fetch('../index.json')
        .then(response => response.json())
        .then(data => {
            // Buscar el producto por su código
            const producto = data.find(producto => producto.codigo === codigoProducto);

            if (producto) {
                // Agregar el producto al carrito
                carrito.push(producto);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                // Actualizar el contador del carrito y recargar la lista de productos
                actualizarContadorCarrito();
                cargarProductos();
                // Mensaje de éxito al usuario
                Swal.fire({
                    title: 'Éxito',
                    text: 'Producto agregado al carrito',
                    icon: 'success'
                });
            } else {
                // Mensaje de error si el producto no se encuentra
                Swal.fire({
                    title: 'Error',
                    text: 'Producto no encontrado. Verifique el código.',
                    icon: 'error'
                });
            }
        })
}

// Función para actualizar el contador del carrito en la interfaz
function actualizarContadorCarrito() {
    contadorCarrito = carrito.length;
    document.getElementById('contador-carrito').innerText = contadorCarrito.toString();
}

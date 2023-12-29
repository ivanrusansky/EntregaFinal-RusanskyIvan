// Recuperación del carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let contadorCarrito = carrito.length; // Actualización del contador con la longitud del carrito

// Actualización del contador del carrito en la carga de la página
actualizarContadorCarrito();

document.addEventListener('DOMContentLoaded', function () {
    // Obtener el contenedor del catálogo
    const catalogoContainer = document.getElementById('catalogo');

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
        })
        .catch(error => {
            // Mostrar SweetAlert de error en la carga del archivo JSON de productos
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar el archivo JSON de productos: ' + error.message,
                icon: 'error'
            });
        });
});

function agregarAlCarrito(codigoProducto) {
    fetch('../index.json')
        .then(response => response.json())
        .then(data => {
            const producto = data.find(producto => producto.codigo === codigoProducto);

            if (producto) {
                carrito.push(producto);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                actualizarContadorCarrito();
                cargarProductos();
                Swal.fire({
                    title: 'Éxito',
                    text: 'Producto agregado al carrito',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Producto no encontrado. Verifique el código.',
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar el archivo JSON: ' + error.message,
                icon: 'error'
            });
        });
}

function actualizarContadorCarrito() {
    contadorCarrito = carrito.length;
    document.getElementById('contador-carrito').innerText = contadorCarrito.toString();
}

function cargarProductos() {
    const cuerpoTabla = document.getElementById('carrito-body');
    const totalElement = document.getElementById('total');
    cuerpoTabla.innerHTML = '';

    let totalCompra = 0;

    const carritoUnico = [...new Set(carrito)];

    carritoUnico.forEach(producto => {
        const cantidad = carrito.filter(item => item.codigo === producto.codigo).length;

        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${producto.nombre} (${cantidad} ${cantidad > 1 ? 'unidades' : 'unidad'})</td><td>$${producto.precio * cantidad}</td>`;
        cuerpoTabla.appendChild(fila);

        totalCompra += producto.precio * cantidad;
    });

    totalElement.innerText = `$${totalCompra.toFixed(2)}`;
    actualizarInformacion();
}

function solicitarConfirmacion() {
    const cuotas = document.getElementById('cuotas').value;
    const totalCompra = calcularTotalCompra();
    const cuotaMensual = (cuotas > 0) ? totalCompra / cuotas : 0;

    Swal.fire({
        title: `Confirmar compra`,
        text: `Está a punto de realizar una compra de $${totalCompra.toFixed(2)} en ${cuotas} cuotas de $${cuotaMensual.toFixed(2)} cada una. ¿Desea confirmar la compra?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            realizarCompra();
        } else {
            Swal.fire('Compra cancelada', '', 'error');
        }
    });
}

function realizarCompra() {
    vaciarCarrito();

    setTimeout(() => {
        Swal.fire({
            title: '¡Compra exitosa!',
            text: 'Gracias por elegirnos.',
            icon: 'success'
        }).then(() => {
            window.location.href = '../index.html';
        });
    }, 500);
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
}

function calcularTotalCompra() {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio;
    });
    return total;
}

function actualizarInformacion() {
    const cuotasSeleccionadas = parseInt(document.getElementById('cuotas').value);

    const totalCompra = calcularTotalCompra();

    document.getElementById('precio-total').innerText = `$${totalCompra.toFixed(2)}`;

    const precioPorMes = (cuotasSeleccionadas > 0) ? totalCompra / cuotasSeleccionadas : 0;

    const cuerpoTablaCuotas = document.getElementById('tabla-cuotas');
    cuerpoTablaCuotas.innerHTML = '';

    for (let i = 1; i <= cuotasSeleccionadas; i++) {
        const filaCuota = document.createElement('tr');
        filaCuota.innerHTML = `<td>${i} cuota${(i > 1) ? 's' : ''}</td><td>$${precioPorMes.toFixed(2)}</td>`;
        cuerpoTablaCuotas.appendChild(filaCuota);
    }
}

// Recuperación del carrito desde localStorage
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let ropa = [];

// Función para cargar la lista de productos y realizar operaciones relacionadas con el carrito
function cargarProductos() {
    // lista de productos desde el archivo JSON usando fetch
    fetch('../index.json')
        .then(response => response.json())
        .then(data => {
            // Actualizar la lista de productos
            ropa = data;

            // Lógica relacionada con el carrito
            actualizarCarrito();
            actualizarInformacion();
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Llamada a la función para cargar productos cuando la página se cargue
cargarProductos();

// Función para actualizar la tabla de carrito en carrito.html
function actualizarCarrito() {
    const cuerpoTabla = document.getElementById('carrito-body');
    const totalElement = document.getElementById('total');
    cuerpoTabla.innerHTML = '';

    let totalCompra = 0;

    carrito.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${producto.nombre}</td><td>$${producto.precio}</td>`;
        cuerpoTabla.appendChild(fila);

        // Actualización del total de la compra
        totalCompra += producto.precio;
    });

    // Actualización del total en el elemento HTML
    totalElement.innerText = `$${totalCompra.toFixed(2)}`;

    // Llamada a la función para actualizar información adicional (cuotas, etc.)
    actualizarInformacion();
}

function solicitarConfirmacion() {
    const cuotas = document.getElementById('cuotas').value;
    const totalCompra = calcularTotalCompra();
    const cuotaMensual = (cuotas > 0) ? totalCompra / cuotas : 0;

    // SweetAlert
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
    // Vaciar el carrito
    vaciarCarrito();

    setTimeout(() => {
        //SweetAlert de compra exitosa
        Swal.fire({
            title: '¡Compra exitosa!',
            text: 'Gracias por elegirnos.',
            icon: 'success'
        }).then(() => {
            // Redirección a la página de inicio
            window.location.href = '../index.html';
        });
    }, 500);
}

function vaciarCarrito() {
    localStorage.removeItem('carrito'); // Limpieza de localStorage
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

    //Precio total de la compra
    const totalCompra = calcularTotalCompra();

    // Actualización del precio total en el elemento HTML
    document.getElementById('precio-total').innerText = `$${totalCompra.toFixed(2)}`;

    // Calculo del precio por mes
    const precioPorMes = (cuotasSeleccionadas > 0) ? totalCompra / cuotasSeleccionadas : 0;

    // Precio por mes en la tabla
    const cuerpoTablaCuotas = document.getElementById('tabla-cuotas');
    cuerpoTablaCuotas.innerHTML = '';

    for (let i = 1; i <= cuotasSeleccionadas; i++) {
        const filaCuota = document.createElement('tr');
        filaCuota.innerHTML = `<td>${i} cuota${(i > 1) ? 's' : ''}</td><td>$${precioPorMes.toFixed(2)}</td>`;
        cuerpoTablaCuotas.appendChild(filaCuota);
    }
}

// Recuperación del carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let contadorCarrito = carrito.length; // Actualización del contador con la longitud del carrito

// Actualización del contador del carrito en la carga de la página
actualizarContadorCarrito();

document.addEventListener('DOMContentLoaded', function () {
    // Asociar evento de clic al botón "Confirmar Compra"
    document.getElementById('confirmarCompra').addEventListener('click', solicitarConfirmacion);

    // Cargar productos en el carrito al cargar la página
    cargarProductos();
});

function cargarProductos() {
    // Obtener el cuerpo de la tabla y el elemento del total
    const cuerpoTabla = document.getElementById('carrito-body');
    const totalElement = document.getElementById('total');

    // Verificar si los elementos existen antes de intentar acceder a ellos
    if (!cuerpoTabla || !totalElement) {
        console.error('Elementos no encontrados en el DOM');
        return;
    }

    cuerpoTabla.innerHTML = '';

    let totalCompra = 0; // Inicializar el total de la compra

    const carritoUnico = [...new Set(carrito)]; // Eliminar duplicados del carrito

    carritoUnico.forEach(producto => {
        const cantidad = carrito.filter(item => item.codigo === producto.codigo).length;

        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${producto.nombre} (${cantidad} ${cantidad > 1 ? 'unidades' : 'unidad'})</td><td>$${producto.precio * cantidad}</td>`;
        cuerpoTabla.appendChild(fila);

        // Actualización del total de la compra
        totalCompra += producto.precio * cantidad;
    });

    // Actualización del total en el elemento HTML
    totalElement.innerText = `$${totalCompra.toFixed(2)}`;

    // Llamada a la función para actualizar información adicional (cuotas, etc.)
    actualizarInformacion();
}

function solicitarConfirmacion() {
    const cuotas = document.getElementById('cuotas').value;
    const totalCompra = calcularTotalCompra();
    const cuotaMensual = cuotas > 0 ? totalCompra / cuotas : 0;

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
        // SweetAlert de compra exitosa
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

    // Precio total de la compra
    const totalCompra = calcularTotalCompra();

    // Actualización del precio total en el elemento HTML
    document.getElementById('precio-total').innerText = `$${totalCompra.toFixed(2)}`;

    // Calculo del precio por mes
    const precioPorMes = cuotasSeleccionadas > 0 ? totalCompra / cuotasSeleccionadas : 0;

    // Precio por mes en la tabla
    const cuerpoTablaCuotas = document.getElementById('tabla-cuotas');
    cuerpoTablaCuotas.innerHTML = '';

    for (let i = 1; i <= cuotasSeleccionadas; i++) {
        const filaCuota = document.createElement('tr');
        filaCuota.innerHTML = `<td>${i} cuota${i > 1 ? 's' : ''}</td><td>$${precioPorMes.toFixed(2)}</td>`;
        cuerpoTablaCuotas.appendChild(filaCuota);
    }
}

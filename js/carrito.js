// Recuperación del carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función principal que se ejecuta cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Cargar productos y actualizar información
    cargarProductos();
    actualizarInformacion();
});

// Función para cargar los productos en el carrito en la tabla de la página
function cargarProductos() {
    const cuerpoTabla = document.getElementById('carrito-body');
    cuerpoTabla.innerHTML = '';

    let totalCompra = 0;

    // Obtener productos únicos en el carrito
    const carritoUnico = [...new Set(carrito)];

    // Iterar sobre los productos únicos en el carrito
    carritoUnico.forEach(producto => {
        // Calcular la cantidad de cada producto en el carrito
        const cantidad = carrito.filter(item => item.codigo === producto.codigo).length;

        // Crear una fila en la tabla para cada producto
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${producto.nombre} (${cantidad} ${cantidad > 1 ? 'unidades' : 'unidad'})</td><td>$${producto.precio * cantidad}</td>`;
        cuerpoTabla.appendChild(fila);

        // Actualizar el total de la compra
        totalCompra += producto.precio * cantidad;
    });

    // Total de la compra en la interfaz
    document.getElementById('total').innerText = `$${totalCompra.toFixed(2)}`;
}

// Función para solicitar confirmación al usuario antes de realizar la compra
function solicitarConfirmacion() {
    const cuotas = document.getElementById('cuotas').value;
    const totalCompra = calcularTotalCompra();
    const cuotaMensual = cuotas > 0 ? totalCompra / cuotas : 0;

    // Mostrar un cuadro de diálogo de confirmación usando SweetAlert
    Swal.fire({
        title: `Confirmar compra`,
        text: `Está a punto de realizar una compra de $${totalCompra.toFixed(2)} en ${cuotas} cuotas de $${cuotaMensual.toFixed(2)} cada una. ¿Desea confirmar la compra?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la compra si el usuario confirma
            realizarCompra();
        } else {
            // Mostrar mensaje de cancelación si el usuario cancela la compra
            Swal.fire('Compra cancelada', '', 'error');
        }
    });
}

// Función para simular la realización de la compra (vaciar carrito y redirigir)
function realizarCompra() {
    // Vaciar el carrito
    vaciarCarrito();

    // Mostrar mensaje de compra exitosa y redirigir a la página principal después de un breve retraso
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

// Función para vaciar el carrito (eliminar el contenido del localStorage)
function vaciarCarrito() {
    localStorage.removeItem('carrito');
}

// Función para calcular el total de la compra sumando los precios de los productos en el carrito
function calcularTotalCompra() {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio;
    });
    return total;
}

// Función para actualizar la información de la interfaz en base a las cuotas seleccionadas
function actualizarInformacion() {
    const cuotasSeleccionadas = parseInt(document.getElementById('cuotas').value);

    const totalCompra = calcularTotalCompra();

    // Mostrar el precio total de la compra en la interfaz
    document.getElementById('precio-total').innerText = `$${totalCompra.toFixed(2)}`;

    const precioPorMes = cuotasSeleccionadas > 0 ? totalCompra / cuotasSeleccionadas : 0;

    // Actualizar la tabla de cuotas en la interfaz
    const cuerpoTablaCuotas = document.getElementById('tabla-cuotas');
    cuerpoTablaCuotas.innerHTML = '';

    for (let i = 1; i <= cuotasSeleccionadas; i++) {
        const filaCuota = document.createElement('tr');
        filaCuota.innerHTML = `<td>${i} cuota${i > 1 ? 's' : ''}</td><td>$${precioPorMes.toFixed(2)}</td>`;
        cuerpoTablaCuotas.appendChild(filaCuota);
    }
}

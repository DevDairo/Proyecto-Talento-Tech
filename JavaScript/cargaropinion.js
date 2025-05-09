document.addEventListener('DOMContentLoaded', function() {
    // Obtener la referencia al cuerpo de la tabla
    const tbody = document.querySelector('#tabla-opiniones tbody');
    if (!tbody) {
        console.error("No se encontró el cuerpo de la tabla con ID 'tabla-opiniones'");
        return; //  si no se encuentra el tbody sale.
    }

    //cargar y mostrar los datos en la tabla
    async function cargarDatosEnTabla() {
        try {
            const respuesta = await fetch('http://127.0.0.1:5000/consultar_opiniones'); // Usar el nuevo endpoint(Direción de solicitud)
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            const opiniones = await respuesta.json();

            console.log('Datos de opiniones recibidos:', opiniones);

            // Limpiar el cuerpo  de la tabla si hay datos previos.
            tbody.innerHTML = '';

            // Iterar sobre los datos y añadir filas a la tabla
            if (opiniones.length > 0) {
                opiniones.forEach(opinion => {
                    const fila = document.createElement('tr');

                    // Crear y añadir las celdas para cada dato; Asegurar que conincidan con los datos del JSON
                    fila.innerHTML = `
                        <td>${opinion.nombreCompleto || ''}</td>
                        <td>${opinion.fechaNacimiento || ''}</td>
                        <td>${opinion.correoContacto || ''}</td>
                        <td>${opinion.numeroTelefono || ''}</td>
                        <td>${opinion.consumoElectricoKwh !== undefined && opinion.consumoElectricoKwh !== null ? opinion.consumoElectricoKwh : ''}</td>
                        <td>${Array.isArray(opinion.energiasReconocidas) ? opinion.energiasReconocidas.join(', ') : (opinion.energiasReconocidas || '')}</td>
                        <td>${opinion.comentario || ''}</td>
                    `;
                    tbody.appendChild(fila);
                });
            } else {
                // Mostrar un mensaje si no hay datos
                const filaVacia = document.createElement('tr');
                filaVacia.innerHTML = `<td colspan="7" style="text-align: center;">No hay opiniones registradas aún.</td>`;
                tbody.appendChild(filaVacia);
            }

        } catch (error) {
            console.error('Error al cargar los datos de opiniones:', error);
            // Mostrar un mensaje de error en la tabla si falla la carga
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Error al cargar los datos: ${error.message}</td></tr>`;
        }
    }

    // Cargar los datos cuando la página esté lista
    cargarDatosEnTabla();
});
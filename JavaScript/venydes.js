document.addEventListener('DOMContentLoaded', function () {
    const botonComparar = document.getElementById('botonComparar');
    const contenedorComparacion = document.getElementById('contenedorComparacion');
    let comparacionCargada = false;

    if (botonComparar) {  
        botonComparar.addEventListener('click', () => {
            // Mostrar/ocultar el contenedor
            if (contenedorComparacion.style.display === 'block') {
                contenedorComparacion.style.display = 'none';
            } else {
                contenedorComparacion.style.display = 'block';

                // Solo carga una vez la tabla
                if (!comparacionCargada) {
                    let tablaHTML = '<table>';
                    tablaHTML += `
                        <tr>
                            <th>Aspecto</th>
                            <th>Energías Renovables</th>
                            <th>Energías No Renovables</th>
                        </tr>
                    `;

                    // Cargar los datos desde el archivo JSON
                    fetch('json/venydes.json')
                        .then(response => response.json())
                        .then(data => {
                            data.forEach(fila => {
                                tablaHTML += `
                                    <tr>
                                        <td>${fila.Aspecto}</td>
                                        <td>${fila["Energias Renovables"]}</td>
                                        <td>${fila["Energias No Renovables"]}</td>
                                    </tr>
                                `;
                            });

                            tablaHTML += '</table>';
                            contenedorComparacion.innerHTML = tablaHTML;
                            comparacionCargada = true;  // Evitar cargar de nuevo.
                        })
                        .catch(error => {
                            console.error('Error al cargar la comparación:', error);
                            contenedorComparacion.innerHTML = "Error al cargar los datos de la comparación.";
                        });
                }
            }
        });
    } else {
        console.error('El botón no se encontró en el DOM.');
    }
});

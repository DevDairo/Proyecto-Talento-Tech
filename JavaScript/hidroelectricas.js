const botonMostrarTabla = document.getElementById('mostrarTabla');
const contenedorTabla = document.getElementById('contenedorTabla');
let tablaCargada = false; // Ver si cargaron los datos

botonMostrarTabla.addEventListener('click', () => {
    if (contenedorTabla.style.display === 'block') {
        contenedorTabla.style.display = 'none'; // Ocultar si ya está visible
    } else {
        contenedorTabla.style.display = 'block';  // Mostrar el contenedor

        if (!tablaCargada) {
            let tablaHTML = '<table>';
            tablaHTML +=
                '<tr><th>Central Hidroeléctrica</th><th>Ubicación</th><th>Capacidad Instalada (MW)</th><th>Operador</th><th>Panorámica</th></tr>';

            fetch('json/hidroelectricas.json')
                .then(response => response.json()) 
                .then(datosHidroelectricas => { 
                    datosHidroelectricas.forEach(central => {
                        tablaHTML += `
                            <tr>
                                <td>${central.Central}</td>
                                <td>${central.Ubicación}</td>
                                <td>${central["Capacidad (MW)"]}</td>
                                <td>${central.Operador}</td>
                                <td><img class="imgtabla" src="${central.Panorámica}" alt=""></td>
                            </tr>
                        `;
                    });

                    tablaHTML += '</table>';
                    contenedorTabla.innerHTML = tablaHTML;
                    tablaCargada = true; // Marca como cargada
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }
});

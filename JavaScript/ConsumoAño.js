document.getElementById('consultarBtn').addEventListener('click', function() {
  const yearInput = document.getElementById('year'); //Obtiene los datos de entrada
  const year = parseInt(yearInput.value); // Convierte el valor a número entero.

 //rango de años
  const minYear = 1965;
  const maxYear = 2021;

  // Condicional para verificar si el año se enuentra en el rango
  if (isNaN(year) || year < minYear || year > maxYear) {
    document.getElementById('datos').textContent = `Por favor, ingresa un año válido entre ${minYear} y ${maxYear}.`;
    return; // Detiene la ejecución si ingresa año fuera de rango
  }

  // Limpia el resultado del año que ingreso anteriormente
  document.getElementById('datos').textContent = 'Consultando...';


  // Obtiene los datos del archivo JSON
  fetch('json/consumo.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {

      // Buscar el dato del año ingresado una vez se valido con anterioridad
      const result = data.find(item => item.Year === year); // Compara con numero entero

      if (result) {
        document.getElementById('datos').textContent = `En el año ${result.Year}, la electricidad generada desde las hidroeléctricas en Colombia fue de ${result["Electricity from hydro (TWh)"]} TWh.`;
      } else {

        // En caso de que se elimine la información del JSON y si el año es válido
        document.getElementById('datos').textContent = `No se encontraron datos específicos para el año ${year}.`;
      }
    })
    .catch(error => {
      console.error('Error al cargar o procesar el archivo JSON:', error);
      document.getElementById('datos').textContent = `Error al consultar los datos. Detalles: ${error.message}`;
    });
});
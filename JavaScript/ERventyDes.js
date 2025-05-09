function mostrarContenido(tipo) {
    const contenedor = document.getElementById(tipo);
  
   
    if (contenedor.innerHTML.trim() !== '') {
      contenedor.innerHTML = '';
      return;
    }
  
    fetch('json/EDventyDes.json')
      .then(res => res.json())
      .then(data => {
        const grupo = data[tipo];
  
        if (!grupo || !Array.isArray(grupo.ventajas) || !Array.isArray(grupo.desventajas)) {
          contenedor.innerHTML = '<p>No hay contenido disponible.</p>';
          console.error(`No se encontró contenido adecuado para la clave '${tipo}'`);
          return;
        }
  
        let html = `
          <h4 class="titulo">Ventajas</h4>
          <ul class="fila">
        `;
        grupo.ventajas.forEach(item => {
          html += `<li class="ventaja1"><strong>${item.titulo}:</strong> ${item.descripcion}</li>`;
        });
        html += `</ul><h4 class="titulo">Desventajas</h4><ul class="fila">`;
        grupo.desventajas.forEach(item => {
          html += `<li class="desventaja1"><strong>${item.titulo}:</strong> ${item.descripcion}</li>`;
        });
        html += `</ul>`;
  
        contenedor.innerHTML = html;
      })
      .catch(err => {
        contenedor.innerHTML = '<p>Error al cargar el contenido.</p>';
        console.error('Error:', err);
      });
  }
  
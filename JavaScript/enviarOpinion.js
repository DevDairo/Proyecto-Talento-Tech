document.addEventListener('DOMContentLoaded', function() {
    const otraCheckbox = document.getElementById('otraCheckbox');
    const otraTexto = document.getElementById('otraTexto');
    if (otraCheckbox && otraTexto) {
        otraCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otraTexto.classList.remove('ocultar');
                otraTexto.setAttribute('required', 'required'); // Hacerlo requerido si se marca "Otra"
            } else {
                otraTexto.classList.add('ocultar');
                otraTexto.removeAttribute('required');
                otraTexto.value = ''; // Limpiar el valor si se desmarca
            }
        });
         // Asegurarse de que esté oculto al cargar la página si no está marcado
        if (!otraCheckbox.checked) {
             otraTexto.classList.add('ocultar');
             otraTexto.removeAttribute('required');
        }
    }
    // Envio del formulario
    const formOpinion = document.getElementById('form-opinion');
    if (formOpinion) {
        formOpinion.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevenir el envío por defecto del formulario

            // Captura de los  datos del formulario
            const nombre = document.getElementById('nombre').value;
            const fechaNacimiento = document.getElementById('fn').value;
            const correo = document.getElementById('correo').value;
            const telefono = document.getElementById('telefono').value;
            const consumoElectrico = document.getElementById('consumo').value;

            // Capturar checkboxes de tipos de energía
            const tiposCheckboxes = document.querySelectorAll('input[name="tipos[]"]:checked');
            const tiposReconocidos = Array.from(tiposCheckboxes).map(cb => cb.value);

            // Si "Otra" está marcado y se especifica texto, añadirlo
            if (otraCheckbox && otraCheckbox.checked && otraTexto && otraTexto.value.trim() !== '' && !tiposReconocidos.includes('otra')) {
                 // Asegurarse de no duplicar si "otra" ya fue añadido por el value
                 tiposReconocidos.push('Otra: ' + otraTexto.value.trim());
             } else if (otraCheckbox && otraCheckbox.checked && otraTexto && otraTexto.value.trim() !== '') {
                 const indexOtra = tiposReconocidos.indexOf('otra');
                 if (indexOtra > -1) {
                     tiposReconocidos[indexOtra] = 'Otra: ' + otraTexto.value.trim();
                 }
             }
            // Capturar comentario en caso de que lo ingrese el usuario
            const comentario = document.getElementById('comentario').value;
            // Crea JSON de los datos del formulario
            const datosOpinion = {
                nombreCompleto: nombre,
                fechaNacimiento: fechaNacimiento,
                correoContacto: correo,
                numeroTelefono: telefono,
                consumoElectricoKwh: parseFloat(consumoElectrico), // Converte a numero real
                energiasReconocidas: tiposReconocidos,
                comentario: comentario // Incluye el comentario
            };

            console.log('Datos a enviar:', datosOpinion);
            // Envia los datos al backend
            try {
                const respuesta = await fetch('http://127.0.0.1:5000/guardar_opinion', { // Usar un nuevo endpoint(dirección)
                    method: 'POST', //Enviar
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosOpinion)
                });
                const data = await respuesta.json();
                console.log('Respuesta del servidor:', data);
                if (data.mensaje === "ok") {
                    // Usar SweetAlert2 para mostrar éxito
                     Swal.fire({
                         title: "Éxito",
                         text: "Tu opinión ha sido guardada.",
                         icon: "success"
                     });
                    formOpinion.reset(); // Una vez se completa exitosamente el envio del formulario, se limpia el formulario.
                     if (otraTexto) {
                        otraTexto.classList.add('ocultar');
                        otraTexto.removeAttribute('required');
                        otraTexto.value = '';
                     }
                } else {  //en caso de que no sea exitoso el envio del formulario
                     Swal.fire({
                         title: "Error",
                         text: "Hubo un problema al guardar tu opinión.",
                         icon: "error"
                     });
                }
            } catch (error) { //en caso de que no sea exitoso el envio del formulario
                console.error('Error al enviar datos:', error);
                 Swal.fire({
                     title: "Error de conexión",
                     text: "No se pudo conectar con el servidor.",
                     icon: "error"
                 });
            }
        });
    }
});
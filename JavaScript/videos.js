
document.addEventListener('DOMContentLoaded', () => {
  fetch('json/videos.json')
    .then(response => response.json())
    .then(videos => {
      document.querySelectorAll('.imgfuentes').forEach(img => {
        img.addEventListener('click', () => {
          const imgName = img.getAttribute('src').split('/').pop();
          const iframeHTML = videos[imgName];

          const container = img.parentElement;
          const existingIframe = container.querySelector('iframe');

          if (existingIframe) {
            existingIframe.remove(); 
          } else if (iframeHTML) {
            container.insertAdjacentHTML('beforeend', iframeHTML);
          } else {
            console.warn(`No se encontró un iframe para: ${imgName}`);
          }
        });
      });
    })
    .catch(error => {
      console.error('Error cargando el JSON:', error);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    if('serviceWorker' in navigator){
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado con exito: ', registration);
            })
            .catch(error => {
                console.log('Fallo en el registro del Service Worker:', error);
            })
        })
    }
  
  });
  
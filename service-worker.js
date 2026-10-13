
const CACHE_NAME = "pequenos-cuidados-v7";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./bienvenida.html",
    "./cuidador.html",
    "./editar-cuidador.html",
    "./home.html",
    "./medicaciones.html",
    "./misturnos.html",
    "./peques.html",
    "./perfil.html",
    "./privacidad.html",
    "./vacunas.html",
    "./manifest.json",
    "./css/estilos.css",
    "./js/app.js"
];

self.addEventListener("install", event => { 
 
     self.skipWaiting(); 
 
     event.waitUntil( 
        caches.open(CACHE_NAME).then(cache => { 
            return cache.addAll(ARCHIVOS); 
        }) 
    ); 
}); 


self.addEventListener("activate", event => {

    event.waitUntil(
        clients.claim()
    );

});


self.addEventListener("fetch", event => { 
    event.respondWith( 
        caches.match(event.request).then(respuesta => { 
            return respuesta || fetch(event.request); 
        }) 
    ); 
});


self.addEventListener("push", event => {
    let datos = {
        titulo: "🌈 Pequeños Cuidados",
        mensaje: "¡Tenés un nuevo aviso!"
    };

    if (event.data) {
        try {
            datos = {
                ...datos,
                ...event.data.json()
            };
        } catch (error) {
            datos.mensaje = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(
            datos.titulo || "🌈 Pequeños Cuidados",
            {
                body: datos.mensaje || "Tenés un nuevo aviso.",
                tag: "pequenos-cuidados"
            }
        )
    );
});

self.addEventListener("notificationclick", event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then(ventanas => {
            for (const ventana of ventanas) {
                if ("focus" in ventana) {
                    return ventana.focus();
                }
            }

            return clients.openWindow("./");
        })
    );
});
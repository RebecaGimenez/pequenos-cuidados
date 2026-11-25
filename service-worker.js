const CACHE_NAME = "pequenos-cuidados-v14";

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
        caches.keys().then(claves => {
            return Promise.all(
                claves.filter(clave => clave !== CACHE_NAME).map(clave => caches.delete(clave))
            );
        }).then(() => clients.claim())
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
                icon: "./icon-192.png",
                badge: "./icon-192.png",
                // Cada aviso con su propia etiqueta: así el de un peque no tapa al de otro
                tag: datos.id || ("aviso-" + Date.now()),
                data: { url: urlDelAviso(datos) },
                renotify: true,
                vibrate: [200, 100, 200, 100, 300],
                requireInteraction: true
            }
        )
    );


});

// 🧭 Averiguar a qué pantalla y a qué peque lleva cada aviso
function urlDelAviso(datos) {
    if (datos.url) return datos.url;
    const titulo = datos.titulo || "";
    let pagina = "./home.html";
    if (datos.tipo === "medicacion" || titulo.includes("Medicación")) pagina = "./medicaciones.html";
    else if (datos.tipo === "turno" || titulo.includes("Turno")) pagina = "./misturnos.html";
    else if (datos.tipo === "vacuna" || titulo.includes("Vacuna")) pagina = "./vacunas.html";
    // Si el aviso no trae el peque, se saca del título: "💊 Medicación de Benja"
    const peque = datos.peque || (titulo.match(/ de (.+)$/) || [])[1];
    return peque ? pagina + "?peque=" + encodeURIComponent(peque.trim()) : pagina;
}

self.addEventListener("notificationclick", event => {
    event.notification.close();
    const destino = new URL(
        (event.notification.data && event.notification.data.url) || "./home.html",
        self.registration.scope
    ).href;

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(async ventanas => {
            for (const ventana of ventanas) {
                if ("navigate" in ventana) {
                    try {
                        const abierta = await ventana.navigate(destino);
                        if (abierta) return abierta.focus();
                    } catch (e) { /* si no se puede, abrimos una nueva */ }
                }
            }
            return clients.openWindow(destino);
        })
    );
});
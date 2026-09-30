
const CACHE_NAME = "pequenos-cuidados-v3";

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

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(respuesta => {
            return respuesta || fetch(event.request);
        })
    );
});
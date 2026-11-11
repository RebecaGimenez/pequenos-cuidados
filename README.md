# 🌈 Pequeños Cuidados — PWA de Salud y Acompañamiento Pediátrico

> Aplicación web progresiva (PWA) *Offline-First* diseñada para simplificar y coordinar el seguimiento de tratamientos médicos, vacunación y turnos de las infancias, pensada especialmente para familias y cuidadores.

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue.svg)](https://rebecagimenez.github.io/pequenos-cuidados/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-yellow.svg)]()
[![Service Worker](https://img.shields.io/badge/Service%20Worker-Offline%20First-success.svg)]()
[![i18n](https://img.shields.io/badge/i18n-ES%20%7C%20EN%20%7C%20PT-orange.svg)]()

---

## 📱 Demostración en vivo
- **App Web / PWA:** [rebecagimenez.github.io/pequenos-cuidados](https://rebecagimenez.github.io/pequenos-cuidados/)

---

## ✨ Características Principales

- **Gestión Multiperfil:** Soporte para múltiples infantes con espacios de almacenamiento y seguimiento clínico aislados.
- **Tratamientos Flexibles:**
  - *Simples:* Dosificación fija por cantidad de días.
  - *Progresivos:* Modulación en etapas con cambio de frecuencia y dosis (ej. corticoides, descensos paulatinos).
  - *Continuos:* Para condiciones crónicas sin fecha de fin preestablecida.
- **Notificaciones Push Automatizadas:** Avisos de tomas con anticipación (5 minutos antes de cada dosis), turnos y vacunas mediante la **Web Push API** y suscripciones VAPID cifradas.
- **Generación Dinámica de Tarjetas (Canvas API):** Creación *client-side* en tiempo real de tarjetas gráficas para compartir dosis y cronogramas por WhatsApp mediante la **Web Share API**.
- **Soporte Multilingüe (i18n):** Interfaz y tarjetas dinámicas en 3 idiomas: Español, Inglés y Portugués.
- **Funcionamiento 100% Offline:** Arquitectura Service Worker *Cache-First* que permite consultar y operar la app sin conexión a internet.
- **Privacidad por Diseño (*Privacy First*):** Los registros de salud permanecen cifrados localmente en el dispositivo del usuario, sin exposición a bases de datos de terceros.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | HTML5 Semántico, CSS3 Moderno (Custom Properties, Flexbox, Grid), Vanilla JavaScript (ES6+) |
| **PWA & Offline** | Service Workers API, Web App Manifest, Cache Storage API |
| **Notificaciones** | Web Push API, Push Manager, VAPID Keys, Cloudflare Workers |
| **Gráficos & Compartir** | HTML5 Canvas API (dibujo vectorial y tipográfico en tiempo real), Web Share API |
| **Almacenamiento** | LocalStorage con serialización de estructuras complejas y scoped keys por perfil |

---

## 📐 Decisiones Técnicas Destacadas

### 1. Generación de Tarjetas en Canvas sin librerías externas
Para evitar dependencias pesadas y optimizar los tiempos de carga en dispositivos móviles, se implementó un motor de renderizado vectorial nativo con la **HTML5 Canvas API**. Este procesa dinámicamente las próximas 3 tomas calculando diferencias temporales (`HOY` / `MAÑANA` / fecha) y genera un `Blob` de imagen de alta resolución compatible con el selector nativo de WhatsApp.

### 2. Algoritmo de tomas progresivas con protección de ciclo infinito
El cálculo de horarios sucesivos para tratamientos con etapas dinámicas o frecuencias moduladas incluye validaciones estrictas de tipo y guardas de seguridad contra recursión infinita en casos de desfase horario prolongado.

### 3. Estrategia de Caché y Ciclo de Vida del Service Worker
El Service Worker implementa una estrategia con `skipWaiting()` y recolección de versiones obsoletas en el evento `activate`, garantizando que las actualizaciones de la aplicación se sincronicen en los dispositivos sin requerir borrado manual de datos por parte del usuario.

---

## 🚀 Instalación y Ejecución Local

Para clonar y correr el proyecto en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/RebecaGimenez/pequenos-cuidados.git

# 2. Ingresar a la carpeta
cd pequenos-cuidados

# 3. Levantar con Live Server o cualquier servidor HTTP estático
# Ejemplo con Python:
python -m http.server 8080

Abrir en el navegador en http://localhost:8080


👩‍💻 Autora
Rebeca Giménez
Estudiante de Licenciatura en Informática

GitHub: @RebecaGimenez
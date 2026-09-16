
function obtenerIdioma() {

return localStorage.getItem("idiomaApp") || "es";

}

let rolActivo = localStorage.getItem("rolActivo") || "Mamá";
let pequeActivo = localStorage.getItem("pequeActivo") || "";
let idiomaApp = obtenerIdioma();

// ==========================================
// 1. INICIALIZADOR GENERAL DE PANTALLAS (CON MEMORIA SEPARADA POR HIJO)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const btnRol = document.getElementById("boton-rol-activo");
    if (btnRol) {
        let rolTraducido = rolActivo;
        const rolMinus = rolActivo.toLowerCase();
        if (idiomaApp === "en") {
            if (rolMinus === "mamá" || rolMinus === "mami") rolTraducido = "Mommy";
            else if (rolMinus === "papá" || rolMinus === "papi") rolTraducido = "Daddy";
        } else if (idiomaApp === "pt") {
            if (rolMinus === "mamá" || rolMinus === "mami") rolTraducido = "Mamãe";
            else if (rolMinus === "papá" || rolMinus === "papi") rolTraducido = "Papai";
        }
        btnRol.innerText = `🖐 ${rolTraducido}`;
    }

    // 🌟 SECCIÓN CLAVE: Si hay peques creados, forzamos que el primero esté activo por defecto si no hay ninguno seleccionado
    let listaPeques = JSON.parse(localStorage.getItem("listaPeques")) || [];
    if (listaPeques.length > 0 && !pequeActivo) {
        pequeActivo = listaPeques[0].nombre;
        localStorage.setItem("pequeActivo", pequeActivo);
    } else if (listaPeques.length === 0) {
        pequeActivo = "";
        localStorage.setItem("pequeActivo", "");
    }

    if (document.getElementById("contenedor-solapas-peques")) {
        dibujarSolapasPeques();
    }

    // 💊 MEDICACIÓN INDEPENDIENTE
    if (document.getElementById("lista-bloques-remedios")) {
        try { agregarBloqueRemedioHtml(); actualizarListaVisual(); } catch(e) { console.log(e); }
    }
    
    // 📅 TURNOS INDEPENDIENTES
    if (document.getElementById("lista-bloques-turnos")) {
        try { 
            agregarBloqueTurnoHtml(); 
            actualizarListaTurnosVisual(); 
            const formTurno = document.getElementById("form-turno");
            if (formTurno) {
                const btnSave = document.getElementById("btn-turno-guardar") || formTurno.querySelector("button[onclick*='guardarTodosLosTurnos']");
                if (btnSave) {
                    btnSave.type = "button";
                    btnSave.onclick = (e) => { e.preventDefault(); guardarTodosLosTurnos(); };
                }
            }
        } catch(e) { console.log(e); }
    }

    // 💉 VACUNAS INDEPENDIENTES
    if (document.getElementById("lista-bloques-vacunas")) {
        try { 
            agregarBloqueVacunaHtml(); 
            actualizarListaVacunasVisual(); 
            const formVacuna = document.getElementById("form-vacuna");
            if (formVacuna) {
                const btnSave = document.getElementById("btn-vacuna-guardar") || formVacuna.querySelector("button[onclick*='guardarTodasLasVacunas']");
                if (btnSave) {
                    btnSave.type = "button";
                    btnSave.onclick = (e) => { e.preventDefault(); guardarTodasLasVacunas(); };
                }
            }
        } catch(e) { console.log(e); }
    }

    if (document.getElementById("form-perfil")) {

       document.getElementById("form-perfil").addEventListener("submit", (e) => {
            e.preventDefault();
            guardarPerfilPeque();
        });
        
        cargarPequeParaEditar();
    }


    traducirTodaLaAplicacion();
    actualizarMensajeBienvenida();
    mostrarListaPeques();
});
// ==========================================
// 2. NAVEGACIÓN, LÓGICA DEL CUIDADOR Y SALUDOS
// ==========================================
function irA(pagina) {
    window.location.href = pagina;
}

function activarEdicionRol() {
    const contenedor = document.getElementById("contenedor-cuidador");
    const inputOculto = document.getElementById("input-rol-oculto");
    const cartel = contenedor?.querySelector(".cartelito-invitacion-rol");

    if (!contenedor || !inputOculto) return;

    // Mostrar el cartelito
    if (cartel) {
        cartel.classList.add("mostrar");
    }

    // Esperar 2 segundos antes de abrir el input
    setTimeout(() => {

        if (cartel) cartel.classList.remove("mostrar");

        contenedor.classList.add("editando");
        inputOculto.value = rolActivo;
        inputOculto.focus();
        inputOculto.select();
    }, 2000);
}

function guardarRolDesdeInput(valor) {
    const contenedor = document.getElementById("contenedor-cuidador");
    if (!contenedor) return;

    if (valor.trim() === "") {
        contenedor.classList.remove("editando");
        return;
    }

    rolActivo = valor.trim();
    localStorage.setItem("rolActivo", rolActivo);

    const idioma = obtenerIdioma();
    let rolTraducido = rolActivo;
    const rolMinus = rolActivo.toLowerCase();

    if (idioma === "en") {
        if (rolMinus === "mamá" || rolMinus === "mami") rolTraducido = "Mommy";
        else if (rolMinus === "papá" || rolMinus === "papi") rolTraducido = "Daddy";
    } else if (idioma === "pt") {
        if (rolMinus === "mamá" || rolMinus === "mami") rolTraducido = "Mamãe";
        else if (rolMinus === "papá" || rolMinus === "papi") rolTraducido = "Papai";
    }

    document.getElementById("boton-rol-activo").innerText = `🖐 ${rolTraducido}`;
    contenedor.classList.remove("editando");
    actualizarMensajeBienvenida();
}

function actualizarMensajeBienvenida() {
    const titulo = document.getElementById("frase-aliento");
    if (!titulo) return;

    const idioma = obtenerIdioma();

    let saludoBase = "";
    const rolMinuscula = rolActivo.toLowerCase();

    if (idioma === "en") {
        if (rolMinuscula === "mamá" || rolMinuscula === "mami") saludoBase = "⭐ Hi mommy!";
        else if (rolMinuscula === "papá" || rolMinuscula === "papi") saludoBase = "⚡ Hi daddy!";
        else saludoBase = `👋 Hi ${rolActivo}!`;

        if (pequeActivo)
            titulo.innerText = `${saludoBase} What are we doing today with ${pequeActivo}? 😊`;
        else
            titulo.innerText = `${saludoBase} What are we doing today? 😊`;

    } else if (idioma === "pt") {

        if (rolMinuscula === "mamá" || rolMinuscula === "mami") saludoBase = "⭐ Olá mamãe!";
        else if (rolMinuscula === "papá" || rolMinuscula === "papi") saludoBase = "⚡ Olá papai!";
        else saludoBase = `👋 Olá ${rolActivo}!`;

        if (pequeActivo)
            titulo.innerText = `${saludoBase} O que vamos fazer hoje com ${pequeActivo}? 😊`;
        else
            titulo.innerText = `${saludoBase} O que vamos fazer hoje? 😊`;

    } else {

        if (rolMinuscula === "mamá" || rolMinuscula === "mami") saludoBase = "⭐ ¡Hola mami!";
        else if (rolMinuscula === "papá" || rolMinuscula === "papi") saludoBase = "⚡ ¡Hola papá!";
        else saludoBase = `👋 ¡Hola ${rolActivo}!`;

        if (pequeActivo)
            titulo.innerText = `${saludoBase} ¿Qué hacemos hoy con ${pequeActivo}? 😊`;
        else
            titulo.innerText = `${saludoBase} ¿Qué hacemos hoy? 😊`;
    }
}

// ==========================================
// 3. DICCIONARIO TRILINGÜE DE LA APLICACIÓN
// ==========================================
const diccionarioTraducciones = {

   es: {
    "nube-med": "Medicación 💊",
    "nube-tur": "Turnos 📅",
    "nube-vac": "Vacunas 💉",

    "invitacion-rol": "¿Con quién estoy hablando hoy? 👀",
    "invitacion-peque": "¡Agregá a tu peque! 🧸",
    "bienvenida-titulo": "🌈 Bienvenidos a Pequeños Cuidados",
    "bienvenida-saludo": "🧡Nos alegra acompañarlos💚",
    "bienvenida-organizar": "💙Ayudamos a organizar los cuidados de tu peque para que puedan dedicar su tiempo a lo más importante:",
    "bienvenida-ustedes": "ustedes.",
    "bienvenida-tratamientos": "💛Cada tratamiento, cada vacuna y cada turno estarán organizados para acompañarlos durante todo el tiempo que lo necesiten 🤎",
    "bienvenida-comenzamos": "¿Comenzamos?",

    "cuidador-titulo": "🖐 ¡Contanos quién va a acompañar al peque!",
    "cuidador-subtitulo": "Elegí la opción que mejor te represente.",
    "cuidador-nombre-label": "¿Cómo querés que te llamemos?",
    "cuidador-nombre-placeholder": "Ej: Mamá, Laura, Abu Ana",
    "cuidador-siguiente": "Siguiente →",
    "cuidador-mama": "💜 Mamá",
    "cuidador-papa": "💙 Papá",
    "cuidador-abuela": "💛 Abuela",
    "cuidador-abuelo": "💚 Abuelo",
    "cuidador-tia": "💖 Tía",


    "btn-volver": "⬅️ Volver al menú",

    "titulo-med": "Agregá los medicamentos de tu peque 💉",
    "label-med-nom": "Nombre del medicamento 💊",
    "place-med-nom": "P. ej., Paracetamol",
    "label-med-dos": "Dosis 💉",
    "place-med-dos": "P. ej., 10 gotas",
    "label-med-fre": "¿Cada cuántas horas? ⏳",
    "place-med-fre": "P. ej., 8",
    "label-med-dia": "¿Durante cuántos días? 📅",
    "place-med-dia": "P. ej., 7",
    "label-med-ini": "Hora de inicio ⏰",
    "btn-med-add": "➕ Agregar medicamento",
    "btn-med-save": "🌟 Guardar medicamento",
    "th-med-nom": "Nombre del medicamento",
    "th-med-dos": "Dosis",
    "th-med-fre": "Frecuencia",
    "th-med-pro": "Próxima dosis",
    "th-med-acc": "Acción",
    "historial-med": "Registro de medicamentos 📋",

    "titulo-tur": "Los próximos turnos de tu peque 📅",
    "label-tur-med": "¿Médico o especialista? 👩‍⚕️",
    "place-tur-med": "P. ej., Pediatra, Dentista",
    "label-tur-fec": "¿Qué día es? 🗓️",
    "label-tur-hor": "¿A qué hora? ⏰",
    "label-tur-lug": "¿Dónde es el turno? 🏥",
    "place-tur-lug": "P. ej., Clínica Sol",
    "btn-tur-add": "➕ Agregar turno",
    "btn-tur-save": "🌟 Guardar turnos",
    "th-tur-med": "Médico / Especialista",
    "th-tur-fec": "Fecha",
    "th-tur-hor": "Hora",
    "th-tur-lug": "Lugar",
    "th-tur-acc": "Acción",
    "historial-tur": "Turnos programados 📋",

    "titulo-vac": "Las vacunas de tu peque 💉",
    "label-vac-nom": "Nombre de la vacuna 💉",
    "place-vac-nom": "P. ej., Gripe, Sarampión",
    "label-vac-fec": "Fecha de aplicación 🗓️",
    "label-vac-pro": "Fecha de la próxima dosis 🕒",
    "btn-vac-add": "➕ Agregar vacuna",
    "btn-vac-save": "🌟 Guardar vacunas",
    "th-vac-nom": "Nombre de la vacuna",
    "th-vac-fec": "Fecha de aplicación",
    "th-vac-pro": "Próxima dosis",
    "th-vac-acc": "Acción",
    "historial-vac": "Registro de vacunas 📋",

    "titulo-per": "¡Te damos la bienvenida! 👶🌈",
    "sub-per": "Ingresá los datos para personalizar el cuidado de tu peque.",
    "label-per-nom": "¿Cómo se llama? 🧸",
    "place-per-nom": "P. ej., Benja, Cati, Sofi",
    "label-per-eda": "¿Qué edad tiene? 🗓️",
    "place-per-eda": "P. ej., 8 meses, 2 años",
    "label-per-pes": "¿Peso actual? (en kg) ⚖️",
    "place-per-pes": "P. ej., 12.5",
    "label-per-alt": "¿Altura actual? (en cm) 📏",
    "place-per-alt": "P. ej., 85",
    "btn-per-save": "✨ Crear Perfil Arcoíris 🌈",
    "historial-per": "Peques registrados 📋",
    "th-per-nom": "Nombre",
    "th-per-dat": "Edad / Peso / Altura",
    "th-per-acc": "Acción",

"titulo-privacidad": "🔒 Política de Privacidad",
"privacidad-1": "En Pequeños Cuidados, la seguridad de tu familia es lo primero. 🧸",
"privacidad-2": "Queremos que te quedes totalmente tranquila/o: esta aplicación no recolecta ni envía datos.",
"privacidad-3": "Todos los datos se guardan en tu dispositivo usando LocalStorage.",
"privacidad-4": "Al usar esta app aceptás este entorno seguro creado con cariño. ❤️",

},

    en: {
        "nube-med": "Medication 💊", "nube-tur": "Appointments 📅", "nube-vac": "Vaccines 💉",
        "invitacion-rol": "Who am I talking to today? 👀",
        "invitacion-peque": "Add your child! 🧸",
        "bienvenida-titulo": "🌈 Welcome to Pequeños Cuidados",
        "bienvenida-saludo": "🧡We are happy to accompany you💚",
        "bienvenida-organizar": "💙We help organize your child's care so you can dedicate your time to what matters most:",
        "bienvenida-ustedes": "you.",
        "bienvenida-tratamientos": "💛Every treatment, vaccine and appointment will be organized to support you for as long as you need it 🤎",
        "bienvenida-comenzamos": "Shall we begin?",

        "cuidador-titulo": "🖐 Tell us who will be caring for your child!",
        "cuidador-subtitulo": "Choose the option that best represents you.",
        "cuidador-nombre-label": "What would you like us to call you?",
        "cuidador-nombre-placeholder": "E.g.: Mom, Laura, Grandma Ana",
        "cuidador-siguiente": "Next →",

        "cuidador-mama": "💜 Mommy",
        "cuidador-papa": "💙 Daddy",
        "cuidador-abuela": "💛 Grandma",
        "cuidador-abuelo": "💚 Grandpa",
        "cuidador-tia": "💖 Aunt",

        "btn-volver": "⬅️ Back to Menu",
        "titulo-med": "Your child's medication 💉",
        "label-med-nom": "Medication Name 💊", "place-med-nom": "E.g., Paracetamol",
        "label-med-dos": "Dose 💉", "place-med-dos": "E.g., 10 drops",
        "label-med-fre": "Every how many hours? ⏳", "place-med-fre": "E.g., 8",
        "label-med-dia": "For how many days? 📅", "place-med-dia": "E.g., 7",
        "label-med-ini": "Start time ⏰",
        "btn-med-add": "➕ Add Medication", "btn-med-save": "🌟 Save Medication",
        "th-med-nom": "Medication Name", "th-med-dos": "Dose", "th-med-fre": "Frequency", "th-med-pro": "Next Dose", "th-med-acc": "Action",
        "historial-med": "Medication log 📋",
        "titulo-tur": "Your child's upcoming appointments 📅",
        "label-tur-med": "Doctor or specialist? 👩‍⚕️", "place-tur-med": "E.g., Pediatrician, Dentist",
        "label-tur-fec": "What day is it? 🗓️", "label-tur-hor": "At what time? ⏰",
        "label-tur-lug": "Where is the appointment? 🏥", "place-tur-lug": "E.g., Sun Clinic",
        "btn-tur-add": "➕ Add Appointment", "btn-tur-save": "🌟 Save Appointments",
        "th-tur-med": "Doctor / Specialist", "th-tur-fec": "Date", "th-tur-hor": "Time", "th-tur-lug": "Location", "th-tur-acc": "Action",
        "historial-tur": "Scheduled appointments 📋",
        "titulo-vac": "Your child's vaccines 💉",
        "label-vac-nom": "Vaccine name 💉", "place-vac-nom": "E.g., Flu, Measles",
        "label-vac-fec": "Date given 🗓️", "label-vac-pro": "Next dose date 🕒",
        "btn-vac-add": "➕ Add Vaccine", "btn-vac-save": "🌟 Save Vaccines",
        "th-vac-nom": "Vaccine Name", "th-vac-fec": "Date Given", "th-vac-pro": "Next Dose", "th-vac-acc": "Action",
        "historial-vac": "Vaccine record 📋",
        "titulo-per": "Welcome! 👶🌈", "sub-per": "Enter data to personalize your child's care.",
        "label-per-nom": "What's their name? 🧸", "place-per-nom": "E.g., Benja, Cati, Sofi",
        "label-per-eda": "How old are they? 🗓️", "place-per-eda": "E.g., 8 months, 2 years",
        "label-per-pes": "Current weight? (in kg) ⚖️", "place-per-pes": "E.g., 12.5",
        "label-per-alt": "Current height? (in cm) 📏", "place-per-alt": "E.g., 85",
        "btn-per-save": "✨ Create Rainbow Profile 🌈",
        "historial-per": "Registered children 📋", "th-per-nom": "Name", "th-per-dat": "Age / Weight / Height", "th-per-acc": "Action",

       "titulo-privacidad": "🔒 Privacy Policy",
"privacidad-1": "In Pequeños Cuidados, your family's safety comes first. 🧸",
"privacidad-2": "We do not collect or send any personal data.",
"privacidad-3": "All data is stored locally on your device using LocalStorage.",
"privacidad-4": "By using this app you accept this safe environment. ❤️",
        
    },
    pt: {
        "nube-med": "Medicação 💊", "nube-tur": "Consultas 📅", "nube-vac": "Vacinas 💉",
        "invitacion-rol": "Com quem estou falando hoje? 👀",
        "invitacion-peque": "Adicione seu bebê! 🧸",
        "bienvenida-titulo": "🌈 Bem-vindos ao Pequeños Cuidados",
        "bienvenida-saludo": "🧡Estamos felizes em acompanhar vocês💚",
        "bienvenida-organizar": "💙Ajudamos a organizar os cuidados do seu bebê para que possam dedicar seu tempo ao que realmente importa:",
        "bienvenida-ustedes": "vocês.",
        "bienvenida-tratamientos": "💛Cada tratamento, cada vacina e cada consulta estarão organizados para acompanhar vocês durante todo o tempo que precisarem 🤎",
        "bienvenida-comenzamos": "Vamos começar?",

        "cuidador-titulo": "🖐 Conte-nos quem vai acompanhar o bebê!",
        "cuidador-subtitulo": "Escolha a opção que melhor representa você.",
        "cuidador-nombre-label": "Como você quer que chamemos você?",
        "cuidador-nombre-placeholder": "Ex.: Mamãe, Laura, Vovó Ana",
        "cuidador-siguiente": "Próximo →", 
          
        "cuidador-mama": "💜 Mamãe",
        "cuidador-papa": "💙 Papai",
        "cuidador-abuela": "💛 Vovó",
        "cuidador-abuelo": "💚 Vovô",
        "cuidador-tia": "💖 Tia",

        "btn-volver": "⬅️ Voltar ao Menu",
        "titulo-med": "Medicação do seu bebê 💉",
        "label-med-nom": "Nome do medicamento 💊", "place-med-nom": "Ex: Paracetamol",
        "label-med-dos": "Dose 💉", "place-med-dos": "Ex: 10 gotas",
        "label-med-fre": "A cada quantas horas? ⏳", "place-med-fre": "Ex: 8",
        "label-med-dia": "Por quantos dias? 📅", "place-med-dia": "Ex: 7",
        "label-med-ini": "Hora de início ⏰",
        "btn-med-add": "➕ Adicionar", "btn-med-save": "🌟 Salvar",
        "th-med-nom": "Medicamento", "th-med-dos": "Dose", "th-med-fre": "Frequência", "th-med-pro": "Próxima Dose", "th-med-acc": "Ação",
        "historial-med": "Histórico de medicação 📋",
        "titulo-tur": "Próximas consultas do seu bebê 📅",
        "label-tur-med": "Médico ou especialista? 👩‍⚕️", "place-tur-med": "Ex: Pediatra, Dentista",
        "label-tur-fec": "Que dia é? 🗓️", "label-tur-hor": "A que horas? ⏰",
        "label-tur-lug": "Onde é a consulta? 🏥", "place-tur-lug": "Ex: Clínica Sol",
        "btn-tur-add": "➕ Adicionar Consulta", "btn-tur-save": "🌟 Salvar Consultas",
        "th-tur-med": "Médico / Especialista", "th-tur-fec": "Data", "th-tur-hor": "Hora", "th-tur-lug": "Local", "th-tur-acc": "Ação",
        "historial-tur": "Consultas agendadas 📋",
        "titulo-vac": "Vacinas do seu bebê 💉",
        "label-vac-nom": "Nome da vacina 💉", "place-vac-nom": "Ex: Gripe, Tríplice",
        "label-vac-fec": "Data de aplicação 🗓️", "label-vac-pro": "Próxima aplicação 🕒",
        "btn-vac-add": "➕ Adicionar Vacina", "btn-vac-save": "🌟 Salvar Vacinas",
        "th-vac-nom": "Vacina", "th-vac-fec": "Data Aplicada", "th-vac-pro": "Próxima Dose", "th-vac-acc": "Ação",
        "historial-vac": "Histórico de vacinas 📋",
        "titulo-per": "Bem-vindo! 👶🌈", "sub-per": "Insira os dados para personalizar os cuidados do seu bebê.",
        "label-per-nom": "Como ele se chama? 🧸", "place-per-nom": "Ex: Benja, Cati, Sofi",
        "label-per-eda": "Qual é a idade dele? 🗓️", "place-per-eda": "Ex: 8 meses, 2 anos",
        "label-per-pes": "Peso atual? (em kg) ⚖️", "place-per-pes": "Ex: 12.5",
        "label-per-alt": "Altura atual? (em cm) 📏", "place-per-alt": "Ex: 85",
        "btn-per-save": "✨ Criar Perfil Arco-Íris 🌈",
        "historial-per": "Bebês registrados 📋", "th-per-nom": "Nome", "th-per-dat": "Idade / Peso / Altura", "th-per-acc": "Ação",

         "titulo-privacidad": "🔒 Política de Privacidade",
"privacidad-1": "No Pequeños Cuidados, a segurança da sua família é prioridade. 🧸",
"privacidad-2": "Não coletamos nem enviamos dados pessoais.",
"privacidad-3": "Todos os dados ficam salvos localmente no seu dispositivo.",
"privacidad-4": "Ao usar este app você aceita este ambiente seguro. ❤️",


    }
};

// ==========================================
// 4. MOTOR DE TRADUCCIÓN INTEGRAL EN VIVO
// ==========================================

function traducirTodaLaAplicacion() {
    const idiomaApp = obtenerIdioma();

    if (idiomaApp === "es") return;

    const idioma = diccionarioTraducciones[idiomaApp];
    if (!idioma) return;

    // =========================
    // BARRA SUPERIOR
    // =========================
    const nubeMed = document.getElementById("nube-medicacion");
    if (nubeMed) nubeMed.innerText = idioma["nube-med"];

    const nubeTur = document.getElementById("nube-turnos");
    if (nubeTur) nubeTur.innerText = idioma["nube-tur"];

    const nubeVac = document.getElementById("nube-vacunas");
    if (nubeVac) nubeVac.innerText = idioma["nube-vac"];

    const cartelRol = document.querySelector(".cartelito-invitacion-rol");
    if (cartelRol) cartelRol.innerText = idioma["invitacion-rol"];

    const cartelPeque = document.querySelector(".cartelito-invitacion");
    if (cartelPeque) cartelPeque.innerText = idioma["invitacion-peque"];

    const inputSol = document.getElementById("input-rol-oculto");
    if (inputSol) {
        inputSol.placeholder =
            idiomaApp === "en" ? "Who are you?"
            : idiomaApp === "pt" ? "Quem é você?"
            : "¿Quién sos?";
    }

    const btnVolver = document.querySelector(".btn-volver");
    if (btnVolver) btnVolver.innerText = idioma["btn-volver"];


   // =========================
   // 🌈 BIENVENIDA
   // =========================
 if (document.getElementById("bienvenida-titulo")) {

    const titulo = document.getElementById("bienvenida-titulo");
    const saludo = document.getElementById("bienvenida-saludo");
    const organizar = document.getElementById("bienvenida-organizar");
    const ustedes = document.getElementById("bienvenida-ustedes");
    const tratamientos = document.getElementById("bienvenida-tratamientos");
    const comenzamos = document.getElementById("btn-comenzamos");

    if (titulo) titulo.innerText = idioma["bienvenida-titulo"];
    if (saludo) saludo.innerText = idioma["bienvenida-saludo"];
    if (organizar) organizar.innerText = idioma["bienvenida-organizar"];
    if (ustedes) ustedes.innerText = idioma["bienvenida-ustedes"];
    if (tratamientos) tratamientos.innerText = idioma["bienvenida-tratamientos"];
    if (comenzamos) comenzamos.innerText = idioma["bienvenida-comenzamos"];
 }
      

      // =========================
      // 🖐 CUIDADOR
      // =========================
   if (document.getElementById("cuidador-titulo")) {

    const titulo = document.getElementById("cuidador-titulo");
    const subtitulo = document.getElementById("cuidador-subtitulo");
    const label = document.getElementById("cuidador-nombre-label");
    const input = document.getElementById("nombre-cuidador");
    const siguiente = document.getElementById("btn-cuidador-siguiente");

    if (titulo) titulo.innerText = idioma["cuidador-titulo"];
    if (subtitulo) subtitulo.innerText = idioma["cuidador-subtitulo"];
    if (label) label.innerText = idioma["cuidador-nombre-label"];

    if (input) {
        input.placeholder = idioma["cuidador-nombre-placeholder"];
    }

    if (siguiente) siguiente.innerText = idioma["cuidador-siguiente"];
   }
    const mama = document.getElementById("cuidador-mama");
    const papa = document.getElementById("cuidador-papa");
    const abuela = document.getElementById("cuidador-abuela");
    const abuelo = document.getElementById("cuidador-abuelo");
    const tia = document.getElementById("cuidador-tia");

    if (mama) mama.innerText = idioma["cuidador-mama"];
    if (papa) papa.innerText = idioma["cuidador-papa"];
    if (abuela) abuela.innerText = idioma["cuidador-abuela"];
    if (abuelo) abuelo.innerText = idioma["cuidador-abuelo"];
    if (tia) tia.innerText = idioma["cuidador-tia"];

    const enlacePrivacidad = document.querySelector(".enlace-privacidad-menu");
    if (enlacePrivacidad) {
        enlacePrivacidad.innerText =
            idiomaApp === "en"
                ? "🔒 Privacy Policy"
                : idiomaApp === "pt"
                ? "🔒 Política de Privacidade"
                : "🔒 Política de Privacidad";
    }

    // =========================
    // MEDICACIÓN
    // =========================
    if (document.getElementById("lista-bloques-remedios")) {
        const tit = document.querySelector(".titulo-tarjeta");
        if (tit) tit.innerText = idioma["titulo-med"];

        const h2 = document.querySelector(".contenedor-lista h2");
        if (h2) h2.innerText = idioma["historial-med"];

        const btns = document.querySelectorAll(".mis-botones-arcoiris button");
        if (btns.length >= 2) {
            btns[0].innerText = idioma["btn-med-add"];
            btns[1].innerText = idioma["btn-med-save"];
        }
    }

    // =========================
    // TURNOS
    // =========================
    if (document.getElementById("lista-bloques-turnos")) {
        const tit = document.getElementById("titulo-turnos-card");
        if (tit) tit.innerText = idioma["titulo-tur"];

        const h2 = document.querySelector(".contenedor-lista h2");
        if (h2) h2.innerText = idioma["historial-tur"];

        const btns = document.querySelectorAll(".mis-botones-arcoiris button");
        if (btns.length >= 2) {
            btns[0].innerText = idioma["btn-tur-add"];
            btns[1].innerText = idioma["btn-tur-save"];
        }
    }

    // =========================
    // VACUNAS
    // =========================
    if (document.getElementById("lista-bloques-vacunas")) {
        const tit = document.getElementById("titulo-vacunas-card");
        if (tit) tit.innerText = idioma["titulo-vac"];

        const h2 = document.querySelector(".contenedor-lista h2");
        if (h2) h2.innerText = idioma["historial-vac"];

        const btns = document.querySelectorAll(".mis-botones-arcoiris button");
        if (btns.length >= 2) {
            btns[0].innerText = idioma["btn-vac-add"];
            btns[1].innerText = idioma["btn-vac-save"];
        }
    }

    // =========================
    // 👶 FORMULARIO PEQUE
    // =========================
    if (document.getElementById("form-perfil")) {
        const tit = document.querySelector(".titulo-tarjeta");
        if (tit) tit.innerText = idioma["titulo-per"];

        const sub = document.querySelector(".subtitulo-perfil");
        if (sub) sub.innerText = idioma["sub-per"];

        const labels = {
            "nombre-peque": "label-per-nom",
            "edad-peque": "label-per-eda",
            "peso-peque": "label-per-pes",
            "altura-peque": "label-per-alt"
        };

        Object.keys(labels).forEach(id => {
            const el = document.querySelector(`label[for='${id}']`);
            if (el) el.innerText = idioma[labels[id]];
        });

        const inputs = {
            "nombre-peque": "place-per-nom",
            "edad-peque": "place-per-eda",
            "peso-peque": "place-per-pes",
            "altura-peque": "place-per-alt"
        };

        Object.keys(inputs).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.placeholder = idioma[inputs[id]];
        });

        const btn = document.querySelector("#form-perfil .btn-guardar-todo");
        if (btn) btn.innerText = idioma["btn-per-save"];
    }

// =========================
// 🔒 PRIVACIDAD
// =========================
if (document.querySelector(".contenedor-privacidad")) {
    const tit = document.getElementById("titulo-privacidad");
    if (tit) tit.innerText =
        idiomaApp === "en" ? "Privacy Policy 🔒"
        : idiomaApp === "pt" ? "Política de Privacidade 🔒"
        : "Política de Privacidad 🔒";

    const p1 = document.getElementById("privacidad-1");
    const p2 = document.getElementById("privacidad-2");
    const p3 = document.getElementById("privacidad-3");
    const p4 = document.getElementById("privacidad-4");

    if (p1) p1.innerHTML =
        idiomaApp === "en"
            ? "<strong>At Pequeños Cuidados, your family’s safety comes first. 🧸❤️</strong>"
            : idiomaApp === "pt"
            ? "<strong>No Pequeños Cuidados, a segurança da sua família vem primeiro. 🧸❤️</strong>"
            : p1.innerHTML;

    if (p2) p2.innerHTML =
        idiomaApp === "en"
            ? "We do not collect, share or send any data about your kids, medications, appointments or vaccines. 💙"
            : idiomaApp === "pt"
            ? "Não coletamos, compartilhamos ou enviamos dados sobre seus filhos, medicamentos, consultas ou vacinas. 💙"
            : p2.innerHTML;

    if (p3) p3.innerHTML =
        idiomaApp === "en"
            ? "All data is stored only on your device using LocalStorage. 🔐"
            : idiomaApp === "pt"
            ? "Todos os dados ficam armazenados apenas no seu dispositivo usando LocalStorage. 🔐"
            : p3.innerHTML;

    if (p4) p4.innerHTML =
        idiomaApp === "en"
            ? "A safe space created with love to take care of what matters most. ❤️"
            : idiomaApp === "pt"
            ? "Um espaço seguro criado com amor para cuidar de quem você ama. ❤️"
            : p4.innerHTML;
    }
}

// ==========================================
// 5. SOLAPAS DE PEQUES Y LOGICA DE MEDICACIONES
// ==========================================
function dibujarSolapasPeques() {
    const contenedor = document.getElementById("contenedor-solapas-peques");
    const listaPeques = JSON.parse(localStorage.getItem("listaPeques")) || [];
    if (!contenedor) return;
    contenedor.innerHTML = "";
    if (listaPeques.length === 0) {
        contenedor.innerHTML = `<span class="cartelito-invitacion">Agregá a tu peque 🧸</span>`;
        return;
    }
    listaPeques.forEach(peque => {
        const boton = document.createElement("button");
        boton.className = "solapa-peque";
        boton.innerText = peque.nombre;
        boton.style.backgroundColor = peque.colorFondo;
        boton.style.color = peque.colorTexto;
        if (peque.nombre === pequeActivo) boton.classList.add("activa");
               // 🌟 LOGRADO: Al hacer clic, guardamos al nene activo y limpiamos/refrescamos las tres tablas al vuelo
        boton.onclick = () => {
            pequeActivo = peque.nombre;
            localStorage.setItem("pequeActivo", pequeActivo);
            dibujarSolapasPeques();
            actualizarMensajeBienvenida();
            
            // Si el usuario está navegando adentro de los formularios, fuerza a las grillas a mostrar los datos del nuevo hijo
            if (document.getElementById("lista-bloques-remedios")) actualizarListaVisual();
            if (document.getElementById("lista-bloques-turnos")) actualizarListaTurnosVisual();
            if (document.getElementById("lista-bloques-vacunas")) actualizarListaVacunasVisual();
        };

        contenedor.appendChild(boton);
    });
}
function agregarBloqueRemedioHtml() {
    const contenedor = document.getElementById("lista-bloques-remedios");
    if (!contenedor) return;

    const idUnico = Date.now();
    const cantidadBloques = contenedor.children.length;

    const divBloque = document.createElement("div");

    divBloque.className = "bloque-remedio-dinamico";
    divBloque.id = `bloque-${idUnico}`;

    let nom = "Nombre del medicamento 💊";
    let dos = "Dosis 💉";
    let tipo = "Tipo de tratamiento 🔄";
    let simple = "💊 Tratamiento simple";
    let progresivo = "🔄 Tratamiento progresivo";
    let continuo = "♾️ Tratamiento continuo";
    let fre = "¿Cada cuántas horas? ⏳";
    let dia = "¿Por cuántos días? 📅";
    let ini = "Hora de inicio ⏰";

    let pNom = "Ej: Paracetamol";
    let pDos = "Ej: 10 gotas";
    let pFre = "Ej: 8";
    let pDia = "Ej: 7";

    if (idiomaApp === "en") {

        const idioma = diccionarioTraducciones.en;

        nom = idioma["label-med-nom"];
        dos = idioma["label-med-dos"];
        fre = idioma["label-med-fre"];
        dia = idioma["label-med-dia"];
        ini = idioma["label-med-ini"];

        pNom = idioma["place-med-nom"];
        pDos = idioma["place-med-dos"];
        pFre = idioma["place-med-fre"];
        pDia = idioma["place-med-dia"];

    } else if (idiomaApp === "pt") {

        const idioma = diccionarioTraducciones.pt;

        nom = idioma["label-med-nom"];
        dos = idioma["label-med-dos"];
        fre = idioma["label-med-fre"];
        dia = idioma["label-med-dia"];
        ini = idioma["label-med-ini"];

        pNom = idioma["place-med-nom"];
        pDos = idioma["place-med-dos"];
        pFre = idioma["place-med-fre"];
        pDia = idioma["place-med-dia"];
    }

    divBloque.innerHTML = `

        ${cantidadBloques > 0 
            ? `<button 
                type="button" 
                class="btn-eliminar-bloque" 
                onclick="eliminarBloqueRemedio(${idUnico})">
                🗑️
            </button>` 
            : ''
        }

        <div class="grupo-campo">
            <label>${nom}</label>
            <input 
                type="text" 
                class="input-arcoiris input-remedio" 
                placeholder="${pNom}" 
                required>
        </div>

        <div class="grupo-campo">
            <label>${dos}</label>
            <input 
                type="text" 
                class="input-arcoiris input-dosis" 
                placeholder="${pDos}" 
                required>
        </div>

        <div class="grupo-campo">
            <label>${tipo}</label>

            <select 
                class="input-arcoiris input-tipo-tratamiento"
                onchange="cambiarTipoTratamiento(this, ${idUnico})">

                <option value="simple">
                    ${simple}
                </option>

                <option value="progresivo">
                    ${progresivo}
                </option>

                <option value="continuo">
                    ${continuo}
                </option>

            </select>
        </div>

        <div id="campos-tratamiento-${idUnico}">

            <div class="grupo-campo">
                <label>${fre}</label>

                <input 
                    type="number" 
                    class="input-arcoiris input-frecuencia" 
                    min="1" 
                    max="24" 
                    placeholder="${pFre}" 
                    required>
            </div>

            <div class="grupo-campo">
                <label>${dia}</label>

                <input 
                    type="number" 
                    class="input-arcoiris input-dias" 
                    min="1" 
                    max="365" 
                    placeholder="${pDia}" 
                    required>
            </div>

            <div class="grupo-campo">
                <label>${ini}</label>

                <input 
                    type="time" 
                    class="input-arcoiris input-hora" 
                    required>
            </div>

        </div>

    `;

    contenedor.appendChild(divBloque);
}

function cambiarTipoTratamiento(select, idUnico) {

    const contenedor = document.getElementById(`campos-tratamiento-${idUnico}`);

    if (!contenedor) return;

    const tipoSeleccionado = select.value;

    // 💊 TRATAMIENTO SIMPLE
    if (tipoSeleccionado === "simple") {

        contenedor.innerHTML = `
            <div class="grupo-campo">
                <label>¿Cada cuántas horas? ⏳</label>

                <input 
                    type="number" 
                    class="input-arcoiris input-frecuencia" 
                    min="1" 
                    max="24" 
                    placeholder="Ej: 8" 
                    required>
            </div>

            <div class="grupo-campo">
                <label>¿Por cuántos días? 📅</label>

                <input 
                    type="number" 
                    class="input-arcoiris input-dias" 
                    min="1" 
                    max="365" 
                    placeholder="Ej: 7" 
                    required>
            </div>

            <div class="grupo-campo">
                <label>Hora de inicio ⏰</label>

                <input 
                    type="time" 
                    class="input-arcoiris input-hora" 
                    required>
            </div>
        `;

    }

    // 🔄 TRATAMIENTO PROGRESIVO
    else if (tipoSeleccionado === "progresivo") {

        contenedor.innerHTML = `

            <div class="grupo-campo">
                <label>Hora de inicio ⏰</label>

                <input 
                    type="time" 
                    class="input-arcoiris input-hora" 
                    required>
            </div>

            <div class="etapas-tratamiento" id="etapas-${idUnico}">

                <div class="etapa-tratamiento">

                    <h4>🔄 Etapa 1</h4>

                    <div class="grupo-campo">
                        <label>¿Cada cuántas horas? ⏳</label>

                        <input 
                            type="number" 
                            class="input-arcoiris input-frecuencia-etapa" 
                            min="1" 
                            max="24" 
                            placeholder="Ej: 4" 
                            required>
                    </div>

                    <div class="grupo-campo">
                        <label>¿Por cuántos días? 📅</label>

                        <input 
                            type="number" 
                            class="input-arcoiris input-dias-etapa" 
                            min="1" 
                            max="365" 
                            placeholder="Ej: 2" 
                            required>
                    </div>

                </div>

            </div>

            <button 
                type="button" 
                class="btn-agregar-arcoiris"
                onclick="agregarEtapaTratamiento(${idUnico})">

                ➕ Agregar etapa

            </button>

        `;

    }

    // ♾️ TRATAMIENTO CONTINUO
    else if (tipoSeleccionado === "continuo") {

        contenedor.innerHTML = `

            <div class="grupo-campo">
                <label>¿Cada cuántas horas? ⏳</label>

                <input 
                    type="number" 
                    class="input-arcoiris input-frecuencia" 
                    min="1" 
                    max="24" 
                    placeholder="Ej: 8" 
                    required>
            </div>

            <div class="grupo-campo">
                <label>Hora de inicio ⏰</label>

                <input 
                    type="time" 
                    class="input-arcoiris input-hora" 
                    required>
            </div>

            <p class="mensaje-tratamiento-continuo">
                ♾️ Este tratamiento no tiene una fecha de finalización.
                Pequeños Cuidados te ayudará a recordar cada toma.
            </p>

        `;

    }

}

function agregarEtapaTratamiento(idUnico) {

    const contenedorEtapas = document.getElementById(`etapas-${idUnico}`);

    if (!contenedorEtapas) return;

    const cantidadEtapas = contenedorEtapas.querySelectorAll(".etapa-tratamiento").length;

    // 🔒 Máximo 10 etapas
    if (cantidadEtapas >= 10) {
        alert("⚠️ El tratamiento puede tener un máximo de 10 etapas.");
        return;
    }

    const numeroEtapa = cantidadEtapas + 1;

    const nuevaEtapa = document.createElement("div");

    nuevaEtapa.className = "etapa-tratamiento";

    nuevaEtapa.innerHTML = `

       <div class="encabezado-etapa">

            <h4>🔄 Etapa ${numeroEtapa}</h4>

               <button 
                     type="button"
                     class="btn-eliminar-etapa"
                     onclick="eliminarEtapaTratamiento(this)"
                     style="margin-left: auto;">
                       🗑️
                 </button>

         </div>

        <div class="grupo-campo">

            <label>¿Cada cuántas horas? ⏳</label>

            <input 
                type="number"
                class="input-arcoiris input-frecuencia-etapa"
                min="1"
                max="24"
                placeholder="Ej: 6"
                required>

        </div>

        <div class="grupo-campo">

            <label>¿Por cuántos días? 📅</label>

            <input 
                type="number"
                class="input-arcoiris input-dias-etapa"
                min="1"
                max="365"
                placeholder="Ej: 2"
                required>

        </div>

    `;

    contenedorEtapas.appendChild(nuevaEtapa);

    // 🔢 Actualizamos los números de las etapas
    actualizarNumerosEtapas(contenedorEtapas);
}


function eliminarEtapaTratamiento(boton) {

    const etapa = boton.closest(".etapa-tratamiento");

    if (!etapa) return;

    etapa.remove();

    // 🔢 Volvemos a numerar las etapas
    const contenedorEtapas = etapa.parentElement;

    actualizarNumerosEtapas(contenedorEtapas);
}


function actualizarNumerosEtapas(contenedorEtapas) {

    const etapas = contenedorEtapas.querySelectorAll(".etapa-tratamiento");

    etapas.forEach((etapa, indice) => {

        const titulo = etapa.querySelector("h4");

        if (titulo) {
            titulo.innerText = `🔄 Etapa ${indice + 1}`;
        }

    });

}

function eliminarBloqueRemedio(id) {

    const bloque = document.getElementById(`bloque-${id}`);

    if (bloque) {
        bloque.remove();
    }
}
// ==========================================
// 6. LÓGICA DE MEDICACIONES MÚLTIPLES (CON FIRMA DE PERFIL ÚNICO)
// ==========================================
function guardarTodasLasMedicaciones() {

    // 👶 Debe existir un peque activo
    if (!pequeActivo) {
        alert(
            idiomaApp === "en"
                ? "⚠️ Please create or select a child profile first!"
                : idiomaApp === "pt"
                    ? "⚠️ Por favor, crie ou selecione o perfil de um bebê primeiro!"
                    : "⚠️ ¡Por favor, crea o selecciona el perfil de un peque primero antes de guardar!"
        );
        return;
    }

    const bloques = document.querySelectorAll(
        "#lista-bloques-remedios .bloque-remedio-dinamico"
    );

    if (bloques.length === 0) {
        alert("⚠️ No hay ninguna medicación para guardar.");
        return;
    }

    // 👶 Cada peque tiene su propia lista
    const claveHistorial = pequeActivo + "_medicaciones";

    // 📦 Recuperamos TODO lo que ya estaba guardado
    const medicacionesAnteriores =
        JSON.parse(localStorage.getItem(claveHistorial)) || [];

    // 🆕 Creamos una lista temporal para las nuevas medicaciones
    const nuevasMedicaciones = [];

    let errores = false;

    bloques.forEach(bloque => {

        const remedio =
            bloque.querySelector(".input-remedio")?.value.trim();

        const dosis =
            bloque.querySelector(".input-dosis")?.value.trim();

        const tipoTratamiento =
            bloque.querySelector(".input-tipo-tratamiento")?.value;

        const horaInicio =
            bloque.querySelector(".input-hora")?.value;


        // Datos básicos obligatorios
        if (!remedio || !dosis || !tipoTratamiento || !horaInicio) {
            errores = true;
            return;
        }


        // 💊 TRATAMIENTO SIMPLE
        if (tipoTratamiento === "simple") {

            const frecuencia =
                bloque.querySelector(".input-frecuencia")?.value;

            const dias =
                bloque.querySelector(".input-dias")?.value;


            if (!frecuencia || !dias) {
                errores = true;
                return;
            }


            nuevasMedicaciones.push({

                id: crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now() + Math.random(),

                remedio: remedio,

                dosis: dosis,

                tipoTratamiento: "simple",

                frecuenciaHoras: parseInt(frecuencia),

                diasDuracion: parseInt(dias),

                horaInicio: horaInicio

            });

        }


        // 🔄 TRATAMIENTO PROGRESIVO
        else if (tipoTratamiento === "progresivo") {

            const etapas =
                bloque.querySelectorAll(".etapa-tratamiento");


            const listaEtapas = [];


            etapas.forEach(etapa => {

                const frecuencia =
                    etapa.querySelector(".input-frecuencia-etapa")?.value;

                const dias =
                    etapa.querySelector(".input-dias-etapa")?.value;


                if (!frecuencia || !dias) {
                    errores = true;
                    return;
                }


                listaEtapas.push({

                    frecuenciaHoras:
                        parseInt(frecuencia),

                    diasDuracion:
                        parseInt(dias)

                });

            });


            if (listaEtapas.length === 0) {
                errores = true;
                return;
            }


            nuevasMedicaciones.push({

                id: crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now() + Math.random(),

                remedio: remedio,

                dosis: dosis,

                tipoTratamiento: "progresivo",

                horaInicio: horaInicio,

                etapas: listaEtapas

            });

        }


        // ♾️ TRATAMIENTO CONTINUO
        else if (tipoTratamiento === "continuo") {

            const frecuencia =
                bloque.querySelector(".input-frecuencia")?.value;


            if (!frecuencia) {
                errores = true;
                return;
            }


            nuevasMedicaciones.push({

                id: crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now() + Math.random(),

                remedio: remedio,

                dosis: dosis,

                tipoTratamiento: "continuo",

                frecuenciaHoras:
                    parseInt(frecuencia),

                horaInicio: horaInicio

            });

        }

    });


    // 🛑 Si alguna medicación está incompleta,
    // NO modificamos lo que ya estaba guardado
    if (errores) {

        alert(
            idiomaApp === "en"
                ? "⚠️ Please complete all required fields."
                : idiomaApp === "pt"
                    ? "⚠️ Por favor, preencha todos os campos obrigatórios."
                    : "⚠️ Por favor, completa todos los campos obligatorios."
        );

        return;
    }


    // 💾 MUY IMPORTANTE:
    // Conservamos las medicaciones anteriores
    // y agregamos las nuevas
    const listaFinal =
        [...medicacionesAnteriores, ...nuevasMedicaciones];


    // 👶 Guardamos todo en la bolsa del peque activo
    localStorage.setItem(
        claveHistorial,
        JSON.stringify(listaFinal)
    );


    // 💟 MENSAJE
    if (idiomaApp === "en") {

        alert(
            `✨ Medication saved for ${pequeActivo}!\n\n` +
            `💟 Pequeños Cuidados is here to accompany you throughout the time you need us.\n\n` +
            `💪 You've got this! 🤗`
        );

    } else if (idiomaApp === "pt") {

        alert(
            `✨ Medicação salva para ${pequeActivo}!\n\n` +
            `💟 Pequeños Cuidados está aqui para acompanhar você durante todo o tempo que precisar.\n\n` +
            `💪 Você consegue! 🤗`
        );

    } else {

        alert(
            `✨ ¡Medicación guardada para ${pequeActivo}!\n\n` +
            `💟 Pequeños Cuidados está para acompañarlos durante todo el tiempo que nos necesiten.\n\n` +
            `💪 ¡Vamos juntos! 🤗`
        );

    }


    // 🧹 Limpiamos los formularios
    const listaBloques =
        document.getElementById("lista-bloques-remedios");

    if (listaBloques) {

        listaBloques.innerHTML = "";

        agregarBloqueRemedioHtml();

    }


    // 🔄 Actualizamos la visualización
    actualizarListaVisual();
}

function actualizarListaVisual() {

    const claveHistorial = pequeActivo + "_medicaciones";

    const lista = pequeActivo
        ? (JSON.parse(localStorage.getItem(claveHistorial)) || [])
        : [];

    const contenedorLista =
        document.getElementById("contenedor-lista-medicaciones");

    const contenedorTarjetas =
        document.getElementById("contenedor-tarjetas-medicaciones");

    if (!contenedorLista || !contenedorTarjetas) return;

    // Si no hay medicamentos, ocultamos la sección
    if (lista.length === 0) {

        contenedorLista.style.display = "none";

        return;
    }

    // Mostramos la sección
    contenedorLista.style.display = "block";

    // Limpiamos las tarjetas anteriores
    contenedorTarjetas.innerHTML = "";


    // Creamos una tarjeta por cada medicación
    lista.forEach(item => {

        let textoTipo = "";
        let textoFrecuencia = "";


        // 💊 TRATAMIENTO SIMPLE
        if (item.tipoTratamiento === "simple") {

            textoTipo = "💊 Tratamiento simple";

            textoFrecuencia =
                `Cada ${item.frecuenciaHoras} horas`;

        }


        // 🔄 TRATAMIENTO PROGRESIVO
        else if (item.tipoTratamiento === "progresivo") {

            textoTipo = "🔄 Tratamiento progresivo";

            textoFrecuencia =
                item.etapas
                    .map(
                        (etapa, indice) =>
                            `Etapa ${indice + 1}: cada ${etapa.frecuenciaHoras} horas durante ${etapa.diasDuracion} días`
                    )
                    .join("<br><br>");

        }


        // ♾️ TRATAMIENTO CONTINUO
        else if (item.tipoTratamiento === "continuo") {

            textoTipo = "♾️ Tratamiento continuo";

            textoFrecuencia =
                `Cada ${item.frecuenciaHoras} horas`;

        }


        // 🃏 Creamos la tarjeta
        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "tarjeta-medicacion";


        tarjeta.innerHTML = `

            <div class="encabezado-tarjeta-medicacion">

                <h3>
                    💊 ${item.remedio}
                </h3>

            </div>


            <div class="contenido-tarjeta-medicacion">

                <p>
                    <strong>💉 Dosis:</strong>
                    ${item.dosis}
                </p>

                <p>
                    <strong>📋 Tratamiento:</strong>
                    ${textoTipo}
                </p>

                <p>
                    <strong>⏰ Frecuencia:</strong><br>
                    ${textoFrecuencia}
                </p>

                <p>
                    <strong>🔔 Hora de inicio:</strong>
                    ${item.horaInicio}
                </p>

            </div>


            <div class="acciones-tarjeta-medicacion">

                <button
                    type="button"
                    class="btn-borrar-tarjeta"
                    onclick="eliminarMedicionGuardada('${item.id}')">

                    🗑️ Eliminar

                </button>

            </div>

        `;


        contenedorTarjetas.appendChild(tarjeta);

    });

}

function eliminarMedicionGuardada(id) {

    const claveHistorial =
        pequeActivo + "_medicaciones";

    let lista =
        JSON.parse(localStorage.getItem(claveHistorial)) || 
        
        [];


    lista =
        lista.filter(item => String (item.id) !== 
        String(id));


    localStorage.setItem(
        claveHistorial,
        JSON.stringify(lista)
    );


    actualizarListaVisual();

}

function actualizarListaVacunasVisual() {
    const claveHistorial = pequeActivo + "_vacunas";
    const lista = pequeActivo ? (JSON.parse(localStorage.getItem(claveHistorial)) || []) : [];
    const contenedorLista = document.getElementById("contenedor-lista-vacunas");
    const cuerpoTabla = document.getElementById("contenedor-tarjeta-vacunas");
    if (!contenedorLista || !cuerpoTabla) return;
    if (lista.length === 0) { contenedorLista.style.display = "none"; return; }
    
    contenedorLista.style.display = "block"; 
    cuerpoTabla.innerHTML = "";
    
    lista.forEach(item => {
      
        const fechaFormateada = item.fecha.split("-").reverse().join("/");
        const proximaFormateada = item.proxima.split("-").reverse().join("/");
        
       const tarjeta = document.createElement("div");

             tarjeta.className = "tarjeta-medicacion";

             tarjeta.innerHTML = `

            <div class="encabezado-tarjeta-medicacion">

              <h3>💉 ${item.nombre}</h3>

               </div>

            <div class="contenido-tarjeta-medicacion">

              <p><strong>📅 Aplicada:</strong> ${fechaFormateada}</p>

             <p><strong>🔔 Próxima:</strong> ${proximaFormateada}</p>

             </div>

         <div class="acciones-tarjeta-medicacion">

    <button
        class="btn-borrar-tarjeta"
        onclick="eliminarVacunaGuardada(${item.id})">

        🗑️ Eliminar

    </button>

</div>

`;

    cuerpoTabla.appendChild(tarjeta);
   
    });

}

function actualizarListaTurnosVisual() {
    const claveHistorial = pequeActivo + "_turnos";
    const lista = pequeActivo ? (JSON.parse(localStorage.getItem(claveHistorial)) || []) : [];
    const contenedorLista = document.getElementById("contenedor-lista-turnos");
    const cuerpoTabla = 
     document.getElementById("contenedor-tarjeta-turnos");

     if (!contenedorLista || !cuerpoTabla) return;
     if (lista.length === 0) { contenedorLista.style.display = "none"; return; }
    
     contenedorLista.style.display = "block"; 
     cuerpoTabla.innerHTML = "";
    
     lista.forEach(item => {
        
    const fechaFormateada = item.fecha.split("-").reverse().join("/");
    const tarjeta = document.createElement("div");

     tarjeta.className = "tarjeta-medicacion";
     tarjeta.innerHTML = `

<div class="encabezado-tarjeta-medicacion">

    <h3>📅 ${item.medico}</h3>

</div>

<div class="contenido-tarjeta-medicacion">

    <p><strong>📅 Fecha:</strong> ${fechaFormateada}</p>

    <p><strong>🕒 Hora:</strong> ${item.hora}</p>

    <p><strong>📍 Lugar:</strong> ${item.lugar}</p>

</div>

<div class="acciones-tarjeta-medicacion">

    <button
        class="btn-borrar-tarjeta"
        onclick="eliminarTurnoGuardado(${item.id})">

        🗑️ Eliminar

    </button>

</div>

`;

  cuerpoTabla.appendChild(tarjeta);

    });
}

function eliminarTurnoGuardado(id) {
    const claveHistorial = pequeActivo + "_turnos";
    let lista = JSON.parse(localStorage.getItem(claveHistorial)) || [];
    lista = lista.filter(item => item.id !== id);
    localStorage.setItem(claveHistorial,
         JSON.stringify(lista));
    actualizarListaTurnosVisual();
}

// ==========================================
// 9. UNIVERSO VACUNAS (COMPLETO, RECUPERADO Y FIRMADO POR HIJO) 💉
// ==========================================
function agregarBloqueVacunaHtml() {
    const contenedor = document.getElementById("lista-bloques-vacunas");
    if (!contenedor) return;
    const idUnico = Date.now();
    const cantidadBloques = contenedor.children.length;
    const divBloque = document.createElement("div");
    divBloque.className = "bloque-remedio-dinamico";
    divBloque.id = `bloque-vacuna-${idUnico}`;
    
    let nom = "Nombre de la vacuna 💉", fec = "Fecha de colocación 🗓️", pro = "Próxima colocación 🕒";
    let pNom = "Ej: Quíntuple, Gripe";
    if (idiomaApp === "en") {
        const idioma = diccionarioTraducciones.en;
        nom = idioma["label-vac-nom"]; fec = idioma["label-vac-fec"]; pro = idioma["label-vac-pro"]; pNom = idioma["place-vac-nom"];
    } else if (idiomaApp === "pt") {
        const idioma = diccionarioTraducciones.pt;
        nom = idioma["label-vac-nom"]; fec = idioma["label-vac-fec"]; pro = idioma["label-vac-pro"]; pNom = idioma["place-vac-nom"];
    }
    divBloque.innerHTML = `
        ${cantidadBloques > 0 ? `<button type="button" class="btn-eliminar-bloque" onclick="eliminarBloqueVacuna(${idUnico})">🗑️</button>` : ''}
        <div class="grupo-campo"><label>${nom}</label><input type="text" class="input-arcoiris input-nombre-vacuna" placeholder="${pNom}" required></div>
        <div class="grupo-campo"><label>${fec}</label><input type="date" class="input-arcoiris input-fecha-vacuna" required></div>
        <div class="grupo-campo"><label>${pro}</label><input type="date" class="input-arcoiris input-proxima-vacuna" required></div>
    `;
    contenedor.appendChild(divBloque);
}

function eliminarBloqueVacuna(id) {
    const bloque = document.getElementById(`bloque-vacuna-${id}`);
    if (bloque) bloque.remove();
}
function guardarTodasLasVacunas() {
    if (!pequeActivo) {
        alert(idiomaApp === "en" ? "⚠️ Please create or select a child profile first!" : "⚠️ ¡Por favor, crea o selecciona el perfil de un peque primero!");
        return;
    }
    const bloques = document.querySelectorAll("#lista-bloques-vacunas .bloque-remedio-dinamico");
    const claveHistorial = pequeActivo + "_vacunas";
    let listaVacunas = JSON.parse(localStorage.getItem(claveHistorial)) || [];
    let errores = false;

    bloques.forEach(bloque => {
        const nombre = bloque.querySelector(".input-nombre-vacuna").value;
        const fecha = bloque.querySelector(".input-fecha-vacuna").value;
        const proxima = bloque.querySelector(".input-proxima-vacuna").value;
        if (!nombre || !fecha || !proxima) { errores = true; return; }
        listaVacunas.push({ id: Date.now() + Math.random(), nombre: nombre, fecha: fecha, proxima: proxima });
    });

    if (errores) { alert("⚠️ Por favor, completa todos los campos de las vacunas."); return; }
    localStorage.setItem(claveHistorial, JSON.stringify(listaVacunas));
    
    // Alertas trilingües calibradas con el aviso de un día antes
    if (idiomaApp === "en") {
        alert(`✨ Vaccines registered for ${pequeActivo}!\n\n📅 We set an automatic reminder one day before the next dose date.\n\n💪 Let's go! 🤗`);
    } else if (idiomaApp === "pt") {
        alert(`✨ Vacinas registradas para ${pequeActivo}!\n\n📅 Agendamos um lembrete automático um dia antes da data da próxima dose.\n\n💪 Vamos lá! 🤗`);
    } else {
        alert(`✨ ¡Vacunas registradas para ${pequeActivo}!\n\n📅 Agendamos un recordatorio automático un día antes de la fecha de la próxima dosis.\n\n💪 ¡Vamos ${rolActivo}! 🤗`);
    } 

    // 🌟 EN SU LUGAR EXACTO: Limpia la tarjeta e inyecta la fila abajo al instante
    const listaBloques = document.getElementById("lista-bloques-vacunas");
    if (listaBloques) { 
        listaBloques.innerHTML = ""; 
        agregarBloqueVacunaHtml(); 
    }
    actualizarListaVacunasVisual();
}



function eliminarVacunaGuardada(id) {
    const claveHistorial = pequeActivo + "_vacunas";
    let lista = JSON.parse(localStorage.getItem(claveHistorial)) || [];
    lista = lista.filter(item => item.id !== id);
    localStorage.setItem(claveHistorial, JSON.stringify(lista));
    actualizarListaVacunasVisual();
}

// ==========================================
// 10. UNIVERSO ALTA DE PERFIL DE PEQUES👶🌈
// ==========================================

function guardarPerfilPeque() {

    const nombre = document.getElementById("nombre-peque").value.trim();
    const edad = document.getElementById("edad-peque").value.trim();
    const peso = document.getElementById("peso-peque").value;
    const altura = document.getElementById("altura-peque").value;

    let listaPeques = JSON.parse(localStorage.getItem("listaPeques")) || [];

    const indiceEditar = 
    localStorage.getItem("pequeEditar");

    console.log("Editando:", indiceEditar);

    // ===========================
    // MODO EDITAR
    // ===========================
    if (indiceEditar !== null) {

        const existe = listaPeques.some((p, i) =>
            i != indiceEditar &&
            p.nombre.toLowerCase() === nombre.toLowerCase()
        );

        if (existe) {
            alert("⚠️ Ese nombre ya está registrado.");
            return;
        }

        listaPeques[indiceEditar] = {
            ...listaPeques[indiceEditar],
            nombre,
            edad,
            peso,
            altura
        };

        localStorage.setItem("listaPeques", JSON.stringify(listaPeques));
        localStorage.removeItem("pequeEditar");

        alert(`✨ ¡Perfil de ${nombre} actualizado!`);

        irA("peques.html");

        return;
    }
    

    // ===========================
    // MODO CREAR
    // ===========================

    const existe = listaPeques.some(
        p => p.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
        alert("⚠️ Ese nombre ya está registrado.");
        return;
    }

    const coloresPastel = [
        "#fbcfe8",
        "#bae6fd",
        "#bbf7d0",
        "#fef08a",
        "#e9d5ff"
    ];

    const colorElegido =
        coloresPastel[listaPeques.length % coloresPastel.length];

    listaPeques.push({
        nombre,
        edad,
        peso,
        altura,
        colorFondo: colorElegido,
        colorTexto: "#1e293b"
    });

    localStorage.setItem("listaPeques", JSON.stringify(listaPeques));

    document.getElementById("form-perfil").reset();

    alert(`✨ ¡Perfil de ${nombre} creado con éxito!`);

    irA("home.html");

    }

function cargarPequeParaEditar() {

    const indiceEditar = localStorage.getItem("pequeEditar");

    if (indiceEditar === null) return;


    const listaPeques = JSON.parse(localStorage.getItem("listaPeques")) || [];

    const peque = listaPeques[indiceEditar];

    if (!peque) return;

    document.getElementById("nombre-peque").value = peque.nombre;
    document.getElementById("edad-peque").value = peque.edad;
    document.getElementById("peso-peque").value = peque.peso;
    document.getElementById("altura-peque").value = peque.altura;

}

function dibujarSolapasPeques() {
    const contenedor = document.getElementById("contenedor-solapas-peques");
    if (!contenedor) return;
    
    const listaPeques = JSON.parse(localStorage.getItem("listaPeques")) || [];
    contenedor.innerHTML = "";
    
    // 🌟 LOGRADO 1: Si no hay nenes creados, el espacio queda totalmente limpio y despejado
    if (listaPeques.length === 0) {
        return;
    }
    
    // Fabricamos cada nubecita de nene con su óvalo de color pastel único
    listaPeques.forEach((peque, index) => {
        const botonNube = document.createElement("button");
        botonNube.className = "solapa-peque";
        botonNube.innerText = `👶 ${peque.nombre}`;
        botonNube.style.backgroundColor = peque.colorFondo;
        botonNube.style.color = peque.colorTexto;
        
        if (peque.nombre === pequeActivo) {
            botonNube.classList.add("activa");
        }
        
        // Al tocar la nubecita de forma normal, la app se activa con su información
        botonNube.onclick = () => {
            pequeActivo = peque.nombre;
            localStorage.setItem("pequeActivo", pequeActivo);
            dibujarSolapasPeques();
            actualizarMensajeBienvenida();
        };

        // 🌟 LOGRADO 2: Sistema de borrado seguro por "Clic Largo" (ideal para pantallas táctiles)
        let tiempoPresionado;
        
        // Cuando empieza a presionar (ya sea con mouse o el dedo en el celu)
        const iniciarPresion = () => {
            tiempoPresionado = setTimeout(() => {
                // Cartel trilingüe dulce para confirmar si se despide al peque de la app
                let pregunta = `¿Quieres despedir el perfil de ${peque.nombre} de la aplicación? 🌈`;
                if (idiomaApp === "en") pregunta = `Do you want to remove ${peque.nombre}'s profile from the app? 🌈`;
                else if (idiomaApp === "pt") pregunta = `Deseja remover o perfil de ${peque.nombre} do aplicativo? 🌈`;

                if (confirm(pregunta)) {
                    eliminarPeque(index); // Ejecuta tu función nativa de borrar
                }
            }, 1500); // 1.5s segundos manteniendo apretado activa el borrado
        };

        // Si suelta antes de tiempo, se cancela el borrado y cuenta como clic normal
        const cancelarPresion = () => {
            clearTimeout(tiempoPresionado);
        };

        // Conectamos los eventos del mouse y del tacto del teléfono
        botonNube.addEventListener("mousedown", iniciarPresion);
        botonNube.addEventListener("mouseup", cancelarPresion);
        botonNube.addEventListener("mouseleave", cancelarPresion);
        
        botonNube.addEventListener("touchstart", iniciarPresion);
        botonNube.addEventListener("touchend", cancelarPresion);
        
        contenedor.appendChild(botonNube);
    });
}

function mostrarListaPeques() {

    const contenedor = document.getElementById("contenedor-lista-peques");

    if (!contenedor) return;

    const listaPeques = JSON.parse(localStorage.getItem("listaPeques")) || [];

    contenedor.innerHTML = "";

    if (listaPeques.length === 0) {

        contenedor.innerHTML = `
            <p class="mensaje-vacio">
                Todavía no hay peques registrados 👶
            </p>
        `;

        return;
    }


    listaPeques.forEach((peque, index) => {

        const tarjeta = document.createElement("div");

       tarjeta.className = `tarjeta-peque-acordeon color-peque-${index % 5}`;


        tarjeta.innerHTML = `

            <div 
                class="encabezado-peque"
                onclick="abrirPeque(${index})">

                <span>
                    👶 ${peque.nombre}
                </span>

                <span id="flecha-${index}">
                    ▼
                </span>

            </div>


            <div 
                class="detalle-peque"
                id="detalle-${index}"
                style="display:none;">

                <p>🗓️ Edad: ${peque.edad}</p>

                <p>⚖️ Peso: ${peque.peso} kg</p>

                <p>📏 Altura: ${peque.altura} cm</p>


                <button
                    class="btn-comenzar-cuidados"
                    onclick="comenzarCuidados('${peque.nombre}')">

                    💚 Comenzar cuidados

                </button>

                <button
                    class="btn-editar-peque"
                    onclick="editarPeque('${index}')">

                    ✏️ Editar perfil

                </button>

                <button
                    class="btn-borrar-peque"
                    onclick="if (confirm('¿Eliminar este peque?🌈')) 
                    eliminarPeque(${index})">

                    🗑️ Eliminar perfil

            </div>

        `;


        contenedor.appendChild(tarjeta);

    });

}

function abrirPeque(index) {

    const detalle = document.getElementById(`detalle-${index}`);
    const flecha = document.getElementById(`flecha-${index}`);

    if (detalle.style.display === "none") {

        detalle.style.display = "block";
        flecha.innerHTML = "▲";

    } else {

        detalle.style.display = "none";
        flecha.innerHTML = "▼";

    }

}

function comenzarCuidados(nombre) {

    pequeActivo = nombre;
    localStorage.setItem("pequeActivo", nombre);
    irA("home.html");
}

function editarPeque(index) {

    localStorage.setItem("pequeEditar", index);

    irA("perfil.html");
}

function seleccionarPeque(nombre) {

    pequeActivo = nombre;

    localStorage.setItem("pequeActivo", nombre);

    irA("home.html");

}

// ==========================================
// ELIMINAR PEQUE
// ==========================================
function eliminarPeque(index) {

    let lista = JSON.parse(localStorage.getItem("listaPeques")) || [];

    const nombreEliminado = lista[index]?.nombre;

    lista.splice(index, 1);

    localStorage.setItem("listaPeques", JSON.stringify(lista));

    // Si borramos el peque activo, seleccionamos otro automáticamente
    if (pequeActivo === nombreEliminado) {

        if (lista.length > 0) {
            pequeActivo = lista[0].nombre;
        } else {
            pequeActivo = "";
        }

        localStorage.setItem("pequeActivo", pequeActivo);
    }

    // Redibujamos la lista si estamos en peques.html
    if (document.getElementById("contenedor-lista-peques")) {
        mostrarListaPeques();
    }

    // Redibujamos las solapas si estamos en home.html
    if (document.getElementById("contenedor-solapas-peques")) {
        dibujarSolapasPeques();
    }

    actualizarMensajeBienvenida();
}

function seleccionarIdioma(codigoIdioma) {
    localStorage.setItem("idiomaApp", codigoIdioma);

    let rolActual = localStorage.getItem("rolActivo") || "Mamá";
    let rMinus = rolActual.toLowerCase();

    if (
        rMinus === "mamá" || rMinus === "mami" || rMinus === "mommy" || rMinus === "mamãe" ||
        rMinus === "papá" || rMinus === "papi" || rMinus === "daddy" || rMinus === "papai"
    ) {
        localStorage.removeItem("rolActivo");
    }

    if (codigoIdioma === "es") {
        alert("✨ ¡Bienvenido! Configurando aplicación... 🥰");
    } else if (codigoIdioma === "en") {
        alert("✨ Welcome! Setting up your app... 🥰");
    } else {
        alert("✨ Bem-vindo! Configurando aplicativo... 🥰");
    }

    window.location.href = "bienvenida.html";
}

// ==========================================
// 12. UNIVERSO TURNOS (COMPLETO, RECUPERADO Y CON CASILLEROS DE CARGA) 📅
// ==========================================
function agregarBloqueTurnoHtml() {
    const contenedor = document.getElementById("lista-blocks-turnos") || document.getElementById("lista-bloques-turnos");
    if (!contenedor) return;
    const idUnico = Date.now();
    const cantidadBloques = contenedor.children.length;
    const divBloque = document.createElement("div");
    divBloque.className = "bloque-remedio-dinamico";
    divBloque.id = `bloque-turno-${idUnico}`;
    
    let med = "¿Médico o especialista? 👩‍⚕️", fec = "¿Qué día es? 🗓️", hor = "¿A qué hora? ⏰", lug = "¿Dónde es la consulta? 🏥";
    let pMed = "Ej: Pediatra, Dentista", pLug = "Ej: Clínica Sol";
    if (idiomaApp === "en") {
        const idioma = diccionarioTraducciones.en;
        med = idioma["label-tur-med"]; fec = idioma["label-tur-fec"]; hor = idioma["label-tur-hor"]; lug = idioma["label-tur-lug"]; pMed = idioma["place-tur-med"]; pLug = idioma["place-tur-lug"];
    } else if (idiomaApp === "pt") {
        const idioma = diccionarioTraducciones.pt;
        med = idioma["label-tur-med"]; fec = idioma["label-tur-fec"]; hor = idioma["label-tur-hor"]; lug = idioma["label-tur-lug"]; pMed = idioma["place-tur-med"]; pLug = idioma["place-tur-lug"];
    }
    
    divBloque.innerHTML = `
        ${cantidadBloques > 0 ? `<button type="button" class="btn-eliminar-bloque" onclick="eliminarBloqueTurno(${idUnico})">🗑️</button>` : ''}
        <div class="grupo-campo"><label>${med}</label><input type="text" class="input-arcoiris input-medico" placeholder="${pMed}" required></div>
        <div class="grupo-campo"><label>${fec}</label><input type="date" class="input-arcoiris input-fecha-turno" required></div>
        <div class="grupo-campo"><label>${hor}</label><input type="time" class="input-arcoiris input-hora-turno" required></div>
        <div class="grupo-campo"><label>${lug}</label><input type="text" class="input-arcoiris input-lugar-turno" placeholder="${pLug}"></div>
    `;
    contenedor.appendChild(divBloque);
}

function eliminarBloqueTurno(id) {
    const bloque = document.getElementById(`bloque-turno-${id}`);
    if (bloque) bloque.remove();
}

function guardarTodosLosTurnos() {

    if (!pequeActivo) {
        alert(idiomaApp === "en" ? "⚠️ Please create or select a child profile first!" : "⚠️ ¡Por favor, crea o selecciona el perfil de un peque primero!");
        return;
    }
    const contenedor = document.getElementById("lista-blocks-turnos") ||
     document.getElementById("lista-bloques-turnos");
    if (!contenedor) return;
    const bloques = contenedor.querySelectorAll(".bloque-remedio-dinamico");
    const claveHistorial = pequeActivo + "_turnos";
    let listaTurnos = JSON.parse(localStorage.getItem(claveHistorial)) || [];
    let errores = false;

    bloques.forEach(bloque => {
        const medico = bloque.querySelector(".input-medico").value;
        const fecha = bloque.querySelector(".input-fecha-turno").value;
        const hora = bloque.querySelector(".input-hora-turno").value;
        const lugar = bloque.querySelector(".input-lugar-turno").value || "No especificado";
        if (!medico || !fecha || !hora) { errores = true; return; }
        listaTurnos.push({ id: Date.now() + Math.random(), medico: medico, fecha: fecha, hora: hora, lugar: lugar });
    });

    if (errores) { alert("⚠️ Por favor, completa los campos obligatorios."); 
        return;
     }

      console.log(listaTurnos);

    localStorage.setItem(claveHistorial,
         JSON.stringify(listaTurnos));
    
    // Alerta trilingüe para Turnos (Aviso un día antes de la cita)
    if (idiomaApp === "en") {
        alert(`✨ Appointments scheduled for ${pequeActivo}!\n\n📅 We set an automatic reminder one day before the visit.\n\n💪 Let's go! 🤗`);
    } else if (idiomaApp === "pt") {
        alert(`✨ Consultas agendadas para ${pequeActivo}!\n\n📅 Agendamos um lembrete automático um dia antes da consulta.\n\n💪 Vamos lá! 🤗`);
    } else {
        alert(`✨ ¡Turnos agendados para ${pequeActivo}!\n\n📅 Programamos un recordatorio automático un día antes de la visita médica.\n\n💪 ¡Vamos ${rolActivo}! 🤗`);
    }

    // 🌟 EN SU LUGAR EXACTO: Limpia la tarjeta de turnos e inyecta la fila abajo al instante
    if (contenedor) { 
        contenedor.innerHTML = ""; 
        agregarBloqueTurnoHtml(); 
    }
    actualizarListaTurnosVisual();
}



        document.addEventListener('DOMContentLoaded', () => {
    traducirTodaLaAplicacion();
});

// 🔒 PRIVACIDAD
const tituloPriv = document.getElementById("titulo-privacidad");
if (tituloPriv) tituloPriv.innerText = idioma["titulo-privacidad"];

const priv1 = document.getElementById("privacidad-1");
if (priv1) priv1.innerText = idioma["privacidad-1"];

const priv2 = document.getElementById("privacidad-2");
if (priv2) priv2.innerText = idioma["privacidad-2"];

const priv3 = document.getElementById("privacidad-3");
if (priv3) priv3.innerText = idioma["privacidad-3"];

const priv4 = document.getElementById("privacidad-4");
if (priv4) priv4.innerText = idioma["privacidad-4"];


// 🌈 Traducción automática por data-i18n (MUY IMPORTANTE)
document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (idioma[key]) {
        el.innerText = idioma[key];
    }
});

function mostrarConfiguracionInicial() {

    const contenedor =
        document.getElementById("contenedor-configuracion");

    contenedor.innerHTML = `

        <hr>

        <h3>🖐 ¿Cómo querés que te llamemos?📳</h3>

        <input
            type="text"
            class="input-arcoiris"
            placeholder="Ej: Mamá">

        <h3>😊 ¿Cómo se llama tu peque?🧸</h3>

        <input
            type="text"
            class="input-arcoiris"
            placeholder="Nombre del peque">

        <br><br>

        <button
            class="btn-guardar-todo">

            Continuar

        </button>

    `;

}

function seleccionarCuidador(nombre) {

    const input = document.getElementById("nombre-cuidador");

    if (!input || nombre === "") return;

    let nombreTraducido = nombre;

    if (idiomaApp === "en") {

        if (nombre === "Mamá") nombreTraducido = "Mommy";
        else if (nombre === "Papá") nombreTraducido = "Daddy";
        else if (nombre === "Abuela") nombreTraducido = "Grandma";
        else if (nombre === "Abuelo") nombreTraducido = "Grandpa";
        else if (nombre === "Tía") nombreTraducido = "Aunt";

    } else if (idiomaApp === "pt") {

        if (nombre === "Mamá") nombreTraducido = "Mamãe";
        else if (nombre === "Papá") nombreTraducido = "Papai";
        else if (nombre === "Abuela") nombreTraducido = "Vovó";
        else if (nombre === "Abuelo") nombreTraducido = "Vovô";
        else if (nombre === "Tía") nombreTraducido = "Tia";
    }

    input.value = nombreTraducido;
}

function guardarCuidadorYContinuar() {

    const input = document.getElementById("nombre-cuidador");

    if (!input) return;

    const nombreCuidador = input.value.trim();

    if (!nombreCuidador) {
        alert("💜 Por favor, contanos cómo querés que te llamemos.");
        input.focus();
        return;
    }

    // Guardamos el cuidador elegido
    localStorage.setItem("rolActivo", nombreCuidador);

    // Pasamos a la pantalla del peque
    window.location.href = "perfil.html";
}


function cambiarIdioma() {
    localStorage.removeItem("idiomaApp");
    irA("index.html");
}


function agregarReceta() {
    const opciones =
     document.getElementById("opciones-receta");

    if (opciones.style.display === "none") {
        opciones.style.display = "block";   
        }
        else {
        opciones.style.display = "none";
    }

}

function escanearRecetas() {
    document.getElementById("foto-receta").click();
}    

function procesarFotoReceta(input) {
    if (input.files || input.files.length === 0) return;
    const archivo = input.files[0];
    const lector = new FileReader();
    lector.onload = function(e) {
        const recetas=
        JSON.parse(localStorage.getItem("recetas")) || [];
        
        recetas.push({
            fecha: new Date().toLocaleDateString(),
            imagen: e.target.result,
            estado: "pendiente de clasificar"
        });
        
        localStorage.setItem(
            "recetas",
             JSON.stringify(recetas)
            );
            MostrarRecetas();
            alert("receta guardada correctamente");
    };
            lector.readAsDataURL(archivo);
  
}
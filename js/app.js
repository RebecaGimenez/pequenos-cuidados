
function obtenerIdioma() {
    return localStorage.getItem("idioma") || "es";
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
        actualizarListaPequesVisual();
        document.getElementById("form-perfil").addEventListener("submit", (e) => {
            e.preventDefault();
            guardarPerfilPeque();
        });
    }

    traducirTodaLaAplicacion();
    actualizarMensajeBienvenida();
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
    if (contenedor && inputOculto) {
        contenedor.classList.add("editando");
        inputOculto.value = rolActivo; 
        inputOculto.focus(); 
        inputOculto.select(); 
    }
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
    
    let rolTraducido = rolActivo;
    const rolMinus = rolActivo.toLowerCase();
    if (idiomaApp === "en") {
        if (rolMinus === "mamá" || rolMinus === "mami") rolTraducido = "Mommy";
        else if (rolMinus === "papá" || rolMinus === "papi") rolTraducido = "Daddy";
    } else if (idiomaApp === "pt") {
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
    let saludoBase = "";
    const rolMinuscula = rolActivo.toLowerCase();

    if (idiomaApp === "en") {
        if (rolMinuscula === "mamá" || rolMinuscula === "mami") saludoBase = `✨ Hi mommy!`;
        else if (rolMinuscula === "papá" || rolMinuscula === "papi") saludoBase = `⚡ Hi daddy!`;
        else saludoBase = `👋 Hi ${rolActivo}!`;
        if (pequeActivo) titulo.innerText = `${saludoBase} What are we doing today with ${pequeActivo}? 😊`;
        else titulo.innerText = `${saludoBase} What are we doing today? 😊`;
    } else if (idiomaApp === "pt") {
        if (rolMinuscula === "mamá" || rolMinuscula === "mami") saludoBase = `✨ Olá mamãe!`;
        else if (rolMinuscula === "papá" || rolMinuscula === "papi") saludoBase = `⚡ Olá papai!`;
        else saludoBase = `👋 Olá ${rolActivo}!`;
        if (pequeActivo) titulo.innerText = `${saludoBase} O que vamos fazer hoje com ${pequeActivo}? 😊`;
        else titulo.innerText = `${saludoBase} O que vamos fazer hoje? 😊`;
    } else {
        if (rolMinuscula === "mamá" || rolMinuscula === "mami") saludoBase = `✨ ¡Hola mami!`;
        else if (rolMinuscula === "papá" || rolMinuscula === "papi") saludoBase = `⚡ ¡Hola papá!`;
        else saludoBase = `👋 ¡Hola ${rolActivo}!`;
        if (pequeActivo) titulo.innerText = `${saludoBase} ¿Qué hacemos hoy con ${pequeActivo}? 😊`;
        else titulo.innerText = `${saludoBase} ¿Qué hacemos hoy? 😊`;
    }
}

// ==========================================
// 3. DICCIONARIO TRILINGÜE DE LA APLICACIÓN
// ==========================================
const diccionarioTraducciones = {
    en: {
        "nube-med": "Medication 💊", "nube-tur": "Appointments 📅", "nube-vac": "Vaccines 💉",
        "invitacion-rol": "Who am I talking to today? 👀", "invitacion-peque": "Add your child! 🧸",
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
        "historial-per": "Registered children 📋", "th-per-nom": "Name", "th-per-dat": "Age / Weight / Height", "th-per-acc": "Action"
    },
    pt: {
        "nube-med": "Medicação 💊", "nube-tur": "Consultas 📅", "nube-vac": "Vacinas 💉",
        "invitacion-rol": "Com quem estou falando hoje? 👀", "invitacion-peque": "Adicione seu bebê! 🧸",
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
        "historial-per": "Bebês registrados 📋", "th-per-nom": "Nome", "th-per-dat": "Idade / Peso / Altura", "th-per-acc": "Ação"
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
        if (idiomaApp === "en") inputSol.placeholder = "Who are you?";
        else if (idiomaApp === "pt") inputSol.placeholder = "Quem é você?";
    }

    const btnVolver = document.querySelector(".btn-volver");
    if (btnVolver) btnVolver.innerText = idioma["btn-volver"];

    const enlacePrivacidad = document.querySelector(".enlace-privacidad-menu");
    if (enlacePrivacidad) {
        enlacePrivacidad.innerText =
            idiomaApp === "en"
                ? "🔒 Privacy Policy"
                : idiomaApp === "pt"
                ? "🔒 Política de Privacidade"
                : "🔒 Política de Privacidad";
    }
}

    // 2. Traducción Modular (Medicación)
    if (document.getElementById("lista-bloques-remedios")) {
        const tit = document.querySelector(".titulo-tarjeta"); if (tit) tit.innerText = idioma["titulo-med"];
        const h2 = document.querySelector(".contenedor-lista h2"); if (h2) h2.innerText = idioma["historial-med"];
        const btns = document.querySelectorAll(".mis-botones-arcoiris button");
        if (btns.length >= 2) {
            btns[0].innerText = idioma["btn-med-add"];
            btns[1].innerText = idioma["btn-med-save"];
        }
    }

    // 3. Traducción Modular (Turnos) - 🌟 CORREGIDO CON ÍNDICES DIRECTOS
    if (document.getElementById("lista-bloques-turnos")) {
        const tit = document.getElementById("titulo-turnos-card") || document.querySelector(".titulo-tarjeta"); 
        if (tit) tit.innerText = idioma["titulo-tur"];
        const h2 = document.querySelector(".contenedor-lista h2"); if (h2) h2.innerText = idioma["historial-tur"];
        const btns = document.querySelectorAll(".mis-botones-arcoiris button");
        if (btns.length >= 2) {
            btns[0].innerText = idioma["btn-tur-add"];
            btns[1].innerText = idioma["btn-tur-save"];
        }
    }

    // 4. Traducción Modular (Vacunas) - 🌟 CORREGIDO CON ÍNDICES DIRECTOS
    if (document.getElementById("lista-bloques-vacunas")) {
        const tit = document.getElementById("titulo-vacunas-card") || document.querySelector(".titulo-tarjeta"); 
        if (tit) tit.innerText = idioma["titulo-vac"];
        const h2 = document.querySelector(".contenedor-lista h2"); if (h2) h2.innerText = idioma["historial-vac"];
        const btns = document.querySelectorAll(".mis-botones-arcoiris button");
        if (btns.length >= 2) {
            btns[0].innerText = idioma["btn-vac-add"];
            btns[1].innerText = idioma["btn-vac-save"];
        }
    }

    // 5. Traducción Modular (Perfil)
    if (document.getElementById("form-perfil")) {
        const tit = document.querySelector(".titulo-tarjeta"); if (tit) tit.innerText = idioma["titulo-per"];
        const sub = document.querySelector(".subtitulo-perfil"); if (sub) sub.innerText = idioma["sub-per"];
        
        const labelNom = document.querySelector("label[for='nombre-peque']"); if (labelNom) labelNom.innerText = idioma["label-per-nom"];
        const labelEda = document.querySelector("label[for='edad-peque']"); if (labelEda) labelEda.innerText = idioma["label-per-eda"];
        const labelPes = document.querySelector("label[for='peso-peque']"); if (labelPes) labelPes.innerText = idioma["label-per-pes"];
        const labelAlt = document.querySelector("label[for='altura-peque']"); if (labelAlt) labelAlt.innerText = idioma["label-per-alt"];

        const inpNom = document.getElementById("nombre-peque"); if (inpNom) inpNom.placeholder = idioma["place-per-nom"];
        const inpEda = document.getElementById("edad-peque"); if (inpEda) inpEda.placeholder = idioma["place-per-eda"];
        const inpPes = document.getElementById("peso-peque"); if (inpPes) inpPes.placeholder = idioma["place-per-pes"];
        const inpAlt = document.getElementById("altura-peque"); if (inpAlt) inpAlt.placeholder = idioma["place-per-alt"];
        
        const btn = document.querySelector("#form-perfil .btn-guardar-todo"); if (btn) btn.innerText = idioma["btn-per-save"];
        const h2 = document.querySelector(".contenedor-lista h2"); if (h2) h2.innerText = idioma["historial-per"];
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
    let nom = "Nombre del medicamento 💊", dos = "Dosis 💉", fre = "¿Cada cuántas horas? ⏳", dia = "¿Por cuántos días? 📅", ini = "Hora de inicio ⏰";
    let pNom = "Ej: Paracetamol", pDos = "Ej: 10 gotas", pFre = "Ej: 8", pDia = "Ej: 7";
    if (idiomaApp === "en") {
        const idioma = diccionarioTraducciones.en;
        nom = idioma["label-med-nom"]; dos = idioma["label-med-dos"]; fre = idioma["label-med-fre"]; dia = idioma["label-med-dia"]; ini = idioma["label-med-ini"];
        pNom = idioma["place-med-nom"]; pDos = idioma["place-med-dos"]; pFre = idioma["place-med-fre"]; pDia = idioma["place-med-dia"];
    } else if (idiomaApp === "pt") {
        const idioma = diccionarioTraducciones.pt;
        nom = idioma["label-med-nom"]; dos = idioma["label-med-dos"]; fre = idioma["label-med-fre"]; dia = idioma["label-med-dia"]; ini = idioma["label-med-ini"];
        pNom = idioma["place-med-nom"]; pDos = idioma["place-med-dos"]; pFre = idioma["place-med-fre"]; pDia = idioma["place-med-dia"];
    }
    divBloque.innerHTML = `
        ${cantidadBloques > 0 ? `<button type="button" class="btn-eliminar-bloque" onclick="eliminarBloqueRemedio(${idUnico})">🗑️</button>` : ''}
        <div class="grupo-campo"><label>${nom}</label><input type="text" class="input-arcoiris input-remedio" placeholder="${pNom}" required></div>
        <div class="grupo-campo"><label>${dos}</label><input type="text" class="input-arcoiris input-dosis" placeholder="${pDos}" required></div>
        <div class="grupo-campo"><label>${fre}</label><input type="number" class="input-arcoiris input-frecuencia" min="1" max="24" placeholder="${pFre}" required></div>
        <div class="grupo-campo"><label>${dia}</label><input type="number" class="input-arcoiris input-dias" min="1" max="30" placeholder="${pDia}" required></div>
        <div class="grupo-campo"><label>${ini}</label><input type="time" class="input-arcoiris input-hora" required></div>
    `;
    contenedor.appendChild(divBloque);
}

function eliminarBloqueRemedio(id) {
    const bloque = document.getElementById(`bloque-${id}`);
    if (bloque) bloque.remove();
}

// ==========================================
// 6. LÓGICA DE MEDICACIONES MÚLTIPLES (CON FIRMA DE PERFIL ÚNICO)
// ==========================================
function guardarTodasLasMedicaciones() {
    // 🌟 CONTROL: Si no hay un nene activo seleccionado, no dejamos guardar datos vacíos
    if (!pequeActivo) {
        alert(idiomaApp === "en" ? "⚠️ Please create or select a child profile first!" : (idiomaApp === "pt" ? "⚠️ Por favor, crie ou selecione o perfil de um bebê primeiro!" : "⚠️ ¡Por favor, crea o selecciona el perfil de un peque primero antes de guardar!"));
        return;
    }

    const bloques = document.querySelectorAll("#lista-bloques-remedios .bloque-remedio-dinamico");
    // 🌟 CLAVE: La bolsa ahora es exclusiva del nene activo (ej: Emma_medicaciones)
    const claveHistorial = pequeActivo + "_medicaciones";
    let listaMedicaciones = JSON.parse(localStorage.getItem(claveHistorial)) || [];
    let errores = false;

    bloques.forEach(bloque => {
        const remedio = bloque.querySelector(".input-remedio").value;
        const dosis = bloque.querySelector(".input-dosis").value;
        const frecuencia = bloque.querySelector(".input-frecuencia").value;
        const dias = bloque.querySelector(".input-dias").value;
        const hora = bloque.querySelector(".input-hora").value;
        if (!remedio || !dosis || !frecuencia || !dias || !hora) { errores = true; return; }
        listaMedicaciones.push({ id: Date.now() + Math.random(), remedio: remedio, dosis: dosis, frecuenciaHoras: parseInt(frecuencia), diasDuracion: parseInt(dias), horaInicio: hora });
    });

    if (errores) { alert("⚠️ Por favor, completa todos los casilleros."); return; }
    localStorage.setItem(claveHistorial, JSON.stringify(listaMedicaciones));
    
    if (idiomaApp === "en") {
        alert(`✨ Medication saved for ${pequeActivo}!\n\n🔔 We will remind you at the exact time of each dose.\n\n💪 Let's go! 🤗`);
    } else if (idiomaApp === "pt") {
        alert(`✨ Medicação salva para ${pequeActivo}!\n\n🔔 Vamos avisar você no horário exato de cada dose.\n\n💪 Vamos lá! 🤗`);
    } else {
        alert(`✨ ¡Medicación guardada para ${pequeActivo}!\n\n🔔 Te vamos a avisar de forma automática al horario exacto de cada dosis.\n\n💪 ¡Vamos ${rolActivo}! 🤗`);
    }

    // 🌟 LOGRADO: Esto es lo que le faltaba a tu código para limpiar la pantalla y dibujar la tabla al instante
    const listaBloques = document.getElementById("lista-bloques-remedios");
    if (listaBloques) { 
        listaBloques.innerHTML = ""; 
        agregarBloqueRemedioHtml(); // Vuelve a fabricar el primer casillero en blanco
    }
    actualizarListaVisual(); // Enciende la fila en la grilla sin salir de la nube
}


function actualizarListaVisual() {
    const claveHistorial = pequeActivo + "_medicaciones";
    const lista = pequeActivo ? (JSON.parse(localStorage.getItem(claveHistorial)) || []) : [];
    const contenedorLista = document.getElementById("contenedor-lista-medicaciones");
    const cuerpoTabla = document.getElementById("tabla-cuerpo-remedios");
    if (!contenedorLista || !cuerpoTabla) return;
    if (lista.length === 0) { contenedorLista.style.display = "none"; return; }
    
    contenedorLista.style.display = "block"; 
    cuerpoTabla.innerHTML = "";
    
    lista.forEach(item => {
        const [h, m] = item.horaInicio.split(":").map(Number);
        
        let proxima = new Date(); proxima.setHours(h, m, 0, 0); 
        let ahora = new Date();
        
        // Calculamos la fecha exacta de vencimiento sumando los días de duración
        let fechaVencimiento = new Date(proxima.getTime());
        fechaVencimiento.setDate(fechaVencimiento.getDate() + item.diasDuracion);
        
        let avisoAlarma = "";
        let claseEstadoAlarma = "";
        
        // CONTROL DE CORTE DE ALARMA: Comparamos si ya superó la fecha de fin
        if (ahora > fechaVencimiento) {
            avisoAlarma = idiomaApp === "en" ? "Finished! 🎉" : (idiomaApp === "pt" ? "Concluído! 🎉" : "¡Terminado! 🎉");
            claseEstadoAlarma = "celda-alarma-terminada"; // 🌟 LOGRADO: Clase pura de CSS verde
        } else {
           if (proxima < ahora) proxima.setHours(proxima.getHours() + item.frecuenciaHoras);
            const horaFormateada = proxima.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            avisoAlarma = horaFormateada;
        claseEstadoAlarma = "celda-alarma-activa";
        }
        
        let textoCada = `Cada ${item.frecuenciaHoras}hs`;
        if (idiomaApp === "en") textoCada = `Every ${item.frecuenciaHoras}hs`;
        else if (idiomaApp === "pt") textoCada = `A cada ${item.frecuenciaHoras}hs`;
        
        const fila = document.createElement("tr");
        // 🌟 LIMPIO: Inyectamos la variable claseEstadoAlarma directo en la etiqueta td sin style="..."
        fila.innerHTML = `
            <td><strong>${item.remedio}</strong></td>
            <td>${item.dosis}</td>
            <td>${textoCada}</td>
            <td class="${claseEstadoAlarma}">${avisoAlarma}</td>
            <td class="celda-centrada">
                <button class="btn-borrar-tabla" onclick="eliminarMedicionGuardada(${item.id})">🗑️</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}


function eliminarMedicionGuardada(id) {
    const claveHistorial = pequeActivo + "_medicaciones";
    let lista = JSON.parse(localStorage.getItem(claveHistorial)) || [];
    lista = lista.filter(item => item.id !== id);
    localStorage.setItem(claveHistorial, JSON.stringify(lista));
    actualizarListaVisual();
}

// ==========================================
// 7. RENDERIZADO DE TABLAS VISUALES (TURNOS Y VACUNAS CON GIRO DE FECHA)
// ==========================================
function actualizarListaTurnosVisual() {
    const claveHistorial = pequeActivo + "_turnos";
    const lista = pequeActivo ? (JSON.parse(localStorage.getItem(claveHistorial)) || []) : [];
    const contenedorLista = document.getElementById("contenedor-lista-turnos");
    const cuerpoTabla = document.getElementById("tabla-cuerpo-turnos");
    if (!contenedorLista || !cuerpoTabla) return;
    if (lista.length === 0) { contenedorLista.style.display = "none"; return; }
    
    contenedorLista.style.display = "block"; 
    cuerpoTabla.innerHTML = "";
    
    lista.forEach(item => {
        // 🌟 LOGRADO: Da vuelta la fecha de Año-Mes-Día a Día/Mes/Año de forma infalible
        const fechaFormateada = item.fecha.split("-").reverse().join("/");
        const fila = document.createElement("tr");
        fila.innerHTML = `<td><strong>${item.medico}</strong></td><td>${fechaFormateada}</td><td>${item.hora} hs</td><td>${item.lugar}</td><td class="celda-centrada"><button class="btn-borrar-tabla" onclick="eliminarTurnoGuardado(${item.id})">🗑️</button></td>`;
        cuerpoTabla.appendChild(fila);
    });
}

function actualizarListaVacunasVisual() {
    const claveHistorial = pequeActivo + "_vacunas";
    const lista = pequeActivo ? (JSON.parse(localStorage.getItem(claveHistorial)) || []) : [];
    const contenedorLista = document.getElementById("contenedor-lista-vacunas");
    const cuerpoTabla = document.getElementById("tabla-cuerpo-vacunas");
    if (!contenedorLista || !cuerpoTabla) return;
    if (lista.length === 0) { contenedorLista.style.display = "none"; return; }
    
    contenedorLista.style.display = "block"; 
    cuerpoTabla.innerHTML = "";
    
    lista.forEach(item => {
        // 🌟 LOGRADO: Da vuelta las fechas de aplicación y próxima dosis sin usar corchetes tramposos
        const fechaFormateada = item.fecha.split("-").reverse().join("/");
        const proximaFormateada = item.proxima.split("-").reverse().join("/");
        
        const fila = document.createElement("tr");
        fila.innerHTML = `<td><strong>${item.nombre}</strong></td><td>${fechaFormateada}</td><td class="texto-proxima-dosis">📅 ${proximaFormateada}</td><td class="celda-centrada"><button class="btn-borrar-tabla" onclick="eliminarVacunaGuardada(${item.id})">🗑️</button></td>`;
        cuerpoTabla.appendChild(fila);
    });
}



// ==========================================
// 8. FUNCIONES DE PROCESAMIENTO DINÁMICO INTERNACIONAL
// ==========================================
function actualizarListaTurnosVisual() {
    const claveHistorial = pequeActivo + "_turnos";
    const lista = pequeActivo ? (JSON.parse(localStorage.getItem(claveHistorial)) || []) : [];
    const contenedorLista = document.getElementById("contenedor-lista-turnos");
    const cuerpoTabla = document.getElementById("tabla-cuerpo-turnos");
    if (!contenedorLista || !cuerpoTabla) return;
    if (lista.length === 0) { contenedorLista.style.display = "none"; return; }
    
    contenedorLista.style.display = "block"; 
    cuerpoTabla.innerHTML = "";
    
    lista.forEach(item => {
        // 🌟 LOGRADO: Da vuelta la fecha de Año-Mes-Día a Día/Mes/Año de forma infalible y limpia
        const fechaFormateada = item.fecha.split("-").reverse().join("/");
        const fila = document.createElement("tr");
        fila.innerHTML = `<td><strong>${item.medico}</strong></td><td>${fechaFormateada}</td><td>${item.hora} hs</td><td>${item.lugar}</td><td class="celda-centrada"><button class="btn-borrar-tabla" onclick="eliminarTurnoGuardado(${item.id})">🗑️</button></td>`;
        cuerpoTabla.appendChild(fila);
    });
}

function eliminarTurnoGuardado(id) {
    const claveHistorial = pequeActivo + "_turnos";
    let lista = JSON.parse(localStorage.getItem(claveHistorial)) || [];
    lista = lista.filter(item => item.id !== id);
    localStorage.setItem(claveHistorial, JSON.stringify(lista));
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
// 10. UNIVERSO ALTA DE PERFIL DE PEQUES (TOTALMENTE SEPARADO) 👶🌈
// ==========================================
function guardarPerfilPeque() {
    const nombre = document.getElementById("nombre-peque").value.trim();
    const edad = document.getElementById("edad-peque").value.trim();
    const peso = document.getElementById("peso-peque").value;
    const altura = document.getElementById("altura-peque").value;
    let listaPeques = JSON.parse(localStorage.getItem("listaPeques")) || [];
    if (listaPeques.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) { alert("⚠️ Este nombre ya está registrado."); return; }
    const coloresPastel = ["#fbcfe8", "#bae6fd", "#bbf7d0", "#fef08a", "#e9d5ff"];
    const colorElegido = coloresPastel[listaPeques.length % coloresPastel.length];
    listaPeques.push({ nombre: nombre, edad: edad, peso: peso, altura: altura, colorFondo: colorElegido, colorTexto: "#1e293b" });
    localStorage.setItem("listaPeques", JSON.stringify(listaPeques));
    document.getElementById("form-perfil").reset();
    if (idiomaApp === "en") alert(`✨ Rainbow profile for ${nombre} created!\n\n💪 Let's go! 🤗`);
    else if (idiomaApp === "pt") alert(`✨ Perfil Arco-Íris de ${nombre} criado!\n\n💪 Vamos lá! 🤗`);
    else alert(`✨ ¡Perfil de ${nombre} creado con éxito!\n\n💪 ¡Vamos ${rolActivo}! 🤗`);
    actualizarListaPequesVisual();
}


function actualizarListaPequesVisual() {
    // Al dar de alta o borrar un nene, redibujamos el nido de nubecitas del Menú Principal
    if (document.getElementById("contenedor-solapas-peques")) {
        dibujarSolapasPeques();
    }
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
            }, 1200); // 1.2 segundos manteniendo apretado activa el borrado
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


function eliminarPeque(index) {
    let lista = JSON.parse(localStorage.getItem("listaPeques")) || [];
    lista.splice(index, 1);
    localStorage.setItem("listaPeques", JSON.stringify(lista));
    localStorage.setItem("pequeActivo", "");
    actualizarListaPequesVisual();
}



// ==========================================
// 11. LÓGICA DE ALTA DE PEQUES (PERFIL CON EDAD, PESO Y ALTURA)
// ==========================================
function guardarPerfilPeque() {
    const nombre = document.getElementById("nombre-peque").value.trim();
    const edad = document.getElementById("edad-peque").value.trim();
    const peso = document.getElementById("peso-peque").value;
    const altura = document.getElementById("altura-peque").value;
    let listaPeques = JSON.parse(localStorage.getItem("listaPeques")) || [];
    
    if (listaPeques.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) { 
        alert("⚠️ Este nombre ya está registrado."); 
        return; 
    }
    
    const coloresPastel = ["#fbcfe8", "#bae6fd", "#bbf7d0", "#fef08a", "#e9d5ff"];
    const colorElegido = coloresPastel[listaPeques.length % coloresPastel.length];
    
    listaPeques.push({ nombre: nombre, edad: edad, peso: peso, altura: altura, colorFondo: colorElegido, colorTexto: "#1e293b" });
    localStorage.setItem("listaPeques", JSON.stringify(listaPeques));
    document.getElementById("form-perfil").reset();
    
    if (idiomaApp === "en") alert(`✨ Rainbow profile for ${nombre} created!\n\n💪 Let's go! 🤗`);
    else if (idiomaApp === "pt") alert(`✨ Perfil Arco-Íris de ${nombre} criado!\n\n💪 Vamos lá! 🤗`);
    else alert(`✨ ¡Perfil de ${nombre} creado con éxito!\n\n💪 ¡Vamos ${rolActivo}! 🤗`);
    
    actualizarListaPequesVisual();
}

function actualizarListaPequesVisual() {
    const lista = JSON.parse(localStorage.getItem("listaPeques")) || [];
    const contenedorLista = document.getElementById("contenedor-lista-peques");
    const cuerpoTabla = document.getElementById("tabla-cuerpo-peques");
    if (!contenedorLista || !cuerpoTabla) return;
    if (lista.length === 0) { contenedorLista.style.display = "none"; return; }
    contenedorLista.style.display = "block"; cuerpoTabla.innerHTML = "";
    
    lista.forEach((item, index) => {
        const fila = document.createElement("tr");
        let detalle = `👶 ${item.edad} / ⚖️ ${item.peso} kg / 📏 ${item.altura} cm`;
        fila.innerHTML = `<td><strong>${item.nombre}</strong></td><td>${detalle}</td><td class="celda-centrada"><button class="btn-borrar-tabla" onclick="eliminarPeque(${index})">✕</button></td>`;
        cuerpoTabla.appendChild(fila);
    });
}

function eliminarPeque(index) {
    let lista = JSON.parse(localStorage.getItem("listaPeques")) || [];
    lista.splice(index, 1);
    localStorage.setItem("listaPeques", JSON.stringify(lista));
    localStorage.setItem("pequeActivo", "");
    actualizarListaPequesVisual();
}



function seleccionarIdioma(codigoIdioma) {
    localStorage.setItem("idiomaApp", codigoIdioma);
    window.location.href="home.html";
    
    // 🌟 TRUCO CLAVE: Si el cuidador es uno genérico de fábrica, lo limpiamos para que se traduzca perfecto al vuelo
    let rolActual = localStorage.getItem("rolActivo") || "Mamá";
    let rMinus = rolActual.toLowerCase();
    
    if (rMinus === "mamá" || rMinus === "mami" || rMinus === "mommy" || rMinus === "mamãe" || 
        rMinus === "papá" || rMinus === "papi" || rMinus === "daddy" || rMinus === "papai") {
        localStorage.removeItem("rolActivo"); 
    }

    if (codigoIdioma === 'es') alert("✨ ¡Bienvenido! Configurando aplicación... 🥰");
    else if (codigoIdioma === 'en') alert("✨ Welcome! Setting up your app... 🥰");
    else if (codigoIdioma === 'pt') alert("✨ Bem-vindo! Configurando aplicativo... 🥰");
    
    irA('index.html');
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
    const contenedor = document.getElementById("lista-blocks-turnos") || document.getElementById("lista-bloques-turnos");
    if (!contenedor) return;
    const bloques = contenedor.querySelectorAll(".bloque-remedio-dinamico");
    const claveHistorial = pequeActivo + "_turnos";
    let listaTurnos = JSON.parse(localStorage.getItem(claveHistorial)) || [];
    let errores = false;

    bloques.forEach(bloque => {
        const medico = block = bloque.querySelector(".input-medico").value;
        const fecha = bloque.querySelector(".input-fecha-turno").value;
        const hora = bloque.querySelector(".input-hora-turno").value;
        const lugar = bloque.querySelector(".input-lugar-turno").value || "No especificado";
        if (!medico || !fecha || !hora) { errores = true; return; }
        listaTurnos.push({ id: Date.now() + Math.random(), medico: medico, fecha: fecha, hora: hora, lugar: lugar });
    });

    if (errores) { alert("⚠️ Por favor, completa los campos obligatorios."); return; }
    localStorage.setItem(claveHistorial, JSON.stringify(listaTurnos));
    
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

function actualizarListaTurnosVisual() {
    const claveHistorial = pequeActivo + "_turnos";
    const lista = pequeActivo ? (JSON.parse(localStorage.getItem(claveHistorial)) || []) : [];
    const contenedorLista = document.getElementById("contenedor-lista-turnos");
    const cuerpoTabla = document.getElementById("tabla-cuerpo-turnos");
    if (!contenedorLista || !cuerpoTabla) return;
    if (lista.length === 0) { contenedorLista.style.display = "none"; return; }
    
    contenedorLista.style.display = "block"; 
    cuerpoTabla.innerHTML = "";
    
    lista.forEach(item => {
        const fechaFormateada = item.fecha.split("-").reverse().join("/");
        const fila = document.createElement("tr");
       fila.innerHTML = `<td><strong>${item.medico}</strong></td><td>${fechaFormateada}</td><td>${item.hora}</td><td>${item.lugar}</td><td class="celda-centrada"><button class="btn-borrar-tabla" onclick="eliminarTurnoGuardado(${item.id})">🗑️</button></td>`;
        cuerpoTabla.appendChild(fila);
    });
}

function eliminarTurnoGuardado(id) {
    const claveHistorial = pequeActivo + "_turnos";
    let lista = JSON.parse(localStorage.getItem(claveHistorial)) || [];
    lista = lista.filter(item => item.id !== id);
    localStorage.setItem(claveHistorial, JSON.stringify(lista));
    actualizarListaTurnosVisual();
}

        document.addEventListener('DOMContentLoaded', () => {
    traducirTodaLaAplicacion();
});
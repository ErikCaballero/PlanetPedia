// ==========================================
// 1. BASE DE DATOS DE TODAS LAS ESPECIES
// ==========================================
const baseDatosEspecies = {
    
    Bazofios: {
        fuerza: 1,
        resistencia: 1,
        velocidad: 1,
        inteligencia: 1,
        habilidad: 3
    },
    Ceruleanos: {
        fuerza: 4,
        resistencia: 5,
        velocidad: 4,
        inteligencia: 5,
        habilidad: 1
    },
    EnjambreVork: {
        fuerza: 1,
        resistencia: 1,
        velocidad: 3,
        inteligencia: 1,
        habilidad: 3
    },
    Foxers: {
        fuerza: 1,
        resistencia: 2,
        velocidad: 2,
        inteligencia: 8,
        habilidad: 3
    },
    Garguleans: {
        fuerza: 4,
        resistencia: 3,
        velocidad: 5,
        inteligencia: 3,
        habilidad: 4
    },
    Gigantodones: {
        fuerza: 9,
        resistencia: 8,
        velocidad: 2,
        inteligencia: 4,
        habilidad: 2
    },
    Grolux: {
        fuerza: 5,
        resistencia: 6,
        velocidad: 4,
        inteligencia: 4,
        habilidad: 5
    },
    InvasoresX: {
        fuerza: 6,
        resistencia: 8,
        velocidad: 8,
        inteligencia: 10,
        habilidad: 9
    },
    Kaelish: {
        fuerza: 2,
        resistencia: 2,
        velocidad: 2,
        inteligencia: 4,
        habilidad: 10
    },
    Tibutrones: {
        fuerza: 6,
        resistencia: 7,
        velocidad: 4,
        inteligencia: 4,
        habilidad: 3
    },
    Ultramitas: {
        fuerza: 10,
        resistencia: 10,
        velocidad: 10,
        inteligencia: 6,
        habilidad: 9
    },
    Brainiacs: {
        fuerza: 2,
        resistencia: 2,
        velocidad: 2,
        inteligencia: 10
    },
    
    Velorians: {
        fuerza: 3,
        resistencia: 5,
        velocidad: 10,
        inteligencia: 5,
        habilidad: 3
    },
    Xelthorianos: {
        fuerza: 3,
        resistencia: 3,
        velocidad: 3,
        inteligencia: 6,
        habilidad: 8
    },
    Humanos: {
        fuerza: 3,
        resistencia: 2,
        velocidad: 2,
        inteligencia: 5,
        habilidad: 0
    }
    
    // Puedes ir agregando aquí todas las especies nuevas que crees
};


// ==========================================
// 2. LÓGICA DE CONTROL Y DESPLEGABLE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("[data-especie]");
    const btnStats = document.getElementById("btnStats");
    const panelStats = document.getElementById("panelStats");
    const flechaStats = document.getElementById("flechaStats");
    
    let statsCargadas = false;

    // Si la página actual no tiene el atributo data-especie, detiene la ejecución
    if (!container) return;

    // Obtener la clave de la especie actual (ej. "garguleans")
    const idEspecie = container.getAttribute("data-especie");
    const datosEspecie = baseDatosEspecies[idEspecie];

    if (btnStats && panelStats && datosEspecie) {
        btnStats.addEventListener("click", () => {
            // Alternar visibilidad de la sección
            panelStats.classList.toggle("oculto");
            flechaStats.classList.toggle("rotada");

            // Cargar y animar solo la primera vez que se abre
            if (!statsCargadas && !panelStats.classList.contains("oculto")) {
                cargarEstadisticas(datosEspecie);
                statsCargadas = true;
            }
        });
    }
});


// ==========================================
// 3. FUNCIÓN DE RENDERIZADO DE BARRAS
// ==========================================
function cargarEstadisticas(stats) {
    for (const [attr, valor] of Object.entries(stats)) {
        const nivel = Math.min(Math.max(valor, 0), 10);
        const porcentaje = nivel * 10;

        const elBar = document.getElementById(`bar-${attr}`);
        const elVal = document.getElementById(`val-${attr}`);

        if (elBar && elVal) {
            setTimeout(() => {
                elBar.style.width = `${porcentaje}%`;
                elVal.innerText = `${nivel}/10`;
            }, 100);
        }
    }
}
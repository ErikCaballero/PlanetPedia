// ==========================================
// 1. BASE DE DATOS DE TODAS LAS ESPECIES
// ==========================================
const baseDatosEspecies = {

    AracnoSephus: {
        fuerza: 2,
        agilidad: 4,
        resistencia: 3,
        velocidad: 3,
        inteligencia: 6,
        habilidad: 4
    },
    AracnoSephusGoliath: {
        fuerza: 6,
        agilidad: 2,
        resistencia: 6,
        velocidad: 3,
        inteligencia: 3,
        habilidad: 4
    },
    Bazofios: {
        fuerza: 0,
        agilidad: 2,
        resistencia: 2,
        velocidad: 0,
        inteligencia: 1,
        habilidad: 2
    },
    Brinix: {
        fuerza: 1,
        agilidad: 5,
        resistencia: 5,
        velocidad: 5,
        inteligencia: 6,
        habilidad: 5
    },
    Ceruleans: {
        fuerza: 3,
        agilidad: 4,
        resistencia: 4,
        velocidad: 1,
        inteligencia: 4,
        habilidad: 0
    },
    EnjambreVork: {
        fuerza: 0,
        agilidad: 4,
        resistencia: 3,
        velocidad: 4,
        inteligencia: 1,
        habilidad: 3
    },
    Foxers: {
        fuerza: 0,
        agilidad: 5,
        resistencia: 2,
        velocidad: 1,
        inteligencia: 8,
        habilidad: 0
    },
    Friggits: {
        fuerza: 0,
        agilidad: 6,
        resistencia: 2,
        velocidad: 2,
        inteligencia: 3,
        habilidad: 0
    },
    Garbilos: {
        fuerza: 0,
        agilidad: 3,
        resistencia: 2,
        velocidad: 1,
        inteligencia: 4,
        habilidad: 3
    },
    Garguleans: {
        fuerza: 1,
        agilidad: 4,
        resistencia: 3,
        velocidad: 4,
        inteligencia: 1,
        habilidad: 6
    },
    Gigantodones: {
        fuerza: 8,
        agilidad: 2,
        resistencia: 6,
        velocidad: 3,
        inteligencia: 1,
        habilidad: 0
    },
    Grimoriums: {
        fuerza: 1,
        agilidad: 3,
        resistencia: 10,
        velocidad: 2,
        inteligencia: 6,
        habilidad: 10
    },
    Grolux: {
        fuerza: 5,
        agilidad: 4,
        resistencia: 5,
        velocidad: 4,
        inteligencia: 1,
        habilidad: 5
    },
    Grynthars: {
        fuerza: 4,
        agilidad: 3,
        resistencia: 4,
        velocidad: 0,
        inteligencia: 6,
        habilidad: 0
    },
    InvasoresX: {
        fuerza: 5,
        agilidad: 8,
        resistencia: 8,
        velocidad: 7,
        inteligencia: 10,
        habilidad: 9
    },
    Kaelish: {
        fuerza: 1,
        agilidad: 5,
        resistencia: 2,
        velocidad: 2,
        inteligencia: 4,
        habilidad: 10
    },
    Klagors: {
        fuerza: 3,
        agilidad: 3,
        resistencia: 4,
        velocidad: 1,
        inteligencia: 4,
        habilidad: 0
    },
    Kothars: {
        fuerza: 6,
        agilidad: 6,
        resistencia: 8,
        velocidad: 3,
        inteligencia: 3,
        habilidad: 1
    },
    Legionarios: {
        fuerza: 6,
        agilidad: 7,
        resistencia: 8,
        velocidad: 4,
        inteligencia: 6,
        habilidad: 4
    },
    Orrs: {
        fuerza: 8,
        agilidad: 3,
        resistencia: 5,
        velocidad: 3,
        inteligencia: 3,
        habilidad: 1
    },
    Permians: {
        fuerza: 2,
        agilidad: 6,
        resistencia: 5,
        velocidad: 3,
        inteligencia: 5,
        habilidad: 0
    },
    Porvils: {
        fuerza: 2,
        agilidad: 3,
        resistencia: 4,
        velocidad: 2,
        inteligencia: 3,
        habilidad: 1
    },
    Samyatis: {
        fuerza: 1,
        agilidad: 3,
        resistencia: 4,
        velocidad: 1,
        inteligencia: 3,
        habilidad: 7
    },
    Tibutrones: {
        fuerza: 4,
        agilidad: 3,
        resistencia: 6,
        velocidad: 3,
        inteligencia: 3,
        habilidad: 2
    },
    Tortanks: {
        fuerza: 3,
        agilidad: 2,
        resistencia: 6,
        velocidad: 2,
        inteligencia: 2,
        habilidad: 0
    },
    Ultramitas: {
        fuerza: 10,
        agilidad: 10,
        resistencia: 10,
        velocidad: 10,
        inteligencia: 6,
        habilidad: 9
    },
    Brainiacs: {
        fuerza: 1,
        agilidad: 3,
        resistencia: 3,
        velocidad: 1,
        inteligencia: 10,
        habilidad: 0
    },
    Varyths: {
        fuerza: 1,
        agilidad: 8,
        resistencia: 6,
        velocidad: 3,
        inteligencia: 3,
        habilidad: 0
    },
    Velorians: {
        fuerza: 1,
        agilidad: 9,
        resistencia: 5,
        velocidad: 10,
        inteligencia: 3,
        habilidad: 3
    },
    Xelthorianos: {
        fuerza: 1,
        agilidad: 4,
        resistencia: 3,
        velocidad: 3,
        inteligencia: 6,
        habilidad: 8
    },
    Xilvath: {
        fuerza: 2,
        agilidad: 3,
        resistencia: 6,
        velocidad: 3,
        inteligencia: 7,
        habilidad: 10
    },
    Zornicos: {
        fuerza: 1,
        agilidad: 4,
        resistencia: 4,
        velocidad: 3,
        inteligencia: 6,
        habilidad: 3
    },
    Humanos: {
        fuerza: 1,
        agilidad: 2,
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
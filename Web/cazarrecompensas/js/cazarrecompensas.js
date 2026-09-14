/* =========================================================
   PLANET PEDIA
   CAZARRECOMPENSAS
========================================================= */


/* =========================================================
   DATOS
========================================================= */

let CAZARRECOMPENSAS = [];
let CONTRATOS = [];


/* =========================================================
   PUNTUACIONES
========================================================= */

const PUNTOS_DIFICULTAD = {

  "Baja": 1,
  "Moderada": 2,
  "Alta": 4,
  "Severa": 7,
  "Extrema": 10

};


const PUNTOS_PELIGROSIDAD = {

  "Bajo": 1,
  "Moderado": 2,
  "Alto": 3,
  "Severo": 4,
  "Extremo": 5

};


const PUNTOS_INSIGNIA_MANUAL = {

  "Comun": 0,
  "Común": 0,
  "Rara": 2,
  "Epica": 3,
  "Épica": 3,
  "Legendaria": 5,
  "Especial": 7

};



/* =========================================================
   ELEMENTOS HTML
========================================================= */

const grid =
  document.getElementById(
    "gridCazarrecompensas"
  );


const rankingContenedor =
  document.getElementById(
    "rankingCazarrecompensas"
  );


const contador =
  document.getElementById(
    "contadorResultados"
  );


const busqueda =
  document.getElementById(
    "busqueda"
  );


const filtroPeligrosidad =
  document.getElementById(
    "filtroPeligrosidad"
  );


const filtroEstado =
  document.getElementById(
    "filtroEstado"
  );


const modal =
  document.getElementById(
    "modal"
  );


const contenidoPerfil =
  document.getElementById(
    "contenidoPerfil"
  );



/* =========================================================
   UTILIDADES
========================================================= */

function esc(valor = "") {

  return String(valor ?? "")
    .replace(
      /[&<>"]/g,
      caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      }[caracter])
    );

}


function clase(valor = "") {

  return String(valor)
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    );

}


function lista(valor) {

  return Array.isArray(valor)
    ? valor
    : [];

}


function creditos(numero) {

  return (
    Number(numero || 0)
      .toLocaleString("es-ES") +
    " cr"
  );

}

function formatoAnios(valor) {

  if (valor === undefined || valor === null || valor === "") {
    return "";
  }

  const texto = String(valor).trim();

  return /\baños?\b/i.test(texto)
    ? texto
    : `${texto} años`;

}

/* =========================================================
   ABRIR / CERRAR RANKING
========================================================= */

const botonRanking =
  document.getElementById(
    "botonRanking"
  );

const panelRanking =
  document.getElementById(
    "panelRanking"
  );

const cerrarRanking =
  document.getElementById(
    "cerrarRanking"
  );


const botonComparador =
  document.getElementById(
    "botonComparador"
  );

const panelComparador =
  document.getElementById(
    "panelComparador"
  );

const cerrarComparador =
  document.getElementById(
    "cerrarComparador"
  );

const comparadorA =
  document.getElementById(
    "comparadorA"
  );

const comparadorB =
  document.getElementById(
    "comparadorB"
  );

const resultadoComparador =
  document.getElementById(
    "resultadoComparador"
  );


function abrirRanking() {

  panelRanking.classList.add(
    "open"
  );

  panelRanking.setAttribute(
    "aria-hidden",
    "false"
  );

  botonRanking.classList.add(
    "active"
  );

}


function ocultarRanking() {

  panelRanking.classList.remove(
    "open"
  );

  panelRanking.setAttribute(
    "aria-hidden",
    "true"
  );

  botonRanking.classList.remove(
    "active"
  );

}


if (botonRanking) {

  botonRanking.addEventListener(
    "click",
    () => {

      if (
        panelRanking.classList.contains(
          "open"
        )
      ) {

        ocultarRanking();

      }

      else {

        abrirRanking();

      }

    }
  );

}


if (cerrarRanking) {

  cerrarRanking.addEventListener(
    "click",
    ocultarRanking
  );

}


/* =========================================================
   ABRIR / CERRAR COMPARADOR
========================================================= */

function abrirComparador() {
  if (!panelComparador || !botonComparador) return;

  panelComparador.classList.add("open");
  panelComparador.setAttribute("aria-hidden", "false");
  botonComparador.classList.add("active");
}

function ocultarComparador() {
  if (!panelComparador || !botonComparador) return;

  panelComparador.classList.remove("open");
  panelComparador.setAttribute("aria-hidden", "true");
  botonComparador.classList.remove("active");
}

if (botonComparador) {
  botonComparador.addEventListener("click", () => {
    if (panelComparador && panelComparador.classList.contains("open")) {
      ocultarComparador();
    } else {
      abrirComparador();
    }
  });
}

if (cerrarComparador) {
  cerrarComparador.addEventListener("click", ocultarComparador);
}

/* =========================================================
   CARGAR JSON
========================================================= */

async function cargarDatos() {

  try {

    const [
      respuestaHunters,
      respuestaContratos
    ] = await Promise.all([

      fetch(
        "datos/cazarrecompensas.json"
      ),

      fetch(
        "datos/contratos.json"
      )

    ]);


    if (!respuestaHunters.ok) {

      throw new Error(
        "No se pudo cargar datos/cazarrecompensas.json"
      );

    }


    if (!respuestaContratos.ok) {

      throw new Error(
        "No se pudo cargar datos/contratos.json"
      );

    }


    CAZARRECOMPENSAS =
      await respuestaHunters.json();


    CONTRATOS =
      await respuestaContratos.json();


    console.log(
      "Cazarrecompensas:",
      CAZARRECOMPENSAS
    );


    console.log(
      "Contratos:",
      CONTRATOS
    );


    const idsHunters = new Set(
      CAZARRECOMPENSAS.map(hunter => hunter.id)
    );

    const contratosSinHunter = CONTRATOS.filter(
      contrato => !idsHunters.has(contrato.cazarrecompensas)
    );

    if (contratosSinHunter.length) {
      console.warn(
        "Hay contratos cuyo campo cazarrecompensas no coincide con ningún id de cazarrecompensas.json:",
        contratosSinHunter.map(contrato => ({
          id: contrato.id,
          cazarrecompensas: contrato.cazarrecompensas
        }))
      );
    }


    renderCards(
      CAZARRECOMPENSAS
    );


    renderRanking();

    iniciarComparador();

  }

  catch (error) {

    console.error(
      "Error cargando los datos:",
      error
    );


    if (grid) {

      grid.innerHTML = `

        <div class="empty">

          <h3>
            Error cargando los datos
          </h3>

          <p>
            Comprueba que existen:
          </p>

          <p>
            datos/cazarrecompensas.json
            <br>
            datos/contratos.json
          </p>

          <p>
            La página debe abrirse mediante
            Live Server o un servidor local.
          </p>

        </div>

      `;

    }

  }

}



/* =========================================================
   IMAGEN
========================================================= */

function imagenHTML(hunter) {

  if (!hunter.imagen) {

    return `

      <div class="fallback-avatar">
        ◈
      </div>

    `;

  }


  return `

    <img
      src="${esc(hunter.imagen)}"
      alt="${esc(hunter.nombre)}"
      loading="lazy"
    >

  `;

}



/* =========================================================
   TARJETAS PRINCIPALES
========================================================= */

function renderCards(datos) {

  if (!grid) return;


  if (contador) {

    contador.textContent =
      `${datos.length} ${
        datos.length === 1
          ? "registro"
          : "registros"
      }`;

  }


  if (!datos.length) {

    grid.innerHTML = `

      <div class="empty">
        No hay expedientes que coincidan
        con los filtros seleccionados.
      </div>

    `;

    return;

  }


  grid.innerHTML =
    datos.map(
      (hunter, index) => `

        <article
          class="hunter-card"
          data-id="${esc(hunter.id)}"
          tabindex="0"
        >

          <div class="card-image">

            ${imagenHTML(hunter)}

          </div>


          <div class="card-badges">

            <span class="badge">

              ${
                esc(
                  hunter.estado ||
                  "Desconocido"
                )
              }

            </span>


            <span class="
              badge
              ${clase(hunter.peligrosidad)}
            ">

              ${
                esc(
                  hunter.peligrosidad ||
                  "Sin clasificar"
                )
              }

            </span>

          </div>


          <div class="card-content">

            <div class="registry">

              REGISTRO BH-${
                String(index + 1)
                  .padStart(4, "0")
              }

            </div>


            <h3>

              ${esc(hunter.nombre)}

            </h3>


            <div class="meta">

              ${
                esc(
                  hunter.raza ||
                  "Raza desconocida"
                )
              }

              ${
                hunter.edad
                  ? ` · ${esc(formatoAnios(hunter.edad))}`
                  : ""
              }

            </div>


            <p class="short-desc">

              ${
                esc(
                  hunter.descripcion ||
                  ""
                )
              }

            </p>


            <div class="chips">

              ${
                lista(
                  hunter.especialidades
                )
                .slice(0, 4)
                .map(
                  especialidad => `

                    <span class="chip">

                      ${
                        esc(
                          especialidad
                        )
                      }

                    </span>

                  `
                )
                .join("")
              }

            </div>

          </div>

        </article>

      `
    )
    .join("");


  grid
    .querySelectorAll(
      ".hunter-card"
    )
    .forEach(
      tarjeta => {

        tarjeta.addEventListener(
          "click",
          () => {

            abrirPerfil(
              tarjeta.dataset.id
            );

          }
        );


        tarjeta.addEventListener(
          "keydown",
          evento => {

            if (
              evento.key === "Enter" ||
              evento.key === " "
            ) {

              evento.preventDefault();

              abrirPerfil(
                tarjeta.dataset.id
              );

            }

          }
        );

      }
    );

}



/* =========================================================
   FILTROS
========================================================= */

function filtrar() {

  const textoBusqueda =
    busqueda
      ? busqueda.value
          .trim()
          .toLowerCase()
      : "";


  const peligrosidad =
    filtroPeligrosidad
      ? filtroPeligrosidad.value
      : "";


  const estado =
    filtroEstado
      ? filtroEstado.value
      : "";


  const resultado =
    CAZARRECOMPENSAS.filter(
      hunter => {

        const textoHunter = [

          hunter.nombre,
          hunter.alias,
          hunter.raza,

          ...lista(
            hunter.especialidades
          )

        ]
        .join(" ")
        .toLowerCase();


        const coincideBusqueda =
          !textoBusqueda ||
          textoHunter.includes(
            textoBusqueda
          );


        const coincidePeligro =
          !peligrosidad ||
          hunter.peligrosidad ===
            peligrosidad;


        const coincideEstado =
          !estado ||
          hunter.estado === estado;


        return (
          coincideBusqueda &&
          coincidePeligro &&
          coincideEstado
        );

      }
    );


  renderCards(
    resultado
  );

}



/* =========================================================
   CONTRATOS DE UN HUNTER
========================================================= */

function obtenerContratos(idHunter) {

  return CONTRATOS.filter(
    contrato =>
      contrato.cazarrecompensas ===
      idHunter
  );

}



/* =========================================================
   ESTADÍSTICAS
========================================================= */

function calcularEstadisticas(idHunter) {

  const contratos =
    obtenerContratos(
      idHunter
    );


  const completados =
    contratos.filter(
      contrato =>
        contrato.estado ===
        "Completado"
    );


  const fallidos =
    contratos.filter(
      contrato =>
        contrato.estado ===
        "Fallido"
    );


  const aceptados =
    contratos.filter(
      contrato =>
        contrato.estado ===
        "Aceptado"
    );


  const cancelados =
    contratos.filter(
      contrato =>
        contrato.estado ===
        "Cancelado"
    );


  const abandonados =
    contratos.filter(
      contrato =>
        contrato.estado ===
        "Abandonado"
    );


  const finalizados =
    completados.length +
    fallidos.length;


  const tasaExito =
    finalizados > 0

      ? Math.round(
          (
            completados.length /
            finalizados
          ) * 100
        )

      : 0;


  const creditosGanados =
    completados.reduce(
      (total, contrato) => {

        return (
          total +
          Number(
            contrato.recompensa ||
            0
          )
        );

      },
      0
    );


  const puntosContratos =
    completados.reduce(
      (total, contrato) => {

        return (
          total +
          (
            PUNTOS_DIFICULTAD[
              contrato.dificultad
            ] || 0
          )
        );

      },
      0
    );


  return {

    contratos,

    completados:
      completados.length,

    fallidos:
      fallidos.length,

    aceptados:
      aceptados.length,

    cancelados:
      cancelados.length,

    abandonados:
      abandonados.length,

    tasaExito,

    creditosGanados,

    puntosContratos

  };

}



/* =========================================================
   PUNTOS DE INSIGNIAS MANUALES
========================================================= */

function puntosRarezaInsignia(rareza = "") {

  const texto = String(rareza || "").trim();

  return PUNTOS_INSIGNIA_MANUAL[texto] || 0;
}


function calcularPuntosInsigniasManuales(hunter) {

  return lista(hunter.insignias)
    .map((insignia, index) => normalizarInsigniaManual(insignia, index))
    .filter(Boolean)
    .reduce(
      (total, insignia) => total + puntosRarezaInsignia(insignia.rareza),
      0
    );
}


/* =========================================================
   RANKING
========================================================= */

function calcularRanking() {

  const ranking =
    CAZARRECOMPENSAS.map(
      hunter => {

        const stats =
          calcularEstadisticas(
            hunter.id
          );


        const puntosPeligrosidad =
          PUNTOS_PELIGROSIDAD[
            hunter.peligrosidad
          ] || 0;


        /*
          PUNTUACIÓN DEL RANKING

          +10 por cada contrato completado

          + puntos según dificultad:
             Baja      = 1
             Moderada  = 2
             Alta      = 4
             Severa    = 7
             Extrema   = 10

          + peligrosidad × 3:
             Bajo      = 3
             Moderado  = 6
             Alto      = 9
             Severo    = 12
             Extremo   = 15

          + insignias MANUALES según rareza:
             Rara       = 2
             Épica      = 3
             Legendaria = 5
             Especial   = 7

          Las insignias automáticas no otorgan puntos.
        */

        const puntosInsignias =
          calcularPuntosInsigniasManuales(hunter);


        const puntuacion =
          (stats.completados * 10) +
          stats.puntosContratos +
          (puntosPeligrosidad * 3) +
          puntosInsignias;


        return {

          ...hunter,

          contratosCompletados:
            stats.completados,

          tasaExito:
            stats.tasaExito,

          puntosContratos:
            stats.puntosContratos,

          puntosPeligrosidad,

          puntosInsignias,

          puntuacion

        };

      }
    );


  ranking.sort(
    (a, b) => {

      /*
        1. Mayor puntuación
      */

      if (
        b.puntuacion !==
        a.puntuacion
      ) {

        return (
          b.puntuacion -
          a.puntuacion
        );

      }


      /*
        2. Más contratos completados
      */

      if (
        b.contratosCompletados !==
        a.contratosCompletados
      ) {

        return (
          b.contratosCompletados -
          a.contratosCompletados
        );

      }


      /*
        3. Mayor peligrosidad
      */

      if (
        b.puntosPeligrosidad !==
        a.puntosPeligrosidad
      ) {

        return (
          b.puntosPeligrosidad -
          a.puntosPeligrosidad
        );

      }


      /*
        4. Mayor tasa de éxito
      */

      return (
        b.tasaExito -
        a.tasaExito
      );

    }
  );


  return ranking.slice(0, 10);

}



/* =========================================================
   MOSTRAR RANKING
========================================================= */

function renderRanking() {

  if (!rankingContenedor) {
    return;
  }


  const ranking =
    calcularRanking();


  if (!ranking.length) {

    rankingContenedor.innerHTML = `

      <div class="empty">
        No hay suficientes datos para generar el ranking.
      </div>

    `;

    return;

  }


  rankingContenedor.innerHTML =
    ranking.map(
      (hunter, index) => {

        const posicion =
          index + 1;


        let etiqueta = "";

        if (posicion === 1) {
          etiqueta = "PRIMER PUESTO";
        }

        else if (posicion <= 3) {
          etiqueta = "TOP 3";
        }


        return `

          <article
            class="
              ranking-row
              ranking-row-${posicion}
            "
            data-id="${esc(hunter.id)}"
          >

            <div class="ranking-number">

              <span>
                #${String(posicion).padStart(2, "0")}
              </span>

            </div>


            <div class="ranking-hunter">

              <div class="ranking-avatar">

                ${imagenHTML(hunter)}

              </div>


              <div class="ranking-name">

                ${etiqueta ? `
                  <small>
                    ${etiqueta}
                  </small>
                ` : ""}

                <strong>
                  ${esc(hunter.nombre)}
                </strong>

                <span>
                  ${esc(hunter.raza || "Raza desconocida")}
                </span>

              </div>

            </div>


            <div
              class="ranking-value"
              data-label="Completados"
            >

              <strong>
                ${hunter.contratosCompletados}
              </strong>

            </div>


            <div
              class="ranking-value"
              data-label="Peligro"
            >

              <span class="
                ranking-danger
                danger-${clase(hunter.peligrosidad)}
              ">

                ${
                  esc(
                    hunter.peligrosidad ||
                    "Desconocido"
                  )
                }

              </span>

            </div>


            <div
              class="ranking-value"
              data-label="Éxito"
            >

              <strong>
                ${hunter.tasaExito}%
              </strong>

            </div>


            <div
              class="ranking-points"
              data-label="Puntos"
            >

              <strong>
                ${hunter.puntuacion}
              </strong>

              <span>
                PTS
              </span>

            </div>

          </article>

        `;

      }
    )
    .join("");


  rankingContenedor
    .querySelectorAll(
      ".ranking-row"
    )
    .forEach(
      fila => {

        fila.addEventListener(
          "click",
          () => {

            abrirPerfil(
              fila.dataset.id
            );

          }
        );

      }
    );

}



/* =========================================================
   CAJA DE INFORMACIÓN
========================================================= */

function infoBox(
  etiqueta,
  valor
) {

  if (
    valor === undefined ||
    valor === null ||
    valor === ""
  ) {

    return "";

  }


  return `

    <div class="info-box">

      <span class="info-label">

        ${esc(etiqueta)}

      </span>


      <span class="info-value">

        ${esc(valor)}

      </span>

    </div>

  `;

}

function renderHistoria(historia) {

  if (!historia) {
    return `
      <p>
        Sin historia registrada.
      </p>
    `;
  }


  if (Array.isArray(historia)) {

    return historia
      .filter(parrafo => parrafo)
      .map(parrafo => `
        <p class="historia-parrafo">
          ${esc(parrafo)}
        </p>
      `)
      .join("");

  }


  // Compatibilidad con historias antiguas
  return `
    <p class="historia-parrafo">
      ${esc(historia)}
    </p>
  `;
}

/* =========================================================
   EQUIPAMIENTO
========================================================= */

function listaEquipo(datos) {

  const elementos =
    lista(datos);


  if (!elementos.length) {

    return `

      <p class="empty-text">
        Sin datos registrados.
      </p>

    `;

  }


  return `

    <div class="equipment-grid">

      ${
        elementos.map(
          item => `

            <div class="equip-item">

              ${esc(item)}

            </div>

          `
        )
        .join("")
      }

    </div>

  `;

}



/* =========================================================
   DIFICULTAD
========================================================= */

function dificultadHTML(
  dificultad
) {

  if (!dificultad) {
    return "";
  }


  return `

    <span class="
      contract-difficulty
      dificultad-${clase(dificultad)}
    ">

      ${esc(dificultad)}

    </span>

  `;

}



/* =========================================================
   CONTRATOS
========================================================= */

function renderContratos(contratos) {

  if (!contratos || contratos.length === 0) {
    return `
      <div class="empty-state">
        No hay contratos registrados.
      </div>
    `;
  }

  return contratos.map((contrato, index) => {

    const idDetalle = `contrato-detalle-${index}-${contrato.id}`;

    return `
      <article class="contract-card">

        <div class="contract-header">

          <div class="contract-title-group">

            <span class="contract-id">
              ${esc(contrato.id)}
            </span>

            <h3>
              ${esc(contrato.nombre)}
            </h3>

          </div>


          <div class="contract-badges">

            <span class="contract-difficulty dificultad-${normalizarClase(contrato.dificultad)}">
              ${esc(contrato.dificultad)}
            </span>

            <span class="contract-status estado-${normalizarClase(contrato.estado)}">
              ${esc(contrato.estado)}
            </span>

          </div>

        </div>


        <div class="contract-summary-grid">

          <div class="contract-data">
            <span>TIPO</span>
            <strong>${esc(contrato.tipo || "Sin registrar")}</strong>
          </div>

          <div class="contract-data">
            <span>OBJETIVO</span>
            <strong>${esc(contrato.objetivo || "Sin registrar")}</strong>
          </div>

          <div class="contract-data">
            <span>CLIENTE</span>
            <strong>${esc(contrato.cliente || "Sin registrar")}</strong>
          </div>

          <div class="contract-data">
            <span>LOCALIZACIÓN</span>
            <strong>${esc(contrato.lugar || "Sin registrar")}</strong>
          </div>

          <div class="contract-data">
            <span>RECOMPENSA</span>
            <strong>${esc(contrato.recompensa || "Sin registrar")}</strong>
          </div>

        </div>


        <button
          class="contract-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="${idDetalle}"
          onclick="toggleContratoDetalle('${idDetalle}', this)"
        >
          <span>VER DETALLES</span>
          <span class="contract-toggle-arrow">⌄</span>
        </button>


        <div
          id="${idDetalle}"
          class="contract-details"
          hidden
        >

          <div class="contract-detail-block">

            <span class="contract-detail-label">
              DESCRIPCIÓN
            </span>

            <p>
              ${esc(contrato.descripcion || "Sin descripción registrada.")}
            </p>

          </div>


          <div class="contract-detail-block">

            <span class="contract-detail-label">
              RESULTADO
            </span>

            <p>
              ${esc(contrato.resultado || "Sin resultado registrado.")}
            </p>

          </div>


          <div class="contract-detail-block">

            <span class="contract-detail-label">
              OBSERVACIONES
            </span>

            <p>
              ${esc(contrato.observaciones || "Sin observaciones.")}
            </p>

          </div>

        </div>

      </article>
    `;
  }).join("");
}



/* =========================================================
   VALORACIÓN DEL CAZARRECOMPENSAS
========================================================= */

function generarEstrellas(cantidad) {

  const valor = Math.max(
    0,
    Math.min(
      5,
      Math.round(Number(cantidad) || 0)
    )
  );

  return `
    <span class="rating-stars" aria-label="${valor} de 5 estrellas">
      <span class="rating-stars-filled">${"★".repeat(valor)}</span><span class="rating-stars-empty">${"★".repeat(5 - valor)}</span>
    </span>
  `;
}


function calcularAmenazaEstrellas(peligrosidad) {

  const niveles = {
    "Bajo": 1,
    "Moderado": 2,
    "Alto": 3,
    "Severo": 4,
    "Extremo": 5
  };

  return niveles[peligrosidad] || 0;
}


function calcularExperienciaEstrellas(anosActivo) {

  const anos = parseInt(anosActivo) || 0;

  if (anos >= 25) return 5;
  if (anos >= 15) return 4;
  if (anos >= 8) return 3;
  if (anos >= 3) return 2;
  if (anos >= 1) return 1;

  return 0;
}


function calcularEfectividadEstrellas(tasaExito) {

  const porcentaje = Number(tasaExito) || 0;

  if (porcentaje >= 90) return 5;
  if (porcentaje >= 75) return 4;
  if (porcentaje >= 55) return 3;
  if (porcentaje >= 30) return 2;
  if (porcentaje > 0) return 1;

  return 0;
}


function calcularActividadEstrellas(totalContratos) {

  const total = Number(totalContratos) || 0;

  if (total >= 20) return 5;
  if (total >= 12) return 4;
  if (total >= 7) return 3;
  if (total >= 3) return 2;
  if (total >= 1) return 1;

  return 0;
}


function calcularValoracion(hunter, stats) {

  const amenaza = calcularAmenazaEstrellas(
    hunter.peligrosidad
  );

  const experiencia = calcularExperienciaEstrellas(
    hunter.anosActivo
  );

  const efectividad = calcularEfectividadEstrellas(
    stats.tasaExito
  );

  const actividad = calcularActividadEstrellas(
    stats.contratos.length
  );

  const media = (
    amenaza +
    experiencia +
    efectividad +
    actividad
  ) / 4;

  return {
    amenaza,
    experiencia,
    efectividad,
    actividad,
    media,
    estrellasGenerales: Math.round(media)
  };
}




/* =========================================================
   INSIGNIAS
========================================================= */

function normalizarInsigniaManual(insignia, index = 0) {

  if (typeof insignia === "string") {
    return {
      id: `manual-${index}`,
      nombre: insignia,
      descripcion: "Insignia especial registrada manualmente en el expediente.",
      icono: "◆",
      rareza: "Especial",
      puntosRanking: puntosRarezaInsignia("Especial"),
      origen: "manual"
    };
  }

  if (!insignia || typeof insignia !== "object") {
    return null;
  }

  return {
    id: insignia.id || `manual-${index}`,
    nombre: insignia.nombre || "Insignia sin nombre",
    descripcion: insignia.descripcion || "Insignia especial registrada manualmente en el expediente.",
    icono: insignia.icono || "◆",
    rareza: insignia.rareza || "Especial",
    puntosRanking: puntosRarezaInsignia(insignia.rareza || "Especial"),
    origen: "manual"
  };
}


function calcularInsigniasAutomaticas(hunter, stats) {

  const insignias = [];
  const anos = parseInt(hunter.anosActivo) || 0;
  const especialidades = lista(hunter.especialidades).filter(Boolean).length;
  const finalizados = stats.completados + stats.fallidos;
  const peligro = hunter.peligrosidad || "";

  if (anos >= 25) {
    insignias.push({
      id: "leyenda-del-oficio",
      nombre: "Leyenda del oficio",
      descripcion: "Más de 25 años de actividad registrados como cazarrecompensas.",
      icono: "★",
      rareza: "Legendaria",
      origen: "automatica"
    });
  }
  else if (anos >= 15) {
    insignias.push({
      id: "veterano",
      nombre: "Veterano",
      descripcion: "Al menos 15 años de actividad registrados.",
      icono: "✦",
      rareza: "Épica",
      origen: "automatica"
    });
  }
  else if (anos >= 8) {
    insignias.push({
      id: "experimentado",
      nombre: "Experimentado",
      descripcion: "Al menos 8 años de actividad registrados.",
      icono: "◇",
      rareza: "Rara",
      origen: "automatica"
    });
  }

  if (stats.completados >= 10) {
    insignias.push({
      id: "implacable",
      nombre: "Implacable",
      descripcion: "Ha completado al menos 10 contratos con éxito.",
      icono: "✹",
      rareza: "Legendaria",
      origen: "automatica"
    });
  }
  else if (stats.completados >= 5) {
    insignias.push({
      id: "profesional",
      nombre: "Profesional",
      descripcion: "Ha completado al menos 5 contratos con éxito.",
      icono: "◆",
      rareza: "Rara",
      origen: "automatica"
    });
  }

  if (finalizados >= 3 && stats.tasaExito === 100) {
    insignias.push({
      id: "expediente-impecable",
      nombre: "Expediente impecable",
      descripcion: "Mantiene una tasa de éxito del 100% con al menos 3 contratos finalizados.",
      icono: "✧",
      rareza: "Épica",
      origen: "automatica"
    });
  }

  if (peligro === "Extremo") {
    insignias.push({
      id: "amenaza-extrema",
      nombre: "Amenaza extrema",
      descripcion: "Clasificado en el nivel máximo de peligrosidad del archivo.",
      icono: "☠",
      rareza: "Legendaria",
      origen: "automatica"
    });
  }
  else if (peligro === "Severo") {
    insignias.push({
      id: "alto-riesgo",
      nombre: "Operador de alto riesgo",
      descripcion: "Clasificado con nivel de peligrosidad Severo.",
      icono: "▲",
      rareza: "Épica",
      origen: "automatica"
    });
  }

  if (especialidades >= 4) {
    insignias.push({
      id: "versatil",
      nombre: "Versátil",
      descripcion: "Domina al menos cuatro especialidades registradas.",
      icono: "✣",
      rareza: "Rara",
      origen: "automatica"
    });
  }

  if (stats.contratos.length >= 20) {
    insignias.push({
      id: "actividad-excepcional",
      nombre: "Actividad excepcional",
      descripcion: "Cuenta con al menos 20 contratos registrados en el archivo.",
      icono: "⬢",
      rareza: "Épica",
      origen: "automatica"
    });
  }

  if (stats.creditosGanados >= 1000000) {
    insignias.push({
      id: "millon-de-creditos",
      nombre: "Un millón de créditos",
      descripcion: "Ha acumulado al menos 1.000.000 de créditos en contratos completados.",
      icono: "◈",
      rareza: "Legendaria",
      origen: "automatica"
    });
  }

  return insignias;
}


function obtenerInsignias(hunter, stats) {

  const automaticas = calcularInsigniasAutomaticas(hunter, stats);
  const manuales = lista(hunter.insignias)
    .map((insignia, index) => normalizarInsigniaManual(insignia, index))
    .filter(Boolean);

  return {
    automaticas,
    manuales,
    puntosManuales: manuales.reduce(
      (total, insignia) => total + (insignia.puntosRanking || 0),
      0
    ),
    total: automaticas.length + manuales.length
  };
}


function claseRareza(rareza = "") {
  return clase(rareza || "especial");
}


function renderTarjetaInsignia(insignia) {

  return `
    <article class="badge-card badge-${claseRareza(insignia.rareza)}">

      <div class="badge-emblem" aria-hidden="true">
        ${esc(insignia.icono || "◆")}
      </div>

      <div class="badge-card-body">

        <div class="badge-card-topline">
          <span class="badge-rarity">
            ${esc(insignia.rareza || "Especial")}
          </span>

          <span class="badge-origin ${insignia.origen === "manual" ? "is-manual" : "is-auto"}">
            ${insignia.origen === "manual" ? "ESPECIAL" : "AUTOMÁTICA"}
          </span>

          ${
            insignia.origen === "manual" && insignia.puntosRanking > 0
              ? `<span class="badge-ranking-points">+${insignia.puntosRanking} PTS RANKING</span>`
              : ""
          }
        </div>

        <h4>${esc(insignia.nombre)}</h4>

        <p>${esc(insignia.descripcion || "Sin descripción registrada.")}</p>

      </div>

    </article>
  `;
}


function renderInsignias(hunter, stats) {

  const insignias = obtenerInsignias(hunter, stats);

  return `
    <div class="badges-tab">

      <div class="badges-hero">
        <div>
          <span class="eyebrow">DISTINCIONES DEL EXPEDIENTE</span>
          <h3>Insignias</h3>
          <p>
            Distinciones obtenidas automáticamente por trayectoria y rendimiento,
            junto con insignias especiales registradas manualmente.
          </p>
        </div>

        <div class="badges-summary">
          <div class="badges-count">
            <strong>${insignias.total}</strong>
            <span>${insignias.total === 1 ? "INSIGNIA" : "INSIGNIAS"}</span>
          </div>

          <div class="badges-ranking-total">
            <strong>+${insignias.puntosManuales}</strong>
            <span>PTS RANKING</span>
          </div>
        </div>
      </div>

      <section class="badges-section">
        <div class="badges-section-heading">
          <div>
            <span class="badges-section-kicker">REGISTRO AUTOMÁTICO</span>
            <h4>Insignias de trayectoria</h4>
          </div>
          <span class="badges-section-count">${insignias.automaticas.length}</span>
        </div>

        ${
          insignias.automaticas.length
            ? `<div class="badges-grid">${insignias.automaticas.map(renderTarjetaInsignia).join("")}</div>`
            : `
              <div class="badges-empty">
                <span>◇</span>
                <div>
                  <strong>SIN INSIGNIAS AUTOMÁTICAS</strong>
                  <p>Este expediente todavía no cumple los requisitos de ninguna distinción automática.</p>
                </div>
              </div>
            `
        }
      </section>

      <section class="badges-section badges-section-manual">
        <div class="badges-section-heading">
          <div>
            <span class="badges-section-kicker">REGISTRO ESPECIAL</span>
            <h4>Insignias personalizadas</h4>
          </div>
          <span class="badges-section-count">${insignias.manuales.length}</span>
        </div>

        ${
          insignias.manuales.length
            ? `<div class="badges-grid">${insignias.manuales.map(renderTarjetaInsignia).join("")}</div>`
            : `
              <div class="badges-empty badges-empty-manual">
                <span>＋</span>
                <div>
                  <strong>SIN INSIGNIAS ESPECIALES</strong>
                  <p>Puedes añadirlas manualmente desde el campo <code>insignias</code> de este cazarrecompensas en el JSON.</p>
                </div>
              </div>
            `
        }
      </section>

    </div>
  `;
}


/* =========================================================
   COMPARADOR DE CAZARRECOMPENSAS
========================================================= */

function puntuacionRankingHunter(hunter) {

  const stats = calcularEstadisticas(hunter.id);
  const puntosPeligrosidad =
    PUNTOS_PELIGROSIDAD[hunter.peligrosidad] || 0;

  const puntosInsignias =
    calcularPuntosInsigniasManuales(hunter);

  return (
    (stats.completados * 10) +
    stats.puntosContratos +
    (puntosPeligrosidad * 3) +
    puntosInsignias
  );
}


function iniciarComparador() {

  if (!comparadorA || !comparadorB) return;

  const opciones = CAZARRECOMPENSAS
    .slice()
    .sort((a, b) =>
      String(a.nombre || "").localeCompare(
        String(b.nombre || ""),
        "es"
      )
    )
    .map(hunter => `
      <option value="${esc(hunter.id)}">
        ${esc(hunter.nombre)}
      </option>
    `)
    .join("");

  comparadorA.innerHTML = `
    <option value="">Seleccionar cazarrecompensas...</option>
    ${opciones}
  `;

  comparadorB.innerHTML = `
    <option value="">Seleccionar cazarrecompensas...</option>
    ${opciones}
  `;

  comparadorA.addEventListener("change", actualizarComparador);
  comparadorB.addEventListener("change", actualizarComparador);
}


function actualizarComparador() {

  if (!comparadorA || !comparadorB || !resultadoComparador) return;

  const idA = comparadorA.value;
  const idB = comparadorB.value;

  if (!idA || !idB) {
    resultadoComparador.innerHTML = `
      <div class="compare-empty">
        Selecciona dos expedientes distintos para iniciar la comparación.
      </div>
    `;
    return;
  }

  if (idA === idB) {
    resultadoComparador.innerHTML = `
      <div class="compare-empty compare-warning">
        Selecciona dos cazarrecompensas diferentes para realizar la comparación.
      </div>
    `;
    return;
  }

  const hunterA = obtenerCazarrecompensas(idA);
  const hunterB = obtenerCazarrecompensas(idB);

  if (!hunterA || !hunterB) return;

  resultadoComparador.innerHTML = renderComparacion(hunterA, hunterB);

  resultadoComparador
    .querySelectorAll("[data-open-hunter]")
    .forEach(boton => {
      boton.addEventListener("click", () => {
        abrirPerfil(boton.dataset.openHunter);
      });
    });
}


function compararNumero(valorA, valorB) {
  const a = Number(valorA) || 0;
  const b = Number(valorB) || 0;

  return {
    a: a > b,
    b: b > a,
    empate: a === b
  };
}


function claseMejor(esMejor, empate) {
  if (empate) return "is-tie";
  return esMejor ? "is-better" : "";
}


function renderComparacion(hunterA, hunterB) {

  const statsA = calcularEstadisticas(hunterA.id);
  const statsB = calcularEstadisticas(hunterB.id);

  const valorA = calcularValoracion(hunterA, statsA);
  const valorB = calcularValoracion(hunterB, statsB);

  const rankingA = puntuacionRankingHunter(hunterA);
  const rankingB = puntuacionRankingHunter(hunterB);

  const anosA = parseInt(hunterA.anosActivo) || 0;
  const anosB = parseInt(hunterB.anosActivo) || 0;

  const comparaciones = {
    general: compararNumero(valorA.media, valorB.media),
    amenaza: compararNumero(valorA.amenaza, valorB.amenaza),
    experiencia: compararNumero(valorA.experiencia, valorB.experiencia),
    efectividad: compararNumero(statsA.tasaExito, statsB.tasaExito),
    actividad: compararNumero(statsA.contratos.length, statsB.contratos.length),
    completados: compararNumero(statsA.completados, statsB.completados),
    anos: compararNumero(anosA, anosB),
    ranking: compararNumero(rankingA, rankingB)
  };

  const cabecera = (hunter, lado) => `
    <article class="compare-hunter-card compare-hunter-${lado}">
      <div class="compare-hunter-image">
        ${imagenHTML(hunter)}
      </div>
      <div class="compare-hunter-info">
        <span class="eyebrow">EXPEDIENTE ${lado.toUpperCase()}</span>
        <h3>${esc(hunter.nombre)}</h3>
        <p>${esc(hunter.raza || "Raza desconocida")}</p>
        <div class="compare-hunter-badges">
          <span class="badge ${clase(hunter.peligrosidad)}">
            ${esc(hunter.peligrosidad || "Sin clasificar")}
          </span>
          <span class="badge">
            ${esc(hunter.estado || "Desconocido")}
          </span>
        </div>
        <button
          class="compare-open-profile"
          type="button"
          data-open-hunter="${esc(hunter.id)}"
        >
          ABRIR EXPEDIENTE
        </button>
      </div>
    </article>
  `;

  const fila = (
    etiqueta,
    valorIzquierda,
    valorDerecha,
    comparacion,
    extraClass = ""
  ) => `
    <div class="compare-stat-row ${extraClass}">
      <div class="compare-stat-value ${claseMejor(comparacion.a, comparacion.empate)}">
        ${valorIzquierda}
        ${comparacion.a ? '<small class="compare-best">MEJOR</small>' : ''}
      </div>
      <div class="compare-stat-label">${etiqueta}</div>
      <div class="compare-stat-value ${claseMejor(comparacion.b, comparacion.empate)}">
        ${valorDerecha}
        ${comparacion.b ? '<small class="compare-best">MEJOR</small>' : ''}
      </div>
    </div>
  `;

  return `
    <div class="compare-head-to-head">
      ${cabecera(hunterA, "a")}
      <div class="compare-center-mark">VS</div>
      ${cabecera(hunterB, "b")}
    </div>

    <div class="compare-table">
      ${fila(
        "VALORACIÓN GENERAL",
        `<div class="compare-stars">${generarEstrellas(valorA.estrellasGenerales)}</div><strong>${valorA.media.toFixed(1)} / 5</strong>`,
        `<div class="compare-stars">${generarEstrellas(valorB.estrellasGenerales)}</div><strong>${valorB.media.toFixed(1)} / 5</strong>`,
        comparaciones.general,
        "compare-main-rating"
      )}

      ${fila(
        "AMENAZA",
        `${generarEstrellas(valorA.amenaza)}<strong>${esc(hunterA.peligrosidad || "Desconocido")}</strong>`,
        `${generarEstrellas(valorB.amenaza)}<strong>${esc(hunterB.peligrosidad || "Desconocido")}</strong>`,
        comparaciones.amenaza,
        "compare-threat-row"
      )}

      ${fila(
        "EXPERIENCIA",
        `${generarEstrellas(valorA.experiencia)}<strong>${esc(formatoAnios(hunterA.anosActivo))}</strong>`,
        `${generarEstrellas(valorB.experiencia)}<strong>${esc(formatoAnios(hunterB.anosActivo))}</strong>`,
        comparaciones.experiencia
      )}

      ${fila(
        "EFECTIVIDAD",
        `${generarEstrellas(valorA.efectividad)}<strong>${statsA.tasaExito}%</strong>`,
        `${generarEstrellas(valorB.efectividad)}<strong>${statsB.tasaExito}%</strong>`,
        comparaciones.efectividad
      )}

      ${fila(
        "ACTIVIDAD",
        `${generarEstrellas(valorA.actividad)}<strong>${statsA.contratos.length} contratos</strong>`,
        `${generarEstrellas(valorB.actividad)}<strong>${statsB.contratos.length} contratos</strong>`,
        comparaciones.actividad
      )}

      ${fila(
        "CONTRATOS COMPLETADOS",
        `<strong>${statsA.completados}</strong>`,
        `<strong>${statsB.completados}</strong>`,
        comparaciones.completados
      )}

      ${fila(
        "AÑOS EN ACTIVO",
        `<strong>${esc(formatoAnios(hunterA.anosActivo))}</strong>`,
        `<strong>${esc(formatoAnios(hunterB.anosActivo))}</strong>`,
        comparaciones.anos
      )}

      ${fila(
        "PUNTOS DE RANKING",
        `<strong>${rankingA} PTS</strong>`,
        `<strong>${rankingB} PTS</strong>`,
        comparaciones.ranking
      )}
    </div>
  `;
}


/* =========================================================
   ABRIR EXPEDIENTE
========================================================= */

function abrirPerfil(
  id
) {

  const hunter =
    CAZARRECOMPENSAS.find(
      item =>
        item.id === id
    );


  if (!hunter) {
    return;
  }


  const stats =
    calcularEstadisticas(
      hunter.id
    );


  const valoracion =
    calcularValoracion(
      hunter,
      stats
    );


  const insignias =
    obtenerInsignias(
      hunter,
      stats
    );


  contenidoPerfil.innerHTML = `

    <div class="profile-hero">

      <div class="profile-visual">

        ${imagenHTML(hunter)}

      </div>


      <div class="profile-info">

        <span class="eyebrow">

          EXPEDIENTE INDIVIDUAL

        </span>


        <h2 id="nombrePerfil">

          ${esc(hunter.nombre)}

        </h2>


        ${
          hunter.alias
            ? `

              <div class="profile-alias">

                Alias:
                ${esc(hunter.alias)}

              </div>

            `
            : ""
        }


        <div class="info-grid">


          ${infoBox(
            "Raza",
            hunter.raza
          )}


          ${infoBox(
            "Edad",
            formatoAnios(hunter.edad)
          )}


          ${infoBox(
            "Años en activo",
            formatoAnios(hunter.anosActivo)
          )}


          ${infoBox(
            "Planeta de origen",
            hunter.planetaOrigen
          )}


          ${infoBox(
            "Estado",
            hunter.estado
          )}


          ${infoBox(
            "Peligrosidad",
            hunter.peligrosidad
          )}


          ${infoBox(
            "Afiliación",
            hunter.afiliacion
          )}

        </div>


        <div class="chips profile-specialties">

          ${
            lista(
              hunter.especialidades
            )
            .map(
              especialidad => `

                <span class="chip">

                  ${
                    esc(
                      especialidad
                    )
                  }

                </span>

              `
            )
            .join("")
          }

        </div>

      </div>

    </div>



    <!-- PESTAÑAS -->

    <div class="tabs">

      <button
        type="button"
        class="tab-btn active"
        data-tab="perfil"
      >
        Perfil
      </button>


      <button
        type="button"
        class="tab-btn"
        data-tab="valoracion"
      >
        Valoración
      </button>


      <button
        type="button"
        class="tab-btn"
        data-tab="insignias"
      >
        Insignias
        <span class="tab-badge-count">${insignias.total}</span>
      </button>


      <button
        type="button"
        class="tab-btn"
        data-tab="equipo"
      >
        Equipamiento
      </button>


      <button
        type="button"
        class="tab-btn"
        data-tab="contratos"
      >
        Contratos
      </button>

        <button
            type="button"
            class="tab-btn"
            data-tab="relaciones"
            >
            Relaciones
            </button>
    </div>



    <!-- PERFIL -->

    <section
      id="tab-perfil"
      class="tab-pane active"
    >

      <div class="profile-section">

        <h3>
          Descripción
        </h3>

        <p>

          ${
            esc(
              hunter.descripcion ||
              "Sin descripción registrada."
            )
          }

        </p>

      </div>


      <div class="profile-section profile-rating-summary">

        <div class="profile-rating-summary-head">
          <h3>
            Valoración general
          </h3>

          <strong class="profile-rating-score">
            ${valoracion.media.toFixed(1)} / 5
          </strong>
        </div>

        <div class="profile-rating-stars">
          ${generarEstrellas(valoracion.estrellasGenerales)}
        </div>

      </div>


      <div class="profile-section">

        <h3>
          Historia
        </h3>

        <div class="historia-texto">

        ${renderHistoria(hunter.historia)}

        </div>

      </div>

          
      ${
        lista(
          hunter.zonasOperacion
        ).length

        ? `

          <div class="profile-section">

            <h3>
              Zonas de operación
            </h3>

            <div class="chips">

              ${
                hunter.zonasOperacion
                  .map(
                    zona => `

                      <span class="chip">

                        ${esc(zona)}

                      </span>

                    `
                  )
                  .join("")
              }

            </div>

          </div>

        `

        : ""
      }

    </section>



    <!-- VALORACIÓN -->

    <section
      id="tab-valoracion"
      class="tab-pane"
    >

      <div class="rating-main">

        <span class="eyebrow">
          EVALUACIÓN DEL ARCHIVO
        </span>

        <h3>
          Valoración general
        </h3>

        <div class="rating-main-stars">
          ${generarEstrellas(valoracion.estrellasGenerales)}
        </div>

        <div class="rating-main-number">
          ${valoracion.media.toFixed(1)}
          <span>/ 5</span>
        </div>

        <p>
          Valoración calculada automáticamente a partir de la amenaza,
          la experiencia, la efectividad y la actividad registrada.
        </p>

      </div>


      <div class="rating-grid">

        <div class="rating-card rating-threat">

          <div class="rating-card-header">
            <span>AMENAZA</span>
            <strong>${esc(hunter.peligrosidad || "Desconocido")}</strong>
          </div>

          ${generarEstrellas(valoracion.amenaza)}

        </div>


        <div class="rating-card">

          <div class="rating-card-header">
            <span>EXPERIENCIA</span>
            <strong>${esc(formatoAnios(hunter.anosActivo))}</strong>
          </div>

          ${generarEstrellas(valoracion.experiencia)}

        </div>


        <div class="rating-card">

          <div class="rating-card-header">
            <span>EFECTIVIDAD</span>
            <strong>${stats.tasaExito}%</strong>
          </div>

          ${generarEstrellas(valoracion.efectividad)}

        </div>


        <div class="rating-card">

          <div class="rating-card-header">
            <span>ACTIVIDAD</span>
            <strong>
              ${stats.contratos.length}
              ${stats.contratos.length === 1 ? "contrato" : "contratos"}
            </strong>
          </div>

          ${generarEstrellas(valoracion.actividad)}

        </div>

      </div>

    </section>



    <!-- INSIGNIAS -->

    <section
      id="tab-insignias"
      class="tab-pane"
    >

      ${renderInsignias(hunter, stats)}

    </section>



    <!-- EQUIPAMIENTO -->

    <section
      id="tab-equipo"
      class="tab-pane"
    >

      <div class="profile-section">

        <h3>
          Armamento
        </h3>

        ${
          listaEquipo(
            hunter.armamento
          )
        }

      </div>


      <div class="profile-section">

        <h3>
          Equipamiento
        </h3>

        ${
          listaEquipo(
            hunter.equipamiento
          )
        }

      </div>


      ${
        hunter.nave
          ? `

            <div class="profile-section">

              <h3>
                Nave / vehículo
              </h3>

              <div class="ship-box">

                ${esc(hunter.nave)}

              </div>

            </div>

          `
          : ""
      }

    </section>



    <!-- CONTRATOS -->

    <section
      id="tab-contratos"
      class="tab-pane"
    >

      <div class="stats-grid">


        <div class="stat">

          <strong>

            ${stats.contratos.length}

          </strong>

          <span>
            Contratos
          </span>

        </div>


        <div class="stat">

          <strong>

            ${stats.completados}

          </strong>

          <span>
            Completados
          </span>

        </div>


        <div class="stat">

          <strong>

            ${stats.fallidos}

          </strong>

          <span>
            Fallidos
          </span>

        </div>


        <div class="stat">

          <strong>

            ${stats.aceptados}

          </strong>

          <span>
            Aceptados
          </span>

        </div>


        <div class="stat">

          <strong>

            ${stats.tasaExito}%

          </strong>

          <span>
            Tasa de éxito
          </span>

        </div>


        <div class="stat">

          <strong>

            ${stats.puntosContratos}

          </strong>

          <span>
            Puntos de contratos
          </span>

        </div>

      </div>


      <div class="profile-section">

        <h3>
          Créditos obtenidos
        </h3>

        <p class="credits-total">

          ${
            creditos(
              stats.creditosGanados
            )
          }

        </p>

      </div>


      <div class="profile-section">

        <h3>
          Historial de contratos
        </h3>

        ${
          renderContratos(
            stats.contratos
          )
        }

      </div>

    </section>



    <!-- RELACIONES -->

    <section
      id="tab-relaciones"
      class="tab-pane"
    >

      ${renderRelaciones(hunter)}

    </section>

  `;


  configurarTabs();


  modal.classList.add(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}



/* =========================================================
   PESTAÑAS
========================================================= */

function configurarTabs() {

  const botones =
    contenidoPerfil.querySelectorAll(
      ".tab-btn"
    );


  const paneles =
    contenidoPerfil.querySelectorAll(
      ".tab-pane"
    );


  botones.forEach(
    boton => {

      boton.addEventListener(
        "click",
        () => {

          botones.forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


          paneles.forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


          boton.classList.add(
            "active"
          );


          const panel =
            document.getElementById(
              `tab-${boton.dataset.tab}`
            );


          if (panel) {

            panel.classList.add(
              "active"
            );

          }

        }
      );

    }
  );

}



/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarModal() {

  if (!modal) return;


  modal.classList.remove(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}



/* =========================================================
   EVENTOS
========================================================= */

document
  .querySelectorAll(
    "[data-cerrar-modal]"
  )
  .forEach(
    elemento => {

      elemento.addEventListener(
        "click",
        cerrarModal
      );

    }
  );


document.addEventListener(
  "keydown",
  evento => {

    if (
      evento.key === "Escape"
    ) {

      cerrarModal();

    }

  }
);


if (busqueda) {

  busqueda.addEventListener(
    "input",
    filtrar
  );

}


if (filtroPeligrosidad) {

  filtroPeligrosidad.addEventListener(
    "change",
    filtrar
  );

}


if (filtroEstado) {

  filtroEstado.addEventListener(
    "change",
    filtrar
  );

}



/* =========================================================
   INICIAR PÁGINA
========================================================= */
function normalizarClase(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}


function toggleContratoDetalle(id, boton) {

  const detalle = document.getElementById(id);

  if (!detalle) return;

  const estaAbierto = !detalle.hidden;

  detalle.hidden = estaAbierto;

  boton.setAttribute(
    "aria-expanded",
    estaAbierto ? "false" : "true"
  );

  const texto = boton.querySelector("span:first-child");
  const flecha = boton.querySelector(".contract-toggle-arrow");

  if (texto) {
    texto.textContent =
      estaAbierto
        ? "VER DETALLES"
        : "OCULTAR DETALLES";
  }

  if (flecha) {
    flecha.textContent =
      estaAbierto
        ? "⌄"
        : "⌃";
  }
}
function obtenerCazarrecompensas(id) {

  return CAZARRECOMPENSAS.find(
    hunter => hunter.id === id
  );

}

function renderRelaciones(hunter) {

  const aliados = (hunter.aliados || [])
    .map(id => obtenerCazarrecompensas(id))
    .filter(Boolean);

  const enemigos = (hunter.enemigos || [])
    .map(id => obtenerCazarrecompensas(id))
    .filter(Boolean);


  if (aliados.length === 0 && enemigos.length === 0) {

    return `
      <div class="relations-empty">

        <span class="relations-empty-icon">
          ◇
        </span>

        <strong>
          SIN RELACIONES REGISTRADAS
        </strong>

        <p>
          No existen aliados, enemigos o rivales conocidos
          asociados a este cazarrecompensas.
        </p>

      </div>
    `;
  }


  return `
    <div class="relations-tab">

      ${
        aliados.length > 0
          ? `
            <section class="relation-group">

              <div class="relation-heading ally-heading">

                <span class="relation-symbol">
                  +
                </span>

                <div>
                  <strong>ALIADOS</strong>

                  <span>
                    Contactos y asociados conocidos
                  </span>
                </div>

              </div>


              <div class="relations-grid">

                ${aliados.map(aliado => `
                  <button
                    class="relation-card relation-ally"
                    type="button"
                    onclick="abrirPerfil('${aliado.id}')"
                  >

                    <img
                      src="${esc(aliado.imagen)}"
                      alt="${esc(aliado.nombre)}"
                    >

                    <div class="relation-info">

                      <strong>
                        ${esc(aliado.nombre)}
                      </strong>

                      <span>
                        ${esc(aliado.raza || "Raza desconocida")}
                      </span>

                      <small>
                        ${esc(aliado.peligrosidad || "Sin clasificar")}
                      </small>

                    </div>

                    <span class="relation-arrow">
                      ›
                    </span>

                  </button>
                `).join("")}

              </div>

            </section>
          `
          : ""
      }


      ${
        enemigos.length > 0
          ? `
            <section class="relation-group">

              <div class="relation-heading enemy-heading">

                <span class="relation-symbol">
                  ×
                </span>

                <div>
                  <strong>ENEMIGOS / RIVALES</strong>

                  <span>
                    Individuos considerados hostiles
                  </span>
                </div>

              </div>


              <div class="relations-grid">

                ${enemigos.map(enemigo => `
                  <button
                    class="relation-card relation-enemy"
                    type="button"
                    onclick="abrirPerfil('${enemigo.id}')"
                  >

                    <img
                      src="${esc(enemigo.imagen)}"
                      alt="${esc(enemigo.nombre)}"
                    >

                    <div class="relation-info">

                      <strong>
                        ${esc(enemigo.nombre)}
                      </strong>

                      <span>
                        ${esc(enemigo.raza || "Raza desconocida")}
                      </span>

                      <small>
                        ${esc(enemigo.peligrosidad || "Sin clasificar")}
                      </small>

                    </div>

                    <span class="relation-arrow">
                      ›
                    </span>

                  </button>
                `).join("")}

              </div>

            </section>
          `
          : ""
      }

    </div>
  `;
}

cargarDatos();
import {
  gameState
}
from "./state.js";


import {
  getAllRaces
}
from "./races.js";


/* =========================
   DATOS DE GENERACIÓN
========================= */

const planetPrefixes = [
  "Kael",
  "Vorax",
  "Nyr",
  "Talos",
  "Xeron",
  "Astra",
  "Vel",
  "Kor",
  "Zeth",
  "Erebus",
  "Orion",
  "Nexus",
  "Drakon",
  "Aurelia",
  "Thar"
];


const romanNumbers = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX"
];


const planetTypes = [

  {
    name:
      "Mundo oceánico",

    dangerModifier:
      0,

    description:
      "Un planeta cubierto por enormes océanos y archipiélagos dispersos."
  },

  {
    name:
      "Mundo desértico",

    dangerModifier:
      1,

    description:
      "Un mundo árido dominado por extensos desiertos y temperaturas extremas."
  },

  {
    name:
      "Mundo volcánico",

    dangerModifier:
      2,

    description:
      "Su superficie presenta intensa actividad volcánica y grandes reservas minerales."
  },

  {
    name:
      "Mundo selvático",

    dangerModifier:
      1,

    description:
      "La superficie está cubierta por una biosfera extremadamente densa."
  },

  {
    name:
      "Mundo helado",

    dangerModifier:
      1,

    description:
      "Grandes capas de hielo cubren prácticamente toda su superficie."
  },

  {
    name:
      "Mundo continental",

    dangerModifier:
      0,

    description:
      "Posee océanos, continentes y condiciones relativamente estables."
  },

  {
    name:
      "Mundo tóxico",

    dangerModifier:
      3,

    description:
      "Su atmósfera contiene compuestos extremadamente peligrosos para la vida conocida."
  },

  {
    name:
      "Gigante gaseoso",

    dangerModifier:
      2,

    description:
      "Un enorme planeta gaseoso rodeado de lunas y grandes tormentas atmosféricas."
  }

];


/* =========================
   REFERENCIAS A FUNCIONES
========================= */

let updateInterfaceCallback =
  null;

let addLogCallback =
  null;


/* =========================
   INICIALIZAR EXPLORACIÓN
========================= */

export function initializeExploration(
  {
    updateInterface,
    addLog
  }
) {

  updateInterfaceCallback =
    updateInterface;

  addLogCallback =
    addLog;

}


/* =========================
   AUXILIARES
========================= */

function randomItem(
  array
) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];

}


function randomNumber(
  min,
  max
) {

  return Math.floor(
    Math.random() *
    (
      max -
      min +
      1
    )
  ) + min;

}


/* =========================
   GENERAR PLANETA
========================= */

function generatePlanet() {

  const type =
    randomItem(
      planetTypes
    );


  const planetName =
    randomItem(
      planetPrefixes
    )
    +
    " "
    +
    randomItem(
      romanNumbers
    );


  let danger =
    randomNumber(
      1,
      5
    )
    +
    type.dangerModifier;


  if (
    danger > 10
  ) {

    danger =
      10;

  }


  return {

    id:
      crypto.randomUUID
        ?
        crypto.randomUUID()
        :
        Date.now()
        +
        "-"
        +
        Math.random(),

    name:
      planetName,

    type:
      type.name,

    description:
      type.description,

    minerals:
      randomNumber(
        10,
        100
      ),

    energy:
      randomNumber(
        5,
        80
      ),

    danger:
      danger,

    civilization:
      generateCivilization()

  };

}


/* =========================
   GENERAR CIVILIZACIÓN
========================= */

function generateCivilization() {

  const roll =
    Math.random();


  /*
    45% sin civilización
    20% pacífica
    20% neutral
    15% hostil
  */

  if (
    roll < 0.45
  ) {

    return null;

  }


  const allRaces =
    getAllRaces();


  /*
    Evitamos encontrar
    nuestra propia raza.
  */

  const availableRaces =
    allRaces.filter(
      race =>
        race.id !==
        gameState.raceId
    );


  if (
    availableRaces.length ===
    0
  ) {

    return null;

  }


  const selectedRace =
    randomItem(
      availableRaces
    );


  let attitude;


  if (
    roll < 0.65
  ) {

    attitude =
      "Pacífica";

  }
  else if (
    roll < 0.85
  ) {

    attitude =
      "Neutral";

  }
  else {

    attitude =
      "Hostil";

  }


  return {

    raceId:
      selectedRace.id,

    name:
      selectedRace.name,

    homeworld:
      selectedRace.homeworld,

    attitude:
      attitude,

    technology:
      selectedRace.ratings
        ?.technology
      ??
      randomNumber(
        1,
        10
      ),

    military:
      selectedRace.ratings
        ?.military
      ??
      randomNumber(
        1,
        10
      )

  };

}


/* =========================
   EXPLORAR
========================= */

export function explore() {

  const explorationCost =
    10;


  if (
    gameState.energy <
    explorationCost
  ) {

    addLogCallback?.(
      "No hay suficiente energía para lanzar una expedición."
    );

    return;

  }


  gameState.energy -=
    explorationCost;


  const planet =
    generatePlanet();


  gameState
    .discoveredPlanets
    .push(
      planet
    );


  addLogCallback?.(
    "Los sensores han localizado "
    +
    planet.name
    +
    ", clasificado como "
    +
    planet.type
    +
    "."
  );


  if (
    planet.civilization
  ) {

    addLogCallback?.(
      "Se han detectado señales de la civilización "
      +
      planet.civilization.name
      +
      "."
    );

  }


  updateInterfaceCallback?.();


  renderPlanets();


  showDiscoveryModal(
    planet
  );

}


/* =========================
   RENDERIZAR PLANETAS
========================= */

export function renderPlanets() {

  const grid =
    document.getElementById(
      "planetGrid"
    );


  if (!grid) {
    return;
  }


  grid.innerHTML =
    "";


  if (
    gameState
      .discoveredPlanets
      .length ===
    0
  ) {

    grid.innerHTML = `
      <div
        id="emptyExplorationMessage"
        style="
          color:#64748b;
          font-size:0.9rem;
        "
      >
        Ningún planeta descubierto todavía.
        Envía una expedición para comenzar
        la exploración.
      </div>
    `;

  }


  gameState
    .discoveredPlanets
    .forEach(
      planet => {

        const card =
          document.createElement(
            "div"
          );


        card.className =
          "planet-card";


        let civilizationHTML;


        if (
          planet.civilization
        ) {

          const attitudeClass =
            getAttitudeClass(
              planet
                .civilization
                .attitude
            );


          civilizationHTML = `
            <div
              class="civilization-box"
            >

              <small>
                Civilización detectada
              </small>

              <strong>
                ${planet.civilization.name}
              </strong>

              <span
                class="
                  attitude
                  ${attitudeClass}
                "
              >
                ${planet.civilization.attitude}
              </span>

            </div>
          `;

        }
        else {

          civilizationHTML = `
            <div
              class="civilization-box"
            >

              <small>
                Civilización
              </small>

              <span
                class="attitude none"
              >
                No detectada
              </span>

            </div>
          `;

        }


        card.innerHTML = `
          <div
            class="planet-card-top"
          >

            <h4>
              ${planet.name}
            </h4>

            <span
              class="planet-type"
            >
              ${planet.type}
            </span>

          </div>


          <div
            class="planet-stat"
          >

            <span>
              Minerales
            </span>

            <strong>
              ${planet.minerals}
            </strong>

          </div>


          <div
            class="planet-stat"
          >

            <span>
              Energía
            </span>

            <strong>
              ${planet.energy}
            </strong>

          </div>


          <div
            class="planet-stat"
          >

            <span>
              Peligro
            </span>

            <strong>
              ${planet.danger}/10
            </strong>

          </div>


          ${civilizationHTML}
        `;


        grid.appendChild(
          card
        );

      }
    );


  const planetCount =
    document.getElementById(
      "planetCount"
    );


  if (
    planetCount
  ) {

    planetCount.textContent =
      gameState
        .discoveredPlanets
        .length
      +
      " detectados";

  }

}


/* =========================
   CLASE DE ACTITUD
========================= */

function getAttitudeClass(
  attitude
) {

  if (
    attitude ===
    "Pacífica"
  ) {

    return "peaceful";

  }


  if (
    attitude ===
    "Neutral"
  ) {

    return "neutral";

  }


  if (
    attitude ===
    "Hostil"
  ) {

    return "hostile";

  }


  return "none";

}


/* =========================
   MODAL
========================= */

export function showDiscoveryModal(
  planet
) {

  const modal =
    document.getElementById(
      "discoveryModal"
    );


  if (!modal) {
    return;
  }


  setText(
    "modalPlanetName",
    planet.name
  );


  setText(
    "modalDescription",
    planet.description
  );


  setText(
    "modalType",
    planet.type
  );


  setText(
    "modalDanger",
    planet.danger
    +
    "/10"
  );


  setText(
    "modalMinerals",
    planet.minerals
  );


  setText(
    "modalEnergy",
    planet.energy
  );


  const civilizationBox =
    document.getElementById(
      "modalCivilization"
    );


  if (
    civilizationBox
  ) {

    if (
      planet.civilization
    ) {

      civilizationBox.innerHTML = `
        <strong>
          Civilización detectada:
          ${planet.civilization.name}
        </strong>

        <br><br>

        Actitud:
        ${planet.civilization.attitude}

        <br>

        Nivel tecnológico:
        ${planet.civilization.technology}/10

        <br>

        Poder militar:
        ${planet.civilization.military}/10
      `;

    }
    else {

      civilizationBox.innerHTML = `
        <strong>
          No se han detectado
          civilizaciones inteligentes.
        </strong>

        <br><br>

        El planeta parece estar libre
        de actividad tecnológica conocida.
      `;

    }

  }


  modal.classList.add(
    "active"
  );

}


/* =========================
   CERRAR MODAL
========================= */

export function closeDiscoveryModal() {

  const modal =
    document.getElementById(
      "discoveryModal"
    );


  if (
    modal
  ) {

    modal.classList.remove(
      "active"
    );

  }

}


/* =========================
   AUXILIAR DOM
========================= */

function setText(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (
    element
  ) {

    element.textContent =
      value;

  }

}
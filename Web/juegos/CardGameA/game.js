/* ==========================================================
   PROJECT NEXUS - game.js

   EXPLORACIÓN AMPLIADA:
   - Escaneo profundo
   - Expediciones científicas
   - Estudio planetario
   - Amenazas ocultas
   - Investigación de amenazas
   - Retirada de expediciones
   - Rasgos planetarios configurables
   - Sistema preparado para añadir más amenazas y rasgos

   ADEMÁS CONSERVA:
   - Razas
   - Investigación visual
   - Minería
   - Colonización
   - Flota
   - Diplomacia
   - Mercado
   - Turnos y producción
   ========================================================== */


/* ==========================================================
   1. CIVILIZACIONES / RAZAS
   ========================================================== */

const races = {

  foxers: {
    name: "Foxers",
    homeworld: "Aetheria",
    image: "../../../Especies alienigenas/Los Foxers/Los Foxers.png",
    playstyle: "Tecnología e ingeniería",

    description:
      "Civilización altamente tecnológica especializada en ingeniería, robótica y sistemas defensivos.",

    technology: 9,
    military: 4,
    economy: 7,
    defense: 9,

    startingResources: {
      credits: 550,
      minerals: 220,
      energy: 200,
      science: 50,
      militaryPower: 8
    },

    modifiers: {
      research: 1.30,
      creditProduction: 1.05,
      mineralProduction: 1.00,
      energyProduction: 1.10,
      militaryPowerGain: 0.90
    }
  },


  aracnosephus: {
    name: "AracnoSephus",
    homeworld: "Webitia",
    image: "../../../Especies alienigenas/AracnoSephus/AracnoSephus.png",
    playstyle: "Expansión y guerra",

    description:
      "Civilización agresiva y expansionista especializada en conquista, obtención de recursos y poder militar.",

    technology: 6,
    military: 8,
    economy: 8,
    defense: 6,

    startingResources: {
      credits: 650,
      minerals: 300,
      energy: 140,
      science: 20,
      militaryPower: 18
    },

    modifiers: {
      research: 0.95,
      creditProduction: 1.20,
      mineralProduction: 1.20,
      energyProduction: 0.95,
      militaryPowerGain: 1.15
    }
  },


  sterons: {
    name: "Sterons",
    homeworld: "Gradius 4",
    image: "../../../Especies alienigenas/Sterons/Steron.png",
    playstyle: "Conquista militar",

    description:
      "Civilización militarista orientada a la conquista, la expansión territorial y la guerra.",

    technology: 6,
    military: 9,
    economy: 6,
    defense: 7,

    startingResources: {
      credits: 450,
      minerals: 320,
      energy: 130,
      science: 15,
      militaryPower: 22
    },

    modifiers: {
      research: 0.90,
      creditProduction: 0.95,
      mineralProduction: 1.15,
      energyProduction: 0.95,
      militaryPowerGain: 1.30
    }
  },


  varyths: {
    name: "Varyths",
    homeworld: "Sabaya",
    image: "../../../Especies alienigenas/Varyths/Varyth.png",
    playstyle: "Combate y guerra",

    description:
      "Civilización guerrera muy preparada para el combate y con una fuerte tradición militar.",

    technology: 5,
    military: 9,
    economy: 5,
    defense: 7,

    startingResources: {
      credits: 400,
      minerals: 280,
      energy: 160,
      science: 15,
      militaryPower: 24
    },

    modifiers: {
      research: 0.90,
      creditProduction: 0.95,
      mineralProduction: 1.05,
      energyProduction: 1.00,
      militaryPowerGain: 1.35
    }
  },


  xelthorianos: {
    name: "Xel'thorianos",
    homeworld: "Sapphire Dom",
    image: "../../../Especies alienigenas/Xelthorianos/Xelthoriano.jpeg",
    playstyle: "Energía y ciencia",

    description:
      "Civilización avanzada con gran capacidad energética, científica y tecnológica.",

    technology: 8,
    military: 6,
    economy: 6,
    defense: 7,

    startingResources: {
      credits: 500,
      minerals: 170,
      energy: 300,
      science: 35,
      militaryPower: 10
    },

    modifiers: {
      research: 1.15,
      creditProduction: 1.00,
      mineralProduction: 0.95,
      energyProduction: 1.35,
      militaryPowerGain: 1.00
    }
  },


  zornicos: {
    name: "Zornicos",
    homeworld: "Zorn 1",
    image: "../../../Especies alienigenas/Zornicos/Zornico.png",
    playstyle: "Equilibrado",

    description:
      "Civilización equilibrada con buenas capacidades militares, tecnológicas y económicas.",

    technology: 7,
    military: 7,
    economy: 7,
    defense: 7,

    startingResources: {
      credits: 500,
      minerals: 220,
      energy: 220,
      science: 25,
      militaryPower: 14
    },

    modifiers: {
      research: 1.00,
      creditProduction: 1.00,
      mineralProduction: 1.00,
      energyProduction: 1.10,
      militaryPowerGain: 1.05
    }
  }

};



/* ==========================================================
   2. ÁRBOLES DE INVESTIGACIÓN
   ==========================================================
   Puedes añadir todos los árboles y mejoras que quieras.
   ========================================================== */

const researchTrees = {

  energia: {
    name: "Energía",
    shortName: "Energía",

    description:
      "Reactores, distribución energética y sistemas de alta eficiencia.",

    color: "#38bdf8",

    upgrades: {

      reactores1: {
        name: "Reactores eficientes I",
        icon: "⚡",

        description:
          "Aumenta un 10% la producción energética básica.",

        scienceCost: 20,

        position: {
          x: 2,
          y: 0
        },

        requires: [],

        effects: [
          {
            type: "energyProductionBonus",
            value: 0.10
          }
        ]
      },


      reactores2: {
        name: "Reactores eficientes II",
        icon: "⚡",

        description:
          "Aumenta un 15% adicional la producción energética.",

        scienceCost: 40,

        position: {
          x: 2,
          y: 1
        },

        requires: [
          "energia.reactores1"
        ],

        effects: [
          {
            type: "energyProductionBonus",
            value: 0.15
          }
        ]
      },


      acumuladores: {
        name: "Acumuladores avanzados",
        icon: "▣",

        description:
          "Sistemas mejorados de almacenamiento energético.",

        scienceCost: 35,

        position: {
          x: 1,
          y: 2
        },

        requires: [
          "energia.reactores2"
        ],

        effects: [
          {
            type: "energyProductionBonus",
            value: 0.05
          }
        ]
      },


      redesEnergeticas: {
        name: "Redes energéticas",
        icon: "⌁",

        description:
          "Reduce las pérdidas en las redes de distribución.",

        scienceCost: 35,

        position: {
          x: 3,
          y: 2
        },

        requires: [
          "energia.reactores2"
        ],

        effects: [
          {
            type: "energyProductionBonus",
            value: 0.05
          }
        ]
      },


      fusionControlada: {
        name: "Fusión controlada",
        icon: "☀",

        description:
          "Una revolución energética de gran escala.",

        scienceCost: 80,

        position: {
          x: 2,
          y: 3
        },

        requires: [
          "energia.acumuladores",
          "energia.redesEnergeticas"
        ],

        effects: [
          {
            type: "energyProductionBonus",
            value: 0.25
          }
        ]
      }

    }
  },


  exploracion: {
    name: "Exploración",
    shortName: "Exploración",

    description:
      "Motores, sensores y tecnología destinada a recorrer el espacio.",

    color: "#a78bfa",

    upgrades: {

      motores1: {
        name: "Motores avanzados I",
        icon: "➤",

        description:
          "Reduce en 3 el coste energético de explorar.",

        scienceCost: 25,

        position: {
          x: 2,
          y: 0
        },

        requires: [],

        effects: [
          {
            type: "explorationEnergyCostReduction",
            value: 3
          }
        ]
      },


      sensores: {
        name: "Sensores de largo alcance",
        icon: "◎",

        description:
          "Mejora los sistemas científicos de reconocimiento.",

        scienceCost: 30,

        position: {
          x: 1,
          y: 1
        },

        requires: [
          "exploracion.motores1"
        ],

        effects: [
          {
            type: "scientificSuccessBonus",
            value: 5
          }
        ]
      },


      motores2: {
        name: "Motores avanzados II",
        icon: "➤",

        description:
          "Reduce en 2 puntos adicionales el coste de explorar.",

        scienceCost: 45,

        position: {
          x: 3,
          y: 1
        },

        requires: [
          "exploracion.motores1"
        ],

        effects: [
          {
            type: "explorationEnergyCostReduction",
            value: 2
          }
        ]
      },


      navegacionProfunda: {
        name: "Navegación de espacio profundo",
        icon: "✦",

        description:
          "Mejora las misiones científicas y reduce el coste de exploración.",

        scienceCost: 65,

        position: {
          x: 2,
          y: 2
        },

        requires: [
          "exploracion.sensores",
          "exploracion.motores2"
        ],

        effects: [
          {
            type: "explorationEnergyCostReduction",
            value: 2
          },

          {
            type: "scientificSuccessBonus",
            value: 5
          }
        ]
      }

    }
  },


  mineria: {
    name: "Minería",
    shortName: "Minería",

    description:
      "Extracción de recursos, seguridad minera y logística industrial.",

    color: "#4ade80",

    upgrades: {

      extraccion1: {
        name: "Extracción optimizada",
        icon: "⛏",

        description:
          "Aumenta un 10% la recompensa de minería.",

        scienceCost: 25,

        position: {
          x: 2,
          y: 0
        },

        requires: [],

        effects: [
          {
            type: "miningRewardBonus",
            value: 0.10
          }
        ]
      },


      seguridadMinera: {
        name: "Protocolos de seguridad",
        icon: "⬡",

        description:
          "Reduce el riesgo de desastre minero.",

        scienceCost: 35,

        position: {
          x: 1,
          y: 1
        },

        requires: [
          "mineria.extraccion1"
        ],

        effects: [
          {
            type: "miningDisasterReduction",
            value: 5
          }
        ]
      },


      mineria2: {
        name: "Extracción avanzada",
        icon: "⛏",

        description:
          "Aumenta un 15% adicional la recompensa minera.",

        scienceCost: 45,

        position: {
          x: 3,
          y: 1
        },

        requires: [
          "mineria.extraccion1"
        ],

        effects: [
          {
            type: "miningRewardBonus",
            value: 0.15
          }
        ]
      },


      motoresMineros: {
        name: "Motores mineros eficientes",
        icon: "⚙",

        description:
          "Reduce en 2 el coste energético de las expediciones mineras.",

        scienceCost: 50,

        position: {
          x: 1,
          y: 2
        },

        requires: [
          "mineria.seguridadMinera"
        ],

        effects: [
          {
            type: "miningEnergyCostReduction",
            value: 2
          }
        ]
      },


      industriaOrbital: {
        name: "Industria orbital",
        icon: "◈",

        description:
          "Aumenta un 15% la producción básica de minerales.",

        scienceCost: 70,

        position: {
          x: 3,
          y: 2
        },

        requires: [
          "mineria.mineria2"
        ],

        effects: [
          {
            type: "mineralProductionBonus",
            value: 0.15
          }
        ]
      }

    }
  },


  militar: {
    name: "Militar",
    shortName: "Militar",

    description:
      "Astilleros, armamento, defensa y logística de las fuerzas espaciales.",

    color: "#fb7185",

    upgrades: {

      astilleros1: {
        name: "Astilleros optimizados",
        icon: "⚙",

        description:
          "Reduce un 10% el coste mineral de nuevas naves.",

        scienceCost: 30,

        position: {
          x: 2,
          y: 0
        },

        requires: [],

        effects: [
          {
            type: "fleetMineralCostReduction",
            value: 0.10
          }
        ]
      },


      armamento1: {
        name: "Sistemas de armamento I",
        icon: "✦",

        description:
          "Las nuevas naves aportan más poder militar.",

        scienceCost: 40,

        position: {
          x: 1,
          y: 1
        },

        requires: [
          "militar.astilleros1"
        ],

        effects: [
          {
            type: "fleetMilitaryGainBonus",
            value: 0.20
          }
        ]
      },


      produccionNaval: {
        name: "Producción naval avanzada",
        icon: "◇",

        description:
          "Reduce un 10% el coste en créditos de las naves.",

        scienceCost: 40,

        position: {
          x: 3,
          y: 1
        },

        requires: [
          "militar.astilleros1"
        ],

        effects: [
          {
            type: "fleetCreditCostReduction",
            value: 0.10
          }
        ]
      },


      doctrinaMilitar: {
        name: "Doctrina militar avanzada",
        icon: "⚔",

        description:
          "Mejora el poder militar de las nuevas naves.",

        scienceCost: 75,

        position: {
          x: 2,
          y: 2
        },

        requires: [
          "militar.armamento1",
          "militar.produccionNaval"
        ],

        effects: [
          {
            type: "fleetMilitaryGainBonus",
            value: 0.25
          }
        ]
      }

    }
  }

};



/* ==========================================================
   3. RASGOS PLANETARIOS
   ==========================================================
   NUEVO.

   Puedes añadir tantos como quieras.

   El jugador NO los conoce al descubrir el planeta.
   Se revelan con ESCANEO PROFUNDO.
   ========================================================== */

const planetTraits = {

  richMinerals: {
    name: "Yacimientos ricos",

    description:
      "La corteza contiene vetas minerales excepcionalmente densas.",

    effects: [
      {
        type: "planetMiningRewardBonus",
        value: 0.25
      }
    ]
  },


  crystalFields: {
    name: "Campos de cristales energéticos",

    description:
      "Formaciones cristalinas almacenan grandes cantidades de energía.",

    effects: [
      {
        type: "colonyEnergyBonus",
        value: 0.25
      }
    ]
  },


  fertileBiosphere: {
    name: "Biosfera fértil",

    description:
      "Las condiciones naturales favorecen el desarrollo de una colonia.",

    effects: [
      {
        type: "colonyMineralBonus",
        value: 0.10
      },

      {
        type: "colonyEnergyBonus",
        value: 0.10
      }
    ]
  },


  ancientRuins: {
    name: "Ruinas antiguas",

    description:
      "Estructuras de origen desconocido permanecen enterradas en la superficie.",

    effects: [
      {
        type: "scientificRewardBonus",
        value: 0.25
      }
    ]
  },


  unstableCrust: {
    name: "Corteza inestable",

    description:
      "La actividad tectónica dificulta cualquier operación en superficie.",

    effects: [
      {
        type: "scientificDisasterBonus",
        value: 5
      }
    ]
  },


  lowGravity: {
    name: "Gravedad reducida",

    description:
      "Las operaciones orbitales y de superficie son más sencillas de lo habitual.",

    effects: [
      {
        type: "scientificSuccessBonusPlanet",
        value: 5
      }
    ]
  }

};



/* ==========================================================
   4. AMENAZAS PLANETARIAS
   ==========================================================
   NUEVO.

   IMPORTANTE:
   La amenaza existe internamente desde que se genera
   el planeta, pero el jugador NO la conoce.

   Solo se revela usando:
   "Investigar amenazas"

   Puedes añadir aquí:
   - virus
   - bacterias
   - plagas
   - criaturas
   - parásitos
   - anomalías
   - etc.
   ========================================================== */

const planetThreats = {

  neurotoxicSpores: {
    name: "Esporas neurotóxicas",

    category: "Biológica",

    description:
      "Una forma de vida microscópica libera esporas capaces de incapacitar tripulaciones.",

    severity: 7,

    /*
      Probabilidad de perder una nave
      si el jugador entra SIN investigar la amenaza.
    */
    unpreparedShipLossChance: 55,

    /*
      Ciencia que puede perderse en un desastre científico.
    */
    scientificPenalty: 4
  },


  corrosiveMicrobe: {
    name: "Microorganismo corrosivo",

    category: "Biológica",

    description:
      "Colonias microbianas reaccionan violentamente con determinadas aleaciones.",

    severity: 5,

    unpreparedShipLossChance: 35,

    scientificPenalty: 3
  },


  apexPredator: {
    name: "Depredador de superficie",

    category: "Fauna hostil",

    description:
      "Una especie extremadamente territorial domina varias regiones del planeta.",

    severity: 6,

    unpreparedShipLossChance: 45,

    scientificPenalty: 3
  },


  lethalPlague: {
    name: "Plaga xenobiológica",

    category: "Plaga",

    description:
      "Agente infeccioso extremadamente agresivo y de rápida propagación.",

    severity: 10,

    /*
      EJEMPLO:
      esta amenaza mata la nave sí o sí
      si el jugador entra sin haberla investigado.
    */
    unpreparedShipLossChance: 100,

    scientificPenalty: 8
  },


  electricSwarm: {
    name: "Enjambre electrostático",

    category: "Criatura",

    description:
      "Organismos atmosféricos descargan pulsos eléctricos contra objetos tecnológicos.",

    severity: 8,

    unpreparedShipLossChance: 70,

    scientificPenalty: 5
  }

};



/* ==========================================================
   5. ESTADO DE LA PARTIDA
   ========================================================== */

const gameState = {

  turn: 1,

  raceId: null,

  race: null,

  credits: 0,

  minerals: 0,

  energy: 0,

  science: 0,

  militaryPower: 0,

  fleet: 1,

  discoveredPlanets: [],

  activeExpeditions: [],

  diplomacy: {},

  researchedUpgrades: [],

  selectedResearchTree:
    Object.keys(researchTrees)[0] || null,

  selectedResearchUpgrade:
    null

};



/* ==========================================================
   6. CONFIGURACIÓN DEL JUEGO
   ========================================================== */

const gameConfig = {

  exploration: {

    energyCost: 25,

    /*
      NUEVO
    */
    deepScanEnergyCost: 10,

    threatScanEnergyCost: 8,

    studyEnergyCost: 12

  },


  research: {

    creditCost: 50,

    baseScienceGain: 5

  },


  fleet: {

    creditCost: 100,

    mineralCost: 30,

    baseMilitaryGain: 2

  },


  colonization: {

    creditCost: 120,

    mineralCost: 60

  },


  miningExpedition: {

    energyCost: 12,

    militaryPowerLoss: 2

  },


  /*
    NUEVO:
    expediciones científicas
  */

  scientificExpedition: {

    energyCost: 15,

    baseScienceMin: 5,

    baseScienceMax: 14,

    normalFailureScienceLossMin: 1,

    normalFailureScienceLossMax: 4,

    disasterScienceLossMin: 4,

    disasterScienceLossMax: 10,

    militaryPowerLoss: 2

  },


  diplomacy: {

    improveRelationsCreditCost: 40,

    improveRelationsGain: 10,

    miningAgreementCreditCost: 60,

    miningAgreementMinimumRelation: 25

  },


  market: {

    minerals: {

      creditCost: 100,

      amount: 50

    },

    energy: {

      creditCost: 80,

      amount: 50

    }

  },


  production: {

    credits: 40,

    minerals: 15,

    energy: 20,

    science: 2

  }

};



/* ==========================================================
   7. DATOS DE PLANETAS
   ========================================================== */

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
    name: "Mundo oceánico",

    dangerModifier: 0,

    description:
      "Un planeta cubierto por enormes océanos y archipiélagos dispersos."
  },


  {
    name: "Mundo desértico",

    dangerModifier: 1,

    description:
      "Un mundo árido dominado por grandes desiertos y temperaturas extremas."
  },


  {
    name: "Mundo volcánico",

    dangerModifier: 2,

    description:
      "Su superficie presenta intensa actividad volcánica y enormes reservas minerales."
  },


  {
    name: "Mundo selvático",

    dangerModifier: 1,

    description:
      "La superficie está cubierta por una biosfera extremadamente densa."
  },


  {
    name: "Mundo helado",

    dangerModifier: 1,

    description:
      "Grandes capas de hielo cubren prácticamente toda su superficie."
  },


  {
    name: "Mundo continental",

    dangerModifier: 0,

    description:
      "Posee océanos, continentes y condiciones relativamente estables."
  },


  {
    name: "Mundo tóxico",

    dangerModifier: 3,

    description:
      "Su atmósfera contiene sustancias extremadamente peligrosas para la vida conocida."
  },


  {
    name: "Gigante gaseoso",

    dangerModifier: 2,

    description:
      "Un enorme planeta gaseoso rodeado de lunas y tormentas atmosféricas."
  }

];



/* ==========================================================
   8. INICIALIZACIÓN
   ========================================================== */

document.addEventListener(
  "DOMContentLoaded",
  initializeGame
);


function initializeGame() {

  renderRaceSelection();

  connectButtons();

  connectNavigation();

  createExpeditionPanel();

  renderFleetScreen();

  renderDiplomacyScreen();

  renderMarketScreen();

  renderResearchScreen();


  console.log(
    "Project Nexus iniciado correctamente."
  );

}



/* ==========================================================
   9. BOTONES
   ========================================================== */

function connectButtons() {

  document
    .getElementById("exploreButton")
    ?.addEventListener(
      "click",
      explore
    );


  document
    .getElementById("researchButton")
    ?.addEventListener(
      "click",
      research
    );


  document
    .getElementById("fleetButton")
    ?.addEventListener(
      "click",
      buildFleet
    );


  document
    .getElementById("endTurnButton")
    ?.addEventListener(
      "click",
      endTurn
    );


  const modal =
    document.getElementById(
      "discoveryModal"
    );


  modal
    ?.addEventListener(
      "click",
      function(event) {

        if (
          event.target ===
          modal
        ) {

          closeDiscoveryModal();

        }

      }
    );

}



/* ==========================================================
   10. SELECCIÓN DE RAZA
   ========================================================== */

function renderRaceSelection() {

  const raceGrid =
    document.getElementById(
      "raceGrid"
    );


  if (!raceGrid) {
    return;
  }


  raceGrid.innerHTML =
    "";


  Object.entries(
    races
  )
  .forEach(
    function([
      raceId,
      race
    ]) {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "race-card";


      card.innerHTML = `

        <div class="race-image">

          <div class="race-image-fallback">
            ${race.name}
          </div>

          <img
            src="${race.image}"
            alt="${race.name}"
          >

        </div>


        <div class="race-content">

          <span class="race-playstyle">
            ${race.playstyle}
          </span>

          <h2>
            ${race.name}
          </h2>

          <div class="race-homeworld">

            Planeta natal:

            <strong>
              ${race.homeworld}
            </strong>

          </div>


          <p class="race-description">
            ${race.description}
          </p>


          <div class="race-ratings">

            ${createRaceRating(
              "Tecnología",
              race.technology
            )}

            ${createRaceRating(
              "Militar",
              race.military
            )}

            ${createRaceRating(
              "Economía",
              race.economy
            )}

            ${createRaceRating(
              "Defensa",
              race.defense
            )}

          </div>


          <button
            type="button"
            class="select-race-button"
          >

            Seleccionar ${race.name}

          </button>

        </div>

      `;


      const image =
        card.querySelector(
          "img"
        );


      const fallback =
        card.querySelector(
          ".race-image-fallback"
        );


      image
        ?.addEventListener(
          "load",
          function() {

            fallback.style.display =
              "none";

          }
        );


      image
        ?.addEventListener(
          "error",
          function() {

            image.style.display =
              "none";

            fallback.style.display =
              "flex";

          }
        );


      card
        .querySelector(
          ".select-race-button"
        )
        ?.addEventListener(
          "click",
          function() {

            startGame(
              raceId
            );

          }
        );


      raceGrid.appendChild(
        card
      );

    }
  );

}



function createRaceRating(
  label,
  value
) {

  const safeValue =
    clamp(
      value,
      0,
      10
    );


  return `

    <div class="race-rating">

      <div class="race-rating-top">

        <span>
          ${label}
        </span>

        <span>
          ${safeValue}/10
        </span>

      </div>


      <div class="race-rating-background">

        <div
          class="race-rating-fill"
          style="width:${safeValue * 10}%;"
        >
        </div>

      </div>

    </div>

  `;

}



function startGame(
  raceId
) {

  const race =
    races[
      raceId
    ];


  if (!race) {
    return;
  }


  gameState.raceId =
    raceId;

  gameState.race =
    race;

  gameState.turn =
    1;

  gameState.credits =
    race.startingResources.credits;

  gameState.minerals =
    race.startingResources.minerals;

  gameState.energy =
    race.startingResources.energy;

  gameState.science =
    race.startingResources.science;

  gameState.militaryPower =
    race.startingResources.militaryPower;

  gameState.fleet =
    1;

  gameState.discoveredPlanets =
    [];

  gameState.activeExpeditions =
    [];

  gameState.diplomacy =
    {};

  gameState.researchedUpgrades =
    [];

  gameState.selectedResearchTree =
    Object.keys(researchTrees)[0] || null;

  gameState.selectedResearchUpgrade =
    null;


  document
    .getElementById(
      "raceSelection"
    )
    ?.classList
    .add(
      "hidden"
    );


  document
    .getElementById(
      "gameScreen"
    )
    ?.classList
    .remove(
      "hidden"
    );


  showGameScreen(
    "commandScreen"
  );


  const commandButton =
    document.querySelector(
      '.menu-button[data-screen="commandScreen"]'
    );


  if (
    commandButton
  ) {

    setActiveMenuButton(
      commandButton
    );

  }


  clearLog();

  renderPlanets();

  renderExpeditions();

  renderFleetScreen();

  renderDiplomacyScreen();

  renderMarketScreen();

  renderResearchScreen();


  addLog(

    "La civilización "
    +
    race.name
    +
    " inicia su expansión desde "
    +
    race.homeworld
    +
    "."

  );


  updateInterface();

}



/* ==========================================================
   11. EXPLORACIÓN
   ========================================================== */

function explore() {

  const cost =
    getExplorationEnergyCost();


  if (
    gameState.energy <
    cost
  ) {

    addLog(

      "No hay suficiente energía para explorar. Se necesitan "
      +
      cost
      +
      " de energía."

    );

    return;

  }


  gameState.energy -=
    cost;


  const planet =
    generatePlanet();


  gameState
    .discoveredPlanets
    .push(
      planet
    );


  if (
    planet.civilization
  ) {

    registerKnownCivilization(
      planet
    );

  }


  addLog(

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

    addLog(

      "Se han detectado señales de la civilización "
      +
      planet.civilization.name
      +
      "."

    );

  }


  updateInterface();

  renderPlanets();

  showDiscoveryModal(
    planet
  );

}



/* ==========================================================
   12. GENERAR PLANETA
   ========================================================== */

function generatePlanet() {

  const type =
    randomItem(
      planetTypes
    );


  const name =
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


  danger =
    clamp(
      danger,
      1,
      10
    );


  const miningDeposits =
    randomNumber(
      1,
      9
    );


  return {

    id:
      "planet-"
      +
      Date.now()
      +
      "-"
      +
      randomNumber(
        1000,
        9999
      ),

    name:
      name,

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
      generateCivilization(),

    colonized:
      false,

    colonyProduction: {
      minerals: 0,
      energy: 0
    },

    miningDeposits:
      miningDeposits,

    maxMiningDeposits:
      miningDeposits,


    /* ======================================================
       NUEVO
       ====================================================== */

    deepScanCompleted:
      false,

    studied:
      false,

    threatInvestigated:
      false,

    traits:
      generatePlanetTraits(),

    threat:
      generatePlanetThreat(),

    studyBonus: {

      science:
        0,

      colonyMineralMultiplier:
        1,

      colonyEnergyMultiplier:
        1

    }

  };

}



/* ==========================================================
   13. GENERAR RASGOS
   ========================================================== */

function generatePlanetTraits() {

  const ids =
    Object.keys(
      planetTraits
    );


  const roll =
    Math.random();


  let amount =
    0;


  /*
    35% sin rasgos
    45% un rasgo
    20% dos rasgos
  */

  if (
    roll >= 0.35
    &&
    roll < 0.80
  ) {

    amount =
      1;

  }

  else if (
    roll >= 0.80
  ) {

    amount =
      2;

  }


  const selected =
    [];


  while (
    selected.length < amount
    &&
    selected.length < ids.length
  ) {

    const id =
      randomItem(
        ids
      );


    if (
      !selected.includes(
        id
      )
    ) {

      selected.push(
        id
      );

    }

  }


  return selected;

}



/* ==========================================================
   14. GENERAR AMENAZA
   ========================================================== */

function generatePlanetThreat() {

  /*
    65%:
    sin amenaza especial

    35%:
    con amenaza oculta
  */

  if (
    Math.random() <
    0.65
  ) {

    return null;

  }


  const threatId =
    randomItem(
      Object.keys(
        planetThreats
      )
    );


  return {

    id:
      threatId

  };

}



/* ==========================================================
   15. GENERAR CIVILIZACIÓN
   ========================================================== */

function generateCivilization() {

  const roll =
    Math.random();


  if (
    roll <
    0.45
  ) {

    return null;

  }


  let attitude;


  if (
    roll <
    0.65
  ) {

    attitude =
      "Pacífica";

  }

  else if (
    roll <
    0.85
  ) {

    attitude =
      "Neutral";

  }

  else {

    attitude =
      "Hostil";

  }


  const availableRaceIds =
    Object.keys(
      races
    )
    .filter(
      function(raceId) {

        return (
          raceId !==
          gameState.raceId
        );

      }
    );


  if (
    availableRaceIds.length ===
    0
  ) {

    return null;

  }


  const selectedRaceId =
    randomItem(
      availableRaceIds
    );


  const selectedRace =
    races[
      selectedRaceId
    ];


  return {

    raceId:
      selectedRaceId,

    name:
      selectedRace.name,

    attitude:
      attitude,

    technology:
      selectedRace.technology,

    military:
      selectedRace.military

  };

}



/* ==========================================================
   16. ESCANEO PROFUNDO
   ==========================================================
   Revela características especiales.
   NO revela amenazas.
   ========================================================== */

function deepScanPlanet(
  planetId
) {

  const planet =
    findPlanet(
      planetId
    );


  if (!planet) {
    return;
  }


  if (
    planet.deepScanCompleted
  ) {

    addLog(

      "El escaneo profundo de "
      +
      planet.name
      +
      " ya ha sido completado."

    );

    return;

  }


  const cost =
    gameConfig
      .exploration
      .deepScanEnergyCost;


  if (
    gameState.energy <
    cost
  ) {

    addLog(

      "Se necesitan "
      +
      cost
      +
      " de energía para realizar un escaneo profundo de "
      +
      planet.name
      +
      "."

    );

    return;

  }


  gameState.energy -=
    cost;


  planet.deepScanCompleted =
    true;


  if (
    planet.traits.length ===
    0
  ) {

    addLog(

      "Escaneo profundo completado en "
      +
      planet.name
      +
      ". No se han detectado características especiales."

    );

  }

  else {

    const names =
      planet.traits.map(
        function(traitId) {

          return (
            planetTraits[
              traitId
            ]?.name
            ||
            traitId
          );

        }
      );


    addLog(

      "Escaneo profundo completado en "
      +
      planet.name
      +
      ". Características detectadas: "
      +
      names.join(", ")
      +
      "."

    );

  }


  updateInterface();

  renderPlanets();

}



/* ==========================================================
   17. ESTUDIAR PLANETA
   ==========================================================
   Requiere escaneo profundo.

   Es una acción segura.

   Da:
   - pequeña cantidad de ciencia
   - mejora de futura colonia
   ========================================================== */

function studyPlanet(
  planetId
) {

  const planet =
    findPlanet(
      planetId
    );


  if (!planet) {
    return;
  }


  if (
    planet.studied
  ) {

    addLog(

      planet.name
      +
      " ya ha sido estudiado."

    );

    return;

  }


  if (
    !planet.deepScanCompleted
  ) {

    addLog(

      "Primero debes completar un escaneo profundo de "
      +
      planet.name
      +
      "."

    );

    return;

  }


  const cost =
    gameConfig
      .exploration
      .studyEnergyCost;


  if (
    gameState.energy <
    cost
  ) {

    addLog(

      "Se necesitan "
      +
      cost
      +
      " de energía para estudiar "
      +
      planet.name
      +
      "."

    );

    return;

  }


  gameState.energy -=
    cost;


  const scienceGain =
    Math.max(

      1,

      Math.round(

        randomNumber(
          2,
          6
        )

        *

        gameState
          .race
          .modifiers
          .research

      )

    );


  planet.studied =
    true;


  planet.studyBonus.science =
    scienceGain;


  planet
    .studyBonus
    .colonyMineralMultiplier =
    1.10;


  planet
    .studyBonus
    .colonyEnergyMultiplier =
    1.10;


  gameState.science +=
    scienceGain;


  if (
    planet.colonized
  ) {

    setPlanetColonyProduction(
      planet
    );

  }


  addLog(

    "Estudio planetario completado en "
    +
    planet.name
    +
    ". +"
    +
    scienceGain
    +
    " ciencia. Las futuras operaciones coloniales serán más eficientes."

  );


  updateInterface();

  renderPlanets();

}



/* ==========================================================
   18. INVESTIGAR AMENAZAS
   ========================================================== */

function investigatePlanetThreat(
  planetId
) {

  const planet =
    findPlanet(
      planetId
    );


  if (!planet) {
    return;
  }


  if (
    planet.threatInvestigated
  ) {

    addLog(

      "Las amenazas de "
      +
      planet.name
      +
      " ya han sido investigadas."

    );

    return;

  }


  const cost =
    gameConfig
      .exploration
      .threatScanEnergyCost;


  if (
    gameState.energy <
    cost
  ) {

    addLog(

      "Se necesitan "
      +
      cost
      +
      " de energía para investigar amenazas en "
      +
      planet.name
      +
      "."

    );

    return;

  }


  gameState.energy -=
    cost;


  planet.threatInvestigated =
    true;


  if (
    !planet.threat
  ) {

    addLog(

      "Investigación de amenazas completada en "
      +
      planet.name
      +
      ". No se han detectado amenazas extraordinarias."

    );

  }

  else {

    const threat =
      getPlanetThreatData(
        planet
      );


    addLog(

      "ALERTA: en "
      +
      planet.name
      +
      " se ha detectado \""
      +
      threat.name
      +
      "\". Nivel de amenaza "
      +
      threat.severity
      +
      "/10."

    );

  }


  updateInterface();

  renderPlanets();

}



/* ==========================================================
   19. EXPEDICIÓN CIENTÍFICA
   ========================================================== */

function sendScientificExpedition(
  planetId
) {

  const planet =
    findPlanet(
      planetId
    );


  if (!planet) {
    return;
  }


  if (
    getActiveExpeditionForPlanet(
      planet.id
    )
  ) {

    addLog(

      "Ya existe una misión activa en "
      +
      planet.name
      +
      "."

    );

    return;

  }


  if (
    getAvailableShips() <=
    0
  ) {

    addLog(
      "No hay naves disponibles para una expedición científica."
    );

    return;

  }


  const cost =
    gameConfig
      .scientificExpedition
      .energyCost;


  if (
    gameState.energy <
    cost
  ) {

    addLog(

      "Se necesitan "
      +
      cost
      +
      " de energía para enviar una expedición científica."

    );

    return;

  }


  const duration =
    getScientificDuration(
      planet.danger
    );


  const successChance =
    getScientificSuccessChance(
      planet
    );


  let warning =
    "";


  if (
    !planet.threatInvestigated
  ) {

    warning =

      "\n\n⚠ ADVERTENCIA: las amenazas del planeta NO han sido investigadas."
      +
      "\nLa misión podría encontrarse con un peligro desconocido.";

  }

  else if (
    planet.threat
  ) {

    const threat =
      getPlanetThreatData(
        planet
      );


    warning =

      "\n\nAmenaza conocida: "
      +
      threat.name
      +
      " ("
      +
      threat.severity
      +
      "/10).";

  }


  const accepted =
    confirm(

      "EXPEDICIÓN CIENTÍFICA"

      +

      "\n\nDestino: "
      +
      planet.name

      +

      "\nPeligro planetario: "
      +
      planet.danger
      +
      "/10"

      +

      "\nDuración: "
      +
      duration
      +
      " turno(s)"

      +

      "\nProbabilidad base de éxito: "
      +
      successChance
      +
      "%"

      +

      "\nCoste: "
      +
      cost
      +
      " energía"

      +

      "\nNave ocupada: 1"

      +

      warning

      +

      "\n\n¿Enviar expedición?"

    );


  if (
    !accepted
  ) {

    return;

  }


  gameState.energy -=
    cost;


  gameState
    .activeExpeditions
    .push({

      id:
        "expedition-"
        +
        Date.now()
        +
        "-"
        +
        randomNumber(
          1000,
          9999
        ),

      type:
        "scientific",

      planetId:
        planet.id,

      planetName:
        planet.name,

      danger:
        planet.danger,

      remainingTurns:
        duration,

      totalTurns:
        duration

    });


  addLog(

    "Una expedición científica ha partido hacia "
    +
    planet.name
    +
    "."

  );


  updateInterface();

  renderPlanets();

}



/* ==========================================================
   20. DURACIÓN EXPEDICIÓN CIENTÍFICA
   ========================================================== */

function getScientificDuration(
  danger
) {

  if (
    danger <=
    3
  ) {
    return 2;
  }


  if (
    danger <=
    6
  ) {
    return 3;
  }


  if (
    danger <=
    8
  ) {
    return 4;
  }


  return 5;

}



/* ==========================================================
   21. ÉXITO EXPEDICIÓN CIENTÍFICA
   ========================================================== */

function getScientificSuccessChance(
  planet
) {

  const techBonus =
    getResearchBonus(
      "scientificSuccessBonus"
    );


  const traitBonus =
    getPlanetTraitEffectTotal(

      planet,

      "scientificSuccessBonusPlanet"

    );


  return clamp(

    92

    -

    planet.danger
    *
    6

    +

    techBonus

    +

    traitBonus,

    5,

    95

  );

}



/* ==========================================================
   22. DESASTRE EXPEDICIÓN CIENTÍFICA
   ========================================================== */

function getScientificDisasterChance(
  planet
) {

  const traitPenalty =
    getPlanetTraitEffectTotal(

      planet,

      "scientificDisasterBonus"

    );


  return clamp(

    planet.danger
    *
    3

    +

    traitPenalty,

    0,

    90

  );

}



/* ==========================================================
   23. RESOLVER EXPEDICIÓN CIENTÍFICA
   ========================================================== */

function resolveScientificExpedition(
  expedition
) {

  const planet =
    findPlanet(
      expedition.planetId
    );


  if (!planet) {
    return;
  }


  const threat =
    getPlanetThreatData(
      planet
    );


  /* ========================================================
     AMENAZA OCULTA
     ======================================================== */

  if (
    threat
    &&
    !planet.threatInvestigated
  ) {

    const threatRoll =
      randomNumber(
        1,
        100
      );


    if (
      threatRoll <=
      threat.unpreparedShipLossChance
    ) {

      gameState.fleet =
        Math.max(

          0,

          gameState.fleet - 1

        );


      gameState.militaryPower =
        Math.max(

          0,

          gameState.militaryPower

          -

          gameConfig
            .scientificExpedition
            .militaryPowerLoss

        );


      const scienceLoss =
        Math.min(

          gameState.science,

          threat.scientificPenalty

        );


      gameState.science -=
        scienceLoss;


      addLog(

        "DESASTRE CIENTÍFICO: la expedición de "
        +
        planet.name
        +
        " encontró una amenaza desconocida ("
        +
        threat.name
        +
        "). La nave se ha perdido"
        +
        (
          scienceLoss > 0
            ?
          " y se han perdido "
          +
          scienceLoss
          +
          " puntos de ciencia."
            :
          "."
        )

      );


      return;

    }

  }



  /* ========================================================
     RESULTADO NORMAL
     ======================================================== */

  const successChance =
    getScientificSuccessChance(
      planet
    );


  const disasterChance =
    getScientificDisasterChance(
      planet
    );


  const roll =
    randomNumber(
      1,
      100
    );


  /* ÉXITO */

  if (
    roll <=
    successChance
  ) {

    let reward =
      randomNumber(

        gameConfig
          .scientificExpedition
          .baseScienceMin,

        gameConfig
          .scientificExpedition
          .baseScienceMax

      );


    reward =
      Math.max(

        1,

        Math.round(

          reward

          *

          gameState
            .race
            .modifiers
            .research

          *

          (
            1
            +
            getPlanetTraitEffectTotal(

              planet,

              "scientificRewardBonus"

            )
          )

        )

      );


    gameState.science +=
      reward;


    addLog(

      "La expedición científica de "
      +
      planet.name
      +
      " ha sido un éxito. +"
      +
      reward
      +
      " ciencia."

    );


    return;

  }



  /* DESASTRE */

  if (
    roll >
    100
    -
    disasterChance
  ) {

    gameState.fleet =
      Math.max(

        0,

        gameState.fleet - 1

      );


    gameState.militaryPower =
      Math.max(

        0,

        gameState.militaryPower

        -

        gameConfig
          .scientificExpedition
          .militaryPowerLoss

      );


    const scienceLoss =
      Math.min(

        gameState.science,

        randomNumber(

          gameConfig
            .scientificExpedition
            .disasterScienceLossMin,

          gameConfig
            .scientificExpedition
            .disasterScienceLossMax

        )

      );


    gameState.science -=
      scienceLoss;


    addLog(

      "DESASTRE: la expedición científica de "
      +
      planet.name
      +
      " ha perdido su nave"
      +
      (
        scienceLoss > 0
          ?
        " y "
        +
        scienceLoss
        +
        " puntos de ciencia."
          :
        "."
      )

    );


    return;

  }



  /* FALLO NORMAL */

  const scienceLoss =
    Math.min(

      gameState.science,

      randomNumber(

        gameConfig
          .scientificExpedition
          .normalFailureScienceLossMin,

        gameConfig
          .scientificExpedition
          .normalFailureScienceLossMax

      )

    );


  gameState.science -=
    scienceLoss;


  addLog(

    "La expedición científica de "
    +
    planet.name
    +
    " no obtuvo resultados útiles"
    +
    (
      scienceLoss > 0
        ?
      ". -"
      +
      scienceLoss
      +
      " ciencia."
        :
      "."
    )

  );

}



/* ==========================================================
   24. RETIRAR EXPEDICIÓN
   ========================================================== */

function retreatExpedition(
  expeditionId
) {

  const expedition =
    gameState
      .activeExpeditions
      .find(
        function(item) {

          return (
            item.id ===
            expeditionId
          );

        }
      );


  if (!expedition) {
    return;
  }


  const accepted =
    confirm(

      "RETIRAR EXPEDICIÓN"

      +

      "\n\nMisión: "
      +
      getExpeditionTypeName(
        expedition.type
      )

      +

      "\nDestino: "
      +
      expedition.planetName

      +

      "\n\nLa nave regresará inmediatamente."

      +

      "\nNo recuperarás el coste inicial ni obtendrás recompensa."

      +

      "\n\n¿Ordenar retirada?"

    );


  if (
    !accepted
  ) {

    return;

  }


  gameState.activeExpeditions =
    gameState
      .activeExpeditions
      .filter(
        function(item) {

          return (
            item.id !==
            expeditionId
          );

        }
      );


  addLog(

    "La "
    +
    getExpeditionTypeName(
      expedition.type
    )
    .toLowerCase()
    +
    " enviada a "
    +
    expedition.planetName
    +
    " ha recibido orden de retirada."

  );


  updateInterface();

  renderPlanets();

}



/* ==========================================================
   25. RENDERIZAR PLANETAS
   ========================================================== */

function renderPlanets() {

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

      <div class="empty-message">
        Ningún planeta descubierto todavía.
      </div>

    `;

  }


  gameState
    .discoveredPlanets
    .forEach(
      function(planet) {

        const card =
          document.createElement(
            "div"
          );


        card.className =
          "planet-card";


        const activeMission =
          getActiveExpeditionForPlanet(
            planet.id
          );



        /* ==================================================
           CIVILIZACIÓN
           ================================================== */

        let civilizationHTML =
          "";


        if (
          planet.civilization
        ) {

          const diplomacy =
            gameState.diplomacy[
              planet.civilization.raceId
            ];


          civilizationHTML = `

            <div class="civilization-box">

              <small>
                Civilización detectada
              </small>

              <strong>
                ${planet.civilization.name}
              </strong>

              <span
                class="attitude ${getAttitudeClass(
                  planet.civilization.attitude
                )}"
              >
                ${planet.civilization.attitude}
              </span>

              <small>
                Estado diplomático
              </small>

              <strong>

                ${
                  diplomacy?.contacted
                    ?
                  getRelationLabel(
                    diplomacy.relation
                  )
                    :
                  "Sin contacto"
                }

              </strong>

            </div>

          `;

        }

        else {

          civilizationHTML = `

            <div class="civilization-box">

              <small>
                Civilización
              </small>

              <span class="attitude none">
                No detectada
              </span>

            </div>

          `;

        }



        /* ==================================================
           RASGOS
           ================================================== */

        let traitsHTML =
          "";


        if (
          !planet.deepScanCompleted
        ) {

          traitsHTML = `

            <div class="civilization-box">

              <small>
                Características especiales
              </small>

              <strong>
                NO INVESTIGADAS
              </strong>

            </div>

          `;

        }

        else if (
          planet.traits.length ===
          0
        ) {

          traitsHTML = `

            <div class="civilization-box">

              <small>
                Características especiales
              </small>

              <strong>
                Ninguna detectada
              </strong>

            </div>

          `;

        }

        else {

          const traitList =
            planet.traits
              .map(
                function(traitId) {

                  const trait =
                    planetTraits[
                      traitId
                    ];


                  return `

                    <span>
                      • ${trait?.name || traitId}
                    </span>

                  `;

                }
              )
              .join(
                ""
              );


          traitsHTML = `

            <div class="civilization-box">

              <small>
                Características especiales
              </small>

              ${traitList}

            </div>

          `;

        }



        /* ==================================================
           AMENAZAS
           ================================================== */

        let threatHTML =
          "";


        if (
          !planet.threatInvestigated
        ) {

          threatHTML = `

            <div class="civilization-box">

              <small>
                Amenazas
              </small>

              <strong>
                NO INVESTIGADAS
              </strong>

            </div>

          `;

        }

        else if (
          !planet.threat
        ) {

          threatHTML = `

            <div class="civilization-box">

              <small>
                Amenazas
              </small>

              <span class="attitude peaceful">
                Ninguna detectada
              </span>

            </div>

          `;

        }

        else {

          const threat =
            getPlanetThreatData(
              planet
            );


          threatHTML = `

            <div class="civilization-box">

              <small>
                Amenaza detectada
              </small>

              <strong>
                ${threat.name}
              </strong>

              <span class="attitude hostile">

                Nivel
                ${threat.severity}/10

              </span>

              <small>
                ${threat.category}
              </small>

            </div>

          `;

        }



        /* ==================================================
           COLONIA
           ================================================== */

        let colonyHTML =
          "";


        if (
          planet.colonized
        ) {

          colonyHTML = `

            <div class="civilization-box">

              <small>
                Estado imperial
              </small>

              <strong>
                Colonia establecida
              </strong>

              <span class="attitude peaceful">
                Bajo control
              </span>

              <small>
                Producción por turno
              </small>

              <strong>

                +${planet.colonyProduction.minerals}
                minerales

              </strong>

              <strong>

                +${planet.colonyProduction.energy}
                energía

              </strong>

            </div>

          `;

        }



        /* ==================================================
           MISIÓN ACTIVA
           ================================================== */

        let expeditionHTML =
          "";


        if (
          activeMission
        ) {

          expeditionHTML = `

            <div class="civilization-box">

              <small>
                ${getExpeditionTypeName(activeMission.type)}
              </small>

              <strong>
                Misión activa
              </strong>

              <span class="attitude neutral">

                ${activeMission.remainingTurns}
                turno(s) restantes

              </span>

            </div>

          `;

        }



        /* ==================================================
           BOTÓN ESCANEO PROFUNDO
           ================================================== */

        const deepScanButton =
          planet.deepScanCompleted
            ?
          `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Escaneo profundo ✓

            </button>

          `
            :
          `

            <button
              type="button"
              class="planet-action-button"
              onclick="deepScanPlanet('${planet.id}')"
            >

              Escaneo profundo

            </button>

          `;



        /* ==================================================
           BOTÓN MINERO
           ================================================== */

        let miningButton =
          "";


        if (
          activeMission
        ) {

          miningButton = `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Misión en curso

            </button>

          `;

        }

        else if (
          planet.miningDeposits <=
          0
        ) {

          miningButton = `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Yacimientos agotados

            </button>

          `;

        }

        else if (
          !canMinePlanet(
            planet
          )
        ) {

          miningButton = `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Sin permiso minero

            </button>

          `;

        }

        else {

          miningButton = `

            <button
              type="button"
              class="planet-action-button"
              onclick="sendMiningExpedition('${planet.id}')"
            >

              Expedición minera

            </button>

          `;

        }



        /* ==================================================
           BOTÓN CIENTÍFICO
           ================================================== */

        const scientificButton =
          activeMission
            ?
          `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Misión en curso

            </button>

          `
            :
          `

            <button
              type="button"
              class="planet-action-button"
              onclick="sendScientificExpedition('${planet.id}')"
            >

              Expedición científica

            </button>

          `;



        /* ==================================================
           BOTÓN ESTUDIAR
           ================================================== */

        let studyButton =
          "";


        if (
          planet.studied
        ) {

          studyButton = `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Estudiado ✓

            </button>

          `;

        }

        else if (
          !planet.deepScanCompleted
        ) {

          studyButton = `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Estudiar — requiere escaneo

            </button>

          `;

        }

        else {

          studyButton = `

            <button
              type="button"
              class="planet-action-button"
              onclick="studyPlanet('${planet.id}')"
            >

              Estudiar planeta

            </button>

          `;

        }



        /* ==================================================
           BOTÓN AMENAZAS
           ================================================== */

        const threatButton =
          planet.threatInvestigated
            ?
          `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Amenazas investigadas ✓

            </button>

          `
            :
          `

            <button
              type="button"
              class="planet-action-button"
              onclick="investigatePlanetThreat('${planet.id}')"
            >

              Investigar amenazas

            </button>

          `;



        /* ==================================================
           COLONIZAR / DIPLOMACIA
           ================================================== */

        let primaryButton =
          "";


        if (
          planet.civilization
        ) {

          const diplomacy =
            gameState.diplomacy[
              planet.civilization.raceId
            ];


          if (
            diplomacy?.contacted
          ) {

            primaryButton = `

              <button
                type="button"
                class="planet-action-button"
                onclick="openDiplomacyForCivilization('${planet.civilization.raceId}')"
              >

                Diplomacia

              </button>

            `;

          }

          else {

            primaryButton = `

              <button
                type="button"
                class="planet-action-button"
                onclick="contactCivilization('${planet.civilization.raceId}')"
              >

                Contactar

              </button>

            `;

          }

        }

        else if (
          planet.colonized
        ) {

          primaryButton = `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Colonizado

            </button>

          `;

        }

        else {

          primaryButton = `

            <button
              type="button"
              class="planet-action-button"
              onclick="colonizePlanet('${planet.id}')"
            >

              Colonizar

            </button>

          `;

        }



        /* ==================================================
           TARJETA
           ================================================== */

        card.innerHTML = `

          <div class="planet-card-top">

            <h4>
              ${planet.name}
            </h4>

            <span class="planet-type">
              ${planet.type}
            </span>

          </div>


          <div class="planet-stat">

            <span>
              Minerales
            </span>

            <strong>
              ${planet.minerals}
            </strong>

          </div>


          <div class="planet-stat">

            <span>
              Energía
            </span>

            <strong>
              ${planet.energy}
            </strong>

          </div>


          <div class="planet-stat">

            <span>
              Peligro
            </span>

            <strong>
              ${planet.danger}/10
            </strong>

          </div>


          <div class="planet-stat">

            <span>
              Minería rápida
            </span>

            <strong>

              ${planet.miningDeposits}
              /
              ${planet.maxMiningDeposits}

            </strong>

          </div>


          ${traitsHTML}

          ${threatHTML}

          ${civilizationHTML}

          ${colonyHTML}

          ${expeditionHTML}


          <div class="planet-card-actions">

            ${deepScanButton}

            ${miningButton}

            ${scientificButton}

            ${studyButton}

            ${threatButton}

            ${primaryButton}

          </div>

        `;


        grid.appendChild(
          card
        );

      }
    );


  setText(

    "planetCount",

    gameState
      .discoveredPlanets
      .length

    +

    " detectados"

  );


  setText(

    "explorationPlanetCount",

    gameState
      .discoveredPlanets
      .length

  );

}



/* ==========================================================
   26. MINERÍA
   ========================================================== */

function canMinePlanet(
  planet
) {

  if (
    !planet.civilization
  ) {

    return true;

  }


  const diplomacy =
    gameState.diplomacy[
      planet.civilization.raceId
    ];


  return (
    diplomacy?.miningRights ===
    true
  );

}



function sendMiningExpedition(
  planetId
) {

  const planet =
    findPlanet(
      planetId
    );


  if (!planet) {
    return;
  }


  if (
    !canMinePlanet(
      planet
    )
  ) {

    addLog(

      "No dispones de permisos mineros para "
      +
      planet.name
      +
      "."

    );

    return;

  }


  if (
    planet.miningDeposits <=
    0
  ) {

    return;

  }


  if (
    getActiveExpeditionForPlanet(
      planet.id
    )
  ) {

    addLog(

      "Ya existe una misión activa en "
      +
      planet.name
      +
      "."

    );

    return;

  }


  if (
    getAvailableShips() <=
    0
  ) {

    addLog(
      "No hay naves disponibles."
    );

    return;

  }


  const energyCost =
    getMiningEnergyCost();


  if (
    gameState.energy <
    energyCost
  ) {

    addLog(

      "Se necesitan "
      +
      energyCost
      +
      " de energía para enviar la expedición minera."

    );

    return;

  }


  const duration =
    getMiningDuration(
      planet.danger
    );


  const successChance =
    getMiningSuccessChance(
      planet
    );


  let warning =
    "";


  if (
    !planet.threatInvestigated
  ) {

    warning =

      "\n\n⚠ Las amenazas del planeta NO han sido investigadas.";

  }

  else if (
    planet.threat
  ) {

    const threat =
      getPlanetThreatData(
        planet
      );


    warning =

      "\n\nAmenaza conocida: "
      +
      threat.name
      +
      ".";

  }


  const accepted =
    confirm(

      "EXPEDICIÓN MINERA"

      +

      "\n\nDestino: "
      +
      planet.name

      +

      "\nPeligro: "
      +
      planet.danger
      +
      "/10"

      +

      "\nDuración: "
      +
      duration
      +
      " turno(s)"

      +

      "\nProbabilidad de éxito: "
      +
      successChance
      +
      "%"

      +

      "\nCoste: "
      +
      energyCost
      +
      " energía"

      +

      "\nNave ocupada: 1"

      +

      warning

      +

      "\n\n¿Enviar expedición?"

    );


  if (
    !accepted
  ) {

    return;

  }


  gameState.energy -=
    energyCost;


  /*
    El yacimiento se consume al salir.
  */

  planet.miningDeposits--;


  gameState
    .activeExpeditions
    .push({

      id:
        "expedition-"
        +
        Date.now()
        +
        "-"
        +
        randomNumber(
          1000,
          9999
        ),

      type:
        "mining",

      planetId:
        planet.id,

      planetName:
        planet.name,

      danger:
        planet.danger,

      remainingTurns:
        duration,

      totalTurns:
        duration

    });


  addLog(

    "Una expedición minera ha partido hacia "
    +
    planet.name
    +
    "."

  );


  updateInterface();

  renderPlanets();

}



function getMiningEnergyCost() {

  const reduction =
    getResearchBonus(
      "miningEnergyCostReduction"
    );


  return Math.max(

    1,

    gameConfig
      .miningExpedition
      .energyCost

    -

    reduction

  );

}



function getMiningDuration(
  danger
) {

  if (
    danger <=
    3
  ) {

    return 2;

  }


  if (
    danger <=
    6
  ) {

    return 3;

  }


  if (
    danger <=
    8
  ) {

    return 4;

  }


  return 5;

}



function getMiningSuccessChance(
  planet
) {

  return clamp(

    100

    -

    planet.danger
    *
    7,

    5,

    95

  );

}



function getMiningDisasterChance(
  planet
) {

  const reduction =
    getResearchBonus(
      "miningDisasterReduction"
    );


  return clamp(

    planet.danger
    *
    3

    -

    reduction,

    0,

    100

  );

}



function resolveMiningExpedition(
  expedition
) {

  const planet =
    findPlanet(
      expedition.planetId
    );


  if (!planet) {
    return;
  }


  const threat =
    getPlanetThreatData(
      planet
    );


  /* AMENAZA OCULTA */

  if (
    threat
    &&
    !planet.threatInvestigated
  ) {

    const hiddenThreatRoll =
      randomNumber(
        1,
        100
      );


    const miningThreatLossChance =
      Math.round(

        threat
          .unpreparedShipLossChance

        *

        0.65

      );


    if (
      hiddenThreatRoll <=
      miningThreatLossChance
    ) {

      gameState.fleet =
        Math.max(

          0,

          gameState.fleet - 1

        );


      gameState.militaryPower =
        Math.max(

          0,

          gameState.militaryPower

          -

          gameConfig
            .miningExpedition
            .militaryPowerLoss

        );


      addLog(

        "DESASTRE MINERO: la nave enviada a "
        +
        planet.name
        +
        " encontró una amenaza desconocida ("
        +
        threat.name
        +
        ") y se ha perdido."

      );


      return;

    }

  }



  const roll =
    randomNumber(
      1,
      100
    );


  const successChance =
    getMiningSuccessChance(
      planet
    );


  const disasterChance =
    getMiningDisasterChance(
      planet
    );


  /* ÉXITO */

  if (
    roll <=
    successChance
  ) {

    const minimumReward =
      Math.max(

        1,

        Math.round(

          planet.minerals
          *
          0.5

        )

      );


    const maximumReward =
      Math.max(

        minimumReward,

        planet.minerals

      );


    let reward =
      randomNumber(

        minimumReward,

        maximumReward

      );


    const researchBonus =
      getResearchBonus(
        "miningRewardBonus"
      );


    const planetBonus =
      getPlanetTraitEffectTotal(

        planet,

        "planetMiningRewardBonus"

      );


    reward =
      Math.round(

        reward

        *

        (
          1
          +
          researchBonus
          +
          planetBonus
        )

      );


    gameState.minerals +=
      reward;


    addLog(

      "La expedición minera de "
      +
      planet.name
      +
      " regresa con +"
      +
      reward
      +
      " minerales."

    );


    return;

  }



  /* DESASTRE */

  if (
    roll >
    100
    -
    disasterChance
  ) {

    gameState.fleet =
      Math.max(

        0,

        gameState.fleet - 1

      );


    gameState.militaryPower =
      Math.max(

        0,

        gameState.militaryPower

        -

        gameConfig
          .miningExpedition
          .militaryPowerLoss

      );


    addLog(

      "DESASTRE: la nave minera enviada a "
      +
      planet.name
      +
      " ha sido destruida."

    );


    return;

  }



  /* FALLO */

  addLog(

    "La expedición minera de "
    +
    planet.name
    +
    " ha regresado sin recursos."

  );

}



/* ==========================================================
   27. PROCESAR EXPEDICIONES
   ========================================================== */

function processExpeditions() {

  gameState
    .activeExpeditions
    .forEach(
      function(expedition) {

        expedition.remainingTurns--;

      }
    );


  const completed =
    gameState
      .activeExpeditions
      .filter(
        function(expedition) {

          return (
            expedition.remainingTurns <=
            0
          );

        }
      );


  completed.forEach(
    function(expedition) {

      if (
        expedition.type ===
        "mining"
      ) {

        resolveMiningExpedition(
          expedition
        );

      }


      if (
        expedition.type ===
        "scientific"
      ) {

        resolveScientificExpedition(
          expedition
        );

      }

    }
  );


  gameState.activeExpeditions =
    gameState
      .activeExpeditions
      .filter(
        function(expedition) {

          return (
            expedition.remainingTurns >
            0
          );

        }
      );


  renderExpeditions();

  renderPlanets();

  renderFleetScreen();

}



/* ==========================================================
   28. PANEL DE EXPEDICIONES
   ========================================================== */

function createExpeditionPanel() {

  const explorationScreen =
    document.getElementById(
      "explorationScreen"
    );


  if (!explorationScreen) {
    return;
  }


  if (
    document.getElementById(
      "activeExpeditionsPanel"
    )
  ) {

    return;

  }


  const discoveredSection =
    explorationScreen.querySelector(
      ".discovered-section"
    );


  const panel =
    document.createElement(
      "section"
    );


  panel.id =
    "activeExpeditionsPanel";


  panel.className =
    "panel";


  panel.style.marginBottom =
    "18px";


  panel.innerHTML = `

    <div class="panel-header">

      <h3>
        Misiones activas
      </h3>

      <span id="activeExpeditionCount">
        0 activas
      </span>

    </div>


    <div
      id="activeExpeditionList"
      class="panel-content"
    >

      <div class="empty-message">
        No hay expediciones activas.
      </div>

    </div>

  `;


  if (
    discoveredSection
  ) {

    explorationScreen.insertBefore(

      panel,

      discoveredSection

    );

  }

  else {

    explorationScreen.appendChild(
      panel
    );

  }

}



function renderExpeditions() {

  const list =
    document.getElementById(
      "activeExpeditionList"
    );


  if (!list) {
    return;
  }


  setText(

    "activeExpeditionCount",

    gameState
      .activeExpeditions
      .length

    +

    " activas"

  );


  if (
    gameState
      .activeExpeditions
      .length ===
    0
  ) {

    list.innerHTML = `

      <div class="empty-message">
        No hay expediciones activas.
      </div>

    `;


    return;

  }


  list.innerHTML =
    "";


  gameState
    .activeExpeditions
    .forEach(
      function(expedition) {

        const planet =
          findPlanet(
            expedition.planetId
          );


        const mission =
          document.createElement(
            "div"
          );


        mission.className =
          "civilization-box";


        mission.style.marginBottom =
          "10px";


        let extraInfo =
          "";


        if (
          expedition.type ===
          "scientific"
        ) {

          extraInfo = `

            <span>

              Éxito estimado:
              ${
                planet
                  ?
                getScientificSuccessChance(
                  planet
                )
                  :
                "?"
              }%

            </span>

          `;

        }


        if (
          expedition.type ===
          "mining"
        ) {

          extraInfo = `

            <span>

              Éxito estimado:
              ${
                planet
                  ?
                getMiningSuccessChance(
                  planet
                )
                  :
                "?"
              }%

            </span>

          `;

        }


        mission.innerHTML = `

          <small>

            ${getExpeditionTypeName(
              expedition.type
            )}

          </small>


          <strong>
            ${expedition.planetName}
          </strong>


          <span>

            Peligro:
            ${expedition.danger}/10

          </span>


          ${extraInfo}


          <span class="attitude neutral">

            Regresa en
            ${expedition.remainingTurns}
            turno(s)

          </span>


          <button
            type="button"
            class="planet-action-button"
            onclick="retreatExpedition('${expedition.id}')"
            style="margin-top:8px;"
          >

            Retirar expedición

          </button>

        `;


        list.appendChild(
          mission
        );

      }
    );

}



function getExpeditionTypeName(
  type
) {

  if (
    type ===
    "mining"
  ) {

    return "Expedición minera";

  }


  if (
    type ===
    "scientific"
  ) {

    return "Expedición científica";

  }


  return "Expedición";

}



function getAvailableShips() {

  const occupiedShips =
    gameState
      .activeExpeditions
      .length;


  return Math.max(

    0,

    gameState.fleet

    -

    occupiedShips

  );

}



function getActiveExpeditionForPlanet(
  planetId
) {

  return gameState
    .activeExpeditions
    .find(
      function(expedition) {

        return (

          String(
            expedition.planetId
          )

          ===

          String(
            planetId
          )

        );

      }
    );

}



/* ==========================================================
   29. ANTIGUO ESCANEAR
   ==========================================================
   Se conserva por compatibilidad.
   Ya no aparece como botón principal.
   ========================================================== */

function scanPlanet(
  planetId
) {

  const planet =
    findPlanet(
      planetId
    );


  if (!planet) {
    return;
  }


  let civilization =
    "No detectada";


  if (
    planet.civilization
  ) {

    civilization =

      planet.civilization.name

      +

      " - "

      +

      planet.civilization.attitude;

  }


  const threatText =

    !planet.threatInvestigated
      ?
    "NO INVESTIGADAS"
      :
    !planet.threat
      ?
    "Ninguna detectada"
      :
    getPlanetThreatData(
      planet
    ).name;


  alert(

    "INFORMACIÓN PLANETARIA"

    +

    "\n\nPlaneta: "
    +
    planet.name

    +

    "\nTipo: "
    +
    planet.type

    +

    "\nPeligro: "
    +
    planet.danger
    +
    "/10"

    +

    "\nMinerales: "
    +
    planet.minerals

    +

    "\nEnergía: "
    +
    planet.energy

    +

    "\nCivilización: "
    +
    civilization

    +

    "\nMinería rápida: "
    +
    planet.miningDeposits
    +
    "/"
    +
    planet.maxMiningDeposits

    +

    "\nAmenazas: "
    +
    threatText

  );

}



/* ==========================================================
   30. HELPERS DE RASGOS Y AMENAZAS
   ========================================================== */

function getPlanetThreatData(
  planet
) {

  if (
    !planet?.threat
  ) {

    return null;

  }


  return (

    planetThreats[
      planet.threat.id
    ]

    ||

    null

  );

}



function getPlanetTraitEffectTotal(
  planet,
  effectType
) {

  if (
    !planet?.traits
  ) {

    return 0;

  }


  let total =
    0;


  planet.traits.forEach(
    function(traitId) {

      const trait =
        planetTraits[
          traitId
        ];


      if (
        !trait?.effects
      ) {

        return;

      }


      trait.effects.forEach(
        function(effect) {

          if (
            effect.type ===
            effectType
          ) {

            total +=
              Number(
                effect.value
              )
              ||
              0;

          }

        }
      );

    }
  );


  return total;

}



/* ==========================================================
   31. COLONIZACIÓN
   ========================================================== */

function colonizePlanet(
  planetId
) {

  const planet =
    findPlanet(
      planetId
    );


  if (!planet) {
    return;
  }


  if (
    planet.civilization
  ) {

    addLog(
      "No puedes colonizar un planeta ocupado por otra civilización."
    );

    return;

  }


  if (
    planet.colonized
  ) {

    return;

  }


  const creditCost =
    gameConfig
      .colonization
      .creditCost;


  const mineralCost =
    gameConfig
      .colonization
      .mineralCost;


  if (
    gameState.credits <
    creditCost

    ||

    gameState.minerals <
    mineralCost
  ) {

    addLog(
      "No hay suficientes recursos para colonizar."
    );

    return;

  }


  gameState.credits -=
    creditCost;


  gameState.minerals -=
    mineralCost;


  planet.colonized =
    true;


  setPlanetColonyProduction(
    planet
  );


  addLog(

    "Colonia establecida en "
    +
    planet.name
    +
    "."

  );


  updateInterface();

  renderPlanets();

}



/* ==========================================================
   32. PRODUCCIÓN DE COLONIA
   ========================================================== */

function setPlanetColonyProduction(
  planet
) {

  let mineralProduction =
    Math.max(

      1,

      Math.floor(

        planet.minerals
        /
        10

      )

    );


  let energyProduction =
    Math.max(

      1,

      Math.floor(

        planet.energy
        /
        10

      )

    );


  /*
    Los rasgos afectan solo si
    el jugador hizo escaneo profundo.
  */

  if (
    planet.deepScanCompleted
  ) {

    mineralProduction =
      Math.max(

        1,

        Math.round(

          mineralProduction

          *

          (
            1
            +
            getPlanetTraitEffectTotal(

              planet,

              "colonyMineralBonus"

            )
          )

        )

      );


    energyProduction =
      Math.max(

        1,

        Math.round(

          energyProduction

          *

          (
            1
            +
            getPlanetTraitEffectTotal(

              planet,

              "colonyEnergyBonus"

            )
          )

        )

      );

  }


  mineralProduction =
    Math.max(

      1,

      Math.round(

        mineralProduction

        *

        (
          planet
            .studyBonus
            ?.colonyMineralMultiplier
          ||
          1
        )

      )

    );


  energyProduction =
    Math.max(

      1,

      Math.round(

        energyProduction

        *

        (
          planet
            .studyBonus
            ?.colonyEnergyMultiplier
          ||
          1
        )

      )

    );


  planet.colonyProduction.minerals =
    mineralProduction;


  planet.colonyProduction.energy =
    energyProduction;

}



function calculateColonyProduction() {

  let minerals =
    0;


  let energy =
    0;


  gameState
    .discoveredPlanets
    .forEach(
      function(planet) {

        if (
          !planet.colonized
        ) {

          return;

        }


        minerals +=
          planet
            .colonyProduction
            .minerals;


        energy +=
          planet
            .colonyProduction
            .energy;

      }
    );


  return {

    minerals,

    energy

  };

}



/* ==========================================================
   33. REGISTRAR CIVILIZACIÓN
   ========================================================== */

function registerKnownCivilization(
  planet
) {

  if (
    !planet.civilization
  ) {

    return;

  }


  const raceId =
    planet.civilization.raceId;


  if (
    !gameState.diplomacy[
      raceId
    ]
  ) {

    let startingRelation =
      0;


    if (
      planet.civilization.attitude ===
      "Pacífica"
    ) {

      startingRelation =
        15;

    }

    else if (
      planet.civilization.attitude ===
      "Hostil"
    ) {

      startingRelation =
        -25;

    }


    gameState.diplomacy[
      raceId
    ] = {

      raceId:
        raceId,

      name:
        planet.civilization.name,

      contacted:
        false,

      relation:
        startingRelation,

      miningRights:
        false,

      knownPlanets:
        []

    };

  }


  const record =
    gameState.diplomacy[
      raceId
    ];


  const alreadyKnown =
    record.knownPlanets.some(
      function(knownPlanet) {

        return (
          knownPlanet.id ===
          planet.id
        );

      }
    );


  if (
    !alreadyKnown
  ) {

    record.knownPlanets.push({

      id:
        planet.id,

      name:
        planet.name

    });

  }

}



/* ==========================================================
   34. DIPLOMACIA
   ========================================================== */

function renderDiplomacyScreen() {

  const screen =
    document.getElementById(
      "diplomacyScreen"
    );


  if (!screen) {
    return;
  }


  const civilizations =
    Object.values(
      gameState.diplomacy
    );


  let content =
    "";


  if (
    civilizations.length ===
    0
  ) {

    content = `

      <div class="empty-message">

        Todavía no has descubierto
        civilizaciones extranjeras.

      </div>

    `;

  }


  civilizations.forEach(
    function(record) {

      const race =
        races[
          record.raceId
        ];


      let actions =
        "";


      if (
        !record.contacted
      ) {

        actions = `

          <button
            type="button"
            class="planet-action-button"
            onclick="contactCivilization('${record.raceId}')"
          >

            Establecer contacto

          </button>

        `;

      }

      else {

        actions = `

          <button
            type="button"
            class="planet-action-button"
            onclick="improveRelations('${record.raceId}')"
          >

            Mejorar relaciones

          </button>

        `;


        if (
          record.miningRights
        ) {

          actions += `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Acuerdo minero activo

            </button>

          `;

        }

        else if (
          record.relation >=
          gameConfig
            .diplomacy
            .miningAgreementMinimumRelation
        ) {

          actions += `

            <button
              type="button"
              class="planet-action-button"
              onclick="requestMiningAgreement('${record.raceId}')"
            >

              Acuerdo minero

            </button>

          `;

        }

        else {

          actions += `

            <button
              type="button"
              class="planet-action-button"
              disabled
            >

              Acuerdo bloqueado

            </button>

          `;

        }

      }


      content += `

        <div class="planet-card diplomacy-card">

          <div class="planet-card-top">

            <h4>
              ${record.name}
            </h4>

            <span class="planet-type">
              ${race?.playstyle || ""}
            </span>

          </div>


          <p class="dynamic-description">

            ${race?.description || ""}

          </p>


          <div class="planet-stat">

            <span>
              Relación
            </span>

            <strong>
              ${record.relation}
            </strong>

          </div>


          <div class="civilization-box">

            <small>
              Estado
            </small>

            <strong>

              ${
                record.contacted
                  ?
                getRelationLabel(
                  record.relation
                )
                  :
                "Sin contacto"
              }

            </strong>

          </div>


          <div class="planet-card-actions">

            ${actions}

          </div>

        </div>

      `;

    }
  );


  screen.innerHTML = `

    <section class="section-header">

      <p>
        Relaciones interestelares
      </p>

      <h2>
        Diplomacia
      </h2>

      <div class="description">

        Gestiona las relaciones
        con las civilizaciones conocidas.

      </div>

    </section>


    <section class="exploration-summary">

      ${createSummaryCard(
        "Civilizaciones",
        civilizations.length
      )}

      ${createSummaryCard(
        "Contactos",
        civilizations.filter(
          civ => civ.contacted
        ).length
      )}

      ${createSummaryCard(
        "Acuerdos mineros",
        civilizations.filter(
          civ => civ.miningRights
        ).length
      )}

    </section>


    <section class="panel">

      <div class="panel-header">

        <h3>
          Civilizaciones conocidas
        </h3>

      </div>


      <div class="panel-content diplomacy-grid">

        ${content}

      </div>

    </section>

  `;

}



function contactCivilization(
  raceId
) {

  const record =
    gameState.diplomacy[
      raceId
    ];


  if (
    !record
    ||
    record.contacted
  ) {

    return;

  }


  record.contacted =
    true;


  addLog(

    "Se ha establecido contacto con "
    +
    record.name
    +
    "."

  );


  renderDiplomacyScreen();

  renderPlanets();

}



function improveRelations(
  raceId
) {

  const record =
    gameState.diplomacy[
      raceId
    ];


  if (
    !record
    ||
    !record.contacted
  ) {

    return;

  }


  const cost =
    gameConfig
      .diplomacy
      .improveRelationsCreditCost;


  if (
    gameState.credits <
    cost
  ) {

    addLog(
      "No tienes suficientes créditos para la misión diplomática."
    );

    return;

  }


  gameState.credits -=
    cost;


  record.relation =
    clamp(

      record.relation

      +

      gameConfig
        .diplomacy
        .improveRelationsGain,

      -100,

      100

    );


  addLog(

    "La relación con "
    +
    record.name
    +
    " ha mejorado a "
    +
    record.relation
    +
    "."

  );


  updateInterface();

  renderPlanets();

}



function requestMiningAgreement(
  raceId
) {

  const record =
    gameState.diplomacy[
      raceId
    ];


  if (
    !record
    ||
    !record.contacted
    ||
    record.miningRights
  ) {

    return;

  }


  const minimum =
    gameConfig
      .diplomacy
      .miningAgreementMinimumRelation;


  if (
    record.relation <
    minimum
  ) {

    addLog(
      "La relación diplomática todavía es demasiado baja."
    );

    return;

  }


  const cost =
    gameConfig
      .diplomacy
      .miningAgreementCreditCost;


  if (
    gameState.credits <
    cost
  ) {

    addLog(
      "No tienes suficientes créditos para negociar el acuerdo."
    );

    return;

  }


  const accepted =
    confirm(

      "ACUERDO MINERO"

      +

      "\n\nCivilización: "
      +
      record.name

      +

      "\nCoste: "
      +
      cost
      +
      " créditos"

      +

      "\n\n¿Firmar acuerdo?"

    );


  if (
    !accepted
  ) {

    return;

  }


  gameState.credits -=
    cost;


  record.miningRights =
    true;


  addLog(

    "Se ha firmado un acuerdo minero con "
    +
    record.name
    +
    "."

  );


  updateInterface();

  renderPlanets();

}



function openDiplomacyForCivilization() {

  showGameScreen(
    "diplomacyScreen"
  );


  const button =
    document.querySelector(
      '.menu-button[data-screen="diplomacyScreen"]'
    );


  if (
    button
  ) {

    setActiveMenuButton(
      button
    );

  }

}



function getRelationLabel(
  relation
) {

  if (
    relation <=
    -50
  ) {

    return "Hostil";

  }


  if (
    relation <
    0
  ) {

    return "Tensa";

  }


  if (
    relation <
    25
  ) {

    return "Neutral";

  }


  if (
    relation <
    60
  ) {

    return "Cordial";

  }


  return "Amistosa";

}



/* ==========================================================
   35. FLOTA
   ========================================================== */

function renderFleetScreen() {

  const fleetScreen =
    document.getElementById(
      "fleetScreen"
    );


  if (!fleetScreen) {
    return;
  }


  const total =
    gameState.fleet;


  const missions =
    gameState
      .activeExpeditions
      .length;


  const available =
    getAvailableShips();


  const creditCost =
    getFleetCreditCost();


  const mineralCost =
    getFleetMineralCost();


  let missionsHTML =
    "";


  if (
    missions ===
    0
  ) {

    missionsHTML = `

      <div class="empty-message">
        Todas las naves están disponibles.
      </div>

    `;

  }

  else {

    gameState
      .activeExpeditions
      .forEach(
        function(
          expedition,
          index
        ) {

          missionsHTML += `

            <div class="civilization-box">

              <small>
                Nave ${index + 1}
              </small>

              <strong>

                ${getExpeditionTypeName(
                  expedition.type
                )}

              </strong>

              <span>
                ${expedition.planetName}
              </span>

              <span class="attitude neutral">

                ${expedition.remainingTurns}
                turno(s)

              </span>

              <button
                type="button"
                class="planet-action-button"
                onclick="retreatExpedition('${expedition.id}')"
                style="margin-top:8px;"
              >

                Retirar expedición

              </button>

            </div>

          `;

        }
      );

  }


  fleetScreen.innerHTML = `

    <section class="section-header">

      <p>
        Fuerzas espaciales
      </p>

      <h2>
        Flota
      </h2>

      <div class="description">
        Gestiona las naves de tu civilización.
      </div>

    </section>


    <section
      class="exploration-summary exploration-summary-four"
    >

      ${createSummaryCard(
        "Naves totales",
        total
      )}

      ${createSummaryCard(
        "Disponibles",
        available
      )}

      ${createSummaryCard(
        "En misión",
        missions
      )}

      ${createSummaryCard(
        "Poder militar",
        gameState.militaryPower
      )}

    </section>


    <section class="panel">

      <div class="panel-header">

        <h3>
          Astillero
        </h3>

        <span>
          Construcción naval
        </span>

      </div>


      <div class="panel-content">

        <div class="exploration-launch-content">

          <div>

            <h3>
              Construir nueva nave
            </h3>

            <p>

              Coste:
              ${creditCost}
              créditos +
              ${mineralCost}
              minerales.

            </p>

          </div>


          <button
            type="button"
            class="exploration-launch-button"
            onclick="buildFleet()"
          >

            Construir nave

          </button>

        </div>

      </div>

    </section>


    <section class="panel fleet-missions-panel">

      <div class="panel-header">

        <h3>
          Operaciones activas
        </h3>

      </div>


      <div class="panel-content fleet-mission-list">

        ${missionsHTML}

      </div>

    </section>

  `;

}



function getFleetCreditCost() {

  const reduction =
    getResearchBonus(
      "fleetCreditCostReduction"
    );


  return Math.max(

    1,

    Math.round(

      gameConfig
        .fleet
        .creditCost

      *

      (
        1
        -
        reduction
      )

    )

  );

}



function getFleetMineralCost() {

  const reduction =
    getResearchBonus(
      "fleetMineralCostReduction"
    );


  return Math.max(

    1,

    Math.round(

      gameConfig
        .fleet
        .mineralCost

      *

      (
        1
        -
        reduction
      )

    )

  );

}



function buildFleet() {

  const credits =
    getFleetCreditCost();


  const minerals =
    getFleetMineralCost();


  if (
    gameState.credits <
    credits

    ||

    gameState.minerals <
    minerals
  ) {

    addLog(
      "No tienes suficientes recursos para construir una nave."
    );

    return;

  }


  gameState.credits -=
    credits;


  gameState.minerals -=
    minerals;


  gameState.fleet++;


  const researchBonus =
    getResearchBonus(
      "fleetMilitaryGainBonus"
    );


  const gain =
    Math.max(

      1,

      Math.round(

        gameConfig
          .fleet
          .baseMilitaryGain

        *

        gameState
          .race
          .modifiers
          .militaryPowerGain

        *

        (
          1
          +
          researchBonus
        )

      )

    );


  gameState.militaryPower +=
    gain;


  addLog(

    "Nueva nave construida. +"
    +
    gain
    +
    " poder militar."

  );


  updateInterface();

}



/* ==========================================================
   36. MERCADO
   ========================================================== */

function renderMarketScreen() {

  const screen =
    document.getElementById(
      "marketScreen"
    );


  if (!screen) {
    return;
  }


  screen.innerHTML = `

    <section class="section-header">

      <p>
        Comercio galáctico
      </p>

      <h2>
        Mercado
      </h2>

      <div class="description">
        Compra recursos utilizando tus créditos.
      </div>

    </section>


    <section class="exploration-summary">

      ${createSummaryCard(
        "Créditos",
        gameState.credits
      )}

      ${createSummaryCard(
        "Minerales",
        gameState.minerals
      )}

      ${createSummaryCard(
        "Energía",
        gameState.energy
      )}

    </section>


    <section class="market-grid">

      <article class="panel market-product">

        <div class="market-product-icon">
          ◆
        </div>

        <h3>
          Lote de minerales
        </h3>

        <p>

          Adquiere materiales industriales
          para colonización y construcción.

        </p>

        <div class="market-value">

          +${gameConfig.market.minerals.amount}
          minerales

        </div>

        <div class="market-price">

          ${gameConfig.market.minerals.creditCost}
          créditos

        </div>

        <button
          type="button"
          class="market-buy-button"
          onclick="buyMinerals()"
        >

          Comprar

        </button>

      </article>


      <article class="panel market-product">

        <div class="market-product-icon">
          ⚡
        </div>

        <h3>
          Reserva energética
        </h3>

        <p>

          Compra energía adicional para
          expediciones y operaciones espaciales.

        </p>

        <div class="market-value">

          +${gameConfig.market.energy.amount}
          energía

        </div>

        <div class="market-price">

          ${gameConfig.market.energy.creditCost}
          créditos

        </div>

        <button
          type="button"
          class="market-buy-button"
          onclick="buyEnergy()"
        >

          Comprar

        </button>

      </article>

    </section>

  `;

}



function buyMinerals() {

  const item =
    gameConfig
      .market
      .minerals;


  if (
    gameState.credits <
    item.creditCost
  ) {

    addLog(
      "No tienes créditos suficientes para comprar minerales."
    );

    return;

  }


  gameState.credits -=
    item.creditCost;


  gameState.minerals +=
    item.amount;


  addLog(

    "Mercado: +"
    +
    item.amount
    +
    " minerales."

  );


  updateInterface();

}



function buyEnergy() {

  const item =
    gameConfig
      .market
      .energy;


  if (
    gameState.credits <
    item.creditCost
  ) {

    addLog(
      "No tienes créditos suficientes para comprar energía."
    );

    return;

  }


  gameState.credits -=
    item.creditCost;


  gameState.energy +=
    item.amount;


  addLog(

    "Mercado: +"
    +
    item.amount
    +
    " energía."

  );


  updateInterface();

}



/* ==========================================================
   37. INVESTIGACIÓN VISUAL
   ========================================================== */

function renderResearchScreen() {

  const screen =
    document.getElementById(
      "researchScreen"
    );


  if (!screen) {
    return;
  }


  const treeIds =
    Object.keys(
      researchTrees
    );


  if (
    treeIds.length ===
    0
  ) {

    screen.innerHTML = `

      <section class="section-header">

        <p>
          Desarrollo científico
        </p>

        <h2>
          Investigación
        </h2>

      </section>


      <div class="empty-message">

        No hay árboles de investigación definidos.

      </div>

    `;


    return;

  }


  if (
    !researchTrees[
      gameState.selectedResearchTree
    ]
  ) {

    gameState.selectedResearchTree =
      treeIds[0];

  }


  const treeId =
    gameState.selectedResearchTree;


  const tree =
    researchTrees[
      treeId
    ];


  const selectedResult =
    getResearchUpgrade(
      gameState.selectedResearchUpgrade
    );


  if (
    !selectedResult
    ||
    selectedResult.treeId !==
    treeId
  ) {

    const firstUpgradeId =
      Object.keys(
        tree.upgrades
      )[0];


    gameState.selectedResearchUpgrade =
      firstUpgradeId
        ?
      treeId
      +
      "."
      +
      firstUpgradeId
        :
      null;

  }


  let tabsHTML =
    "";


  treeIds.forEach(
    function(id) {

      const currentTree =
        researchTrees[
          id
        ];


      const total =
        Object.keys(
          currentTree.upgrades
        ).length;


      const researched =
        Object.keys(
          currentTree.upgrades
        )
        .filter(
          function(upgradeId) {

            return hasResearchedUpgrade(

              id
              +
              "."
              +
              upgradeId

            );

          }
        )
        .length;


      tabsHTML += `

        <button
          type="button"
          class="research-tree-tab ${
            id === treeId
              ?
            "active"
              :
            ""
          }"
          style="--tree-color:${currentTree.color};"
          onclick="selectResearchTree('${id}')"
        >

          <strong>

            ${
              currentTree.shortName
              ||
              currentTree.name
            }

          </strong>

          <span>

            ${researched}
            /
            ${total}

          </span>

        </button>

      `;

    }
  );


  screen.innerHTML = `

    <section class="section-header">

      <p>
        Desarrollo científico
      </p>

      <h2>
        Investigación
      </h2>

      <div class="description">

        Desbloquea nuevas tecnologías
        y desarrolla las capacidades de tu civilización.

      </div>

    </section>


    <section class="research-top-summary">

      <div class="research-science-box">

        <span>
          Ciencia disponible
        </span>

        <strong>
          ${gameState.science}
        </strong>

      </div>


      <div class="research-tree-tabs">

        ${tabsHTML}

      </div>

    </section>


    <section
      class="research-workspace"
      style="--tree-color:${tree.color};"
    >

      <div class="research-tree-section">

        <div class="research-tree-header">

          <div>

            <span class="research-tree-kicker">
              Rama tecnológica
            </span>

            <h3>
              ${tree.name}
            </h3>

            <p>
              ${tree.description}
            </p>

          </div>

        </div>


        <div class="research-canvas-viewport">

          ${renderResearchTreeCanvas(
            treeId
          )}

        </div>


        <div class="research-legend">

          <span>

            <i class="legend-dot researched"></i>

            Investigada

          </span>

          <span>

            <i class="legend-dot available"></i>

            Disponible

          </span>

          <span>

            <i class="legend-dot locked"></i>

            Bloqueada

          </span>

        </div>

      </div>


      <aside
        id="researchDetailsPanel"
        class="research-details"
      >

        ${renderResearchDetails()}

      </aside>

    </section>

  `;

}



function renderResearchTreeCanvas(
  treeId
) {

  const tree =
    researchTrees[
      treeId
    ];


  if (!tree) {
    return "";
  }


  const entries =
    Object.entries(
      tree.upgrades
    );


  if (
    entries.length ===
    0
  ) {

    return `

      <div class="empty-message">

        Este árbol todavía no tiene tecnologías.

      </div>

    `;

  }


  const layout =
    getResearchTreeLayout(
      tree
    );


  let lines =
    "";


  let nodes =
    "";


  entries.forEach(
    function([
      upgradeId,
      upgrade
    ]) {

      const fullId =
        treeId
        +
        "."
        +
        upgradeId;


      const position =
        layout.positions[
          upgradeId
        ];


      const status =
        getResearchStatus(
          fullId
        );


      const selected =
        gameState.selectedResearchUpgrade ===
        fullId;


      const requirements =
        upgrade.requires || [];


      requirements.forEach(
        function(requiredFullId) {

          const parts =
            requiredFullId.split(
              "."
            );


          if (
            parts[0] !==
            treeId
          ) {

            return;

          }


          const requiredPosition =
            layout.positions[
              parts[1]
            ];


          if (
            !requiredPosition
          ) {

            return;

          }


          const lineActive =
            hasResearchedUpgrade(
              requiredFullId
            );


          lines += `

            <line
              x1="${requiredPosition.centerX}"
              y1="${requiredPosition.centerY}"
              x2="${position.centerX}"
              y2="${position.centerY}"
              class="research-connection ${
                lineActive
                  ?
                "active"
                  :
                ""
              }"
            />

          `;

        }
      );


      nodes += `

        <button
          type="button"
          class="
            research-node
            ${status}
            ${selected ? "selected" : ""}
          "
          style="
            left:${position.left}px;
            top:${position.top}px;
          "
          onclick="selectResearchUpgrade('${fullId}')"
          title="${upgrade.name}"
        >

          <span class="research-node-circle">

            <span class="research-node-icon">

              ${upgrade.icon || "◆"}

            </span>


            ${
              status === "locked"
                ?
              `<span class="research-node-lock">🔒</span>`
                :
              ""
            }

          </span>


          <span class="research-node-label">

            ${upgrade.name}

          </span>


          <span class="research-node-cost">

            ${
              status === "researched"
                ?
              "Completada"
                :
              upgrade.scienceCost
              +
              " ciencia"
            }

          </span>

        </button>

      `;

    }
  );


  return `

    <div
      class="research-tree-canvas"
      style="
        width:${layout.width}px;
        height:${layout.height}px;
      "
    >

      <svg
        class="research-lines"
        width="${layout.width}"
        height="${layout.height}"
      >

        ${lines}

      </svg>


      ${nodes}

    </div>

  `;

}



function getResearchTreeLayout(
  tree
) {

  const entries =
    Object.entries(
      tree.upgrades
    );


  const cellWidth =
    165;


  const cellHeight =
    145;


  const paddingX =
    80;


  const paddingY =
    55;


  let maxX =
    0;


  let maxY =
    0;


  const positions =
    {};


  entries.forEach(
    function([
      upgradeId,
      upgrade
    ], index) {

      const position =
        upgrade.position || {

          x:
            index % 4,

          y:
            Math.floor(
              index / 4
            )

        };


      maxX =
        Math.max(
          maxX,
          position.x
        );


      maxY =
        Math.max(
          maxY,
          position.y
        );


      const left =
        paddingX
        +
        position.x
        *
        cellWidth;


      const top =
        paddingY
        +
        position.y
        *
        cellHeight;


      positions[
        upgradeId
      ] = {

        left:
          left,

        top:
          top,

        centerX:
          left + 40,

        centerY:
          top + 40

      };

    }
  );


  return {

    width:
      Math.max(

        760,

        paddingX * 2

        +

        (maxX + 1)
        *
        cellWidth

      ),

    height:
      Math.max(

        560,

        paddingY * 2

        +

        (maxY + 1)
        *
        cellHeight

      ),

    positions:
      positions

  };

}



function selectResearchTree(
  treeId
) {

  if (
    !researchTrees[
      treeId
    ]
  ) {

    return;

  }


  gameState.selectedResearchTree =
    treeId;


  const firstUpgrade =
    Object.keys(
      researchTrees[
        treeId
      ].upgrades
    )[0];


  gameState.selectedResearchUpgrade =
    firstUpgrade
      ?
    treeId
    +
    "."
    +
    firstUpgrade
      :
    null;


  renderResearchScreen();

}



function selectResearchUpgrade(
  fullUpgradeId
) {

  if (
    !getResearchUpgrade(
      fullUpgradeId
    )
  ) {

    return;

  }


  gameState.selectedResearchUpgrade =
    fullUpgradeId;


  renderResearchScreen();

}



function renderResearchDetails() {

  const fullId =
    gameState.selectedResearchUpgrade;


  const result =
    getResearchUpgrade(
      fullId
    );


  if (!result) {

    return `

      <div class="research-details-empty">

        Selecciona una tecnología
        del árbol para consultar sus detalles.

      </div>

    `;

  }


  const {
    tree,
    upgrade
  } =
    result;


  const status =
    getResearchStatus(
      fullId
    );


  let effectsHTML =
    "";


  const effects =
    upgrade.effects || [];


  if (
    effects.length ===
    0
  ) {

    effectsHTML = `

      <div class="research-detail-empty">

        Sin efecto implementado todavía.

      </div>

    `;

  }

  else {

    effects.forEach(
      function(effect) {

        effectsHTML += `

          <div class="research-effect">

            <span>

              ${getResearchEffectName(
                effect
              )}

            </span>

            <strong>

              ${getResearchEffectValue(
                effect
              )}

            </strong>

          </div>

        `;

      }
    );

  }


  let requirementsHTML =
    "";


  const requirements =
    upgrade.requires || [];


  if (
    requirements.length ===
    0
  ) {

    requirementsHTML = `

      <div class="research-requirement complete">

        Ninguno

      </div>

    `;

  }

  else {

    requirements.forEach(
      function(requirementId) {

        const complete =
          hasResearchedUpgrade(
            requirementId
          );


        requirementsHTML += `

          <div
            class="
              research-requirement
              ${complete ? "complete" : "missing"}
            "
          >

            ${complete ? "✓" : "🔒"}

            ${getResearchUpgradeName(
              requirementId
            )}

          </div>

        `;

      }
    );

  }


  let buttonHTML =
    "";


  if (
    status ===
    "researched"
  ) {

    buttonHTML = `

      <button
        type="button"
        class="research-action-button researched"
        disabled
      >

        Tecnología investigada

      </button>

    `;

  }

  else if (
    status ===
    "locked"
  ) {

    buttonHTML = `

      <button
        type="button"
        class="research-action-button"
        disabled
      >

        Requisitos pendientes

      </button>

    `;

  }

  else if (
    gameState.science <
    upgrade.scienceCost
  ) {

    buttonHTML = `

      <button
        type="button"
        class="research-action-button"
        disabled
      >

        Ciencia insuficiente

      </button>

    `;

  }

  else {

    const parts =
      fullId.split(
        "."
      );


    buttonHTML = `

      <button
        type="button"
        class="research-action-button"
        onclick="researchUpgrade('${parts[0]}', '${parts[1]}')"
      >

        Investigar

      </button>

    `;

  }


  return `

    <div class="research-detail-heading">

      <div
        class="research-detail-icon"
        style="--tree-color:${tree.color};"
      >

        ${upgrade.icon || "◆"}

      </div>


      <div>

        <span>
          ${tree.name}
        </span>

        <h3>
          ${upgrade.name}
        </h3>

      </div>

    </div>


    <p class="research-detail-description">

      ${upgrade.description}

    </p>


    <div class="research-detail-section">

      <h4>
        Efectos
      </h4>

      ${effectsHTML}

    </div>


    <div class="research-detail-section">

      <h4>
        Coste
      </h4>

      <div class="research-cost-line">

        <span>
          Ciencia
        </span>

        <strong>
          ${upgrade.scienceCost}
        </strong>

      </div>

    </div>


    <div class="research-detail-section">

      <h4>
        Requisitos
      </h4>

      ${requirementsHTML}

    </div>


    ${buttonHTML}

  `;

}



function getResearchStatus(
  fullUpgradeId
) {

  if (
    hasResearchedUpgrade(
      fullUpgradeId
    )
  ) {

    return "researched";

  }


  const result =
    getResearchUpgrade(
      fullUpgradeId
    );


  if (!result) {

    return "locked";

  }


  if (
    areResearchRequirementsMet(
      result.upgrade
    )
  ) {

    return "available";

  }


  return "locked";

}



function researchUpgrade(
  treeId,
  upgradeId
) {

  const fullId =
    treeId
    +
    "."
    +
    upgradeId;


  const result =
    getResearchUpgrade(
      fullId
    );


  if (!result) {
    return;
  }


  const upgrade =
    result.upgrade;


  if (
    hasResearchedUpgrade(
      fullId
    )
  ) {

    return;

  }


  if (
    !areResearchRequirementsMet(
      upgrade
    )
  ) {

    addLog(
      "Esta tecnología todavía está bloqueada."
    );

    return;

  }


  if (
    gameState.science <
    upgrade.scienceCost
  ) {

    addLog(

      "Necesitas "
      +
      upgrade.scienceCost
      +
      " puntos de ciencia para investigar "
      +
      upgrade.name
      +
      "."

    );

    return;

  }


  const accepted =
    confirm(

      "INVESTIGACIÓN"

      +

      "\n\n"
      +
      upgrade.name

      +

      "\nCoste: "
      +
      upgrade.scienceCost
      +
      " ciencia"

      +

      "\n\n"
      +
      upgrade.description

      +

      "\n\n¿Completar investigación?"

    );


  if (
    !accepted
  ) {

    return;

  }


  gameState.science -=
    upgrade.scienceCost;


  gameState
    .researchedUpgrades
    .push(
      fullId
    );


  gameState.selectedResearchUpgrade =
    fullId;


  addLog(

    "Tecnología investigada: "
    +
    upgrade.name
    +
    "."

  );


  updateInterface();

}



function getResearchUpgrade(
  fullUpgradeId
) {

  if (
    !fullUpgradeId
  ) {

    return null;

  }


  const parts =
    fullUpgradeId.split(
      "."
    );


  if (
    parts.length !==
    2
  ) {

    return null;

  }


  const treeId =
    parts[0];


  const upgradeId =
    parts[1];


  const tree =
    researchTrees[
      treeId
    ];


  if (!tree) {
    return null;
  }


  const upgrade =
    tree.upgrades[
      upgradeId
    ];


  if (!upgrade) {
    return null;
  }


  return {

    treeId,

    upgradeId,

    tree,

    upgrade

  };

}



function hasResearchedUpgrade(
  fullUpgradeId
) {

  return gameState
    .researchedUpgrades
    .includes(
      fullUpgradeId
    );

}



function areResearchRequirementsMet(
  upgrade
) {

  const requirements =
    upgrade.requires || [];


  return requirements.every(
    function(requirementId) {

      return hasResearchedUpgrade(
        requirementId
      );

    }
  );

}



function getResearchUpgradeName(
  fullUpgradeId
) {

  const result =
    getResearchUpgrade(
      fullUpgradeId
    );


  return result
    ?
  result.upgrade.name
    :
  fullUpgradeId;

}



function getResearchBonus(
  effectType
) {

  let total =
    0;


  gameState
    .researchedUpgrades
    .forEach(
      function(fullId) {

        const result =
          getResearchUpgrade(
            fullId
          );


        if (!result) {
          return;
        }


        const effects =
          result.upgrade.effects || [];


        effects.forEach(
          function(effect) {

            if (
              effect.type ===
              effectType
            ) {

              total +=
                Number(
                  effect.value
                )
                ||
                0;

            }

          }
        );

      }
    );


  return total;

}



function getResearchEffectName(
  effect
) {

  const names = {

    energyProductionBonus:
      "Producción de energía",

    mineralProductionBonus:
      "Producción de minerales",

    creditProductionBonus:
      "Producción de créditos",

    scienceProductionBonus:
      "Producción científica",

    explorationEnergyCostReduction:
      "Coste de exploración",

    miningEnergyCostReduction:
      "Coste de expedición minera",

    miningRewardBonus:
      "Recompensa minera",

    miningDisasterReduction:
      "Riesgo de desastre minero",

    fleetCreditCostReduction:
      "Coste de créditos de las naves",

    fleetMineralCostReduction:
      "Coste mineral de las naves",

    fleetMilitaryGainBonus:
      "Poder militar de nuevas naves",

    scientificSuccessBonus:
      "Éxito de expediciones científicas"

  };


  return (

    names[
      effect.type
    ]

    ||

    effect.type

  );

}



function getResearchEffectValue(
  effect
) {

  const percentageEffects = [

    "energyProductionBonus",

    "mineralProductionBonus",

    "creditProductionBonus",

    "scienceProductionBonus",

    "miningRewardBonus",

    "fleetCreditCostReduction",

    "fleetMineralCostReduction",

    "fleetMilitaryGainBonus"

  ];


  if (
    percentageEffects.includes(
      effect.type
    )
  ) {

    const percent =
      Math.round(
        effect.value
        *
        100
      );


    const reductions = [

      "fleetCreditCostReduction",

      "fleetMineralCostReduction"

    ];


    return reductions.includes(
      effect.type
    )
      ?
    `-${percent}%`
      :
    `+${percent}%`;

  }


  const flatReductionTypes = [

    "explorationEnergyCostReduction",

    "miningEnergyCostReduction",

    "miningDisasterReduction"

  ];


  if (
    flatReductionTypes.includes(
      effect.type
    )
  ) {

    return `-${effect.value}`;

  }


  if (
    effect.type ===
    "scientificSuccessBonus"
  ) {

    return `+${effect.value}%`;

  }


  return String(
    effect.value
  );

}



/* ==========================================================
   38. COSTE EXPLORACIÓN
   ========================================================== */

function getExplorationEnergyCost() {

  const reduction =
    getResearchBonus(
      "explorationEnergyCostReduction"
    );


  return Math.max(

    1,

    gameConfig
      .exploration
      .energyCost

    -

    reduction

  );

}



/* ==========================================================
   39. GENERAR CIENCIA
   ========================================================== */

function research() {

  const cost =
    gameConfig
      .research
      .creditCost;


  if (
    gameState.credits <
    cost
  ) {

    addLog(
      "No hay suficientes créditos para financiar la investigación."
    );

    return;

  }


  gameState.credits -=
    cost;


  const gain =
    Math.max(

      1,

      Math.round(

        gameConfig
          .research
          .baseScienceGain

        *

        gameState
          .race
          .modifiers
          .research

      )

    );


  gameState.science +=
    gain;


  addLog(

    "Financiación científica: +"
    +
    gain
    +
    " ciencia."

  );


  updateInterface();

}



/* ==========================================================
   40. FINALIZAR TURNO
   ========================================================== */

function endTurn() {

  gameState.turn++;


  const modifiers =
    gameState
      .race
      .modifiers;


  const creditBonus =
    getResearchBonus(
      "creditProductionBonus"
    );


  const mineralBonus =
    getResearchBonus(
      "mineralProductionBonus"
    );


  const energyBonus =
    getResearchBonus(
      "energyProductionBonus"
    );


  const scienceBonus =
    getResearchBonus(
      "scienceProductionBonus"
    );


  const creditsGain =
    Math.round(

      gameConfig
        .production
        .credits

      *

      modifiers
        .creditProduction

      *

      (
        1
        +
        creditBonus
      )

    );


  const mineralsGain =
    Math.round(

      gameConfig
        .production
        .minerals

      *

      modifiers
        .mineralProduction

      *

      (
        1
        +
        mineralBonus
      )

    );


  const energyGain =
    Math.round(

      gameConfig
        .production
        .energy

      *

      modifiers
        .energyProduction

      *

      (
        1
        +
        energyBonus
      )

    );


  const scienceGain =
    Math.max(

      1,

      Math.round(

        gameConfig
          .production
          .science

        *

        modifiers
          .research

        *

        (
          1
          +
          scienceBonus
        )

      )

    );


  const colonies =
    calculateColonyProduction();


  gameState.credits +=
    creditsGain;


  gameState.minerals +=
    mineralsGain
    +
    colonies.minerals;


  gameState.energy +=
    energyGain
    +
    colonies.energy;


  gameState.science +=
    scienceGain;


  addLog(

    "Nuevo ciclo: "
    +
    `+${creditsGain} créditos, `
    +
    `+${mineralsGain} minerales, `
    +
    `+${energyGain} energía y `
    +
    `+${scienceGain} ciencia.`

  );


  if (
    colonies.minerals >
    0

    ||

    colonies.energy >
    0
  ) {

    addLog(

      "Colonias: +"
      +
      colonies.minerals
      +
      " minerales y +"
      +
      colonies.energy
      +
      " energía."

    );

  }


  processExpeditions();


  updateInterface();

}



/* ==========================================================
   41. MODAL
   ========================================================== */

function showDiscoveryModal(
  planet
) {

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


  const box =
    document.getElementById(
      "modalCivilization"
    );


  if (
    box
  ) {

    if (
      planet.civilization
    ) {

      box.innerHTML = `

        <strong>

          Civilización detectada:
          ${planet.civilization.name}

        </strong>

        <br><br>

        Actitud:
        ${planet.civilization.attitude}

        <br>

        Tecnología:
        ${planet.civilization.technology}/10

        <br>

        Militar:
        ${planet.civilization.military}/10

        <br><br>

        Características especiales:
        NO INVESTIGADAS

        <br>

        Amenazas:
        NO INVESTIGADAS

      `;

    }

    else {

      box.innerHTML = `

        <strong>

          No se han detectado civilizaciones inteligentes.

        </strong>

        <br><br>

        Características especiales:
        NO INVESTIGADAS

        <br>

        Amenazas:
        NO INVESTIGADAS

      `;

    }

  }


  document
    .getElementById(
      "discoveryModal"
    )
    ?.classList
    .add(
      "active"
    );

}



function closeDiscoveryModal() {

  document
    .getElementById(
      "discoveryModal"
    )
    ?.classList
    .remove(
      "active"
    );

}



/* ==========================================================
   42. ACTUALIZAR INTERFAZ
   ========================================================== */

function updateInterface() {

  setText(
    "turn",
    gameState.turn
  );


  setText(
    "credits",
    gameState.credits
  );


  setText(
    "minerals",
    gameState.minerals
  );


  setText(
    "energy",
    gameState.energy
  );


  setText(
    "science",
    gameState.science
  );


  setText(
    "military",
    gameState.militaryPower
  );


  setText(
    "explorationEnergy",
    gameState.energy
  );


  setText(
    "explorationCost",
    getExplorationEnergyCost()
  );


  setText(
    "explorationPlanetCount",
    gameState.discoveredPlanets.length
  );


  if (
    gameState.race
  ) {

    setText(
      "currentRaceName",
      gameState.race.name
    );


    setText(
      "homeworldName",
      gameState.race.homeworld
    );


    updateCivilizationBar(

      "technologyLevel",

      "technologyBar",

      gameState.race.technology

    );


    updateCivilizationBar(

      "militaryLevel",

      "militaryBar",

      gameState.race.military

    );


    updateCivilizationBar(

      "economyLevel",

      "economyBar",

      gameState.race.economy

    );


    updateCivilizationBar(

      "defenseLevel",

      "defenseBar",

      gameState.race.defense

    );

  }


  renderExpeditions();

  renderFleetScreen();

  renderDiplomacyScreen();

  renderMarketScreen();

  renderResearchScreen();

}



/* ==========================================================
   43. BARRAS
   ========================================================== */

function updateCivilizationBar(
  textId,
  barId,
  value
) {

  const safe =
    clamp(
      value,
      0,
      10
    );


  setText(

    textId,

    safe
    +
    "/10"

  );


  const bar =
    document.getElementById(
      barId
    );


  if (
    bar
  ) {

    bar.style.width =
      safe
      *
      10
      +
      "%";

  }

}



/* ==========================================================
   44. LOG
   ========================================================== */

function addLog(
  message
) {

  const log =
    document.getElementById(
      "gameLog"
    );


  if (!log) {
    return;
  }


  const entry =
    document.createElement(
      "div"
    );


  entry.className =
    "log-entry";


  entry.textContent =
    "Turno "
    +
    gameState.turn
    +
    " — "
    +
    message;


  log.prepend(
    entry
  );

}



function clearLog() {

  const log =
    document.getElementById(
      "gameLog"
    );


  if (
    log
  ) {

    log.innerHTML =
      "";

  }

}



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



/* ==========================================================
   45. NAVEGACIÓN
   ========================================================== */

function connectNavigation() {

  const buttons =
    document.querySelectorAll(
      ".menu-button[data-screen]"
    );


  buttons.forEach(
    function(button) {

      button.addEventListener(
        "click",
        function() {

          showGameScreen(
            button.dataset.screen
          );


          setActiveMenuButton(
            button
          );

        }
      );

    }
  );


  document
    .getElementById(
      "exploreButtonSecondary"
    )
    ?.addEventListener(
      "click",
      explore
    );

}



function showGameScreen(
  screenId
) {

  document
    .querySelectorAll(
      ".game-section"
    )
    .forEach(
      function(screen) {

        screen.classList.add(
          "hidden"
        );

      }
    );


  const selected =
    document.getElementById(
      screenId
    );


  if (!selected) {
    return;
  }


  selected.classList.remove(
    "hidden"
  );


  if (
    screenId ===
    "fleetScreen"
  ) {

    renderFleetScreen();

  }


  if (
    screenId ===
    "diplomacyScreen"
  ) {

    renderDiplomacyScreen();

  }


  if (
    screenId ===
    "marketScreen"
  ) {

    renderMarketScreen();

  }


  if (
    screenId ===
    "researchScreen"
  ) {

    renderResearchScreen();

  }

}



function setActiveMenuButton(
  selectedButton
) {

  document
    .querySelectorAll(
      ".menu-button"
    )
    .forEach(
      function(button) {

        button.classList.remove(
          "active"
        );

      }
    );


  selectedButton.classList.add(
    "active"
  );

}



/* ==========================================================
   46. HELPERS
   ========================================================== */

function findPlanet(
  planetId
) {

  return gameState
    .discoveredPlanets
    .find(
      function(planet) {

        return (

          String(
            planet.id
          )

          ===

          String(
            planetId
          )

        );

      }
    );

}



function createSummaryCard(
  label,
  value
) {

  return `

    <div class="exploration-summary-card">

      <span class="exploration-summary-label">

        ${label}

      </span>

      <strong class="exploration-summary-value">

        ${value}

      </strong>

    </div>

  `;

}



function randomItem(
  array
) {

  return array[
    Math.floor(
      Math.random()
      *
      array.length
    )
  ];

}



function randomNumber(
  min,
  max
) {

  return Math.floor(

    Math.random()

    *

    (
      max
      -
      min
      +
      1
    )

  )

  +

  min;

}



function clamp(
  value,
  min,
  max
) {

  return Math.min(

    Math.max(
      value,
      min
    ),

    max

  );

}



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
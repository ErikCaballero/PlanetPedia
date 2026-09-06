/* ==========================================================
   ==========================================================
   PROJECT NEXUS
   ARCHIVO PRINCIPAL DE JAVASCRIPT
   ==========================================================
   ========================================================== */


/* ==========================================================
   1. DATOS DE LAS RAZAS
   ==========================================================

   AQUÍ ES DONDE AÑADES, QUITAS O MODIFICAS RAZAS.

   Cada raza tiene:

   - name:
     Nombre visible.

   - homeworld:
     Planeta natal.

   - image:
     Ruta de la imagen.

   - playstyle:
     Texto corto que indica su estilo.

   - technology:
     Nivel tecnológico de 0 a 10.

   - military:
     Nivel militar de 0 a 10.

   - economy:
     Nivel económico de 0 a 10.

   - defense:
     Nivel defensivo de 0 a 10.

   - startingResources:
     Recursos con los que empieza la partida.

   - modifiers:
     Multiplicadores especiales de esa raza.

   IMPORTANTE:

   1 = valor normal.
   1.20 = +20%
   0.80 = -20%
*/


const races = {


  /* ========================================================
     FOXERS
  ======================================================== */

  foxers: {

    name: "Foxers",

    homeworld: "Aetheria",

    image:
      "assets/races/foxers.png",

    playstyle:
      "Tecnología e ingeniería",

    description:
      "Civilización altamente tecnológica especializada en ingeniería, robótica y sistemas defensivos.",


    /* NIVELES GENERALES */

    technology: 9,

    military: 4,

    economy: 7,

    defense: 9,


    /* RECURSOS INICIALES */

    startingResources: {

      credits: 550,

      minerals: 220,

      energy: 200,

      science: 50,

      militaryPower: 8

    },


    /* MODIFICADORES */

    modifiers: {

      research: 1.30,

      creditProduction: 1.05,

      mineralProduction: 1.00,

      energyProduction: 1.10,

      militaryPowerGain: 0.90

    }

  },



  /* ========================================================
     ARACNOSEPHUS
  ======================================================== */

  aracnosephus: {

    name: "AracnoSephus",

    homeworld: "Webitia",

    image:
      "assets/races/aracnosephus.png",

    playstyle:
      "Expansión y guerra",

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



  /* ========================================================
     STERONS
  ======================================================== */

  sterons: {

    name: "Sterons",

    homeworld: "Gradius 4",

    image:
      "assets/races/sterons.png",

    playstyle:
      "Conquista militar",

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



  /* ========================================================
     VARYTHS
  ======================================================== */

  varyths: {

    name: "Varyths",

    homeworld: "Sabaya",

    image:
      "assets/races/varyths.png",

    playstyle:
      "Combate y guerra",

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



  /* ========================================================
     XEL'THORIANOS
  ======================================================== */

  xelthorianos: {

    name: "Xel'thorianos",

    homeworld: "Sapphire Dom",

    image:
      "assets/races/xelthorianos.png",

    playstyle:
      "Energía y ciencia",

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



  /* ========================================================
     ZORNICOS
  ======================================================== */

  zornicos: {

    name: "Zornicos",

    homeworld: "Zorn 1",

    image:
      "assets/races/zornicos.png",

    playstyle:
      "Equilibrado",

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
   2. ESTADO ACTUAL DE LA PARTIDA
   ==========================================================

   Aquí se guarda TODO lo que está ocurriendo
   durante la partida actual.
*/


const gameState = {

  turn: 1,


  /* RAZA ELEGIDA */

  raceId: null,

  race: null,


  /* RECURSOS */

  credits: 0,

  minerals: 0,

  energy: 0,

  science: 0,

  militaryPower: 0,


  /* FLOTA */

  fleet: 1,


  /* PLANETAS ENCONTRADOS */

  discoveredPlanets: []

};



/* ==========================================================
   3. CONFIGURACIÓN GENERAL DEL JUEGO
   ==========================================================

   AQUÍ PUEDES CAMBIAR COSTES Y PRODUCCIÓN SIN
   BUSCAR POR TODO EL ARCHIVO.
*/


const gameConfig = {


  /* ========================================================
     EXPLORACIÓN
  ======================================================== */

  exploration: {

    energyCost: 10

  },


  /* ========================================================
     INVESTIGACIÓN
  ======================================================== */

  research: {

    creditCost: 50,

    baseScienceGain: 5

  },


  /* ========================================================
     FLOTA
  ======================================================== */

  fleet: {

    creditCost: 100,

    mineralCost: 30,

    baseMilitaryGain: 2

  },


  /* ========================================================
     PRODUCCIÓN POR TURNO
  ======================================================== */

  production: {

    credits: 40,

    minerals: 15,

    energy: 20,

    science: 2

  }

};



/* ==========================================================
   4. DATOS DE EXPLORACIÓN
   ==========================================================

   AQUÍ PUEDES CAMBIAR:

   - nombres de planetas
   - tipos de planetas
   - peligros
   - descripciones
*/


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



/* ==========================================================
   TIPOS DE PLANETAS
   ========================================================== */


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
      "Un mundo árido dominado por grandes desiertos y temperaturas extremas."

  },


  {

    name:
      "Mundo volcánico",

    dangerModifier:
      2,

    description:
      "Su superficie presenta intensa actividad volcánica y enormes reservas minerales."

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
      "Su atmósfera contiene sustancias extremadamente peligrosas para la vida conocida."

  },


  {

    name:
      "Gigante gaseoso",

    dangerModifier:
      2,

    description:
      "Un enorme planeta gaseoso rodeado de lunas y tormentas atmosféricas."

  }

];



/* ==========================================================
   5. INICIAR EL JUEGO
   ==========================================================

   Esta función se ejecuta automáticamente
   cuando el HTML termina de cargar.
*/


document.addEventListener(
  "DOMContentLoaded",
  initializeGame
);



function initializeGame() {


  /* GENERAR TARJETAS DE RAZAS */

  renderRaceSelection();


  /* ========================================================
     CONECTAR BOTONES
  ======================================================== */

  connectButtons();


  console.log(
    "Project Nexus iniciado correctamente."
  );

}



/* ==========================================================
   6. CONECTAR BOTONES DEL HTML
   ==========================================================

   Si algún botón no funciona,
   ESTE ES UNO DE LOS PRIMEROS SITIOS QUE DEBES MIRAR.
*/


function connectButtons() {


  /* EXPLORAR */

  document
    .getElementById(
      "exploreButton"
    )
    ?.addEventListener(
      "click",
      explore
    );



  /* INVESTIGAR */

  document
    .getElementById(
      "researchButton"
    )
    ?.addEventListener(
      "click",
      research
    );



  /* CONSTRUIR FLOTA */

  document
    .getElementById(
      "fleetButton"
    )
    ?.addEventListener(
      "click",
      buildFleet
    );



  /* FINALIZAR TURNO */

  document
    .getElementById(
      "endTurnButton"
    )
    ?.addEventListener(
      "click",
      endTurn
    );



  /* CERRAR MODAL */

  document
    .getElementById(
      "closeDiscoveryModalButton"
    )
    ?.addEventListener(
      "click",
      closeDiscoveryModal
    );



  /* ========================================================
     TAMBIÉN CERRAMOS EL MODAL SI SE PULSA FUERA
  ======================================================== */

  const discoveryModal =
    document.getElementById(
      "discoveryModal"
    );


  discoveryModal
    ?.addEventListener(
      "click",
      function(event) {

        if (
          event.target ===
          discoveryModal
        ) {

          closeDiscoveryModal();

        }

      }
    );

}



/* ==========================================================
   7. CREAR TARJETAS DE SELECCIÓN DE RAZAS
   ========================================================== */


function renderRaceSelection() {


  const raceGrid =
    document.getElementById(
      "raceGrid"
    );


  if (!raceGrid) {

    console.error(
      "No existe el elemento #raceGrid"
    );

    return;

  }


  raceGrid.innerHTML =
    "";


  /* ========================================================
     RECORREMOS TODAS LAS RAZAS
  ======================================================== */

  Object.entries(
    races
  )
  .forEach(

    function([
      raceId,
      race
    ]) {


      /* CREAR TARJETA */

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "race-card";


      /* ====================================================
         CONTENIDO DE LA TARJETA
      ==================================================== */

      card.innerHTML = `


        <div class="race-image">


          <div
            class="race-image-fallback"
          >
            ${race.name}
          </div>


          <img
            src="${race.image}"
            alt="${race.name}"
          >


        </div>



        <div class="race-content">


          <span
            class="race-playstyle"
          >
            ${race.playstyle}
          </span>



          <h2>
            ${race.name}
          </h2>



          <div
            class="race-homeworld"
          >

            Planeta natal:

            <strong>
              ${race.homeworld}
            </strong>

          </div>



          <p
            class="race-description"
          >
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



      /* ====================================================
         SI LA IMAGEN NO EXISTE
      ==================================================== */

      const image =
        card.querySelector(
          "img"
        );


      const fallback =
        card.querySelector(
          ".race-image-fallback"
        );


      image.addEventListener(

        "load",

        function() {

          fallback.style.display =
            "none";

        }

      );


      image.addEventListener(

        "error",

        function() {

          image.style.display =
            "none";

          fallback.style.display =
            "flex";

        }

      );



      /* ====================================================
         BOTÓN PARA ELEGIR RAZA
      ==================================================== */

      const button =
        card.querySelector(
          ".select-race-button"
        );


      button.addEventListener(

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



/* ==========================================================
   8. CREAR UNA BARRA DE ESTADÍSTICA DE RAZA
   ========================================================== */


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


      <div
        class="race-rating-background"
      >

        <div
          class="race-rating-fill"
          style="
            width:
            ${safeValue * 10}%;
          "
        >
        </div>

      </div>


    </div>

  `;

}



/* ==========================================================
   9. EMPEZAR PARTIDA CON UNA RAZA
   ========================================================== */


function startGame(
  raceId
) {


  const race =
    races[
      raceId
    ];


  if (!race) {

    console.error(
      "La raza no existe:",
      raceId
    );

    return;

  }



  /* ========================================================
     GUARDAR RAZA
  ======================================================== */

  gameState.raceId =
    raceId;


  gameState.race =
    race;



  /* ========================================================
     REINICIAR TURNO
  ======================================================== */

  gameState.turn =
    1;



  /* ========================================================
     CARGAR RECURSOS INICIALES
  ======================================================== */

  gameState.credits =
    race
      .startingResources
      .credits;


  gameState.minerals =
    race
      .startingResources
      .minerals;


  gameState.energy =
    race
      .startingResources
      .energy;


  gameState.science =
    race
      .startingResources
      .science;


  gameState.militaryPower =
    race
      .startingResources
      .militaryPower;



  /* ========================================================
     REINICIAR FLOTA
  ======================================================== */

  gameState.fleet =
    1;



  /* ========================================================
     BORRAR PLANETAS DE UNA PARTIDA ANTERIOR
  ======================================================== */

  gameState.discoveredPlanets =
    [];



  /* ========================================================
     CAMBIAR DE PANTALLA
  ======================================================== */

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



  /* ========================================================
     ACTUALIZAR PLANETAS DESCUBIERTOS
  ======================================================== */

  renderPlanets();



  /* ========================================================
     BORRAR REGISTRO ANTERIOR
  ======================================================== */

  clearLog();



  /* ========================================================
     MENSAJE DE INICIO
  ======================================================== */

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



  /* ========================================================
     ACTUALIZAR TODA LA INTERFAZ
  ======================================================== */

  updateInterface();

}



/* ==========================================================
   10. EXPLORACIÓN
   ==========================================================

   AQUÍ CAMBIAS EL FUNCIONAMIENTO GENERAL DE EXPLORAR.
*/


function explore() {


  const cost =
    gameConfig
      .exploration
      .energyCost;



  /* ========================================================
     COMPROBAR ENERGÍA
  ======================================================== */

  if (
    gameState.energy <
    cost
  ) {

    addLog(
      "No hay suficiente energía para lanzar una expedición."
    );

    return;

  }



  /* PAGAR COSTE */

  gameState.energy -=
    cost;



  /* ========================================================
     CREAR PLANETA
  ======================================================== */

  const planet =
    generatePlanet();



  /* GUARDAR PLANETA */

  gameState
    .discoveredPlanets
    .push(
      planet
    );



  /* MENSAJE */

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



  /* ========================================================
     SI HAY CIVILIZACIÓN
  ======================================================== */

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
   11. GENERAR PLANETA
   ==========================================================

   Esta función crea un planeta aleatorio.
*/


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



  /* ========================================================
     PELIGRO
  ======================================================== */

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



  /* ========================================================
     PLANETA FINAL
  ======================================================== */

  return {

    id:
      Date.now()
      +
      Math.random(),


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
      generateCivilization()

  };

}



/* ==========================================================
   12. GENERAR CIVILIZACIÓN EN PLANETA
   ==========================================================

   AQUÍ CAMBIAS LAS PROBABILIDADES DE ENCONTRAR
   CIVILIZACIONES.
*/


function generateCivilization() {


  const roll =
    Math.random();



  /* ========================================================
     PROBABILIDADES ACTUALES

     45% sin civilización
     20% pacífica
     20% neutral
     15% hostil
  ======================================================== */


  if (
    roll <
    0.45
  ) {

    return null;

  }



  /* ========================================================
     ELEGIR ACTITUD
  ======================================================== */

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



  /* ========================================================
     RAZAS DISPONIBLES
  ======================================================== */


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



  /* ========================================================
     ELEGIR RAZA ALEATORIA
  ======================================================== */

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
   13. MOSTRAR PLANETAS DESCUBIERTOS
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



  /* ========================================================
     SI NO HAY PLANETAS
  ======================================================== */

  if (
    gameState
      .discoveredPlanets
      .length ===
    0
  ) {


    grid.innerHTML = `

      <div
        class="empty-message"
      >

        Ningún planeta descubierto todavía.

        Envía una expedición para comenzar
        la exploración.

      </div>

    `;

  }



  /* ========================================================
     CREAR TARJETAS
  ======================================================== */


  gameState
    .discoveredPlanets
    .forEach(

      function(
        planet
      ) {


        const card =

          document.createElement(
            "div"
          );


        card.className =
          "planet-card";



        /* ==================================================
           CIVILIZACIÓN
        ================================================== */

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
                class="
                  attitude
                  none
                "
              >

                No detectada

              </span>

            </div>

          `;

        }



        /* ==================================================
           TARJETA COMPLETA
        ================================================== */


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



  /* ========================================================
     CONTADOR
  ======================================================== */

  setText(

    "planetCount",

    gameState
      .discoveredPlanets
      .length

    +

    " detectados"

  );

}



/* ==========================================================
   14. INVESTIGACIÓN
   ==========================================================

   AQUÍ MODIFICAS EL SISTEMA DE CIENCIA.
*/


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



  /* ========================================================
     CIENCIA BASE
  ======================================================== */

  const baseGain =
    gameConfig
      .research
      .baseScienceGain;



  /* ========================================================
     APLICAR MODIFICADOR DE RAZA
  ======================================================== */

  const modifier =

    gameState
      .race
      .modifiers
      .research;



  const scienceGain =

    Math.max(

      1,

      Math.round(
        baseGain *
        modifier
      )

    );



  gameState.science +=
    scienceGain;



  addLog(

    "El programa científico recibe financiación. +"

    +

    scienceGain

    +

    " ciencia."

  );



  updateInterface();

}



/* ==========================================================
   15. CONSTRUIR FLOTA
   ==========================================================

   AQUÍ CAMBIAS COSTE DE NAVES Y PODER MILITAR.
*/


function buildFleet() {


  const creditCost =
    gameConfig
      .fleet
      .creditCost;


  const mineralCost =
    gameConfig
      .fleet
      .mineralCost;



  if (

    gameState.credits <
    creditCost

    ||

    gameState.minerals <
    mineralCost

  ) {


    addLog(
      "No hay suficientes recursos para construir una nave."
    );


    return;

  }



  /* PAGAR */

  gameState.credits -=
    creditCost;


  gameState.minerals -=
    mineralCost;



  /* AUMENTAR FLOTA */

  gameState.fleet++;



  /* ========================================================
     PODER MILITAR
  ======================================================== */

  const baseMilitaryGain =

    gameConfig
      .fleet
      .baseMilitaryGain;



  const modifier =

    gameState
      .race
      .modifiers
      .militaryPowerGain;



  const militaryGain =

    Math.max(

      1,

      Math.round(
        baseMilitaryGain *
        modifier
      )

    );



  gameState.militaryPower +=
    militaryGain;



  addLog(

    "Una nueva nave entra en servicio. "

    +

    "Flota total: "

    +

    gameState.fleet

    +

    ". Poder militar +"

    +

    militaryGain

    +

    "."

  );



  updateInterface();

}



/* ==========================================================
   16. FINALIZAR TURNO
   ==========================================================

   AQUÍ SE GENERAN LOS RECURSOS DE CADA TURNO.
*/


function endTurn() {


  /* AUMENTAR TURNO */

  gameState.turn++;



  /* ========================================================
     PRODUCCIÓN BASE
  ======================================================== */


  const baseCredits =
    gameConfig
      .production
      .credits;


  const baseMinerals =
    gameConfig
      .production
      .minerals;


  const baseEnergy =
    gameConfig
      .production
      .energy;


  const baseScience =
    gameConfig
      .production
      .science;



  /* ========================================================
     MODIFICADORES DE LA RAZA
  ======================================================== */


  const modifiers =
    gameState
      .race
      .modifiers;



  const creditsGain =

    Math.round(

      baseCredits

      *

      modifiers
        .creditProduction

    );



  const mineralsGain =

    Math.round(

      baseMinerals

      *

      modifiers
        .mineralProduction

    );



  const energyGain =

    Math.round(

      baseEnergy

      *

      modifiers
        .energyProduction

    );



  const scienceGain =

    Math.max(

      1,

      Math.round(

        baseScience

        *

        modifiers
          .research

      )

    );



  /* ========================================================
     SUMAR RECURSOS
  ======================================================== */


  gameState.credits +=
    creditsGain;


  gameState.minerals +=
    mineralsGain;


  gameState.energy +=
    energyGain;


  gameState.science +=
    scienceGain;



  addLog(

    "Comienza un nuevo ciclo. "

    +

    `+${creditsGain} créditos, `

    +

    `+${mineralsGain} minerales, `

    +

    `+${energyGain} energía y `

    +

    `+${scienceGain} ciencia.`

  );



  updateInterface();



  /* ========================================================
     AQUÍ MÁS ADELANTE LLAMAREMOS A events.js

     Ejemplo futuro:

     triggerRandomEvent();

     Pero TODAVÍA NO LO AÑADIMOS.
  ======================================================== */

}



/* ==========================================================
   17. MOSTRAR MODAL DE PLANETA
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



  const civilizationBox =

    document.getElementById(
      "modalCivilization"
    );



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


      Tecnología:
      ${planet.civilization.technology}/10


      <br>


      Capacidad militar:
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



  document
    .getElementById(
      "discoveryModal"
    )
    ?.classList
    .add(
      "active"
    );

}



/* ==========================================================
   18. CERRAR MODAL
   ========================================================== */


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
   19. ACTUALIZAR INTERFAZ
   ==========================================================

   ESTA FUNCIÓN ACTUALIZA LOS NÚMEROS Y TEXTOS DEL HTML.
*/


function updateInterface() {


  /* TURNO */

  setText(
    "turn",
    gameState.turn
  );



  /* RECURSOS */

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



  /* ========================================================
     DATOS DE RAZA
  ======================================================== */


  if (
    gameState.race
  ) {


    setText(

      "currentRaceName",

      gameState
        .race
        .name

    );


    setText(

      "homeworldName",

      gameState
        .race
        .homeworld

    );



    /* ======================================================
       BARRAS
    ====================================================== */


    updateCivilizationBar(

      "technologyLevel",

      "technologyBar",

      gameState
        .race
        .technology

    );


    updateCivilizationBar(

      "militaryLevel",

      "militaryBar",

      gameState
        .race
        .military

    );


    updateCivilizationBar(

      "economyLevel",

      "economyBar",

      gameState
        .race
        .economy

    );


    updateCivilizationBar(

      "defenseLevel",

      "defenseBar",

      gameState
        .race
        .defense

    );

  }

}



/* ==========================================================
   20. ACTUALIZAR BARRA DE CIVILIZACIÓN
   ========================================================== */


function updateCivilizationBar(
  textId,
  barId,
  value
) {


  const safeValue =
    clamp(
      value,
      0,
      10
    );


  setText(

    textId,

    safeValue
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

      safeValue
      *
      10

      +

      "%";

  }

}



/* ==========================================================
   21. REGISTRO GALÁCTICO
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



/* ==========================================================
   22. LIMPIAR REGISTRO
   ========================================================== */


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



/* ==========================================================
   23. CLASE DE ACTITUD
   ========================================================== */


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
   24. FUNCIONES AUXILIARES
   ========================================================== */


/* ==========================================================
   ELEGIR ELEMENTO ALEATORIO
   ========================================================== */


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



/* ==========================================================
   NÚMERO ALEATORIO ENTRE MIN Y MAX
   ========================================================== */


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



/* ==========================================================
   LIMITAR NÚMERO ENTRE MÍNIMO Y MÁXIMO
   ========================================================== */


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



/* ==========================================================
   CAMBIAR TEXTO DE UN ELEMENTO
   ========================================================== */


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
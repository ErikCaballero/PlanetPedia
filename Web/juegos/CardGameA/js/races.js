let races = {};


/* =========================
   CARGAR RAZAS
========================= */

export async function loadRaces() {
  const response =
    await fetch("../data/races.json");

  if (!response.ok) {
    throw new Error(
      "No se pudo cargar races.json"
    );
  }

  races =
    await response.json();
    console.log("Razas cargadas:", races);
  return races;
}


/* =========================
   OBTENER UNA RAZA
========================= */

export function getRace(raceId) {
  return races[raceId];
}


/* =========================
   OBTENER TODAS LAS RAZAS
========================= */

export function getAllRaces() {
  return Object.values(races);
}


/* =========================
   CREAR TARJETAS DE RAZA
========================= */

export function renderRaceSelection(
  onSelectRace
) {
  const raceGrid =
    document.getElementById(
      "raceGrid"
    );

  if (!raceGrid) {
    console.error(
      "No existe #raceGrid"
    );

    return;
  }

  raceGrid.innerHTML = "";


  const allRaces =
    getAllRaces();


  allRaces.forEach(
    race => {

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "race-card";


      /* =========================
         ESPECIALIZACIONES
      ========================= */

      const specializations =
        race.specializations
          .slice(0, 3)
          .map(
            specialization => `
              <span
                class="race-specialization"
              >
                ${specialization}
              </span>
            `
          )
          .join("");


      /* =========================
         VALORES VISUALES
      ========================= */

      const ratings =
        race.ratings || {
          technology: 5,
          military: 5,
          economy: 5,
          defense: 5
        };


      card.innerHTML = `
        <div class="race-image">

          <img
            src="${race.image}"
            alt="${race.name}"
            loading="lazy"
          >

          <div
            class="race-image-fallback"
          >
            ${race.name}
          </div>

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


          <div
            class="race-specializations"
          >
            ${specializations}
          </div>


          <div
            class="race-ratings"
          >

            ${createRatingBar(
              "Tecnología",
              ratings.technology
            )}

            ${createRatingBar(
              "Militar",
              ratings.military
            )}

            ${createRatingBar(
              "Economía",
              ratings.economy
            )}

            ${createRatingBar(
              "Defensa",
              ratings.defense
            )}

          </div>


          <button
            class="select-race-button"
            type="button"
          >
            Seleccionar ${race.name}
          </button>

        </div>
      `;


      /* =========================
         IMAGEN DE RESPALDO
      ========================= */

      const image =
        card.querySelector(
          ".race-image img"
        );

      const fallback =
        card.querySelector(
          ".race-image-fallback"
        );


      if (image) {

        image.addEventListener(
          "load",
          () => {

            fallback.style.display =
              "none";

          }
        );


        image.addEventListener(
          "error",
          () => {

            image.style.display =
              "none";

            fallback.style.display =
              "flex";

          }
        );

      }


      /* =========================
         SELECCIONAR RAZA
      ========================= */

      const button =
        card.querySelector(
          ".select-race-button"
        );


      button.addEventListener(
        "click",
        () => {

          onSelectRace(
            race.id
          );

        }
      );


      raceGrid.appendChild(
        card
      );

    }
  );
}


/* =========================
   CREAR BARRA DE VALOR
========================= */

function createRatingBar(
  label,
  value
) {
  const safeValue =
    Math.min(
      Math.max(value, 0),
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
const GAME_TIME = 60;

const TOTAL_ROUNDS = 5;


// =========================================
// ELEMENTOS HTML
// =========================================

const startScreen =
  document.getElementById(
    "startScreen"
  );


const gameScreen =
  document.getElementById(
    "gameScreen"
  );


const endScreen =
  document.getElementById(
    "endScreen"
  );


const startButton =
  document.getElementById(
    "startButton"
  );


const restartButton =
  document.getElementById(
    "restartButton"
  );


const homeButton =
  document.getElementById(
    "homeButton"
  );


const questionElement =
  document.getElementById(
    "question"
  );


const speciesGrid =
  document.getElementById(
    "speciesGrid"
  );


const timerElement =
  document.getElementById(
    "timer"
  );


const scoreElement =
  document.getElementById(
    "score"
  );


const roundNumberElement =
  document.getElementById(
    "roundNumber"
  );


const confirmButton =
  document.getElementById(
    "confirmButton"
  );


const nextButton =
  document.getElementById(
    "nextButton"
  );


const resultPanel =
  document.getElementById(
    "resultPanel"
  );


const resultTitle =
  document.getElementById(
    "resultTitle"
  );


const resultText =
  document.getElementById(
    "resultText"
  );


const correctCountElement =
  document.getElementById(
    "correctCount"
  );


const wrongCountElement =
  document.getElementById(
    "wrongCount"
  );


const missedCountElement =
  document.getElementById(
    "missedCount"
  );


const accuracyElement =
  document.getElementById(
    "accuracy"
  );


const finalScoreElement =
  document.getElementById(
    "finalScore"
  );



// =========================================
// VARIABLES DEL JUEGO
// =========================================

let species = [];

let categories = [];

let currentCategory = null;

let selectedSpecies =
  new Set();

let usedCategoryIds =
  new Set();

let timeLeft =
  GAME_TIME;

let timerInterval =
  null;

let totalScore =
  0;

let currentRound =
  1;

let roundFinished =
  false;



// =========================================
// CARGAR DATOS
// =========================================

function loadGameData() {

  if (
    !window.SPECIES_DATA
  ) {

    alert(
      "No se ha podido cargar species.js."
    );

    return false;

  }


  if (
    !window.CATEGORIES_DATA
  ) {

    alert(
      "No se ha podido cargar categories.js."
    );

    return false;

  }


  species =
    Array.isArray(
      window.SPECIES_DATA.species
    )
      ? window.SPECIES_DATA.species
      : [];


  categories =
    Array.isArray(
      window.CATEGORIES_DATA.categories
    )
      ? window.CATEGORIES_DATA.categories.filter(
          category =>
            category.enabled !== false
        )
      : [];


  if (
    species.length === 0
  ) {

    alert(
      "No hay especies configuradas."
    );

    return false;

  }


  if (
    categories.length === 0
  ) {

    alert(
      "No hay categorías configuradas."
    );

    return false;

  }


  return true;

}



// =========================================
// SUBIR ARRIBA
// =========================================

function scrollToTop() {

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });

}



// =========================================
// INICIAR PARTIDA
// =========================================

function startGame() {

  const loaded =
    loadGameData();


  if (!loaded) {
    return;
  }


  clearInterval(
    timerInterval
  );


  totalScore =
    0;


  currentRound =
    1;


  currentCategory =
    null;


  usedCategoryIds.clear();


  selectedSpecies.clear();


  scoreElement.textContent =
    "0";


  roundNumberElement.textContent =
    currentRound;


  startScreen.classList.add(
    "hidden"
  );


  endScreen.classList.add(
    "hidden"
  );


  gameScreen.classList.remove(
    "hidden"
  );


  scrollToTop();


  startRound();

}



// =========================================
// EMPEZAR RONDA
// =========================================

function startRound() {

  clearInterval(
    timerInterval
  );


  roundFinished =
    false;


  selectedSpecies.clear();


  timeLeft =
    GAME_TIME;


  timerElement.textContent =
    timeLeft;


  roundNumberElement.textContent =
    currentRound;


  resultPanel.classList.add(
    "hidden"
  );


  confirmButton.classList.remove(
    "hidden"
  );


  confirmButton.disabled =
    false;


  nextButton.classList.add(
    "hidden"
  );


  currentCategory =
    getRoundCategory();


  if (!currentCategory) {

    questionElement.textContent =
      "No hay categorías disponibles.";

    confirmButton.disabled =
      true;

    return;

  }


  questionElement.textContent =
    currentCategory.question;


  renderSpecies();


  startTimer();

}



// =========================================
// ELEGIR CATEGORÍA
// =========================================

function getRoundCategory() {

  let availableCategories =
    categories.filter(
      category =>
        !usedCategoryIds.has(
          category.id
        )
    );


  /*
    Si ya se han usado todas las categorías,
    volvemos a permitirlas.
  */

  if (
    availableCategories.length === 0
  ) {

    usedCategoryIds.clear();


    availableCategories =
      [...categories];

  }


  const randomIndex =
    Math.floor(
      Math.random() *
      availableCategories.length
    );


  const category =
    availableCategories[
      randomIndex
    ];


  usedCategoryIds.add(
    category.id
  );


  return category;

}



// =========================================
// MOSTRAR ESPECIES
// =========================================

function renderSpecies() {

  speciesGrid.innerHTML =
    "";


  const shuffledSpecies =
    shuffle(
      [...species]
    );


  shuffledSpecies.forEach(
    speciesItem => {

      const card =
        document.createElement(
          "button"
        );


      card.type =
        "button";


      card.classList.add(
        "species-card"
      );


      card.dataset.id =
        speciesItem.id;



      const image =
        document.createElement(
          "img"
        );


      image.src =
        speciesItem.image;


      image.alt =
        speciesItem.name;


      image.loading =
        "lazy";


      image.addEventListener(
        "error",
        () => {

          image.style.display =
            "none";

        }
      );



      const name =
        document.createElement(
          "span"
        );


      name.classList.add(
        "species-name"
      );


      name.textContent =
        speciesItem.name;



      const status =
        document.createElement(
          "span"
        );


      status.classList.add(
        "status",
        "hidden"
      );


      status.setAttribute(
        "aria-hidden",
        "true"
      );



      card.appendChild(
        image
      );


      card.appendChild(
        name
      );


      card.appendChild(
        status
      );



      card.addEventListener(
        "click",
        () => {

          toggleSpecies(
            speciesItem.id,
            card
          );

        }
      );


      speciesGrid.appendChild(
        card
      );

    }
  );

}



// =========================================
// SELECCIONAR / DESELECCIONAR
// =========================================

function toggleSpecies(
  speciesId,
  card
) {

  if (
    roundFinished
  ) {

    return;

  }


  if (
    selectedSpecies.has(
      speciesId
    )
  ) {

    selectedSpecies.delete(
      speciesId
    );


    card.classList.remove(
      "selected"
    );

  }

  else {

    selectedSpecies.add(
      speciesId
    );


    card.classList.add(
      "selected"
    );

  }

}



// =========================================
// TEMPORIZADOR
// =========================================

function startTimer() {

  clearInterval(
    timerInterval
  );


  timerInterval =
    setInterval(
      () => {

        timeLeft--;


        if (
          timeLeft < 0
        ) {

          timeLeft =
            0;

        }


        timerElement.textContent =
          timeLeft;


        if (
          timeLeft <= 0
        ) {

          finishRound();

        }

      },
      1000
    );

}



// =========================================
// FINALIZAR RONDA
// =========================================

function finishRound() {

  if (
    roundFinished
  ) {

    return;

  }


  roundFinished =
    true;


  clearInterval(
    timerInterval
  );


  const correctIds =
    new Set(

      species

        .filter(
          speciesItem => {

            if (
              !Array.isArray(
                speciesItem.tags
              )
            ) {

              return false;

            }


            return speciesItem.tags.includes(
              currentCategory.id
            );

          }
        )

        .map(
          speciesItem =>
            speciesItem.id
        )

    );


  let correct =
    0;


  let wrong =
    0;


  let missed =
    0;


  const cards =
    document.querySelectorAll(
      ".species-card"
    );


  cards.forEach(
    card => {

      const id =
        card.dataset.id;


      const selected =
        selectedSpecies.has(
          id
        );


      const isCorrect =
        correctIds.has(
          id
        );


      const status =
        card.querySelector(
          ".status"
        );


      card.disabled =
        true;


      card.classList.remove(
        "selected"
      );


      if (
        selected &&
        isCorrect
      ) {

        correct++;


        card.classList.add(
          "correct"
        );


        status.textContent =
          "✓";


        status.classList.remove(
          "hidden"
        );

      }


      else if (
        selected &&
        !isCorrect
      ) {

        wrong++;


        card.classList.add(
          "wrong"
        );


        status.textContent =
          "✕";


        status.classList.remove(
          "hidden"
        );

      }


      else if (
        !selected &&
        isCorrect
      ) {

        missed++;


        card.classList.add(
          "missed"
        );


        status.textContent =
          "!";


        status.classList.remove(
          "hidden"
        );

      }

    }
  );


  calculateResults(
    correct,
    wrong,
    missed
  );

}



// =========================================
// CALCULAR RESULTADO
// =========================================

function calculateResults(
  correct,
  wrong,
  missed
) {

  const totalRelevant =
    correct +
    wrong +
    missed;


  let accuracy =
    100;


  if (
    totalRelevant > 0
  ) {

    accuracy =
      Math.round(
        (
          correct /
          totalRelevant
        ) *
        100
      );

  }


  const perfect =
    wrong === 0 &&
    missed === 0;


  let roundScore =
    0;



  // +100 por acierto

  roundScore +=
    correct * 100;



  // -50 por selección incorrecta

  roundScore -=
    wrong * 50;



  // -25 por respuesta olvidada

  roundScore -=
    missed * 25;



  // Bonus por ronda perfecta

  if (
    perfect
  ) {

    roundScore +=
      500;


    roundScore +=
      timeLeft * 10;

  }



  roundScore =
    Math.max(
      0,
      roundScore
    );


  totalScore +=
    roundScore;


  scoreElement.textContent =
    totalScore;


  correctCountElement.textContent =
    correct;


  wrongCountElement.textContent =
    wrong;


  missedCountElement.textContent =
    missed;


  accuracyElement.textContent =
    accuracy + "%";


  if (
    perfect
  ) {

    resultTitle.textContent =
      "¡Ronda perfecta!";

  }

  else {

    resultTitle.textContent =
      "Ronda completada";

  }


  resultText.textContent =
    `Has conseguido ${roundScore} puntos en esta ronda.`;


  resultPanel.classList.remove(
    "hidden"
  );


  confirmButton.classList.add(
    "hidden"
  );


  nextButton.classList.remove(
    "hidden"
  );


  if (
    currentRound >=
    TOTAL_ROUNDS
  ) {

    nextButton.textContent =
      "Ver resultado final";

  }

  else {

    nextButton.textContent =
      "Siguiente ronda";

  }

}



// =========================================
// SIGUIENTE RONDA
// =========================================

function nextRound() {

  if (
    currentRound >=
    TOTAL_ROUNDS
  ) {

    finishGame();

    return;

  }


  currentRound++;


  scrollToTop();


  startRound();

}



// =========================================
// FINALIZAR PARTIDA
// =========================================

function finishGame() {

  clearInterval(
    timerInterval
  );


  gameScreen.classList.add(
    "hidden"
  );


  endScreen.classList.remove(
    "hidden"
  );


  finalScoreElement.textContent =
    totalScore;


  scrollToTop();

}



// =========================================
// VOLVER AL INICIO
// =========================================

function returnHome() {

  window.location.reload();

}



// =========================================
// BARAJAR ARRAY
// =========================================

function shuffle(
  array
) {

  for (
    let i =
      array.length - 1;

    i > 0;

    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (
          i + 1
        )
      );


    [
      array[i],
      array[j]
    ] =
    [
      array[j],
      array[i]
    ];

  }


  return array;

}



// =========================================
// EVENTOS
// =========================================

startButton.addEventListener(
  "click",
  startGame
);


confirmButton.addEventListener(
  "click",
  finishRound
);


nextButton.addEventListener(
  "click",
  nextRound
);


restartButton.addEventListener(
  "click",
  startGame
);


homeButton.addEventListener(
  "click",
  returnHome
);
/* ===================================================== */
/* JUEGO DE MEMORIA GALÁCTICA */
/* PLANET PEDIA */
/* ===================================================== */


/* ===================================================== */
/* ELEMENTOS HTML */
/* ===================================================== */

const menu =
    document.getElementById("menu");

const game =
    document.getElementById("game");

const board =
    document.getElementById("board");

const timerElement =
    document.getElementById("timer");

const matchesElement =
    document.getElementById("matches");

const totalPairsElement =
    document.getElementById("totalPairs");

const attemptsElement =
    document.getElementById("attempts");

const result =
    document.getElementById("result");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const resultIcon =
    document.getElementById("resultIcon");



/* ===================================================== */
/* VARIABLES DEL JUEGO */
/* ===================================================== */

let boardSize;

let initialTime;

let timeLeft;

let timerInterval;

let firstCard = null;

let secondCard = null;

let canClick = true;

let matches = 0;

let attempts = 0;

let totalPairs = 0;



/* ===================================================== */
/* IMÁGENES DE LOS ALIENÍGENAS */
/* ===================================================== */

/*

    AQUÍ TIENES QUE PONER TUS FOTOS.

    Ejemplo:

    "../Especies alienigenas/Los Foxers/Foxer1.jpeg"

    "../Especies alienigenas/Otra raza/Alien.jpg"


    IMPORTANTE:

    2x2 necesita:
    2 imágenes diferentes.

    4x4 necesita:
    8 imágenes diferentes.

    6x6 necesita:
    18 imágenes diferentes.

    8x8 necesita:
    32 imágenes diferentes.


    NO TIENES QUE REPETIR LAS IMÁGENES.

    JavaScript crea automáticamente
    las dos copias necesarias.

*/


const availableImages = [

    "../../../Especies alienigenas/Bazofios/Bazofio icono.png",

    "../../../Especies alienigenas/Los Foxers/Foxer icono.png",

    "../../../Especies alienigenas/AracnoSephus/AracnoSephus icono.png",

    "../../../Especies alienigenas/Klagors/Klagor icono.png",

    "../../../Especies alienigenas/Brinix/Brinix icono.png",

    "../../../Especies alienigenas/Ceruleanos/Ceruleano icono.png",

    "../../../Especies alienigenas/Garbilos/Garbilo icono.png",

    "../../../Especies alienigenas/Garguleans/Gargulean icono.png",

    "../../../Especies alienigenas/Gigantodones/Gigantodon icono.png",

    "../../../Especies alienigenas/Invasores X/InvasoresX icono.png",

    "../../../Especies alienigenas/Los Brainiac/Brainiac icono.png",

    "../../../Especies alienigenas/Los Kaelish/Kaelish icono.png",

    "../../../Especies alienigenas/Orrs/Orr icono.png",

    "../../../Especies alienigenas/Sharkinors/Sharkinor icono.png",

    "../../../Especies alienigenas/Sterons/Steron icono.png",

    "../../../Especies alienigenas/Xelthorianos/Xel'thoriano icono.png",

    "../../../Especies alienigenas/Zornicos/Zornico icono.png",

    "../../../Especies alienigenas/Ultramitas/Ultramita icono.png",

    "../../../Especies alienigenas/Varyths/Varyth icono.png",

    "../../../Especies alienigenas/Velorians/Velorian icono.png",

    "../../../Especies alienigenas/Tortanks/Tortank icono.png",

    "../../../Especies alienigenas/Malerianos/Maleriano icono.png",

    "../../../Especies alienigenas/Grimoriums/Grimorium icono.png",

    "../../../Especies alienigenas/Thanatofos/Thanatofo icono.png",

    "../../../Especies alienigenas/Friggits/Friggit icono.png",

    "../../../Especies alienigenas/Los Grolux/Grolux icono.png",

    "../../../Especies alienigenas/Xilvath/Xilvath icono.png",

    "../../../Especies alienigenas/Samyatis/Samyati icono.png",

    "../../../Especies alienigenas/Hongers/Honger icono.png",

    "../../../Especies alienigenas/Bulinos/Bulino icono.png",

    "../../../Especies alienigenas/Porvils/Porvil icono.png",

    "../../../Especies alienigenas/Permians/Permian icono.png",

    "../../../Especies alienigenas/Thaldrins/Thaldrin icono.png",

    "../../../Especies alienigenas/Grynthars/Grynthar icono.png",

    "../../../Especies alienigenas/Kothars/Kothar icono.png",
    
    "../../../Especies alienigenas/Albirions/Albirion icono.png",

    "../../../Especies alienigenas/Bulnaris/Bulnari icono.png"
];



/* ===================================================== */
/* EMPEZAR PARTIDA */
/* ===================================================== */

function startGame(size, seconds) {


    boardSize =
        size;


    initialTime =
        seconds;


    /*

        Calculamos cuántas imágenes
        necesitamos.

    */

    const requiredPairs =
        (size * size) / 2;



    /*

        Comprobamos si tenemos suficientes
        imágenes.

    */

    if (
        availableImages.length <
        requiredPairs
    ) {

        alert(

            `Necesitas al menos ${requiredPairs} imágenes diferentes para jugar en ${size}x${size}.`

        );

        return;

    }



    /*

        Ocultar menú.

    */

    menu.style.display =
        "none";



    /*

        Mostrar juego.

    */

    game.style.display =
        "block";



    /*

        Crear partida.

    */

    createGame();

}



/* ===================================================== */
/* CREAR PARTIDA */
/* ===================================================== */

function createGame() {


    /*

        Detenemos cualquier cronómetro
        anterior.

    */

    clearInterval(
        timerInterval
    );



    /*

        Limpiar tablero.

    */

    board.innerHTML =
        "";



    /*

        Reiniciar variables.

    */

    firstCard =
        null;

    secondCard =
        null;

    canClick =
        true;

    matches =
        0;

    attempts =
        0;

    timeLeft =
        initialTime;



    /* ================================================= */
    /* CALCULAR CARTAS Y PAREJAS */
    /* ================================================= */

    const totalCards =
        boardSize *
        boardSize;


    totalPairs =
        totalCards / 2;



    /* ================================================= */
    /* ACTUALIZAR HUD */
    /* ================================================= */

    matchesElement.textContent =
        matches;


    totalPairsElement.textContent =
        totalPairs;


    attemptsElement.textContent =
        attempts;



    /* ================================================= */
    /* SELECCIONAR IMÁGENES ALEATORIAS */
    /* ================================================= */

    /*

        Hacemos una copia del array.

        De esta forma no modificamos
        availableImages.

    */

    const imagePool = [
        ...availableImages
    ];



    /*

        Barajamos las imágenes.

    */

    shuffle(
        imagePool
    );



    /*

        Elegimos únicamente las imágenes
        necesarias para esta dificultad.

    */

    const selectedImages =
        imagePool.slice(
            0,
            totalPairs
        );



    /* ================================================= */
    /* CREAR LAS PAREJAS */
    /* ================================================= */

    /*

        Supongamos que selectedImages es:

        alien1
        alien2
        alien3


        Esto genera:

        alien1
        alien2
        alien3
        alien1
        alien2
        alien3

    */

    const cards = [

        ...selectedImages,

        ...selectedImages

    ];



    /*

        Ahora mezclamos todas
        las cartas.

    */

    shuffle(
        cards
    );



    /* ================================================= */
    /* CREAR COLUMNAS DEL TABLERO */
    /* ================================================= */

    board.style.gridTemplateColumns =

        `repeat(${boardSize}, 1fr)`;



    /* ================================================= */
    /* CREAR CARTAS HTML */
    /* ================================================= */

    cards.forEach(

        (image) => {


            /*

                Crear carta.

            */

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";



            /*

                Guardamos la ruta de la
                imagen en dataset.

                La utilizaremos para
                comprobar las parejas.

            */

            card.dataset.image =
                image;



            /*

                Estructura interna de
                la carta.

            */

            card.innerHTML = `

                <div class="card-inner">


                    <div class="card-front">

                    </div>


                    <div class="card-back">

                        <img

                            src="${image}"

                            alt="Espécimen alienígena"

                            draggable="false"

                        >

                    </div>


                </div>

            `;



            /*

                Cuando hagamos clic
                seleccionamos la carta.

            */

            card.addEventListener(

                "click",

                () => {

                    selectCard(
                        card
                    );

                }

            );



            /*

                Añadir carta al tablero.

            */

            board.appendChild(
                card
            );


        }

    );



    /* ================================================= */
    /* MOSTRAR TIEMPO INICIAL */
    /* ================================================= */

    updateTimer();



    /* ================================================= */
    /* INICIAR CRONÓMETRO */
    /* ================================================= */

    timerInterval =
        setInterval(

            () => {


                /*

                    Restamos un segundo.

                */

                timeLeft--;



                /*

                    Actualizamos pantalla.

                */

                updateTimer();



                /*

                    Si llega a cero...

                */

                if (
                    timeLeft <= 0
                ) {


                    clearInterval(
                        timerInterval
                    );


                    endGame(
                        false
                    );


                }


            },

            1000

        );

}



/* ===================================================== */
/* SELECCIONAR CARTA */
/* ===================================================== */

function selectCard(
    card
) {


    /*

        Si estamos esperando a que
        se oculten dos cartas,
        no permitimos más clics.

    */

    if (
        !canClick
    ) {

        return;

    }



    /*

        Si esta carta ya forma parte
        de una pareja encontrada,
        tampoco hacemos nada.

    */

    if (
        card.classList.contains(
            "matched"
        )
    ) {

        return;

    }



    /*

        No podemos seleccionar
        la misma carta dos veces.

    */

    if (
        card === firstCard
    ) {

        return;

    }



    /* ================================================= */
    /* VOLTEAR CARTA */
    /* ================================================= */

    card.classList.add(
        "flipped"
    );



    /* ================================================= */
    /* PRIMERA CARTA */
    /* ================================================= */

    if (
        !firstCard
    ) {


        firstCard =
            card;


        return;


    }



    /* ================================================= */
    /* SEGUNDA CARTA */
    /* ================================================= */

    secondCard =
        card;



    /*

        Aumentamos intentos.

    */

    attempts++;


    attemptsElement.textContent =
        attempts;



    /*

        Bloqueamos temporalmente
        los clics.

    */

    canClick =
        false;



    /* ================================================= */
    /* COMPROBAR PAREJA */
    /* ================================================= */

    if (

        firstCard.dataset.image ===
        secondCard.dataset.image

    ) {


        matchFound();


    }

    else {


        noMatch();


    }

}



/* ===================================================== */
/* PAREJA ENCONTRADA */
/* ===================================================== */

function matchFound() {


    /*

        Marcamos las dos cartas
        como encontradas.

    */

    firstCard.classList.add(
        "matched"
    );


    secondCard.classList.add(
        "matched"
    );



    /*

        Aumentar número de parejas.

    */

    matches++;



    /*

        Mostrar resultado.

    */

    matchesElement.textContent =
        matches;



    /*

        Reiniciar selección.

    */

    resetCards();



    /* ================================================= */
    /* ¿HEMOS GANADO? */
    /* ================================================= */

    if (
        matches === totalPairs
    ) {


        /*

            Detener cronómetro.

        */

        clearInterval(
            timerInterval
        );



        /*

            Esperamos ligeramente
            para mostrar la última pareja.

        */

        setTimeout(

            () => {

                endGame(
                    true
                );

            },

            450

        );


    }

}



/* ===================================================== */
/* NO ES PAREJA */
/* ===================================================== */

function noMatch() {


    /*

        Esperamos 700 ms para que
        el jugador pueda ver las cartas.

    */

    setTimeout(

        () => {


            firstCard.classList.remove(
                "flipped"
            );


            secondCard.classList.remove(
                "flipped"
            );


            resetCards();


        },

        700

    );

}



/* ===================================================== */
/* REINICIAR CARTAS SELECCIONADAS */
/* ===================================================== */

function resetCards() {


    firstCard =
        null;


    secondCard =
        null;


    canClick =
        true;

}



/* ===================================================== */
/* ACTUALIZAR CRONÓMETRO */
/* ===================================================== */

function updateTimer() {


    /*

        Calcular minutos.

    */

    const minutes =

        Math.floor(
            timeLeft / 60
        );



    /*

        Calcular segundos.

    */

    const seconds =

        timeLeft % 60;



    /* ================================================= */
    /* MOSTRAR 00:00 */
    /* ================================================= */

    timerElement.textContent =

        `${

            String(
                minutes
            ).padStart(
                2,
                "0"
            )

        }:${
            
            String(
                seconds
            ).padStart(
                2,
                "0"
            )

        }`;



    /* ================================================= */
    /* QUITAR ALERTAS */
    /* ================================================= */

    timerElement.classList.remove(
        "warning",
        "danger"
    );



    /* ================================================= */
    /* ÚLTIMOS 10 SEGUNDOS */
    /* ================================================= */

    if (
        timeLeft <= 10
    ) {


        timerElement.classList.add(
            "danger"
        );


    }


    /* ================================================= */
    /* ÚLTIMO 25% DEL TIEMPO */
    /* ================================================= */

    else if (

        timeLeft <=
        initialTime * 0.25

    ) {


        timerElement.classList.add(
            "warning"
        );


    }

}



/* ===================================================== */
/* FINALIZAR JUEGO */
/* ===================================================== */

function endGame(
    won
) {


    /*

        Bloqueamos cartas.

    */

    canClick =
        false;



    /*

        Mostrar pantalla de resultado.

    */

    result.style.display =
        "flex";



    /* ================================================= */
    /* VICTORIA */
    /* ================================================= */

    if (
        won
    ) {


        resultIcon.textContent =
            "◎";


        resultTitle.textContent =
            "Misión completada";


        resultText.textContent =

            `Has identificado las ${totalPairs} parejas alienígenas en ${attempts} intentos. Tiempo restante: ${timerElement.textContent}.`;


    }


    /* ================================================= */
    /* DERROTA */
    /* ================================================= */

    else {


        resultIcon.textContent =
            "⚠";


        resultTitle.textContent =
            "Protocolo interrumpido";


        resultText.textContent =

            `El tiempo ha finalizado. Has verificado ${matches} de ${totalPairs} parejas.`;


    }

}



/* ===================================================== */
/* REINICIAR PARTIDA */
/* ===================================================== */

function restartGame() {


    /*

        Ocultar resultado.

    */

    result.style.display =
        "none";



    /*

        Crear una partida nueva
        con la misma dificultad.

    */

    createGame();

}



/* ===================================================== */
/* VOLVER AL MENÚ */
/* ===================================================== */

function goToMenu() {


    /*

        Detener cronómetro.

    */

    clearInterval(
        timerInterval
    );



    /*

        Ocultar resultado.

    */

    result.style.display =
        "none";



    /*

        Ocultar juego.

    */

    game.style.display =
        "none";



    /*

        Mostrar menú.

    */

    menu.style.display =
        "block";



    /*

        Limpiar tablero.

    */

    board.innerHTML =
        "";

}



/* ===================================================== */
/* FUNCIÓN PARA BARAJAR */
/* ===================================================== */

/*

    Fisher-Yates Shuffle

    Mezcla de forma aleatoria
    los elementos de un array.

*/

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
                (i + 1)

            );



        [

            array[i],

            array[j]

        ] = [

            array[j],

            array[i]

        ];


    }

}
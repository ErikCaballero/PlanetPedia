/*
============================================================
    EXPERIMENTOS BRAINIACS
============================================================

Para añadir un nuevo experimento:

1. Copia uno de los objetos de abajo.
2. Pégalo dentro del array "experimentos".
3. Cambia los datos.
4. No necesitas tocar el HTML.

Todos los experimentos se cargarán automáticamente.

La información siempre se muestra dentro del mismo elemento:

#detalleExperimento
============================================================
*/


const experimentos = [

    /* =====================================================
       EXPERIMENTO 1
    ===================================================== */

    {
        id: "WR-001",

        nombre: "Permians",

        imagen:
            "../../../Especies alienigenas/Permians/Permians.webp",

        categoria:
            "Bioingeniería",

        estado:
            "Finalizado",

        resultadoCorto:
            "Fracaso",

        responsable:
            "Desconocido",

        resumen:
            "Se creó una raza guerrera resistente al daño, ágil y veloz en combate, esta raza es complicada de derrotar en un combate cuerpo a cuerpo pero no tienen la resistencia física suficiente para sobrevivir a amenazas grandes y el experimento se abandonó.",

        objetivo:
            "Crear una raza guerrera perfecta para la protección de todo el universo sobre cualquier amenaza.",

        resultado:
            "El experimento es considerado un fracaso, ya que no ha cumplido con el objetivo deseado.",

        observaciones:
            "Son una buena raza guerrera pero, lo que buscamos es la perfección, y no son aptos."
    },



    /* =====================================================
       EXPERIMENTO 2
    ===================================================== */

    {
        id: "EG-014",

        nombre:
            "ElectroHexes",

        imagen:
            "img/ElectroHexes.webp",

        categoria:
            "Energía / Biología",

        estado:
            "Finalizado",

        resultadoCorto:
            "Éxito parcial",

        responsable:
            "Marcus Nerion",

        resumen:
            "El experimento ha salido con éxito per, no se ha alcanzado la cantidad de energía deseada.",

        objetivo:
            "El experimento busca crear a unos organismos de pequeño tamaño con la capacidad de generar energía, de esta forma se podría transportar de manera sencilla.",

        resultado:
            "El resultado es un éxito parcial, los insectos generan energía pero, la cantidad no es la deseada, además quedaron obsoletos en seguida.",

        observaciones:
            "Los insectos son excelentes para venderlos para conseguir cosas de valor o necesarias, pero, no vale la pena utilizarlas por la gran cantidad de maneras que utilizamos para generar energía."
    },



    /* =====================================================
       EXPERIMENTO 3
    ===================================================== */

    {
        id:
            "ME-007",

        nombre:
            "Mente Espejo",

        imagen:
            "img/RecuerdosBR.webp",

        categoria:
            "Neurociencia",

        estado:
            "Finalizado",

        resultadoCorto:
            "Éxito",

        responsable:
            "Grantlos Mindfild",

        resumen:
            "El experimento ha logrado tras tres intentos el objetivo que se esperaba con un rotundo éxito.",

        objetivo:
            "Crear una copia funcional de recuerdos, habilidades y razonamiento que pueda ser transferida entre distintos soportes Brainiac.",

        resultado:
            "El experimento ha logrado exactamente lo que se propuso, se ha conseguido mantener una copia real de todos los conocimientos de un cerebro Brainiac.",

        observaciones:
            "Se han necesitado tres intentos para lograr el almacenamiento completo del conocimiento que tiene un cerebro, lo cual es perfecto para poder mejorar la base de datos Brainiac."
    },



    /* =====================================================
       EXPERIMENTO 4
    ===================================================== */

    {
        id:
            "EG-041",

        nombre:
            "Máquina de energía Material",

        imagen:
            "../../../Especies alienigenas/Los Brainiac/Maquina Energicomaterial.webp",

        categoria:
            "Energía",

        estado:
            "Prototipo",

        resultadoCorto:
            "Éxito excepcional",

        responsable:
            "Aelix Cerebron",

        resumen:
            "Forma de vida diseñada para modificar parcialmente su fisiología según la temperatura, gravedad y composición atmosférica de su entorno.",

        objetivo:
            "Crear una máquina que pueda generar energía a partir de cualquier cosa, cualquier material, ya sea valioso, meros residuos o incluso seres vivos.",

        resultado:
            "Un absoluto éxito, la máquina ha resuelto el mayor problema al que se enfrentaba la raza, dajándo obsoleta instantáneamente cualquier otra forma de producción de energía y haciendo a su creador el más conocido, admirado e importante de toda la especie.",

        observaciones:
            "Puede que la máquina sea mejorable, pero, con la tecnología y conocimiento actual no he encontrado ninguna forma para mejorarlo."
    },

     /* =====================================================
       EXPERIMENTO 5
    ===================================================== */

    {
        id:
            "EH-022",

        nombre:
            "Super Fertilizante",

        imagen:
            "img/SuperFertilizante.webp",

        categoria:
            "Agricultura y Ecología",

        estado:
            "Finalizado",

        resultadoCorto:
            "Éxito",

        responsable:
            "Brener Calinor",

        resumen:
            "Pese a los recursos gastados este experimento podria salvar nuestro planeta o cualquier otro, por lo cual se considera un éxito.",

        objetivo:
            "Crear un fertilizante que al vertirlo hace que crezcan las plantas instantáneamente en un radio enorme de hasta 10 kilómetros.",

        resultado:
            "Un éxito,  el fertilizante ha conseguido regenerar planetas muertos o crear vidas en planetas innertes.",

        observaciones:
            "El Super Fertilizante ha sido probado en un planeta muerto, con solamente 3 kilos de este fertilizante un planeta totalmente desértico a conseguido remontar y su tierra ha vuelto a ser fértil."
        },

        /* =====================================================
        EXPERIMENTO 6
        ===================================================== */

        {
            id:
                "BW-031",

            nombre:
                "El CROPT",

            imagen:
                "../../amenazas/imgAmenazas/El CROPT ciudad.webp",

            categoria:
                "Microbiología, Epidemiología y Genética",

            estado:
                "Finalizado",

            resultadoCorto:
                "Fracaso",

            responsable:
                "Brener Calinor",

            resumen:
                "El experimento ha sido un fracaso, pues, aunque se puede aniquilar una raza entera con este agente biológico, no se puede controlar su comportamiento una vez liberado y es una amenaza para todo ser viviente.",

            objetivo:
                "Crear un agente biológico que sea capaz de eliminar y comvertir en esclavos a otras razas y hacer que los Brainiacs sean inmunes.",

            resultado:
                "El experimento ha sido un fracaso, pues pese a que controla a los seres que asimila y absorbe sus mentes el xenoparásito toma conciencia propia y busca la expansión y la dominación total, afectando también a los Brainiacs.",

            observaciones:
                "Mierda, ¿Qué he hecho!? He creado una amenaza galáctica."
            },

            /* =====================================================
            EXPERIMENTO 7
            ===================================================== */

            {
                id:
                    "EG-036",

                nombre:
                    "El Devorados estelar",

                imagen:
                    "img/DevoradorEstelar.webp",

                categoria:
                    "Biología, energía y genética",

                estado:
                    "Finalizado",

                resultadoCorto:
                    "Éxito",

                responsable:
                    "Marcus Nerion",

                resumen:
                    "El experimento ha sido un éxito, pues se ha logrado crear un ser pequeño que puede absorber energía de una estrella y almacenarla de forma segura, pero, se han encontrado maneras mejores y más fiables de generar energía.",

                objetivo:
                    "Crear un ser pequeño, de 10 metro de altura que absorba energía de una estrella, guardándola de forma segura dentro de su organismo para su posterior extracción y uso.",

                resultado:
                    "Un éxito, pese a que el proyecto haya sido un éxito, no se considera un éxito excepcional, dado a que se requiere de esperar a que el orgánismo absorba la energía para utilizarla.",

                observaciones:
                    "El proyecto era perfecto, por fin la biología podía darnos energía ilimitada, pero, llegó la Máquina de Energía Material y dejó obsoleto el experimento."
                },

                /* =====================================================
                EXPERIMENTO 8
                ===================================================== */

                {
                    id:
                        "CC-015",

                    nombre:
                        "El organismo quimera",

                    imagen:
                        "img/OrganismoQuimera.webp",

                    categoria:
                        "Biología y genética",

                    estado:
                        "Finalizado",

                    resultadoCorto:
                        "Éxito parcial",

                    responsable:
                        "Meron verinas",

                    resumen:
                        "Pese a que el experimento haya obtenido resultados positivos, no se considera útil.",

                    objetivo:
                        "Crear un ser que pueda reescribir su código genético adaptando habilidades y cosas útiles de los seres de su al rededor, mejorandose a sí mismo para poder convertirse en el ser más poderoso de su ecosistema.",

                    resultado:
                        "Un éxito parcial, pese a que el sujeto realiza lo esperado no se considera un éxito total, puesto a que puede llegar a ser asesinado por cualquier organismo del ecosistema si llega a toparse con un peligro superior en una etapa temprana de desarrollo.",

                    observaciones:
                        "Considero que el experimento ha salido bien, solo que no ha resultado en un arma, no quería crear un arma, solo una criatura capaz de vivir en cualquier planeta adaptando las capacidades de supervivencia de su entorno."
                    },

                    /* =====================================================
                    EXPERIMENTO 9
                    ===================================================== */

                    {
                        id:
                            "CC-015",

                        nombre:
                            "El organismo quimera",

                        imagen:
                            "img/OrganismoQuimera.webp",

                        categoria:
                            "Biología y genética",

                        estado:
                            "Finalizado",

                        resultadoCorto:
                            "Éxito parcial",

                        responsable:
                            "Meron verinas",

                        resumen:
                            "Pese a que el experimento haya obtenido resultados positivos, no se considera útil.",

                        objetivo:
                            "Crear un ser que pueda reescribir su código genético adaptando habilidades y cosas útiles de los seres de su al rededor, mejorandose a sí mismo para poder convertirse en el ser más poderoso de su ecosistema.",

                        resultado:
                            "Un éxito parcial, pese a que el sujeto realiza lo esperado no se considera un éxito total, puesto a que puede llegar a ser asesinado por cualquier organismo del ecosistema si llega a toparse con un peligro superior en una etapa temprana de desarrollo.",

                        observaciones:
                            "Considero que el experimento ha salido bien, solo que no ha resultado en un arma, no quería crear un arma, solo una criatura capaz de vivir en cualquier planeta adaptando las capacidades de supervivencia de su entorno."
                    }
];



/* ==========================================================
   ELEMENTOS DEL HTML
========================================================== */

const lista =
    document.getElementById(
        "listaExperimentos"
    );


const detalle =
    document.getElementById(
        "detalleExperimento"
    );


const contador =
    document.getElementById(
        "contadorExperimentos"
    );



/* ==========================================================
   CONTADOR DE EXPERIMENTOS
========================================================== */

contador.textContent =
    String(
        experimentos.length
    ).padStart(
        2,
        "0"
    );



/* ==========================================================
   CLASE SEGÚN RIESGO
========================================================== */

function claseResultado(resultadoCorto) {

    const valor = resultadoCorto
        .toLowerCase()
        .trim();

    if (valor.includes("éxito excepcional")) {
        return "texto-exito-excepcional";
    }

    if (valor.includes("éxito parcial")) {
        return "texto-parcial";
    }

    if (valor.includes("fracaso")) {
        return "texto-fracaso";
    }

    if (valor.includes("éxito")) {
        return "texto-exito";
    }

    return "";
}



/* ==========================================================
   CREAR TARJETAS
========================================================== */

function crearTarjetas() {


    /*
        Recorremos todos los experimentos
        y creamos automáticamente una tarjeta
        para cada uno.
    */

    lista.innerHTML =
        experimentos.map(
            (experimento, indice) => `


                <button
                    class="experimento-card"
                    type="button"
                    data-index="${indice}"
                    aria-label="Abrir ${experimento.nombre}"
                >


                    <img
                        src="${experimento.imagen}"
                        alt="${experimento.nombre}"
                    >


                    <span class="experimento-card-info">

                        <small>
                            ${experimento.id}
                        </small>

                        <strong>
                            ${experimento.nombre}
                        </strong>

                    </span>


                </button>


            `
        ).join("");



    /*
        Buscamos todas las tarjetas que
        acabamos de crear.
    */

    const tarjetas =
        document.querySelectorAll(
            ".experimento-card"
        );



    /*
        A cada tarjeta le ponemos
        un evento click.
    */

    tarjetas.forEach(
        card => {


            card.addEventListener(
                "click",
                () => {


                    /*
                        data-index contiene
                        qué experimento corresponde
                        a esta tarjeta.
                    */

                    const indice =
                        Number(
                            card.dataset.index
                        );


                    /*
                        Cargamos ese experimento
                        en el panel.
                    */

                    cargarExperimento(
                        indice
                    );

                }
            );


        }
    );

}



/* ==========================================================
   CARGAR EXPERIMENTO
========================================================== */

function cargarExperimento(indice) {


    /*
        Obtenemos el experimento pulsado.
    */

    const experimento =
        experimentos[indice];



    /*
        Quitamos la clase "activo"
        de todas las tarjetas y
        se la ponemos solamente
        a la seleccionada.
    */

    document
        .querySelectorAll(
            ".experimento-card"
        )
        .forEach(
            (card, i) => {


                card.classList.toggle(
                    "activo",
                    i === indice
                );


            }
        );



    /*
    =========================================================

        AQUÍ ESTÁ LA PARTE IMPORTANTE

        detalle siempre es:

        document.getElementById("detalleExperimento")

        Por lo tanto NO creamos otro div.

        Simplemente sustituimos su contenido
        cada vez que se pulsa un experimento.

    =========================================================
    */


    detalle.innerHTML = `


        <!-- =============================
             IMAGEN PRINCIPAL
        ============================== -->

        <div class="detalle-portada">


            <img
                src="${experimento.imagen}"
                alt="${experimento.nombre}"
            >


            <div class="detalle-cabecera">


                <span class="exp-id">

                    ${experimento.id}

                </span>


                <h2>

                    ${experimento.nombre}

                </h2>


            </div>


        </div>



        <!-- =============================
             INFORMACIÓN
        ============================== -->

        <div class="detalle-contenido">


            <p class="detalle-resumen">

                ${experimento.resumen}

            </p>



            <!-- =========================
                 DATOS
            ========================== -->

            <div class="ficha-grid">


                <div class="ficha-dato">

                    <span>
                        Área científica
                    </span>

                    <strong>
                        ${experimento.categoria}
                    </strong>

                </div>



                <div class="ficha-dato">

                    <span>
                        Estado
                    </span>

                    <strong>
                        ${experimento.estado}
                    </strong>

                </div>



               <div class="ficha-dato">

                    <span>
                        Resultado corto
                    </span>

                    <strong class="${claseResultado(experimento.resultadoCorto)}">
                        ${experimento.resultadoCorto}
                    </strong>

                </div>



                <div class="ficha-dato">

                    <span>
                        Responsable
                    </span>

                    <strong>
                        ${experimento.responsable}
                    </strong>

                </div>


            </div>



            <!-- =========================
                 OBJETIVO
            ========================== -->

            <div class="detalle-bloque">

                <h3>
                    Objetivo del experimento
                </h3>

                <p>
                    ${experimento.objetivo}
                </p>

            </div>



            <!-- =========================
                 RESULTADO
            ========================== -->

            <div class="detalle-bloque">

                <h3>
                    Resultado
                </h3>

                <p>
                    ${experimento.resultado}
                </p>

            </div>



            <!-- =========================
                 OBSERVACIONES
            ========================== -->

            <div class="detalle-bloque">

                <h3>
                    Observaciones del laboratorio
                </h3>

                <p>
                    ${experimento.observaciones}
                </p>

            </div>


        </div>


    `;

}



/* ==========================================================
   INICIAR LA PÁGINA
========================================================== */


/*
    Creamos las tarjetas.
*/

crearTarjetas();


/*
    Al entrar a la página,
    mostramos automáticamente
    el primer experimento.
*/

cargarExperimento(0);
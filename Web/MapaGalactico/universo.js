window.UNIVERSE_DATA = {

  config: {

    initialCamera: {
      x: 0,
      y: 0,
      zoom: 0.55
    },

    minZoom: 0.16,
    maxZoom: 8

  },


  /* =====================================
     OBJETOS DEL UNIVERSO
  ====================================== */

  objects: [


    /* ===================================
       GALAXIAS
    ==================================== */

    {
      id: "eryon",

      type: "galaxy",

      name: "Galaxia Eryon",

      x: -760,
      y: -280,

      size: 190,

      minZoom: 0.16,
      maxZoom: 1.15,

      subtitle:
        "Galaxia espiral • Sector occidental",

      description:
        "Una galaxia antigua, cruzada por rutas de comercio y regiones de intensa actividad estelar.",

      url: ""
    },


    {
      id: "Sapphirus",

      type: "galaxy",

      name: "Galaxia Sapphirus",

      x: 720,
      y: -420,

      size: 155,

      minZoom: 0.16,
      maxZoom: 1.05,

      subtitle:
        "Galaxia espiral • Frontera exterior",

      description:
        "Una galaxia llena de sorpresas.",

      url: ""
    },


    {
      id: "nyx",

      type: "galaxy",

      name: "Nube de Nyx",

      x: 100,
      y: 700,

      size: 230,

      minZoom: 0.16,
      maxZoom: 0.90,

      subtitle:
        "Complejo nebular • Región meridional",

      description:
        "Una vasta región de gas ionizado que oculta sistemas jóvenes y rutas poco cartografiadas.",

      url: ""
    },


    /* ===================================
       SISTEMAS DE ERYON
    ==================================== */

    {
      id: "Zorn",

      parent: "eryon",

      type: "system",

      name: "Sistema Zorn",

      x: -720,
      y: -250,

      size: 26,

      minZoom: 0.72,
      maxZoom: 5,

      subtitle:
        "Sistema estelar • 6 mundos",

      description:
        "Sistema de residencia de los Zornicos.",

      url: ""
    },


    {
      id: "vega",

      parent: "eryon",

      type: "system",

      name: "Sistema Vega",

      x: -920,
      y: -390,

      size: 22,

      minZoom: 0.78,
      maxZoom: 5,

      subtitle:
        "Sistema estelar • 4 mundos",

      description:
        "Nodo científico y observatorio de largo alcance.",

      url: ""
    },


    {
      id: "kharon",

      parent: "eryon",

      type: "system",

      name: "Sistema Kharon",

      x: -550,
      y: -440,

      size: 20,

      minZoom: 0.82,
      maxZoom: 5,

      subtitle:
        "Sistema binario • 3 mundos",

      description:
        "Zona militarizada próxima a la frontera.",

      url: ""
    },


    /* ===================================
       SISTEMAS DE THALOS
    ==================================== */

    {
      id: "sapphire",

      parent: "Sapphirus",

      type: "system",

      name: "Sistema Sapphire",

      x: 680,
      y: -390,

      size: 25,

      minZoom: 0.72,
      maxZoom: 5,

      subtitle:
        "Sistema estelar • 5 mundos",

      description:
        "Capital comercial de Thalos.",

      url: ""
    },


    {
      id: "orun",

      parent: "thalos",

      type: "system",

      name: "Sistema Orun",

      x: 850,
      y: -500,

      size: 19,

      minZoom: 0.80,
      maxZoom: 5,

      subtitle:
        "Sistema estelar • 2 mundos",

      description:
        "Sistema aislado, conocido por sus astilleros.",

      url: ""
    },


    /* ===================================
       MUNDOS
    ==================================== */

    {
      id: "zorn1",

      parent: "Zorn",

      type: "world",

      name: "Zorn1",

      x: -698,
      y: -238,

      size: 15,

      minZoom: 2.0,
      maxZoom: 99,

      subtitle:
        "Planeta capital • Clase terrestre",

      description:
        "Capital del Dominio Solar y uno de los mundos más poblados del sector.",

      url:
        "mundos/aurelia.html"
    },


    {
      id: "zorn2",

      parent: "Zorn",

      type: "world",

      name: "Zorn 2",

      x: -752,
      y: -270,

      size: 11,

      minZoom: 2.2,
      maxZoom: 99,

      subtitle:
        "Planeta rocoso • Mundo fortaleza",

      description:
        "Un planeta oscuro y altamente militarizado.",

      url:
        "../planetas/Zorn2"
    },


    {
      id: "tethys",

      parent: "helios",

      type: "world",

      name: "Tethys",

      x: -730,
      y: -205,

      size: 5.5,

      minZoom: 2.25,
      maxZoom: 99,

      subtitle:
        "Mundo oceánico",

      description:
        "Planeta cubierto por mares profundos y archipiélagos flotantes.",

      url:
        "mundos/tethys.html"
    },


    {
      id: "lys",

      parent: "vega",

      type: "world",

      name: "Lys",

      x: -900,
      y: -370,

      size: 5.5,

      minZoom: 2.25,
      maxZoom: 99,

      subtitle:
        "Planeta jardín",

      description:
        "Mundo templado usado como enclave diplomático.",

      url:
        "mundos/lys.html"
    },


    {
      id: "sapphierecrest",

      parent: "siriath",

      type: "world",

      name: "Sapphire Crest",

      x: 675,
      y: -322,

      size: 6,

      minZoom: 2.1,
      maxZoom: 99,

      subtitle:
        "Planeta Continental",

      description:
        "Planeta de residencia de los Orrs, los Ceruleanos y los Garguleans.",

      url:
        "../planetas/SapphireCrest.html"
    },

    {
      id: "sapphieredom",

      parent: "siriath",

      type: "world",

      name: "Sapphire Dom",

      x: 707,
      y: -294,

      size: 6,

      minZoom: 2.1,
      maxZoom: 99,

      subtitle:
        "Planeta Continental",

      description:
        "Es el planeta natal de la raza de los Xel'thorianos.",

      url:
        "../planetas/SapphireCrest.html"
    },

    {
      id: "starrus1",

      parent: "siriath",

      type: "world",

      name: "Starrus 1",

      x: 705,
      y: -392,

      size: 6,

      minZoom: 2.1,
      maxZoom: 99,

      subtitle:
        "Planeta residido por Xel'thoriano",

      description:
        "Es el planeta natal de la raza de los Xel'thorianos.",

      url:
        "../planetas/SapphireCrest.html"
    }

  ],


  /* =====================================
     RUTAS
  ====================================== */

  routes: [

    [
      "helios",
      "vega"
    ],

    [
      "helios",
      "kharon"
    ],

    [
      "siriath",
      "orun"
    ]

  ]

};
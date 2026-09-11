(() => {

  "use strict";


  /* =====================================
     DATOS
  ====================================== */

  const data =
    window.UNIVERSE_DATA;


  if (!data) {

    console.error(
      "No se encontró window.UNIVERSE_DATA. " +
      "Carga universe-data.js antes de galaxy-map.js."
    );

    return;
  }


  const objects =
    data.objects || [];


  const routes =
    data.routes || [];


  const objectById =
    new Map(
      objects.map(
        object => [
          object.id,
          object
        ]
      )
    );


  /* =====================================
     ELEMENTOS DEL DOM
  ====================================== */

  const canvas =
    document.getElementById(
      "galaxy-map"
    );


  const ctx =
    canvas.getContext("2d");


  const panel =
    document.getElementById(
      "info-panel"
    );


  const panelType =
    document.getElementById(
      "info-type"
    );


  const panelTitle =
    document.getElementById(
      "info-title"
    );


  const panelSubtitle =
    document.getElementById(
      "info-subtitle"
    );


  const panelDescription =
    document.getElementById(
      "info-description"
    );


  const panelCoordinates =
    document.getElementById(
      "info-coordinates"
    );


  const panelScale =
    document.getElementById(
      "info-scale"
    );


  const panelLink =
    document.getElementById(
      "info-link"
    );


  const zoomLabel =
    document.getElementById(
      "map-zoom-label"
    );


  const searchForm =
    document.getElementById(
      "map-search-form"
    );


  const searchInput =
    document.getElementById(
      "map-search-input"
    );


  /* =====================================
     CÁMARA
  ====================================== */

  const initialCamera =
    data.config?.initialCamera || {
      x: 0,
      y: 0,
      zoom: 0.55
    };


  const camera = {

    x:
      initialCamera.x ?? 0,

    y:
      initialCamera.y ?? 0,

    zoom:
      initialCamera.zoom ?? 0.55,

    minZoom:
      data.config?.minZoom ?? 0.16,

    maxZoom:
      data.config?.maxZoom ?? 8

  };


  /* =====================================
     ESTADO
  ====================================== */

  let cssWidth = 1;

  let cssHeight = 1;

  let deviceScale = 1;


  let selectedObject = null;


  let animationFrame = null;


  const pointers =
    new Map();


  let dragging = false;

  let dragStart = null;

  let pointerMoved = false;

  let pinchStart = null;


  /* =====================================
     CAPAS DE ESTRELLAS

     Son infinitas porque se generan por
     bloques en función de la cámara.
  ====================================== */

  const STAR_LAYERS = [


    /* Estrellas lejanas */

    {

      seed: 11,

      tileSize: 120,

      starsPerTile: 5,

      parallax: 0.020,

      minRadius: 0.25,

      maxRadius: 0.60,

      minAlpha: 0.10,

      maxAlpha: 0.34,

      mode: "dust"

    },


    /* Capa intermedia */

    {

      seed: 29,

      tileSize: 180,

      starsPerTile: 7,

      parallax: 0.055,

      minRadius: 0.35,

      maxRadius: 0.95,

      minAlpha: 0.18,

      maxAlpha: 0.62,

      mode: "normal"

    },


    /* Estrellas cercanas */

    {

      seed: 47,

      tileSize: 260,

      starsPerTile: 5,

      parallax: 0.120,

      minRadius: 0.55,

      maxRadius: 1.45,

      minAlpha: 0.30,

      maxAlpha: 0.90,

      mode: "near"

    }

  ];


  /* =====================================
     UTILIDADES
  ====================================== */

  function clamp(
    value,
    min,
    max
  ) {

    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    );

  }


  function smoothstep(
    edge0,
    edge1,
    value
  ) {

    const t =
      clamp(
        (
          value -
          edge0
        ) /
        (
          edge1 -
          edge0
        ),
        0,
        1
      );


    return (
      t *
      t *
      (
        3 -
        2 * t
      )
    );

  }


  /* =====================================
     GENERADOR DETERMINISTA

     Hace que las estrellas permanezcan
     siempre en la misma posición.
  ====================================== */

  function hash32(
    x,
    y,
    n,
    seed
  ) {

    let h =
      Math.imul(
        (x | 0) ^
        (
          0x9e3779b9 +
          seed
        ),
        0x85ebca6b
      );


    h ^=
      Math.imul(
        (y | 0) ^
        (
          0xc2b2ae35 +
          seed
        ),
        0x27d4eb2d
      );


    h ^=
      Math.imul(
        (n | 0) ^
        (
          0x165667b1 +
          seed
        ),
        0x1b873593
      );


    h ^= h >>> 15;


    h =
      Math.imul(
        h,
        0x85ebca6b
      );


    h ^= h >>> 13;


    return (
      (h >>> 0) /
      4294967296
    );

  }


  /* =====================================
     RESIZE
  ====================================== */

  function resizeCanvas() {

    const rect =
      canvas.getBoundingClientRect();


    cssWidth =
      Math.max(
        1,
        rect.width
      );


    cssHeight =
      Math.max(
        1,
        rect.height
      );


    deviceScale =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    canvas.width =
      Math.round(
        cssWidth *
        deviceScale
      );


    canvas.height =
      Math.round(
        cssHeight *
        deviceScale
      );


    ctx.setTransform(
      deviceScale,
      0,
      0,
      deviceScale,
      0,
      0
    );


    draw();

  }


  /* =====================================
     CONVERSIÓN DE COORDENADAS
  ====================================== */

  function worldToScreen(
    x,
    y
  ) {

    return {

      x:
        cssWidth / 2 +
        (
          x -
          camera.x
        ) *
        camera.zoom,

      y:
        cssHeight / 2 +
        (
          y -
          camera.y
        ) *
        camera.zoom

    };

  }


  function screenToWorld(
    x,
    y
  ) {

    return {

      x:
        camera.x +
        (
          x -
          cssWidth / 2
        ) /
        camera.zoom,

      y:
        camera.y +
        (
          y -
          cssHeight / 2
        ) /
        camera.zoom

    };

  }


  function clampZoom(
    zoom
  ) {

    return clamp(
      zoom,
      camera.minZoom,
      camera.maxZoom
    );

  }


  function isObjectVisible(
    object
  ) {

    return (

      camera.zoom >=
      object.minZoom

      &&

      camera.zoom <=
      object.maxZoom

    );

  }


  /* =====================================
     FONDO
  ====================================== */

  function drawSpaceBackground() {

    ctx.clearRect(
      0,
      0,
      cssWidth,
      cssHeight
    );


    const gradient =
      ctx.createRadialGradient(

        cssWidth * 0.50,
        cssHeight * 0.44,

        0,

        cssWidth * 0.50,
        cssHeight * 0.44,

        Math.max(
          cssWidth,
          cssHeight
        ) * 0.78

      );


    gradient.addColorStop(
      0,
      "#0a1225"
    );


    gradient.addColorStop(
      0.55,
      "#050812"
    );


    gradient.addColorStop(
      1,
      "#02040a"
    );


    ctx.fillStyle =
      gradient;


    ctx.fillRect(
      0,
      0,
      cssWidth,
      cssHeight
    );


    drawStarLayers();

  }


  /* =====================================
     ESTRELLAS
  ====================================== */

  function drawStarLayers() {

    for (
      const layer
      of STAR_LAYERS
    ) {

      let layerOpacity = 1;


      /*
       * Al alejarnos, el polvo estelar
       * se hace más visible.
       */

      if (
        layer.mode ===
        "dust"
      ) {

        layerOpacity =
          1 -
          smoothstep(
            0.65,
            3.2,
            camera.zoom
          ) *
          0.55;

      }


      /*
       * Las estrellas cercanas aparecen
       * progresivamente al acercarnos.
       */

      if (
        layer.mode ===
        "near"
      ) {

        layerOpacity =
          0.35 +
          smoothstep(
            0.28,
            1.40,
            camera.zoom
          ) *
          0.65;

      }


      drawStarLayer(
        layer,
        layerOpacity
      );

    }


    ctx.globalAlpha = 1;

  }


  function drawStarLayer(
    layer,
    opacity
  ) {

    /*
     * Transformamos la cámara a píxeles
     * y aplicamos el paralaje.
     */

    const projectedCameraX =
      camera.x *
      camera.zoom;


    const projectedCameraY =
      camera.y *
      camera.zoom;


    const offsetX =
      projectedCameraX *
      layer.parallax;


    const offsetY =
      projectedCameraY *
      layer.parallax;


    const tile =
      layer.tileSize;


    const minTileX =
      Math.floor(
        (
          offsetX -
          tile
        ) /
        tile
      );


    const maxTileX =
      Math.floor(
        (
          offsetX +
          cssWidth +
          tile
        ) /
        tile
      );


    const minTileY =
      Math.floor(
        (
          offsetY -
          tile
        ) /
        tile
      );


    const maxTileY =
      Math.floor(
        (
          offsetY +
          cssHeight +
          tile
        ) /
        tile
      );


    ctx.fillStyle =
      "#eef5ff";


    for (
      let tileY = minTileY;
      tileY <= maxTileY;
      tileY++
    ) {

      for (
        let tileX = minTileX;
        tileX <= maxTileX;
        tileX++
      ) {


        const tileLeft =
          tileX *
          tile -
          offsetX;


        const tileTop =
          tileY *
          tile -
          offsetY;


        for (
          let i = 0;
          i <
          layer.starsPerTile;
          i++
        ) {


          const randomX =
            hash32(
              tileX,
              tileY,
              i * 5 + 0,
              layer.seed
            );


          const randomY =
            hash32(
              tileX,
              tileY,
              i * 5 + 1,
              layer.seed
            );


          const randomSize =
            hash32(
              tileX,
              tileY,
              i * 5 + 2,
              layer.seed
            );


          const randomAlpha =
            hash32(
              tileX,
              tileY,
              i * 5 + 3,
              layer.seed
            );


          const randomBright =
            hash32(
              tileX,
              tileY,
              i * 5 + 4,
              layer.seed
            );


          const x =
            tileLeft +
            randomX *
            tile;


          const y =
            tileTop +
            randomY *
            tile;


          if (
            x < -6 ||
            y < -6 ||
            x >
            cssWidth + 6 ||
            y >
            cssHeight + 6
          ) {

            continue;

          }


          const radius =
            layer.minRadius +
            (
              layer.maxRadius -
              layer.minRadius
            ) *
            randomSize;


          const alpha =
            (
              layer.minAlpha +
              (
                layer.maxAlpha -
                layer.minAlpha
              ) *
              randomAlpha
            ) *
            opacity;


          const bright =
            randomBright >
            0.965;


          ctx.globalAlpha =
            alpha;


          ctx.beginPath();


          ctx.arc(
            x,
            y,

            bright
              ? radius * 1.25
              : radius,

            0,
            Math.PI * 2
          );


          ctx.fill();


          /*
           * Halo de algunas estrellas
           * especialmente brillantes.
           */

          if (
            bright
          ) {

            ctx.globalAlpha =
              alpha * 0.20;


            ctx.beginPath();


            ctx.arc(
              x,
              y,
              radius * 4.2,
              0,
              Math.PI * 2
            );


            ctx.fill();

          }

        }

      }

    }

  }


  /* =====================================
     RUTAS
  ====================================== */

  function drawRoutes() {

    if (
      camera.zoom <
      0.72
    ) {

      return;

    }


    ctx.save();


    ctx.lineWidth =
      1;


    ctx.setLineDash([
      5,
      7
    ]);


    ctx.strokeStyle =
      "rgba(122, 184, 255, 0.22)";


    for (
      const [
        fromId,
        toId
      ]
      of routes
    ) {

      const from =
        objectById.get(
          fromId
        );


      const to =
        objectById.get(
          toId
        );


      if (
        !from ||
        !to
      ) {

        continue;

      }


      const a =
        worldToScreen(
          from.x,
          from.y
        );


      const b =
        worldToScreen(
          to.x,
          to.y
        );


      ctx.beginPath();


      ctx.moveTo(
        a.x,
        a.y
      );


      ctx.lineTo(
        b.x,
        b.y
      );


      ctx.stroke();

    }


    ctx.restore();

  }


  /* =====================================
     ETIQUETAS
  ====================================== */

  function drawLabel(
    object,
    point,
    color
  ) {

    const fontSize =
      object.type === "galaxy"

        ? 15

        : object.type ===
          "system"

          ? 13
          : 12;


    const fontWeight =
      object.type ===
      "galaxy"

        ? 700
        : 600;


    const objectRadius =
      Math.max(

        8,

        object.size *
        camera.zoom *
        0.40

      );


    ctx.save();


    ctx.font =
      `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`;


    ctx.textAlign =
      "center";


    ctx.textBaseline =
      "top";


    ctx.fillStyle =
      color;


    ctx.fillText(

      object.name,

      point.x,

      point.y +
      objectRadius +
      7

    );


    ctx.restore();

  }


  /* =====================================
     GALAXIAS
  ====================================== */

  function drawGalaxy(
    object,
    point
  ) {

    const radius =
      Math.max(

        16,

        object.size *
        camera.zoom *
        0.42

      );


    const gradient =
      ctx.createRadialGradient(

        point.x,
        point.y,

        0,

        point.x,
        point.y,

        radius

      );


    gradient.addColorStop(
      0,
      "rgba(255,255,255,0.90)"
    );


    gradient.addColorStop(
      0.08,
      "rgba(204,181,255,0.90)"
    );


    gradient.addColorStop(
      0.35,
      "rgba(144,108,255,0.33)"
    );


    gradient.addColorStop(
      1,
      "rgba(87,66,142,0)"
    );


    ctx.fillStyle =
      gradient;


    ctx.beginPath();


    ctx.ellipse(

      point.x,
      point.y,

      radius,

      radius * 0.52,

      -0.25,

      0,

      Math.PI * 2

    );


    ctx.fill();


    ctx.strokeStyle =
      "rgba(190,157,255,0.24)";


    ctx.lineWidth =
      1;


    for (
      let i = 0;
      i < 3;
      i++
    ) {

      ctx.beginPath();


      ctx.ellipse(

        point.x,
        point.y,

        radius *
        (
          0.45 +
          i * 0.18
        ),

        radius *
        (
          0.17 +
          i * 0.08
        ),

        -0.25 +
        i * 0.08,

        0,

        Math.PI * 2

      );


      ctx.stroke();

    }


    drawLabel(
      object,
      point,
      "#e7dcff"
    );

  }


  /* =====================================
     SISTEMAS
  ====================================== */

  function drawSystem(
    object,
    point
  ) {

    const radius =
      Math.max(

        3.5,

        Math.min(

          10,

          object.size *
          camera.zoom *
          0.16

        )

      );


    const glow =
      ctx.createRadialGradient(

        point.x,
        point.y,

        0,

        point.x,
        point.y,

        radius * 4

      );


    glow.addColorStop(
      0,
      "rgba(255,255,255,0.95)"
    );


    glow.addColorStop(
      0.18,
      "rgba(122,184,255,0.85)"
    );


    glow.addColorStop(
      1,
      "rgba(122,184,255,0)"
    );


    ctx.fillStyle =
      glow;


    ctx.beginPath();


    ctx.arc(

      point.x,
      point.y,

      radius * 4,

      0,
      Math.PI * 2

    );


    ctx.fill();


    ctx.fillStyle =
      "#edf7ff";


    ctx.beginPath();


    ctx.arc(

      point.x,
      point.y,

      radius,

      0,
      Math.PI * 2

    );


    ctx.fill();


    drawLabel(
      object,
      point,
      "#cfe7ff"
    );

  }


  /* =====================================
     MUNDOS
  ====================================== */

  function drawWorld(
    object,
    point
  ) {

    const radius =
      Math.max(

        3.6,

        Math.min(

          11,

          object.size *
          camera.zoom *
          0.35

        )

      );


    const gradient =
      ctx.createRadialGradient(

        point.x -
        radius * 0.35,

        point.y -
        radius * 0.35,

        0,

        point.x,
        point.y,

        radius

      );


    gradient.addColorStop(
      0,
      "#fff5c9"
    );


    gradient.addColorStop(
      0.45,
      "#e6b85d"
    );


    gradient.addColorStop(
      1,
      "#6d4921"
    );


    ctx.fillStyle =
      gradient;


    ctx.beginPath();


    ctx.arc(

      point.x,
      point.y,

      radius,

      0,
      Math.PI * 2

    );


    ctx.fill();


    ctx.strokeStyle =
      "rgba(255,230,165,0.35)";


    ctx.lineWidth =
      1;


    ctx.beginPath();


    ctx.ellipse(

      point.x,
      point.y,

      radius * 1.45,

      radius * 0.35,

      -0.25,

      0,

      Math.PI * 2

    );


    ctx.stroke();


    drawLabel(
      object,
      point,
      "#ffe9ad"
    );

  }


  /* =====================================
     SELECCIÓN
  ====================================== */

  function drawSelection(
    object
  ) {

    if (
      !object ||
      !isObjectVisible(
        object
      )
    ) {

      return;

    }


    const point =
      worldToScreen(
        object.x,
        object.y
      );


    const radius =

      object.type ===
      "galaxy"

        ?

        Math.max(
          22,
          object.size *
          camera.zoom *
          0.50
        )

        :

        object.type ===
        "system"

          ? 16

          : 15;


    ctx.save();


    ctx.strokeStyle =
      "rgba(255,255,255,0.82)";


    ctx.lineWidth =
      1.5;


    ctx.setLineDash([
      4,
      5
    ]);


    ctx.beginPath();


    ctx.arc(

      point.x,
      point.y,

      radius,

      0,
      Math.PI * 2

    );


    ctx.stroke();


    ctx.restore();

  }


  /* =====================================
     OBJETOS
  ====================================== */

  function drawObjects() {

    for (
      const type
      of [
        "galaxy",
        "system",
        "world"
      ]
    ) {

      for (
        const object
        of objects
      ) {


        if (
          object.type !== type ||
          !isObjectVisible(
            object
          )
        ) {

          continue;

        }


        const point =
          worldToScreen(
            object.x,
            object.y
          );


        /*
         * No dibujamos objetos muy lejos
         * de la pantalla.
         */

        if (

          point.x < -260 ||

          point.y < -180 ||

          point.x >
          cssWidth + 260 ||

          point.y >
          cssHeight + 180

        ) {

          continue;

        }


        if (
          type ===
          "galaxy"
        ) {

          drawGalaxy(
            object,
            point
          );

        }


        if (
          type ===
          "system"
        ) {

          drawSystem(
            object,
            point
          );

        }


        if (
          type ===
          "world"
        ) {

          drawWorld(
            object,
            point
          );

        }

      }

    }

  }


  /* =====================================
     RENDER GENERAL
  ====================================== */

  function draw() {

    drawSpaceBackground();

    drawRoutes();

    drawObjects();

    drawSelection(
      selectedObject
    );


    zoomLabel.textContent =
      `Zoom ${
        Math.round(
          camera.zoom * 100
        )
      }%`;

  }


  /* =====================================
     DETECCIÓN DE CLICK
  ====================================== */

  function pickObject(
    screenX,
    screenY
  ) {

    let bestObject = null;

    let bestDistance =
      Infinity;


    for (
      const object
      of objects
    ) {


      if (
        !isObjectVisible(
          object
        )
      ) {

        continue;

      }


      const point =
        worldToScreen(
          object.x,
          object.y
        );


      const distance =
        Math.hypot(

          screenX -
          point.x,

          screenY -
          point.y

        );


      const hitRadius =

        object.type ===
        "galaxy"

          ?

          Math.max(

            22,

            Math.min(

              55,

              object.size *
              camera.zoom *
              0.32

            )

          )

          :

          object.type ===
          "system"

            ? 18

            : 17;


      if (

        distance <=
        hitRadius

        &&

        distance <
        bestDistance

      ) {

        bestObject =
          object;


        bestDistance =
          distance;

      }

    }


    return bestObject;

  }


  /* =====================================
     PANEL
  ====================================== */

  function selectObject(
    object,
    openPanel = true
  ) {

    selectedObject =
      object;


    if (
      !object
    ) {

      panel.classList.remove(
        "is-open"
      );


      draw();


      return;

    }


    panelType.textContent =

      object.type ===
      "galaxy"

        ? "Galaxia"

        :

        object.type ===
        "system"

          ? "Sistema"

          : "Mundo";


    panelTitle.textContent =
      object.name;


    panelSubtitle.textContent =
      object.subtitle || "";


    panelDescription.textContent =
      object.description ||
      "Sin descripción.";


    panelCoordinates.textContent =
      `${Math.round(object.x)}, ${Math.round(object.y)}`;


    panelScale.textContent =

      object.type ===
      "galaxy"

        ? "Galáctica"

        :

        object.type ===
        "system"

          ? "Estelar"

          : "Planetaria";


    panelLink.hidden =
      !object.url;


    if (
      object.url
    ) {

      panelLink.href =
        object.url;

    }


    if (
      openPanel
    ) {

      panel.classList.add(
        "is-open"
      );

    }


    draw();

  }


  /* =====================================
     ANIMACIÓN DE CÁMARA
  ====================================== */

  function animateTo(
    x,
    y,
    zoom
  ) {

    if (
      animationFrame
    ) {

      cancelAnimationFrame(
        animationFrame
      );

    }


    const startTime =
      performance.now();


    const duration =
      420;


    const startX =
      camera.x;


    const startY =
      camera.y;


    const startZoom =
      camera.zoom;


    const targetZoom =
      clampZoom(
        zoom
      );


    const easeOutCubic =
      value =>

        1 -
        Math.pow(
          1 - value,
          3
        );


    function frame(
      now
    ) {

      const progress =
        Math.min(

          1,

          (
            now -
            startTime
          ) /
          duration

        );


      const eased =
        easeOutCubic(
          progress
        );


      camera.x =
        startX +
        (
          x -
          startX
        ) *
        eased;


      camera.y =
        startY +
        (
          y -
          startY
        ) *
        eased;


      camera.zoom =
        startZoom +
        (
          targetZoom -
          startZoom
        ) *
        eased;


      draw();


      if (
        progress < 1
      ) {

        animationFrame =
          requestAnimationFrame(
            frame
          );

      }

      else {

        animationFrame =
          null;

      }

    }


    animationFrame =
      requestAnimationFrame(
        frame
      );

  }


  /* =====================================
     ZOOM
  ====================================== */

  function zoomAt(
    screenX,
    screenY,
    factor
  ) {

    const before =
      screenToWorld(
        screenX,
        screenY
      );


    const nextZoom =
      clampZoom(

        camera.zoom *
        factor

      );


    if (
      nextZoom ===
      camera.zoom
    ) {

      return;

    }


    camera.zoom =
      nextZoom;


    const after =
      screenToWorld(
        screenX,
        screenY
      );


    camera.x +=
      before.x -
      after.x;


    camera.y +=
      before.y -
      after.y;


    draw();

  }


  function resetView() {

    selectObject(
      null
    );


    animateTo(

      initialCamera.x ?? 0,

      initialCamera.y ?? 0,

      initialCamera.zoom ?? 0.55

    );

  }


  /* =====================================
     RUEDA DEL RATÓN
  ====================================== */

  canvas.addEventListener(

    "wheel",

    event => {

      event.preventDefault();


      const rect =
        canvas.getBoundingClientRect();


      const factor =
        Math.exp(
          -event.deltaY *
          0.0012
        );


      zoomAt(

        event.clientX -
        rect.left,

        event.clientY -
        rect.top,

        factor

      );

    },

    {
      passive: false
    }

  );


  /* =====================================
     ARRASTRAR / TÁCTIL
  ====================================== */

  canvas.addEventListener(

    "pointerdown",

    event => {


      canvas.setPointerCapture(
        event.pointerId
      );


      pointers.set(

        event.pointerId,

        {
          x: event.clientX,
          y: event.clientY
        }

      );


      if (
        pointers.size === 1
      ) {


        dragging = true;

        pointerMoved = false;


        canvas.classList.add(
          "is-dragging"
        );


        dragStart = {

          x:
            event.clientX,

          y:
            event.clientY,

          cameraX:
            camera.x,

          cameraY:
            camera.y

        };

      }


      else if (
        pointers.size === 2
      ) {


        const points =
          [
            ...pointers.values()
          ];


        const dx =
          points[0].x -
          points[1].x;


        const dy =
          points[0].y -
          points[1].y;


        pinchStart = {

          distance:
            Math.max(

              10,

              Math.hypot(
                dx,
                dy
              )

            ),

          zoom:
            camera.zoom

        };


        dragging =
          false;

      }

    }

  );


  canvas.addEventListener(

    "pointermove",

    event => {


      if (
        !pointers.has(
          event.pointerId
        )
      ) {

        return;

      }


      pointers.set(

        event.pointerId,

        {
          x:
            event.clientX,

          y:
            event.clientY
        }

      );


      /* =============================
         PINCH ZOOM
      ============================== */

      if (
        pointers.size === 2 &&
        pinchStart
      ) {


        const points =
          [
            ...pointers.values()
          ];


        const dx =
          points[0].x -
          points[1].x;


        const dy =
          points[0].y -
          points[1].y;


        const distance =
          Math.max(

            10,

            Math.hypot(
              dx,
              dy
            )

          );


        const rect =
          canvas.getBoundingClientRect();


        const middleX =

          (
            points[0].x +
            points[1].x
          ) /
          2 -
          rect.left;


        const middleY =

          (
            points[0].y +
            points[1].y
          ) /
          2 -
          rect.top;


        const before =
          screenToWorld(
            middleX,
            middleY
          );


        camera.zoom =
          clampZoom(

            pinchStart.zoom *

            (
              distance /
              pinchStart.distance
            )

          );


        const after =
          screenToWorld(
            middleX,
            middleY
          );


        camera.x +=
          before.x -
          after.x;


        camera.y +=
          before.y -
          after.y;


        pointerMoved =
          true;


        draw();


        return;

      }


      /* =============================
         ARRASTRAR
      ============================== */

      if (
        !dragging ||
        !dragStart
      ) {

        return;

      }


      const deltaX =
        event.clientX -
        dragStart.x;


      const deltaY =
        event.clientY -
        dragStart.y;


      if (
        Math.hypot(
          deltaX,
          deltaY
        ) >
        3
      ) {

        pointerMoved =
          true;

      }


      camera.x =

        dragStart.cameraX -

        deltaX /
        camera.zoom;


      camera.y =

        dragStart.cameraY -

        deltaY /
        camera.zoom;


      draw();

    }

  );


  function finishPointer(
    event
  ) {

    pointers.delete(
      event.pointerId
    );


    if (
      pointers.size < 2
    ) {

      pinchStart =
        null;

    }


    if (
      pointers.size === 0
    ) {

      dragging =
        false;


      dragStart =
        null;


      canvas.classList.remove(
        "is-dragging"
      );

    }

  }


 canvas.addEventListener(
  "pointerup",

  event => {

    const rect =
      canvas.getBoundingClientRect();


    const screenX =
      event.clientX -
      rect.left;


    const screenY =
      event.clientY -
      rect.top;


    /*
     * Solo consideramos que ha sido un clic
     * si el usuario no estaba arrastrando.
     */
    if (
      !pointerMoved &&
      pointers.size === 1
    ) {

      /* =====================================
         COORDENADAS DEL UNIVERSO
      ====================================== */

      const worldPosition =
        screenToWorld(
          screenX,
          screenY
        );


      console.log(
        `Coordenadas → x: ${worldPosition.x.toFixed(2)}, y: ${worldPosition.y.toFixed(2)}`
      );


      /*
       * Comprobamos si además hemos pulsado
       * sobre una galaxia, sistema o mundo.
       */
      const object =
        pickObject(
          screenX,
          screenY
        );


      if (object) {

        selectObject(
          object
        );

      }

    }


    finishPointer(
      event
    );

  }
);


  /* =====================================
     DOBLE CLICK
  ====================================== */

  canvas.addEventListener(

    "dblclick",

    event => {


      const rect =
        canvas.getBoundingClientRect();


      zoomAt(

        event.clientX -
        rect.left,

        event.clientY -
        rect.top,

        1.8

      );

    }

  );


  /* =====================================
     BOTONES
  ====================================== */

  document
    .getElementById(
      "zoom-in"
    )
    .addEventListener(

      "click",

      () => {

        zoomAt(

          cssWidth / 2,

          cssHeight / 2,

          1.45

        );

      }

    );


  document
    .getElementById(
      "zoom-out"
    )
    .addEventListener(

      "click",

      () => {

        zoomAt(

          cssWidth / 2,

          cssHeight / 2,

          1 / 1.45

        );

      }

    );


  document
    .getElementById(
      "reset-view"
    )
    .addEventListener(

      "click",

      resetView

    );


  document
    .getElementById(
      "info-close"
    )
    .addEventListener(

      "click",

      () => {

        panel.classList.remove(
          "is-open"
        );

      }

    );


  /* =====================================
     BUSCADOR
  ====================================== */

  searchForm.addEventListener(

    "submit",

    event => {


      event.preventDefault();


      const query =
        searchInput
          .value
          .trim()
          .toLocaleLowerCase(
            "es"
          );


      if (
        !query
      ) {

        return;

      }


      const exactMatch =
        objects.find(

          object =>

            object.name
              .toLocaleLowerCase(
                "es"
              ) ===
            query

        );


      const partialMatch =
        objects.find(

          object =>

            object.name
              .toLocaleLowerCase(
                "es"
              )
              .includes(
                query
              )

        );


      const object =
        exactMatch ||
        partialMatch;


      if (
        !object
      ) {


        searchInput
          .setCustomValidity(
            "No se ha encontrado ese lugar."
          );


        searchInput
          .reportValidity();


        window.setTimeout(

          () =>
            searchInput
              .setCustomValidity(
                ""
              ),

          1200

        );


        return;

      }


      selectObject(
        object
      );


      const targetZoom =

        object.type ===
        "galaxy"

          ? 0.78

          :

          object.type ===
          "system"

            ? 2.1

            : 4.2;


      animateTo(

        object.x,

        object.y,

        targetZoom

      );

    }

  );


  /* =====================================
     RESIZE
  ====================================== */

  if (
    "ResizeObserver"
    in window
  ) {

    new ResizeObserver(
      resizeCanvas
    ).observe(
      canvas
    );

  }

  else {

    window.addEventListener(
      "resize",
      resizeCanvas
    );

  }


  /* =====================================
     INICIALIZACIÓN
  ====================================== */

  resizeCanvas();


})();
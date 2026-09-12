 const configuracion = {
      1: { texto: "Muy fácil", icono: "https://genesistoxical.com/wp-content/uploads/2021/05/Dibujo_de_calavera_animada_png.png" },
      2: { texto: "Fácil", icono: "https://genesistoxical.com/wp-content/uploads/2021/05/Calavera_con_huesos_cruzados_png.png" },
      3: { texto: "Medio", icono: "https://cdn.creazilla.com/cliparts/38354/skull-clipart-xl.png" },
      4: { texto: "Alto", icono: "https://marketplace.canva.com/qEZpA/MAHN2PqEZpA/1/tl/canva-illustration-of-a-white-skull-MAHN2PqEZpA.png" },
      5: { texto: "Muy alto", icono: "https://stickerapp.es/cdn-assets/images/preview/2015/09/19/design-4968/template-sticker-300x300.png" },
      6: { texto: "Difícil", icono: "https://static.vecteezy.com/system/resources/thumbnails/054/984/062/small/detailed-illustration-of-a-skull-and-crossbones-symbolizing-danger-piracy-and-rebellion-commonly-associated-with-warning-signs-png.png" },
      7: { texto: "Extremo", icono: "https://cdn.pixabay.com/photo/2025/10/21/08/43/drawing-9907092_640.png" },
      8: { texto: "Imposible", icono: "https://cdn.pixabay.com/photo/2025/09/16/09/08/scull-9837501_1280.png" }
    };

    function actualizarDificultad(nivel) {
      const segmentos = document.querySelectorAll('.segmento');
      const texto = document.getElementById('texto-dificultad');
      const img = document.getElementById('icono-dificultad');

      // Colores: 1-3 Verde, 4-6 Amarillo, 7-8 Rojo
      let color = nivel <= 3 ? '#2ecc71' : (nivel <= 6 ? '#f1c40f' : '#e74c3c');

      segmentos.forEach((seg, index) => {
        seg.style.background = index < nivel ? color : '#333';
      });

      texto.innerText = configuracion[nivel].texto;
      texto.style.color = color;
      img.src = configuracion[nivel].icono;
    }

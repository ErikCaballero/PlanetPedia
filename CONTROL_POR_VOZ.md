# PlanetPedia — Control por voz V2

El controlador principal está en:

`components/voiceController.js`

Se carga en las páginas HTML del proyecto y centraliza navegación, búsqueda, lectura y opciones de voz.

## Comandos principales

### Navegación
- `Inicio`
- `Ve a planetas`
- `Ve a especies`
- `Ve a línea temporal`
- `Ve a juegos`

### Especies y planetas
Los nombres se leen automáticamente de las tarjetas de `Web/Especies.html` y `Web/Planetas.html`.
No necesitas mantener una lista manual.

Ejemplos:
- `Bazofios`
- `Buscar Bazofios`
- `Buscar especie Albirions`
- `Abre Kalagor`
- `Abre planeta Ultra Prime`
- `Lista las especies`
- `Lista los planetas`

La V2 prueba hasta 8 alternativas devueltas por el reconocimiento de voz y usa coincidencia aproximada, singular/plural y una normalización fonética española. Esto permite que transcripciones como `bazofi`, `bazofio` o pequeñas variaciones puedan resolverse como `Bazofios` si la coincidencia es suficientemente clara.

## Lector de página

Comandos:
- `Lee la página`
- `Pausa lectura`
- `Reanuda lectura`
- `Para la lectura`
- `Repite`
- `Lee más despacio`
- `Lee más rápido`
- `Velocidad normal`

También existe un panel ⚙️ con botones de lectura.

El lector recorre títulos, párrafos, listas, pies de imagen y citas. Evita el header, controles del asistente y elementos ocultos. El bloque que se está leyendo queda resaltado y se desplaza al centro de la pantalla.

## Idiomas

Solo se muestran tres idiomas de lectura:
- Español (`es-ES`)
- English (`en-US`)
- Українська (`uk-UA`)

En cada idioma el selector de voz muestra únicamente las voces compatibles instaladas/disponibles en el navegador o sistema del usuario.

Las preferencias se guardan en `localStorage`: idioma, voz, velocidad, tono y volumen.

## Traducción automática

- Español: lee directamente el contenido de la página.
- Inglés y ucraniano: intenta traducir cada bloque antes de leerlo mediante la API `Translator` integrada del navegador.
- Los nombres de especies y planetas se protegen mediante marcadores para intentar conservarlos tal cual durante la traducción.

### Importante
La API `Translator` es experimental y no está disponible en todos los navegadores. Además, funciona en contexto seguro (HTTPS) y el navegador puede necesitar descargar su modelo de traducción. Si no está disponible, PlanetPedia muestra un aviso y no inventa ni simula una traducción.

Para probar la traducción, es preferible publicar la web por HTTPS (por ejemplo GitHub Pages) y usar una versión reciente de un navegador compatible.

## Añadir nuevas secciones

Al principio de `components/voiceController.js` está la constante `sections`:

```js
const sections = [
    { names: ['inicio', 'menu'], path: 'index.html' },
    // ...
];
```

Puedes añadir una sección así:

```js
{ names: ['naves', 'vehiculos', 'vehículos'], path: 'Web/Naves.html' },
```

## Añadir especies o planetas

No edites el controlador. Añade una tarjeta normal en el catálogo correspondiente.

Ejemplo de especie:

```html
<a href="razas/NuevaEspecie.html" class="species-card">
    <h2>Nueva Especie</h2>
</a>
```

Ejemplo de planeta:

```html
<a href="planetas/NuevoPlaneta.html" class="planet-card">
    <h2>Nuevo Planeta</h2>
</a>
```

El controlador los detectará automáticamente.

## API desde JavaScript

Disponible en `window.PlanetPediaVoice`:

```js
PlanetPediaVoice.listen();
PlanetPediaVoice.execute('buscar Bazofios');
PlanetPediaVoice.readPage();
PlanetPediaVoice.pauseReading();
PlanetPediaVoice.stopReading();
```

## Cambios V3

- `Busca X`: escribe **X** en el buscador de `Web/Especies.html`, selecciona "Todas las categorías" y aplica el filtro. Si el comando se dice desde otra página, PlanetPedia abre Especies y conserva la búsqueda.
- `Abre simulación`: abre `Web/juegos/CardGameA/CardGameA.html`.
- `Abre grupos`: abre `Web/juegos/Gruposgame/gruposgame.html`.
- `Abre parejas`: abre `Web/juegos/Parejas/Razasparejas.html`.
- `Ve a grupos` sigue disponible para navegar a la sección general de grupos/facciones; `Abre grupos` se reserva para el minijuego.

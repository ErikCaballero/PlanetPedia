# PlanetPedia — Control por voz V4

El controlador principal está en:

`components/voiceController.js`

El buscador y el controlador de voz comparten el índice automático:

`components/search-index.js`

Ese índice se genera leyendo los HTML reales del proyecto. Por tanto, ya no necesitas escribir manualmente en JavaScript la ruta de cada página nueva.

## Actualizar PlanetPedia

Después de crear, mover o renombrar una página HTML ejecuta desde la raíz del proyecto:

```bash
python herramientas/actualizar_planetpedia.py
```

También sigue funcionando el nombre anterior:

```bash
python herramientas/generar_buscador.py
```

El actualizador:

1. Recorre las páginas HTML.
2. Extrae su título, categoría, texto, imagen y aliases de voz.
3. Regenera `components/search-index.js`.
4. Inserta automáticamente `search.js` y `voiceController.js` en cada página real con la ruta relativa correcta.

La operación es idempotente: puedes ejecutarla varias veces y no duplica los `<script>`.

## Añadir una página nueva

Por ejemplo, si creas:

`Web/Idiomas.html`

con un título normal:

```html
<title>Idiomas - Planet Pedia</title>
```

o un encabezado:

```html
<h1>Idiomas</h1>
```

tras ejecutar el actualizador quedará disponible automáticamente en el buscador y en el controlador de voz.

Podrás decir:

- `Abre Idiomas`
- `Ve a Idiomas`
- `Idiomas`

No necesitas editar `voiceController.js`.

## Aliases de voz opcionales

Si el nombre de una página es difícil de reconocer o quieres permitir nombres alternativos, añade en su `<head>`:

```html
<meta name="voice-aliases" content="lenguas, sección de idiomas, languages">
```

Después de ejecutar el actualizador, todas estas órdenes pueden resolver a la misma página:

- `Abre Idiomas`
- `Abre Lenguas`
- `Abre sección de idiomas`
- `Abre Languages`

Los aliases se separan con coma, punto y coma o `|`.

## Coincidencia aproximada

El Voice Controller normaliza mayúsculas, tildes y pequeñas variaciones y utiliza coincidencia aproximada/fonética. Esto ayuda cuando el reconocimiento de voz transcribe un nombre de forma ligeramente distinta.

Las páginas nuevas se consultan desde el índice global. Las constantes manuales del principio de `voiceController.js` quedan únicamente para aliases especiales de navegación, por ejemplo `home`, `razas` o `facciones`.

## Comandos principales

### Navegación automática

- `Abre Kalagor`
- `Abre Krag Voss`
- `Ve a línea temporal`
- `Abre <título de cualquier página indexada>`

### Especies y planetas

Los comandos específicos siguen disponibles:

- `Abre especie Bazofios`
- `Abre planeta Ultra Prime`
- `Lista las especies`
- `Lista los planetas`

### Juegos

- `Abre simulación`
- `Abre grupos`
- `Abre parejas`

`Ve a grupos` sigue navegando a la sección general de grupos/facciones.

### Búsqueda de especies existente

- `Busca X`

Este comando mantiene el comportamiento actual: abre/filtra `Web/Especies.html` con el texto indicado.

### Lectura

- `Lee la página`
- `Pausa lectura`
- `Reanuda lectura`
- `Para la lectura`
- `Repite`
- `Lee más despacio`
- `Lee más rápido`
- `Velocidad normal`

## Idiomas de lectura

- Español (`es-ES`)
- English (`en-US`)
- Українська (`uk-UA`)

Las preferencias se guardan en `localStorage`. Para inglés y ucraniano se intenta usar la API `Translator` del navegador cuando está disponible.

## API desde JavaScript

Disponible en `window.PlanetPediaVoice`:

```js
PlanetPediaVoice.listen();
PlanetPediaVoice.execute('abre Kalagor');
PlanetPediaVoice.loadPageIndex();
PlanetPediaVoice.readPage();
PlanetPediaVoice.pauseReading();
PlanetPediaVoice.stopReading();
```

`loadPageIndex()` devuelve las páginas que el Voice Controller ha cargado desde el índice automático.

## Búsqueda por voz contextual

El comando `Busca X` cambia de comportamiento según la página actual:

- En `Web/Especies.html`, filtra el buscador interno de especies sin salir de la página.
- En cualquier otra página, abre el buscador global de PlanetPedia (el mismo de `Ctrl/Cmd + K`) y busca `X` allí.

Los comandos de apertura directa, como `Abre Foxers` o `Abre Kalagor`, siguen funcionando de forma independiente.

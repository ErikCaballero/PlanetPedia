# Multiverso de PlanetPedia

Las realidades alternativas nacen cuando **un acontecimiento importante de la historia ocurre de otra manera**. Cada universo se trata como una historia propia: una ficha con imagen, datos generales, una pequeña explicación de su divergencia y **capítulos narrativos**. No es necesario asignar una fecha, especificar un año o mantener una cronología.

El universo principal solo aparece como referencia **en la primera sección de diferencias**. El resto de cada página habla exclusivamente de la realidad que estás leyendo.

## Archivos

- `Web/Multiverso.html`: selector con búsqueda, filtros, número, nombre y descripción.
- `Web/universos/universos.json`: fuente de contenido de cada universo.
- `Web/universos/catalogo.js`: catálogo para el selector (generado automáticamente).
- `Web/universos/<slug>.html`: páginas HTML individuales (generadas automáticamente).
- `Web/universos/articulo.css`: diseño narrativo inspirado en las fichas de especies alienígenas.
- `Web/universos/estilos.css`: estilos generales del selector.
- `Web/universos/selector.js`: lógica del catálogo y filtros.
- `herramientas/generar_universos.py`: generador sin dependencias externas.

## Cómo crear otro universo

Desde la raíz de PlanetPedia:

```bash
python herramientas/generar_universos.py --nuevo \
  --nombre "La última alianza" \
  --descripcion "Un pacto inesperado cambia el futuro de varios planetas." \
  --evento "Las facciones enfrentadas no logran ponerse de acuerdo." \
  --cambio "Las facciones firman un pacto para proteger los planetas." \
  --impacto "Las relaciones entre civilizaciones se transforman y crece la cooperación." \
  --categoria "Política"
```

El generador asigna un **número automático**, crea la página en `Web/universos/` e incluye el nuevo universo en el selector. **No solicita ni genera fechas**. Opcionalmente puedes añadir `--historia "..."` para escribir el primer párrafo narrativo, `--territorio "..."`, `--poder "..."`, `--conflicto "..."` y `--imagen "ruta/desde/la/raíz.webp"` para adaptar la ficha inicial; también `--numero 004` si necesitas elegir el número.

## Escribir la historia

Abre `Web/universos/universos.json` y modifica los datos del nuevo universo:

- `numero`, `slug`, `nombre`, `categoria`, `descripcion`, `etiqueta`, `imagen`: datos e imagen del selector.
- `evento_original`, `divergencia`: **únicas referencias** al universo principal, en la comparación inicial.
- `resumen`, `territorio`, `poder`, `conflicto`: presentación y ficha de la realidad alternativa.
- `historia`: una lista de capítulos, **sin fechas**. Cada capítulo contiene `titulo` y `parrafos` (lista de textos). Opcionalmente `imagen` y `pie` para acompañar el capítulo con una foto ya existente del proyecto.

Ejemplo de capítulo:

```json
{
  "titulo": "La vida en los mundos libres",
  "parrafos": [
    "Las colonias se organizan para proteger sus rutas de comercio.",
    "Sus acuerdos dan origen a nuevas alianzas y disputas."
  ],
  "imagen": "Planetas/Kalagor/Kalagor.webp",
  "pie": "Un planeta de esta realidad."
}
```

Después de editar la historia, regenera las páginas y el catálogo:

```bash
python herramientas/generar_universos.py
python herramientas/generar_buscador.py
```

**No edites directamente las páginas HTML generadas ni `catalogo.js`**, porque se sobrescriben. Escribe los capítulos en `universos.json`.

La página web es estática: no puede decidir por sí sola cuándo un cambio del lore merece un universo nuevo. El autor registra la divergencia mediante `--nuevo`, y la página, el número y el selector se actualizan automáticamente.

Para visualizar el proyecto con navegación común y buscador, desde la carpeta raíz ejecuta `python -m http.server 8000` y abre `http://localhost:8000`.

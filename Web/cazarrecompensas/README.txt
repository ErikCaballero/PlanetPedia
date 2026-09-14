PLANET PEDIA — CAZARRECOMPENSAS (VERSIÓN JSON)
================================================

DÓNDE AÑADIR LOS DATOS
----------------------
1. Personajes:
   datos/cazarrecompensas.json

2. Contratos:
   datos/contratos.json

3. Imágenes:
   img/cazarrecompensas/

También tienes dos plantillas para copiar campos:
- datos/PLANTILLA_CAZARRECOMPENSAS.json
- datos/PLANTILLA_CONTRATOS.json

RELACIÓN ENTRE PERSONAJE Y CONTRATO
-----------------------------------
Cada personaje tiene un "id", por ejemplo:
  "id": "boba-fett"

Cada contrato de ese personaje debe usar exactamente ese mismo valor:
  "cazarrecompensas": "boba-fett"

La web calcula automáticamente contratos totales, completados, fallidos,
aceptados, tasa de éxito y créditos de contratos completados.

IMPORTANTE: CÓMO ABRIR LA WEB
-----------------------------
Los JSON se cargan con fetch(). Muchos navegadores bloquean fetch si abres
Cazarrecompensas.html con doble clic (file://).

Usa un servidor local. Por ejemplo, desde esta carpeta:

  python -m http.server 8000

Y abre en el navegador:
  http://localhost:8000/Cazarrecompensas.html

También puedes usar Live Server en VS Code.

REGLAS JSON
-----------
- Usa comillas dobles.
- Separa cada objeto con coma.
- No pongas coma después del último objeto de una lista.
- Los números como recompensa pueden ir sin comillas.
- Si no conoces un dato, puedes dejar "" o [] según el campo.

IMPORTANTE SOBRE LOS CONTRATOS
------------------------------
El valor "cazarrecompensas" de cada contrato debe coincidir EXACTAMENTE con el campo "id" de un registro en datos/cazarrecompensas.json.
En el archivo incluido actualmente hay contratos de ejemplo con IDs como "boba-fett", "nyra-vex" y "drogg-kalan", mientras que tus cazadores actuales usan IDs como "orbus-zot" y "klarsus-morg". Esos contratos de ejemplo no se asignarán a tus cazadores hasta que cambies esos IDs.

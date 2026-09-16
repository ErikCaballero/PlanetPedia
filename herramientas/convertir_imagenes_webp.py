from pathlib import Path
from PIL import Image, ImageOps
import os
import re

# La raíz del proyecto es la carpeta superior a /herramientas/
PROJECT_ROOT = Path(__file__).resolve().parent.parent

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
TEXT_EXTENSIONS = {".html", ".htm", ".css", ".js"}

converted = {}

print("=== PlanetPedia - Conversor a WebP ===\n")


# =========================================================
# 1. CONVERTIR PNG / JPG / JPEG A WEBP
# =========================================================

for src in PROJECT_ROOT.rglob("*"):

    if not src.is_file():
        continue

    if src.suffix.lower() not in IMAGE_EXTENSIONS:
        continue

    dst = src.with_suffix(".webp")

    try:
        with Image.open(src) as image:

            # Corrige automáticamente la orientación de fotografías
            image = ImageOps.exif_transpose(image)

            # Mantener transparencia de PNG
            if (
                image.mode in ("RGBA", "LA")
                or "transparency" in image.info
            ):
                image = image.convert("RGBA")
            else:
                image = image.convert("RGB")

            # Crear WebP
            image.save(
                dst,
                "WEBP",
                quality=82,
                method=4
            )

        converted[src.resolve()] = dst.resolve()

        print(
            f"[CONVERTIDA] "
            f"{src.relative_to(PROJECT_ROOT)} "
            f"-> {dst.name}"
        )

    except Exception as error:
        print(f"[ERROR] {src}: {error}")


# =========================================================
# 2. ACTUALIZAR RUTAS EN HTML / CSS / JS
# =========================================================
#
# Antes se intentaba extraer la ruta con una expresión regular que
# prohibía espacios. Por eso una ruta como:
#
#   ../../Especies alienigenas/Los Foxers/Los Foxers.png
#
# se cortaba y no se podía resolver correctamente.
#
# Además, solo se actualizaban referencias de imágenes convertidas en
# ESA ejecución. Si el .webp ya existía y el .png/.jpg había sido
# eliminado anteriormente, la referencia se quedaba sin modificar.
#
# La solución es tomar como fuente de verdad todos los .webp que existen
# en el proyecto y generar, para cada archivo de texto, las rutas locales
# equivalentes que podrían seguir terminando en .png/.jpg/.jpeg.


def relative_url(from_file: Path, target: Path) -> str:
    """Devuelve una ruta relativa con '/' aunque el script se ejecute en Windows."""
    return os.path.relpath(target, from_file.parent).replace(os.sep, "/")


def encoded_variant(path: str) -> str:
    """Contempla el caso habitual de espacios escritos como %20."""
    # No usamos quote() sobre toda la ruta: algunos ZIP antiguos pueden
    # contener nombres con bytes no UTF-8 representados mediante
    # surrogateescape. Sustituir únicamente espacios es suficiente para
    # las rutas web del proyecto y evita que un nombre así detenga todo.
    return path.replace(" ", "%20")


def update_image_references(text: str, file: Path, webp_files):
    """
    Cambia referencias locales .png/.jpg/.jpeg a .webp SOLO cuando el
    .webp correspondiente existe realmente.

    Funciona con:
      - nombres de archivo y carpetas con espacios;
      - rutas relativas (../../...);
      - rutas que empiezan por '/';
      - rutas con espacios codificados como %20;
      - HTML, CSS y cadenas de JavaScript;
      - query strings o hashes, porque solo sustituye la ruta/extensión.
    """
    replacements = {}

    for webp in webp_files:
        relative_webp = relative_url(file, webp)
        root_webp = "/" + webp.relative_to(PROJECT_ROOT).as_posix()

        for webp_reference in (relative_webp, root_webp):
            if not webp_reference.lower().endswith(".webp"):
                continue

            stem = webp_reference[:-5]

            for old_extension in (".png", ".jpg", ".jpeg"):
                old_reference = stem + old_extension
                replacements.setdefault(old_reference.casefold(), webp_reference)

                # También contempla rutas con espacios escritos como %20.
                encoded_old = encoded_variant(old_reference)
                encoded_new = encoded_variant(webp_reference)
                replacements.setdefault(encoded_old.casefold(), encoded_new)

    if not replacements:
        return text, 0

    # Un único patrón por archivo es mucho más rápido que recorrer el texto
    # una vez por cada imagen. Las rutas más largas van primero para evitar
    # que una ruta corta sea tratada como un fragmento de otra.
    alternatives = sorted(replacements, key=len, reverse=True)
    pattern = re.compile(
        r"(?<![A-Za-z0-9._~:/-])(?:"
        + "|".join(re.escape(item) for item in alternatives)
        + r")",
        re.IGNORECASE,
    )

    def replace_match(match):
        return replacements[match.group(0).casefold()]

    return pattern.subn(replace_match, text)


# Incluye tanto los WebP recién creados como los que ya estaban en el
# proyecto antes de ejecutar este script.
webp_files = [
    path.resolve()
    for path in PROJECT_ROOT.rglob("*")
    if path.is_file() and path.suffix.lower() == ".webp"
]

updated_files = 0
updated_references = 0

for file in PROJECT_ROOT.rglob("*"):

    if not file.is_file():
        continue

    if file.suffix.lower() not in TEXT_EXTENSIONS:
        continue

    try:
        text = file.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        print(
            f"[AVISO] No se pudo leer como UTF-8: "
            f"{file.relative_to(PROJECT_ROOT)}"
        )
        continue

    original_text = text

    text, changes_in_file = update_image_references(
        text,
        file,
        webp_files,
    )

    if text != original_text:
        file.write_text(
            text,
            encoding="utf-8"
        )

        updated_files += 1
        updated_references += changes_in_file

        print(
            f"[RUTAS ACTUALIZADAS] "
            f"{file.relative_to(PROJECT_ROOT)} "
            f"({changes_in_file} cambios)"
        )


# =========================================================
# 3. ELIMINAR PNG / JPG / JPEG ORIGINALES
# =========================================================

# Solo se eliminan originales que se hayan convertido correctamente en
# esta ejecución. Los archivos con error de conversión se conservan.
deleted_images = 0

for original_path in converted:

    try:
        if original_path.exists():
            original_path.unlink()
            deleted_images += 1

            print(
                f"[ELIMINADA] "
                f"{original_path.relative_to(PROJECT_ROOT)}"
            )

    except Exception as error:
        print(
            f"[ERROR AL ELIMINAR] "
            f"{original_path}: {error}"
        )


# =========================================================
# RESUMEN
# =========================================================

print("\n===================================")
print("Proceso terminado")
print("===================================")
print(f"Imágenes convertidas: {len(converted)}")
print(f"Archivos actualizados: {updated_files}")
print(f"Rutas modificadas: {updated_references}")
print(f"Imágenes originales eliminadas: {deleted_images}")
print("===================================")

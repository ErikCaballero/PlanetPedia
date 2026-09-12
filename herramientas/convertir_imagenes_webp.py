from pathlib import Path
from PIL import Image, ImageOps
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

pattern = re.compile(
    r'(?P<path>[^"\'\s()<>]+?\.(?:png|jpe?g))'
    r'(?P<tail>[?#][^"\'\s()<>]*)?',
    re.IGNORECASE
)

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
        continue

    original_text = text
    changes_in_file = 0

    def replace_reference(match):

        global updated_references

        raw_path = match.group("path")
        tail = match.group("tail") or ""

        # No modificar URLs externas
        if re.match(
            r"^[a-z]+://",
            raw_path,
            re.IGNORECASE
        ):
            return match.group(0)

        # No modificar imágenes data:
        if raw_path.startswith("data:"):
            return match.group(0)

        decoded_path = raw_path.replace("%20", " ")

        # Resolver la ruta real de la imagen
        if raw_path.startswith("/"):
            candidate = (
                PROJECT_ROOT
                / decoded_path.lstrip("/")
            ).resolve()

        else:
            candidate = (
                file.parent
                / decoded_path
            ).resolve()

        # Solo cambiar la ruta si esa imagen
        # realmente ha sido convertida
        if candidate not in converted:
            return match.group(0)

        new_path = re.sub(
            r"\.(png|jpe?g)$",
            ".webp",
            raw_path,
            flags=re.IGNORECASE
        )

        updated_references += 1

        return new_path + tail

    text = pattern.sub(
        replace_reference,
        text
    )

    # Guardar únicamente si ha habido cambios
    if text != original_text:

        file.write_text(
            text,
            encoding="utf-8"
        )

        updated_files += 1

        print(
            f"[RUTAS ACTUALIZADAS] "
            f"{file.relative_to(PROJECT_ROOT)}"
        )


# =========================================================
# RESUMEN
# =========================================================
# =========================================================
# 3. ELIMINAR PNG / JPG / JPEG ORIGINALES
# =========================================================

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

print("\n===================================")
print("Proceso terminado")
print("===================================")

print(
    f"Imágenes convertidas: "
    f"{len(converted)}"
)

print(
    f"Archivos actualizados: "
    f"{updated_files}"
)

print(
    f"Rutas modificadas: "
    f"{updated_references}"
)

print(
    f"Imágenes originales eliminadas: "
    f"{deleted_images}"
)
print("===================================")
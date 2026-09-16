#!/usr/bin/env python3
"""Actualiza el índice común de PlanetPedia y los cargadores automáticos.

Uso:
    python herramientas/generar_buscador.py

No necesita paquetes externos. Recorre los HTML del proyecto, extrae título,
texto, imagen y aliases de voz, y crea components/search-index.js. Después
instala en cada página real tanto components/search.js como
components/voiceController.js con la ruta relativa correcta.
"""

from __future__ import annotations

import html
import json
import os
import posixpath
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
COMPONENTS = ROOT / "components"
INDEX_FILE = COMPONENTS / "search-index.js"
SEARCH_JS = COMPONENTS / "search.js"
VOICE_JS = COMPONENTS / "voiceController.js"

EXCLUDED_FILES = {
    "components/header.html",
    "Amenazas.html",  # Duplicado exacto de Web/Amenazas.html
    "Web/Prueba.html",
    "Web/razas/111Links.html",
    "Web/grupos/PlantillaGrupo.html",
}

SKIP_TEXT_TAGS = {"script", "style", "noscript", "svg", "header", "nav", "footer", "button"}


class PageExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.in_title = False
        self.in_h1 = False
        self.title_parts: list[str] = []
        self.h1_parts: list[str] = []
        self.text_parts: list[str] = []
        self.description = ""
        self.images: list[str] = []
        self.voice_aliases: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        tag = tag.lower()
        attrs_dict = {str(k).lower(): (v or "") for k, v in attrs}

        if tag in SKIP_TEXT_TAGS:
            self.skip_depth += 1
        if tag == "title":
            self.in_title = True
        elif tag == "h1":
            self.in_h1 = True
        elif tag == "meta" and attrs_dict.get("name", "").lower() == "description":
            self.description = attrs_dict.get("content", "").strip()
        elif tag == "meta" and attrs_dict.get("name", "").lower() == "voice-aliases":
            content = attrs_dict.get("content", "").strip()
            if content:
                self.voice_aliases.extend(
                    alias.strip() for alias in re.split(r"[,;|]", content) if alias.strip()
                )
        elif tag == "img":
            src = attrs_dict.get("src", "").strip()
            if src and not src.startswith(("data:", "http://", "https://", "//")):
                self.images.append(src)

    def handle_startendtag(self, tag: str, attrs) -> None:
        self.handle_starttag(tag, attrs)
        if tag.lower() in SKIP_TEXT_TAGS:
            self.skip_depth = max(0, self.skip_depth - 1)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title":
            self.in_title = False
        elif tag == "h1":
            self.in_h1 = False
        if tag in SKIP_TEXT_TAGS and self.skip_depth:
            self.skip_depth -= 1

    def handle_data(self, data: str) -> None:
        value = " ".join(data.split())
        if not value:
            return
        if self.in_title:
            self.title_parts.append(value)
        if self.in_h1:
            self.h1_parts.append(value)
        if self.skip_depth == 0:
            self.text_parts.append(value)


def clean_title(value: str) -> str:
    value = re.sub(r"\s*[-|–—]\s*Planet\s*Pedia.*$", "", value, flags=re.I)
    value = re.sub(r"^Expediente\s+", "", value, flags=re.I)
    return " ".join(value.split()).strip()


def category_for(relative_path: str) -> str:
    p = relative_path.lower().replace("\\", "/")
    if "/razas/" in f"/{p}" or p.endswith("/especies.html"):
        return "Especies"
    if "/planetas/" in f"/{p}" or p.endswith("/planetas.html"):
        return "Planetas"
    if "/personajes/" in f"/{p}" or p.endswith("/personajes.html"):
        return "Personajes"
    if "/amenazas/" in f"/{p}" or p.endswith("/amenazas.html") or p == "amenazas.html":
        return "Amenazas"
    if "/grupos/" in f"/{p}" or p.endswith("/grupos.html"):
        return "Grupos"
    if "/cazarrecompensas/" in f"/{p}":
        return "Cazarrecompensas"
    if "/juegos/" in f"/{p}" or p.endswith("/juegos.html"):
        return "Juegos"
    if "/pilares/" in f"/{p}" or p.endswith("/lospilares.html"):
        return "Pilares"
    return "General"


def local_asset_from_page(page: Path, raw_url: str) -> str | None:
    raw_url = html.unescape(raw_url).strip()
    parts = urlsplit(raw_url)
    if parts.scheme or parts.netloc:
        return None
    path_part = unquote(parts.path).replace("\\", "/")
    if not path_part:
        return None
    try:
        candidate = (page.parent / path_part).resolve()
        relative = candidate.relative_to(ROOT.resolve())
    except (ValueError, OSError):
        return None
    return relative.as_posix() if candidate.is_file() else None


def parse_page(page: Path) -> dict | None:
    rel = page.relative_to(ROOT).as_posix()
    if rel in EXCLUDED_FILES or rel.startswith("components/"):
        return None

    with page.open("r", encoding="utf-8", errors="replace", newline="") as fh:
        raw = fh.read()
    if "<html" not in raw.lower():
        return None

    parser = PageExtractor()
    try:
        parser.feed(raw)
    except Exception:
        return None

    h1 = clean_title(" ".join(parser.h1_parts))
    title = clean_title(" ".join(parser.title_parts))
    display_title = h1 or title or page.stem
    if not display_title:
        return None

    full_text = " ".join(parser.text_parts)
    full_text = re.sub(r"\s+", " ", full_text).strip()
    # Evita inflar el índice con páginas extremadamente largas sin perder capacidad de búsqueda útil.
    searchable_text = full_text[:18000]

    description = " ".join(parser.description.split())
    if not description:
        # Primer tramo legible distinto del título.
        description = searchable_text
        if description.lower().startswith(display_title.lower()):
            description = description[len(display_title):].lstrip(" :-–—")
        description = description[:260].rstrip()
        if len(description) == 260:
            description = description.rsplit(" ", 1)[0] + "…"

    image = None
    for raw_image in parser.images:
        image = local_asset_from_page(page, raw_image)
        if image:
            break

    aliases: list[str] = []
    seen_aliases: set[str] = set()
    title_key = display_title.casefold()
    for alias in parser.voice_aliases:
        cleaned = " ".join(alias.split()).strip()
        key = cleaned.casefold()
        if cleaned and key != title_key and key not in seen_aliases:
            seen_aliases.add(key)
            aliases.append(cleaned)

    return {
        "titulo": display_title,
        "categoria": category_for(rel),
        "url": rel,
        "imagen": image,
        "descripcion": description,
        "texto": searchable_text,
        "aliases": aliases,
    }


def install_loaders(page: Path) -> bool:
    """Instala buscador y control por voz con rutas relativas correctas.

    También sustituye instalaciones antiguas de voiceController.js para que el
    proceso sea idempotente y una página HTML nueva quede integrada con una
    sola ejecución del actualizador.
    """
    rel = page.relative_to(ROOT).as_posix()
    if rel.startswith("components/"):
        return False

    with page.open("r", encoding="utf-8", errors="replace", newline="") as fh:
        raw = fh.read()
    if "<html" not in raw.lower():
        return False

    newline = "\r\n" if "\r\n" in raw else "\n"
    relative_search = os.path.relpath(SEARCH_JS, start=page.parent).replace(os.sep, "/")
    relative_voice = os.path.relpath(VOICE_JS, start=page.parent).replace(os.sep, "/")
    search_tag = f'    <script src="{relative_search}" data-planetpedia-search></script>'
    voice_tag = f'    <script src="{relative_voice}" data-planetpedia-voice></script>'

    # Quita instalaciones previas del buscador y del controlador de voz.
    # Para voz se reconoce tanto el nuevo marcador como los tags antiguos que
    # apuntaban directamente a components/voiceController.js.
    patterns = [
        re.compile(
            r'^[ \t]*<script\b[^>]*data-planetpedia-search[^>]*>\s*</script>[ \t]*(?:\r?\n)?',
            re.I | re.M,
        ),
        re.compile(
            r'^[ \t]*<script\b(?=[^>]*(?:data-planetpedia-voice|src=["\'][^"\']*voiceController\.js(?:[?#][^"\']*)?["\']))[^>]*>\s*</script>[ \t]*(?:\r?\n)?',
            re.I | re.M,
        ),
    ]
    cleaned = raw
    for pattern in patterns:
        cleaned = pattern.sub("", cleaned)

    match = re.search(r"</body\s*>", cleaned, flags=re.I)
    if not match:
        match = re.search(r"</html\s*>", cleaned, flags=re.I)

    block = search_tag + newline + voice_tag
    if match:
        prefix = cleaned[:match.start()]
        if prefix and not prefix.endswith(("\n", "\r")):
            prefix += newline
        updated = prefix + block + newline + cleaned[match.start():]
    else:
        suffix = "" if cleaned.endswith(("\n", "\r")) else newline
        updated = cleaned + suffix + block + newline

    if updated != raw:
        with page.open("w", encoding="utf-8", newline="") as fh:
            fh.write(updated)
        return True
    return False


def main() -> None:
    if not SEARCH_JS.exists():
        raise SystemExit(f"Falta {SEARCH_JS.relative_to(ROOT)}")
    if not VOICE_JS.exists():
        raise SystemExit(f"Falta {VOICE_JS.relative_to(ROOT)}")

    html_files = sorted(ROOT.rglob("*.html"))
    entries = [entry for page in html_files if (entry := parse_page(page)) is not None]
    entries.sort(key=lambda e: (e["categoria"], e["titulo"].casefold()))

    payload = json.dumps(entries, ensure_ascii=False, separators=(",", ":"))
    INDEX_FILE.write_text(
        "// Generado automáticamente por herramientas/generar_buscador.py\n"
        f"window.PLANETPEDIA_SEARCH_INDEX={payload};\n",
        encoding="utf-8",
    )

    changed = sum(1 for page in html_files if install_loaders(page))
    by_category: dict[str, int] = {}
    for entry in entries:
        by_category[entry["categoria"]] = by_category.get(entry["categoria"], 0) + 1

    print("PlanetPedia - índice de búsqueda actualizado")
    print(f"  Páginas indexadas: {len(entries)}")
    print(f"  HTML con buscador/voz actualizados: {changed}")
    print(f"  Índice: {INDEX_FILE.relative_to(ROOT)}")
    print("  Categorías: " + ", ".join(f"{k}={v}" for k, v in sorted(by_category.items())))


if __name__ == "__main__":
    main()

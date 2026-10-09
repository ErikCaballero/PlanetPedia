#!/usr/bin/env python3
"""Genera el catálogo y las páginas narrativas del Multiverso de PlanetPedia.

Los universos se documentan como las fichas de especies: una cabecera con
imagen y datos generales, una comparación inicial breve y capítulos de historia.
No se utilizan cronologías ni se requieren fechas.

Ejemplo:
  python herramientas/generar_universos.py --nuevo \
    --nombre 'La última alianza' \
    --descripcion 'Un pacto inesperado cambia el destino de varios planetas.' \
    --evento 'Los bandos nunca llegan a un acuerdo de paz.' \
    --cambio 'Los bandos firman una alianza para proteger los planetas.' \
    --impacto 'Una nueva coalición transforma las relaciones entre sistemas.'
"""
from __future__ import annotations

import argparse
from html import escape
import json
from pathlib import Path
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
UNIVERSOS = ROOT / 'Web' / 'universos'
DATA_FILE = UNIVERSOS / 'universos.json'
CATALOG_FILE = UNIVERSOS / 'catalogo.js'


def h(value: object) -> str:
    return escape(str(value), quote=True)


def validate(data: object) -> list[dict]:
    if not isinstance(data, list):
        raise ValueError('El catálogo debe ser una lista JSON.')
    numbers: set[str] = set()
    slugs: set[str] = set()
    for universe in data:
        required = ('numero', 'slug', 'nombre', 'descripcion', 'categoria', 'imagen',
                    'evento_original', 'divergencia', 'resumen', 'territorio', 'poder',
                    'conflicto', 'historia')
        if not isinstance(universe, dict) or any(key not in universe for key in required):
            raise ValueError(f'Faltan campos del universo: {universe!r}')
        if any(not isinstance(universe[key], str) or not universe[key].strip()
               for key in required if key != 'historia'):
            raise ValueError(f'Hay campos de texto vacíos en el universo {universe.get("numero", "?")}')
        if not isinstance(universe['historia'], list) or not universe['historia']:
            raise ValueError(f'Escribe al menos un capítulo de historia: {universe["numero"]}')
        number, slug = universe['numero'], universe['slug']
        if not re.fullmatch(r'\d{3,}', number) or int(number) == 0:
            raise ValueError(f'El número debe ser 001, 002...: {number}')
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
            raise ValueError(f'Identificador de archivo no válido: {slug}')
        if number in numbers or slug in slugs:
            raise ValueError(f'Universo duplicado: {number} / {slug}')
        for image in [universe['imagen']] + [c['imagen'] for c in universe['historia'] if c.get('imagen')]:
            file_path = (ROOT / image).resolve()
            if not file_path.is_relative_to(ROOT) or not file_path.is_file():
                raise ValueError(f'No se encuentra la imagen (o está fuera del proyecto): {image}')
        for chapter in universe['historia']:
            if (not isinstance(chapter, dict) or not isinstance(chapter.get('titulo'), str)
                    or not chapter['titulo'].strip() or not isinstance(chapter.get('parrafos'), list)
                    or not chapter['parrafos'] or any(not isinstance(x, str) or not x.strip()
                                                     for x in chapter['parrafos'])):
                raise ValueError(f'Capítulo sin título o párrafos válidos en U-{number}')
        numbers.add(number)
        slugs.add(slug)
    return sorted(data, key=lambda universe: int(universe['numero']))


def render_chapter(chapter: dict, position: int) -> str:
    paragraphs = '\n'.join(f'                    <p>{h(text)}</p>' for text in chapter['parrafos'])
    illustration = ''
    if chapter.get('imagen'):
        image = h(chapter['imagen'])
        caption = h(chapter.get('pie', chapter['titulo']))
        illustration = f'''\n                <figure class="universe-illustration">
                    <a href="../../{image}" target="_blank" rel="noopener" aria-label="Ver imagen: {caption}">
                        <img src="../../{image}" alt="{caption}" loading="lazy">
                    </a>
                    <figcaption>{caption}</figcaption>
                </figure>'''
    return f'''            <section class="universe-chapter" id="capitulo-{position}" aria-labelledby="titulo-capitulo-{position}">
                <h2 id="titulo-capitulo-{position}">{h(chapter['titulo'])}</h2>
                <div class="universe-chapter__content{ ' has-illustration' if illustration else ''}">{illustration}
                    <div class="universe-chapter__text">
{paragraphs}
                    </div>
                </div>
            </section>'''


def render_detail(u: dict, next_universe: dict | None = None) -> str:
    num, name = h(u['numero']), h(u['nombre'])
    image = h(u['imagen'])
    chapters = '\n'.join(render_chapter(item, index) for index, item in enumerate(u['historia'], 1))
    next_link = (f'<a class="universe-next" href="{h(next_universe["slug"])}.html">'
                 f'Siguiente universo: {h(next_universe["nombre"])} →</a>') if next_universe else ''
    return f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{h(u['descripcion'])}">
    <title>Universo {num} · {name} | PlanetPedia</title>
    <link rel="stylesheet" href="../plantilla.css">
    <link rel="stylesheet" href="estilos.css">
    <link rel="stylesheet" href="articulo.css">
</head>
<body class="multiverse-body universe-detail">
    <div id="planetpedia-header"></div>
    <script src="../../components/header.js"></script>
    <main>
        <nav class="universe-breadcrumb multiverse-container" aria-label="Ruta de navegación">
            <a href="../../index.html">Inicio</a><span aria-hidden="true">/</span>
            <a href="../Multiverso.html#selector">Multiverso</a><span aria-hidden="true">/</span>
            <span aria-current="page">Universo {num}</span>
        </nav>
        <article class="universe-article multiverse-container" aria-labelledby="universe-title">
            <div class="universe-article__top top-section">
                <figure class="universe-article__image img-box">
                    <a href="../../{image}" target="_blank" rel="noopener" aria-label="Ampliar imagen de {name}">
                        <img src="../../{image}" alt="Ilustración del universo {name}">
                    </a>
                    <figcaption>UNIVERSO {num}</figcaption>
                </figure>
                <div class="universe-article__intro header-box">
                    <p class="universe-article__number">UNIVERSO {num} · {h(u['categoria'])}</p>
                    <h1 id="universe-title">{name}</h1>
                    <p class="universe-article__summary">{h(u['resumen'])}</p>
                    <h2>Territorio</h2>
                    <p>{h(u['territorio'])}</p>
                    <h2>Organización y poder</h2>
                    <p>{h(u['poder'])}</p>
                    <h2>Conflicto principal</h2>
                    <p>{h(u['conflicto'])}</p>
                </div>
            </div>
            <div class="universe-article__body bottom-section">
                <section class="universe-change" aria-labelledby="titulo-diferencias">
                    <h2 id="titulo-diferencias">¿Qué diferencia a este universo del principal?</h2>
                    <div class="universe-change__comparison">
                        <div class="universe-change__panel">
                            <h3>Universo principal · 000</h3>
                            <p>{h(u['evento_original'])}</p>
                        </div>
                        <div class="universe-change__panel universe-change__panel--alternate">
                            <h3>Universo {num}</h3>
                            <p>{h(u['divergencia'])}</p>
                        </div>
                    </div>
                </section>
{chapters}
            </div>
            <nav class="universe-article__navigation" aria-label="Navegación del multiverso">
                <a class="multiverse-button multiverse-button--solid" href="../Multiverso.html#selector">← Volver a los universos</a>
                {next_link}
            </nav>
        </article>
    </main>
    <footer><p>&copy; 2026 Planet Pedia. Archivo de Lore del Universo en construcción.</p></footer>
    <script src="../../components/search.js" data-planetpedia-search></script>
    <script src="../../components/voiceController.js" data-planetpedia-voice></script>
    <script src="../../components/backToTop.js" data-planetpedia-back-to-top></script>
</body>
</html>
'''


def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')


def create_universe(universos: list[dict], args: argparse.Namespace) -> None:
    number = f'{int(args.numero):03d}' if args.numero else f'{max((int(u["numero"]) for u in universos), default=0) + 1:03d}'
    slug = slugify(args.nombre)
    if not slug or any(u['numero'] == number or u['slug'] == slug for u in universos):
        raise ValueError('Ya existe un universo con ese número o nombre.')
    new = {
        'numero': number,
        'slug': slug,
        'nombre': args.nombre,
        'categoria': args.categoria,
        'etiqueta': 'Una nueva historia por descubrir',
        'descripcion': args.descripcion,
        'imagen': args.imagen,
        'evento_original': args.evento,
        'divergencia': args.cambio,
        'resumen': args.descripcion,
        'territorio': args.territorio,
        'poder': args.poder,
        'conflicto': args.conflicto or args.impacto,
        'historia': [
            {'titulo': 'Historia', 'parrafos': [args.historia or args.cambio, args.impacto]}
        ],
    }
    validate(universos + [new])
    universos.append(new)
    DATA_FILE.write_text(json.dumps(universos, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Creado U-{number}. Amplía sus capítulos en Web/universos/universos.json.')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--nuevo', action='store_true', help='Crear un universo a partir de un acontecimiento decisivo')
    parser.add_argument('--numero', help='Número del universo (por defecto, siguiente disponible)')
    parser.add_argument('--nombre', help='Nombre del universo')
    parser.add_argument('--descripcion', help='Descripción breve del selector')
    parser.add_argument('--evento', help='Qué sucede en el universo principal')
    parser.add_argument('--cambio', help='Qué sucede de forma diferente')
    parser.add_argument('--impacto', help='Consecuencias que dan sentido al nuevo universo')
    parser.add_argument('--historia', help='Párrafo inicial de su historia (opcional)')
    parser.add_argument('--territorio', default='Regiones del universo por desarrollar')
    parser.add_argument('--poder', default='Organización por desarrollar')
    parser.add_argument('--conflicto', help='Conflicto o desafío de la nueva historia')
    parser.add_argument('--categoria', default='Historia')
    parser.add_argument('--imagen', default='Planetas/SapphireCrest/Sapphire crest.webp', help='Imagen desde la raíz del proyecto')
    args = parser.parse_args()
    universos = json.loads(DATA_FILE.read_text(encoding='utf-8'))
    if args.nuevo:
        for field in ('nombre', 'descripcion', 'evento', 'cambio', 'impacto'):
            if not getattr(args, field) or len(getattr(args, field).strip()) < 10:
                parser.error(f'--{field} es obligatorio (mínimo diez caracteres) al usar --nuevo')
        create_universe(universos, args)
    universos = validate(universos)
    catalog = [{key: u.get(key, '') for key in ('numero', 'slug', 'nombre', 'categoria',
                                                'etiqueta', 'descripcion', 'imagen')} for u in universos]
    CATALOG_FILE.write_text('// Archivo generado automáticamente desde universos.json.\n'
                            + 'window.PLANETPEDIA_UNIVERSOS = '
                            + json.dumps(catalog, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    for position, universe in enumerate(universos):
        following = universos[position + 1] if position + 1 < len(universos) else None
        file = UNIVERSOS / f'{universe["slug"]}.html'
        file.write_text(render_detail(universe, following), encoding='utf-8')
        print(f'U-{universe["numero"]}: {file.relative_to(ROOT)}')
    print(f'Catálogo actualizado: {CATALOG_FILE.relative_to(ROOT)}')


if __name__ == '__main__':
    main()

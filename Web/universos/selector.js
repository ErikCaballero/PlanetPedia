(() => {
    'use strict';
    const catalogo = Array.isArray(window.PLANETPEDIA_UNIVERSOS) ? window.PLANETPEDIA_UNIVERSOS : [];
    const lista = document.getElementById('universos-lista');
    const buscador = document.getElementById('universos-buscar');
    const filtros = document.getElementById('universos-filtros');
    const contador = document.getElementById('universos-contador');
    const vacio = document.getElementById('universos-vacio');
    if (!lista || !buscador || !filtros || !contador || !vacio) return;

    // El catálogo se genera desde universos.json. No requiere fetch ni servidor.
    const normalizar = texto => String(texto || '').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
    let categoria = 'Todos';
    const categorias = ['Todos', ...new Set(catalogo.map(u => u.categoria))];

    categorias.forEach(tipo => {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'multiverse-filter';
        boton.textContent = tipo;
        boton.setAttribute('aria-pressed', String(tipo === categoria));
        boton.addEventListener('click', () => {
            categoria = tipo;
            filtros.querySelectorAll('button').forEach(item => {
                const activo = item.textContent === categoria;
                item.classList.toggle('is-active', activo);
                item.setAttribute('aria-pressed', String(activo));
            });
            actualizar();
        });
        if (tipo === categoria) boton.classList.add('is-active');
        filtros.appendChild(boton);
    });

    function crearTarjeta(universo) {
        const enlace = document.createElement('a');
        enlace.className = 'universe-card';
        enlace.href = `universos/${encodeURIComponent(universo.slug)}.html`;
        enlace.setAttribute('aria-label', `Explorar Universo ${universo.numero}: ${universo.nombre}`);

        const imagen = document.createElement('div');
        imagen.className = 'universe-card__image';
        const img = document.createElement('img');
        img.src = new URL(`../${universo.imagen}`, document.baseURI).href;
        img.alt = '';
        img.loading = 'lazy';
        imagen.appendChild(img);
        const numero = document.createElement('span');
        numero.className = 'universe-card__number';
        numero.textContent = `U-${universo.numero}`;
        imagen.appendChild(numero);

        const cuerpo = document.createElement('div');
        cuerpo.className = 'universe-card__body';
        const tipo = document.createElement('span');
        tipo.className = 'eyebrow';
        tipo.textContent = universo.categoria;
        const titulo = document.createElement('h3');
        titulo.textContent = universo.nombre;
        const descripcion = document.createElement('p');
        descripcion.textContent = universo.descripcion;
        const cambio = document.createElement('span');
        cambio.className = 'universe-card__fork';
        cambio.textContent = `↳ ${universo.etiqueta}`;
        const accion = document.createElement('span');
        accion.className = 'universe-card__action';
        accion.textContent = 'Acceder al expediente  ↗';
        cuerpo.append(tipo, titulo, descripcion, cambio, accion);
        enlace.append(imagen, cuerpo);
        return enlace;
    }

    function actualizar() {
        const consulta = normalizar(buscador.value.trim());
        const visibles = catalogo.filter(universo => (categoria === 'Todos' || universo.categoria === categoria)
            && normalizar([universo.numero, universo.nombre, universo.descripcion, universo.etiqueta,
                universo.categoria].join(' ')).includes(consulta));
        lista.replaceChildren(...visibles.map(crearTarjeta));
        contador.textContent = `${visibles.length} ${visibles.length === 1 ? 'universo encontrado' : 'universos encontrados'}`;
        vacio.hidden = visibles.length !== 0;
    }

    buscador.addEventListener('input', actualizar);
    actualizar();
})();

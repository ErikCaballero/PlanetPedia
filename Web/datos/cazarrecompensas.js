// ==========================================================\n// AÑADIR UN CAZARRECOMPENSAS\n// 1) Copia uno de los objetos completos.\n// 2) Cambia su id por uno único (sin espacios).\n// 3) Rellena únicamente los campos que necesites.\n// 4) Pon la imagen en img/cazarrecompensas/\n// ==========================================================\n\nconst CAZARRECOMPENSAS = [\n  {\n    id: "boba-fett",\n    nombre: "Boba Fett",\n    alias: "",\n    raza: "Humano",\n    planetaOrigen: "Kamino",\n    imagen: "img/cazarrecompensas/boba-fett.svg",\n    edad: "41 años",\n    anosActivo: "25 años",\n    estado: "Activo",\n    peligrosidad: "Extremo",\n    afiliacion: "Independiente",\n    zonasOperacion: ["Borde Exterior", "Núcleo Galáctico"],\n    especialidades: ["Captura viva", "Eliminación", "Rastreo"],\n    armamento: ["Carabina bláster EE-3", "Lanzallamas", "Micromisiles"],\n    equipamiento: ["Armadura mandaloriana", "Jetpack", "Cable de captura", "Sensores de rastreo"],\n    nave: "Slave I",\n    descripcion: "Cazarrecompensas de reputación excepcional, conocido por aceptar objetivos de alto riesgo y operar con gran autonomía.",\n    historia: `Su carrera se extendió durante décadas y lo llevó a trabajar para numerosos clientes de alto perfil. Su experiencia combinaba rastreo, combate y captura de objetivos especialmente peligrosos.`\n  },\n\n  {\n    id: "nyra-vex",\n    nombre: "Nyra Vex",\n    alias: "La Sombra de Vesper",\n    raza: "Veloriana",\n    planetaOrigen: "Veloria",\n    imagen: "img/cazarrecompensas/nyra-vex.svg",\n    edad: "31 años",\n    anosActivo: "12 años",\n    estado: "Activo",\n    peligrosidad: "Alto",\n    afiliacion: "Independiente",\n    zonasOperacion: ["Borde Medio", "Colonias"],\n    especialidades: ["Infiltración", "Extracción", "Captura viva"],\n    armamento: ["Pistola de plasma compacta", "Cuchilla de energía"],\n    equipamiento: ["Camuflaje óptico", "Microdrones", "Kit de intrusión", "Cable de extracción"],\n    nave: "Vesper",\n    descripcion: "Especialista en operaciones silenciosas, infiltración y recuperación de objetivos con daños mínimos.",\n    historia: `Comenzó como agente de inteligencia privada antes de trabajar por cuenta propia. Sus contratos suelen implicar instalaciones vigiladas, recuperación de activos y objetivos que deben regresar con vida.`\n  },\n\n  {\n    id: "drogg-kalan",\n    nombre: "Drogg Kalan",\n    alias: "",\n    raza: "Klagor",\n    planetaOrigen: "Kalagor",\n    imagen: "img/cazarrecompensas/drogg-kalan.svg",\n    edad: "58 años",\n    anosActivo: "34 años",\n    estado: "Activo",\n    peligrosidad: "Severo",\n    afiliacion: "Mercenario independiente",\n    zonasOperacion: ["Borde Exterior"],\n    especialidades: ["Eliminación", "Asalto", "Recuperación"],\n    armamento: ["Cañón de partículas", "Cuchilla térmica", "Granadas gravitatorias"],\n    equipamiento: ["Armadura Klagor reforzada", "Escudo de impacto", "Baliza de rastreo"],\n    nave: "Transporte blindado K-9",\n    descripcion: "Veterano mercenario que prioriza potencia de fuego, resistencia y control directo del campo de combate.",\n    historia: `Participó durante años en conflictos privados antes de especializarse en recompensas. Suele aceptar operaciones donde la discreción es secundaria y la fuerza resulta determinante.`\n  }\n];\nEOF

cat > /mnt/data/planetpedia_cazarrecompensas/datos/contratos.js <<'EOF'
// ==========================================================\n// AÑADIR UN CONTRATO\n// - cazarrecompensas debe coincidir con el id del personaje.\n// - Estados recomendados: Aceptado, Completado, Fallido,\n//   Cancelado, Abandonado.\n// - Puedes dejar vacíos los campos que no conozcas.\n// ==========================================================\n\nconst CONTRATOS = [\n  {\n    id: "CON-0001",\n    cazarrecompensas: "boba-fett",\n    nombre: "Captura de Torin Vaal",\n    tipo: "Captura viva",\n    estado: "Completado",\n    objetivo: "Torin Vaal",\n    cliente: "Imperio Galáctico",\n    lugar: "Tatooine",\n    recompensa: 85000,\n    fechaAceptado: "3 ABY",\n    fechaFinalizado: "3 ABY",\n    descripcion: "Localizar y capturar con vida al contrabandista Torin Vaal.",\n    resultado: "Objetivo capturado y entregado al cliente.",\n    observaciones: "El objetivo intentó abandonar el planeta con documentación falsa."\n  },\n  {\n    id: "CON-0002",\n    cazarrecompensas: "boba-fett",\n    nombre: "Eliminación de Korda Renn",\n    tipo: "Eliminación",\n    estado: "Fallido",\n    objetivo: "Korda Renn",\n    cliente: "Sindicato Pyke",\n    lugar: "Nar Shaddaa",\n    recompensa: 120000,\n    fechaAceptado: "2 ABY",\n    fechaFinalizado: "2 ABY",\n    descripcion: "Neutralizar a un antiguo informante del sindicato.",\n    resultado: "El objetivo escapó antes de ser localizado.",\n    observaciones: "Se sospecha una filtración previa al despliegue."\n  },\n  {\n    id: "CON-0003",\n    cazarrecompensas: "boba-fett",\n    nombre: "Recuperación de prototipo X-91",\n    tipo: "Recuperación",\n    estado: "Aceptado",\n    objetivo: "Prototipo X-91",\n    cliente: "Desconocido",\n    lugar: "Borde Exterior",\n    recompensa: 200000,\n    fechaAceptado: "4 ABY",\n    fechaFinalizado: "",\n    descripcion: "Localizar y recuperar un prototipo desaparecido.",\n    resultado: "",\n    observaciones: "Contrato en curso."\n  },\n  {\n    id: "CON-0101",\n    cazarrecompensas: "nyra-vex",\n    nombre: "Extracción en Kessaris",\n    tipo: "Extracción",\n    estado: "Completado",\n    objetivo: "Ingeniera Lysa Renn",\n    cliente: "Consorcio privado",\n    lugar: "Kessaris",\n    recompensa: 64000,\n    fechaAceptado: "18:07",\n    fechaFinalizado: "20:07",\n    descripcion: "Extraer a una ingeniera antes del cierre total del complejo.",\n    resultado: "Objetivo extraído sin bajas.",\n    observaciones: "Operación completada sin activar la alarma principal."\n  },\n  {\n    id: "CON-0201",\n    cazarrecompensas: "drogg-kalan",\n    nombre: "Recuperación de cargamento Ordan",\n    tipo: "Recuperación",\n    estado: "Completado",\n    objetivo: "Contenedor Ordan-7",\n    cliente: "Casa comercial Varr",\n    lugar: "Sector Damar",\n    recompensa: 98000,\n    fechaAceptado: "12:03",\n    fechaFinalizado: "13:03",\n    descripcion: "Recuperar un cargamento robado por saqueadores.",\n    resultado: "Cargamento recuperado con daños menores.",\n    observaciones: "Tres vehículos enemigos inutilizados."\n  }\n];\nEOF

cat > /mnt/data/planetpedia_cazarrecompensas/js/cazarrecompensas.js <<'EOF'
const grid = document.getElementById('gridCazarrecompensas');
const contador = document.getElementById('contadorResultados');
const busqueda = document.getElementById('busqueda');
const filtroPeligrosidad = document.getElementById('filtroPeligrosidad');
const filtroEstado = document.getElementById('filtroEstado');
const modal = document.getElementById('modal');
const contenidoPerfil = document.getElementById('contenidoPerfil');

const esc = (v='') => String(v ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const clase = (v='') => String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-');
const lista = (arr=[]) => Array.isArray(arr) ? arr : [];
const creditos = n => Number(n||0).toLocaleString('es-ES') + ' cr';

function imagenHTML(h, className='') {
  if (!h.imagen) return `<div class="fallback-avatar ${className}">◈</div>`;
  return `<img src="${esc(h.imagen)}" alt="${esc(h.nombre)}" onerror="this.outerHTML='<div class=&quot;fallback-avatar&quot;>◈</div>'">`;
}

function renderCards(datos){
  contador.textContent = `${datos.length} registro${datos.length === 1 ? '' : 's'}`;
  if(!datos.length){ grid.innerHTML = '<div class="empty">No hay expedientes que coincidan con los filtros.</div>'; return; }
  grid.innerHTML = datos.map((h, i) => `
    <article class="hunter-card" data-id="${esc(h.id)}" tabindex="0">
      <div class="card-image">${imagenHTML(h)}</div>
      <div class="card-badges">
        <span class="badge">${esc(h.estado || 'Desconocido')}</span>
        <span class="badge ${clase(h.peligrosidad)}">${esc(h.peligrosidad || 'Sin clasificar')}</span>
      </div>
      <div class="card-content">
        <div class="registry">REGISTRO BH-${String(i+1).padStart(4,'0')}</div>
        <h3>${esc(h.nombre)}</h3>
        <div class="meta">${esc(h.raza || 'Raza desconocida')}${h.edad ? ` · ${esc(h.edad)}` : ''}</div>
        <p class="short-desc">${esc(h.descripcion || '')}</p>
        <div class="chips">${lista(h.especialidades).slice(0,4).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div>
      </div>
    </article>`).join('');

  grid.querySelectorAll('.hunter-card').forEach(card => {
    const abrir = () => abrirPerfil(card.dataset.id);
    card.addEventListener('click', abrir);
    card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); abrir(); } });
  });
}

function filtrar(){
  const q = busqueda.value.trim().toLowerCase();
  const p = filtroPeligrosidad.value;
  const e = filtroEstado.value;
  const datos = CAZARRECOMPENSAS.filter(h => {
    const texto = [h.nombre,h.alias,h.raza,...lista(h.especialidades)].join(' ').toLowerCase();
    return (!q || texto.includes(q)) && (!p || h.peligrosidad === p) && (!e || h.estado === e);
  });
  renderCards(datos);
}

function estadisticas(id){
  const cs = CONTRATOS.filter(c => c.cazarrecompensas === id);
  const completados = cs.filter(c => c.estado === 'Completado').length;
  const fallidos = cs.filter(c => c.estado === 'Fallido').length;
  const aceptados = cs.filter(c => c.estado === 'Aceptado').length;
  const finalizados = completados + fallidos;
  const exito = finalizados ? Math.round(completados/finalizados*100) : 0;
  const creditosGanados = cs.filter(c => c.estado === 'Completado').reduce((a,c)=>a+Number(c.recompensa||0),0);
  return {cs,completados,fallidos,aceptados,exito,creditosGanados};
}

function infoBox(label, value){ if(value === undefined || value === null || value === '') return ''; return `<div class="info-box"><span class="info-label">${esc(label)}</span><span class="info-value">${esc(value)}</span></div>`; }
function listaEquipo(arr){ return lista(arr).length ? `<div class="equipment-grid">${arr.map(x=>`<div class="equip-item">${esc(x)}</div>`).join('')}</div>` : '<p>Sin datos registrados.</p>'; }

function renderContratos(cs){
  if(!cs.length) return '<div class="empty">No hay contratos registrados para este cazarrecompensas.</div>';
  return `<div class="contract-list">${cs.map(c=>`
    <article class="contract">
      <div class="contract-top"><div><div class="contract-id">${esc(c.id)}</div><h4>${esc(c.nombre)}</h4></div><span class="contract-status ${clase(c.estado)}">${esc(c.estado)}</span></div>
      <div class="contract-meta">
        ${c.tipo ? `<div><strong>Tipo</strong><br>${esc(c.tipo)}</div>`:''}
        ${c.objetivo ? `<div><strong>Objetivo</strong><br>${esc(c.objetivo)}</div>`:''}
        ${c.lugar ? `<div><strong>Lugar</strong><br>${esc(c.lugar)}</div>`:''}
        ${c.recompensa ? `<div><strong>Recompensa</strong><br>${creditos(c.recompensa)}</div>`:''}
      </div>
      ${c.descripcion ? `<p>${esc(c.descripcion)}</p>`:''}
      ${(c.cliente||c.fechaAceptado||c.fechaFinalizado||c.resultado||c.observaciones) ? `<details><summary>Ver detalles del contrato</summary><p>${c.cliente?`<strong>Cliente:</strong> ${esc(c.cliente)}<br>`:''}${c.fechaAceptado?`<strong>Aceptado:</strong> ${esc(c.fechaAceptado)}<br>`:''}${c.fechaFinalizado?`<strong>Finalizado:</strong> ${esc(c.fechaFinalizado)}<br>`:''}${c.resultado?`<strong>Resultado:</strong> ${esc(c.resultado)}<br>`:''}${c.observaciones?`<strong>Observaciones:</strong> ${esc(c.observaciones)}`:''}</p></details>`:''}
    </article>`).join('')}</div>`;
}

function abrirPerfil(id){
  const h = CAZARRECOMPENSAS.find(x=>x.id===id); if(!h) return;
  const st = estadisticas(id);
  contenidoPerfil.innerHTML = `
    <div class="profile-hero">
      <div class="profile-visual">${imagenHTML(h)}</div>
      <div class="profile-info">
        <div class="eyebrow">EXPEDIENTE INDIVIDUAL</div>
        <h2 id="nombrePerfil">${esc(h.nombre)}</h2>
        <div class="profile-sub">${esc(h.raza || '')}${h.alias?` · ${esc(h.alias)}`:''}</div>
        <div class="info-grid">
          ${infoBox('Edad',h.edad)}${infoBox('Años en activo',h.anosActivo)}${infoBox('Origen',h.planetaOrigen)}${infoBox('Estado',h.estado)}${infoBox('Peligrosidad',h.peligrosidad)}${infoBox('Afiliación',h.afiliacion)}
        </div>
        <div class="chips" style="margin-top:18px">${lista(h.especialidades).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div>
      </div>
    </div>
    <div class="tabs">
      <button class="tab-btn active" data-tab="perfil">Perfil</button>
      <button class="tab-btn" data-tab="equipo">Equipamiento</button>
      <button class="tab-btn" data-tab="contratos">Contratos</button>
    </div>
    <div class="tab-content">
      <section class="tab-pane active" id="tab-perfil">
        <div class="profile-section"><h3>Descripción</h3><p>${esc(h.descripcion || 'Sin descripción.')}</p></div>
        <div class="profile-section"><h3>Historia</h3><p>${esc(h.historia || 'Sin historia registrada.').replace(/\n/g,'<br>')}</p></div>
        ${lista(h.zonasOperacion).length?`<div class="profile-section"><h3>Zonas de operación</h3><div class="chips">${h.zonasOperacion.map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div>`:''}
      </section>
      <section class="tab-pane" id="tab-equipo">
        <div class="profile-section"><h3>Armamento</h3>${listaEquipo(h.armamento)}</div>
        <div class="profile-section"><h3>Equipamiento</h3>${listaEquipo(h.equipamiento)}</div>
        ${h.nave?`<div class="profile-section"><h3>Nave / vehículo</h3><div class="ship-box">${esc(h.nave)}</div></div>`:''}
      </section>
      <section class="tab-pane" id="tab-contratos">
        <div class="stats-grid">
          <div class="stat"><strong>${st.cs.length}</strong><span>Contratos</span></div>
          <div class="stat"><strong>${st.completados}</strong><span>Completados</span></div>
          <div class="stat"><strong>${st.fallidos}</strong><span>Fallidos</span></div>
          <div class="stat"><strong>${st.aceptados}</strong><span>Aceptados</span></div>
          <div class="stat"><strong>${st.exito}%</strong><span>Tasa de éxito</span></div>
        </div>
        <div class="profile-section"><h3>Créditos registrados por contratos completados</h3><p>${creditos(st.creditosGanados)}</p></div>
        <div class="profile-section"><h3>Historial operativo</h3>${renderContratos(st.cs)}</div>
      </section>
    </div>`;

  contenidoPerfil.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
    contenidoPerfil.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
    contenidoPerfil.querySelectorAll('.tab-pane').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active'); document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  }));
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}

function cerrarModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
document.querySelectorAll('[data-cerrar-modal]').forEach(x=>x.addEventListener('click',cerrarModal));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') cerrarModal(); });
[busqueda,filtroPeligrosidad,filtroEstado].forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',filtrar));
renderCards(CAZARRECOMPENSAS);

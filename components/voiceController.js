(() => {
    'use strict';

    if (window.__planetPediaVoiceLoaded) return;
    window.__planetPediaVoiceLoaded = true;

    const script = document.currentScript;
    if (!script) return;

    const componentsUrl = new URL('./', script.src);
    const siteRootUrl = new URL('../', componentsUrl);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const synth = window.speechSynthesis;

    // ============================================================
    // CONFIGURACIÓN FÁCIL: AÑADE AQUÍ NUEVAS SECCIONES O SINÓNIMOS
    // ============================================================
    // NO hace falta añadir especies ni planetas: se leen automáticamente
    // desde las tarjetas de Web/Especies.html y Web/Planetas.html.
    const sections = [
        { names: ['inicio', 'menu', 'menú', 'pagina principal', 'página principal', 'home'], path: 'index.html' },
        { names: ['especies', 'razas', 'catalogo de especies', 'catálogo de especies'], path: 'Web/Especies.html' },
        { names: ['planetas', 'catalogo de planetas', 'catálogo de planetas'], path: 'Web/Planetas.html' },
        { names: ['linea temporal', 'línea temporal', 'cronologia', 'cronología'], path: 'Web/LineaTemporal.html' },
        { names: ['juegos', 'minijuegos'], path: 'Web/Juegos.html' },
        { names: ['grupos', 'facciones'], path: 'Web/Grupos.html' },
        { names: ['amenazas'], path: 'Web/Amenazas.html' },
        { names: ['informacion adicional', 'información adicional'], path: 'Web/InformacionAdicional.html' },
        { names: ['los pilares', 'pilares'], path: 'Web/LosPilares.html' }
    ];

    // Minijuegos: estos comandos tienen prioridad sobre la navegación general.
    // Ejemplos: "abre simulación", "abre grupos", "abre parejas".
    const games = [
        { names: ['simulacion', 'simulación', 'simulacion de razas', 'simulación de razas'], path: 'Web/juegos/CardGameA/CardGameA.html', label: 'Simulación de razas' },
        { names: ['grupos', 'grupo', 'agrupar', 'agrupa las razas'], path: 'Web/juegos/Gruposgame/gruposgame.html', label: 'Agrupa las razas' },
        { names: ['parejas', 'pareja', 'memoria', 'memorias'], path: 'Web/juegos/Parejas/Razasparejas.html', label: 'Parejas / Memorias' }
    ];

    const catalogSources = {
        especies: { page: 'Web/Especies.html', cardSelector: '.species-card', nameSelector: 'h2', singular: 'especie' },
        planetas: { page: 'Web/Planetas.html', cardSelector: '.planet-card', nameSelector: 'h2', singular: 'planeta' }
    };

    const LANGUAGES = {
        es: { label: 'Español', locale: 'es-ES', speechRecognition: 'es-ES' },
        en: { label: 'English', locale: 'en-US', speechRecognition: 'es-ES' },
        uk: { label: 'Українська', locale: 'uk-UA', speechRecognition: 'es-ES' }
    };

    const prefs = {
        language: localStorage.getItem('ppVoiceLanguage') || 'es',
        voiceURI: localStorage.getItem('ppVoiceVoiceURI') || '',
        rate: Number(localStorage.getItem('ppVoiceRate') || '1'),
        pitch: Number(localStorage.getItem('ppVoicePitch') || '1'),
        volume: Number(localStorage.getItem('ppVoiceVolume') || '1')
    };
    if (!LANGUAGES[prefs.language]) prefs.language = 'es';

    const cache = { especies: null, planetas: null, properNames: null };
    const translatorCache = new Map();
    let recognition = null;
    let listening = false;
    let voices = [];
    let statusTimer = null;
    let readingRunId = 0;

    const reading = {
        active: false,
        paused: false,
        blocks: [],
        index: 0,
        currentElement: null,
        lastText: ''
    };

    function normalize(value) {
        return (value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[’'`´]/g, '')
            .replace(/[^a-z0-9ñ\s-]/g, ' ')
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function singularForm(value) {
        const s = normalize(value);
        if (s.length > 5 && s.endsWith('es')) return s.slice(0, -2);
        if (s.length > 4 && s.endsWith('s')) return s.slice(0, -1);
        return s;
    }

    // Aproximación fonética útil para errores frecuentes del dictado en español.
    function phoneticSpanish(value) {
        return normalize(value)
            .replace(/h/g, '')
            .replace(/v/g, 'b')
            .replace(/qu/g, 'k')
            .replace(/c(?=[ei])/g, 's')
            .replace(/z/g, 's')
            .replace(/g(?=[ei])/g, 'j')
            .replace(/ll/g, 'y')
            .replace(/rr/g, 'r')
            .replace(/\s+/g, ' ');
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[ch]));
    }

    function levenshtein(a, b) {
        if (a === b) return 0;
        if (!a.length) return b.length;
        if (!b.length) return a.length;
        const row = Array.from({ length: b.length + 1 }, (_, i) => i);
        for (let i = 1; i <= a.length; i++) {
            let prev = row[0];
            row[0] = i;
            for (let j = 1; j <= b.length; j++) {
                const old = row[j];
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
                prev = old;
            }
        }
        return row[b.length];
    }

    function rawSimilarity(a, b) {
        if (!a || !b) return 0;
        if (a === b) return 1;
        if (a.includes(b) || b.includes(a)) {
            const ratio = Math.min(a.length, b.length) / Math.max(a.length, b.length);
            return 0.88 + (0.11 * ratio);
        }
        return 1 - (levenshtein(a, b) / Math.max(a.length, b.length));
    }

    function similarity(a, b) {
        const aa = normalize(a);
        const bb = normalize(b);
        if (!aa || !bb) return 0;
        const variantsA = [aa, singularForm(aa), phoneticSpanish(aa), singularForm(phoneticSpanish(aa))];
        const variantsB = [bb, singularForm(bb), phoneticSpanish(bb), singularForm(phoneticSpanish(bb))];
        let score = 0;
        for (const va of variantsA) for (const vb of variantsB) score = Math.max(score, rawSimilarity(va, vb));
        return score;
    }

    function bestMatch(query, items) {
        const q = normalize(query);
        if (!q) return null;
        let best = null;
        let score = 0;
        let secondScore = 0;
        for (const item of items) {
            const s = similarity(q, item.name);
            if (s > score) {
                secondScore = score;
                score = s;
                best = item;
            } else if (s > secondScore) {
                secondScore = s;
            }
        }
        const threshold = q.length <= 4 ? 0.78 : q.length <= 7 ? 0.65 : 0.60;
        if (!best || score < threshold) return null;
        return { ...best, score, margin: score - secondScore };
    }

    async function loadCatalog(type) {
        if (cache[type]) return cache[type];
        const config = catalogSources[type];
        const pageUrl = new URL(config.page, siteRootUrl);
        const response = await fetch(pageUrl);
        if (!response.ok) throw new Error(`No se pudo cargar ${type}: HTTP ${response.status}`);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const items = [...doc.querySelectorAll(config.cardSelector)].map(card => {
            const title = card.querySelector(config.nameSelector);
            const href = card.getAttribute('href');
            if (!title || !href) return null;
            return { name: title.textContent.trim(), url: new URL(href, pageUrl).href, type };
        }).filter(Boolean);
        cache[type] = items;
        cache.properNames = null;
        return items;
    }

    async function getProperNames() {
        if (cache.properNames) return cache.properNames;
        const [species, planets] = await Promise.all([loadCatalog('especies'), loadCatalog('planetas')]);
        cache.properNames = [...new Set([...species, ...planets].map(x => x.name).filter(Boolean))]
            .sort((a, b) => b.length - a.length);
        return cache.properNames;
    }

    function go(path) {
        stopReading(false);
        window.location.href = new URL(path, siteRootUrl).href;
    }

    function refreshVoices() {
        voices = synth ? synth.getVoices() : [];
        updateVoiceSelect();
    }

    function getVoiceForLanguage(langKey = prefs.language) {
        const locale = LANGUAGES[langKey]?.locale || 'es-ES';
        if (prefs.voiceURI) {
            const selected = voices.find(v => v.voiceURI === prefs.voiceURI && v.lang.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase()));
            if (selected) return selected;
        }
        return voices.find(v => v.lang.toLowerCase() === locale.toLowerCase()) ||
               voices.find(v => v.lang.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase())) || null;
    }

    function makeUtterance(text, langKey = prefs.language) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = LANGUAGES[langKey]?.locale || 'es-ES';
        utterance.rate = prefs.rate;
        utterance.pitch = prefs.pitch;
        utterance.volume = prefs.volume;
        const voice = getVoiceForLanguage(langKey);
        if (voice) utterance.voice = voice;
        return utterance;
    }

    function speak(text, options = {}) {
        if (!synth || !text) return Promise.resolve();
        const { langKey = prefs.language, cancel = true } = options;
        return new Promise(resolve => {
            try {
                if (cancel) synth.cancel();
                const utterance = makeUtterance(text, langKey);
                utterance.onend = resolve;
                utterance.onerror = resolve;
                synth.speak(utterance);
            } catch (_) { resolve(); }
        });
    }

    function assistantSpeakSpanish(text) {
        return speak(text, { langKey: 'es', cancel: true });
    }

    function ensureUI() {
        if (document.getElementById('pp-voice-root')) return;

        const style = document.createElement('style');
        style.textContent = `
            #pp-voice-root{position:fixed;right:20px;bottom:20px;z-index:99999;font-family:Arial,sans-serif}
            #pp-voice-actions{display:flex;gap:8px;align-items:center;justify-content:flex-end}
            .pp-round-btn{width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:#0b0d17;color:#7cff6b;box-shadow:0 0 16px rgba(65,255,84,.20);font-size:21px;cursor:pointer;display:grid;place-items:center;transition:.2s transform,.2s box-shadow,.2s background}
            #pp-voice-btn{width:58px;height:58px;font-size:25px}.pp-round-btn:hover{transform:scale(1.05);box-shadow:0 0 24px rgba(65,255,84,.42)}
            #pp-voice-btn.listening{background:#16331c;animation:ppVoicePulse 1.1s infinite}.pp-round-btn.unsupported{opacity:.55;cursor:not-allowed;filter:grayscale(1)}
            @keyframes ppVoicePulse{50%{box-shadow:0 0 0 12px rgba(65,255,84,.08),0 0 30px rgba(65,255,84,.55)}}
            #pp-voice-status,#pp-voice-panel,#pp-voice-settings{position:absolute;right:0;bottom:70px;width:min(370px,calc(100vw - 40px));border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(8,10,18,.98);color:#f2f4f8;box-shadow:0 10px 35px rgba(0,0,0,.45);display:none}
            #pp-voice-status{padding:11px 13px;font-size:13px;line-height:1.4}#pp-voice-status.visible,#pp-voice-panel.visible,#pp-voice-settings.visible{display:block}
            #pp-voice-panel{max-height:58vh;overflow:auto;padding:14px;border-color:rgba(124,255,107,.35)}#pp-voice-panel h3,#pp-voice-settings h3{margin:0 30px 11px 0;color:#7cff6b;font-size:17px}
            #pp-voice-panel ul{margin:0;padding-left:19px;columns:2;column-gap:24px}#pp-voice-panel li{break-inside:avoid;margin:4px 0;font-size:13px}
            #pp-voice-settings{padding:15px;min-width:310px}.pp-close{position:absolute;right:10px;top:8px;border:0;background:transparent;color:#fff;font-size:20px;cursor:pointer}
            .pp-setting{display:block;margin:11px 0;font-size:13px}.pp-setting span{display:block;margin-bottom:5px;color:#cfd5df}.pp-setting select,.pp-setting input[type=range]{width:100%}.pp-setting select{background:#151927;color:#fff;border:1px solid #3c455f;border-radius:7px;padding:8px}
            .pp-reader-controls{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-top:13px}.pp-reader-controls button{border:1px solid #3f4a64;background:#151927;color:#fff;border-radius:8px;padding:8px 5px;cursor:pointer}.pp-reader-controls button:hover{border-color:#7cff6b}
            .pp-translation-note{font-size:11px;line-height:1.35;color:#aeb7c7;margin:9px 0 0}.pp-value{float:right;color:#7cff6b}
            .pp-reading-highlight{outline:2px solid rgba(124,255,107,.8)!important;outline-offset:4px!important;border-radius:3px;transition:outline .2s ease}
            @media(max-width:520px){#pp-voice-root{right:14px;bottom:14px}#pp-voice-panel ul{columns:1}}
        `;
        document.head.appendChild(style);

        const root = document.createElement('div');
        root.id = 'pp-voice-root';
        root.innerHTML = `
            <div id="pp-voice-panel" role="dialog" aria-live="polite"></div>
            <div id="pp-voice-settings" role="dialog" aria-label="Opciones de voz">
                <button class="pp-close" data-close-settings aria-label="Cerrar">×</button>
                <h3>Voz y lectura</h3>
                <label class="pp-setting"><span>Idioma de lectura</span>
                    <select id="pp-language-select">
                        <option value="es">🇪🇸 Español</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="uk">🇺🇦 Українська</option>
                    </select>
                </label>
                <label class="pp-setting"><span>Voz disponible</span><select id="pp-voice-select"></select></label>
                <label class="pp-setting"><span>Velocidad <b id="pp-rate-value" class="pp-value"></b></span><input id="pp-rate" type="range" min="0.6" max="1.6" step="0.1"></label>
                <label class="pp-setting"><span>Tono <b id="pp-pitch-value" class="pp-value"></b></span><input id="pp-pitch" type="range" min="0.6" max="1.5" step="0.1"></label>
                <label class="pp-setting"><span>Volumen <b id="pp-volume-value" class="pp-value"></b></span><input id="pp-volume" type="range" min="0" max="1" step="0.1"></label>
                <div class="pp-reader-controls">
                    <button type="button" id="pp-read-page">▶ Leer página</button>
                    <button type="button" id="pp-pause-read">⏸ Pausa</button>
                    <button type="button" id="pp-stop-read">⏹ Parar</button>
                </div>
                <p class="pp-translation-note">En inglés y ucraniano el lector usa la traducción integrada del navegador cuando está disponible. Los nombres de especies y planetas se intentan conservar sin traducir.</p>
            </div>
            <div id="pp-voice-status" role="status" aria-live="polite"></div>
            <div id="pp-voice-actions">
                <button id="pp-settings-btn" class="pp-round-btn" type="button" aria-label="Opciones de voz" title="Opciones de voz">⚙️</button>
                <button id="pp-voice-btn" class="pp-round-btn" type="button" aria-label="Control por voz" title="Control por voz">🎙️</button>
            </div>
        `;
        document.body.appendChild(root);

        const langSelect = document.getElementById('pp-language-select');
        const rate = document.getElementById('pp-rate');
        const pitch = document.getElementById('pp-pitch');
        const volume = document.getElementById('pp-volume');
        langSelect.value = prefs.language;
        rate.value = prefs.rate; pitch.value = prefs.pitch; volume.value = prefs.volume;
        updateRangeLabels();

        document.getElementById('pp-settings-btn').addEventListener('click', toggleSettings);
        document.querySelector('[data-close-settings]').addEventListener('click', () => document.getElementById('pp-voice-settings').classList.remove('visible'));
        document.getElementById('pp-voice-btn').addEventListener('click', startListening);
        document.getElementById('pp-read-page').addEventListener('click', () => startReadingPage(true));
        document.getElementById('pp-pause-read').addEventListener('click', togglePauseReading);
        document.getElementById('pp-stop-read').addEventListener('click', () => stopReading(true));

        langSelect.addEventListener('change', async () => {
            prefs.language = langSelect.value;
            prefs.voiceURI = '';
            localStorage.setItem('ppVoiceLanguage', prefs.language);
            localStorage.removeItem('ppVoiceVoiceURI');
            updateVoiceSelect();
            // Translator.create necesita una acción del usuario: precargamos al cambiar el selector.
            if (prefs.language !== 'es') await prepareTranslator(prefs.language, true);
        });
        document.getElementById('pp-voice-select').addEventListener('change', e => {
            prefs.voiceURI = e.target.value;
            localStorage.setItem('ppVoiceVoiceURI', prefs.voiceURI);
        });
        for (const [id, key] of [['pp-rate','rate'],['pp-pitch','pitch'],['pp-volume','volume']]) {
            document.getElementById(id).addEventListener('input', e => {
                prefs[key] = Number(e.target.value);
                localStorage.setItem(`ppVoice${key[0].toUpperCase()}${key.slice(1)}`, String(prefs[key]));
                updateRangeLabels();
            });
        }

        if (!SpeechRecognition) {
            const btn = document.getElementById('pp-voice-btn');
            btn.classList.add('unsupported');
            btn.title = 'El reconocimiento de voz no está disponible en este navegador';
        }

        refreshVoices();
        if (synth && 'onvoiceschanged' in synth) synth.onvoiceschanged = refreshVoices;
    }

    function updateRangeLabels() {
        const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = Number(value).toFixed(1); };
        set('pp-rate-value', prefs.rate); set('pp-pitch-value', prefs.pitch); set('pp-volume-value', prefs.volume);
    }

    function updateVoiceSelect() {
        const select = document.getElementById('pp-voice-select');
        if (!select) return;
        const prefix = LANGUAGES[prefs.language].locale.slice(0, 2).toLowerCase();
        const filtered = voices.filter(v => v.lang.toLowerCase().startsWith(prefix));
        select.innerHTML = '';
        if (!filtered.length) {
            const option = document.createElement('option');
            option.value = ''; option.textContent = `Voz del sistema (${LANGUAGES[prefs.language].label})`;
            select.appendChild(option);
            return;
        }
        filtered.forEach(v => {
            const option = document.createElement('option');
            option.value = v.voiceURI;
            option.textContent = `${v.name} — ${v.lang}${v.localService ? '' : ' · online'}`;
            if (v.voiceURI === prefs.voiceURI) option.selected = true;
            select.appendChild(option);
        });
        if (!prefs.voiceURI || !filtered.some(v => v.voiceURI === prefs.voiceURI)) {
            prefs.voiceURI = filtered[0].voiceURI;
            select.value = prefs.voiceURI;
            localStorage.setItem('ppVoiceVoiceURI', prefs.voiceURI);
        }
    }

    function toggleSettings() {
        ensureUI();
        document.getElementById('pp-voice-panel').classList.remove('visible');
        document.getElementById('pp-voice-status').classList.remove('visible');
        document.getElementById('pp-voice-settings').classList.toggle('visible');
    }

    function showStatus(message, duration = 4300) {
        ensureUI();
        const box = document.getElementById('pp-voice-status');
        document.getElementById('pp-voice-panel').classList.remove('visible');
        document.getElementById('pp-voice-settings').classList.remove('visible');
        box.textContent = message;
        box.classList.add('visible');
        clearTimeout(statusTimer);
        if (duration) statusTimer = setTimeout(() => box.classList.remove('visible'), duration);
    }

    function showList(title, items) {
        ensureUI();
        document.getElementById('pp-voice-status').classList.remove('visible');
        document.getElementById('pp-voice-settings').classList.remove('visible');
        const panel = document.getElementById('pp-voice-panel');
        panel.innerHTML = `<button class="pp-close" data-close-panel aria-label="Cerrar">×</button><h3>${escapeHtml(title)} (${items.length})</h3><ul>${items.map(item => `<li>${escapeHtml(item.name)}</li>`).join('')}</ul>`;
        panel.classList.add('visible');
        panel.querySelector('[data-close-panel]').addEventListener('click', () => panel.classList.remove('visible'));
    }

    function cleanTarget(text) {
        return normalize(text)
            .replace(/^(a|al|la|el|los|las|de|del)\s+/, '')
            .replace(/^(especie|especies|raza|razas|planeta|planetas)\s+/, '')
            .trim();
    }

    function isSpeciesPage() {
        try {
            const here = new URL(window.location.href);
            const species = new URL('Web/Especies.html', siteRootUrl);
            return here.pathname.replace(/\/+$/, '') === species.pathname.replace(/\/+$/, '');
        } catch (_) { return false; }
    }

    function applySpeciesSearch(query) {
        const exactQuery = String(query || '').trim();
        const input = document.getElementById('species-search');
        if (!input) return false;
        input.value = exactQuery;
        const category = document.getElementById('category-filter');
        if (category) category.value = 'todos';
        if (typeof window.filtrarEspecies === 'function') window.filtrarEspecies();
        else input.dispatchEvent(new Event('keyup', { bubbles: true }));
        input.focus({ preventScroll: true });
        try { input.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
        showStatus(`Buscando “${exactQuery}” en especies…`, 2200);
        return true;
    }

    function searchSpecies(query) {
        const exactQuery = String(query || '').trim();
        if (!exactQuery) { go('Web/Especies.html'); return true; }
        if (isSpeciesPage() && applySpeciesSearch(exactQuery)) return true;
        localStorage.setItem('ppPendingSpeciesSearch', exactQuery);
        go('Web/Especies.html');
        return true;
    }

    function applyPendingSpeciesSearch() {
        if (!isSpeciesPage()) return;
        const pending = localStorage.getItem('ppPendingSpeciesSearch');
        if (!pending) return;
        localStorage.removeItem('ppPendingSpeciesSearch');
        // Espera un ciclo para que el ordenado/filtros propios de Especies terminen de inicializarse.
        setTimeout(() => applySpeciesSearch(pending), 80);
    }

    async function findAcrossCatalogs(query) {
        const target = cleanTarget(query);
        const [species, planets] = await Promise.all([loadCatalog('especies'), loadCatalog('planetas')]);
        const s = bestMatch(target, species);
        const p = bestMatch(target, planets);
        if (!s) return p;
        if (!p) return s;
        return s.score >= p.score ? s : p;
    }

    async function openCatalogItem(type, query) {
        const config = catalogSources[type];
        const target = cleanTarget(query);
        if (!target) { go(config.page); return true; }
        const items = await loadCatalog(type);
        const match = bestMatch(target, items);
        if (!match) return false;
        showStatus(`He entendido “${query}” → ${match.name}. Abriendo…`, 1200);
        assistantSpeakSpanish(`Abriendo ${match.name}`);
        setTimeout(() => { window.location.href = match.url; }, 500);
        return true;
    }

    async function listCatalog(type) {
        const items = await loadCatalog(type);
        const label = type === 'especies' ? 'Especies disponibles' : 'Planetas disponibles';
        showList(label, items);
        const names = items.map(i => i.name);
        const spoken = names.length <= 15 ? names.join(', ') : `${names.slice(0, 15).join(', ')} y ${names.length - 15} más`;
        assistantSpeakSpanish(`${label}: ${spoken}`);
        return true;
    }

    async function prepareTranslator(targetLanguage, announceFailure = false) {
        if (targetLanguage === 'es') return null;
        if (translatorCache.has(targetLanguage)) return translatorCache.get(targetLanguage);
        if (!('Translator' in window) || !window.Translator?.create) {
            if (announceFailure) showStatus('Este navegador no dispone de traducción integrada. La lectura en español sí funciona; para traducir prueba una versión compatible de Chrome/Edge con HTTPS.');
            return null;
        }
        try {
            if (window.Translator.availability) {
                const availability = await window.Translator.availability({ sourceLanguage: 'es', targetLanguage });
                if (availability === 'unavailable') throw new Error('Traducción no disponible para este idioma');
                if (availability === 'downloadable' || availability === 'downloading') showStatus(`Preparando traducción a ${LANGUAGES[targetLanguage].label}… puede requerir descargar el modelo del navegador.`, 6500);
            }
            const translator = await window.Translator.create({
                sourceLanguage: 'es',
                targetLanguage,
                monitor(monitor) {
                    monitor.addEventListener('downloadprogress', event => {
                        showStatus(`Preparando traducción: ${Math.round(event.loaded * 100)}%`, 0);
                    });
                }
            });
            translatorCache.set(targetLanguage, translator);
            showStatus(`Traducción a ${LANGUAGES[targetLanguage].label} preparada.`, 1800);
            return translator;
        } catch (error) {
            console.warn('PlanetPedia Translator:', error);
            if (announceFailure) showStatus(`No se ha podido activar la traducción a ${LANGUAGES[targetLanguage].label}. El navegador puede no soportarla o necesitar HTTPS/permisos del modelo.`);
            return null;
        }
    }

    async function protectAndTranslate(text, targetLanguage) {
        if (targetLanguage === 'es') return text;
        const translator = translatorCache.get(targetLanguage) || await prepareTranslator(targetLanguage, false);
        if (!translator) throw new Error('TRANSLATOR_UNAVAILABLE');
        const properNames = await getProperNames();
        const replacements = [];
        let protectedText = text;
        properNames.forEach(name => {
            if (!name || !protectedText.toLocaleLowerCase('es').includes(name.toLocaleLowerCase('es'))) return;
            const token = `__PPNAME${replacements.length}__`;
            const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(escaped, 'gi');
            protectedText = protectedText.replace(re, token);
            replacements.push({ token, name });
        });
        let translated = await translator.translate(protectedText);
        replacements.forEach(({ token, name }) => {
            translated = translated.replace(new RegExp(token, 'gi'), name);
            // Algunos traductores pueden insertar espacios en el marcador.
            const spaced = token.split('').join('\\s*');
            translated = translated.replace(new RegExp(spaced, 'gi'), name);
        });
        return translated;
    }

    function collectReadableBlocks() {
        const selectors = 'h1,h2,h3,h4,h5,h6,p,li,figcaption,blockquote';
        const nodes = [...document.body.querySelectorAll(selectors)];
        const seen = new Set();
        return nodes.filter(el => {
            if (el.closest('#planetpedia-header,#pp-voice-root,nav,footer,aside,.wiki-popup,[aria-hidden="true"]')) return false;
            if (el.hidden || getComputedStyle(el).display === 'none' || getComputedStyle(el).visibility === 'hidden') return false;
            const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
            if (!text || text.length < 2 || seen.has(text)) return false;
            seen.add(text);
            el.dataset.ppReadableText = text;
            return true;
        });
    }

    function clearReadingHighlight() {
        if (reading.currentElement) reading.currentElement.classList.remove('pp-reading-highlight');
        reading.currentElement = null;
    }

    async function startReadingPage(fromUserAction = false) {
        ensureUI();
        stopReading(false);
        const blocks = collectReadableBlocks();
        if (!blocks.length) { showStatus('No encuentro texto principal para leer en esta página.'); return false; }
        if (prefs.language !== 'es') {
            const translator = await prepareTranslator(prefs.language, fromUserAction);
            if (!translator) {
                showStatus(`No puedo traducir automáticamente a ${LANGUAGES[prefs.language].label} en este navegador. Puedes cambiar a Español o probar un navegador compatible con la API Translator mediante HTTPS.`, 7000);
                return false;
            }
        }
        reading.blocks = blocks;
        reading.index = 0;
        reading.active = true;
        reading.paused = false;
        const runId = ++readingRunId;
        showStatus(`Leyendo la página en ${LANGUAGES[prefs.language].label}…`, 2200);
        readNextBlock(runId);
        return true;
    }

    async function readNextBlock(runId) {
        if (!reading.active || reading.paused || runId !== readingRunId) return;
        if (reading.index >= reading.blocks.length) {
            clearReadingHighlight();
            reading.active = false;
            showStatus('Lectura terminada.');
            return;
        }
        const el = reading.blocks[reading.index++];
        const originalText = el.dataset.ppReadableText || el.innerText.trim();
        clearReadingHighlight();
        reading.currentElement = el;
        el.classList.add('pp-reading-highlight');
        try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}

        let text = originalText;
        try {
            text = await protectAndTranslate(originalText, prefs.language);
        } catch (error) {
            if (error?.message === 'TRANSLATOR_UNAVAILABLE') {
                stopReading(false);
                showStatus(`La traducción a ${LANGUAGES[prefs.language].label} no está disponible en este navegador.`, 6500);
                return;
            }
            console.warn('PlanetPedia reader translation:', error);
            text = originalText;
        }
        if (!reading.active || reading.paused || runId !== readingRunId) return;
        reading.lastText = text;
        const utterance = makeUtterance(text, prefs.language);
        utterance.onend = () => { if (reading.active && !reading.paused && runId === readingRunId) readNextBlock(runId); };
        utterance.onerror = () => { if (reading.active && !reading.paused && runId === readingRunId) readNextBlock(runId); };
        try { synth.speak(utterance); } catch (_) { readNextBlock(runId); }
    }

    function togglePauseReading() {
        if (!synth || !reading.active) { showStatus('No hay una lectura activa.'); return false; }
        if (reading.paused) {
            reading.paused = false;
            try { synth.resume(); } catch (_) {}
            showStatus('Lectura reanudada.', 1400);
        } else {
            reading.paused = true;
            try { synth.pause(); } catch (_) {}
            showStatus('Lectura en pausa.', 1400);
        }
        return true;
    }

    function stopReading(showMessage = true) {
        readingRunId++;
        reading.active = false;
        reading.paused = false;
        reading.blocks = [];
        reading.index = 0;
        clearReadingHighlight();
        try { if (synth) synth.cancel(); } catch (_) {}
        if (showMessage) showStatus('Lectura detenida.', 1400);
        return true;
    }

    async function repeatLast() {
        if (!reading.lastText) { showStatus('Todavía no hay ningún texto para repetir.'); return true; }
        await speak(reading.lastText, { langKey: prefs.language, cancel: true });
        return true;
    }

    function changeRate(delta) {
        prefs.rate = Math.max(0.6, Math.min(1.6, Math.round((prefs.rate + delta) * 10) / 10));
        localStorage.setItem('ppVoiceRate', String(prefs.rate));
        const slider = document.getElementById('pp-rate'); if (slider) slider.value = prefs.rate;
        updateRangeLabels();
        showStatus(`Velocidad de lectura: ${prefs.rate.toFixed(1)}×`, 1800);
        return true;
    }

    async function handleCommand(rawText, options = {}) {
        const { silentFallback = false } = options;
        const text = normalize(rawText);
        if (!text) return false;

        // Lector de página.
        if (/^(lee|leer|leeme|léeme)(?:\s+(?:la|esta))?\s+pagina$/.test(text) || /^(comienza|empieza|inicia)\s+(?:la\s+)?lectura$/.test(text)) {
            await startReadingPage(false); return true;
        }
        if (/^(pausa|pausar)(?:\s+la)?\s*lectura$/.test(text) || text === 'pausa') { togglePauseReading(); return true; }
        if (/^(reanuda|reanudar|continua|continuar|sigue)(?:\s+la)?\s*lectura$/.test(text)) {
            if (reading.paused) togglePauseReading(); else if (!reading.active) await startReadingPage(false); return true;
        }
        if (/^(para|parar|deten|detener|termina|terminar)(?:\s+la)?\s*lectura$/.test(text) || text === 'deja de leer') { stopReading(true); return true; }
        if (/^(repite|repetir|repite eso|repite el texto)$/.test(text)) { await repeatLast(); return true; }
        if (/^(habla|lee)\s+mas\s+despacio$/.test(text)) { changeRate(-0.1); return true; }
        if (/^(habla|lee)\s+mas\s+rapido$/.test(text)) { changeRate(0.1); return true; }
        if (/^(velocidad normal|habla normal|lee normal)$/.test(text)) { prefs.rate = 1; localStorage.setItem('ppVoiceRate','1'); updateRangeLabels(); showStatus('Velocidad normal.', 1500); return true; }

        // Idioma de lectura (los comandos siguen escuchándose en español).
        let languageMatch = text.match(/^(?:lee|leer|idioma|pon|cambia a|leer en|lee en)\s+(espanol|español|ingles|inglés|ucraniano|ucraniana)$/);
        if (languageMatch) {
            const spokenLang = normalize(languageMatch[1]);
            prefs.language = spokenLang.startsWith('ing') ? 'en' : spokenLang.startsWith('ucr') ? 'uk' : 'es';
            localStorage.setItem('ppVoiceLanguage', prefs.language);
            prefs.voiceURI = ''; localStorage.removeItem('ppVoiceVoiceURI');
            const select = document.getElementById('pp-language-select'); if (select) select.value = prefs.language;
            updateVoiceSelect();
            showStatus(`Idioma de lectura: ${LANGUAGES[prefs.language].label}.`, 1800);
            return true;
        }

        if (/^(ayuda|comandos|que puedo decir|qué puedo decir)$/.test(text)) {
            showList('Ejemplos de comandos', [
                { name: '“Bazofios” / “Abre Bazofios”' }, { name: '“Busca X” (filtra especies)' }, { name: '“Abre Kalagor”' },
                { name: '“Ve a planetas”' }, { name: '“Lista los planetas”' },
                { name: '“Lista las especies”' }, { name: '“Lee la página”' },
                { name: '“Pausa lectura” / “Reanuda lectura”' }, { name: '“Para la lectura”' },
                { name: '“Lee más despacio” / “Lee más rápido”' }, { name: '“Abre simulación / grupos / parejas”' }, { name: '“Inicio”' }
            ]);
            assistantSpeakSpanish('Puedes navegar, filtrar especies, abrir especies y planetas, abrir juegos, listar catálogos y leer la página.');
            return true;
        }

        if (/\b(lista|listar|dime|muestra|mostrar|cuales son|cuáles son)\b.*\b(especie|especies|razas)\b/.test(text) || /^(especies disponibles)$/.test(text)) { await listCatalog('especies'); return true; }
        if (/\b(lista|listar|dime|muestra|mostrar|cuales son|cuáles son)\b.*\b(planeta|planetas)\b/.test(text) || /^(planetas disponibles)$/.test(text)) { await listCatalog('planetas'); return true; }

        // Juegos individuales. "Abre grupos" abre el juego; "ve a grupos" conserva la sección general.
        let gameMatch = text.match(/^(?:abre|abrir|juega|jugar|inicia|iniciar)\s+(?:el\s+)?(?:juego\s+(?:de\s+)?)?(.+)$/);
        if (gameMatch) {
            const requestedGame = normalize(gameMatch[1]);
            for (const game of games) {
                if (game.names.some(name => normalize(name) === requestedGame)) {
                    showStatus(`Abriendo ${game.label}…`, 900);
                    assistantSpeakSpanish(`Abriendo ${game.label}`);
                    setTimeout(() => go(game.path), 400);
                    return true;
                }
            }
        }

        if (/^(?:buscar|busca|buscame)\s+(?:una\s+|la\s+)?(?:especie|raza)$/.test(text)) { go('Web/Especies.html'); return true; }
        if (/^(?:buscar|busca|buscame)\s+(?:un\s+|el\s+)?planeta$/.test(text)) { go('Web/Planetas.html'); return true; }

        let m = text.match(/^(?:buscar|busca|buscame|abre|abrir|muestra|mostrar|ir a|ve a|vete a)\s+(?:la\s+)?(?:especie|raza)\s+(.+)$/);
        if (m && await openCatalogItem('especies', m[1])) return true;
        m = text.match(/^(?:buscar|busca|buscame|abre|abrir|muestra|mostrar|ir a|ve a|vete a)\s+(?:el\s+)?planeta\s+(.+)$/);
        if (m && await openCatalogItem('planetas', m[1])) return true;

        // "Busca X" ya no abre una ficha: escribe EXACTAMENTE X en el buscador de especies
        // y deja visibles todas las tarjetas cuyo nombre contiene ese texto.
        m = String(rawText || '').trim().match(/^(?:buscar|busca|búscame|buscame)\s+(.+)$/i);
        if (m) {
            let exactQuery = m[1].trim();
            // Permite también "busca especie X" / "busca raza X" sin meter esas palabras en la caja.
            exactQuery = exactQuery.replace(/^(?:la\s+|una\s+)?(?:especie|raza)\s+/i, '').trim();
            searchSpecies(exactQuery);
            return true;
        }

        const navigationPrefix = /^(?:ve a|vete a|ir a|abre|abrir|entra en|lleva me a|llevame a|llévame a)\s+/.test(text);
        const navTarget = text.replace(/^(?:ve a|vete a|ir a|abre|abrir|entra en|lleva me a|llevame a|llévame a)\s+/, '');
        for (const section of sections) {
            if (section.names.some(name => normalize(name) === navTarget || (!navigationPrefix && normalize(name) === text))) {
                showStatus(`Abriendo ${section.names[0]}…`, 900); assistantSpeakSpanish(`Abriendo ${section.names[0]}`);
                setTimeout(() => go(section.path), 400); return true;
            }
        }

        m = text.match(/^(?:abre|abrir|ve a|vete a|ir a|muestra|mostrar)\s+(.+)$/);
        if (m) {
            const candidate = await findAcrossCatalogs(m[1]);
            if (candidate) {
                showStatus(`He entendido “${rawText}” → ${candidate.name}. Abriendo…`, 1200); assistantSpeakSpanish(`Abriendo ${candidate.name}`);
                setTimeout(() => { window.location.href = candidate.url; }, 500); return true;
            }
        }

        // NUEVO: un nombre solo también se busca. "bazofi" puede resolver a "Bazofios".
        // Evitamos frases muy largas para no interpretar conversación normal como una ficha.
        if (text.split(' ').length <= 5) {
            const candidate = await findAcrossCatalogs(text);
            if (candidate && candidate.score >= 0.65) {
                showStatus(`He entendido “${rawText}” como “${candidate.name}”. Abriendo…`, 1400);
                assistantSpeakSpanish(`Creo que has dicho ${candidate.name}. Abriendo.`);
                setTimeout(() => { window.location.href = candidate.url; }, 600); return true;
            }
        }

        if (!silentFallback) {
            showStatus(`No he entendido “${rawText}”. Di “ayuda” para ver ejemplos.`);
            assistantSpeakSpanish('No he entendido el comando. Di ayuda para ver ejemplos.');
        }
        return false;
    }

    async function handleAlternatives(alternatives) {
        // Prueba todas las hipótesis del motor de voz antes de rendirse.
        for (const transcript of alternatives) {
            try {
                if (await handleCommand(transcript, { silentFallback: true })) return true;
            } catch (error) { console.warn('PlanetPedia Voice alternative:', error); }
        }
        const first = alternatives[0] || '';
        showStatus(`No he entendido “${first}”. He probado ${alternatives.length} interpretación${alternatives.length === 1 ? '' : 'es'} del reconocimiento.`);
        assistantSpeakSpanish('No he entendido el comando. Di ayuda para ver ejemplos.');
        return false;
    }

    function startListening() {
        ensureUI();
        if (!SpeechRecognition) {
            showStatus('El reconocimiento de voz no está disponible en este navegador. Prueba Chrome o Edge actualizado.');
            return;
        }
        if (listening) { try { recognition.stop(); } catch (_) {} return; }

        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 8;
        recognition.onstart = () => {
            listening = true;
            document.getElementById('pp-voice-btn')?.classList.add('listening');
            showStatus('Escuchando…', 0);
        };
        recognition.onend = () => {
            listening = false;
            document.getElementById('pp-voice-btn')?.classList.remove('listening');
        };
        recognition.onerror = event => {
            const messages = {
                'not-allowed': 'Necesito permiso para usar el micrófono.',
                'audio-capture': 'No encuentro un micrófono disponible.',
                'no-speech': 'No he oído ninguna orden. Prueba otra vez.',
                'network': 'El servicio de reconocimiento de voz no está disponible ahora.'
            };
            showStatus(messages[event.error] || `Error de voz: ${event.error}`);
        };
        recognition.onresult = event => {
            const alternatives = [...event.results[0]].map(result => result.transcript.trim()).filter(Boolean);
            handleAlternatives(alternatives).catch(error => {
                console.error('PlanetPedia Voice:', error);
                showStatus('Ha ocurrido un problema al procesar el comando.');
            });
        };
        try { recognition.start(); } catch (error) { console.error('PlanetPedia Voice:', error); }
    }

    window.PlanetPediaVoice = {
        listen: startListening,
        execute: handleCommand,
        loadCatalog,
        readPage: () => startReadingPage(true),
        pauseReading: togglePauseReading,
        stopReading,
        settings: prefs
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureUI, { once: true });
        document.addEventListener('DOMContentLoaded', applyPendingSpeciesSearch, { once: true });
    } else {
        ensureUI();
        applyPendingSpeciesSearch();
    }
})();

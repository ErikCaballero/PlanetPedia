(() => {
    const ownScript = document.currentScript;
    if (!ownScript || window.__planetPediaSearchLoaded) return;
    window.__planetPediaSearchLoaded = true;

    const componentsUrl = new URL("./", ownScript.src);
    const siteRootUrl = new URL("../", componentsUrl);
    const indexUrl = new URL("search-index.js", componentsUrl);
    const cssUrl = new URL("search.css", componentsUrl);

    const normalize = (value = "") => value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[’']/g, "")
        .replace(/[^a-z0-9ñ]+/g, " ")
        .trim()
        .replace(/\s+/g, " ");

    const escapeHtml = (value = "") => value.replace(/[&<>'"]/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[char]);

    function addStyles() {
        if (document.querySelector('link[data-planetpedia-search-css]')) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssUrl.href;
        link.dataset.planetpediaSearchCss = "";
        document.head.appendChild(link);
    }

    function loadIndex() {
        if (Array.isArray(window.PLANETPEDIA_SEARCH_INDEX)) {
            return Promise.resolve(window.PLANETPEDIA_SEARCH_INDEX);
        }
        return new Promise((resolve, reject) => {
            const previous = document.querySelector('script[data-planetpedia-search-index]');
            if (previous) {
                previous.addEventListener("load", () => resolve(window.PLANETPEDIA_SEARCH_INDEX || []), { once: true });
                previous.addEventListener("error", reject, { once: true });
                return;
            }
            const script = document.createElement("script");
            script.src = indexUrl.href;
            script.dataset.planetpediaSearchIndex = "";
            script.onload = () => resolve(window.PLANETPEDIA_SEARCH_INDEX || []);
            script.onerror = () => reject(new Error("No se pudo cargar el índice de búsqueda."));
            document.head.appendChild(script);
        });
    }

    function editDistance(a, b, limit = 2) {
        if (Math.abs(a.length - b.length) > limit) return limit + 1;
        const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
        for (let i = 1; i <= a.length; i++) {
            const curr = [i];
            let rowMin = curr[0];
            for (let j = 1; j <= b.length; j++) {
                curr[j] = Math.min(
                    curr[j - 1] + 1,
                    prev[j] + 1,
                    prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
                );
                rowMin = Math.min(rowMin, curr[j]);
            }
            if (rowMin > limit) return limit + 1;
            for (let j = 0; j < curr.length; j++) prev[j] = curr[j];
        }
        return prev[b.length];
    }

    function fuzzyTitleScore(queryTokens, titleNorm) {
        if (!queryTokens.length) return 0;
        const words = titleNorm.split(" ").filter(Boolean);
        let score = 0;
        for (const token of queryTokens) {
            if (token.length < 4 || words.some(w => w.includes(token))) continue;
            const maxDistance = token.length >= 7 ? 2 : 1;
            if (words.some(word => editDistance(token, word, maxDistance) <= maxDistance)) score += 16;
        }
        return score;
    }

    function scoreEntry(entry, query, tokens) {
        const title = entry._titleNorm;
        const text = entry._textNorm;
        const category = entry._categoryNorm;
        let score = 0;

        if (title === query) score += 150;
        else if (title.startsWith(query)) score += 105;
        else if (title.includes(query)) score += 75;

        if (category === query) score += 38;
        else if (category.includes(query)) score += 16;

        if (text.includes(query)) score += 30;

        for (const token of tokens) {
            if (title === token) score += 45;
            else if (title.startsWith(token)) score += 32;
            else if (title.includes(token)) score += 24;

            if (text.includes(token)) score += 7;
            if (category.includes(token)) score += 8;
        }
        score += fuzzyTitleScore(tokens, title);
        return score;
    }

    function highlight(text, rawQuery) {
        if (!rawQuery.trim()) return escapeHtml(text);
        const terms = rawQuery.trim().split(/\s+/).filter(t => t.length > 1).slice(0, 6);
        let output = escapeHtml(text);
        for (const term of terms) {
            const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            output = output.replace(new RegExp(`(${safe})`, "ig"), "<mark>$1</mark>");
        }
        return output;
    }

    function buildUi(index) {
        const entries = index.map(entry => ({
            ...entry,
            _titleNorm: normalize(entry.titulo),
            _textNorm: normalize(`${entry.descripcion || ""} ${entry.texto || ""}`),
            _categoryNorm: normalize(entry.categoria)
        }));

        const overlay = document.createElement("div");
        overlay.className = "pp-search-overlay";
        overlay.setAttribute("role", "presentation");
        overlay.innerHTML = `
            <section class="pp-search-dialog" role="dialog" aria-modal="true" aria-label="Buscar en PlanetPedia">
                <div class="pp-search-head">
                    <span class="pp-search-icon" aria-hidden="true">⌕</span>
                    <input class="pp-search-input" type="search" autocomplete="off" spellcheck="false" aria-label="Buscar" placeholder="Buscar especies, planetas, personajes...">
                    <button class="pp-search-close" type="button" aria-label="Cerrar buscador">Esc</button>
                </div>
                <div class="pp-search-filters" aria-label="Filtrar por categoría"></div>
                <div class="pp-search-results" role="listbox" aria-label="Resultados de búsqueda"></div>
                <div class="pp-search-footer"><span class="pp-search-count">Escribe para buscar</span><span>↑ ↓ seleccionar · Enter abrir</span></div>
            </section>`;
        document.body.appendChild(overlay);

        const input = overlay.querySelector(".pp-search-input");
        const resultsEl = overlay.querySelector(".pp-search-results");
        const filtersEl = overlay.querySelector(".pp-search-filters");
        const countEl = overlay.querySelector(".pp-search-count");
        const closeBtn = overlay.querySelector(".pp-search-close");

        const categoryOrder = ["Especies", "Planetas", "Personajes", "Amenazas", "Grupos", "Cazarrecompensas", "Juegos", "Pilares", "General"];
        const available = new Set(entries.map(e => e.categoria));
        const categories = ["Todos", ...categoryOrder.filter(c => available.has(c)), ...[...available].filter(c => !categoryOrder.includes(c)).sort()];
        let activeCategory = "Todos";
        let selectedIndex = -1;
        let visibleResults = [];
        let lastFocused = null;

        filtersEl.innerHTML = categories.map((cat, i) =>
            `<button type="button" class="pp-search-filter${i === 0 ? " is-active" : ""}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`
        ).join("");

        function categoryIcon(category) {
            return ({
                "Especies": "👽", "Planetas": "🪐", "Personajes": "◈", "Amenazas": "⚠",
                "Grupos": "✦", "Cazarrecompensas": "◎", "Juegos": "🎮", "Pilares": "◆"
            })[category] || "✧";
        }

        function render() {
            const rawQuery = input.value.trim();
            const query = normalize(rawQuery);
            const tokens = query.split(" ").filter(Boolean);

            if (!query) {
                visibleResults = [];
                selectedIndex = -1;
                resultsEl.innerHTML = `<div class="pp-search-empty">Busca por nombre o por contenido. Por ejemplo: <strong>Foxers</strong>, <strong>CROPT</strong> o <strong>Kalagor</strong>.</div>`;
                countEl.textContent = `${entries.length} páginas indexadas`;
                return;
            }

            visibleResults = entries
                .filter(entry => activeCategory === "Todos" || entry.categoria === activeCategory)
                .map(entry => ({ entry, score: scoreEntry(entry, query, tokens) }))
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score || a.entry.titulo.localeCompare(b.entry.titulo, "es"))
                .slice(0, 14);

            selectedIndex = visibleResults.length ? 0 : -1;
            if (!visibleResults.length) {
                resultsEl.innerHTML = `<div class="pp-search-empty">No he encontrado resultados para <strong>${escapeHtml(rawQuery)}</strong>${activeCategory !== "Todos" ? ` en ${escapeHtml(activeCategory)}` : ""}.</div>`;
                countEl.textContent = "0 resultados";
                return;
            }

            resultsEl.innerHTML = visibleResults.map(({ entry }, index) => {
                const href = new URL(entry.url, siteRootUrl).href;
                const image = entry.imagen ? new URL(entry.imagen, siteRootUrl).href : "";
                const snippet = entry.descripcion || entry.texto || "";
                return `<a class="pp-search-result${index === selectedIndex ? " is-selected" : ""}" role="option" aria-selected="${index === selectedIndex}" href="${href}">
                    ${image ? `<img class="pp-search-thumb" src="${image}" alt="" loading="lazy" onerror="this.outerHTML='<span class=&quot;pp-search-thumb-placeholder&quot;>${categoryIcon(entry.categoria)}</span>'">` : `<span class="pp-search-thumb-placeholder">${categoryIcon(entry.categoria)}</span>`}
                    <span class="pp-search-result-main">
                        <span class="pp-search-result-top"><span class="pp-search-title">${highlight(entry.titulo, rawQuery)}</span><span class="pp-search-category">${escapeHtml(entry.categoria)}</span></span>
                        <span class="pp-search-snippet">${highlight(snippet, rawQuery)}</span>
                    </span>
                </a>`;
            }).join("");
            countEl.textContent = `${visibleResults.length}${visibleResults.length === 14 ? "+" : ""} resultado${visibleResults.length === 1 ? "" : "s"}`;
        }

        function updateSelection(next) {
            const links = [...resultsEl.querySelectorAll(".pp-search-result")];
            if (!links.length) return;
            selectedIndex = (next + links.length) % links.length;
            links.forEach((link, i) => {
                link.classList.toggle("is-selected", i === selectedIndex);
                link.setAttribute("aria-selected", i === selectedIndex ? "true" : "false");
            });
            links[selectedIndex].scrollIntoView({ block: "nearest" });
        }

        function open() {
            lastFocused = document.activeElement;
            overlay.classList.add("is-open");
            document.body.classList.add("pp-search-lock");
            setTimeout(() => input.focus(), 0);
            render();
        }

        function close() {
            overlay.classList.remove("is-open");
            document.body.classList.remove("pp-search-lock");
            input.value = "";
            activeCategory = "Todos";
            filtersEl.querySelectorAll(".pp-search-filter").forEach((button, i) => button.classList.toggle("is-active", i === 0));
            render();
            if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
        }

        // API pública: permite que otros componentes (por ejemplo el Voice Controller)
        // utilicen exactamente el mismo buscador que Ctrl/Cmd + K.
        function search(query = "", category = "Todos") {
            const requestedCategory = String(category || "Todos");
            const matchedCategory = categories.find(cat => normalize(cat) === normalize(requestedCategory)) || "Todos";
            activeCategory = matchedCategory;
            filtersEl.querySelectorAll(".pp-search-filter").forEach(button => {
                button.classList.toggle("is-active", button.dataset.category === activeCategory);
            });
            input.value = String(query || "").trim();
            open();
            render();
            input.focus();
            return true;
        }

        window.PlanetPediaSearch = {
            open,
            close,
            search,
            isOpen: () => overlay.classList.contains("is-open")
        };
        window.dispatchEvent(new CustomEvent("planetpedia-search-ready"));

        function mountButton() {
            if (document.querySelector(".pp-search-open")) return true;
            const nav = document.querySelector("#planetpedia-header nav, header nav, .nav-container nav");
            const button = document.createElement("button");
            button.type = "button";
            button.className = `pp-search-open${nav ? "" : " pp-search-fallback"}`;
            button.setAttribute("aria-label", "Buscar en PlanetPedia");
            button.innerHTML = `<span aria-hidden="true">🔎</span><span>Buscar</span><kbd>Ctrl K</kbd>`;
            button.addEventListener("click", open);
            (nav || document.body).appendChild(button);
            return !!nav;
        }

        mountButton();
        if (document.getElementById("planetpedia-header") && !document.querySelector("#planetpedia-header nav")) {
            const observer = new MutationObserver(() => {
                const fallback = document.querySelector(".pp-search-fallback");
                const nav = document.querySelector("#planetpedia-header nav");
                if (nav) {
                    if (fallback) fallback.remove();
                    mountButton();
                    observer.disconnect();
                }
            });
            observer.observe(document.getElementById("planetpedia-header"), { childList: true, subtree: true });
        }

        input.addEventListener("input", render);
        filtersEl.addEventListener("click", event => {
            const button = event.target.closest(".pp-search-filter");
            if (!button) return;
            activeCategory = button.dataset.category;
            filtersEl.querySelectorAll(".pp-search-filter").forEach(b => b.classList.toggle("is-active", b === button));
            render();
            input.focus();
        });
        closeBtn.addEventListener("click", close);
        overlay.addEventListener("mousedown", event => { if (event.target === overlay) close(); });
        input.addEventListener("keydown", event => {
            if (event.key === "ArrowDown") { event.preventDefault(); updateSelection(selectedIndex + 1); }
            else if (event.key === "ArrowUp") { event.preventDefault(); updateSelection(selectedIndex - 1); }
            else if (event.key === "Enter" && selectedIndex >= 0) {
                const link = resultsEl.querySelectorAll(".pp-search-result")[selectedIndex];
                if (link) window.location.href = link.href;
            } else if (event.key === "Escape") close();
        });
        document.addEventListener("keydown", event => {
            const tag = document.activeElement?.tagName?.toLowerCase();
            const typing = tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable;
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                overlay.classList.contains("is-open") ? close() : open();
            } else if (event.key === "/" && !typing && !overlay.classList.contains("is-open")) {
                event.preventDefault();
                open();
            } else if (event.key === "Escape" && overlay.classList.contains("is-open")) {
                close();
            }
        });

        render();
    }

    addStyles();
    const start = () => loadIndex()
        .then(buildUi)
        .catch(error => {
            console.error("PlanetPedia: buscador no disponible:", error);
        });

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
})();

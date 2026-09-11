(() => {
    const script = document.currentScript;
    const placeholder = document.getElementById("planetpedia-header");

    if (!script || !placeholder) {
        console.error("PlanetPedia: no se encontró el contenedor del header.");
        return;
    }

    // La carpeta components está junto a header.js. Esto hace que funcione
    // independientemente de la profundidad de la página y también en GitHub Pages.
    const componentsUrl = new URL("./", script.src);
    const siteRootUrl = new URL("../", componentsUrl);
    const headerUrl = new URL("header.html", componentsUrl);

    fetch(headerUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            placeholder.innerHTML = html;

            // Convierte los enlaces del header en URLs correctas desde la raíz
            // del proyecto, incluso si GitHub Pages usa /nombre-repositorio/.
            placeholder.querySelectorAll("[data-header-link]").forEach(link => {
                link.href = new URL(link.dataset.headerLink, siteRootUrl).href;
            });

            // Marca automáticamente la sección activa.
            const path = decodeURIComponent(window.location.pathname).toLowerCase();
            let activePage = "inicio";

            if (path.includes("/web/planetas/") || path.endsWith("/web/planetas.html")) {
                activePage = "planetas";
            } else if (
                path.includes("/web/razas/") ||
                path.endsWith("/web/especies.html")
            ) {
                activePage = "especies";
            } else if (path.endsWith("/web/lineatemporal.html")) {
                activePage = "linea-temporal";
            } else if (
                path.includes("/web/juegos/") ||
                path.endsWith("/web/juegos.html")
            ) {
                activePage = "juegos";
            }

            placeholder.querySelectorAll("[data-header-page]").forEach(link => {
                link.classList.toggle("active", link.dataset.headerPage === activePage);
            });
        })
        .catch(error => {
            console.error("PlanetPedia: error al cargar el header común:", error);
        });
})();

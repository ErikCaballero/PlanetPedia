(() => {
    const CHARACTERS = [
        {
            name: "Grimlon",
            species: "Ceruleano",
            role: "guerrero",
            roleLabel: "Guerrero",
            title: "Guerrero legendario de los Ceruleanos",
            alias: "Conocido por enfrentarse a cuatro Orrs",
            image: "../Especies alienigenas/Ceruleanos/Grimlon vs 4 orrs.webp",
            href: "personajes/Grimlon.html",
            order: 1
        },
        {
            name: "Karkinox",
            species: "AracnoSephus",
            role: "gobernante",
            roleLabel: "Gobernante",
            title: "Emperador actual del Imperio AracnoSephus",
            alias: "Fundador del Torneo de los Guerreros",
            image: "../Especies alienigenas/AracnoSephus/AracnoSephus.webp",
            href: "personajes/Karkinox.html",
            order: 2
        },
        {
            name: "Ungoliath",
            species: "AracnoSephus Goliath",
            role: "guerrero",
            roleLabel: "Guerrero",
            title: "Campeón histórico del Torneo de los Guerreros",
            alias: "12 veces campeón",
            image: "../Especies alienigenas/AracnoSephus/AracnoSephus Goliath.webp",
            fallbackImage: "../Especies alienigenas/AracnoSephus/AracnoSephus.webp",
            href: "personajes/Ungoliath.html",
            order: 3
        },
        {
            name: "Sakkiro",
            species: "Permian",
            role: "guerrero",
            roleLabel: "Guerrero",
            title: "Espadachín y competidor de élite",
            alias: "Uno de los pocos vencedores de Ungoliath",
            image: "../Especies alienigenas/Permians/Permians vs Ungoliath.webp",
            href: "personajes/Sakkiro.html",
            order: 4
        },
        {
            name: "Faid Foxer",
            species: "Foxer",
            role: "cientifico",
            roleLabel: "Tecnólogo",
            title: "Mente tecnológica de los Guardianes Galácticos",
            alias: "Conocido también como Foxer",
            image: "../Especies alienigenas/Los Foxers/Los Foxers.webp",
            href: "personajes/Faid-Foxer.html",
            order: 5
        },
        {
            name: "Gorvak el Carnicero",
            species: "Grynthar",
            role: "criminal",
            roleLabel: "Criminal",
            title: "Dirigente de una extensa red criminal galáctica",
            alias: "El Rey Criminal",
            image: "../Especies alienigenas/Grynthars/Grynthar sentado.webp",
            href: "personajes/Gorvak-el-Carnicero.html",
            order: 6
        },
        {
            name: "Dravok Mandíbula de Hierro",
            species: "Grynthar",
            role: "guerrero",
            roleLabel: "Guerrero",
            title: "Combatiente célebre por su fuerza y resistencia",
            alias: "Mandíbula de Hierro",
            image: "../Especies alienigenas/Grynthars/Grynthar peleando.webp",
            href: "personajes/Dravok-Mandibula-de-Hierro.html",
            order: 7
        },
        {
            name: "Krag Voss",
            species: "Vorlak",
            role: "criminal",
            roleLabel: "Criminal",
            title: "Fundador y líder de un poderoso cártel",
            alias: "Cabeza criminal Vorlak",
            image: "../Especies alienigenas/Vorlaks/Vorlak Criminal.webp",
            href: "personajes/Krag-Voss.html",
            order: 8
        },
        {
            name: "Garelian",
            species: "Ultramita",
            role: "gobernante",
            roleLabel: "Gobernante",
            title: "Primer emperador Ultramita",
            alias: "Unificador de los Ultramitas",
            image: "../Especies alienigenas/Ultramitas/Ultramita.webp",
            href: "personajes/Garelian.html",
            order: 9
        },
        {
            name: "Cleimus",
            species: "Ultramita",
            role: "gobernante",
            roleLabel: "Gobernante",
            title: "Segundo emperador Ultramita",
            alias: "350 años al frente de su especie",
            image: "../Especies alienigenas/Ultramitas/Ultramita.webp",
            href: "personajes/Cleimus.html",
            order: 10
        },
        {
            name: "El Emperador Ultramita",
            species: "Ultramita",
            role: "gobernante",
            roleLabel: "Gobernante",
            title: "Emperador que inició la expansión interestelar Ultramita",
            alias: "El Conquistador · El Supremo",
            image: "../Especies alienigenas/Ultramitas/Emperador Ultramita.webp",
            href: "personajes/Emperador-Ultramita.html",
            order: 11
        },
        {
            name: "Soberano Secreto",
            species: "Invasor X",
            role: "gobernante",
            roleLabel: "Gobernante",
            title: "Antiguo líder supremo de los Invasores X",
            alias: "Identidad real desconocida",
            image: "../Especies alienigenas/Invasores X/Soberano Secreto.webp",
            href: "personajes/Soberano-Secreto.html",
            order: 12
        }
    ];

    const grid = document.getElementById("charactersGrid");
    const search = document.getElementById("characterSearch");
    const speciesFilter = document.getElementById("speciesFilter");
    const sort = document.getElementById("sortCharacters");
    const roleFilters = document.getElementById("roleFilters");
    const resultCount = document.getElementById("resultCount");
    const emptyState = document.getElementById("emptyState");
    const clearFilters = document.getElementById("clearFilters");
    const metricCharacters = document.getElementById("metricCharacters");
    const metricRoles = document.getElementById("metricRoles");

    if (!grid) return;

    let activeRole = "all";

    const normalize = (value = "") => String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[character]));

    const populateSpecies = () => {
        const species = [...new Set(CHARACTERS.map(character => character.species))]
            .sort((a, b) => a.localeCompare(b, "es"));

        species.forEach(name => {
            const option = document.createElement("option");
            option.value = normalize(name);
            option.textContent = name;
            speciesFilter.appendChild(option);
        });
    };

    const cardTemplate = character => `
        <article class="character-card" data-role="${escapeHTML(character.role)}">
            <a class="character-card__image" href="${escapeHTML(character.href)}" aria-label="Abrir registro de ${escapeHTML(character.name)}">
                <img
                    src="${escapeHTML(character.image)}"
                    alt="${escapeHTML(character.name)}"
                    loading="lazy"
                    ${character.fallbackImage ? `data-fallback="${escapeHTML(character.fallbackImage)}"` : ""}
                >
            </a>
            <div class="character-card__body">
                <div class="character-card__meta">
                    <span class="character-role">${escapeHTML(character.roleLabel)}</span>
                    <span class="character-species">${escapeHTML(character.species)}</span>
                </div>
                <h3>${escapeHTML(character.name)}</h3>
                <p class="character-title">${escapeHTML(character.title)}</p>
                <div class="character-card__footer">
                    <span class="character-alias" title="${escapeHTML(character.alias)}">${escapeHTML(character.alias)}</span>
                    <a class="character-open" href="${escapeHTML(character.href)}">Registro →</a>
                </div>
            </div>
        </article>
    `;

    const getFilteredCharacters = () => {
        const query = normalize(search.value);
        const selectedSpecies = speciesFilter.value;

        let characters = CHARACTERS.filter(character => {
            const haystack = normalize([
                character.name,
                character.species,
                character.roleLabel,
                character.title,
                character.alias
            ].join(" "));

            const matchesSearch = !query || haystack.includes(query);
            const matchesRole = activeRole === "all" || character.role === activeRole;
            const matchesSpecies = selectedSpecies === "all" || normalize(character.species) === selectedSpecies;

            return matchesSearch && matchesRole && matchesSpecies;
        });

        if (sort.value === "name-asc") {
            characters.sort((a, b) => a.name.localeCompare(b.name, "es"));
        } else if (sort.value === "name-desc") {
            characters.sort((a, b) => b.name.localeCompare(a.name, "es"));
        } else if (sort.value === "species") {
            characters.sort((a, b) => a.species.localeCompare(b.species, "es") || a.name.localeCompare(b.name, "es"));
        } else {
            characters.sort((a, b) => a.order - b.order);
        }

        return characters;
    };

    const render = () => {
        const characters = getFilteredCharacters();
        grid.innerHTML = characters.map(cardTemplate).join("");

        grid.querySelectorAll("img[data-fallback]").forEach(image => {
            image.addEventListener("error", () => {
                if (image.dataset.fallback && image.src !== image.dataset.fallback) {
                    image.src = image.dataset.fallback;
                }
            }, { once: true });
        });

        const count = characters.length;
        resultCount.textContent = `${count} ${count === 1 ? "registro" : "registros"}`;
        emptyState.hidden = count !== 0;
        grid.hidden = count === 0;
    };

    const reset = () => {
        activeRole = "all";
        search.value = "";
        speciesFilter.value = "all";
        sort.value = "featured";
        roleFilters.querySelectorAll(".role-filter").forEach(button => {
            button.classList.toggle("active", button.dataset.role === "all");
        });
        render();
    };

    roleFilters.addEventListener("click", event => {
        const button = event.target.closest(".role-filter");
        if (!button) return;

        activeRole = button.dataset.role;
        roleFilters.querySelectorAll(".role-filter").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        render();
    });

    search.addEventListener("input", render);
    speciesFilter.addEventListener("change", render);
    sort.addEventListener("change", render);
    clearFilters.addEventListener("click", reset);

    populateSpecies();
    metricCharacters.textContent = String(CHARACTERS.length).padStart(2, "0");
    metricRoles.textContent = String(new Set(CHARACTERS.map(character => character.role)).size).padStart(2, "0");
    render();
})();

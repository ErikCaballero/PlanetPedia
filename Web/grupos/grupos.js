/* ================================================================
   JS DE LAS FICHAS DE GRUPOS
   - Barras de capacidades mediante data-value="0-100"
   - Paneles desplegables mediante data-toggle="id-del-panel"
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initPowerBars();
    initCollapsibles();
});

function initPowerBars() {
    const stats = document.querySelectorAll('.power-stat');

    stats.forEach((stat, index) => {
        let value = Number(stat.dataset.value || 0);

        // Limita el valor entre 0 y 100
        value = Math.max(0, Math.min(100, value));

        const fill = stat.querySelector('.power-track span');
        const label = stat.querySelector('.power-label strong');

        // Muestra el número
        if (label) {
            label.textContent = value;
        }

        // Anima la barra
        if (fill) {
            setTimeout(() => {
                fill.style.width = `${value}%`;
            }, 120 + index * 85);
        }
    });
}

function initCollapsibles() {
    const botones = document.querySelectorAll('[data-toggle]');

    botones.forEach(button => {
        const targetId = button.dataset.toggle;
        const panel = document.getElementById(targetId);

        // Si no encuentra el panel correspondiente, ignora el botón
        if (!panel) return;

        button.addEventListener('click', () => {
            const isOpen = panel.classList.toggle('open');

            // Accesibilidad
            button.setAttribute('aria-expanded', String(isOpen));
        });
    });
}

function toggleSection(panelId, flechaId) {
    const panel = document.getElementById(panelId);
    const flecha = document.getElementById(flechaId);

    panel.classList.toggle("oculto");
    flecha.classList.toggle("rotada");
}
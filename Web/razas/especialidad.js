    const especializaciones = document.querySelector('.especializaciones');
    const botonEspecializaciones =
        especializaciones.querySelector('.especializaciones-btn');

    const iconoEspecializaciones =
        especializaciones.querySelector('.especializaciones-icono');

    botonEspecializaciones.addEventListener('click', () => {

        const abierto =
            especializaciones.classList.toggle('abierto');

        iconoEspecializaciones.textContent =
            abierto ? '−' : '+';

    });
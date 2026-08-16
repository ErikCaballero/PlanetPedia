    function toggleSection(panelId, flechaId) {
        const panel = document.getElementById(panelId);
        const flecha = document.getElementById(flechaId);
        
        if (panel.classList.contains('oculto')) {
            // Desplegar
            panel.classList.remove('oculto');
            flecha.classList.add('rotada');
            
            // Forzar estilos inline para sobreescribir la clase .oculto suavemente
            panel.style.maxHeight = panel.scrollHeight + 100 + "px";
            panel.style.opacity = "1";
            panel.style.padding = "15px";
            panel.style.marginTop = "10px";
            panel.style.border = "1px solid #333";
            panel.style.borderLeft = "3px solid #4ffbdf";
        } else {
            // Plegar
            panel.classList.add('oculto');
            flecha.classList.remove('rotada');
            
            // Revertir estilos inline
            panel.style.maxHeight = "0";
            panel.style.opacity = "0";
            panel.style.padding = "0";
            panel.style.marginTop = "0";
            panel.style.border = "none";
        }
    }
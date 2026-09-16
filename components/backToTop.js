(() => {
  "use strict";

  // PlanetPedia — componente global "Volver arriba".
  // Cambia solo este valor si algún día quieres modificar el umbral en toda la web.
  const SHOW_AFTER = 0.40;

  const STYLE_ID = "planetpedia-back-to-top-styles";
  const BUTTON_ID = "planetpedia-back-to-top";

  const styles = `
    .pp-back-to-top {
      --pp-arrow-blue: #2d9cff;
      --pp-ring-track: rgba(255, 255, 255, .14);
      --pp-ring-progress: 0deg;

      position: fixed;
      left: 22px;
      bottom: 28px;
      z-index: 9999;
      width: 54px;
      height: 54px;
      padding: 0;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background: conic-gradient(
        var(--pp-arrow-blue) var(--pp-ring-progress),
        var(--pp-ring-track) 0
      );
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(46px);
      transition:
        opacity .38s ease,
        transform .5s cubic-bezier(.16, .84, .32, 1),
        visibility .38s ease;
      filter: drop-shadow(0 9px 22px rgba(0, 0, 0, .32));
    }

    .pp-back-to-top::before {
      content: "";
      position: absolute;
      inset: 3px;
      border-radius: inherit;
      border: 1px solid rgba(45, 156, 255, .18);
      background: rgba(15, 18, 28, .94);
      box-shadow:
        inset 0 0 18px rgba(45, 156, 255, .035),
        0 0 0 1px rgba(0, 0, 0, .12);
    }

    .pp-back-to-top::after {
      content: "";
      position: absolute;
      inset: 0;
      border: 1px solid rgba(45, 156, 255, .42);
      border-radius: inherit;
      opacity: 0;
      transform: scale(.94);
      pointer-events: none;
    }

    .pp-back-to-top__arrow {
      position: relative;
      z-index: 1;
      display: block;
      color: var(--pp-arrow-blue);
      font-size: 2rem;
      font-weight: 800;
      line-height: .85;
      transform: translateY(-1px);
      text-shadow: 0 0 10px rgba(45, 156, 255, .35);
      transition: transform .18s ease, text-shadow .18s ease;
    }

    .pp-back-to-top.is-visible {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0);
    }

    .pp-back-to-top.is-visible::after {
      animation: ppBackToTopRing 2.7s ease-out infinite;
    }

    .pp-back-to-top:hover .pp-back-to-top__arrow,
    .pp-back-to-top:focus-visible .pp-back-to-top__arrow {
      transform: translateY(-4px);
      text-shadow: 0 0 14px rgba(45, 156, 255, .55);
    }

    .pp-back-to-top:focus-visible {
      outline: 2px solid rgba(45, 156, 255, .75);
      outline-offset: 4px;
    }

    @keyframes ppBackToTopRing {
      0% {
        opacity: .58;
        transform: scale(.94);
      }
      72%, 100% {
        opacity: 0;
        transform: scale(1.34);
      }
    }

    @media (max-width: 700px) {
      .pp-back-to-top {
        left: 14px;
        bottom: 18px;
        width: 50px;
        height: 50px;
      }

      .pp-back-to-top__arrow {
        font-size: 1.85rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .pp-back-to-top {
        transition: opacity .15s ease, visibility .15s ease;
        transform: none;
      }

      .pp-back-to-top.is-visible::after {
        animation: none;
      }

      .pp-back-to-top__arrow {
        transition: none;
      }
    }
  `;

  function initBackToTop() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = styles;
      document.head.appendChild(style);
    }

    let button = document.getElementById(BUTTON_ID);
    if (!button) {
      button = document.createElement("button");
      button.id = BUTTON_ID;
      button.className = "pp-back-to-top";
      button.type = "button";
      button.setAttribute("aria-label", "Volver al inicio de la página");
      button.title = "Volver arriba";
      button.innerHTML = '<span class="pp-back-to-top__arrow" aria-hidden="true">↑</span>';
      document.body.appendChild(button);
    }

    let ticking = false;

    const update = () => {
      const root = document.documentElement;
      const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 0);
      const progress = maxScroll > 0
        ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
        : 0;

      button.classList.toggle("is-visible", maxScroll > 0 && progress >= SHOW_AFTER);
      button.style.setProperty("--pp-ring-progress", `${progress * 360}deg`);
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    button.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackToTop, { once: true });
  } else {
    initBackToTop();
  }
})();

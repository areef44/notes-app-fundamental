import { animate } from "animejs"; // Jangan pakai 'animejs/lib/anime.es.js'

class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });

    this._shadowRoot.innerHTML = `
      <style>
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 6px solid #636363;
          border-top-color: salmon;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      </style>
      <div class="overlay">
        <div class="spinner"></div>
      </div>
    `;
  }

  connectedCallback() {
    // Bisa tambah animasi pakai anime.js jika mau
    animate(this._spinner, {
      rotate: 360,
      duration: 1000,
      ease: "linear",
      loop: true,
    });
  }
}

customElements.define("loading-indicator", LoadingIndicator);

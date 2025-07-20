class AppBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _title = "NEED APP BAR TITLE";

  static get observedAttributes() {
    return ["title"];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") {
      this._title = newValue;
      this.render();
    }
  }

  set title(value) {
    this._title = value;
    this.render();
  }

  get title() {
    return this._title;
  }

  _updateStyle() {
    this._style.textContent = `
            :host {
                display: block;
                width: 100%;
                color: #e8f9ff;
                box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
            }
        
            div {
                padding: 24px 20px;
                background-color: #FB929E;
            }
        
            .brand-name {
                margin: 0;
                font-size: 1.7em;
            }
            `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
        <div>
            <h1 class="brand-name" id="brand-title">${this.title}</h1>
        </div>
        `;
  }
}

customElements.define("app-bar", AppBar);

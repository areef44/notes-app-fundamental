class FooterBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _title = "NEED FOOTER BAR TITLE";

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
                  color: white;
                  font-weight: bold;
              }
          
              div {
                  padding: 24px 20px;
                  text-align: center;
                  background-color: #0a2540;
              }
          `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
        <div>
          ${this.title}
        </div>
          `;
  }
}

customElements.define("footer-bar", FooterBar);

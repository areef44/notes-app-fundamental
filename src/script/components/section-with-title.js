class SectionWithTitle extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _title = "NEED SECTION TITLE";

  static get observedAttributes() {
    return ["title"];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
              :host {
                  display: block;
              }
              
              .title-section {
                  font-size: 1rem;
                  color: #666;
                  margin-top: 4px;
                  margin-bottom: 4px;
              }

              .title-section span {
                font-size: 24px;
                font-weight: bold;
              }
            
      `;
  }

  set title(value) {
    this._title = value;
  }

  get title() {
    return this._title;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
          <section id="note" class="note">
              <div class="title-section">
                  <span>${this.title}</span>
              </div>
  
              <div class="item-slot">
                  <slot></slot>
              </div>
          </section>
      `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "title":
        this.title = newValue;
        break;
    }

    this.render();
  }
}

customElements.define("section-with-title", SectionWithTitle);

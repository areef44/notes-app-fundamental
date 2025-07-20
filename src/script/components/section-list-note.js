class SectionList extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _title = "NEED SECTION LIST TITLE";

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
              
              .note {
                background-color: #FB929E;
                padding: 16px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                margin-bottom: 20px;
              }

              .title-section {
                  margin-block-end: 1rem;
                  font-size: 1.2em;
                  color: #e8f9ff;
              }

              .item-slot{
                padding: 8px;
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
                  <h3>${this.title}</h3>
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

customElements.define("section-list-note", SectionList);

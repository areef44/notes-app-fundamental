import Utils from "./../utils.js";

class NoteList extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _column = 4;
  _gutter = 16;
  _notes = [];

  static get observedAttributes() {
    return ["column", "gutter"];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
  }

  // SETTER + GETTER

  set column(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue)) return;
    this._column = newValue;
  }

  get column() {
    return this._column;
  }

  set gutter(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue)) return;
    this._gutter = newValue;
  }

  get gutter() {
    return this._gutter;
  }

  set notes(value) {
    this._notes = value;
    this.render();
  }

  get notes() {
    return this._notes;
  }

  // STYLE
  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }

      .list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: ${this.gutter}px;
        min-height: 275px;
      }

      .empty-message {
        grid-column: 1 / -1; 
        text-align: center;
        padding: 80px 20px;
        color: white;
        font-size: 24px;
        font-style: italic;
        font-weight: bold;
      }

      @media screen and (max-width: 1200px) {
        .list {
          grid-template-columns: repeat(4, 1fr);
        }
      }
      
      @media screen and (max-width: 992px) {
        .list {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      @media screen and (max-width: 768px) {
        .list {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media screen and (max-width: 576px) {
        .list {
          grid-template-columns: repeat(1, 1fr);
        }
      }
      
      @media screen and (max-width: 320px) {
        .list {
          grid-template-columns: repeat(1, 1fr);
        }
      }

    `;
  }

  // EMPTY
  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  // RENDER
  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    if (this._notes.length === 0) {
      this._shadowRoot.innerHTML += `
        <div class="list">
          <div class="empty-message">Tidak ada catatan tersedia</div>
        </div>
      `;
    } else {
      this._shadowRoot.innerHTML += `
        <div class="list">
          <slot></slot>
        </div>
      `;
    }
  }

  // HARUS attributeChangedCallback (bukan attributeChangeCallback)
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "column":
        this.column = newValue;
        break;
      case "gutter":
        this.gutter = newValue;
        break;
    }

    this.render();
  }
}

customElements.define("note-list", NoteList);

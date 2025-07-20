// NoteItem Component - Updated (Remove draggable from shadow DOM)
class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  set note(value) {
    this._note = value;
    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
        overflow: hidden;
        color: black;
      }

      .note-info {
        flex-grow: 1;
        overflow: hidden;
      }

      .note-info__title h2 {
        font-weight: lighter;
      }

      .note-info__description p {
        display: -webkit-box;
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3; /* bisa atur berapa baris yang tampil */
      }

      .card {
        background-color: #FFF6F6;
        box-sizing: border-box;
        cursor: pointer;
        user-select: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between; /* Supaya tombol selalu di bawah */
        padding: 16px;
      }

      .card.dragging {
        cursor: move;
        background-color: white !important;
        opacity: 1 !important;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
      }

      .btn-delete {
        width: 100%;
      }
      
      .btn-delete button {
        background-color: salmon;
        color: white;
        width: 100%;
        height: 100%;
        display: block;
        padding: 8px;
        border: 0;
        font-size: 16px;
        cursor: pointer;
        font-weight: bold
      }

      .btn-delete button:hover {
        background-color: white;
        color: black;
      }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    const createdAtFormatted = new Date(this._note.createdAt).toLocaleString(
      "id-ID"
    );

    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="card">
        <div class="note-info">
          <div class="note-info__title">
            <h2>${this._note.title}</h2>
          </div>
          <div class="note-info__description">
            <p><strong>Content:</strong></p>
            <p>${this._note.body}</p>
          </div>
          <div class="note-info__description">
            <p><strong>Dibuat:</strong> ${createdAtFormatted}</p>
          </div>  
        </div>
      </div>
      <div class="btn-delete">
          <button>Delete</button>
      </div>
    `;

    const card = this._shadowRoot.querySelector(".card");

    if (card) {
      // Click handler for opening detail
      card.addEventListener("click", () => {
        const modal = document.querySelector("note-detail");
        if (modal) {
          modal.showDetail(this._note.id);
        }
      });
    }

    const deleteButton = this._shadowRoot.querySelector(".btn-delete button");
    if (deleteButton) {
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Supaya tidak ikut klik ke card
        this.dispatchEvent(
          new CustomEvent("delete-note", {
            detail: { id: this._note.id },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }
}

customElements.define("note-item", NoteItem);

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
        min-height: 275px;
        max-width: 275px;
        height: 100%;
        width: 100%;
      }

      .note-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .note-info {
        padding: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .note-info__title span {
        font-weight: bold;
        font-size: 24px;
        margin: 0;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }

      .note-info__title {
        margin-bottom: 12px;
      }

      .note-info__description {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .note-info__description p {
        margin: 0 0 8px 0;
        font-size: 14px;
        line-height: 1.4;
        white-space: pre-line;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .note-content {
        flex: 1;
        overflow: hidden;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: pre-line;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
      }

      .note-date {
        margin-top: auto;
        padding-top: 8px;
        font-size: 12px;
        color: #666;
        border-top: 1px solid #eee;
      }

      .card {
        background-color: white;
        flex: 1; 
        box-sizing: border-box;
        cursor: pointer;
        user-select: none;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .card.dragging {
        cursor: move;
        background-color: white !important;
        opacity: 1 !important;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
      }

      .btn-delete {
        height: 44px;
        flex-shrink: 0;
      }
      
      .btn-delete button {
        background-color: #ff6692;
        color: white;
        width: 100%;
        height: 100%;
        display: block;
        padding: 0;
        border: 0;
        font-size: 14px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s ease;
      }

      .btn-delete button:hover {
        background-color: #e84371;
        color: white;
      }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    const createdAtFormatted = new Date(this._note.createdAt).toLocaleString(
      "id-ID",
    );

    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
    <div class="note-container">
    <div class="card">
      <div class="note-info">
        <div class="note-info__title">
          <span>${this._note.title}</span>
        </div>
        <div class="note-info__description">
          <p><strong>Content:</strong></p>
          <p class="note-content">${this._note.body}</p>
        </div>
        <div class="note-date">
          <p><strong>Dibuat:</strong> ${createdAtFormatted}</p>
        </div>
      </div>
    </div>
    <div class="btn-delete">
      <button>Delete</button>
    </div>
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
          }),
        );
      });
    }
  }
}

customElements.define("note-item", NoteItem);

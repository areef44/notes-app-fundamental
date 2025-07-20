import NotesApi from "../data/remote/notes-api";

class NoteDetail extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });

    this._shadowRoot.innerHTML = `
      <style>
        .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          background-color: white;
          margin: 15% auto;
          padding: 24px;
          border-radius: 8px;
          width: 80%;
          max-width: 600px;
          min-height: 200px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .title-content {
          font-weight: bold;
          font-size: 24px;
          margin: 0 0 16px 0;
          word-wrap: break-word;
        }

        .body-content {
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-line;
          word-wrap: break-word;
          margin-bottom: 16px;
        }

        .text-body {
          font-size: 16px;
          display: block;
          margin-top: 4px;
        }

        .date-note {
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 12px;
        }

        #close-btn {
          margin-top: 24px;
          padding: 8px 16px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        #close-btn:hover {
          background-color: #d32f2f;
        }
      </style>

      <div class="modal" id="modal">
        <div class="modal-content">
          <div id="note-info"></div>
          <button id="close-btn">Close</button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const modal = this._shadowRoot.querySelector("#modal");
    const closeBtn = this._shadowRoot.querySelector("#close-btn");

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  async showDetail(noteId) {
    const modal = this._shadowRoot.querySelector("#modal");
    const noteInfo = this._shadowRoot.querySelector("#note-info");

    modal.style.display = "block";
    noteInfo.innerHTML = "";

    try {
      const response = await NotesApi.getDetailNote(noteId);

      const titleEl = document.createElement("h3");
      titleEl.className = "title-content";
      titleEl.textContent = response.title;

      const bodyEl = document.createElement("p");
      bodyEl.className = "body-content";
      bodyEl.innerHTML = `
        Content:
        <span class="text-body">${response.body}</span>
      `;

      const createdAtEl = document.createElement("p");
      createdAtEl.className = "date-note";
      createdAtEl.textContent = `Created At: ${new Date(response.createdAt).toLocaleString()}`;

      noteInfo.appendChild(titleEl);
      noteInfo.appendChild(bodyEl);
      noteInfo.appendChild(createdAtEl);
    } catch (error) {
      console.error("Gagal mengambil detail:", error);
      noteInfo.innerHTML = `<p style="color:red;">Gagal memuat data detail.</p>`;
    }
  }
}

customElements.define("note-detail", NoteDetail);

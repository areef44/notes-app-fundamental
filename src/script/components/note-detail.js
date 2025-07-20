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
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0,0,0,0.5);
        }

        .modal-content {
          background-color: white;
          margin: 10% auto;
          padding: 20px;
          border-radius: 5px;
          width: 80%;
          max-width: 500px;
        }

        .dynamic-content {
          margin: 8px 0;
        }
      </style>

      <div class="modal" id="modal">
        <div class="modal-content">
          <h2>Note Detail</h2>
          <div id="note-info"></div>
          <button id="close-btn">Close</button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const closeBtn = this.shadowRoot.querySelector("#close-btn");
    const modal = this.shadowRoot.querySelector("#modal");

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Tambahan: klik luar modal untuk close
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  async showDetail(noteId) {
    const modal = this.shadowRoot.querySelector("#modal");
    const noteInfo = this.shadowRoot.querySelector("#note-info");

    modal.style.display = "block";

    try {
      const response = await NotesApi.getDetailNote(noteId);

      noteInfo.innerHTML = "";

      const titleEl = document.createElement("p");
      titleEl.className = "dynamic-content";
      titleEl.textContent = `Title: ${response.title}`;

      const bodyEl = document.createElement("p");
      bodyEl.className = "dynamic-content";
      bodyEl.textContent = `Body: ${response.body}`;

      const createdAtEl = document.createElement("p");
      createdAtEl.className = "dynamic-content";
      createdAtEl.textContent = `Created At: ${new Date(response.createdAt).toLocaleString()}`;

      const archivedEl = document.createElement("p");
      archivedEl.className = "dynamic-content";
      archivedEl.textContent = `Archived: ${response.archived ? "Yes" : "No"}`;

      // Sisipkan ke DOM
      noteInfo.appendChild(titleEl);
      noteInfo.appendChild(bodyEl);
      noteInfo.appendChild(createdAtEl);
      noteInfo.appendChild(archivedEl);
    } catch (error) {
      console.error("Gagal mengambil detail:", error);
      noteInfo.innerHTML = `<p class="dynamic-content" style="color:red;">Gagal memuat data detail.</p>`;
    }
  }
}

customElements.define("note-detail", NoteDetail);

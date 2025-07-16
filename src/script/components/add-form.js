import FormValidator from "./form-custom-validation.js";
class AddForm extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _submitEvent = "submit";
  _addNoteEvent = "add-note";

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    const form = this._shadowRoot.querySelector("form");
    const titleInput = this._shadowRoot.querySelector("#title");
    const bodyInput = this._shadowRoot.querySelector("#body");
    const titleError = this._shadowRoot.querySelector("#title-error");
    const bodyError = this._shadowRoot.querySelector("#body-error");

    let touched = {
      title: false,
      body: false,
    };

    const validateField = (field) => {
      const value = field.value.trim();
      let msg = "";

      if (field.id === "title") {
        msg = FormValidator.getTitleError(value);
        if (touched.title) titleError.textContent = msg;
      }

      if (field.id === "body") {
        msg = FormValidator.getBodyError(value);
        if (touched.body) bodyError.textContent = msg;
      }

      return !msg;
    };

    titleInput.addEventListener("input", () => {
      touched.title = true;
      validateField(titleInput);
    });

    bodyInput.addEventListener("input", () => {
      touched.body = true;
      validateField(bodyInput);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      touched.title = true;
      touched.body = true;

      const isTitleValid = validateField(titleInput);
      const isBodyValid = validateField(bodyInput);

      if (!isTitleValid || !isBodyValid) return;

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();

      this.dispatchEvent(
        new CustomEvent("add-note", {
          detail: { title, body },
          bubbles: true,
        })
      );

      form.reset();
      touched = { title: false, body: false };
      titleError.textContent = "";
      bodyError.textContent = "";
    });
  }

  disconnectedCallback() {
    this._shadowRoot
      .querySelector("form")
      .removeEventListener("submit", (event) =>
        this._onFormSubmit(event, this)
      );
    this.removeEventListener(this._submitEvent, this._onFormSubmit);
  }

  _onFormSubmit(event) {
    event.preventDefault();
    const title = this._shadowRoot.querySelector("#title").value;
    const body = this._shadowRoot.querySelector("#body").value;

    if (!title || !body) return;

    this.dispatchEvent(
      new CustomEvent(this._addNoteEvent, {
        detail: { title, body },
        bubbles: true,
      })
    );

    this._shadowRoot.querySelector("form").reset();
  }

  _updateStyle() {
    this._style.textContent = `
        :host {
            display: block;
          }
    
          .form-container {
            background-color: #FB929E;
            padding: 16px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            margin-bottom: 20px;
          }
    
          form {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
    
          input, textarea {
            padding: 12px;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
    
          button {
            padding: 10px;
            font-size: 1rem;
            background-color: #FFF6F6;
            color: black;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
          }
    
          button:hover {
            background-color: #AEDEFC;
            color: white;
            font-weight: bold;
          }

          .error-message {
            color: red;
            font-size: 0.8rem;
            margin-top: -8px;
            margin-bottom: 8px;
          }
        `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
        <div class="form-container">
        <form>
          <label>Title</label>
          <input id="title" name="title" type="text" placeholder="Judul catatan" />
          <small id="title-error" class="error-message"></small>
          <label>Content</label>
          <textarea id="body" name="body" placeholder="Isi catatan..." rows="4"></textarea>
          <small id="body-error" class="error-message"></small>
          <button type="submit">Tambah Catatan</button>
        </form>
      </div>
        `;
  }
}

customElements.define(`add-form`, AddForm);

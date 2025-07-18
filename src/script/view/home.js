import Utils from "../utils.js";
import NotesApi from "../data/remote/notes-api.js";

const home = () => {
  const activeNoteListElement = document.querySelector("#activeNoteList");
  const archivedNoteListElement = document.querySelector("#archivedNoteList");
  const addNoteForm = document.querySelector("add-form");

  addNoteForm.addEventListener("add-note", async (event) => {
    const { title, body } = event.detail;

    const newNote = {
      id: "notes-" + Date.now(),
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    await NotesApi.createNote(newNote);

    await showNotes();
  });

  const showNotes = async () => {
    try {
      const activeNotes = await NotesApi.getActiveNotes();
      const archivedNotes = await NotesApi.getArchivedNotes();
      displayResult(activeNotes, archivedNotes);
      showNoteList();
    } catch (error) {
      console.log(error);
    }
  };

  const displayResult = (activeNotes, archivedNotes) => {
    const createNoteItems = (notes) =>
      notes.map((note) => {
        const noteItemElement = document.createElement("note-item");
        noteItemElement.note = note;
        return noteItemElement;
      });

    Utils.emptyElement(activeNoteListElement);
    Utils.emptyElement(archivedNoteListElement);

    activeNoteListElement.append(...createNoteItems(activeNotes));
    archivedNoteListElement.append(...createNoteItems(archivedNotes));
  };

  const showNoteList = () => {
    Utils.showElement(activeNoteListElement);
    Utils.showElement(archivedNoteListElement);
  };

  // Inisialisasi tampilan langsung
  showNotes();
};

export default home;

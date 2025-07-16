import Utils from "../utils.js";
import Notes from "../data/local/notes.js";

const home = () => {
  const activeNoteListElement = document.querySelector("#activeNoteList");
  const archivedNoteListElement = document.querySelector("#archivedNoteList");
  const addNoteForm = document.querySelector('add-form')

  addNoteForm.addEventListener("add-note", (event) => {
    const { title, body } = event.detail;

    const newNote = {
      id: 'notes-' + Date.now(),
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false
    }

    Notes.addNote(newNote)

    showNotes();
  })

  const showNotes = () => {

    const notes = Notes.getAll();

    const activeNotes = notes.filter((note) => !note.archived);
    const archivedNotes = notes.filter((note) => note.archived);

    displayResult(activeNotes, archivedNotes);

    showNoteList();
  };

  const displayResult = (activeNotes, archivedNotes) => {
    const createNoteItems = (notes) => notes.map((note) => {
        const noteItemElement = document.createElement('note-item');
        noteItemElement.note = note;
        return noteItemElement;
    });

    Utils.emptyElement(activeNoteListElement);
    Utils.emptyElement(archivedNoteListElement);

    activeNoteListElement.append(...createNoteItems(activeNotes))
    archivedNoteListElement.append(...createNoteItems(archivedNotes))
  };

  const showNoteList = () => {
    Utils.showElement(activeNoteListElement);
    Utils.showElement(archivedNoteListElement);
  };

  // Inisialisasi tampilan langsung
  showNotes();
};

export default home;

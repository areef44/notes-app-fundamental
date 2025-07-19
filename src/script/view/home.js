import Utils from "../utils.js";
import NotesApi from "../data/remote/notes-api.js";
import {animate} from "animejs";
import Sortable from "sortablejs"

const home = () => {
  const activeNoteListElement = document.querySelector("#activeNoteList");
  const archivedNoteListElement = document.querySelector("#archivedNoteList");
  const addNoteForm = document.querySelector("add-form");
  const loadingElement = document.querySelector("loading-indicator");

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
    showLoading(); 
    try {
      const activeNotes = await NotesApi.getActiveNotes();
      const archivedNotes = await NotesApi.getArchivedNotes();
      displayResult(activeNotes, archivedNotes);
      setupDragAndDrop();
      showNoteList();
    } catch (error) {
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const displayResult = (activeNotes, archivedNotes) => {
    const createNoteItems = (notes) =>
      notes.map((note) => {
        // Create wrapper element for dragging
        const wrapper = document.createElement("div");
        wrapper.className = "note-item-wrapper";
        wrapper.setAttribute("data-id", note.id);
        wrapper.draggable = true;
        
        // Add drag handle
        const dragHandle = document.createElement("div");
        dragHandle.className = "note-drag-handle";
        dragHandle.innerHTML = "⋮⋮";
        dragHandle.style.cssText = `
          position: absolute;
          top: 8px;
          right: 8px;
          cursor: grab;
          padding: 4px 8px;
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
          font-size: 12px;
          z-index: 10;
        `;
        
        // Create note item
        const noteItemElement = document.createElement("note-item");
        noteItemElement.note = note;

        noteItemElement.addEventListener("delete-note", async (e) => {
          const noteId = e.detail.id;
          try {
            await NotesApi.deleteNote(noteId);
            await showNotes();
          } catch (error) {
            console.error("Gagal menghapus note:", error);
          }
        });
        
        // Style wrapper
        wrapper.style.cssText = `
          position: relative;
          margin: 8px 0;
          transition: all 0.2s ease;
        `;
        
        // Append elements
        wrapper.appendChild(noteItemElement);
        wrapper.appendChild(dragHandle);
        
        // Add drag events to wrapper
        wrapper.addEventListener("dragstart", (event) => {
          event.dataTransfer.setData("text/plain", note.id);
          wrapper.classList.add("dragging");
          wrapper.style.opacity = "0.5";
        });

        wrapper.addEventListener("dragend", (event) => {
          wrapper.classList.remove("dragging");
          wrapper.style.opacity = "1";
        });
        
        return wrapper;
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

  const showLoading = () => {
    Utils.hideElement(activeNoteListElement);
    Utils.hideElement(archivedNoteListElement);
    Utils.showElement(loadingElement);
  };
  
  const hideLoading = () => {
    Utils.hideElement(loadingElement);
  };

  const setupDragAndDrop = () => {
    // Destroy existing sortable instances
    if (activeNoteListElement._sortable) {
      activeNoteListElement._sortable.destroy();
    }
    if (archivedNoteListElement._sortable) {
      archivedNoteListElement._sortable.destroy();
    }

    // Setup for active notes
    activeNoteListElement._sortable = Sortable.create(activeNoteListElement, {
      group: 'notes',
      animation: 150,
      handle: '.note-drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      
      async onAdd(event) {
        
        const noteWrapper = event.item;
        const noteId = noteWrapper.getAttribute("data-id");
        const movedToArchived = event.to === archivedNoteListElement;
        
        try {
          if (movedToArchived) {
            await NotesApi.setArchiveNote(noteId);
           
          } else {
            await NotesApi.setUnarchiveNote(noteId);
           
          }

          await showNotes();

          // Animation
          animate(noteWrapper, {
            scale: [1, 1.05, 1],
            opacity: [1, 0.7, 1],
            duration: 300,
            ease: 'outQuad'
          });


        } catch (error) {
          console.error(error);
          
        }
      },
    });

    // Setup for archived notes  
    archivedNoteListElement._sortable = Sortable.create(archivedNoteListElement, {
      group: 'notes',
      animation: 150,
      handle: '.note-drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      
      
      async onAdd(event) {
        
        const noteWrapper = event.item;
        const noteId = noteWrapper.getAttribute("data-id");
        const movedToArchived = event.to === archivedNoteListElement;
        
        
        try {
          if (movedToArchived) {
            await NotesApi.setArchiveNote(noteId);
          } else {
            await NotesApi.setUnarchiveNote(noteId);
          }

          await showNotes();

          // Animation
          animate(noteWrapper, {
            scale: [1, 1.05, 1],
            opacity: [1, 0.7, 1],
            duration: 300,
            ease: 'outQuad'
          });

        } catch (error) {
          console.error(error);
          
        }
      },
    });

    

    // Add CSS for sortable states
    const style = document.createElement('style');
    style.textContent = `
      .sortable-ghost {
        opacity: 0.4;
        background: #f0f0f0;
      }
      
      .sortable-chosen {
        cursor: grabbing;
      }
      
      .sortable-drag {
        cursor: grabbing;
      }
      
      .note-drag-handle:active {
        cursor: grabbing;
      }
      
      .note-item-wrapper.dragging {
        transform: rotate(5deg);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      }
    `;
    
    if (!document.querySelector('#sortable-styles')) {
      style.id = 'sortable-styles';
      document.head.appendChild(style);
    }
  };

  // Initialize
  showNotes();
};

export default home;
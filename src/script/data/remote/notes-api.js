const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  static async getActiveNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();

      const notes = responseJson.data;

      return notes;
    } catch (error) {
      console.error("Fetch error:", error);

      throw error;
    }
  }

  static async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();

      const notes = responseJson.data;

      return notes;
    } catch (error) {
      console.error("Fetch error:", error);

      throw error;
    }
  }

  static async createNote({ title, body }) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
        }),
      });
      if (!response.ok) {
        throw new Error(`Gagal membuat catatan. Status: ${response.status}`);
      }

      const responseJson = await response.json();

      return responseJson.data;
    } catch (error) {
      console.error("Create note error: ", error);
      throw error;
    }
  }

  static async getDetailNote(note_id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${note_id}`);

      if (!response.ok) {
        throw new Error(`Gagal membuat catatan. Status: ${response.status}`);
      }

      const responseJson = await response.json();

      return responseJson.data;
    } catch (error) {
      console.error("Get Detail note error: ", error);
      throw error;
    }
  }

  static async setArchiveNote(note_id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${note_id}/archive`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(
          `Gagal mengarsipkan catatan. Status: ${response.status}`,
        );
      }

      const responseJson = await response.json();

      return responseJson.data;
    } catch (error) {
      console.error("Set Archive note error: ", error);
      throw error;
    }
  }

  static async setUnarchiveNote(note_id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${note_id}/unarchive`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(
          `Gagal membatalkan arsip catatan catatan. Status: ${response.status}`,
        );
      }

      const responseJson = await response.json();

      return responseJson.data;
    } catch (error) {
      console.error("Set Unarchive note error: ", error);
      throw error;
    }
  }

  static async deleteNote(note_id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${note_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Gagal membatalkan arsip catatan catatan. Status: ${response.status}`,
        );
      }

      const responseJson = await response.json();

      return responseJson.data;
    } catch (error) {
      console.error("Delete note error: ", error);
      throw error;
    }
  }
}

export default NotesApi;

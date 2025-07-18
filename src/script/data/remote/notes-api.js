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
            'Content-Type': 'application/json',
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
}

export default NotesApi;

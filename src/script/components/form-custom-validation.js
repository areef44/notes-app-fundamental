class FormValidator {
  static getTitleError(value) {
    if (!value) return "Judul wajib diisi.";
    if (value.length < 3) return "Judul minimal 3 karakter.";
    return "";
  }

  static getBodyError(value) {
    if (!value) return "Isi catatan wajib diisi.";
    if (value.length < 10) return "Isi catatan minimal 10 karakter.";
    return "";
  }
}

export default FormValidator;

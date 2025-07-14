class Utils {
    static emptyElement(element) {
      element.innerHTML = '';
    }
  
    static showElement(element) {
      element.style.display = 'block';
      element.hidden = false;
    }
  
    static hideElement(element) {
      element.style.display = 'none';
      element.hidden = true;
    }
  
    static isValidInteger(newValue) {
      return Number.isInteger(newValue);
    }
  }
  
  export default Utils;
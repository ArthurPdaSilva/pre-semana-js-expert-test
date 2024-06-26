const uuid = require("uuid");

class Todo {
  constructor({ text, when }) {
    this.text = text;
    this.when = when;
    this.id = uuid.v4();
    this.status = "";
  }

  isValid() {
    // 0 - "" - false - {} - null == false
    //converte para boleano
    return !!this.text && !isNaN(this.when.valueOf());
  }
}

module.exports = Todo;

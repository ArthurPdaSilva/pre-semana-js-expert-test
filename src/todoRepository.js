const loki = require("lokijs");

class TodoRepository {
  constructor() {
    const db = new loki("todo", {});
    this.schedule = db.addCollection("schedule");
  }

  list() {
    return this.schedule.find();
  }

  create(data) {
    return this.schedule.insertOne(data);
  }
}

module.exports = TodoRepository;

console.log(new TodoRepository().create({ name: "xue", age: 90 }));

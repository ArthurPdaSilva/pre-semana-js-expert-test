const { describe, it, before } = require("mocha");
const { expect } = require("chai");
const { createSandbox } = require("sinon");
const TodoService = require("../src/todoService");
const Todo = require("../src/todo");
const uuid = require("uuid");

describe("todoService", () => {
  let sandbox;

  before(() => {
    sandbox = createSandbox();
  });

  afterEach(() => sandbox.restore());

  describe("#list", () => {
    const mockDatabase = [
      {
        name: "xue",
        age: 90,
        meta: { revision: 0, created: 1714519085148, version: 0 },
        $loki: 1,
      },
    ];

    let todoService;
    beforeEach(() => {
      // Repository tá bão já, então consideramos seus retornos válidos
      const dependencies = {
        todoRepository: {
          list: sandbox.stub().returns(mockDatabase),
        },
      };
      todoService = new TodoService(dependencies);
    });
    it("should return data on a specific format", () => {
      const result = todoService.list();
      const [{ meta, $loki, ...expected }] = mockDatabase;
      expect(result).to.be.deep.eq([expected]);
    });
  });

  describe("#create", () => {
    let todoService;
    beforeEach(() => {
      // Repository tá bão já, então consideramos seus retornos válidos
      const dependencies = {
        todoRepository: {
          create: sandbox.stub().returns(true),
        },
      };
      todoService = new TodoService(dependencies);
    });
    it("shouldn't save todo item white invalid data", () => {
      const data = new Todo({
        text: "",
        when: "",
      });
      //   Não é perfomático delete data.id
      Reflect.deleteProperty(data, "id");
      const expected = {
        error: {
          message: "invalid data",
          data: data,
        },
      };
      const result = todoService.create(data);
      expect(result).to.be.deep.equal(expected);
    });
    it("should' save todo item white late status when the property is further than today", () => {
      const today = new Date("2020-12-02");
      sandbox.useFakeTimers(today.getTime());
      const properties = {
        text: "i must walk my dog",
        when: new Date("2020-12-01 12:00:00 GMT-9"),
      };

      const data = new Todo(properties);
      data.id = "0001";
      todoService.create(data);

      const expectedCallWith = {
        ...data,
        status: "late",
      };

      expect(
        todoService.todoRepository.create.calledOnceWithExactly(
          expectedCallWith
        )
      ).to.be.ok;
    });
    it("should' save todo item white pending status ", () => {
      const today = new Date("2020-12-02");
      sandbox.useFakeTimers(today.getTime());
      const properties = {
        text: "i must walk my dog",
        when: new Date("2020-12-10 12:00:00 GMT-9"),
      };

      const data = new Todo(properties);
      data.id = "0001";
      todoService.create(data);

      const expectedCallWith = {
        ...data,
        status: "pending",
      };

      expect(
        todoService.todoRepository.create.calledOnceWithExactly(
          expectedCallWith
        )
      ).to.be.ok;
    });
  });
});

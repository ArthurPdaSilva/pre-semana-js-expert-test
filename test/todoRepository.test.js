const { describe, it, before } = require("mocha");
const { expect } = require("chai");
const { createSandbox } = require("sinon");
const TodoRepository = require("../src/todoRepository");

describe("todoRepository", () => {
  let todoRepository;
  let sandbox;

  before(() => {
    todoRepository = new TodoRepository();
    sandbox = createSandbox();
  });

  afterEach(() => {
    // Restore tudo que estava nos objetos
    sandbox.restore();
  });

  describe("methods signature", () => {
    // Verificar se o método foi chamado com os parâmetros certos
    it("should call find from lokijs", () => {
      const mockDatabase = [
        {
          name: "xue",
          age: 90,
          meta: { revision: 0, created: 1714519085148, version: 0 },
          $loki: 1,
        },
      ];
      //   Ele é uma função anônima, tem que setar manualmente ao invés de dar find.name
      const functionName = "find";
      const expectReturn = mockDatabase;
      sandbox.stub(todoRepository.schedule, functionName).returns(expectReturn);
      const result = todoRepository.list();
      //   Deep é para olhar as propriedades internas (é um array .-.)
      expect(result).to.be.deep.equal(expectReturn);
      expect(todoRepository.schedule[functionName].calledOnce).to.be.ok;
    });
    it("should call insertOne from lokijs", () => {
      const functionName = "insertOne";
      const expectReturn = true;
      sandbox.stub(todoRepository.schedule, functionName).returns(expectReturn);
      const data = { name: "Erick" };
      const result = todoRepository.create(data);
      expect(result).to.be.deep.equal(expectReturn);
      expect(todoRepository.schedule[functionName].calledOnceWithExactly(data))
        .to.be.ok;
    });
  });
});

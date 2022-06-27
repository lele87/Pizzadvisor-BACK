const path = require("path");
const Pizzeria = require("../database/models/Pizzeria");
const mockPizzerias = require("../mocks/pizzeriasMock");
const {
  getPizzerias,
  deletePizzeria,
  createPizzeria,
  editPizzeria,
  getPizzeria,
} = require("./pizzeriaControllers");

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  rename: jest.fn().mockReturnValue(true),
}));

jest.mock("../database/models/Pizzeria", () => ({
  find: jest.fn().mockReturnThis(),
  count: jest.fn().mockReturnValue(1),
  limit: jest.fn().mockReturnValue([
    {
      name: "Pizza Pazza",
      address: "Carrer Ample",
      timetable: "15-23",
      image: "image",
      owner: "629684abc46cf477e7ca7009",
      specialty: "Margherita",
      id: "1",
    },
    {
      name: "Pizza Circus",
      address: "Carrer Nou de la Rambla",
      timetable: "15-24",
      image: "image1",
      owner: "629684abc46cf477e7ca7008",
      specialty: "Margherita",
      id: "2",
    },
  ]),
}));

describe("Given a getPizzerias controller", () => {
  describe("When it's called on", () => {
    test("Then it should call the response method with a 200 and a json method with a list of pizzerias", async () => {
      const expectedStatus = 200;

      const req = {
        query: {
          limit: 5,
          filter: "Margherita",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      const expectedJsonMessage = {
        pizzerias: mockPizzerias,
        pages: 1,
      };

      await getPizzerias(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonMessage);
    });
  });
  describe("When it's invoked but there is an error", () => {
    test("Then the next function should be called ", async () => {
      const req = {
        query: {
          limit: 5,
          filter: "Margherita",
        },
      };

      const next = jest.fn();

      await getPizzerias(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a deletePizzeria controller", () => {
  describe("When invoked with a request to delete the pizzeria with the id of the first pizzeria in mockPizzerias", () => {
    test("Then it should call the response's status method with 200, and json message with message that the pizzeria was deleted ", async () => {
      const req = {
        params: {
          idPizzeria: 1,
        },
      };

      const expectedMessage = {
        msg: "Pizzeria with ID 1 deleted",
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Pizzeria.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(mockPizzerias[0]);

      await deletePizzeria(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});

describe("Given a createPizzeria controller", () => {
  const req = {
    body: mockPizzerias[0],
    file: {
      filename: "12798217782",
      originalname: "image.jpg",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  jest
    .spyOn(path, "join")
    .mockResolvedValueOnce("image")
    .mockReturnValueOnce(true)
    .mockResolvedValue(new Error());
  describe("When it's invoked with a request with the info to create", () => {
    test("Then it should call the response's method with a 201 and a json message with the new Pizzeria", async () => {
      const expectedStatus = 201;

      Pizzeria.create = jest.fn().mockResolvedValue(mockPizzerias[0]);
      const expectedResponse = { newPizzeria: mockPizzerias[0] };

      await createPizzeria(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
  describe("When it's invoked but there is an error", () => {
    test("Then it should call the response's method with a 400 and a json message 'Error creating pizzeria", async () => {
      const expectedErrorMessage = "Error creating pizzeria";
      const expectedError = new Error(expectedErrorMessage);

      Pizzeria.create = jest.fn().mockRejectedValue();

      const next = jest.fn();

      await createPizzeria(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When it's invoked and the file fails to rename", () => {
    test("Then it should call the next funcion", async () => {
      const next = jest.fn();

      await createPizzeria(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given an editPizzeria Controller", () => {
  const req = {
    params: {
      idPizzeria: "1",
    },
    body: mockPizzerias[0],
    file: {
      filename: "12798217782",
      originalname: "image.jpg",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  jest
    .spyOn(path, "join")
    .mockResolvedValueOnce("image")
    .mockReturnValueOnce(true)
    .mockResolvedValue(new Error());

  describe("When it's invoked with the info to update", () => {
    test("Then it should call the response's method with a 201 and a json message with the updated Pizzeria", async () => {
      const expectedStatus = 201;

      Pizzeria.findByIdAndUpdate = jest.fn().mockReturnValue(mockPizzerias[0]);
      const expectedResponse = { updatedPizzeria: mockPizzerias[0] };

      await editPizzeria(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
  describe("When it receives a request with a pizzeria id not present in the db", () => {
    test("Then it should call the next received function with an error 'Error updating pizzeria'", async () => {
      const expectedErrorMessage = "Error updating pizzeria";
      const expectedError = new Error(expectedErrorMessage);

      const next = jest.fn();

      jest.spyOn(path, "join").mockResolvedValue("image");

      Pizzeria.findByIdAndUpdate = jest.fn().mockRejectedValue();

      await editPizzeria(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getPizzeria controller", () => {
  describe("When invoked with a request with the id of the first Pizzeria in MockPizzerias", () => {
    test("Then it should call the response's status method with 200, and json with the first pizzeria in mockPizzerias", async () => {
      const req = {
        params: { id: mockPizzerias[0].id },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Pizzeria.findById = jest.fn().mockResolvedValue(mockPizzerias[0]);

      await getPizzeria(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPizzerias[0]);
    });
  });
  describe("When its invoked with a non existent id", () => {
    test("Then it should call the received next function", async () => {
      const req = {
        params: { idPizzeria: "345" },
      };

      const next = jest.fn();

      Pizzeria.findById = jest
        .fn()
        .mockRejectedValue(new Error("Pizzeria not found"));

      await getPizzeria(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

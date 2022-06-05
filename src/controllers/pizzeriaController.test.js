const path = require("path");
const Pizzeria = require("../database/models/Pizzeria");
const mockPizzerias = require("../mocks/pizzeriasMock");
const {
  getPizzerias,
  deletePizzeria,
  createPizzeria,
} = require("./pizzeriaControllers");

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  rename: jest.fn().mockReturnValue(true),
}));

describe("Given a getPizzerias controller", () => {
  describe("When it is called on", () => {
    test("Then it should call the response method with a 200 and a json method with a list of pizzerias", async () => {
      const expectedStatus = 200;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Pizzeria.find = jest.fn().mockResolvedValue(mockPizzerias);

      await getPizzerias(null, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(mockPizzerias);
    });
  });
  describe("When it's called on but there aren't pizzerias", () => {
    test("Then it should call the response method with a 404 and call the 'next' middleware with an error", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockNext = jest.fn();
      Pizzeria.find = jest.fn().mockResolvedValue([]);

      await getPizzerias(null, res, mockNext);
      const expectedError = new Error();
      expectedError.code = 404;
      expectedError.message = "Pizzerias not found";

      expect(mockNext).toHaveBeenCalled();
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
      const expectedResponse = mockPizzerias[0];

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

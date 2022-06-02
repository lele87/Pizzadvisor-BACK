const Pizzeria = require("../database/models/Pizzeria");
const mockPizzerias = require("../mocks/pizzeriasMock");
const getPizzerias = require("./pizzeriaControllers");

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

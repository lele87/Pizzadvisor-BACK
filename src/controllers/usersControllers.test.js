const User = require("../database/models/User");
const mockPizzerias = require("../mocks/pizzeriasMock");
const { getUsersFavourites } = require("./usersControllers");

describe("Given a getUsersFavourites controller", () => {
  describe("When it's called on", () => {
    test("Then it should call the response method with a 200 and a json method with a list of pizzerias", async () => {
      const expectedStatus = 200;

      const req = {
        params: {
          userId: "1",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockReturnValue({
          favourites: {
            pizzerias: mockPizzerias,
          },
        }),
      }));

      const expectedJsonMessage = {
        pizzerias: mockPizzerias,
      };

      await getUsersFavourites(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonMessage);
    });
  });
  describe("When it's invoked but there is an error", () => {
    test("Then the next function should be called ", async () => {
      const req = {
        params: {
          userId: "2",
        },
      };

      const next = jest.fn();

      await getUsersFavourites(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

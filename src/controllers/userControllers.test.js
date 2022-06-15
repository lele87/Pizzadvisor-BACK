const bcrypt = require("bcrypt");
const User = require("../database/models/User");
const { userRegister } = require("./userControllers");

const mockNewUser = {
  name: "lelo",
  username: "lelo",
  password: "1234",
};

jest.mock("../database/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(() => mockNewUser),
}));

jest.mock("bcrypt", () => ({ compare: jest.fn(), hash: jest.fn() }));

describe("Given a register user function", () => {
  describe("When it is called on", () => {
    test("Then it should call the response method with a status 201 and the name created user", async () => {
      const req = {
        body: { name: "lelo", username: "lelo", password: "1234" },
      };

      User.findOne.mockImplementation(() => false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedStatus = 201;
      const expectedJson = { username: "lelo" };
      bcrypt.hash.mockImplementation(() => "hashedPassword");
      await userRegister(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });
  describe("When it is called with a user that is already in the database", () => {
    test("Then it should call the 'next' middleware with an error", async () => {
      const req = {
        body: { name: "lillo", username: "lillo", password: "lillo" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockNext = jest.fn();
      User.findOne.mockImplementation(() => true);
      bcrypt.hash.mockImplementation(() => "hashedPassword");

      await userRegister(req, res, mockNext);
      const expectedError = new Error();
      expectedError.code = 409;
      expectedError.message = "This user already exists...";

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When invoked with a req object with a correct username and a wrong password", () => {
    test("Then it should call the next function", async () => {
      const req = {
        body: { name: "lillo", username: "lillo", password: "lillo" },
      };

      const expectedErrorMessage = "Wrong user data..";
      const expectedError = new Error(expectedErrorMessage);

      User.findOne = jest.fn().mockResolvedValue(false);

      const next = jest.fn();

      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

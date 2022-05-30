const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../database");
const User = require("../database/models/User");
const mockNewUser = require("../mocks/usersMock");
const app = require("../server/index");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await User.create(mockNewUser[0]);
  await User.create(mockNewUser[1]);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a post /users/register endpoint", () => {
  describe("When it receives a new user request", () => {
    test("Then it should respond with a 201 status code and a username", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          name: "lello",
          username: "lello",
          password: "password",
        })
        .expect(201);

      expect(response.body.id).not.toBeNull();
      expect(response.body.username).toBe("lello");
    });
  });
  describe("When it receives an already existing user request", () => {
    test("Then it should respond with a 409 status code and the test 'user already exists'", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          name: "lillo",
          username: "lillo",
          password: "password",
        })
        .expect(409);

      expect(response.body.error).toBe(true);
    });
  });
});

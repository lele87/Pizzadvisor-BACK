const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../database");
const app = require("../server/index");
const Pizzeria = require("../database/models/Pizzeria");
const mockPizzerias = require("../mocks/pizzeriasMock");

let mongoServer;

const newUserData = {
  username: "paco",
  password: "1234",
  name: "paco",
};

const newUserCredentials = {
  username: "paco",
  password: "1234",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await Pizzeria.create(mockPizzerias[0]);
  await Pizzeria.create(mockPizzerias[1]);
});

afterEach(async () => {
  await Pizzeria.deleteMany({});
});

afterAll(async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
});

describe("Given a GET '/pizzerias' endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should receive a list of pizzerias", async () => {
      await request(app).post("/user/register").send(newUserData);

      const { body: tokenObject } = await request(app)
        .post("/user/login")
        .send(newUserCredentials);

      const { body } = await request(app)
        .get("/pizzerias/list")
        .set("Authorization", `Bearer ${tokenObject.token}`);

      expect(body[0]).toHaveProperty("name", "Pizza Pazza");
      expect(body[1]).toHaveProperty("name", "Pizza Circus");
    });
  });

  describe("When it receives a request and there is no token", () => {
    test("Then it should call the status code method with an error 401", async () => {
      const { body } = await request(app).get("/pizzerias/list").expect(401);

      expect(body).toHaveProperty("message", "Unauthorized");
    });
  });
});

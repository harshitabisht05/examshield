const request = require("supertest");
const app = require("../server");
const db = require("../db");

describe("ExamShield backend", () => {
  it("should respond to root health check", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("ExamShield Backend Running");
  });

  it("should expose /health endpoint", async () => {
    const response = await request(app).get("/health");
    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty("status");
  });

  afterAll(async () => {
    await db.promise().end();
  });
});

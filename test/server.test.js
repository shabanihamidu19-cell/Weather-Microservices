import request from "supertest";
import app from "../src/server.js";

describe("Weather Service API", () => {
  it("should return weather data", async () => {
    const res = await request(app).get("/weather");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("city");
    expect(res.body.data).toHaveProperty("temperature");
  });

  it("should return health status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptime");
  });
});

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Mock weather data
const weatherData = {
  city: "Dar es Salaam",
  temperature: "29°C",
  condition: "Sunny",
  humidity: "65%",
  wind: "12 km/h"
};

// Routes
app.get("/weather", (req, res) => {
  res.json({
    success: true,
    data: weatherData,
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Only start the HTTP server when not running tests
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Weather Service running on port ${PORT}`);
  });
}

export default app;

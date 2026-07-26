import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const DEFAULT_CITY = process.env.WEATHER_DEFAULT_CITY || "Dar es Salaam";

/**
 * Fetch weather from a provider (default: OpenWeatherMap).
 * If no API key is provided or the fetch fails, returns null.
 */
async function fetchWeatherFromProvider(city) {
  const provider = (process.env.WEATHER_PROVIDER || "openweathermap").toLowerCase();
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    if (provider === "openweathermap") {
      // OpenWeatherMap current weather endpoint (metric units)
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();

      const weather = {
        city: json.name || city,
        temperature: `${Math.round(json.main?.temp ?? 0)}°C`,
        condition: json.weather?.[0]?.main || "Unknown",
        description: json.weather?.[0]?.description || "",
        humidity: `${json.main?.humidity ?? "N/A"}%`,
        // Convert m/s to km/h for wind (if available)
        wind: json.wind?.speed != null ? `${Math.round((json.wind.speed || 0) * 3.6)} km/h` : "N/A",
        provider: "openweathermap",
        raw: json
      };
      return weather;
    }

    // Placeholder for other providers
    return null;
  } catch (err) {
    // Do not throw — let caller fall back to mock
    console.error("Weather provider fetch error:", err?.message || err);
    return null;
  }
}

// Mock weather data (used as fallback)
const mockWeatherData = {
  city: DEFAULT_CITY,
  temperature: "29°C",
  condition: "Sunny",
  humidity: "65%",
  wind: "12 km/h"
};

// Routes
app.get("/weather", async (req, res) => {
  const city = req.query.city || DEFAULT_CITY;

  // Try provider first (if configured)
  const providerData = await fetchWeatherFromProvider(city);

  const data = providerData || { ...mockWeatherData, city };

  res.json({
    success: true,
    data,
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
    if (process.env.WEATHER_API_KEY) {
      console.log("Weather provider enabled:", process.env.WEATHER_PROVIDER || "openweathermap");
    } else {
      console.log("No WEATHER_API_KEY set — running with mock data");
    }
  });
}

export default app;

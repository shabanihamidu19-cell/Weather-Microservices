# Weather Microservice ☀️🌧️

A small Node.js + Express microservice that returns weather data. It serves mock data by default and can call a real weather provider (OpenWeatherMap) when configured with an API key.

---

## Features
- `GET /weather` → Returns weather data (mock or from provider). Accepts `?city=` query parameter.
- `GET /health` → Service health status and uptime.
- Jest + Supertest tests (devDependencies).
- Dockerfile for containerized deployment.

---

## Environment variables
- WEATHER_API_KEY — (optional) API key for the weather provider (OpenWeatherMap). If not set, service returns mock data.
- WEATHER_PROVIDER — (optional) Provider to use. Defaults to `openweathermap`.
- WEATHER_DEFAULT_CITY — (optional) Default city when none is provided. Defaults to `Dar es Salaam`.
- PORT — (optional) HTTP port. Defaults to `3000`.
- NODE_ENV — set to `test` when running tests so the server does not listen on a port.

---

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Start service (mock data):
```bash
npm start
```

4. Start service with OpenWeatherMap:
```bash
WEATHER_API_KEY=your_openweathermap_key WEATHER_DEFAULT_CITY="Nairobi" npm start
```

---

## Example requests

- Get mock or provider weather for default city:
```bash
curl http://localhost:3000/weather
```

- Get weather for a specific city:
```bash
curl "http://localhost:3000/weather?city=London"
```

- Health check:
```bash
curl http://localhost:3000/health
```

---

## Docker

The Dockerfile copies package*.json and runs `npm install --production`. To build a production image:

```bash
docker build -t weather-service .
docker run -e WEATHER_API_KEY=your_key -p 3000:3000 weather-service
```

Note: the production image installs only production dependencies. Tests and dev tools are not included.

---

## Development notes & roadmap
- The service uses ES modules; `package.json` includes `"type": "module"`.
- If WEATHER_API_KEY is set, the service attempts to fetch from the configured provider (OpenWeatherMap). On failure it falls back to mock data.
- Next improvements you might want:
  - Add integration tests that mock provider responses.
  - Add a CI workflow that runs tests on push/PR.
  - Add runtime configuration to choose units (metric/imperial) and additional provider support.

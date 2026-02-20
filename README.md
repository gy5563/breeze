# Breeze - Marine Weather (React Native)

A React Native (Expo + TypeScript) mobile app scaffold for marine-first forecasting with:
- Global location search + autocomplete.
- Current weather essentials.
- 7-day forecast.
- Wind speed, gust, and direction with a compass indicator.
- Tide chart for the next 24 hours.

## API choices
- **General weather + geocoding**: OpenWeatherMap One Call + Geocoding APIs.
- **Tides (recommended)**: World Tides API (simple extremes/heights payload for mobile rendering).
  - Alternative: Storm Glass Marine API.

## Project structure

```txt
.
├── App.tsx
├── package.json
├── tsconfig.json
└── src
    ├── components
    │   ├── LocationSearch.tsx
    │   ├── TideChart.tsx
    │   └── WindCompass.tsx
    ├── hooks
    │   └── useWeather.ts
    ├── screens
    │   └── HomeScreen.tsx
    ├── services
    │   └── api.ts
    └── types
        └── weather.ts
```

## Environment variables

Create `.env`:

```bash
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
EXPO_PUBLIC_WORLD_TIDES_API_KEY=your_worldtides_api_key
```

## Async state handling
- `useWeather` manages `loading`, `error`, and `data` states.
- `loadWeather()` wraps async fetch calls with robust `try/catch` handling.
- `fetchWeatherBundle()` combines weather and tides using `Promise.all`.
- Location search debounces input by 300ms to avoid API overfetch.

## Run

```bash
npm install
npm run start
```

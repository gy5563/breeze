import {
  DailyForecast,
  LocationSuggestion,
  TidePoint,
  WeatherBundle,
} from '../types/weather';

const OPEN_WEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? '';
const WORLD_TIDES_API_KEY = process.env.EXPO_PUBLIC_WORLD_TIDES_API_KEY ?? '';
const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org';
const WORLD_TIDES_BASE_URL = 'https://www.worldtides.info/api/v3';

const assertApiKey = (key: string, label: string) => {
  if (!key) {
    throw new Error(`${label} API key is missing. Set it in your Expo environment variables.`);
  }
};

export async function fetchLocationSuggestions(query: string): Promise<LocationSuggestion[]> {
  if (!query.trim()) {
    return [];
  }

  assertApiKey(OPEN_WEATHER_API_KEY, 'OpenWeatherMap');

  const response = await fetch(
    `${OPEN_WEATHER_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=8&appid=${OPEN_WEATHER_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('Unable to fetch location suggestions.');
  }

  const json = await response.json();

  return json.map((item: any) => ({
    name: item.name,
    country: item.country,
    state: item.state,
    lat: item.lat,
    lon: item.lon,
  }));
}

async function fetchOpenWeather(lat: number, lon: number): Promise<{ current: any; daily: DailyForecast[] }> {
  assertApiKey(OPEN_WEATHER_API_KEY, 'OpenWeatherMap');

  const response = await fetch(
    `${OPEN_WEATHER_BASE_URL}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${OPEN_WEATHER_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('Unable to fetch weather forecast from OpenWeatherMap.');
  }

  const json = await response.json();

  return {
    current: json.current,
    daily: json.daily.slice(0, 7).map((entry: any) => ({
      date: entry.dt,
      min: entry.temp.min,
      max: entry.temp.max,
      humidity: entry.humidity,
      weather: entry.weather?.[0]?.main ?? 'Clear',
    })),
  };
}

async function fetchTides(lat: number, lon: number): Promise<TidePoint[]> {
  assertApiKey(WORLD_TIDES_API_KEY, 'World Tides');

  const start = Math.floor(Date.now() / 1000);
  const end = start + 24 * 60 * 60;

  const response = await fetch(
    `${WORLD_TIDES_BASE_URL}?heights&extremes&lat=${lat}&lon=${lon}&start=${start}&end=${end}&key=${WORLD_TIDES_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('Unable to fetch tide data.');
  }

  const json = await response.json();

  return (json.extremes ?? []).map((item: any) => ({
    time: item.date,
    timestamp: item.dt,
    height: Number(item.height ?? 0),
    type: item.type === 'High' ? 'high' : 'low',
  }));
}

export async function fetchWeatherBundle(
  lat: number,
  lon: number,
  locationLabel: string,
): Promise<WeatherBundle> {
  const [weather, tides] = await Promise.all([fetchOpenWeather(lat, lon), fetchTides(lat, lon)]);

  return {
    locationLabel,
    current: {
      temperature: weather.current.temp,
      humidity: weather.current.humidity,
      windSpeed: weather.current.wind_speed,
      windDirection: weather.current.wind_deg,
      windGust: weather.current.wind_gust ?? weather.current.wind_speed,
    },
    daily: weather.daily,
    tides,
  };
}

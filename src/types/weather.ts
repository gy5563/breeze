export type LocationSuggestion = {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
};

export type DailyForecast = {
  date: number;
  min: number;
  max: number;
  humidity: number;
  weather: string;
};

export type CurrentWeather = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
};

export type TidePoint = {
  time: string;
  timestamp: number;
  height: number;
  type: 'high' | 'low';
};

export type WeatherBundle = {
  locationLabel: string;
  current: CurrentWeather;
  daily: DailyForecast[];
  tides: TidePoint[];
};

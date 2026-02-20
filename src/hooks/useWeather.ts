import { useCallback, useState } from 'react';
import { fetchWeatherBundle } from '../services/api';
import { WeatherBundle } from '../types/weather';

type UseWeatherState = {
  data: WeatherBundle | null;
  loading: boolean;
  error: string | null;
};

export function useWeather() {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const loadWeather = useCallback(async (lat: number, lon: number, label: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchWeatherBundle(lat, lon, label);
      setState({ data, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error while loading weather.';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  return {
    ...state,
    loadWeather,
  };
}

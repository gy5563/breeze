import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LocationSearch } from '../components/LocationSearch';
import { TideChart } from '../components/TideChart';
import { WindCompass } from '../components/WindCompass';
import { useWeather } from '../hooks/useWeather';
import { LocationSuggestion } from '../types/weather';

const dayLabel = (unix: number) =>
  new Date(unix * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

export function HomeScreen() {
  const { data, loading, error, loadWeather } = useWeather();

  const handleLocationSelect = (location: LocationSuggestion) => {
    loadWeather(location.lat, location.lon, `${location.name}, ${location.country}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Breeze Marine Forecast</Text>
      <LocationSearch onSelect={handleLocationSelect} />

      {loading ? <Text style={styles.info}>Loading latest marine data...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {data ? (
        <>
          <View style={styles.card}>
            <Text style={styles.location}>{data.locationLabel}</Text>
            <Text style={styles.temp}>{Math.round(data.current.temperature)}°C</Text>
            <Text style={styles.metric}>Humidity: {data.current.humidity}%</Text>
          </View>

          <View style={styles.forecastCard}>
            <Text style={styles.sectionTitle}>7-Day Forecast</Text>
            {data.daily.map((day) => (
              <View key={day.date} style={styles.forecastRow}>
                <Text style={styles.metric}>{dayLabel(day.date)}</Text>
                <Text style={styles.metric}>
                  {Math.round(day.min)}° / {Math.round(day.max)}° • {day.weather}
                </Text>
              </View>
            ))}
          </View>

          <WindCompass
            speed={data.current.windSpeed}
            direction={data.current.windDirection}
            gust={data.current.windGust}
          />

          <TideChart tides={data.tides} />
        </>
      ) : (
        <Text style={styles.info}>Search a location to load weather + tide conditions.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  title: {
    color: '#d7f9fd',
    fontSize: 24,
    fontWeight: '700',
  },
  info: {
    color: '#9ccad5',
  },
  error: {
    color: '#ff9f9f',
  },
  card: {
    backgroundColor: '#08283b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#125069',
    padding: 16,
  },
  forecastCard: {
    backgroundColor: '#08283b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#125069',
    padding: 14,
  },
  location: {
    color: '#bfeef5',
    marginBottom: 6,
    fontSize: 15,
  },
  temp: {
    color: '#ebfdff',
    fontWeight: '700',
    fontSize: 40,
  },
  metric: {
    color: '#b8e8ef',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#d7f9fd',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
    gap: 8,
  },
});

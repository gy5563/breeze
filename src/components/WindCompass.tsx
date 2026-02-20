import { Compass, Navigation } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  speed: number;
  direction: number;
  gust: number;
};

const toCardinal = (degrees: number) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return dirs[index];
};

export function WindCompass({ speed, direction, gust }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Compass color="#86e7ef" size={18} />
        <Text style={styles.title}>Wind</Text>
      </View>

      <View style={styles.center}>
        <Navigation
          color="#b6f9ff"
          size={56}
          strokeWidth={2.25}
          style={{ transform: [{ rotate: `${direction}deg` }] }}
        />
        <Text style={styles.direction}>
          {Math.round(direction)}° {toCardinal(direction)}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statLabel}>Speed</Text>
        <Text style={styles.statValue}>{speed.toFixed(1)} m/s</Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.statLabel}>Gust</Text>
        <Text style={styles.statValue}>{gust.toFixed(1)} m/s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#072636',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#124963',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  title: {
    color: '#c8f7fb',
    fontSize: 16,
    fontWeight: '600',
  },
  center: {
    alignItems: 'center',
    marginBottom: 12,
  },
  direction: {
    color: '#d9fbff',
    marginTop: 8,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statLabel: {
    color: '#7db8c8',
  },
  statValue: {
    color: '#e3fbff',
    fontWeight: '600',
  },
});

import { BarChart3, Waves } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { TidePoint } from '../types/weather';

type Props = {
  tides: TidePoint[];
};

const formatTime = (isoLike: string) => {
  const date = new Date(isoLike);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function TideChart({ tides }: Props) {
  if (!tides.length) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Tides (next 24h)</Text>
        <Text style={styles.empty}>No tide data available for this location.</Text>
      </View>
    );
  }

  const maxHeight = Math.max(...tides.map((t) => t.height));
  const minHeight = Math.min(...tides.map((t) => t.height));
  const range = Math.max(maxHeight - minHeight, 0.01);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Waves color="#8ce8f0" size={18} />
        <Text style={styles.title}>Tides (next 24h)</Text>
        <BarChart3 color="#8ce8f0" size={16} />
      </View>

      <View style={styles.chartRow}>
        {tides.map((point) => {
          const normalized = (point.height - minHeight) / range;
          const barHeight = 36 + normalized * 80;

          return (
            <View key={`${point.timestamp}-${point.type}`} style={styles.column}>
              <Text style={[styles.type, point.type === 'high' ? styles.high : styles.low]}>
                {point.type.toUpperCase()}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: barHeight },
                    point.type === 'high' ? styles.barHigh : styles.barLow,
                  ]}
                />
              </View>
              <Text style={styles.height}>{point.height.toFixed(2)}m</Text>
              <Text style={styles.time}>{formatTime(point.time)}</Text>
            </View>
          );
        })}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: '#d1f8fb',
    fontWeight: '700',
    fontSize: 16,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 6,
  },
  column: {
    alignItems: 'center',
    flex: 1,
  },
  type: {
    fontSize: 10,
    marginBottom: 6,
    fontWeight: '700',
  },
  high: {
    color: '#71efff',
  },
  low: {
    color: '#4ea2ff',
  },
  barTrack: {
    width: 22,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#0d3a52',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  barHigh: {
    backgroundColor: '#44d8ec',
  },
  barLow: {
    backgroundColor: '#3f8df7',
  },
  height: {
    color: '#cbf6fa',
    fontSize: 11,
    marginTop: 6,
  },
  time: {
    color: '#87b8c3',
    fontSize: 11,
    marginTop: 2,
  },
  empty: {
    color: '#91b8c5',
    marginTop: 8,
  },
});

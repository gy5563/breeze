import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { fetchLocationSuggestions } from '../services/api';
import { LocationSuggestion } from '../types/weather';

type Props = {
  onSelect: (location: LocationSuggestion) => void;
};

export function LocationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const suggestions = await fetchLocationSuggestions(query);
        setResults(suggestions);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View>
      <View style={styles.searchBox}>
        <Search size={16} color="#9ad9df" />
        <TextInput
          placeholder="Search port, city, coastline"
          placeholderTextColor="#6ba7b5"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        {loading ? <ActivityIndicator color="#9ad9df" size="small" /> : null}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.lat}-${item.lon}`}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              onSelect(item);
              setQuery(`${item.name}, ${item.country}`);
              setResults([]);
            }}
            style={styles.item}
          >
            <Text style={styles.itemText}>
              {item.name}, {item.state ? `${item.state}, ` : ''}
              {item.country}
            </Text>
          </Pressable>
        )}
        style={styles.results}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#063044',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    color: '#e7fafd',
    fontSize: 15,
  },
  results: {
    maxHeight: 180,
    marginTop: 8,
    backgroundColor: '#0c2535',
    borderRadius: 12,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1f4c62',
  },
  itemText: {
    color: '#d6f4f8',
  },
});

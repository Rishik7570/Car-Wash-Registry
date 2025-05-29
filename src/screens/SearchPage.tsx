import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import React, {useContext, useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {dayRecord, Store} from '../store/Store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamlist} from '../router/Router';
import Feather from 'react-native-vector-icons/Feather';

type props = NativeStackScreenProps<RootStackParamlist, 'Search'>;

const Search = ({navigation}: props) => {
  const {yearData} = useContext(Store);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [result, setResult] = useState<dayRecord | null>(null);

  const formattedDate = date.toLocaleDateString('en-CA'); // YYYY-MM-DD

  const handleSearch = () => {
    const found = yearData[formattedDate];
    if (found) {
      setResult(found);
    } else {
      Alert.alert('No data found for this date.');
      setResult(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Feather name="arrow-left-circle" size={40} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Search By Date</Text>

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowPicker(Platform.OS === 'ios');
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
          maximumDate={new Date()}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.dateLabel}>{formattedDate}</Text>
          <Text style={styles.summary}>
            Credit: ₹{result.credit.toFixed(2)} | Debit: ₹
            {result.debit.toFixed(2)}
          </Text>
          {result.entries.map((entry: any, idx: number) => (
            <Pressable
              key={idx}
              style={styles.entry}
              onLongPress={() => {
                navigation.navigate('Edit', {
                  dateKey: formattedDate,
                  entryIndex: idx,
                });
              }}>
              <Text style={styles.entryText}>
                {entry.name} - ₹{entry.amount} ({entry.type})
              </Text>
              {entry.desc ? (
                <Text style={styles.entryDesc}>{entry.desc}</Text>
              ) : null}
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9ec',
    padding: 16,
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    color: '#333',
  },
  dateInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#5a9c42',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dateLabel: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#444',
  },
  summary: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  entry: {
    marginBottom: 10,
  },
  entryText: {
    fontSize: 16,
    color: '#222',
  },
  entryDesc: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
});

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useContext} from 'react';
import {Store} from '../store/Store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamlist} from '../router/Router';
import Feather from 'react-native-vector-icons/Feather';

type props = NativeStackScreenProps<RootStackParamlist, 'History'>;

const History = ({navigation}: props) => {
  const {yearData} = useContext(Store);
  const sortedDates = Object.keys(yearData).sort((a, b) => b.localeCompare(a));

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Feather name="arrow-left-circle" size={40} color="#333" />
      </TouchableOpacity>
      <Text style={styles.title}>History</Text>
      {sortedDates.length === 0 && (
        <Text style={styles.noData}>No history available.</Text>
      )}
      {sortedDates.map(date => {
        const {credit, debit, entries} = yearData[date];
        return (
          <View key={date} style={styles.card}>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.summary}>
              Credit: ₹{credit.toFixed(2)} | Debit: ₹{debit.toFixed(2)}
            </Text>
            {entries.map((entry, idx) => (
              <Pressable
                key={idx}
                style={styles.entry}
                onLongPress={() =>
                  navigation.navigate('Edit', {
                    dateKey: date,
                    entryIndex: idx,
                  })
                }>
                <Text style={styles.entryText}>
                  {entry.name} - ₹{entry.amount} ({entry.type})
                </Text>
                {entry.desc ? (
                  <Text style={styles.entryDesc}>{entry.desc}</Text>
                ) : null}
              </Pressable>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default History;

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
    marginBottom: 20,
    marginTop: 20,
    color: '#333',
  },
  noData: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  date: {
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

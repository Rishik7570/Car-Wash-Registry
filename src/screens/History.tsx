import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Switch,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Store} from '../store/Store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamlist} from '../router/Router';
import Feather from 'react-native-vector-icons/Feather';

type props = NativeStackScreenProps<RootStackParamlist, 'History'>;

type MonthlySummary = {
  [month: string]: {
    credit: number;
    debit: number;
    dates: string[]
  };
};

const History = ({navigation}: props) => {
  const {yearData} = useContext(Store);
  const [showMonthly, setShowMonthly] = useState(false);
  const [expanded, setExpanded] = useState<{[month: string]: boolean}>({});

  const sortedDates = Object.keys(yearData).sort((a, b) => b.localeCompare(a));

  const getMonthlyTotals = () => {
    const monthly: MonthlySummary = {};

    sortedDates.forEach(date => {
      const month = date.slice(0, 7); // YYYY-MM
      if (!monthly[month]) {
        monthly[month] = {credit: 0, debit: 0, dates: []};
      }
      monthly[month].credit += yearData[date].credit;
      monthly[month].debit += yearData[date].debit;
      monthly[month].dates.push(date);
    });

    return monthly;
  };

  const monthlyTotals = getMonthlyTotals();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Feather name="arrow-left-circle" size={40} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>History</Text>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Daily</Text>
        <Switch value={showMonthly} onValueChange={setShowMonthly} />
        <Text style={styles.toggleLabel}>Monthly</Text>
      </View>

      {sortedDates.length === 0 && (
        <Text style={styles.noData}>No history available.</Text>
      )}

      {!showMonthly
        ? // DAILY RECORDS
          sortedDates.map(date => {
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
                    onPress={() =>
                      navigation.navigate('Details', {
                        dateKey: date,
                        entryIndex: idx,
                      })
                    }
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
          })
        : // MONTHLY RECORDS
          Object.keys(monthlyTotals)
            .sort((a, b) => b.localeCompare(a))
            .map(month => {
              const {credit, debit, dates} = monthlyTotals[month];
              return (
                <View key={month} style={styles.card}>
                  <Pressable
                    onPress={() =>
                      setExpanded(prev => ({
                        ...prev,
                        [month]: !prev[month],
                      }))
                    }>
                    <Text style={styles.date}>{month}</Text>
                    <Text style={styles.summary}>
                      Credit: ₹{credit.toFixed(2)} | Debit: ₹{debit.toFixed(2)}
                    </Text>
                  </Pressable>

                  {expanded[month] &&
                    dates
                      .sort((a, b) => b.localeCompare(a))
                      .map(date => {
                        const {entries} = yearData[date];
                        return (
                          <View key={date} style={styles.subCard}>
                            <Text style={styles.subDate}>{date}</Text>
                            {entries.map((entry, idx) => (
                              <Pressable
                                key={idx}
                                style={styles.entry}
                                onPress={() =>
                                  navigation.navigate('Details', {
                                    dateKey: date,
                                    entryIndex: idx,
                                  })
                                }
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
                                  <Text style={styles.entryDesc}>
                                    {entry.desc}
                                  </Text>
                                ) : null}
                              </Pressable>
                            ))}
                          </View>
                        );
                      })}
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  toggleLabel: {
    fontSize: 16,
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
  subCard: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
  },
  subDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#444',
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

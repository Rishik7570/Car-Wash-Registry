import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamlist } from '../router/Router';
import { Store } from '../store/Store';

type Props = NativeStackScreenProps<RootStackParamlist, 'Details'>;

const DetailsScreen = ({ route }: Props) => {
  const { dateKey, entryIndex } = route.params;
  const { yearData } = useContext(Store);
  const entry = yearData[dateKey]?.entries[entryIndex];

  if (!entry) {
    return <Text style={styles.error}>Entry not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{entry.name}</Text>
      <Text style={styles.text}>Amount: ₹{entry.amount}</Text>
      <Text style={styles.text}>Type: {entry.type}</Text>
      {entry.desc && <Text style={styles.text}>Description: {entry.desc}</Text>}
      <Text style={styles.text}>Date: {dateKey}</Text>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fef9ec',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },
});

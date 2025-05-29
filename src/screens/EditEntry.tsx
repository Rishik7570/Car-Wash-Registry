import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useContext, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamlist} from '../router/Router';
import {dayRecord, Store} from '../store/Store';

type Props = NativeStackScreenProps<RootStackParamlist, 'Edit'>;

const EditEntry = ({route, navigation}: Props) => {
  const {dateKey, entryIndex} = route.params;
  const {yearData, setYearData} = useContext(Store);
  const existing = yearData[dateKey].entries[entryIndex];

  const [name, setName] = useState(existing.name);
  const [amount, setAmount] = useState(existing.amount.toString());
  const [desc, setDesc] = useState(existing.desc);
  const [type, setType] = useState<'credit' | 'debit'>(existing.type);

  const onSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return;
    }

    const updatedEntry = {
      ...existing,
      name,
      amount: parsedAmount,
      desc,
      type,
    };

    const day = yearData[dateKey];
    const oldEntry = day.entries[entryIndex];

    // Start from current totals
    let newCredit = day.credit;
    let newDebit = day.debit;

    // Step 1: Subtract old entry from its type
    if (oldEntry.type === 'credit') {
      newCredit -= oldEntry.amount;
    } else {
      newDebit -= oldEntry.amount;
    }

    // Step 2: Add new entry to its new type
    if (type === 'credit') {
      newCredit += parsedAmount;
    } else {
      newDebit += parsedAmount;
    }

    const updatedDay: dayRecord = {
      ...day,
      credit: newCredit,
      debit: newDebit,
      entries: [...day.entries],
    };

    updatedDay.entries[entryIndex] = updatedEntry;

    setYearData({
      ...yearData,
      [dateKey]: updatedDay,
    });

    navigation.goBack();
  };

  const onDelete = () => {
    const day = yearData[dateKey];
    const deletingEntry = day.entries[entryIndex];

    const updatedEntries = day.entries.filter((_, i) => i !== entryIndex);
    const updatedDay: dayRecord = {
      ...day,
      credit:
        deletingEntry.type === 'credit'
          ? day.credit - deletingEntry.amount
          : day.credit,
      debit:
        deletingEntry.type === 'debit'
          ? day.debit - deletingEntry.amount
          : day.debit,
      entries: updatedEntries,
    };

    const updatedYear = {
      ...yearData,
      [dateKey]: updatedDay,
    };

    if (updatedEntries.length === 0) {
      delete updatedYear[dateKey];
    }

    setYearData(updatedYear);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Edit Entry</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={e => setName(e)}
        placeholder="Vehicle Name"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={e => setAmount(e)}
        placeholder="Amount"
        keyboardType="numeric"
        placeholderTextColor="#888"
      />
      <TextInput
        style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
        value={desc}
        onChangeText={e => setDesc(e)}
        placeholder="Description"
        multiline
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeView}>
        <Pressable
          style={[
            styles.typeBtn,
            type === 'credit' ? {backgroundColor: '#32ff7e'} : styles.typeBg,
          ]}
          onPress={() => setType('credit')}>
          <Text style={styles.typeTxt}>Credit</Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeBtn,
            type === 'debit' ? {backgroundColor: '#ff4d4d'} : styles.typeBg,
          ]}
          onPress={() => setType('debit')}>
          <Text style={styles.typeTxt}>Debit</Text>
        </Pressable>
      </View>

      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditEntry;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fef9ec',
    padding: 20,
  },
  label: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    color: '#222',
  },
  button: {
    backgroundColor: '#5a9c42',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  typeView: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  typeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  typeBg: {
    backgroundColor: 'white',
  },
  typeTxt: {
    fontSize: 20,
    fontWeight: 'semibold',
  },
});

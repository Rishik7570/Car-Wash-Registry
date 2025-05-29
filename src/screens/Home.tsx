import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  View,
  Pressable,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {dayRecord, Store} from '../store/Store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamlist} from '../router/Router';
import DateTimePicker from '@react-native-community/datetimepicker';

type props = NativeStackScreenProps<RootStackParamlist, 'Home'>;

const Home = ({navigation}: props) => {
  const {currentTime, type, setType, yearData, setYearData} = useContext(Store);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSave = () => {
    if (!name || !amount || !type) {
      Alert.alert('Please fill all fields.');
      return;
    }

    const time = selectedDate.toISOString();
    const entry = {
      time,
      name,
      amount: parseFloat(amount),
      desc,
      type,
    };

    const dateKey = time.slice(0, 10); // YYYY-MM-DD
    const existingDay = yearData[dateKey] || {
      credit: 0,
      debit: 0,
      entries: [],
    };

    const updatedDay: dayRecord = {
      credit:
        type === 'credit'
          ? existingDay.credit + entry.amount
          : existingDay.credit,
      debit:
        type === 'debit' ? existingDay.debit + entry.amount : existingDay.debit,
      entries: [...existingDay.entries, entry],
    };

    const updatedYearData: Record<string, dayRecord> = {
      ...yearData,
      [dateKey]: updatedDay,
    };

    setYearData(updatedYearData);
    setName('');
    setAmount('');
    setDesc('');
    setType('credit');
    Alert.alert('Entry saved!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Open');
          }
        }}>
        <Feather name="arrow-left-circle" size={40} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Enter Your Entry</Text>

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.label}>Entry Date</Text>
            <Text style={styles.value}>{selectedDate.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                }
              }}
            />
          )}

          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{currentTime}</Text>

          <Text style={styles.label}>Vehicle Name</Text>
          <TextInput
            placeholder="e.g. Toyota Corolla"
            value={name}
            onChangeText={e => setName(e)}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            placeholder="e.g. 200"
            value={amount}
            onChangeText={e => setAmount(e)}
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Service Description</Text>
          <TextInput
            placeholder="e.g. Full wash"
            value={desc}
            onChangeText={e => setDesc(e)}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeView}>
            <Pressable
              style={[
                styles.typeBtn,
                type === 'credit'
                  ? {backgroundColor: '#32ff7e'}
                  : styles.typeBg,
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9ec',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  dateInput: {
    backgroundColor: '#fff',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  label: {
    fontSize: 18,
    marginTop: 12,
    color: '#444',
  },
  value: {
    fontSize: 18,
    marginBottom: 8,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5a9c42',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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

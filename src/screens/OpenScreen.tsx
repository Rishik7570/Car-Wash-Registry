import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamlist } from '../router/Router';
import { Store } from '../store/Store';

type Props = NativeStackScreenProps<RootStackParamlist, 'Open'>;

const OpenScreen = ({ navigation }: Props) => {
  const { setYearData, importYearData, exportYearData } = useContext(Store);

  return (
    <View style={styles.container}>
      <View style={styles.mainButtons}>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.boxText}>Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.boxText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('History')}>
          <Text style={styles.boxText}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.backupSection}>
        <TouchableOpacity
          style={styles.smallBox}
          onPress={() => importYearData(setYearData)}
        >
          <Text style={styles.smallBoxText}>📥 Import</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBox} onPress={() => exportYearData()}>
          <Text style={styles.smallBoxText}>📤 Export</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OpenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9ec',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainButtons: {
    marginBottom: 40,
    alignItems: 'center',
    gap: 16,
  },
  box: {
    width: 220,
    height: 80,
    backgroundColor: '#5a9c42',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    elevation: 3,
  },
  boxText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  backupSection: {
    flexDirection: 'row',
    gap: 20,
  },
  smallBox: {
    backgroundColor: '#3d7c29',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
  },
  smallBoxText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

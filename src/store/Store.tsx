import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, ReactNode, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import debounce from 'lodash/debounce';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

type props = {
  children: ReactNode;
};

type entryType = {
  time: string;
  name: string;
  amount: number;
  desc: string;
  type: 'credit' | 'debit';
};

export type dayRecord = {
  credit: number;
  debit: number;
  entries: entryType[];
};

type year = {
  [date: string]: dayRecord;
};

type storeType = {
  currentTime: string;
  type: 'credit' | 'debit';
  setType: React.Dispatch<React.SetStateAction<'credit' | 'debit'>>;
  yearData: Record<string, dayRecord>;
  setYearData: React.Dispatch<React.SetStateAction<Record<string, dayRecord>>>;
  importYearData: (setData: (data: any) => void) => Promise<void>;
  exportYearData: () => Promise<void>;
};

export const Store = createContext<storeType>({} as storeType);

const StoreProvider = ({children}: props) => {
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [yearData, setYearData] = useState<year>({});

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const importYearData = async (setData: (data: any) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const parsed = JSON.parse(content);

      await AsyncStorage.setItem('Year', JSON.stringify(parsed));
      setData(parsed);
      Alert.alert('Import successful!');
    } catch (err) {
      Alert.alert('Import failed');
    }
  };

  const exportYearData = async () => {
    try {
      const data = await AsyncStorage.getItem('Year');
      if (!data) {
        throw new Error('No data to export');
      }

      const fileUri = FileSystem.documentDirectory + 'yearData.json';
      await FileSystem.writeAsStringAsync(fileUri, data, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Share Year Data',
      });
    } catch (err) {
      Alert.alert('Export failed', String(err));
    }
  };

  useEffect(() => {
    const debouncedSave = debounce(() => {
      AsyncStorage.setItem('Year', JSON.stringify(yearData));
    }, 1000);

    debouncedSave();

    return () => {
      debouncedSave.cancel();
    };
  }, [yearData]);

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const storedData = await AsyncStorage.getItem('Year');
        if (storedData) {
          setYearData(JSON.parse(storedData));
        }
      } catch (error) {
        Alert.alert('Failed to load stored data:');
      }
    };
    loadStorage();
  }, []);

  const value = {
    currentTime,
    type,
    setType,
    yearData,
    setYearData,
    importYearData,
    exportYearData,
  };

  return <Store.Provider value={value}>{children}</Store.Provider>;
};

export default StoreProvider;

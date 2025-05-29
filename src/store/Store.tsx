import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, ReactNode, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import debounce from 'lodash/debounce';

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
  };

  return <Store.Provider value={value}>{children}</Store.Provider>;
};

export default StoreProvider;

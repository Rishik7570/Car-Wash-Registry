import React, {useContext} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DocumentPicker, {types} from 'react-native-document-picker';
import RNBlobUtil from 'react-native-blob-util';
import {Store} from '../store/Store';

const ImpExp = () => {
  const {setYearData} = useContext(Store);

  const exportData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('Year');
      if (!storedData) {
        Alert.alert('No data to export');
        return;
      }

      const path = `${RNFS.DocumentDirectoryPath}/car-wash-backup.json`;
      await RNFS.writeFile(path, storedData, 'utf8');

      await Share.open({
        url: 'file://' + path,
        type: 'application/json',
        title: 'Share Car Wash Backup',
      });
    } catch (err) {
      console.error('Export error:', err);
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const readGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your files to import data.',
            buttonPositive: 'OK',
          },
        );

        const mediaGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );

        return (
          readGranted === PermissionsAndroid.RESULTS.GRANTED ||
          mediaGranted === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const importData = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Cannot import without storage permission.',
      );
      return;
    }

    try {
      const file = await DocumentPicker.pick({
        type: [types.plainText, types.allFiles], // or types.json, if defined
      });

      const uri = file[0].uri;

      // Read the file using BlobUtil
      const content = await RNBlobUtil.fs.readFile(uri, 'utf8');
      const parsed = JSON.parse(content);

      await AsyncStorage.setItem('Year', JSON.stringify(parsed));
      setYearData(parsed);

      Alert.alert('Success', 'Data imported and refreshed!');
    } catch (err) {
      console.log('Import error:', err);
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to import data.');
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backup & Restore</Text>
      <Button title="Export Data" onPress={exportData} />
      <View style={{height: 20}} />
      <Button title="Import Data" onPress={importData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ImpExp;

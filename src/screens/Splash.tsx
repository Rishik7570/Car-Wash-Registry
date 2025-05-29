import { StyleSheet, Text, ImageBackground } from 'react-native';
import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamlist } from '../router/Router';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamlist, 'Splash'>;

const Splash = ({ navigation }: Props) => {
   useEffect(() => {
     const timer = setTimeout(() => {
       navigation.replace('Open');
     }, 2000);

     return () => clearTimeout(timer);
   }, []);

  return (
    <ImageBackground
      source={require('../assets/splash.jpg')}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <Text style={styles.title}>Singha Car Wash</Text>
        <Text style={styles.title}>& Servicing</Text>
      </LinearGradient>
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle:'italic',
  },
});

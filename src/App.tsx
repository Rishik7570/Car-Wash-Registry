import React from 'react';
import StoreProvider from './store/Store';
import { NavigationContainer } from '@react-navigation/native';
import Router from './router/Router';

const App = () => {
  return (
    <StoreProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </StoreProvider>
  );
};

export default App;

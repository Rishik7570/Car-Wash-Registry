import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import SearchPage from '../screens/SearchPage';
import OpenScreen from '../screens/OpenScreen';
import History from '../screens/History';
import Splash from '../screens/Splash';
import EditEntry from '../screens/EditEntry';

export type RootStackParamlist = {
  Splash: undefined;
  Open: undefined;
  Home: undefined;
  Search: undefined;
  History: undefined;
  Edit: { dateKey: string; entryIndex: number };
};

const Stack = createNativeStackNavigator<RootStackParamlist>();

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
      <Stack.Screen name="Open" component={OpenScreen} options={{headerShown:false}}/>
      <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
      <Stack.Screen name="Search" component={SearchPage} options={{headerShown:false}}/>
      <Stack.Screen name="History" component={History} options={{headerShown:false}}/>
      <Stack.Screen name="Edit" component={EditEntry} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default Router;

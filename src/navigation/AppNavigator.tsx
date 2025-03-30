import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NewNoteScreen from '../screens/NewNoteScreen';
import SummaryScreen from '../screens/SummaryScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#1A0B2E' },
};

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={screenOptions}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewNote" component={NewNoteScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
      <Stack.Screen name="SummaryDetail" component={SummaryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

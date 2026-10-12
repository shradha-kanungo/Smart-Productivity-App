import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TasksScreen from './src/screens/TasksScreen';
import NotesScreen from './src/screens/NotesScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import EventsScreen from './src/screens/EventsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
LogBox.ignoreAllLogs(true);
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0F0F14', borderTopColor: '#1E1E26', height: 70, paddingBottom: 10 },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E2E8F0', height: 70, paddingBottom: 10 },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: () => <Text>📊</Text> }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ tabBarIcon: () => <Text>✅</Text> }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ tabBarIcon: () => <Text>📅</Text> }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarIcon: () => <Text>📈</Text> }} />
      <Tab.Screen name="Notes" component={NotesScreen} options={{ tabBarIcon: () => <Text>📝</Text> }} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ tabBarIcon: () => <Text>💸</Text> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
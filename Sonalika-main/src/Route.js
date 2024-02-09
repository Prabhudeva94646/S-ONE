import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import Login from './screens/Login';
import List from './screens/List';
import BoxList from './screens/BoxList';
import BoxList2 from './screens/BoxList2';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="List" component={List} />
        <Stack.Screen name="BoxList" component={BoxList} />
        <Stack.Screen name="BoxList2" component={BoxList2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home.js';
import Login from './screens/Login.js';
import List from './screens/List.js';
import BoxList from './screens/BoxList.js';
import BoxList2 from './screens/BoxList2.js';
import List_from_BoxList from './screens/List_from_BoxList.js';
import ApprovalDetail from './screens/ApprovalDetail.js';
import Response from './screens/Response.js';

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
        <Stack.Screen name="List_from_BoxList" component={List_from_BoxList} />
        <Stack.Screen name="ApprovalDetail" component={ApprovalDetail} />
        <Stack.Screen name="Response" component={Response} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

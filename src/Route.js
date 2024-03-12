// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Home from './screens/Home.js';
import Login from './screens/Login.js';
import SplashScreen from './screens/SplashScreen.js';
import List from './screens/List.js';
import BoxList from './screens/BoxList.js';
import BoxList2 from './screens/BoxList2.js';
import List_from_BoxList from './screens/List_from_BoxList.js';
import ApprovalDetail from './screens/ApprovalDetail.js';
import Response from './screens/Response.js';
import DrawerItems from './Constants/DrawerItems.js';
import SideBar from './components/headers/SidePanel.js';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom drawer component to conditionally render drawer content
const CustomDrawerContent = (props) => {
  const { state, ...rest } = props;
  const newState = { ...state };
  newState.routes = newState.routes.filter(
    (item) => item.name !== 'Login' && item.name !== 'SplashScreen'
  ); // Filter out login and splash screen routes
  return <SideBar {...props} state={newState} />;
};

// Main Stack navigator for all screens
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Home" component={DrawerStack} />
    <Stack.Screen name="List" component={DrawerStack} />
    <Stack.Screen name="BoxList" component={DrawerStack} />
    <Stack.Screen name="BoxList2" component={DrawerStack} />
    <Stack.Screen name="List_from_BoxList" component={DrawerStack} />
    <Stack.Screen name="ApprovalDetail" component={DrawerStack} />
    <Stack.Screen name="Response" component={DrawerStack} />
  </Stack.Navigator>
);

// Drawer Stack navigator for screens that should have a drawer
const DrawerStack = () => (
  <Drawer.Navigator
    drawerType="front"
    initialRouteName="Home"
    drawerContent={CustomDrawerContent}
    drawerContentOptions={{
      activeTintColor: '#e91e63',
      itemStyle: {
        marginVertical: 10,
        margin: 10,
      },
    }}
    screenOptions={{ headerShown: false }}
  >
    <Drawer.Screen name="Home" component={Home} />
    <Drawer.Screen name="List" component={List} />
    <Drawer.Screen name="BoxList" component={BoxList} />
    <Drawer.Screen name="BoxList2" component={BoxList2} />
    <Drawer.Screen name="List_from_BoxList" component={List_from_BoxList} />
    <Drawer.Screen name="ApprovalDetail" component={ApprovalDetail} />
    <Drawer.Screen name="Response" component={Response} />
  </Drawer.Navigator>
);

// Main App function
export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
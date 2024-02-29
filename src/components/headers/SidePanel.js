import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SidePanel({ setMenuToggle, menuToggle }) {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('employeeName');
        setUserName(name);
      } catch (error) {
        console.error('Error retrieving user name: ', error);
      }
    };

    getUserName();

    // Add event listener for hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (menuToggle) {
        setMenuToggle(false); // Close the side panel if it's open
        return true; // Prevent default behavior
      }
      // Return false to let the default back button behavior take over
      return false;
    });

    // Cleanup function to remove event listener
    return () => backHandler.remove();
  }, [menuToggle, setMenuToggle]);

  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: Colors.WHITE,
        width: '60%',
        height: Dimensions.get('window').height,
        zIndex: 1,
        elevation: 1,
        borderRightWidth: 1,
        borderRightColor: Colors.WHITE,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: '40%',
      }}>
      <View
        style={{
          position: 'absolute',
          height: 70,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
        <View
          style={{
            marginLeft: 15,
          }}>
          <Icon3
            name="menu"
            size={28}
            color={Colors.GRAY}
            onPress={() => {
              setMenuToggle(!menuToggle);
            }}
            style={{}}
          />
        </View>
      </View>
      <View style={{ alignItems: 'center', marginTop: 90 }}>
        <Icon
          name="user"
          size={60}
          color={Colors.BLACK}
          style={{
            borderWidth: 1,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 50,
            width: 83,
          }}
        />
        <Text style={{ color: Colors.BLACK, fontSize: 17, marginTop: 10 }}>
          Hi, {userName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Login');
        }}
        style={{
          height: 70,
          width: '100%',
          borderTopWidth: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          paddingTop: 15,
        }}>
        <Icon2 name="logout" size={27} color={Colors.BLACK} />
        <Text
          style={{
            color: Colors.BLACK,
            fontSize: 18,
            fontWeight: 700,
            marginRight: 20,
            marginLeft: 8,
          }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

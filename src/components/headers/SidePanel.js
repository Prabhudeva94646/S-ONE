import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../utils/Colors';
import ImagePicker from 'react-native-image-crop-picker';

export default function SideBar(props) {
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const getUserName = async () => {
      try {
        setUserName(await AsyncStorage.getItem('employeeName'));
      } catch (error) {
        console.error('Error retrieving user name: ', error);
      }
    };

    getUserName();
    getProfileImage(); // Load profile image when component mounts
  }, []);

  useEffect(() => {
    if (profileImage) {
      saveProfileImage(profileImage); // Save profile image when it changes
    }
  }, [profileImage]);

  const selectProfileImage = async () => {
    try {
      const pickedImage = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      });
      setProfileImage(pickedImage.path);
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const saveProfileImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem('profileImage', imageUri);
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  const getProfileImage = async () => {
    try {
      const imageUri = await AsyncStorage.getItem('profileImage');
      if (imageUri !== null) {
        setProfileImage(imageUri);
      }
    } catch (error) {
      console.error('Error retrieving profile image:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('employeeCode');
      await AsyncStorage.removeItem('profileImage'); // Clear profile image on logout
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity onPress={selectProfileImage}>
          <View style={styles.userInfo}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.userIcon} />
            ) : (
              <Icon name="user" size={60} color={Colors.BLACK} style={styles.userIcon} />
            )}
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate('Home')}
        icon={({ color, size }) => <Icon name="home" size={size} color={color} />}
        labelStyle={styles.drawerItemLabel}
      />
      <DrawerItem
        label="Log Out"
        onPress={handleLogout}
        icon={({ color, size }) => <Icon name="sign-out" size={size} color={color} />}
        labelStyle={styles.drawerItemLabel}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    paddingVertical: 25,
    paddingHorizontal: 25,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 1, // Add border
    borderColor: Colors.BLACK, // Border color
  },
  userName: {
    color: Colors.BLACK,
    fontSize: 17,
    flexWrap: 'wrap',
    flex: 1,
  },
  drawerItemLabel: {
    fontSize: 16,
    marginLeft: -15,
  },
});
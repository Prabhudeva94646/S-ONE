import {View, Text, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Style from '../utils/Style';

export default function List() {
  const navigation = useNavigation();
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={Style.darkText}>Table Here</Text>
    </View>
  );
}

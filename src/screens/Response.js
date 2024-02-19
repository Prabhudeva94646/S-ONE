import React, {useEffect} from 'react';
import {View, BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SecondaryHeader from '../components/headers/SecondaryHeader';
import Res from '../components/response/Res';
import {useRoute} from '@react-navigation/native';

export default function Response() {
  const route = useRoute();
  const navigation = useNavigation();
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('List');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View>
      <SecondaryHeader inav={false} prop={'List'} />
      <Res number={route.params.number} approved={route.params.approved} />
    </View>
  );
}

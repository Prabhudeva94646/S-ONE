import {View, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import ItemForm from '../components/approvalDetails/ItemForm';
import SecondaryHeader from '../components/headers/SecondaryHeader';

export default function Item() {
  const navigation = useNavigation();
  const route = useRoute();
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
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
      <SecondaryHeader/>
      <ItemForm
        DocumentNo={route.params.DocumentNo}
        ApprovalCategory={route.params.Category}
        Item={route.params.Item}
      />
    </View>
  );
}

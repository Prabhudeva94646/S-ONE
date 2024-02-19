import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Style from '../../utils/Style';
import {useNavigation} from '@react-navigation/native';

export default function Row({item}) {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        style={Style.row}
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('ApprovalDetail');
        }}>
        <Text style={Style.listText}>{item.dep}</Text>
        <Text style={Style.listText}>{item.number}</Text>
        <Text style={Style.listText}>{item.value}</Text>
      </TouchableOpacity>
    </View>
  );
}

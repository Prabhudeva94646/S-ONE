import React from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import Colors from '../../utils/Colors';
import {useNavigation} from '@react-navigation/native';

export default function Form({name, number}) {
  const navigation = useNavigation();
  return (
    <View style={{width: Math.round(Dimensions.get('window').width)}}>
      <View
        style={{
          backgroundColor: Colors.BLUE,
          marginHorizontal: 10,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Response', {number: number, approved: true})
          }>
          <Text style={{color: Colors.BLACK, fontSize: 30, fontWeight: 500}}>
            Approve {name} {number}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Response', {number: number, approved: false})
          }>
          <Text style={{color: Colors.BLACK, fontSize: 30, fontWeight: 500}}>
            Reject {name} {number}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

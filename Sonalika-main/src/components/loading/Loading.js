import {View, ActivityIndicator, Dimensions} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';

export default function Loading() {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').height, width: '100%'}}>
      <ActivityIndicator size={'large'} color={Colors.BLUE} />
    </View>
  );
}

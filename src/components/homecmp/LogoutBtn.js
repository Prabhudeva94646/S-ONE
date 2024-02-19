import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import Style from '../../utils/Style';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../utils/Colors';

export default function LogoutBtn() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        position: 'absolute',
        top: Dimensions.get('window').height - 58,
        left: '72%',
      }}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate('Login')}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={[Colors.GRADC1, Colors.GRADC2]}
          style={{
            borderRadius: 8,
            borderWidth: 1,
            paddingVertical: 2,
          }}>
          <Text
            style={[
              Style.btn,
              {
                textAlign: 'center',
                backgroundColor: Colors.TRANSPARENT,
                borderWidth: 0,
              },
            ]}>
            Log Out
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

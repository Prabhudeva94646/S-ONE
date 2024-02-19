import React from 'react';
import {View, Text, Image} from 'react-native';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';

export default function Res({number, approved}) {
  return (
    <View
      style={{
        width: '100%',
        height: '85%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {approved == true ? (
        <View>
          <Image
            source={Images.RESPONSE.ACCEPTED}
            style={{width: 250, height: 250}}
          />
          <Text
            style={{
              color: Colors.BLACK,
              textAlign: 'center',
              marginTop: 20,
              fontSize: 18,
              fontWeight: 500,
            }}>
            {number} Approved Successfully!!
          </Text>
        </View>
      ) : (
        <View>
          <Image
            source={Images.RESPONSE.REJECTED}
            style={{width: 250, height: 250}}
          />
          <Text
            style={{
              color: Colors.BLACK,
              textAlign: 'center',
              marginTop: 20,
              fontSize: 18,
              fontWeight: 500,
            }}>
            {number} Rejected!!
          </Text>
        </View>
      )}
    </View>
  );
}

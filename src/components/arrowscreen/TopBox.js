import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../utils/Colors';
import { useNavigation } from '@react-navigation/native';

export default function TopBox({ name }) {
  const navigation = useNavigation();
  return (
    <View>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[Colors.GRADC1, Colors.GRADC2]}
        style={{
          height: 'auto',
          borderBottomWidth: 1,
          width: '100%',
          paddingVertical: 12,
          alignItems: 'center',
          flexDirection: 'row', // Ensure all text is in one line
          justifyContent: 'center', // Center align text
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('Home'); // Navigate to Home screen
          }}>
          <Text style={{ color: Colors.WHITE, fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline', marginRight: 10 }}>
            Home
          </Text>
        </TouchableOpacity>
        <Text style={{ color: Colors.WHITE, fontSize: 20, fontWeight: 'bold' }}>
          {' > '}
        </Text>
        <Text style={{ color: Colors.WHITE, fontSize: 20, fontWeight: 'bold' }}>
          {name}
        </Text>
      </LinearGradient>
    </View>
  );
}

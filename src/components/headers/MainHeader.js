import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Style from '../../utils/Style';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

export default function MainHeader({prop, searchQuery, setSearchQuery}) {
  const navigation = useNavigation();
  // const [searchQuery, setSearchQuery] = useState('');
  return (
    <View style={Style.Header}>
      <TouchableOpacity
        onPress={() => {
          prop ? navigation.navigate(prop) : navigation.goBack();
        }}
        style={{width: '10%', alignItems: 'center'}}>
        <Icon name="backspace" size={23} color={Colors.GRAY} />
      </TouchableOpacity>
      <View style={[Style.search, {width: '70%'}]}>
        <Icon name="search" size={22} color={Colors.BLACK} />
        <TextInput
          placeholder="Search"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            backgroundColor: Colors.TRANSPARENT,
            color: Colors.BLACK,
            width: '83%',
            paddingLeft: 5,
            fontSize: 15,
          }}
          placeholderTextColor={Colors.GRAY}
          value={searchQuery}
          onChangeText={query => {
            setSearchQuery(query);
          }}
        />
        {searchQuery != '' ? (
          <Icon
            name="highlight-remove"
            size={22}
            onPress={() => {
              setSearchQuery('');
            }}
            color={Colors.BLACK}
          />
        ) : null}
      </View>
      <View style={{width: '10%', alignItems: 'center'}}>
        <Icon name="refresh" size={25} color={Colors.GRAY} />
      </View>
    </View>
  );
}

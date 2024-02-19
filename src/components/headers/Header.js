import React, {useState} from 'react';
import {View, Image, TextInput} from 'react-native';
import Style from '../../utils/Style';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Header({searchQuery, setSearchQuery}) {
  return (
    <View style={Style.Header}>
      <View style={{width: '45%'}}>
        <Image
          source={Images.LOGOS.SLOGO}
          style={{width: '100%', height: '100%'}}
        />
      </View>
      <View style={[Style.search, {width: '45%'}]}>
        <Icon name="search" size={22} color={Colors.BLACK} />
        <TextInput
          placeholder="Search"
          clearButtonMode="always"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            backgroundColor: Colors.TRANSPARENT,
            color: Colors.BLACK,
            width: '75%',
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
        ) : (null)}
      </View>
      <View style={{width: '10%', alignItems: 'center'}}>
        <Icon name="refresh" size={25} color={Colors.GRAY} />
      </View>
    </View>
  );
}

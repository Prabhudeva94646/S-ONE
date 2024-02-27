import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import Style from '../../utils/Style';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import SidePanel from './SidePanel';

export default function MainHeader({prop, searchQuery, setSearchQuery}) {
  const navigation = useNavigation();
  const [menuToggle, setMenuToggle] = useState(false);
  return (
    <View>
      {menuToggle ? (
        <SidePanel menuToggle={menuToggle} setMenuToggle={setMenuToggle} />
      ) : null}
      <View style={Style.Header}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            prop ? navigation.navigate(prop) : navigation.goBack();
          }}
          style={{width: '10%', alignItems: 'center'}}>
          <Image
            source={Images.BUTTONS.BACK_BTN}
            style={{width: 30, height: 26}}
          />
          {/* <Icon name="backspace" size={23} color={Colors.GRAY} /> */}
        </TouchableOpacity>
        <View style={[Style.search, {width: '72%', marginHorizontal: '4%'}]}>
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
          <Icon
            name="menu"
            size={28}
            color={Colors.GRAY}
            onPress={() => {
              setMenuToggle(!menuToggle);
            }}
          />
        </View>
      </View>
    </View>
  );
}

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import Images from '../utils/Images';
import style from '../utils/Style';
import Colors from '../utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

function Login() {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to Exit App?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const [isChecked, setIsChecked] = useState(false);
  const [userData, setUserData] = useState({
    captcha: '',
    empcode: '',
    isChecked: false,
    psw: '',
  });
  const handleSubmit = () => {
    console.log(userData);
    setUserData({captcha: '', empcode: '', isChecked: false, psw: ''});
    setIsChecked(false);
    navigation.replace('Home');
  };
  return (
    <View>
      <ImageBackground
        source={Images.BACKGROUND_LOGIN}
        style={{width: '100%', height: Dimensions.get('window').height}}
      />
      <View style={style.container}>
        <View style={style.innercontainer}>
          <Image
            source={Images.LOGOS.SLOGO}
            style={{width: '85%', height: 130}}
          />
          <Text style={[style.darkText, {marginBottom: 23, fontWeight: 400}]}>
            Sign in to your Workspace
          </Text>
          <View style={style.outbox}>
            <TextInput
              style={style.innercontainer2}
              value={userData.empcode}
              placeholder="Employee Code"
              placeholderTextColor={Colors.GRAY}
              onChangeText={val => {
                setUserData({...userData, empcode: val});
              }}
            />
            <View
              style={[
                style.box,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Icon name="user" size={28} color={Colors.GRAY} />
            </View>
          </View>
          <View style={style.outbox}>
            <TextInput
              style={style.innercontainer2}
              value={userData.psw}
              placeholder="Password"
              placeholderTextColor={Colors.GRAY}
              secureTextEntry
              onChangeText={val => {
                setUserData({...userData, psw: val});
              }}
            />
            <View
              style={[
                style.box,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Icon name="lock" size={28} color={Colors.GRAY} />
            </View>
          </View>
          <View style={style.outbox}>
            <TextInput
              style={style.innercontainer3}
              value={userData.captcha}
              placeholder="Enter CAPTCHA"
              placeholderTextColor={Colors.GRAY}
              onChangeText={val => {
                setUserData({...userData, captcha: val});
              }}
            />
          </View>
          <View
            style={[
              style.outbox,
              {
                justifyContent: 'space-between',
                marginBottom: 0,
                marginVertical: 5,
                marginBottom: 10,
              },
            ]}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <CheckBox
                isChecked={isChecked}
                onClick={() => {
                  setUserData({...userData, isChecked: !isChecked}),
                    setIsChecked(!isChecked);
                }}
              />
              <Text
                style={{
                  alignItems: 'center',
                  color: Colors.BLACK,
                  marginLeft: 5,
                }}>
                Remember Me
              </Text>
            </View>
            <View>
              <Text style={{color: Colors.BLUE}}>Forgot Password</Text>
            </View>
          </View>
          <View style={style.outbox}>
            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.6}>
              <Text style={style.btn}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              style.outbox,
              {justifyContent: 'space-around', marginTop: 5},
            ]}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: Colors.GRAY,
                  fontSize: 11,
                  marginRight: 5,
                  lineHeight: 25,
                  fontWeight: 500,
                }}>
                Powered by
              </Text>
              <Text
                style={{
                  color: Colors.GRAY,
                  fontSize: 22,
                  lineHeight: 25,
                  paddingRight: 15,
                }}>
                <Text style={{fontWeight: 800}}>S-</Text>ONE
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: Colors.GRAY,
                  borderLeftWidth: 2,
                  fontSize: 15,
                  paddingLeft: 10,
                  fontWeight: 500,
                  lineHeight: 25,
                }}>
                Innovation in Motion
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Login;

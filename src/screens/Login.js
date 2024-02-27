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
import apiCaller from '../api/APICaller';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const randomString = Math.random().toString(36).slice(8);
  const [captcha, setCaptcha] = useState(randomString);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    'Something Went Wrong !! Try Again Later !!',
  );
  const [userData, setUserData] = useState({
    captcha: '',
    empcode: '',
    isChecked: false,
    psw: '',
  });

  const refreshString = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    setCaptcha(result);
    setUserData({...userData, captcha: ''});
  };

  const matchCaptcha = () => {
    if (userData.captcha === captcha) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (userData.empcode === '') {
      setError(true);
      setErrorMsg('Please enter your Employee Code.');
      return;
    }
    if (userData.psw === '') {
      setError(true);
      setErrorMsg('Please enter your password.');
      return;
    }
    if (!matchCaptcha()) {
      setError(true);
      setErrorMsg('CAPTCHA verification failed. Please try again.');
      refreshString();
      setUserData({...userData, captcha: ''});
      return;
    }

    const res = await apiCaller.AuthenticateUser(
      userData.empcode,
      userData.psw,
    );

    if (res.Status === 'Authenticated') {
      setUserData({captcha: '', empcode: '', isChecked: false, psw: ''});
      setIsChecked(false);
      await AsyncStorage.setItem('employeeCode', userData.empcode);
      await AsyncStorage.setItem('employeeName', res.EmpName);
      navigation.replace('Home');
    } else {
      setError(true);
      setErrorMsg(res.Status);
      return;
    }
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
          <View style={[style.outbox, {justifyContent: 'space-between'}]}>
            <TextInput
              style={style.innercontainer3}
              value={userData.captcha}
              placeholder="Enter CAPTCHA"
              placeholderTextColor={Colors.GRAY}
              onChangeText={val => {
                setUserData({...userData, captcha: val});
              }}
            />
            <View
              style={[
                style.innercontainer3,
                {
                  borderWidth: 0,
                  width: '45%',
                  flexDirection: 'row',
                  backgroundColor: Colors.TRANSPARENT,
                },
              ]}>
              <ImageBackground
                source={Images.CAPTCHABG}
                resizeMode="cover"
                style={{width: '85%', height: '100%'}}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '500',
                    color: Colors.BLACK,
                    height: '100%',
                    width: '85%',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    userSelect: 'none',
                    textDecorationLine: 'line-through',
                  }}>
                  {captcha}
                </Text>
              </ImageBackground>
              <TouchableOpacity
                style={{width: '15%', alignItems: 'center'}}
                activeOpacity={0.6}
                onPress={() => refreshString()}>
                <Icon name="refresh" size={20} color={Colors.GRAY} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              style.outbox,
              {
                justifyContent: 'space-between',
                marginVertical: 5,
                height: 'auto',
                marginBottom: 20,
              },
            ]}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
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
          </View>
          <View
            style={[
              style.outbox,
              error ? {marginBottom: 0} : {marginBottom: 22},
            ]}>
            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.6}>
              <Text style={style.btn}>Sign In</Text>
            </TouchableOpacity>
          </View>
          {error && (
            <View style={{marginVertical: 8}}>
              <Text style={{color: Colors.RED, fontSize: 13, fontWeight: 500}}>
                {errorMsg}
              </Text>
            </View>
          )}
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

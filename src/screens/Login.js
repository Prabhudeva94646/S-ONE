import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const authenticateUser = async (empcode, password, navigation) => {
    try {
        const response = await fetch(
            `https://apps.sonalika.com:7007/WebService/api/SONE/AuthenticateUser?UserName=${empcode}&Password=${password}&Token=uBylwJMQexOO6Wd3YSzQMspiZOSgyX3MV38nHDXtUmxu0MGESIEO26bblqwR1GrrFb3dZZuu6f7A66inioy1snV116crhfDo5gZ9TDP4nkTV0LgphjJMhB9rqcm4WcnZ`
        );
        const data = await response.json();

        if (data.Status === 'Authenticated') {
            // Store employee code and name in AsyncStorage
            await AsyncStorage.setItem('employeeCode', empcode);
            await AsyncStorage.setItem('employeeName', data.EmpName);
        }

        return data;
    } catch (error) {
        console.error('Error occurred during authentication:', error);
        throw new Error('Authentication failed');
    }
};

function Login({ navigation }) {
    const [userData, setUserData] = useState({
        captcha: '',
        empcode: '',
        isChecked: false,
        psw: '',
    });
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(
        'Something Went Wrong !! Try Again Later !!',
    );
    const [captcha, setCaptcha] = useState('');

    const refreshString = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) { // Change captcha length to 4
            result += characters.charAt(
                Math.floor(Math.random() * characters.length),
            );
        }
        setCaptcha(result);
        setUserData({ ...userData, captcha: '' });
    };

    useEffect(() => {
        const backAction = () => {
            Alert.alert('Hold on!', 'Are you sure you want to Exit App?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'YES', onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        refreshString(); // Call refreshString to generate captcha when component mounts
        return () => backHandler.remove();
    }, []);

    const matchCaptcha = () => {
        return userData.captcha === captcha;
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
        if (userData.captcha === '') {
            setError(true);
            setErrorMsg('Please enter the CAPTCHA.');
            return;
        }

        try {
            const data = await authenticateUser(userData.empcode, userData.psw, navigation);
            if (data.Status === 'Authenticated' && matchCaptcha()) {
                // Authentication successful
                // Retrieve employee name from AsyncStorage
                const employeeName = await AsyncStorage.getItem('employeeName');
                // Now you can use the employeeName variable as needed
                navigation.replace('Home');
            } else {
                // Authentication failed
                if (data.Status === 'Authenticated') {
                    setError(true);
                    setErrorMsg(`Hi ${data.EmpName}, the captcha is incorrect`);
                } else {
                    setError(true);
                    setErrorMsg('Invalid credentials or CAPTCHA. Please try again.');
                }
                refreshString(); // Refresh CAPTCHA
            }
        } catch (error) {
            console.error('Error occurred during authentication:', error);
            setError(true);
            setErrorMsg('Something went wrong. Please try again later.');
        }
    };

    return (
        <View>
            <ImageBackground
                source={Images.BACKGROUND_LOGIN}
                style={{ width: '100%', height: Dimensions.get('window').height }}
            />
            <View style={style.container}>
                <View style={style.innercontainer}>
                    <Image
                        source={Images.LOGOS.SLOGO}
                        style={{ width: '85%', height: 130 }}
                    />
                    <Text style={[style.darkText, { marginBottom: 23, fontWeight: 400 }]}>
                        Sign in to your Workspace
                    </Text>
                    <View style={style.outbox}>
                        <TextInput
                            style={style.innercontainer2}
                            value={userData.empcode}
                            placeholder="Employee Code"
                            placeholderTextColor={Colors.GRAY}
                            onChangeText={(val) => {
                                setUserData({ ...userData, empcode: val });
                            }}
                        />
                        <View
                            style={[
                                style.box,
                                { alignItems: 'center', justifyContent: 'center' },
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
                            onChangeText={(val) => {
                                setUserData({ ...userData, psw: val });
                            }}
                        />
                        <View
                            style={[
                                style.box,
                                { alignItems: 'center', justifyContent: 'center' },
                            ]}>
                            <Icon name="lock" size={28} color={Colors.GRAY} />
                        </View>
                    </View>
                    <View style={[style.outbox, { justifyContent: 'space-between' }]}>
                        <TextInput
                            style={style.innercontainer3}
                            value={userData.captcha}
                            placeholder="Enter CAPTCHA"
                            placeholderTextColor={Colors.GRAY}
                            onChangeText={(val) => {
                                setUserData({ ...userData, captcha: val });
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
                                style={{ width: '85%', height: '100%' }}>
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
                                style={{ width: '15%', alignItems: 'center' }}
                                onPress={() => refreshString()}>
                                <Icon name="refresh" size={20} color={Colors.GRAY} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={[
                            style.outbox,
                            { justifyContent: 'space-between', marginVertical: 5, height: 'auto', marginBottom: 20 },
                        ]}>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                isChecked={userData.isChecked}
                                onClick={() => {
                                    setUserData({ ...userData, isChecked: !userData.isChecked });
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
                            { marginBottom: error ? 0 : 22 },
                        ]}>
                        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.6}>
                            <Text style={style.btn}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                    {error && (
                        <View style={{ marginVertical: 8 }}>
                            <Text style={{ color: Colors.RED, fontSize: 13, fontWeight: 500 }}>
                                {errorMsg}
                            </Text>
                        </View>
                    )}
                    <View
                        style={[
                            style.outbox,
                            { justifyContent: 'space-around', marginTop: 5 },
                        ]}>
                        <View style={{ flexDirection: 'row' }}>
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
                                <Text style={{ fontWeight: 800 }}>S-</Text>ONE
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

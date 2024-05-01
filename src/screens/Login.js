import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
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
import Orientation from 'react-native-orientation-locker';
import Loading from "../components/loading/Loading";

const authenticateUser = async (empcode, password, navigation) => {
    try {
        const response = await fetch(
            `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/AuthenticateUser?UserName=${empcode}&Password=${password}&Token=uBylwJMQexOO6Wd3YSzQMspiZOSgyX3MV38nHDXtUmxu0MGESIEO26bblqwR1GrrFb3dZZuu6f7A66inioy1snV116crhfDo5gZ9TDP4nkTV0LgphjJMhB9rqcm4WcnZ`
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
        empcode: '',
        isChecked: false,
        psw: '',
    });
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(
        'Something Went Wrong !! Try Again Later !!',
    );
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock the screen orientation to 'PORTRAIT' mode when the component mounts
    Orientation.lockToPortrait();

  }, []);

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
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const fetchRememberedData = async () => {
            const empcode = await AsyncStorage.getItem('rememberedEmployeeCode');
            const psw = await AsyncStorage.getItem('rememberedPassword');
            if (empcode && psw) {
                setUserData({ ...userData, empcode, psw, isChecked: true });
                setIsLoading(false);
                navigation.replace('drawer');
            } else {
                setIsLoading(false);
            }
        };
        fetchRememberedData();
    }, []);

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

        try {
            const data = await authenticateUser(userData.empcode, userData.psw, navigation);
            if (data.Status === 'Authenticated') {
                // Authentication successful
                // Store user credentials if "Remember Me" is checked
                if (userData.isChecked) {
                    await AsyncStorage.setItem('rememberedEmployeeCode', userData.empcode);
                    await AsyncStorage.setItem('rememberedPassword', userData.psw);
                }
                // Retrieve employee name from AsyncStorage
                const employeeName = await AsyncStorage.getItem('employeeName');
                navigation.replace('drawer');
            } else {
                // Authentication failed
                setError(true);
                setErrorMsg('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error occurred during authentication:', error);
            setError(true);
            setErrorMsg('Something went wrong. Please try again later.');
        }
    };

    if (isLoading) {
        return (
            <View style={{}}>
                <Loading />
            </View>
        );
    }

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
                             keyboardType="numeric" // Restrict input to numeric characters
                                returnKeyType="next" // Change keyboard return key to "Next"
                                onChangeText={(val) => {
                                  // Validate if the entered value is numeric (optional)
                                  if (/^\d+$/.test(val) || val === '') {
                                    setUserData({ ...userData, empcode: val });
                             }
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
                                Keep Me Signed In
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
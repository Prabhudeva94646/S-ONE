import React, {useEffect, useState} from 'react';
import {View, FlatList, BackHandler, Alert} from 'react-native';
import HomeBox from '../components/homecmp/HomeBox';
import Header from '../components/headers/Header';
import homeAPI from '../api/Homeapi';
import Loading from '../components/loading/Loading';

export default function Home() {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [Completedata, setCompleteData] = useState([]);
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    setIsLoading(true);
    homeAPI.getCategoryData().then(resData => {
      if (resData) {
        setData(resData);
        setCompleteData(resData);
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    setData(
      Completedata.filter(function (item) {
        return item.Category.toLowerCase().indexOf(searchQuery) > -1;
      }),
    );
  }, [searchQuery]);

  if (isLoading) {
    return (
      <View>
        <Loading />
      </View>
    );
  }
  return (
    <View>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FlatList
        data={data}
        contentContainerStyle={{paddingBottom: 25}}
        renderItem={({item}) => (
          <HomeBox Category={item.Category} number={item.count} />
        )}
        style={{paddingTop: 25, marginBottom: 'auto'}}
      />
    </View>
  );
}

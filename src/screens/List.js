import {View, BackHandler, RefreshControl} from 'react-native';
import React, {useState, useEffect} from 'react';
import SwipeableFlatList from 'react-native-swipeable-list';
import {useNavigation, useRoute} from '@react-navigation/native';
import apiCaller from '../api/APICaller';
import MainHeader from '../components/headers/MainHeader';
import Row from '../components/listcmp/Row';
import Heading from '../components/listcmp/Heading';
import Loading from '../components/loading/Loading';

export default function List() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState();
  const [data, setData] = useState();
  const [completeData, setCompleteData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const data = async () => {
      setIsLoading(true);
      await apiCaller
        .ListData(route.params.Category)
        .then(resData => {
          if (resData) {
            setData(resData.Data);
            setCompleteData(resData.Data);
          }
        })
        .then(() => {
          setIsLoading(false);
          setRefreshing(false);
        });
    };
    data();
  }, [refreshing]);

  useEffect(() => {
    setData(
      completeData.filter(
        item =>
          item.RequestorDept.toLowerCase().includes(
            searchQuery.toLowerCase(),
          ) ||
          item.DocumentNo.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
  };

  if (isLoading) {
    return (
      <View>
        <Loading />
      </View>
    );
  }

  return (
    <View>
      <MainHeader
        prop={'Home'}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Heading item={{dep: 'Dep.', number: 'PR number', value: 'PR value'}} />
      <SwipeableFlatList
        data={data}
        contentContainerStyle={{}}
        renderItem={({item}) => <Row item={item} />}
        style={{marginBottom: 'auto'}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

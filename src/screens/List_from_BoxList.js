import React, { useState, useEffect } from 'react';
import { View, BackHandler, RefreshControl, Text } from 'react-native'; // Import Text component
import SwipeableFlatList from 'react-native-swipeable-list';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiCaller from '../api/APICaller';
import MainHeader from '../components/headers/MainHeader';
import Row from '../components/listcmp/Row';
import Heading from '../components/listcmp/Heading';
import Loading from '../components/loading/Loading';

export default function List() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
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
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await apiCaller.ListData(route.params.Category);
        if (res.HasPendingApprovals) {
          setCompleteData(res.Data);
          setData(res.Data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    };
    fetchData();
  }, [refreshing, route.params.Category]);

  useEffect(() => {
    if (completeData.length > 0) {
      const filteredData = completeData.filter(
        item => item.RequestorDept.toLowerCase() === route.params.VERTICAL_NAME.toLowerCase()
      );
      setData(filteredData);
    } else {
      setData([]);
    }
  }, [completeData, route.params.VERTICAL_NAME]);

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
      <Heading item={{ dep: 'Dept.', number: 'Doc. No.', value: 'App. value' }} />
      <SwipeableFlatList
        data={data}
        contentContainerStyle={{}}
        renderItem={({ item }) => <Row item={item} />}
        style={{ marginBottom: 'auto' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ padding: 10 }}>
         <Text>Route Params: {JSON.stringify(route.params)}</Text>
      </View>
    </View>
  );
}

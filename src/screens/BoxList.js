import React, { useEffect, useState } from 'react';
import { View, BackHandler, StyleSheet } from 'react-native';
import MainHeader from '../components/headers/MainHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopBox from '../components/arrowscreen/TopBox';
import Loading from '../components/loading/Loading';
import HomeBox from '../components/homecmp/HomeBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwipeableFlatList from 'react-native-swipeable-list';

const TOKEN = 'uBylwJMQexOO6Wd3YSzQMspiZOSgyX3MV38nHDXtUmxu0MGESIEO26bblqwR1GrrFb3dZZuu6f7A66inioy1snV116crhfDo5gZ9TDP4nkTV0LgphjJMhB9rqcm4WcnZ';

export default function BoxList() {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
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
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const EmpCode = await AsyncStorage.getItem('employeeCode');
        const response = await fetch(
          `https://apps.sonalika.com:7007/WebService/api/SONE/GetPendingApprovalsList?EmpCode=${EmpCode}&ApprovalCategory=${route.params.Category}&Token=${TOKEN}`
        );
        const responseData = await response.json();
        if (responseData.HasPendingApprovals) {
          const countMap = {};
          const uniqueData = [];
          responseData.Data.forEach(item => {
            if (!countMap[item.RequestorDept]) {
              countMap[item.RequestorDept] = 1;
              uniqueData.push(item);
            } else {
              countMap[item.RequestorDept]++;
            }
          });
          const mappedData = uniqueData.map(item => ({
            ...item,
            count: countMap[item.RequestorDept],
          }));
          setData(mappedData);
          setFilteredData(mappedData);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [route.params.Category]);

  useEffect(() => {
    if (route.params && route.params.department) {
      const filteredData = data.filter(
        item =>
          item.RequestorDept.toLowerCase() ===
          route.params.department.toLowerCase(),
      );
      setFilteredData(filteredData);
    } else {
      const filteredData = data.filter(
        item =>
          item.RequestorDept.toLowerCase().includes(
            searchQuery.toLowerCase(),
          ) ||
          item.DocumentNo.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filteredData);
    }
  }, [searchQuery, route.params.department, data]);

  const handleRequestorDeptClick = (dept) => {
    navigation.navigate('List_from_BoxList', { department: dept });
  };

  const renderItem = ({ item }) => (
    <HomeBox
      Category={item.RequestorDept}
      number={item.count}
      nt={'List_from_BoxList'}
      fs={22}
      prop={{
        Category: route.params.Category,
        VERTICAL_NAME: item.RequestorDept,
        onPress: () => handleRequestorDeptClick(item.RequestorDept),
      }}
    />
  );

  const handleReload = async () => {
    setRefreshing(true);
    try {
      const EmpCode = await AsyncStorage.getItem('employeeCode');
      const response = await fetch(
        `https://apps.sonalika.com:7007/WebService/api/SONE/GetPendingApprovalsList?EmpCode=${EmpCode}&ApprovalCategory=${route.params.Category}&Token=${TOKEN}`
      );
      const responseData = await response.json();
      if (responseData.HasPendingApprovals) {
        const countMap = {};
        const uniqueData = [];
        responseData.Data.forEach(item => {
          if (!countMap[item.RequestorDept]) {
            countMap[item.RequestorDept] = 1;
            uniqueData.push(item);
          } else {
            countMap[item.RequestorDept]++;
          }
        });
        const mappedData = uniqueData.map(item => ({
          ...item,
          count: countMap[item.RequestorDept],
        }));
        setData(mappedData);
        setFilteredData(mappedData);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setRefreshing(false);
    }
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
      <MainHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <TopBox name={route.params.Category} />
      <SwipeableFlatList
        data={filteredData}
        contentContainerStyle={styles.flatListContainer}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={handleReload}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    paddingTop: 25,
    marginBottom: 'auto',
  },
});
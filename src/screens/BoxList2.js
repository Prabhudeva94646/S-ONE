import {View, FlatList, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainHeader from '../components/headers/MainHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import TopBox from '../components/arrowscreen/TopBox';
import Box from '../components/arrowscreen/Box';
import homeAPI from '../api/Homeapi';
import Loading from '../components/loading/Loading';
// import LogoutBtn from '../components/homecmp/LogoutBtn';

export default function BoxList2() {
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
  const [Completedata, setCompleteData] = useState([]);
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    setIsLoading(true);
    homeAPI
      .getBoxList2Data({
        Category: `${route.params.Category}`,
        VERTICAL_NAME: `${route.params.VERTICAL_NAME}`,
      })
      .then(resData => {
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
        return item.DEPTNAME.toLowerCase().indexOf(searchQuery) > -1;
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
      <MainHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <TopBox name={route.params.VERTICAL_NAME} />
      <FlatList
        data={data}
        contentContainerStyle={{paddingBottom: 10}}
        renderItem={({item}) => (
          <Box
            name={item.DEPTNAME}
            number={item.count}
            nt={'List'}
            prop={{
              Category: route.params.Category,
              VERTICAL_NAME: route.params.VERTICAL_NAME,
              DEPTNAME: item.DEPTNAME,
            }}
            inCenter={true}
          />
        )}
        style={{paddingTop: 10, marginBottom: 'auto'}}
      />
      {/* <LogoutBtn /> */}
    </View>
  );
}

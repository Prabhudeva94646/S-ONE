import {View, FlatList, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainHeader from '../components/headers/MainHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import TopBox from '../components/arrowscreen/TopBox';
import HomeBox from '../components/homecmp/HomeBox';
import homeAPI from '../api/Homeapi';
import Loading from '../components/loading/Loading';
// import LogoutBtn from '../components/homecmp/LogoutBtn';

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
  const [Completedata, setCompleteData] = useState([]);
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    setIsLoading(true);
    homeAPI
      .getBoxListData({
        Category: `${route.params.Category}`,
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
        return item.VERTICAL_NAME.toLowerCase().indexOf(searchQuery) > -1;
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
      <TopBox name={route.params.Category} />
      <FlatList
        data={data}
        contentContainerStyle={{paddingBottom: 25}}
        renderItem={({item}) => (
          <HomeBox
            Category={item.VERTICAL_NAME}
            number={item.count}
            nt={'BoxList2'}
            fs={22}
            prop={{
              Category: route.params.Category,
              VERTICAL_NAME: item.VERTICAL_NAME,
            }}
          />
        )}
        style={{paddingTop: 25, marginBottom: 'auto'}}
      />
      {/* <LogoutBtn/> */}
    </View>
  );
}

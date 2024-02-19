import {View, FlatList, BackHandler} from 'react-native';
import React, {useState, useEffect} from 'react';
import MainHeader from '../components/headers/MainHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import ListData from '../Data/ListData';
import Row from '../components/listcmp/Row';
import Heading from '../components/listcmp/Heading';
import LogoutBtn from '../components/homecmp/LogoutBtn';

export default function List() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState();

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

  useEffect(() => {}, [searchQuery]);

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
      <FlatList
        data={ListData}
        contentContainerStyle={{}}
        renderItem={({item}) => <Row item={item} />}
        style={{marginBottom: 'auto'}}
      />
      <LogoutBtn />
    </View>
  );
}

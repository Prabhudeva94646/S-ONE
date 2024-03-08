import {View, FlatList, BackHandler} from 'react-native';
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import apiCaller from '../api/APICaller';
import Form from '../components/approvalDetails/Form';
import SecondaryHeader from '../components/headers/SecondaryHeader';

export default function ApprovalDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const [len, setLen] = useState(0);
  const [data, setData] = useState();
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

  useEffect(() => {
    const fetchData = async () => {
      await apiCaller.ListData(route.params).then(resData => {
        if (resData) {
          setData(resData.Data);
          setLen(resData.Data.length);
        }
      });
    };
    fetchData();
  }, []);

  const flatListRef = useRef(null);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(1);

  const onNextPress = useCallback(() => {
    if (currentSectionIndex < len - 1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentSectionIndex + 1,
      });
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  }, [currentSectionIndex, len]);
  const onBackPress = useCallback(() => {
    if (currentSectionIndex > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentSectionIndex - 1,
      });
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  }, [currentSectionIndex]);

  const onScroll = useCallback(({viewableItems}) => {
    if (viewableItems.length === 1) {
      setCurrentSectionIndex(viewableItems[0].index);
    }
  }, []);

  return (
    <View>
      <SecondaryHeader
        inav={true}
        cp={currentSectionIndex + 1}
        tp={len}
        nfun={onNextPress}
        bfun={onBackPress}
        prop={'List'}
      />
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({item}) => (
          <Form DocumentNo={item.DocumentNo} ApprovalCategory={route.params} />
        )}
        onViewableItemsChanged={onScroll}
        keyExtractor={data => data.DocumentNo}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

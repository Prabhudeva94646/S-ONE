import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  BackHandler,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiCaller from "../api/APICaller";
import Form from "../components/approvalDetails/Form";
import Loading from "../components/loading/Loading";
import Colors from "../utils/Colors";

export default function ApprovalDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const [len, setLen] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await apiCaller
        .ListData(route.params.Category)
        .then((resData) => {
          if (resData) {
            if (route.params.Dept) {
              console.log("Dept:", route.params.Dept);
              const filteredData = resData.Data.filter(
                (item) =>
                  item.RequestorDept.toLowerCase() ===
                  route.params.Dept.toLowerCase()
              );
              setData(filteredData);
              setLen(filteredData.length);
            } else {
              setData(resData.Data);
              setLen(resData.Data.length);
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchData();
  }, [route.params]);

  const flatListRef = useRef(null);

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

  const onScroll = useCallback(({ viewableItems }) => {
    if (viewableItems.length === 1) {
      setCurrentSectionIndex(viewableItems[0].index);
    }
  }, []);

  if (isLoading) {
    return (
      <View>
        <Loading />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Form
      key={item.DocumentNo}
      DocumentNo={item.DocumentNo}
      ApprovalCategory={route.params.Category}
    />
  );

  return (
    <View>
      <View
        style={[
          Style.Header,
          { justifyContent: "flex-start", alignItems: "center" },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: 20, width: "20%", position: "absolute" }}
        >
          <Icon name="arrow-back" size={24} color={Colors.BLACK} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            height: 70,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={onBackPress}>
            <Icon name="arrow-back" size={24} color={Colors.GRAY} />
          </TouchableOpacity>
          <Text
            style={{ color: Colors.BLACK, fontSize: 18, marginHorizontal: 25 }}
          >
            {currentSectionIndex + 1}/{len}
          </Text>
          <TouchableOpacity onPress={onNextPress}>
            <Icon name="arrow-forward" size={24} color={Colors.GRAY} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        initialNumToRender={2}
        onViewableItemsChanged={onScroll}
        keyExtractor={(item) => item.DocumentNo}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </View>
  );
}

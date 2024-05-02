import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, BackHandler, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the back icon from react-native-vector-icons
import Style from '../utils/Style';

const HistoryData = () => {
  const [dataFrame, setDataFrame] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const emptyDataFrame = createEmptyDataFrame(5);
    setDataFrame(emptyDataFrame);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={Style.listText}>{item.docno}</Text>
      <Text style={Style.listText}>{item.decision}</Text>
      <Text style={[Style.listText, styles.lastCell]}>{item.datetime}</Text>
    </View>
  );

  const handleBack = () => {
    navigation.goBack();
    return true;
  };

    const createEmptyDataFrame = (rowCount) => {
      const emptyRows = [];
      for (let i = 0; i < rowCount; i++) {
        const emptyRow = {
          docno: '',
          decision: '',
          datetime: '',
        };
        emptyRows.push(emptyRow);
      }
      return emptyRows;
    };


  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Approval History Info</Text>
      </View>

      <View style={styles.columnHeaders}>
        <Text style={styles.columnHeader}>Document No</Text>
        <Text style={styles.columnHeader}>Decision</Text>
        <Text style={[styles.columnHeader, styles.lastColumnHeader]}>Date & Time</Text>
      </View>

      <FlatList
        data={dataFrame}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  backButton: {
    paddingRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  columnHeaders: {
    backgroundColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'center',
    //padding: 10,
    height: 35,
    borderBottomWidth: 1,
  },
  columnHeader: {
    flex: 1,
    fontSize: 18,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    borderRightWidth: 1,
  },
  lastColumnHeader: {
    borderRightWidth: 0,
  },
  row: {
    flexDirection: 'row',
    //padding: 10,
    fontSize: 15,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    height: 35,
  },
  lastCell: {
    borderRightWidth: 0,
  },
});

export default HistoryData;

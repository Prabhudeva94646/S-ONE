import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the back icon from react-native-vector-icons

// Function to create empty data frame
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

const History_data = () => {
  const [dataFrame, setDataFrame] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Call the function to create empty data frame with 5 rows
    const emptyDataFrame = createEmptyDataFrame(5);
    setDataFrame(emptyDataFrame);

    // Add event listener for hardware back press
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);

    // Cleanup function to remove event listener
    return () => backHandler.remove();
  }, []);

  // Render each row of the data frame
  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: 'lightgray' }}>
      <Text style={{ flex: 1, textAlign: 'center', borderRightWidth: 1 }}>{item.docno}</Text>
      <Text style={{ flex: 1, textAlign: 'center', borderRightWidth: 1 }}>{item.decision}</Text>
      <Text style={{ flex: 1, textAlign: 'center' }}>{item.datetime}</Text>
    </View>
  );

  // Function to handle back button press
  const handleBack = () => {
    navigation.goBack();
    return true; // Prevent default behavior (exit app)
  };

  return (
    <View >
      {/* Header */}
      <View style={{ backgroundColor: 'lightblue', padding: 25, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'black' }}>
        <TouchableOpacity onPress={handleBack} style={{ paddingRight: 10 }}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold',flex:1, alignItems: 'center', textAlign: 'center' }}>Approval History Info</Text>
      </View>

      {/* Column headers */}
      <View style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1 }}>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', borderRightWidth: 1 }}>Document No</Text>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', borderRightWidth: 1 }}>Decision</Text>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>Date & Time</Text>
      </View>

      {/* FlatList */}
      <FlatList
        data={dataFrame}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default History_data;

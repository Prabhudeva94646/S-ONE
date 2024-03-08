// import React from 'react';
// import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
// import Colors from '../../utils/Colors';
// import {useNavigation} from '@react-navigation/native';

// export default function Form({name, number}) {
//   const navigation = useNavigation();
//   return (
//     <View style={{width: Math.round(Dimensions.get('window').width)}}>
//       <View
//         style={{
//           backgroundColor: Colors.BLUE,
//           marginHorizontal: 10,
//           height: '100%',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate('Response', {number: number, approved: true})
//           }>
//           <Text style={{color: Colors.BLACK, fontSize: 30, fontWeight: 500}}>
//             Approve {name} {number}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate('Response', {number: number, approved: false})
//           }>
//           <Text style={{color: Colors.BLACK, fontSize: 30, fontWeight: 500}}>
//             Reject {name} {number}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
} from 'react-native';
import apiCaller from '../../api/APICaller';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../utils/Colors';
import Loading from '../../components/loading/Loading';

export default function Form({DocumentNo, ApprovalCategory}) {
  const [data, setData] = useState([]);
  const [compData, setCompData] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remark, setRemark] = useState('');
  useEffect(() => {
    const data = async () => {
      setIsLoading(true);
      await apiCaller
        .TableData(DocumentNo, ApprovalCategory)
        .then(resData => {
          if (resData) {
            setData(resData.Data.Data_Header[0].FieldsList);
            setCompData(resData);
          }
        })
        .then(() => {
          setIsLoading(false);
        });
      setIsLoading(true);
      await apiCaller
        .approvalHistory(DocumentNo, ApprovalCategory)
        .then(resData => {
          if (resData) {
            setHistory(resData.Data[0]);
          }
        })
        .then(() => {
          setIsLoading(false);
          setRefreshing(false);
        });
    };
    data();
  }, []);

  if (isLoading) {
    return (
      <View style={{width: Dimensions.get('window').width}}>
        <Loading />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      }}>
      <ScrollView nestedScrollEnabled={true} style={{}}>
        <View>
          <View style={{width: '100%', padding: 10, borderBottomWidth: 1}}>
            <Text style={{color: '#000', fontSize: 15}}>
              {compData.ApprovalMapID}
            </Text>
            <Text style={{color: '#000', fontSize: 15}}>
              {compData.Message}
            </Text>
          </View>
          <View style={styles.container}>
            <View style={styles.row}>
              {data.map(item => (
                <View style={styles.cell} key={item.ColumnName.toString()}>
                  <Text
                    style={{
                      color: '#000',
                      borderRightWidth: 1,
                      width: '30%',
                      textAlign: 'center',
                      padding: 5,
                      fontSize: 15,
                    }}>
                    {item.ColumnName}
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                      width: '70%',
                      textAlign: 'center',
                      fontSize: 15,
                      padding: 5,
                    }}>
                    {item.ColumnValue}
                  </Text>
                </View>
              ))}
            </View>
            {compData.Data.Data_Detail ? (
              <View style={styles.item2}>
                <Text style={{color: '#000', fontSize: 15}}>
                  Number of items - {compData.Data.Data_Detail.length}
                </Text>
                <Icon
                  name="navigate-next"
                  size={22}
                  color={Colors.BLACK}
                  style={{
                    marginLeft: 228,
                    marginTop: -21,
                    borderWidth: 1.5,
                    borderRadius: 50,
                    marginRight: 25,
                    paddingHorizontal: 2,
                  }}
                />
              </View>
            ) : null}
            {compData.Data.Data_SubDetail ? (
              <View style={styles.item2}>
                <Text style={{color: '#000', fontSize: 15}}>
                  Number of Subitems - {compData.Data.Data_SubDetail.length}
                </Text>
                <Icon
                  name="navigate-next"
                  size={22}
                  color={Colors.BLACK}
                  style={{
                    marginLeft: 228,
                    marginTop: -21,
                    borderWidth: 1.5,
                    borderRadius: 50,
                    marginRight: 25,
                    paddingHorizontal: 2,
                  }}
                />
              </View>
            ) : null}
            <View style={styles.de}>
              <Text style={{color: '#000', width: '100%', fontSize: 15}}>
                Approval Details-
              </Text>
            </View>
            <View style={styles.approval}>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <Text style={[styles.add, {width: '35%', borderLeftWidth: 0}]}>
                  Date & Time
                </Text>
                <Text style={[styles.add, {width: '35%'}]}>By</Text>
                <Text style={[styles.add, {width: '35%'}]}>Level</Text>
              </View>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <Text style={[styles.add, {width: '35%', borderLeftWidth: 0}]}>
                  {history.ApproverActionDate}
                </Text>
                <Text style={[styles.add, {width: '35%'}]}>
                  {history.ApproverName}
                </Text>
                <Text style={[styles.add, {width: '35%'}]}>
                  {history.ApproverLevel}
                </Text>
              </View>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <Text style={[styles.add, {width: '35%', borderLeftWidth: 0}]}>
                  Remarks
                </Text>
                <Text style={[styles.add, {width: '65%'}]}>
                  {history.ApproverRemarks}
                </Text>
              </View>
            </View>
            <View style={styles.re}>
              <Text style={{color: Colors.BLACK, fontSize: 15}}>*Remarks-</Text>
            </View>
            <View style={styles.rema}>
              <TextInput
                multiline={true}
                style={{
                  color: Colors.BLACK,
                  fontSize: 15,
                  padding: 0,
                  paddingHorizontal: 5,
                }}
                value={remark}
                onChangeText={val => {
                  setRemark(val);
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    color: Colors.BLACK,
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    color: Colors.BLACK,
    width: '100%',
    borderWidth: 0.5,
    borderColor: Colors.BLACK,
  },
  cell: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: Colors.BLACK,
    width: '100%',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.BLACK,
  },
  data: {
    textAlign: 'center',
    color: Colors.BLACK,
  },
  item2: {
    backgroundColor: Colors.LiGHTGRAY,
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: Colors.BLACK,
    marginTop: 14,
    paddingTop: 9,
    paddingLeft: 120,
    color: Colors.BLACK,
  },
  add: {
    fontSize: 15,
    paddingLeft: 5,
    marginBottom: 5,
    borderLeftWidth: 1,
    color: Colors.BLACK,
  },
  de: {
    marginTop: 15,
    marginLeft: 2,
    width: '100%',
  },
  approval: {
    backgroundColor: Colors.LiGHTGRAY,
    width: '100%',
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: Colors.BLACK,
    marginTop: 4,
    flexDirection: 'column',
  },
  re: {
    marginTop: 15,
    width: '100%',
  },
  rema: {
    borderWidth: 1,
    borderColor: Colors.BLACK,
    width: '100%',
    height: 100,
    marginBottom: 100,
    color: Colors.BLACK,
  },
});

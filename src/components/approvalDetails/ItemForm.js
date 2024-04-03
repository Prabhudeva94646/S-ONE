import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, Text, Dimensions} from 'react-native';
import apiCaller from '../../api/APICaller';
import Colors from '../../utils/Colors';
import Loading from '../../components/loading/Loading';

export default function TableCmp({DocumentNo, ApprovalCategory, Item}) {
  const [data, setData] = useState([]);
  const [compData, setCompData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const data = async () => {
      setIsLoading(true);
      await apiCaller
        .TableData(DocumentNo, ApprovalCategory)
        .then(resData => {
          if (resData) {
            Item === 'Item'
              ? setData(resData.Data.Data_Detail)
              : setData(resData.Data.Data_SubDetail);
            setCompData(resData);
          }
        })
        .then(() => {
          setIsLoading(false);
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
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      }}>
      <View style={{width: 'auto', padding: 10, borderBottomWidth: 1}}>
        <Text style={{color: Colors.BLACK, fontSize: 18, fontWeight: 'bold'}}>
          {compData.ApprovalMapID}
        </Text>
        <Text style={{color: Colors.BLACK, fontSize: 15, fontWeight: 'bold', backgroundColor: Colors.LiGHTGRAY}}>
          {compData.Message}
        </Text>
      </View>
      <ScrollView horizontal={true} style={{}}>
        <View style={styles.container}>
          <View style={styles.row}>
            {data.map((item, index) => (
              <View key={index}>
                {index === 0 ? (
                  <View style={styles.cell}>
                    {item.FieldsList.map(item => (
                      <Text
                        style={{
                          color: Colors.BLACK,
                          borderWidth: 1,
                          textAlign: 'center',
                          fontSize: 15,
                          padding: 5,
                          width: 150,
                          fontWeight: 'bold', backgroundColor: Colors.LiGHTGRAY
                        }}>
                        {item.ColumnName}
                      </Text>
                    ))}
                  </View>
                ) : null}
                <View style={styles.cell}>
                  {item.FieldsList.map(item => (
                    <Text
                      style={{
                        color: Colors.BLACK,
                        borderWidth: 1,
                        textAlign: 'center',
                        fontSize: 15,
                        padding: 5,
                        width: 150,
                      }}>
                      {item.ColumnValue}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
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
    width: 'auto',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    color: Colors.BLACK,
    width: 'auto',
  },
  cell: {
    flexDirection: 'row',
    width: 'auto',
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
});

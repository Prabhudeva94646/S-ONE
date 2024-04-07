import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  BackHandler,
} from "react-native";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import apiCaller from "../../api/APICaller";
import Icon from "react-native-vector-icons/MaterialIcons";
import Images from "../../utils/Images.js";
import Colors from "../../utils/Colors.js";
import Loading from "../../components/loading/Loading";
import { LinearGradient } from "react-native-linear-gradient";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";

export default function Form({ DocumentNo, ApprovalCategory }) {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [files, setFiles] = useState([]);
  const [compData, setCompData] = useState([]);
  const [history, setHistory] = useState([]);
  const [returnTo, setReturnTo] = useState([]);
  const [remarkData, setRemarkData] = useState({
    ApprovalMapID: "",
    Decision: "",
    Remarks: "",
    ReturnToEmpcode: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAllRows, setShowAllRows] = useState(false);
  const [toggleReturn, setToogleReturn] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const RemarkRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const resData = await apiCaller.TableData(DocumentNo, ApprovalCategory);
      if (resData) {
        setData(resData.Data.Data_Header[0].FieldsList);
        setCompData(resData);
        setRemarkData({ ...remarkData, ApprovalMapID: resData.ApprovalMapID });
      }

      const historyData = await apiCaller.approvalHistory(
        DocumentNo,
        ApprovalCategory
      );
      if (historyData) {
        setHistory(historyData.Data);
      }

      const filesData = await apiCaller.GetAttachedFiles(
        DocumentNo,
        ApprovalCategory
      );
      if (resData) {
        setFiles(filesData.Data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getData = async () => {
    setToogleReturn(!toggleReturn);
    const resData = await apiCaller.returnToList(DocumentNo, ApprovalCategory);
    if (resData) {
      setRemarkData({
        ApprovalMapID: "",
        Decision: "",
        Remarks: "",
        ReturnToEmpcode: "",
      });
      setReturnTo(resData.Data);
    }
  };

  const postReturnAPI = async () => {
    const resData = await apiCaller.postRemark({ data: remarkData });
    console.log(remarkData);
    if (resData) {
      console.log("Posted Successfully");
    } else {
      console.log("Error");
    }
  };

  const handleShowMore = () => {
    setShowAllRows(true);
  };

  const handleShowLess = () => {
    setShowAllRows(false);
  };

  const handleShowFullHistory = () => {
    setShowFullHistory(true);
  };

  const handleShowFirstIndex = () => {
    setShowFullHistory(false);
  };

  const fileprev = async (url) => {
    const f2 = url.split("/");

    const fileName = f2[f2.length - 1];

    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const options = {
      fromUrl: url,
      toFile: localFile,
    };

    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {})
      .catch((error) => {});
  };

  if (isLoading) {
    return (
      <View style={{ width: Dimensions.get("window").width }}>
        <Loading />
      </View>
    );
  }

  const isRemarksFilled = remarkData.Remarks.trim() !== "";

  const remarksContainerStyle = {
    borderColor: buttonPressed && !isRemarksFilled ? "red" : Colors.BLACK,
  };

  const remarksTextStyle =
    remarkData.Remarks.trim() === ""
      ? { color: "red" }
      : { color: Colors.BLACK };

  return (
    <View
      style={{
        flex: 1,
        width: Dimensions.get("window").width,
      }}
    >
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View>
          <GestureScrollView
            nestedScrollEnabled={true}
            automaticallyAdjustKeyboardInsets={true}
            style={{}}
            showsVerticalScrollIndicator={true}
          >
            <View>
              <View
                style={{ width: "100%", padding: 10, borderBottomWidth: 1 }}
              ></View>
              <View style={styles.container}>
                <View style={styles.row}>
                  {data.slice(0, showAllRows ? data.length : 6).map((item) => (
                    <View style={styles.cell} key={item.ColumnName.toString()}>
                      <Text
                        style={{
                          color: Colors.BLACK,
                          borderRightWidth: 1,
                          width: "30%",
                          textAlign: "center",
                          padding: 5,
                          fontSize: 14,
                          backgroundColor: Colors.LiGHTGRAY,
                        }}
                      >
                        {item.ColumnName}
                      </Text>
                      <Text
                        style={{
                          color: Colors.BLACK,
                          width: "70%",
                          textAlign: "center",
                          fontSize: 15,
                          padding: 5,
                        }}
                      >
                        {item.ColumnValue}
                      </Text>
                    </View>
                  ))}
                </View>
                {!showAllRows && (
                  <TouchableOpacity
                    onPress={handleShowMore}
                    style={styles.moreButton}
                  >
                    <Text style={styles.moreText}>...more</Text>
                  </TouchableOpacity>
                )}
                {showAllRows && (
                  <TouchableOpacity
                    onPress={handleShowLess}
                    style={styles.moreButton}
                  >
                    <Text style={styles.moreText}>...less</Text>
                  </TouchableOpacity>
                )}

                {compData.Data.Data_Detail && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Item", {
                        DocumentNo: DocumentNo,
                        Category: ApprovalCategory,
                        Item: "Item",
                      });
                    }}
                    style={styles.item2}
                  >
                    <Text style={{ color: Colors.BLACK, fontSize: 15 }}>
                      Number of items - {compData.Data.Data_Detail.length}
                    </Text>
                  </TouchableOpacity>
                )}

                {compData.Data.Data_SubDetail && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Item", {
                        DocumentNo: DocumentNo,
                        Category: ApprovalCategory,
                        Item: "SubItem",
                      });
                    }}
                    style={styles.item2}
                  >
                    <Text style={{ color: Colors.BLACK, fontSize: 15 }}>
                      Number of Subitems - {compData.Data.Data_SubDetail.length}
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={styles.de}>
                  <Text
                    style={{ color: Colors.BLACK, width: "100%", fontSize: 15 }}
                  >
                    Approval Flow Details-
                  </Text>
                </View>
                {history
                  .slice(0, showFullHistory ? history.length : 1)
                  .map((approval, index) => (
                    <View key={index}>
                      <View
                        style={[
                          styles.approval,
                          getApprovalTileStyle(approval.ApproverDecisionStatus),
                        ]}
                      >
                        <View style={{ width: "100%", flexDirection: "row" }}>
                          <Text
                            style={[
                              styles.add,
                              { width: "35%", borderLeftWidth: 0 },
                            ]}
                          >
                            Date & Time
                          </Text>
                          <Text style={[styles.add, { width: "35%" }]}>
                            {approval.ApproverActionDate}
                          </Text>
                        </View>
                        <View style={{ width: "100%", flexDirection: "row" }}>
                          <Text
                            style={[
                              styles.add,
                              { width: "35%", borderLeftWidth: 0 },
                            ]}
                          >
                            By
                          </Text>
                          <Text style={[styles.add, { width: "35%" }]}>
                            {approval.ApproverName}
                          </Text>
                        </View>
                        <View style={{ width: "100%", flexDirection: "row" }}>
                          <Text
                            style={[
                              styles.add,
                              { width: "35%", borderLeftWidth: 0 },
                            ]}
                          >
                            Remarks
                          </Text>
                          <Text style={[styles.add, { width: "65%" }]}>
                            {approval.ApproverRemarks}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginBottom: 10 }} />
                    </View>
                  ))}

                <View>
                  {!showFullHistory && (
                    <TouchableOpacity onPress={handleShowFullHistory}>
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          fontWeight: "bold",
                          alignSelf: "flex-end",
                          marginLeft: 180,
                          color: Colors.BLUE,
                        }}
                      >
                        ...Show Full Approval History
                      </Text>
                    </TouchableOpacity>
                  )}
                  {showFullHistory && (
                    <TouchableOpacity onPress={handleShowFirstIndex}>
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          fontWeight: "bold",
                          alignSelf: "flex-end",
                          marginLeft: 280,
                          color: Colors.BLUE,
                        }}
                      >
                        ...Show Less
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {files.length != 0 && (
                  <View style={{ width: "100%" }}>
                    <View style={styles.de}>
                      <Text
                        style={{
                          color: Colors.BLACK,
                          width: "100%",
                          fontSize: 15,
                        }}
                      >
                        Files Attached
                      </Text>
                    </View>
                    <ScrollView
                      horizontal={true}
                      nestedScrollEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      style={styles.files}
                    >
                      {files.map((item) => (
                        <View style={styles.infiles}>
                          <TouchableOpacity
                            onPress={() => fileprev(item.FilePath)}
                          >
                            {item.ContentType == "application/pdf" ? (
                              <Image
                                source={Images.ICONS.PDF}
                                style={{
                                  width: 50,
                                  height: 50,
                                }}
                              />
                            ) : item.ContentType == "application/word" ? (
                              <Image
                                source={Images.ICONS.WORD}
                                style={{
                                  width: 50,
                                  height: 50,
                                }}
                              />
                            ) : item.ContentType == "application/png" ||
                              item.ContentType == "application/jpg" ? (
                              <Image
                                source={Images.ICONS.IMAGE}
                                style={{
                                  width: 50,
                                  height: 50,
                                }}
                              />
                            ) : item.ContentType == "application/xlxs" ? (
                              <Image
                                source={Images.ICONS.SHEETS}
                                style={{
                                  width: 50,
                                  height: 50,
                                }}
                              />
                            ) : (
                              <Image
                                source={Images.ICONS.UNKNOWN}
                                style={{
                                  width: 50,
                                  height: 50,
                                }}
                              />
                            )}

                            <Text style={{ color: Colors.BLACK }}>
                              {item.FileName}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={styles.re}>
                  <Text
                    style={[
                      { color: Colors.BLACK, fontSize: 15 },
                      buttonPressed && !isRemarksFilled && { color: "red" },
                    ]}
                  >
                    *Remarks-
                  </Text>
                </View>
                <View style={[styles.rema, remarksContainerStyle]}>
                  <TextInput
                    ref={RemarkRef}
                    style={{
                      color: Colors.BLACK,
                      height: "100%",
                      fontSize: 15,
                      padding: 5,
                      textAlignVertical: "top",
                    }}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    multiline={true}
                    value={remarkData.Remarks}
                    onChangeText={(val) => {
                      setRemarkData({ ...remarkData, Remarks: val });
                    }}
                  />
                </View>
              </View>
            </View>
          </GestureScrollView>
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: Dimensions.get("window").height - 80,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              paddingBottom: 20,
              paddingRight: 20,
            }}
          >
            {returnTo.length > 0 ? (
              <View
                style={[
                  {
                    width: 200,
                    alignItems: "center",
                    height: "auto",
                    backgroundColor: Colors.WHITE,
                    borderWidth: 0.5,
                    borderCurve: 5,
                    borderColor: Colors.BLACK,
                  },
                  toggleReturn ? { display: "flex" } : { display: "none" },
                ]}
              >
                {returnTo.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{ width: "100%" }}
                    onPress={() => (
                      setRemarkData({
                        ...remarkData,
                        ReturnToEmpcode: item.ApproverEmpcode,
                        Decision: "RETURN",
                      }),
                      postReturnAPI()
                    )}
                  >
                    <Text
                      style={{
                        color: Colors.BLACK,
                        fontSize: 15,
                        width: "100%",
                        textAlign: "center",
                        paddingVertical: 10,
                        borderBottomWidth: 0.5,
                      }}
                    >
                      {item.ApproverName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View
                style={[
                  {
                    width: 200,
                    alignItems: "center",
                    height: "auto",
                    backgroundColor: Colors.WHITE,
                    borderWidth: 0.5,
                    borderCurve: 5,
                    borderColor: Colors.BLACK,
                  },
                  toggleReturn ? { display: "flex" } : { display: "none" },
                ]}
              >
                <Text
                  style={{
                    color: Colors.BLACK,
                    fontSize: 15,
                    width: "100%",
                    textAlign: "center",
                    paddingVertical: 10,
                    borderBottomWidth: 0.5,
                  }}
                >
                  No Data to Show
                </Text>
              </View>
            )}
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={isRemarksFilled ? 1 : 0.6}
                onPress={() => {
                  if (isRemarksFilled) {
                    setRemarkData({ ...remarkData, Decision: "APPROVE" });
                    postReturnAPI();
                  } else {
                    RemarkRef.current.focus();
                  }
                  setButtonPressed(true);
                }}
              >
                <Image
                  source={Images.APPROVE_SCREEN_BTN.APPROVE}
                  style={{
                    width: 50,
                    height: 50,
                    opacity: isRemarksFilled ? 1 : 0.2,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={isRemarksFilled ? 1 : 0.5}
                onPress={() => {
                  if (isRemarksFilled) {
                    getData();
                  } else {
                    RemarkRef.current.focus();
                  }
                  setButtonPressed(true);
                }}
                style={{ marginLeft: 10 }}
              >
                <Image
                  source={Images.APPROVE_SCREEN_BTN.HISTORY}
                  style={{
                    width: 50,
                    height: 50,
                    opacity: isRemarksFilled ? 1 : 0.2,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={isRemarksFilled ? 1 : 0.5}
                onPress={() => {
                  if (isRemarksFilled) {
                    setRemarkData({ ...remarkData, Decision: "REJECT" });
                    postReturnAPI();
                  } else {
                    RemarkRef.current.focus();
                  }
                  setButtonPressed(true);
                }}
                style={{ marginLeft: 10 }}
              >
                <Image
                  source={Images.APPROVE_SCREEN_BTN.REJECT}
                  style={{
                    width: 50,
                    height: 50,
                    opacity: isRemarksFilled ? 1 : 0.2,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    color: Colors.BLACK,
    width: "100%",
    alignItems: "center",
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 10,
    color: Colors.BLACK,
    width: "100%",
    borderWidth: 0.5,
    borderColor: Colors.BLACK,
  },
  cell: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: Colors.BLACK,
    width: "100%",
  },
  moreButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    marginRight: 10,
  },
  moreText: {
    color: Colors.BLUE,
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  item2: {
    backgroundColor: Colors.LiGHTGRAY,
    width: "100%",
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
    width: "100%",
  },
  approval: {
    backgroundColor: Colors.LiGHTGRAY,
    width: "100%",
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: Colors.BLACK,
    marginTop: 4,
    flexDirection: "column",
  },
  files: {
    width: "100%",
  },
  infiles: {
    width: "25%",
    alignItems: "center",
    marginHorizontal: 5,
  },
  re: {
    marginTop: 15,
    width: "100%",
  },
  rema: {
    borderWidth: 1,
    borderColor: Colors.BLACK,
    width: "100%",
    height: 100,
    marginBottom: 100,
    color: Colors.BLACK,
  },
});

// Function to dynamically generate styles for approval tiles based on decision status
function getApprovalTileStyle(decisionStatus) {
  switch (decisionStatus) {
    case "APPROVED":
      return {
        backgroundColor: "rgba(0,255,0,0.3)",
        // Adjust the rgba values to change the color and transparency
      };
    case "RETURN":
      return {
        backgroundColor: "rgba(255,255,0,0.5)",
        // Adjust the rgba values to change the color and transparency
      };
    default:
      return {};
  }
}

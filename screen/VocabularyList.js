import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { getVocabularyData } from "../utils/fileSystem";

const { width, height } = Dimensions.get("window");

const VocabularyList = ({navigation}) => {
  const [vocabulary, setVocabulary] = useState([]);

  // Lấy dữ liệu từ file hệ thống
  useEffect(() => {
    const fetchData = async () => {
      try {
        const words = await getVocabularyData();
        setVocabulary(words);
      
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách từ vựng:", error);
      }
    };

    fetchData();
  }, []);

 
  const colorsGradient = [
    "#3357FF", // Xanh dương
    "#338AFF",
    "#33BFFF",
    "#33E3FF",
    "#33FFE3",
    "#33FFB2",
    "#33FF80",
    "#33FF57", // Xanh lá
  ];
  
  const renderItem = ({ item, index }) => {
    // Chọn màu nền dựa vào vị trí trong danh sách
    const backgroundColor = colorsGradient[index % colorsGradient.length];
  
    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor }]} // Áp dụng màu nền
        onPress={() => navigation.navigate("Detail", { vocabulary: item })}
      >
        <Text style={styles.cell}>{item.word}</Text>
        <Text style={styles.cell}>{item.meaning ? item.meaning.join(", ") : "-"}</Text>
      </TouchableOpacity>
    );
  };
  
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Danh Sách Từ Vựng</Text>
      {/* Header Table */}
      <View style={styles.headerRow}>
      
        <Text style={styles.headerCell}>Từ vựng</Text>
        <Text style={styles.headerCell}>Nghĩa</Text>
       
      </View>

      {/* Danh sách từ vựng */}
      <FlatList
        data={vocabulary}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

// Style cho bảng
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: height * 0.02,
    paddingHorizontal:0,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#333",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingVertical: height * 0.015,
    borderRadius: 8,
    marginBottom: height * 0.01,
    width: width * 0.9,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: width*0.97 ,
    paddingHorizontal: width * 0.02,
    borderRadius: width * 0.1,
    marginBottom: height * 0.01,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: height * 0.01,
    color: "#333",
    fontSize: 14,
  },
  smallCol: {
    flex: 0.5, // STT có cột nhỏ hơn
  },
});

export default VocabularyList;

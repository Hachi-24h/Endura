import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  FlatList 
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { addWordsFromJsonFile, getVocabularyData } from "../utils/fileSystem";
import Footer from "../screen/footer";

const { width, height } = Dimensions.get("window");

const AddtoJson = ({ navigation }) => {
  const [statusMessage, setStatusMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [addedWords, setAddedWords] = useState([]);
  const [failedCount, setFailedCount] = useState(0);

  // Hàm chọn file JSON từ hệ thống
  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.json],
      });

      if (!result || result.length === 0) {
        setStatusMessage("❌ Không có file nào được chọn.");
        return;
      }

      const fileUri = result[0].uri;
      console.log("📂 File đã chọn:", fileUri);

      // Nhập dữ liệu từ file JSON
      const addedCount = await addWordsFromJsonFile(fileUri);
      const updatedWords = await getVocabularyData();

      if (addedCount > 0) {
        setAddedWords(updatedWords.slice(-5)); // Lấy 5 từ mới nhất
        setWordCount(updatedWords.length);
        setFailedCount(updatedWords.length - addedCount);
        setStatusMessage(`✅ Đã thêm ${addedCount} từ mới.`);
      } else {
        setStatusMessage("🔄 Không có từ mới nào được thêm vào.");
      }

    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        setStatusMessage("❌ Bạn đã hủy chọn file.");
      } else {
        console.error("❌ Lỗi chọn file:", error);
        setStatusMessage("❌ Lỗi khi chọn file, vui lòng thử lại.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📂 Thêm từ vựng từ file JSON</Text>

      <TouchableOpacity style={styles.button} onPress={handleFilePicker}>
        <Text style={styles.buttonText}>Chọn file JSON</Text>
      </TouchableOpacity>

      {/* Hiển thị trạng thái nhập file */}
      <Text style={styles.status}>{statusMessage}</Text>

      {/* Hiển thị số lượng từ vựng */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>📖 Tổng số từ: {wordCount}</Text>
        <Text style={styles.infoText}>✅ Đã thêm: {wordCount - failedCount}</Text>
        <Text style={styles.infoText}>❌ Thất bại: {failedCount}</Text>
      </View>

      {/* Danh sách 5 từ mới nhất */}
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>📌 5 từ vừa nhập gần nhất:</Text>
        <FlatList
          data={addedWords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.wordItem}>
              <Text style={styles.wordText}>{item.word}</Text>
              <Text style={styles.meaningText}>{item.meaning.join(", ")}</Text>
            </View>
          )}
        />
      </View>

      {/* Nút xem danh sách từ vựng */}
      <TouchableOpacity 
        style={styles.viewListButton} 
        onPress={() => navigation.navigate('VocabularyList')}
      >
        <Text style={styles.viewListButtonText}>📖 Xem danh sách từ</Text>
      </TouchableOpacity>

      {/* Footer navigation */}
      <Footer navigation={navigation} />
    </View>
  );
};

// Style CSS theo tỉ lệ màn hình
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: "#EAF6F6",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.25,
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  status: {
    fontSize: 16,
    marginTop: height * 0.02,
    color: "#333",
    fontWeight: "500",
  },
  infoContainer: {
    backgroundColor: "#FFF",
    padding: width * 0.05,
    borderRadius: 10,
    width: width * 0.9,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  recentContainer: {
    marginTop: height * 0.03,
    width: width * 0.9,
    padding: width * 0.04,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: height * 0.01,
  },
  wordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  wordText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  meaningText: {
    fontSize: 14,
    color: "#666",
  },
  viewListButton: {
    marginTop: height * 0.03,
    backgroundColor: "#FFA500",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 10,
  },
  viewListButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddtoJson;

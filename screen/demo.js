import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import QuestionModal from "../QuizGame/Choose4";
import { getRandomVocabulary } from "../utils/fileSystem";

const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [vocabulary2, setVocabulary2] = useState({
    word: "Example",
    meaning: ["Ví dụ"],
    note: "Mô tả từ vựng",
    synonyms: ["Demo", "Sample"],
    antonyms: ["Real"],
    types: ["Noun"],
  }); // Dữ liệu mặc định

  // Hàm lấy một từ ngẫu nhiên
  const fetchRandomWord = async () => {
    try {
      const randomWordList = await getRandomVocabulary(2);
      if (randomWordList.length > 0) {
        setVocabulary2(randomWordList[0]);
      }
    } catch (error) {
      console.error("❌ Error fetching random word:", error);
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const openModal = () => {
    console.log("🚀 Dữ liệu từ vựng:", vocabulary2);
    if (vocabulary2 && vocabulary2.word) {
      setModalVisible(true);
    } else {
      console.warn("❌ Dữ liệu từ vựng chưa có, không thể mở modal!");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Mở câu hỏi" onPress={openModal} />
      <Text style={styles.infoText}>
        Từ kiểm tra: {vocabulary2 ? vocabulary2.word : "Chưa có dữ liệu"}
      </Text>

      {vocabulary2 && vocabulary2.word && (
        <QuestionModal
          isVisible={isModalVisible}
          data={[vocabulary2]}
          onClose={() => setModalVisible(false)}
          testType={3}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  infoText: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
  },
});

export default App;

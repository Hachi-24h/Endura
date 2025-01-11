import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import QuestionModal from "../QuizGame/Choose4";
import { getRandomVocabulary } from "../utils/fileSystem"
const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [vocabulary2, setVocabulary2] = useState(null)
  // Danh sách từ vựng
  const vocabulary = [
    {
      word: "Comments",
      meaning: ["Bình luận"],
      note: "",
      synonyms: ["Add", "copy"],
      antonyms: ["Delete", "Hachi"],
      types: ["Verb", "Noun"],
    },
    {
      word: "Delete",
      meaning: ["Xóa bỏ", "cút khỏi"],
      note: "",
      synonyms: ["Remove"],
      antonyms: ["Add"],
      types: ["Verb"],
    },
    {
      word: "Add",
      meaning: ["Thêm vào", "Bỏ vào"],
      note: "",
      synonyms: ["Insert", "hachi"],
      antonyms: ["Delete"],
      types: ["Verb"],
    },
    {
      word: "Copy",
      meaning: ["Sao chép", "lặp lại"],
      note: "",
      synonyms: ["Duplicate"],
      antonyms: ["Original"],
      types: ["Verb"],
    },
  ];


   // Hàm lấy một từ ngẫu nhiên
   const fetchRandomWord = async () => {
    try {
      const randomWordList = await getRandomVocabulary(2); // Lấy danh sách từ ngẫu nhiên
      setVocabulary2(randomWordList[0]); // Lấy từ đầu tiên làm từ kiểm tra
    } catch (error) {
      console.error("Error fetching random word:", error);
    }
  };


  useEffect(() => {
    fetchRandomWord();
  }, []);

  console.log("Từ kiểm tra:", vocabulary2);
  return (
    <View style={styles.container}>
      <Button title="Mở câu hỏi" onPress={() => setModalVisible(true)} />
      <QuestionModal
        isVisible={isModalVisible}
        data={[vocabulary2]} // Dữ liệu chỉ gồm một từ
        onClose={() => setModalVisible(false)}
        testType={3} // Kiểu kiểm tra: đồng nghĩa
      />
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
});

export default App;

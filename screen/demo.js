import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import QuestionModal from "../QuizGame/Choose4";

const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);

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
      meaning: ["Xóa bỏ"],
      note: "",
      synonyms: ["Remove"],
      antonyms: ["Add"],
      types: ["Verb"],
    },
    {
      word: "Add",
      meaning: ["Thêm vào"],
      note: "",
      synonyms: ["Insert"],
      antonyms: ["Delete"],
      types: ["Verb"],
    },
    {
      word: "Copy",
      meaning: ["Sao chép"],
      note: "",
      synonyms: ["Duplicate"],
      antonyms: ["Original"],
      types: ["Verb"],
    },
  ];

  return (
    <View style={styles.container}>
      <Button title="Mở câu hỏi" onPress={() => setModalVisible(true)} />
      <QuestionModal
        isVisible={isModalVisible}
        data={vocabulary}
        onClose={() => setModalVisible(false)}
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

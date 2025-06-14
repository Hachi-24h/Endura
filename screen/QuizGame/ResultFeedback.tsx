import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ResultFeedbackProps = {
  isCorrect: boolean;
  correctAnswer: string;
};
const ResultFeedback: React.FC<ResultFeedbackProps> = ({
  isCorrect,
  correctAnswer,
}) => {
  return (
    <View style={styles.feedbackBox}>
      <Text style={{ color: isCorrect ? "#4CAF50" : "#F44336", fontWeight: "bold" }}>
        {isCorrect ? "Chính xác!" : `Sai! Đáp án đúng là: ${correctAnswer}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackBox: {
    marginVertical: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    borderRadius: 5
  }
});

export default ResultFeedback;

import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ResultItem = {
  type: string;
  correct: boolean;
};

type Props = {
  resultList: ResultItem[];
};

const FinalResultModal: React.FC<Props> = ({ resultList }) => {
  const total = resultList.length;
  const correct = resultList.filter(r => r.correct).length;
  const wrong = total - correct;

  const stats = resultList.reduce<Record<string, { total: number; correct: number }>>((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = { total: 0, correct: 0 };
    acc[curr.type].total++;
    if (curr.correct) acc[curr.type].correct++;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết quả bài quiz</Text>
      <Text>Tổng số câu: {total}</Text>
      <Text>Đúng: {correct}</Text>
      <Text>Sai: {wrong}</Text>

      <Text style={styles.subTitle}>Chi tiết theo loại câu hỏi:</Text>
      {Object.keys(stats).map((type, idx) => (
        <Text key={idx}>
          {type}: {stats[type].correct}/{stats[type].total}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  subTitle: { marginTop: 12, fontWeight: "600" }
});

export default FinalResultModal;

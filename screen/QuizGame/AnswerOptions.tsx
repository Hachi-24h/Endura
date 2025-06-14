import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type AnswerOptionsProps = {
  options: string[];
  correct: string;
  selected: string;
  onSelect: (option: string) => void;
  showResult: boolean;
};

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  correct,
  selected,
  onSelect,
  showResult,
}) => {
  return (
    <View style={styles.container}>
      {options.map((opt, idx) => {
        const isSelected = selected === opt;
        const isCorrect = opt === correct;

        let bgColor = "#ffffff";
        let borderColor = "#ccc";
        let textColor = "#333";

        if (showResult) {
          if (isCorrect) {
            bgColor = "#C8E6C9";
            borderColor = "#4CAF50";
          } else if (isSelected) {
            bgColor = "#FFCDD2";
            borderColor = "#E53935";
          }
        } else if (isSelected) {
          bgColor = "#BBDEFB";
          borderColor = "#2196F3";
        }

        return (
          <TouchableOpacity
            key={idx}
            style={[styles.option, { backgroundColor: bgColor, borderColor }]}
            disabled={showResult}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1.5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default AnswerOptions;

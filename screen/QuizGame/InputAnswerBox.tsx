import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { height, width } from "../../utils/config";
type InputAnswerBoxProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  correctWord: string;
  hint: string;
};
const InputAnswerBox: React.FC<InputAnswerBoxProps> = ({
  value,
  onChangeText,
  onSubmit,
  disabled,
  correctWord,
  hint,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.hint}>{hint}</Text>

      <TextInput
        style={styles.input}
        placeholder="Điền từ vào đây"
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        maxLength={correctWord?.length || 20}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {!disabled && (
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Kiểm tra</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: width * 0.05,
    paddingHorizontal: 12,
    marginTop: height * 0.1,
  },
  hint: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    letterSpacing: 3,
    textAlign: "center"
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlign: "center"
  },
  button: {
    backgroundColor: "#007BFF",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  }
});

export default InputAnswerBox;

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

// Lấy chiều rộng và chiều cao màn hình
const { width, height } = Dimensions.get("window");
import styles from "../Css/choose4";

const QuestionModal = ({ isVisible, data, onClose }) => {
  const [question, setQuestion] = useState(null); // Lưu câu hỏi hiện tại
  const [answers, setAnswers] = useState([]); // Lưu danh sách đáp án
  const [correctAnswer, setCorrectAnswer] = useState(null); // Lưu đáp án đúng
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Lưu đáp án đã chọn
  const [showNextButton, setShowNextButton] = useState(false); // Hiển thị nút "Tiếp theo"

  // Hàm random câu hỏi
  const generateQuestion = () => {
    if (!data || data.length === 0) return;

    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedWord = data[randomIndex];

    // Chọn ngẫu nhiên loại câu hỏi
    const questionTypes = ["word", "meaning", "synonym", "antonym"];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    if (questionType === "word") {
      // Câu hỏi về từ
      const questionText = `Từ vựng: "${selectedWord.word}"`;
      const randomMeaningIndex = Math.floor(
        Math.random() * selectedWord.meaning.length
      );
      const correctMeaning = selectedWord.meaning[randomMeaningIndex];

      const wrongMeanings = data
        .flatMap((word) => word.meaning)
        .filter((meaning) => meaning !== correctMeaning);

      const shuffledWrongMeanings = wrongMeanings
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const allAnswers = shuffleArray([correctMeaning, ...shuffledWrongMeanings]);

      setQuestion(questionText);
      setAnswers(allAnswers);
      setCorrectAnswer(correctMeaning);
    } else if (questionType === "meaning") {
      // Câu hỏi về nghĩa
      const randomMeaningIndex = Math.floor(
        Math.random() * selectedWord.meaning.length
      );
      const questionText = `Nghĩa: "${selectedWord.meaning[randomMeaningIndex]}"`;
      const correctWord = selectedWord.word;

      const wrongWords = data
        .filter((word) => word.word !== correctWord)
        .map((word) => word.word);

      const shuffledWrongWords = wrongWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const allAnswers = shuffleArray([correctWord, ...shuffledWrongWords]);

      setQuestion(questionText);
      setAnswers(allAnswers);
      setCorrectAnswer(correctWord);
    } else if (questionType === "synonym" && selectedWord.synonyms?.length > 0) {
      // Câu hỏi về đồng nghĩa
      const questionText = `Tìm từ đồng nghĩa với: "${selectedWord.word}"`;
      const correctSynonym = selectedWord.synonyms[0];

      const wrongSynonyms = data
        .flatMap((word) => word.synonyms || [])
        .filter((synonym) => synonym !== correctSynonym);

      const shuffledWrongSynonyms = wrongSynonyms
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const allAnswers = shuffleArray([correctSynonym, ...shuffledWrongSynonyms]);

      setQuestion(questionText);
      setAnswers(allAnswers);
      setCorrectAnswer(correctSynonym);
    } else if (questionType === "antonym" && selectedWord.antonyms?.length > 0) {
      // Câu hỏi về trái nghĩa
      const questionText = `Tìm từ trái nghĩa với: "${selectedWord.word}"`;
      const correctAntonym = selectedWord.antonyms[0];

      const wrongAntonyms = data
        .flatMap((word) => word.antonyms || [])
        .filter((antonym) => antonym !== correctAntonym);

      const shuffledWrongAntonyms = wrongAntonyms
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const allAnswers = shuffleArray([correctAntonym, ...shuffledWrongAntonyms]);

      setQuestion(questionText);
      setAnswers(allAnswers);
      setCorrectAnswer(correctAntonym);
    } else {
      // Nếu không có đồng nghĩa hoặc trái nghĩa, gọi lại hàm để random lại
      generateQuestion();
      return;
    }

    setSelectedAnswer(null);
    setShowNextButton(false);
  };

  // Hàm xử lý khi chọn đáp án
  const handleAnswerPress = (answer) => {
    setSelectedAnswer(answer);
    setShowNextButton(true);
  };

  // Hàm shuffle mảng
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Gọi generateQuestion khi modal mở
  React.useEffect(() => {
    if (isVisible) {
      generateQuestion();
    }
  }, [isVisible]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          {question && <Text style={styles.question}>{question}</Text>}
          <View style={styles.answersContainer}>
            {answers.map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerButton,
                  selectedAnswer === answer && {
                    backgroundColor:
                      answer !== correctAnswer ? "red" : "lightblue",
                  },
                  answer === correctAnswer &&
                    selectedAnswer !== null && { backgroundColor: "green" },
                ]}
                onPress={() => handleAnswerPress(answer)}
                disabled={selectedAnswer !== null} // Không cho chọn lại
              >
                <Text style={styles.answerText}>{answer}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {showNextButton && (
            <Button title="Tiếp theo" onPress={generateQuestion} />
          )}
          <Button title="Đóng" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default QuestionModal;

import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "../Css/choose4";
import color from "../Custom/Color";
import { ArrowCircleRight2 } from "iconsax-react-native";
import { getUnrelatedWords } from "../utils/fileSystem";

const QuestionModal = ({ isVisible, data, onClose, testType }) => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);

  // Shuffle array elements
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  // const generateQuestion = async () => {
  //   if (!data || data.length === 0) return;

  //   const randomIndex = Math.floor(Math.random() * data.length);
  //   const selectedWord = data[randomIndex];

  //   // Determine the question type
  //   const questionType =
  //     testType === 0
  //       ? ["word", "meaning", "synonym", "antonym"][
  //           Math.floor(Math.random() * 4)
  //         ]
  //       : ["word", "meaning", "synonym", "antonym"][testType - 1];

  //   switch (questionType) {
  //     case "word": {
  //       const questionText = `Từ vựng: \"${selectedWord.word}\"`;
  //       const correctMeaning = selectedWord.meaning[0];
  //       const unrelatedWords = await getUnrelatedWords(selectedWord.word, 3);
  //       const wrongMeanings = unrelatedWords.map((item) => item.meaning[0]);
  //       const allAnswers = shuffleArray([
  //         correctMeaning,
  //         ...wrongMeanings,
  //       ]);
  //       setQuestion(questionText);
  //       setAnswers(allAnswers);
  //       setCorrectAnswer(correctMeaning);
  //       break;
  //     }
  //     case "meaning": {
  //       const questionText = `Nghĩa: \"${selectedWord.meaning[0]}\"`;
  //       const correctWord = selectedWord.word;
  //       const unrelatedWords = await getUnrelatedWords(selectedWord.word, 3);
  //       const wrongWords = unrelatedWords.map((item) => item.word);
  //       const allAnswers = shuffleArray([correctWord, ...wrongWords]);
  //       setQuestion(questionText);
  //       setAnswers(allAnswers);
  //       setCorrectAnswer(correctWord);
  //       break;
  //     }
  //     case "synonym": {
  //       if (selectedWord.synonyms?.length > 0) {
  //         const questionText = `Đồng nghĩa với: \"${selectedWord.word}\"`;
  //         const correctSynonym = selectedWord.synonyms[0];
  //         const unrelatedWords = await getUnrelatedWords(selectedWord.word, 3);
  //         const wrongSynonyms = unrelatedWords.map((item) => item.word);
  //         const allAnswers = shuffleArray([
  //           correctSynonym,
  //           ...wrongSynonyms,
  //         ]);
  //         setQuestion(questionText);
  //         setAnswers(allAnswers);
  //         setCorrectAnswer(correctSynonym);
  //       } else {
  //         generateQuestion();
  //       }
  //       break;
  //     }
  //     case "antonym": {
  //       if (selectedWord.antonyms?.length > 0) {
  //         const questionText = `Trái nghĩa với: \"${selectedWord.word}\"`;
  //         const correctAntonym = selectedWord.antonyms[0];
  //         const unrelatedWords = await getUnrelatedWords(selectedWord.word, 3);
  //         const wrongAntonyms = unrelatedWords.map((item) => item.word);
  //         const allAnswers = shuffleArray([
  //           correctAntonym,
  //           ...wrongAntonyms,
  //         ]);
  //         setQuestion(questionText);
  //         setAnswers(allAnswers);
  //         setCorrectAnswer(correctAntonym);
  //       } else {
  //         generateQuestion();
  //       }
  //       break;
  //     }
  //     default:
  //       break;
  //   }

  //   setSelectedAnswer(null);
  //   setShowNextButton(false);
  // };
  const generateQuestion = async () => {
    if (!data || data.length === 0) return;

    // Lọc dữ liệu hợp lệ theo testType
    // let filteredData = [];

    // switch (testType) {
    //   case 3: // antonym
    //     filteredData = data.filter(
    //       (item) => item.antonyms && item.antonyms.length > 0
    //     );
    //     break;
    //   case 2: // synonym
    //     filteredData = data.filter(
    //       (item) => item.synonyms && item.synonyms.length > 0
    //     );
    //     break;
    //   case 1: // meaning
    //     filteredData = data.filter(
    //       (item) => item.meaning && item.meaning.length > 0
    //     );
    //     break;
    //   case 0:
    //   default:
    //     filteredData = data;
    // }

    let filteredData = [];

    if (testType === 0) {
      // random word & meaning
      filteredData = data.filter(item => item.meaning && item.meaning.length > 0);
    } else if (testType === 1) {
      // meaning => word
      filteredData = data.filter(item => item.meaning && item.meaning.length > 0);
    } else if (testType === 2) {
      // word => meaning
      filteredData = data.filter(item => item.meaning && item.meaning.length > 0);
    } else {
      filteredData = [];
    }



    if (filteredData.length === 0) {
      setQuestion("Không có dữ liệu phù hợp để tạo câu hỏi.");
      setAnswers([]);
      setCorrectAnswer(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredData.length);
    const selectedWord = filteredData[randomIndex];

    // const questionType =
    //   testType === 0
    //     ? ["word", "meaning", "synonym", "antonym"][Math.floor(Math.random() * 4)]
    //     : ["word", "meaning", "synonym", "antonym"][testType - 1];
    const questionType =
      testType === 0
        ? ["word", "meaning"][Math.floor(Math.random() * 2)]
        : testType === 1
          ? "meaning"
          : "word"; // testType: 1 = meaning -> word, 2 = word -> meaning
    switch (questionType) {
      case "word": {
        const questionText = `Từ vựng: \"${selectedWord.word}\"`;
        const correctMeaning = selectedWord.meaning[0];
        const unrelatedWords = await getUnrelatedWords(selectedWord.word, 3);
        const wrongMeanings = unrelatedWords.map((item) => item.meaning[0]);
        const allAnswers = shuffleArray([correctMeaning, ...wrongMeanings]);
        setQuestion(questionText);
        setAnswers(allAnswers);
        setCorrectAnswer(correctMeaning);
        break;
      }
      case "meaning": {
        const questionText = `Nghĩa: \"${selectedWord.meaning[0]}\"`;
        const correctWord = selectedWord.word;
        const unrelatedWords = await getUnrelatedWords(selectedWord.word, 3);
        const wrongWords = unrelatedWords.map((item) => item.word);
        const allAnswers = shuffleArray([correctWord, ...wrongWords]);
        setQuestion(questionText);
        setAnswers(allAnswers);
        setCorrectAnswer(correctWord);
        break;
      }
      case "synonym": {
        const questionText = `Đồng nghĩa với: \"${selectedWord.word}\"`;
        const correctSynonym = selectedWord.synonyms[0];
        const unrelatedWords = await getUnrelatedWords(selectedWord.word, 3);
        const wrongSynonyms = unrelatedWords.map((item) => item.word);
        const allAnswers = shuffleArray([correctSynonym, ...wrongSynonyms]);
        setQuestion(questionText);
        setAnswers(allAnswers);
        setCorrectAnswer(correctSynonym);
        break;
      }
      case "antonym": {
        const questionText = `Trái nghĩa với: \"${selectedWord.word}\"`;
        const correctAntonym = selectedWord.antonyms[0];
        const unrelatedWords = await getUnrelatedWords(selectedWord.word, 3);
        const wrongAntonyms = unrelatedWords.map((item) => item.word);
        const allAnswers = shuffleArray([correctAntonym, ...wrongAntonyms]);
        setQuestion(questionText);
        setAnswers(allAnswers);
        setCorrectAnswer(correctAntonym);
        break;
      }
      default:
        break;
    }

    setSelectedAnswer(null);
    setShowNextButton(false);
  };

  useEffect(() => {
    if (isVisible) {
      (async () => {
        await generateQuestion();
      })();
    }
  }, [isVisible]);

  const handleAnswerPress = (answer) => {
    setSelectedAnswer(answer);
    setShowNextButton(true);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <View style={styles.containerQuestion}>
            {question && <Text style={styles.question}>{question}</Text>}
          </View>

          <View style={styles.answersContainer}>
            {answers.map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerButton,
                  selectedAnswer === answer && {
                    backgroundColor:
                      answer !== correctAnswer
                        ? color.lightRed
                        : color.lightBlue,
                  },
                  answer === correctAnswer &&
                  selectedAnswer !== null && {
                    backgroundColor: color.lightBlue,
                  },
                ]}
                onPress={() => handleAnswerPress(answer)}
                disabled={selectedAnswer !== null}
              >
                <Text style={styles.answerText}>{answer}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              height: 50,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <View style={styles.containerNextQuestion}>
              {showNextButton && (
                <TouchableOpacity
                  onPress={generateQuestion}
                  style={styles.nextQuestion}
                >
                  <ArrowCircleRight2 size="36" color="#FF8A65" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default QuestionModal;

import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "../../Css/choose4";
import color from "../../Custom/Color";
import { ArrowCircleRight2 } from "iconsax-react-native";
import { getUnrelatedWords } from "../../utils/fileSystem";
// import { Vocabulary } from "../../model/VocabularyModel";

type QuestionModalProps = {
  isVisible: boolean;
  data: Vocabulary[];
  onClose: () => void;
  testType: number;
};

type Vocabulary = {
    word: string;
    meaning: string;
    note?: string;
    type?: string;
    types?: string[];
    synonyms?: string[];
    antonyms?: string[];
};


const QuestionModal: React.FC<QuestionModalProps> = ({ isVisible, data, onClose, testType }) => {
  const [question, setQuestion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);

  const shuffleArray = (array: string[]) => array.sort(() => Math.random() - 0.5);

  const generateQuestion = async () => {
    if (!data || data.length === 0) return;

    const filteredData = data.filter(item => item.meaning?.length);
    if (filteredData.length === 0) {
      setQuestion("Không có dữ liệu phù hợp để tạo câu hỏi.");
      setAnswers([]);
      setCorrectAnswer(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredData.length);
    const selectedWord = filteredData[randomIndex];

    const questionType = testType === 0
      ? ["word", "meaning"][Math.floor(Math.random() * 2)]
      : testType === 1 ? "meaning" : "word";

    switch (questionType) {
      case "word": {
        const questionText = `Từ vựng: "${selectedWord.word}"`;
        const correctMeaning = selectedWord.meaning[0];
        const unrelated = await getUnrelatedWords(selectedWord.word, 3);
        const wrongMeanings = unrelated.map((item: Vocabulary) => item.meaning?.[0] || "");
        const allAnswers = shuffleArray([correctMeaning, ...wrongMeanings]);
        setQuestion(questionText);
        setAnswers(allAnswers);
        setCorrectAnswer(correctMeaning);
        break;
      }
      case "meaning": {
        const questionText = `Nghĩa: "${selectedWord.meaning[0]}"`;
        const correctWord = selectedWord.word;
        const unrelated = await getUnrelatedWords(selectedWord.word, 3);
        const wrongWords = unrelated.map((item: Vocabulary) => item.word);
        const allAnswers = shuffleArray([correctWord, ...wrongWords]);
        setQuestion(questionText);
        setAnswers(allAnswers);
        setCorrectAnswer(correctWord);
        break;
      }
    }

    setSelectedAnswer(null);
    setShowNextButton(false);
  };

  useEffect(() => {
    if (isVisible) generateQuestion();
  }, [isVisible]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <Text style={styles.question}>{question}</Text>
          <View style={styles.answersContainer}>
            {answers.map((answer, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.answerButton,
                  selectedAnswer === answer && {
                    backgroundColor:
                      answer !== correctAnswer ? color.lightRed : color.lightBlue,
                  },
                  answer === correctAnswer && selectedAnswer && {
                    backgroundColor: color.lightBlue,
                  },
                ]}
                onPress={() => {
                  setSelectedAnswer(answer);
                  setShowNextButton(true);
                }}
                disabled={!!selectedAnswer}
              >
                <Text style={styles.answerText}>{answer}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {showNextButton && (
            <TouchableOpacity onPress={generateQuestion} style={styles.nextQuestion}>
              <ArrowCircleRight2 size="36" color="#FF8A65" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default QuestionModal;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,

  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import QuestionBlock from "./QuizGame/QuestionBlock";
import FinalResultModal from "./QuizGame/FinalResultModal";
import { getRandomVocabulary, getUnrelatedWords, findConfusingWords } from "../utils/fileSystem";
import styles from "../Css/quiz"; // Import styles for QuizScreen
type Result = {
  correct: boolean;
  type: string;
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

type QuestionData = {
  word: Vocabulary;
  type: string;
  prompt: string;
  correct: string;
  choices?: string[];
};
type Props = {
  data: QuestionData; // KHÔNG nullable
  onAnswer: (isCorrect: boolean, questionType: string) => void;
  showNext: boolean;
  onNext: () => void;
};
const QuizScreen = ( ) => {
  const [vocabularyList, setVocabularyList] = useState<Vocabulary[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);

  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  const TOTAL_QUESTIONS = 25;

  const correctCount = results.filter((r) => r.correct).length;

  const wrongCount = results.length - correctCount;

  const restart = () => {
    setIndex(0);
    setResults([]);
    setCurrentQuestion(null);
    setShowResult(false);
    setDone(false);
    setLoading(true);
    loadData();
  };

  const loadData = async () => {
    try {
      const randomWords = await getRandomVocabulary(TOTAL_QUESTIONS);
      if (!randomWords || randomWords.length === 0) {
        Alert.alert("Lỗi", "Không tìm thấy đủ dữ liệu để tạo bài kiểm tra.");
        return;
      }
      setVocabularyList(randomWords);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể lấy danh sách từ vựng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (vocabularyList.length === 0) return;
    if (index >= vocabularyList.length) {
      setDone(true);
      return;
    }

    const generateQuestion = async () => {
      const word = vocabularyList[index];
      const unrelated = await getUnrelatedWords(word.word, 3);
      const wordLength = word.word.length;
      const isPhrase = word.word.includes(" ");

      // Xác suất lựa chọn quizType theo độ dài từ
      let weightedTypes = [];

      if (wordLength < 7) {
        weightedTypes = ["fill", "word", "word", "meaning", "synonym", "antonym"];
      } else if (wordLength > 12 || isPhrase) {
        weightedTypes = ["synonym", "antonym", "synonym", "antonym", "meaning", "word"];
      } else {
        weightedTypes = ["word", "meaning", "word", "meaning", "synonym", "antonym", "fill"];
      }

      const getRandomType = () => {
        const randIndex = Math.floor(Math.random() * weightedTypes.length);
        return weightedTypes[randIndex];
      };

      let selectedType = getRandomType();

      // Nếu fill nhưng là cụm từ thì loại ra
      if (selectedType === "fill" && isPhrase) {
        selectedType = "meaning";
      }

      // Kiểm tra xem dữ liệu có đủ cho loại đã chọn không
      const isValid = (type: string) => {
        switch (type) {
          case "synonym": return word.synonyms && word.synonyms.length > 0;
          case "antonym": return word.antonyms && word.antonyms.length > 0;
          case "meaning": return word.meaning && word.meaning.length > 0;
          case "word": return word.meaning && word.meaning.length > 0;
          case "fill": return !isPhrase && word.word;
          default: return false;
        }
      };

      // Nếu không hợp lệ, thử chọn loại khác tối đa 5 lần
      let attempts = 0;
      while (!isValid(selectedType) && attempts < 5) {
        selectedType = getRandomType();
        if (selectedType === "fill" && isPhrase) {
          selectedType = "meaning";
        }
        attempts++;
      }

      // Nếu sau 5 lần vẫn không hợp lệ → fallback
      if (!isValid(selectedType)) {
        if (word.meaning?.[0]) selectedType = "meaning";
        else if (word.word) selectedType = "word";
        else {
          next();
          return;
        }
      }
      // const confusing = await findConfusingWords(
      //   word.word,
      //   word.meaning?.[0] || "",
      //   selectedType,
      //   vocabularyList
      // );

      // console.log("🔥 Confusing words test:", confusing);

      const questionData: QuestionData = {
        word,
        type: selectedType,
        correct: "",
        choices: [],
      };

      switch (selectedType) {
        case "meaning":
          questionData.prompt = `Từ: ${word.word}`;
          questionData.correct = word.meaning?.[0] || "";
          questionData.choices = [
            word.meaning?.[0] || "",
            ...unrelated.map((w: any) => w.meaning?.[0] || "")
          ];
          break;

        case "word":
          questionData.prompt = `Nghĩa: ${word.meaning?.[0] || ""}`;
          questionData.correct = word.word;
          questionData.choices = [word.word, ...unrelated.map((w: any) => w.word)];
          break;

        case "synonym":
          questionData.prompt = `Từ đồng nghĩa của: ${word.word}`;
          questionData.correct = word.synonyms?.[0] || "";
          questionData.choices = [
            word.synonyms?.[0] || "",
            ...unrelated.map((w: any) => w.word)
          ];
          break;

        case "antonym":
          questionData.prompt = `Từ trái nghĩa của: ${word.word}`;
          questionData.correct = word.antonyms?.[0] || "";
          questionData.choices = [
            word.antonyms?.[0] || "",
            ...unrelated.map((w: any) => w.word)
          ];
          break;

        case "fill":
          questionData.prompt = `Điền từ vào: ${word.meaning?.[0] || ""}`;
          questionData.correct = word.word;
          break;
      }


      if (questionData.choices?.length) {
        questionData.choices = questionData.choices.sort(() => 0.5 - Math.random());
      }

      setCurrentQuestion(questionData);
    };



    generateQuestion();
  }, [vocabularyList, index]);

  const next = () => {
    setIndex((i) => i + 1);
    setShowResult(false);
  };

  const recordAnswer = (isCorrect: boolean, questionType: string) => {
    setResults((prev) => [...prev, { correct: isCorrect, type: questionType }]);
    setShowResult(true);
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải danh sách từ vựng...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!done && currentQuestion && (
        <>
          <View style={styles.progressBar}>
            <Text style={styles.progressText}>
              Câu {index + 1} / {TOTAL_QUESTIONS}
            </Text>
            <Text style={styles.scoreText}>
              ✅ {correctCount}   ❌ {wrongCount}
            </Text>
          </View>

          <QuestionBlock
            data={currentQuestion!}
            onAnswer={recordAnswer}
            showNext={showResult}
            onNext={next}
          />  
        </>
      )}

      {done && (
        <View style={styles.resultContainer}>
          <FinalResultModal resultList={results} />
          <TouchableOpacity style={styles.retryButton} onPress={restart}>
            <Text style={styles.retryText}>🔄 Làm lại bài kiểm tra</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};



export default QuizScreen;

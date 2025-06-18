// VocabularyFlipScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import FlipCard from './FlipCard';
import { screenStyles } from '../../Css/vocabulary';
import Footer from '../footer';
import { getRandomVocabulary } from '../../utils/fileSystem';

type Vocabulary = {
  word: string;
  meaning: string[] | string;
  note?: string;
  types?: string[];
  synonyms?: string[];
  antonyms?: string[];
};

const VocabularyFlipScreen = ({ navigation }: any) => {
  const [vocabularyList, setVocabularyList] = useState<Vocabulary[]>([]);
  const [index, setIndex] = useState(0);

  const handleSwipe = (direction: string) => {
    if (direction === 'SWIPE_LEFT' && index < vocabularyList.length - 1) {
      setIndex(index + 1);
    } else if (direction === 'SWIPE_RIGHT' && index > 0) {
      setIndex(index - 1);
    }
  };

  const loadData = async () => {
    try {
      const randomWords = await getRandomVocabulary(30);
      if (!randomWords || randomWords.length === 0) {
        Alert.alert('Lỗi', 'Không tìm thấy đủ dữ liệu để tạo bài kiểm tra.');
        return;
      }
      setVocabularyList(randomWords);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lấy danh sách từ vựng.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!vocabularyList[index]) return null;

  const current = vocabularyList[index];

  const meaningArray = Array.isArray(current.meaning)
    ? current.meaning
    : [current.meaning];
  const typeArray = current.types || [];
  const synonymsArray = current.synonyms || [];
  const antonymsArray = current.antonyms || [];

  return (
    <GestureRecognizer onSwipe={handleSwipe} style={screenStyles.container}>
      <FlipCard
        word={current.word}
        meanings={meaningArray}
        types={typeArray}
        synonyms={synonymsArray}
        antonyms={antonymsArray}
      />
      <Text style={screenStyles.pagination}>
        {`${index + 1} / ${vocabularyList.length}`}
      </Text>
      <Footer navigation={navigation} />
    </GestureRecognizer>
  );
};

export default VocabularyFlipScreen;

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import FlipCard from './FlipCard';
import { screenStyles } from '../../Css/vocabulary';
const vocabularyList = [
  {
    word: "abandon",
    meaning: "từ bỏ",
    type: "verb",
    synonyms: ["leave", "quit"],
    antonyms: ["keep", "stay"]
  },
  {
    word: "benevolent",
    meaning: "nhân hậu",
    type: "adjective",
    synonyms: ["kind", "generous"],
    antonyms: ["cruel", "selfish"]
  },
  {
    word: "chaos",
    meaning: "hỗn loạn",
    type: "noun",
    synonyms: ["disorder", "turmoil"],
    antonyms: ["order", "peace"]
  },
  {
    word: "diligent",
    meaning: "siêng năng",
    type: "adjective",
    synonyms: ["hard-working", "industrious"],
    antonyms: ["lazy", "neglectful"]
  },
  {
    word: "eliminate",
    meaning: "loại bỏ",
    type: "verb",
    synonyms: ["remove", "eradicate"],
    antonyms: ["retain", "keep"]
  },
];

const VocabularyFlipScreen = () => {
  const [index, setIndex] = useState(0);

  const handleSwipe = (direction: string) => {
    if (direction === 'SWIPE_LEFT' && index < vocabularyList.length - 1) {
      setIndex(index + 1);
    } else if (direction === 'SWIPE_RIGHT' && index > 0) {
      setIndex(index - 1);
    }
  };

  const current = vocabularyList[index];

  return (
    <GestureRecognizer onSwipe={(dir) => handleSwipe(dir)} style={screenStyles.container}>
      <FlipCard
        word={current.word}
        meaning={current.meaning}
        type={current.type}
        synonyms={current.synonyms}
        antonyms={current.antonyms}
      />
      <Text style={screenStyles.pagination}>
        {`${index + 1} / ${vocabularyList.length}`}
      </Text>
    </GestureRecognizer>
  );
};

export default VocabularyFlipScreen;
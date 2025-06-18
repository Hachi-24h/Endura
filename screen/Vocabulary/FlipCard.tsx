import React, { useRef, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import { cardStyles } from '../../Css/vocabulary';
import color from '../../Custom/Color';
import { height } from '../../utils/config';

type FlipCardProps = {
  word: string;
  meanings: string[];
  types?: string[];
  synonyms?: string[];
  antonyms?: string[];
};
type WordType =
  | "Noun"
  | "Pronoun"
  | "Verb"
  | "Adjective"
  | "Adverb"
  | "Preposition"
  | "Conjunction"
  | "Interjection"
  | "Determiner"
  | "Article";

const typeColors: Record<WordType, string> = {
  Noun: "#FF5733",
  Pronoun: "#FFCC99",
  Verb: "#33FF57",
  Adjective: "#3357FF",
  Adverb: "#FF33A1",
  Preposition: "#FFD133",
  Conjunction: "#33FFF5",
  Interjection: "#006666",
  Determiner: "#006600",
  Article: "#009900"
};

const FlipCard = ({ word, meanings, types, synonyms, antonyms }: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  console.log("types:", types);
  console.log("synonyms :", synonyms);
  console.log("antonyms:", antonyms);
  console.log("meanings:", meanings);
  console.log("word :", word);
  const frontAnimatedStyle = {
    transform: [{
      rotateY: animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
      })
    }]
  };

  const backAnimatedStyle = {
    transform: [{
      rotateY: animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
      })
    }]
  };

  const flipToFront = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 10
    }).start(() => setFlipped(false));
  };

  const flipToBack = () => {
    Animated.spring(animatedValue, {
      toValue: 180,
      useNativeDriver: true,
      friction: 8,
      tension: 10
    }).start(() => setFlipped(true));
  };

  const toggleFlip = () => {
    flipped ? flipToFront() : flipToBack();
  };

  return (
    <TouchableWithoutFeedback onPress={toggleFlip}>
      <View style={cardStyles.cardContainer}>
        <Animated.View style={[cardStyles.card, cardStyles.front, frontAnimatedStyle]}>
          <Text style={cardStyles.wordText}>{word}</Text>
        </Animated.View>

        <Animated.View style={[cardStyles.card, cardStyles.back, backAnimatedStyle]}>
          <View style={{ height: "50%", width: "90%", borderBottomWidth: 1, borderBottomColor: color.lightGray, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={cardStyles.meaningText}>{meanings}</Text>
          </View>

          <View style={{ flexDirection: "column", alignItems: 'flex-start', height: "50%", width: "100%", paddingTop: "10%", paddingHorizontal: "10%" }}>

            <Text style={cardStyles.subInfo}>
              Loại từ : </Text>
            {types && (
              <Text style={{ fontWeight: 'bold', fontSize: height * 0.02, flexWrap: 'wrap' }}>
                {types.map((type, index) => (
                  <Text
                    key={index}
                    style={{ color: typeColors[type as WordType] }}
                  >
                    {type}
                    {index !== types.length - 1 ? ', ' : ''}
                  </Text>
                ))}
              </Text>
            )}

            <Text style={cardStyles.subInfo}>Đồng nghĩa:  </Text>
            {Array.isArray(synonyms) && synonyms.length > 0 && (
              <Text style={{ fontWeight: "bold", fontSize: height * 0.02 }}>`"["{synonyms.join(', ')}"]"`</Text>
            )}
            <Text style={cardStyles.subInfo}>Trái nghĩa:  </Text>
            {Array.isArray(antonyms) && antonyms.length > 0 && (
              <Text style={{ fontWeight: "bold", fontSize: height * 0.02 }}>{antonyms.join(', ')}</Text>
            )}
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FlipCard;

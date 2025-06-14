import React, { useRef, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import { cardStyles } from '../../Css/vocabulary';

type FlipCardProps = {
  word: string;
  meaning: string;
  type?: string;
  synonyms?: string[];
  antonyms?: string[];
};

const FlipCard = ({ word, meaning, type, synonyms, antonyms }: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

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
          <Text style={cardStyles.meaningText}>{meaning}</Text>
          {type && <Text style={cardStyles.subInfo}>Loại từ: {type}</Text>}

          {Array.isArray(synonyms) && synonyms.length > 0 && (
            <Text style={cardStyles.subInfo}>Đồng nghĩa: {synonyms.join(', ')}</Text>
          )}

          {Array.isArray(antonyms) && antonyms.length > 0 && (
            <Text style={cardStyles.subInfo}>Trái nghĩa: {antonyms.join(', ')}</Text>
          )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FlipCard;

import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { height } = Dimensions.get('window');

/**
 * ===============================
 * TYPE ĐỊNH NGHĨA CHUẨN
 * ===============================
 */
type FlashcardColorSet = [
  (string | number)[], // gradient colors
  string,              // English text color
  string,              // Vietnamese text color
  string               // type badge background
];

/**
 * ===============================
 * COLOR SETS (GIỮ NGUYÊN Ý BẠN)
 * ===============================
 */
const flashcardColorSets: FlashcardColorSet[] = [
  [
    ['#4FACFE', '#00F2FE'],
    '#FFFFFF',
    '#0F172A',
    '#E0F2FE',
  ],
  [
    ['#43E97B', '#38F9D7'],
    '#064E3B',
    '#022C22',
    '#ECFDF5',
  ],
  [
    ['#FF9A3C', '#FF3D77'],
    '#FFFFFF',
    '#2D0A00',
    '#FFF3E0',
  ],
  [
    ['#667EEA', '#764BA2'],
    '#FFFFFF',
    '#F3E8FF',
    '#EDE9FE',
  ],
  [
    ['#0F2027', '#203A43', '#2C5364'],
    '#E5F3FF',
    '#C7D2FE',
    '#38BDF8',
  ],
];

/**
 * ===============================
 * PROPS
 * ===============================
 */
interface Props {
  front: string;
  back: string[] | string;
  type?: string | null;
  colorIndex: number;
}

/**
 * ===============================
 * COMPONENT
 * ===============================
 */
export default function FlipCard({
  front,
  back,
  type,
  colorIndex,
}: Props) {
  const animated = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  /**
   * Lấy color set theo index
   */
  const [
    gradientColors,
    englishTextColor,
    vietnameseTextColor,
    typeBgColor,
  ] = useMemo(
    () => flashcardColorSets[colorIndex % flashcardColorSets.length],
    [colorIndex],
  );

  /**
   * Animation rotate
   */
  const frontRotate = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const flip = () => {
    Animated.spring(animated, {
      toValue: flipped ? 0 : 1,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  /**
   * Chuẩn hoá nghĩa để hiển thị
   */
  const meaningText = Array.isArray(back)
    ? back.join(' / ')
    : back;

  return (
    <TouchableWithoutFeedback onPress={flip}>
      <View style={{ height: height * 0.7 }}>
        {/* FRONT */}
        <Animated.View
          style={[
            styles.card,
            { transform: [{ rotateY: frontRotate }] },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            style={styles.gradient}
          >
            <Text
              style={[
                styles.frontText,
                { color: englishTextColor },
              ]}
            >
              {front}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* BACK */}
        <Animated.View
          style={[
            styles.card,
            styles.back,
            { transform: [{ rotateY: backRotate }] },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            style={styles.gradient}
          >
            <Text
              style={[
                styles.backText,
                { color: vietnameseTextColor },
              ]}
            >
              {meaningText}
            </Text>

            <View
              style={[
                styles.typeBadge,
                { backgroundColor: typeBgColor },
              ]}
            >
              <Text style={styles.typeText}>
                {type ?? 'Unknown'}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

/**
 * ===============================
 * STYLES
 * ===============================
 */
const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  back: {
    transform: [{ rotateY: '180deg' }],
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  frontText: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  backText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 28,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
});

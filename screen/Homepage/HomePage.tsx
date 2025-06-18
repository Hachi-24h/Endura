import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, FlatList, Dimensions, View } from 'react-native';
import styles from '../../Css/Homepage';

import * as Animatable from 'react-native-animatable';
import { getVocabularyList, getLength, getWordTypeCount } from '../../utils/fileSystem';

import HeaderSection from './HeaderSection';
import FilterSection from './FilterSection';
import SlideSection from './SlideSection';
import RecentWordsSection from './RecentWordsSection';
import { VocabularyItem } from './types';
import Footer from '../footer';

const { width } = Dimensions.get('window');

const HomePage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [user] = useState("Nam");
  const [recentWords, setRecentWords] = useState<VocabularyItem[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [typeCount, setTypeCount] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const words = await getVocabularyList();
      const length = await getLength();
      const types = await getWordTypeCount();
      setRecentWords(words.slice(-5).reverse());
      setWordCount(length);
      setTypeCount(types);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % 3;
      setCurrentIndex(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    }, 5000);
    autoScrollRef.current = interval;
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ScrollView
      style={styles.container}
      onScroll={(event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
          setShouldAnimate(true);
        } else {
          setShouldAnimate(false);
        }
      }}
      scrollEventThrottle={16}
    >
      <HeaderSection navigation={navigation} user={user} />
      <View style={styles.body}>
        
        <FilterSection navigation={navigation} />
      </View>

      <SlideSection currentIndex={currentIndex} flatListRef={flatListRef} setCurrentIndex={setCurrentIndex} />
      <RecentWordsSection words={recentWords} shouldAnimate={shouldAnimate} />
      <Footer navigation={navigation}  />
    </ScrollView>
  );
};

export default HomePage;

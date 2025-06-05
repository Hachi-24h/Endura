import React from 'react';
import { View, Text, FlatList, Image, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import styles from '../../Css/Homepage';
import * as Animatable from 'react-native-animatable';
import color from '../../Custom/Color';

const { width } = Dimensions.get('window');

interface SlideProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  flatListRef: React.RefObject<FlatList>;
}

const SlideSection: React.FC<SlideProps> = ({ currentIndex, setCurrentIndex, flatListRef }) => {
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <>
      <Animatable.Text
        animation={"fadeInLeft"}
        duration={1000}
        style={styles.titleMain}>Besides
      </Animatable.Text>
      <Animatable.View
        animation={"slideInLeft"}
        duration={1000}
        style={styles.slideContainer}
      >
        <FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={[1, 2, 3]} // 3 thẻ cố định
          renderItem={({ index }) => {
            if (index === 0) {
              return (
                <View style={[styles.card, { backgroundColor: '#64B5F6' }]}>
                  <Image source={require('../../Icon/slide_vocal.png')} style={styles.courseImg} />
                  <Text style={styles.courseTitle}>Số lượng từ vựng hiện có</Text>
                  <Text style={styles.courseSubtitle}>1324 từ vựng</Text>
                </View>
              );
            } else if (index === 1) {
              return (
                <View style={[styles.card, { backgroundColor: '#FFB74D' }]}>
                  <Image source={require('../../Icon/slide_quiz.png')} style={styles.courseImg} />
                  <Text style={styles.courseTitle}>Advanced UX/UI</Text>
                  <Text style={styles.courseSubtitle}>Created by UX Experts</Text>
                </View>
              );
            } else {
              return (
                <View style={[styles.card, { backgroundColor: '#81C784' }]}>
                  <Image source={require('../../Icon/slide_ptich.png')} style={styles.courseImg} />
                  <Text style={styles.courseTitle}>Mobile App Development</Text>
                  <Text style={styles.courseSubtitle}>Created by Dev Team</Text>
                </View>
              );
            }
          }}
          onMomentumScrollEnd={handleScrollEnd}
        />
      </Animatable.View>

      <View style={styles.pagination}>
        {[0, 1, 2].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? color.gray : color.beige },
            ]}
          />
        ))}
      </View>
    </>
  );
};

export default SlideSection;

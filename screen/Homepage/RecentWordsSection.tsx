import React from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import styles from '../../Css/Homepage';
import * as Animatable from 'react-native-animatable';
import color from '../../Custom/Color';
import { VocabularyItem } from './types';

const { width } = Dimensions.get('window');

const colorThemes = [
  { backgroundColor: '#FFEBEE', textColor1: '#D32F2F', textColor2: '#B71C1C' },
  { backgroundColor: '#E3F2FD', textColor1: '#1976D2', textColor2: '#0D47A1' },
  { backgroundColor: '#E8F5E9', textColor1: '#388E3C', textColor2: '#1B5E20' },
  { backgroundColor: '#FFF3E0', textColor1: '#F57C00', textColor2: '#E65100' },
  { backgroundColor: '#F3E5F5', textColor1: '#8E24AA', textColor2: '#6A1B9A' },
];

const RecentWordsSection: React.FC<{ words: VocabularyItem[]; shouldAnimate: boolean }> = ({
  words,
  shouldAnimate,
}) => {
  return (
    <>
      <Animatable.Text
        animation={"fadeInLeft"}
        duration={1000}

        style={styles.titleMain}>Recent Added</Animatable.Text>
      <View style={{ flex: 1 }}>
        <FlatList
          data={words}
          keyExtractor={(item, index) => index.toString()}
          nestedScrollEnabled={true} // ✅ Fix lỗi ScrollView
          scrollEnabled={false} // ✅ Tránh xung đột cuộn
          ListEmptyComponent={
            <Text style={{ color: color.gray, fontSize: width * 0.04 }}>
              Chưa có từ nào được thêm gần đây.
            </Text>
          }
          renderItem={({ item, index }) => {
            // Lấy bộ màu dựa theo index
            const theme = colorThemes[index % colorThemes.length];

            return (
              <Animatable.View
                animation={shouldAnimate ? (index % 2 === 0 ? "slideInRight" : "slideInLeft") : undefined}
                duration={1500} // Mỗi từ xuất hiện trong 1.5s
                delay={index * 100} // Hiệu ứng trễ dần
                style={[
                  styles.wordContainer,
                  styles.shadowEffect,
                  { backgroundColor: theme.backgroundColor, opacity: shouldAnimate ? 1 : 0 } // 🔥 Mặc định ẩn
                ]}
              >
                <Text style={[styles.word, { color: theme.textColor1 }]}>
                  {item.word}
                </Text>
                <Text
                  style={[styles.meaning, { color: theme.textColor2 }]}
                  numberOfLines={1} // ✅ Giới hạn 1 dòng
                  ellipsizeMode="tail" // ✅ Hiển thị "..." nếu quá dài
                >
                  {Array.isArray(item.meaning) ? item.meaning.join(', ') : "Chưa có nghĩa"}
                </Text>
              </Animatable.View>
            );
          }}

        />
      </View>
    </>
  );
};

export default RecentWordsSection;

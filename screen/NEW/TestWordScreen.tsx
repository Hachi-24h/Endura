import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react-native';
import { loadVocabulary } from '../../utils/vocabularyStorage_NEW';
import FlipCard from './FlipCard';
import Footer from '../footer';

export default function TestWordScreen() {
  const [list, setList] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    loadVocabulary().then(setList);
  }, []);

  if (!list.length) return null;

  const current = list[index];

  const goPrev = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  const goNext = () => {
    if (index < list.length - 1) setIndex(i => i + 1);
  };

  const isFirst = index === 0;
  const isLast = index === list.length - 1;

  return (
    <View style={styles.container}>
      {/* FLASHCARD */}
      <FlipCard
        front={current.word}
        back={current.meaning}
        type={current.type}
        colorIndex={index}
      />

      {/* CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.controlBtn,
            isFirst && styles.disabledBtn,
          ]}
          disabled={isFirst}
          onPress={goPrev}
        >
          <ArrowLeft2
            size={28}
            color={isFirst ? '#9ca3af' : '#111827'}
            variant="Bold"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlBtn,
            isLast && styles.disabledBtn,
          ]}
          disabled={isLast}
          onPress={goNext}
        >
          <ArrowRight2
            size={28}
            color={isLast ? '#9ca3af' : '#111827'}
            variant="Bold"
          />
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <Footer />
    </View>
  );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'center',
  },

  controls: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },

  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  disabledBtn: {
    backgroundColor: '#e5e7eb',
  },
});

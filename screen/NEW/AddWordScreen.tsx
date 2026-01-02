import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import Footer from '../footer';
import {
  addVocabulary,
  getAllVocabulary,
} from '../../utils/vocabularyStorage_NEW';
export default function AddWordScreen() {
  const nav = useNavigation<any>();

  const [word, setWord] = useState('');
  const [meaningText, setMeaningText] = useState('');
  const [type, setType] = useState('');
  const [note, setNote] = useState('');          // 👈 NEW
  const [isIT, setIsIT] = useState(false);

  /**
   * Tách nghĩa bằng dấu phẩy
   */
  const parseMeanings = (text: string): string[] =>
    text
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

  const submit = async () => {
  if (!word.trim() || !meaningText.trim()) return;

  if (!type) {
    Alert.alert(
      'Thiếu loại từ',
      'Vui lòng chọn loại từ trước khi thêm'
    );
    return;
  }

  const isExist = await checkWordExist(word, type);
  if (isExist) {
    Alert.alert(
      'Từ đã tồn tại',
      'Từ này với loại từ này đã có rồi'
    );
    return;
  }

  await addVocabulary({
    id: uuid.v4().toString(),
    word: word.trim(),
    meaning: parseMeanings(meaningText),
    type,               // ✅ luôn có giá trị
    note: note.trim() || null,
    isIT,
    createdAt: new Date().toISOString(),
  });

  setWord('');
  setMeaningText('');
  setType('');
  setNote('');
  setIsIT(false);
};



 const checkWordExist = async (word: string, type: string) => {
  const list = await getAllVocabulary();

  return list.some(
    item =>
      item.word.trim().toLowerCase() === word.trim().toLowerCase() &&
      item.type === type
  );
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm Từ Vựng</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <Text style={styles.label}>Từ Tiếng Anh</Text>
        <TextInput
          style={styles.input}
          value={word}
          onChangeText={setWord}
          placeholder="Nhập từ tiếng Anh..."
        />

        <View style={styles.divider} />

        <Text style={styles.label}>Tiếng Việt</Text>
        <TextInput
          style={styles.input}
          value={meaningText}
          onChangeText={setMeaningText}
          placeholder="VD: lợi ích, phúc lợi"
        />
        <Text style={styles.helper}>
          * Mỗi nghĩa cách nhau bằng dấu phẩy
        </Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Loại Từ</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={type} onValueChange={setType}>
            <Picker.Item label="Chọn loại từ" value="" />
            <Picker.Item label="Danh từ (Noun)" value="Noun" />
            <Picker.Item label="Động từ (Verb)" value="Verb" />
            <Picker.Item label="Tính từ (Adjective)" value="Adjective" />
            <Picker.Item label="Trạng từ (Adverb)" value="Adverb" />
          </Picker>
        </View>

        <View style={styles.divider} />

        {/* NOTE */}
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          value={note}
          onChangeText={setNote}
          placeholder="Ghi chú thêm cho từ này..."
          multiline
        />

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Có phải từ chuyên ngành?</Text>
          <Switch value={isIT} onValueChange={setIsIT} />
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.btnAdd]} onPress={submit}>
          <Text style={styles.btnText}>Thêm Từ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnBlue]}
          onPress={() => nav.navigate('listword')}
        >
          <Text style={styles.btnText}>Danh Sách</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnOrange]}
          onPress={() => nav.navigate('testword')}
        >
          <Text style={styles.btnText}>Kiểm Tra</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </KeyboardAvoidingView>
  );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#eaf2fb' },
  header: {
    height: 90,
    backgroundColor: '#5aa2e8',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIcon: { fontSize: 22, color: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },

  form: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 16,
  },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  helper: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  btn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnAdd: { backgroundColor: '#4CAF50' },
  btnBlue: { backgroundColor: '#3b82f6' },
  btnOrange: { backgroundColor: '#f97316' },
  btnText: { color: '#fff', fontWeight: '700' },
});

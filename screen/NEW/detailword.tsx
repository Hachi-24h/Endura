import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Footer from '../footer';

export default function WordDetailScreen() {
  const nav = useNavigation<any>();

  /* ================= STATE (mock – sau sẽ lấy từ route) ================= */
  const [editing, setEditing] = useState(false);

  const [word, setWord] = useState('Unknown');
  const [meanings, setMeanings] = useState<string[]>([
    'chưa xác định',
    'không rõ',
  ]);
  const [type, setType] = useState<string>('Noun');
  const [note, setNote] = useState('');

  /* ================= DERIVED ================= */
  const meaningTextForEdit = useMemo(
    () => meanings.join(', '),
    [meanings],
  );

  const onChangeMeaningText = (text: string) => {
    const arr = text
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);
    setMeanings(arr);
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ================= DETAIL CARD ================= */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Chi tiết</Text>
            <TouchableOpacity onPress={() => setEditing(e => !e)}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* WORD */}
          <Field label="Từ vựng">
            {editing ? (
              <TextInput
                style={styles.input}
                value={word}
                onChangeText={setWord}
              />
            ) : (
              <ValueBox text={word} />
            )}
          </Field>

          {/* MEANING */}
          <Field label="Nghĩa">
            {editing ? (
              <TextInput
                style={styles.input}
                value={meaningTextForEdit}
                onChangeText={onChangeMeaningText}
                placeholder="nghĩa 1, nghĩa 2"
              />
            ) : (
              <View style={styles.tagWrap}>
                {meanings.map((m, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{m}</Text>
                  </View>
                ))}
              </View>
            )}
          </Field>

          {/* TYPE */}
          <Field label="Loại từ">
            {editing ? (
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={type}
                  onValueChange={setType}
                >
                  <Picker.Item label="Noun" value="Noun" />
                  <Picker.Item label="Verb" value="Verb" />
                  <Picker.Item label="Adjective" value="Adjective" />
                  <Picker.Item label="Adverb" value="Adverb" />
                  <Picker.Item label="Unknown" value="Unknown" />
                </Picker>
              </View>
            ) : (
              <ValueBox text={type} />
            )}
          </Field>

          {/* NOTE */}
          <Field label="Ghi chú">
            {editing ? (
              <TextInput
                style={[styles.input, { height: 70 }]}
                value={note}
                onChangeText={setNote}
                multiline
                placeholder="Thêm ghi chú..."
              />
            ) : (
              <ValueBox text={note || '—'} />
            )}
          </Field>
        </View>

        {/* ================= SYNONYM ================= */}
        <PlaceholderCard
          title="Đồng nghĩa"
          text="Hãy nhập thêm từ đồng nghĩa"
        />

        {/* ================= ANTONYM ================= */}
        <PlaceholderCard
          title="Trái nghĩa"
          text="Hãy nhập thêm từ trái nghĩa"
        />
      </ScrollView>
    </View>
  );
}

/* ================= REUSABLE ================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function ValueBox({ text }: { text: string }) {
  return (
    <View style={styles.valueBox}>
      <Text style={styles.valueText}>{text}</Text>
    </View>
  );
}

function PlaceholderCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.iconRow}>
          <Text style={styles.editIcon}>✏️</Text>
          <Text style={styles.editIcon}>＋</Text>
        </View>
      </View>
      <Text style={styles.placeholderText}>{text}</Text>
       <Footer  />
    </View>
    
  );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#9fe5df' },

  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#fb923c',
    marginRight: 12,
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#fb923c',
  },
  searchPlaceholder: { color: '#fb923c' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  editIcon: { fontSize: 18, marginLeft: 12 },
  iconRow: { flexDirection: 'row' },

  field: { marginBottom: 14 },
  label: { fontSize: 14, marginBottom: 6 },

  valueBox: {
    backgroundColor: '#9fe5df',
    borderRadius: 10,
    padding: 10,
  },
  valueText: { fontSize: 15 },

  input: {
    backgroundColor: '#9fe5df',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
  },

  pickerBox: {
    backgroundColor: '#9fe5df',
    borderRadius: 10,
    overflow: 'hidden',
  },

  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#9fe5df',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 14 },

  placeholderText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
  },
});

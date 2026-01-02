import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vocabulary } from '../model/VocabularyModel';

const STORAGE_KEY = 'VOCABULARY_LIST';

// ================= LOAD =================
export const loadVocabulary = async (): Promise<Vocabulary[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];

    const data = JSON.parse(json);

    // đảm bảo data luôn là array
    if (!Array.isArray(data)) return [];

    return data;
  } catch (error) {
    console.error('Load vocabulary error:', error);
    return [];
  }
};

// ================= SAVE =================
export const saveVocabulary = async (list: Vocabulary[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Save vocabulary error:', error);
  }
};

// ================= ADD =================
export const addVocabulary = async (word: Vocabulary) => {
  const list = await loadVocabulary();
  list.push(word);
  await saveVocabulary(list);
};

// ================= UPDATE =================
export const updateVocabulary = async (updated: Vocabulary) => {
  const list = await loadVocabulary();
  const newList = list.map(item =>
    item.id === updated.id ? updated : item,
  );
  await saveVocabulary(newList);
};

// ================= DELETE =================
export const deleteVocabulary = async (id: string) => {
  const list = await loadVocabulary();
  const newList = list.filter(item => item.id !== id);
  await saveVocabulary(newList);
};

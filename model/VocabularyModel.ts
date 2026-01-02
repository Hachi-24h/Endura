// VocabularyModel_NEW.ts

// ================= WORD TYPES =================
// Loại từ cố định, không cho user tự thêm
export const WORD_TYPES = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'sentence',
  'other',
] as const;

export type WordType = typeof WORD_TYPES[number];

// ================= VOCABULARY MODEL =================
export interface Vocabulary {
  id: string;

  english: string;
  vietnamese: string;

  meanings: string[];     // nhiều nghĩa
  wordTypes: WordType[];  // nhiều loại từ

  notes?: string;

  synonyms?: string[];
  antonyms?: string[];

  // ⚠️ category dùng string để DYNAMIC
  categories?: string[];
}

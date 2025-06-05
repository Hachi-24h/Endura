type WordType =
  | 'Noun'
  | 'Pronoun'
  | 'Verb'
  | 'Adjective'
  | 'Adverb'
  | 'Preposition'
  | 'Conjunction'
  | 'Interjection'
  | 'Determiner'
  | 'Article';

export default class Vocabulary {
  word: string;
  meaning: string;
  note?: string;
  types: WordType[];
  synonyms: string[];
  antonyms: string[];
  createdAt: string;

  constructor(
    word: string,
    meaning: string,
    note: string = '',
    types: WordType[] = [],
    synonyms: string[] = [],
    antonyms: string[] = []
  ) {
    this.word = word;
    this.meaning = meaning;
    this.note = note;
    this.types = types;
    this.synonyms = synonyms;
    this.antonyms = antonyms;
    this.createdAt = new Date().toISOString();
  }

  addType(type: WordType) {
    if (!this.types.includes(type)) {
      this.types.push(type);
    }
  }

  removeType(type: WordType) {
    this.types = this.types.filter((t) => t !== type);
  }

  addSynonym(synonym: string) {
    this.synonyms.push(synonym);
  }

  addAntonym(antonym: string) {
    this.antonyms.push(antonym);
  }
}

// File: models/VocabularyModel.js

export default class Vocabulary {
    constructor(word, meaning, note, type, synonyms, antonyms) {
        this.word = word; 
        this.meaning = meaning;
        this.note = note || '';
        this.type = type; 
        this.synonyms = synonyms || []; // Từ đồng nghĩa
        this.antonyms = antonyms || []; // Từ trái nghĩa
    }

    // Phương thức thêm từ đồng nghĩa
    addSynonym(synonym) {
        this.synonyms.push(synonym);
    }

    // Phương thức thêm từ trái nghĩa
    addAntonym(antonym) {
        this.antonyms.push(antonym);
    }
}

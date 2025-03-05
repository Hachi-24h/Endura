export default class Vocabulary {
    constructor(word, meaning, note, types, synonyms = [], antonyms = []) {
        this.word = word;
        this.meaning = meaning;
        this.note = note;
        this.types = types;
        this.synonyms = synonyms;
        this.antonyms = antonyms;
        this.createdAt = new Date().toISOString(); // Lưu thời gian theo ISO format
    }

    // Phương thức kiểm tra và thêm loại từ
    addType(type) {
        const validTypes = ['Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection', 'Determiner', 'Article'];
        if (validTypes.includes(type) && !this.types.includes(type)) {
            this.types.push(type);
        }
    }

    // Phương thức thêm từ đồng nghĩa
    addSynonym(synonym) {
        this.synonyms.push(synonym);
    }

    // Phương thức thêm từ trái nghĩa
    addAntonym(antonym) {
        this.antonyms.push(antonym);
    }

    // Phương thức xóa loại từ
    removeType(type) {
        this.types = this.types.filter(t => t !== type);
    }
}

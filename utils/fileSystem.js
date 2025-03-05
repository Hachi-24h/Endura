import RNFS from 'react-native-fs';

// Đường dẫn lưu file trong thư mục riêng của ứng dụng
const appFilePath = `${RNFS.DocumentDirectoryPath}/vocabulary.json`;
const normalizeVocabulary = (vocabulary) => {
    return vocabulary.map(item => ({
        ...item,
        word: item.word.trim(),
        synonyms: item.synonyms.map(s => s.trim()),
        antonyms: item.antonyms.map(a => a.trim()),
    }));
};

export const saveVocabularyToFile = async (data) => {
    try {
        // Tạo một bản sao của dữ liệu ban đầu
        const fullData = [...data];

        // Duyệt qua từng từ vựng để đảm bảo tất cả đều có `createdAt`
        data.forEach((vocab) => {
            if (!vocab.createdAt) {
                vocab.createdAt = new Date().toISOString();
            }

            // Thêm từ đồng nghĩa
            if (vocab.synonyms && Array.isArray(vocab.synonyms)) {
                vocab.synonyms.forEach((synonym) => {
                    const existingItem = fullData.find((item) => item.word === synonym);
                    if (!existingItem) {
                        // Nếu từ chưa tồn tại, thêm từ mới với `createdAt`
                        fullData.push({
                            word: synonym,
                            meanings: [],
                            note: '',
                            types: [],
                            synonyms: [vocab.word], // Liên kết ngược
                            antonyms: [],
                            createdAt: new Date().toISOString()
                        });
                    } else {
                        // Nếu từ đã tồn tại, thêm liên kết ngược
                        if (!existingItem.synonyms.includes(vocab.word)) {
                            existingItem.synonyms.push(vocab.word);
                        }
                    }
                });
            }

            // Thêm từ trái nghĩa
            if (vocab.antonyms && Array.isArray(vocab.antonyms)) {
                vocab.antonyms.forEach((antonym) => {
                    const existingItem = fullData.find((item) => item.word === antonym);
                    if (!existingItem) {
                        // Nếu từ chưa tồn tại, thêm từ mới với `createdAt`
                        fullData.push({
                            word: antonym,
                            meanings: [],
                            note: '',
                            types: [],
                            synonyms: [],
                            antonyms: [vocab.word], // Liên kết ngược
                            createdAt: new Date().toISOString()
                        });
                    } else {
                        // Nếu từ đã tồn tại, thêm liên kết ngược
                        if (!existingItem.antonyms.includes(vocab.word)) {
                            existingItem.antonyms.push(vocab.word);
                        }
                    }
                });
            }
        });

        // Ghi toàn bộ dữ liệu vào file
        await RNFS.writeFile(appFilePath, JSON.stringify(fullData, null, 2), 'utf8');
        console.log(`✅ File saved successfully to application directory: ${appFilePath}`);
    } catch (error) {
        console.error('❌ Error writing file:', error);
    }
};


/**
 * Đọc danh sách từ vựng từ file hiện tại
 */
export const getVocabularyData = async () => {
    try {
        const fileExists = await RNFS.exists(appFilePath);
        if (!fileExists) {
            console.log('⚠️ File vocabulary.json không tồn tại, tạo mới.');
            return [];
        }
        const fileData = await RNFS.readFile(appFilePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error('❌ Lỗi đọc dữ liệu từ vocabulary.json:', error);
        return [];
    }
};

/**
 * Thêm từ mới từ file JSON vào danh sách từ vựng hiện có
 * - Chỉ thêm từ chưa có, bỏ qua từ đã tồn tại.
 * - Lưu lại danh sách vào file nhưng KHÔNG ghi đè dữ liệu cũ.
 */
export const addWordsFromJsonFile = async (filePath) => {
    try {
        // Đọc dữ liệu từ file JSON được chọn
        const fileData = await RNFS.readFile(filePath, 'utf8');
        const newWords = JSON.parse(fileData);

        // Bảng ánh xạ từ loại từ tiếng Việt sang loại từ hợp lệ trong hệ thống
        const typeMapping = {
            "Danh từ": "Noun",
            "Đại từ": "Pronoun",
            "Động từ": "Verb",
            "Tính từ": "Adjective",
            "Trạng từ": "Adverb",
            "Giới từ": "Preposition",
            "Liên từ": "Conjunction",
            "Thán từ": "Interjection",
            "Từ hạn định": "Determiner",
            "Mạo từ": "Article"
        };

        // Kiểm tra xem dữ liệu JSON có đúng dạng mảng không
        if (!Array.isArray(newWords)) {
            console.error("❌ Lỗi: Dữ liệu JSON không hợp lệ (không phải mảng)");
            return 0;
        }

        // Đọc danh sách từ vựng hiện có
        let existingWords = await getVocabularyData();
        let wordsToAdd = [];

        newWords.forEach((wordData, index) => {
            if (!wordData || typeof wordData !== "object") {
                console.warn(`⚠️ Bỏ qua mục ${index + 1}: Không hợp lệ`, wordData);
                return;
            }

            const word = wordData["từ"] ? wordData["từ"].trim() : null;
            const meaning = wordData["nghĩa"] ? wordData["nghĩa"].trim() : null;
            let type = wordData["loại từ"] ? wordData["loại từ"].trim() : null;

            if (!word || !meaning) {
                console.warn(`⚠️ Bỏ qua mục ${index + 1}: Thiếu từ hoặc nghĩa`, wordData);
                return;
            }

            // Chuyển đổi loại từ từ tiếng Việt sang tiếng Anh
            if (typeMapping[type]) {
                type = typeMapping[type];
            } else {
                console.warn(`⚠️ Loại từ "${type}" không hợp lệ, tự động đặt thành 'Noun'.`);
                type = "Noun"; // Nếu không khớp với bảng mapping, mặc định là "Noun"
            }

            const isExist = existingWords.some(existingWord => 
                existingWord.word && existingWord.word.toLowerCase() === word.toLowerCase()
            );

            if (!isExist) {
                wordsToAdd.push({
                    word,
                    meaning: [meaning],
                    types: [type], // Đảm bảo 'types' là một mảng
                    synonyms: [],
                    antonyms: [],
                    note: "",
                    createdAt: new Date().toISOString(), // ✅ Thêm thuộc tính thời gian
                });
            }
        });

        if (wordsToAdd.length > 0) {
            existingWords = [...existingWords, ...wordsToAdd];
            await RNFS.writeFile(appFilePath, JSON.stringify(existingWords, null, 2), 'utf8');
            console.log(`✅ Đã thêm ${wordsToAdd.length} từ mới vào từ điển.`);
        } else {
            console.log("🔄 Không có từ mới nào được thêm vào, tất cả từ đã tồn tại hoặc dữ liệu không hợp lệ.");
        }

        return wordsToAdd.length;
    } catch (error) {
        console.error('❌ Lỗi nhập từ file JSON:', error);
        return 0;
    }
};


// Đọc dữ liệu từ file trong thư mục ứng dụng
export const getVocabularyFromFile = async () => {
    try {
        const fileExists = await RNFS.exists(appFilePath);
        if (!fileExists) {
            console.log('File does not exist, returning empty data.');
            return [];
        }

        const fileData = await RNFS.readFile(appFilePath, 'utf8');
        const vocabulary = JSON.parse(fileData);
        // console.log("list từ : ", vocabulary);
        return normalizeVocabulary(vocabulary);
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
};

// Đếm số lượng từ vựng trong file
export const getWordTypeCount = async () => {
    try {
        const vocabularyList = await getVocabularyFromFile();
        if (!vocabularyList.length) {
            console.log("Vocabulary list is empty.");
            return {};
        }

        const validTypes = ['Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection', 'Determiner', 'Article'];

        // Khởi tạo đối tượng đếm loại từ
        const wordTypeCount = validTypes.reduce((acc, type) => {
            acc[type] = 0;
            return acc;
        }, {});

        // Duyệt qua danh sách từ vựng và đếm loại từ
        vocabularyList.forEach((word) => {
            if (Array.isArray(word.types)) {
                word.types.forEach((type) => {
                    if (validTypes.includes(type)) {
                        wordTypeCount[type]++;
                    }
                });
            }
        });

        console.log("Word Type Count:", wordTypeCount);
        return wordTypeCount;
    } catch (error) {
        console.error("Error counting word types:", error);
        return {};
    }
};


export const getLength = async () => {
    try {
        const fileExists = await RNFS.exists(appFilePath);
        if (!fileExists) {
            console.log('File does not exist, returning empty data.');
            return 0;
        }

        const fileData = await RNFS.readFile(appFilePath, 'utf8');
        const vocabulary = JSON.parse(fileData);
        return vocabulary.length;
    } catch (error) {
        console.error('Error reading file:', error);
        return 0;
    }
};
// random N từ vựng từ file
export const getRandomVocabulary = async (n) => {
    try {
        const vocabulary = await getVocabularyList();
        if (!vocabulary || vocabulary.length === 0) {
            console.log('🔍 Danh sách từ vựng trống.');
            return [];
        }

        // Trộn danh sách ngẫu nhiên
        const shuffled = vocabulary.sort(() => 0.5 - Math.random());

        // Chọn `n` phần tử đầu tiên
        return shuffled.slice(0, n);
    } catch (error) {
        console.error('❌ Lỗi lấy từ vựng ngẫu nhiên:', error);
        return [];
    }
};

// Kiểm tra xem file có tồn tại không trong thư mục ứng dụng
export const isFileExists = async () => {
    try {
        const fileExists = await RNFS.exists(appFilePath);
        return fileExists;
    } catch (error) {
        console.error('Error checking if file exists:', error);
        return false;
    }
};

// Thêm một từ mới vào danh sách
export const addNewWord = async (newWord) => {
    try {
        const vocabulary = await getVocabularyFromFile();
        const exists = vocabulary.find(word => word.word === newWord.word);
        if (exists) {
            console.error('Word already exists in the vocabulary.');
            return false;
        }
        vocabulary.push(newWord);
        await saveVocabularyToFile(vocabulary);
        return true;
    } catch (error) {
        console.error('Error adding new word:', error);
        return false;
    }
};

// Xóa một từ khỏi danh sách
export const deleteWord = async (wordToDelete) => {
    try {
        const vocabulary = await getVocabularyFromFile();
        const updatedVocabulary = vocabulary.filter(word => word.word !== wordToDelete);
        await saveVocabularyToFile(updatedVocabulary);
        return true;
    } catch (error) {
        console.error('Error deleting word:', error);
        return false;
    }
};

// Sửa một từ trong danh sách
export const updateWord = async (updatedWord) => {
    try {
        const vocabulary = await getVocabularyFromFile();
        const index = vocabulary.findIndex(word => word.word === updatedWord.word);
        if (index === -1) {
            console.error('Word not found in the vocabulary.');
            return false;
        }
        vocabulary[index] = updatedWord;
        await saveVocabularyToFile(vocabulary);
        return true;
    } catch (error) {
        console.error('Error updating word:', error);
        return false;
    }
};

export const searchExactWord = async (wordToFind) => {
    try {
        const trimmedWordToFind = wordToFind.trim().toLowerCase(); // Loại bỏ khoảng trắng và chuyển về chữ thường
        const vocabulary = await getVocabularyFromFile();

        return (
            vocabulary.find(word => {
                const wordText = word.word ? word.word.trim().toLowerCase() : ""; // Chuyển về chữ thường và kiểm tra `word`
                const meanings = Array.isArray(word.meanings) ? word.meanings.map(meaning => meaning.trim().toLowerCase()) : []; // Chuẩn hóa `meanings` thành chữ thường

                // Kiểm tra chính xác trong `word` hoặc bất kỳ `meanings` nào
                return wordText === trimmedWordToFind || meanings.includes(trimmedWordToFind);
            }) || null
        );
    } catch (error) {
        console.error('Error searching exact word:', error);
        return null;
    }
};


export const searchSimilarWords = async (query) => {
    try {
        const trimmedQuery = query.trim().toLowerCase(); // Chuẩn hóa từ khóa tìm kiếm
        if (trimmedQuery === "") {
            return []; // Trả về danh sách rỗng nếu từ khóa rỗng
        }

        const result1 = [];
        const vocabulary = await getVocabularyFromFile();
        // Tìm kiếm theo nghĩa
        for (let i = 0; i < vocabulary.length; i++) {
            const word = vocabulary[i];
            const listMeaning = word.meaning;
            if (!listMeaning) {
                continue;
            }
            for (let j = 0; j < listMeaning.length; j++) {
                const meaning = listMeaning[j];
                if (meaning.trim().toLowerCase().includes(trimmedQuery)) {
                    result1.push(word);
                    break;
                }
            }
            
        }
        // Tìm kiếm theo từ
        const result2 = [];
        for (let i = 0; i < vocabulary.length; i++) {
            const word = vocabulary[i];
            if (word.word.trim().toLowerCase().includes(trimmedQuery)) {
                result2.push(word);
            }
        }
        // Kết hợp kết quả từ cả 2 tìm kiếm
        const result = [...new Set([...result1, ...result2])];

        return result;
    } catch (error) {
        console.error('Error searching similar words:', error);
        return [];
    }
};



// Thêm một từ đồng nghĩa
export const addSynonym = async (word, synonym) => {
    try {
        const vocabulary = await getVocabularyFromFile();
        const wordToUpdate = vocabulary.find(item => item.word === word);
        if (!wordToUpdate) {
            console.error('Word not found in the vocabulary.');
            return false;
        }
        wordToUpdate.synonyms.push(synonym);
        await saveVocabularyToFile(vocabulary);
        return true;
    } catch (error) {
        console.error('Error adding synonym:', error);
        return false;
    }
};

// Thêm một từ trái nghĩa
export const addAntonym = async (word, antonym) => {
    try {
        const vocabulary = await getVocabularyFromFile();
        const wordToUpdate = vocabulary.find(item => item.word === word);
        if (!wordToUpdate) {
            console.error('Word not found in the vocabulary.');
            return false;
        }
        wordToUpdate.antonyms.push(antonym);
        await saveVocabularyToFile(vocabulary);
        return true;
    } catch (error) {
        console.error('Error adding antonym:', error);
        return false;
    }
};

// Lấy danh sách từ vựng
export const getVocabularyList = async () => {
    try {
        return await getVocabularyFromFile();
    } catch (error) {
        console.error('Error fetching vocabulary list:', error);
        return [];
    }
};

// Xóa một từ đồng nghĩa trong danh sách
export const deleteSynonym = async (word, synonym) => {
    try {
        const vocabulary = await getVocabularyFromFile();
        const wordToUpdate = vocabulary.find(item => item.word === word);
        if (!wordToUpdate) {
            console.error('Word not found in the vocabulary.');
            return false;
        }
        wordToUpdate.synonyms = wordToUpdate.synonyms.filter(item => item !== synonym);
        await saveVocabularyToFile(vocabulary);
        return true;
    } catch (error) {
        console.error('Error deleting synonym:', error);
        return false;
    }
};

// Xóa một từ trái nghĩa trong danh sách
export const deleteAntonym = async (word, antonym) => {
    try {
        const vocabulary = await getVocabularyFromFile();
        const wordToUpdate = vocabulary.find(item => item.word === word);
        if (!wordToUpdate) {
            console.error('Word not found in the vocabulary.');
            return false;
        }
        wordToUpdate.antonyms = wordToUpdate.antonyms.filter(item => item !== antonym);
        await saveVocabularyToFile(vocabulary);
        return true;
    } catch (error) {
        console.error('Error deleting antonym:', error);
        return false;
    }
};


//DT--- Thêm hoặc cập nhật từ đồng nghĩa mới
export const addOrUpdateSynonym = async (word, synonym) => {
    try {
        const vocabulary = await getVocabularyFromFile();


        // Tìm từ chính
        const wordToUpdate = vocabulary.find(
            item => item.word.trim().toLowerCase() === word.trim().toLowerCase()
        );

        if (!wordToUpdate) {
            console.error('Word not found in the vocabulary.');
            return false;
        }

        // Tìm từ đồng nghĩa
        const synonymToUpdate = vocabulary.find(
            item => item.word.trim().toLowerCase() === synonym.trim().toLowerCase()
        );

        if (synonymToUpdate) {
            // Nếu từ đồng nghĩa đã tồn tại, cập nhật danh sách từ đồng nghĩa
            if (!synonymToUpdate.synonyms.includes(word)) {
                synonymToUpdate.synonyms.push(word);
            }
        } else {
            // Nếu từ đồng nghĩa chưa tồn tại, tạo mới
            const newWord = {
                word: synonym.trim(),
                synonyms: [word.trim()],
                antonyms: [],
                type: null,
                meaning: null,
                note: null,
            };
            vocabulary.push(newWord);
        }

        // Cập nhật từ chính
        if (!wordToUpdate.synonyms.includes(synonym.trim())) {
            wordToUpdate.synonyms.push(synonym.trim());
        }

        await saveVocabularyToFile(vocabulary);

        return true;
    } catch (error) {
        console.error('Error adding or updating synonym:', error);
        return false;
    }
};

// DT--- Thêm hoặc cập nhật từ trái nghĩa mới
export const addOrUpdateAntonym = async (word, antonym) => {
    try {
        const vocabulary = await getVocabularyFromFile();

        // Kiểm tra từ chính
        const wordToUpdate = vocabulary.find(
            item => item.word.trim().toLowerCase() === word.trim().toLowerCase()
        );

        if (!wordToUpdate) {
            console.error('Word not found in the vocabulary.');
            return false;
        }

        // Kiểm tra từ trái nghĩa đã tồn tại chưa
        const antonymToUpdate = vocabulary.find(item => item.word === antonym);

        if (antonymToUpdate) {
            // Nếu từ trái nghĩa đã tồn tại, cập nhật danh sách từ trái nghĩa
            if (!antonymToUpdate.antonyms.includes(word)) {
                antonymToUpdate.antonyms.push(word);
            }
        } else {
            // Nếu từ trái nghĩa chưa tồn tại, tạo mới
            const newWord = {
                word: antonym,
                synonyms: [],
                antonyms: [word],
                type: null,
                meaning: null,
                note: null,
            };
            vocabulary.push(newWord);
        }

        // Cập nhật từ chính
        if (!wordToUpdate.antonyms.includes(antonym)) {
            wordToUpdate.antonyms.push(antonym);
        }

        await saveVocabularyToFile(vocabulary);
        return true;
    } catch (error) {
        console.error('Error adding or updating antonym:', error);
        return false;
    }
};

// DT--- cập nhật từ vựng 4 trường dữ liệu đầu
export const editVocabulary = async (originalWord, updatedData) => {
    try {
        const vocabulary = await getVocabularyFromFile();

        // Tìm từ cần sửa
        const wordToEdit = vocabulary.find(
            item => item.word.trim().toLowerCase() === originalWord.trim().toLowerCase()
        );

        if (!wordToEdit) {
            console.error('Word not found in the vocabulary.');
            return false;
        }

        // Cập nhật dữ liệu
        if (updatedData.word) wordToEdit.word = updatedData.word.trim();
        if (updatedData.meaning) wordToEdit.meaning = updatedData.meaning.trim();
        if (updatedData.type) wordToEdit.type = updatedData.type.trim();
        if (updatedData.note) wordToEdit.note = updatedData.note.trim();

        // Lưu thay đổi
        await saveVocabularyToFile(vocabulary);
        return true;
    } catch (error) {
        console.error('Error editing vocabulary:', error);
        return false;
    }
};

// Tìm để lm question
export const getUnrelatedWords = async (wordToCheck, count = 3) => {
    try {
        const vocabulary = await getVocabularyFromFile();

        // Tìm từ kiểm tra
        const targetWord = vocabulary.find(
            (item) => item.word.trim().toLowerCase() === wordToCheck.trim().toLowerCase()
        );

        if (!targetWord) {
            console.error('Word to check not found in vocabulary.');
            return [];
        }

        // Lọc từ không liên quan
        const unrelatedWords = vocabulary.filter((item) => {
            const isSynonym = targetWord.synonyms?.includes(item.word);
            const isAntonym = targetWord.antonyms?.includes(item.word);
            return item.word !== targetWord.word && !isSynonym && !isAntonym;
        });

        // Trộn ngẫu nhiên và lấy số lượng cần thiết
        return unrelatedWords.sort(() => 0.5 - Math.random()).slice(0, count);
    } catch (error) {
        console.error('Error fetching unrelated words:', error);
        return [];
    }
};


/**
 * Nhập từ vựng từ file JSON
 * @param {string} filePath - Đường dẫn file JSON chứa danh sách từ vựng
 */
export const importWordsFromJson = async (filePath) => {
    try {
        // Đọc nội dung file JSON
        const fileData = await RNFS.readFile(filePath, 'utf8');
        const newWords = JSON.parse(fileData);

        // Đọc từ vựng hiện có
        let existingWords = await getVocabularyFromFile();

        // Tạo danh sách mới, chỉ thêm từ chưa có
        let wordsToAdd = [];
        newWords.forEach((wordData) => {
            const word = wordData["từ"]; // Sử dụng cú pháp truy cập thuộc tính bằng dấu ngoặc vuông
            const meaning = wordData["nghĩa"];
            const type = wordData["loại từ"];

            if (!word) {
                console.warn("⚠️ Bỏ qua một mục không có từ hợp lệ:", wordData);
                return;
            }

            const isExist = existingWords.some(existingWord => existingWord.word.toLowerCase() === word.toLowerCase());

            if (!isExist) {
                wordsToAdd.push({
                    word: word,
                    meaning: [meaning],
                    type: type || "Unknown",
                    synonyms: [],
                    antonyms: [],
                    note: "",
                });
            }
        });

        if (wordsToAdd.length > 0) {
            existingWords = [...existingWords, ...wordsToAdd];
            await saveVocabularyToFile(existingWords);
            console.log(`✅ Đã thêm ${wordsToAdd.length} từ mới vào danh sách từ vựng.`);
        } else {
            console.log("🔄 Không có từ mới nào được thêm vào, tất cả từ đã tồn tại.");
        }

        return wordsToAdd.length;
    } catch (error) {
        console.error('❌ Lỗi nhập từ file JSON:', error);
        return 0;
    }
};

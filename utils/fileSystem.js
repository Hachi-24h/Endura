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
// Lưu dữ liệu vào file trong thư mục ứng dụng
export const saveVocabularyToFile = async (data) => {
    try {
        await RNFS.writeFile(appFilePath, JSON.stringify(data), 'utf8');
        console.log(`File saved successfully to application directory: ${appFilePath}`);
    } catch (error) {
        console.error('Error writing file:', error);
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
        return normalizeVocabulary(vocabulary); // Chuẩn hóa dữ liệu
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
};

// random N từ vựng từ file
export const getRandomVocabulary = async (n) => {
    try {
        // Lấy danh sách từ vựng từ file
        const vocabulary = await getVocabularyFromFile();

        if (!vocabulary || vocabulary.length === 0) {
            console.log('Vocabulary list is empty.');
            return [];
        }

        // Shuffle danh sách từ vựng
        const shuffled = vocabulary.sort(() => 0.5 - Math.random());

        // Lấy `n` phần tử đầu tiên
        const randomWords = shuffled.slice(0, n);

        return randomWords;
    } catch (error) {
        console.error('Error getting random vocabulary:', error);
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

// Tìm kiếm chính xác (trả về đúng 1 từ)
export const searchExactWord = async (wordToFind) => {
    try {
        const vocabulary = await getVocabularyFromFile();
        return (
            vocabulary.find(word => word.word.trim().toLowerCase() === wordToFind.trim().toLowerCase()) || null
        );
    } catch (error) {
        console.error('Error searching exact word:', error);
        return null;
    }
};


// Tìm kiếm tương đối (trả về danh sách các từ liên quan)
export const searchSimilarWords = async (query) => {
    try {
        const trimmedQuery = query.trim().toLowerCase(); // Loại bỏ khoảng trắng và chuyển về chữ thường
        if (trimmedQuery === "") {
            return []; // Trả về danh sách rỗng nếu query rỗng
        }

        const vocabulary = await getVocabularyFromFile();

        // Kiểm tra từng phần tử trong vocabulary để tránh lỗi
        return vocabulary.filter(word => {
            const wordText = word.word ? word.word.toLowerCase() : ""; // Nếu word.word không tồn tại, dùng chuỗi rỗng
            const meaningText = word.meaning ? word.meaning.toLowerCase() : ""; // Nếu word.meaning không tồn tại, dùng chuỗi rỗng

            return wordText.includes(trimmedQuery) || meaningText.includes(trimmedQuery);
        });
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

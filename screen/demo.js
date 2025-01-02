// File: HomePage.js
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    TextInput,
    Button,
    FlatList,
    Text,
    StyleSheet,
    View,
    Alert,
} from 'react-native';
import { isFileExists, saveVocabularyToFile, getVocabularyFromFile } from '../utils/fileSystem'; // Đảm bảo sử dụng react-native-fs
import Vocabulary from '../model/VocabularyModel';  // Import model từ vựng

const HomePage = () => {
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [note, setNote] = useState('');
    const [type, setType] = useState('');
    const [synonymsList, setSynonymsList] = useState('');
    const [antonymsList, setAntonymsList] = useState('');
    const [vocabularyList, setVocabularyList] = useState([]);

    // Load dữ liệu khi ứng dụng khởi động
    useEffect(() => {
        const loadVocabulary = async () => {
            const exists = await isFileExists(); // Kiểm tra xem file có tồn tại không
            if (exists) {
                const data = await getVocabularyFromFile(); // Đọc dữ liệu từ file
                setVocabularyList(data);  // Lưu dữ liệu vào state
            }
        };
        loadVocabulary();
    }, []);

    // Thêm từ vựng mới
    const addVocabulary = async () => {
        if (!word.trim().match(/^[a-zA-Z]+( [a-zA-Z]+)*$/)) {
            Alert.alert('Error', 'Word must only contain letters and spaces in between, but cannot have spaces at the beginning or end!');
            return;
        }

        if (!meaning.trim()) {
            Alert.alert('Error', 'Meaning cannot be empty!');
            return;
        }

        if (!['Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection', 'Determiner', 'Article'].includes(type)) {
            Alert.alert('Error', 'Invalid type!');
            return;
        }

        // Tạo đối tượng từ vựng mới từ model
        const newVocabulary = new Vocabulary(
            word.trim(),
            meaning.trim(),
            note.trim(),
            type,
            synonymsList.split(',').map((synonym) => synonym.trim()),
            antonymsList.split(',').map((antonym) => antonym.trim())
        );

        // Cập nhật danh sách từ vựng
        const updatedList = [...vocabularyList, newVocabulary];
        setVocabularyList(updatedList);  // Cập nhật lại state

        // Lưu vào file
        await saveVocabularyToFile(updatedList);

        // Reset form
        setWord('');
        setMeaning('');
        setNote('');
        setType('');
        setSynonymsList('');
        setAntonymsList('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Word (Only letters)"
                    value={word}
                    onChangeText={setWord}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Meaning (Vietnamese)"
                    value={meaning}
                    onChangeText={setMeaning}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Note (Optional)"
                    value={note}
                    onChangeText={setNote}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Type (e.g., Noun, Verb)"
                    value={type}
                    onChangeText={setType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Synonyms (comma-separated)"
                    value={synonymsList}
                    onChangeText={setSynonymsList}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Antonyms (comma-separated)"
                    value={antonymsList}
                    onChangeText={setAntonymsList}
                />
                <Button title="Add Vocabulary" onPress={addVocabulary} />
            </View>
            <Text style={styles.header}>Vocabulary List</Text>
            <FlatList
                data={vocabularyList}
                keyExtractor={(item) => item.word}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.word}>{item.word}</Text>
                        <Text style={styles.meaning}>{item.meaning}</Text>
                        <Text>Type: {item.type}</Text>
                        {item.note && <Text>Note: {item.note}</Text>}
                        {item.synonyms.length > 0 && (
                            <Text>Synonyms: {item.synonyms.join(', ')}</Text>
                        )}
                        {item.antonyms.length > 0 && (
                            <Text>Antonyms: {item.antonyms.join(', ')}</Text>
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        marginVertical: 5,
        borderRadius: 5,
    },
    word: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    meaning: {
        fontSize: 16,
    },
});

export default HomePage;

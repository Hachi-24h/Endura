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
    KeyboardAvoidingView, TouchableOpacity
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox"; // Thư viện hỗ trợ checkbox
import { isFileExists, saveVocabularyToFile, getVocabularyFromFile } from '../utils/fileSystem'; // Đảm bảo sử dụng react-native-fs
import Vocabulary from '../model/VocabularyModel';  // Import model từ vựng
import { Back, BluetoothRectangle, CloudNotif } from 'iconsax-react-native';
import { updateUserSettings } from '../utils/userSettings';
const HomePage = ({ navigation }) => {
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [note, setNote] = useState('');
    const [types, setTypes] = useState([]); // Chuyển từ type thành types (danh sách)
    const [synonymsList, setSynonymsList] = useState('');
    const [antonymsList, setAntonymsList] = useState('');
    const [vocabularyList, setVocabularyList] = useState([]);

    const validTypes = [
        'Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection', 'Determiner', 'Article'
    ];

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

    const toggleType = (type) => {
        setTypes((prevTypes) => {
            if (prevTypes.includes(type)) {
                return prevTypes.filter((t) => t !== type);
            } else {
                return [...prevTypes, type];
            }
        });
    };

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

        if (types.length === 0) {
            Alert.alert('Error', 'You must select at least one type!');
            return;
        }

        // Lọc danh sách để loại bỏ chuỗi rỗng hoặc chỉ chứa khoảng trắng
        const filteredSynonyms = synonymsList
            ? synonymsList
                .split(',')
                .map((synonym) => synonym.trim())
                .filter((synonym) => synonym.length > 0)
            : [];

        const filteredAntonyms = antonymsList
            ? antonymsList
                .split(',')
                .map((antonym) => antonym.trim())
                .filter((antonym) => antonym.length > 0)
            : [];
        const ListMeaning = meaning.trim().split(',').map((meaning) => meaning.trim());
        // Tạo đối tượng từ vựng mới từ model
        const newVocabulary = new Vocabulary(
            word.trim(),
            ListMeaning,
            note.trim(),
            types,
            filteredSynonyms,
            filteredAntonyms
        );

        // Cập nhật danh sách từ vựng
        const updatedList = [...vocabularyList, newVocabulary];
        setVocabularyList(updatedList); // Cập nhật lại state

        // Lưu vào file
        await saveVocabularyToFile(updatedList);

        // Reset form
        setWord('');
        setMeaning('');
        setNote('');
        setTypes([]);
        setSynonymsList('');
        setAntonymsList('');
    };
    const handlePress = async () => {
        try {
            // Cập nhật trạng thái hasLoggedInBefore thành false
            await updateUserSettings({ hasLoggedInBefore: false });
    
            console.log("First login state reset successfully.");
    
            // Chuyển hướng hoặc tải lại màn hình
            navigation.replace('Detail'); // Thay 'Detail' bằng tên màn hình bạn muốn
        } catch (error) {
            console.error("Error resetting first login state:", error);
            Alert.alert("Error", "An error occurred while resetting the state.");
        }
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Detail')} >
                        <CloudNotif size={30} color="#6c63ff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePress} style={styles.button}>
                        <BluetoothRectangle size={30} color="#6c63ff" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    ListHeaderComponent={(
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
                            <FlatList
                                data={validTypes}
                                keyExtractor={(item) => item}
                                numColumns={2}
                                columnWrapperStyle={styles.checkboxRow}
                                renderItem={({ item }) => (
                                    <View style={styles.checkboxColumn}>
                                        <BouncyCheckbox
                                            size={25}
                                            fillColor="#6c63ff"
                                            unfillColor="#FFFFFF"
                                            text={item}
                                            iconStyle={{ borderColor: "#6c63ff" }}
                                            innerIconStyle={{ borderWidth: 2 }}
                                            textStyle={{ textDecorationLine: "none" }}
                                            onPress={() => toggleType(item)}
                                            isChecked={types.includes(item)}
                                        />
                                    </View>
                                )}
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
                    )}
                    data={vocabularyList}
                    keyExtractor={(item) => item.word}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.word}>{item.word}</Text>
                            <Text style={styles.meaning}>{item.meaning}</Text>
                            <Text>Types: {item.types?.join(', ') || 'None'}</Text>
                            {item.note && <Text>Note: {item.note}</Text>}
                            {item.synonyms?.length > 0 ? (
                                <Text>Synonyms: {item.synonyms.join(', ')}</Text>
                            ) : (
                                <Text>Synonyms: None</Text>
                            )}
                            {item.antonyms?.length > 0 ? (
                                <Text>Antonyms: {item.antonyms.join(', ')}</Text>
                            ) : (
                                <Text>Antonyms: None</Text>
                            )}
                        </View>
                    )}
                />
            </KeyboardAvoidingView>
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
    checkboxContainer: {
        marginBottom: 20,
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
    checkboxRow: {
        flexDirection: 'row', // Hàng ngang
        justifyContent: 'space-between', // Cách đều các cột trong hàng
        marginBottom: 10, // Khoảng cách giữa các hàng
    },
    checkboxColumn: {
        flex: 1, // Đảm bảo mỗi cột chiếm đều không gian
        marginHorizontal: 5, // Khoảng cách giữa các cột
    },
});

export default HomePage;

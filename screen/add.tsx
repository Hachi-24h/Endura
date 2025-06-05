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
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { isFileExists, saveVocabularyToFile, getVocabularyFromFile } from '../utils/fileSystem';
import Vocabulary from '../model/VocabularyModel';
import { Back, BluetoothRectangle, CloudNotif } from 'iconsax-react-native';
import { updateUserSettings } from '../utils/userSettings';

type Props = {
    navigation: any; // 👈 Có thể thay bằng `NativeStackNavigationProp<...>` nếu bạn dùng react-navigation v6
};

type VocabularyItem = InstanceType<typeof Vocabulary>;

const HomePage: React.FC<Props> = ({ navigation }) => {
    const [word, setWord] = useState<string>('');
    const [meaning, setMeaning] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [types, setTypes] = useState<string[]>([]);
    const [synonymsList, setSynonymsList] = useState<string>('');
    const [antonymsList, setAntonymsList] = useState<string>('');
    const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>([]);

    const validTypes: string[] = [
        'Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb',
        'Preposition', 'Conjunction', 'Interjection',
        'Determiner', 'Article'
    ];

    useEffect(() => {
        const loadVocabulary = async () => {
            const exists = await isFileExists();
            if (exists) {
                const data = await getVocabularyFromFile();
                setVocabularyList(data);
            }
        };
        loadVocabulary();
    }, []);

    const toggleType = (type: string) => {
        setTypes((prevTypes) =>
            prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type)
                : [...prevTypes, type]
        );
    };

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

        const filteredSynonyms = synonymsList
            ? synonymsList.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const filteredAntonyms = antonymsList
            ? antonymsList.split(',').map(a => a.trim()).filter(Boolean)
            : [];

        const listMeaning = meaning.trim().split(',').map(m => m.trim());

        const newVocabulary = new Vocabulary(
            word.trim(),
            listMeaning,
            note.trim(),
            types,
            filteredSynonyms,
            filteredAntonyms
        );

        const updatedList = [...vocabularyList, newVocabulary];
        setVocabularyList(updatedList);
        await saveVocabularyToFile(updatedList);

        setWord('');
        setMeaning('');
        setNote('');
        setTypes([]);
        setSynonymsList('');
        setAntonymsList('');
    };

    const handlePress = async () => {
        try {
            await updateUserSettings({ hasLoggedInBefore: false });
            navigation.replace('Detail');
        } catch (error) {
            console.error("Error resetting login state:", error);
            Alert.alert("Error", "An error occurred while resetting the state.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Detail')}>
                        <CloudNotif size={30} color="#6c63ff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePress} style={styles.button}>
                        <BluetoothRectangle size={30} color="#6c63ff" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    ListHeaderComponent={
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
                                            unFillColor="#FFFFFF"
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
                    }
                    data={vocabularyList}
                    keyExtractor={(item) => item.word}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.word}>{item.word}</Text>
                            <Text style={styles.meaning}>{Array.isArray(item.meaning) ? item.meaning.join(', ') : item.meaning}</Text>
                            <Text>Types: {item.types?.join(', ') || 'None'}</Text>
                            {item.note && <Text>Note: {item.note}</Text>}
                            <Text>Synonyms: {item.synonyms?.join(', ') || 'None'}</Text>
                            <Text>Antonyms: {item.antonyms?.join(', ') || 'None'}</Text>
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
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    checkboxColumn: {
        flex: 1,
        marginHorizontal: 5,
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
    button: {
        padding: 10,
    },
});

export default HomePage;

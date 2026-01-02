import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    TextInput,
    Text,
    StyleSheet,
    View,
    Alert,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
    ScrollView,
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { isFileExists, saveVocabularyToFile, getVocabularyFromFile } from '../../utils/fileSystem';
import { CloudNotif, BluetoothRectangle } from 'iconsax-react-native';
import { updateUserSettings } from '../../utils/userSettings';
import color from '../../Custom/Color';
import styles from '../../Css/addVocabulary';
import Footer from '../footer';
// Define the Vocabulary type
interface Vocabulary {
    word: string;
    meaning: string[];
    note?: string;
    types?: string[];
    synonyms?: string[];
    antonyms?: string[];
    createdAt?: string;
}

const HomePage: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [word, setWord] = useState<string>('');
    const [meaning, setMeaning] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [types, setTypes] = useState<string[]>([]);
    const [synonymsList, setSynonymsList] = useState<string>('');
    const [antonymsList, setAntonymsList] = useState<string>('');
    const [vocabularyList, setVocabularyList] = useState<Vocabulary[]>([]);

    const validTypes: string[] = [
        'Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb',
        'Preposition', 'Conjunction', 'Interjection', 'Determiner', 'Article'
    ];

    useEffect(() => {
        const loadVocabulary = async () => {
            const exists = await isFileExists();
            if (exists) {
                const data: Vocabulary[] = await getVocabularyFromFile();
                const sorted = data
                    .filter(item => item.createdAt)
                    .sort((a, b) => new Date(b.createdAt!) - new Date(a.createdAt!));
                setVocabularyList(sorted.slice(0, 10));
            }
        };
        loadVocabulary();
    }, []);

    const toggleType = (type: string) => {
        setTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const addVocabulary = async () => {
        if (!word.trim().match(/^[a-zA-Z]+( [a-zA-Z]+)*$/)) {
            Alert.alert('Lỗi', 'Chỉ được nhập chữ cái và dấu cách hợp lệ.');
            return;
        }
        if (!meaning.trim()) {
            Alert.alert('Lỗi', 'Không được để trống nghĩa.');
            return;
        }
        if (types.length === 0) {
            Alert.alert('Lỗi', 'Hãy chọn ít nhất một loại từ.');
            return;
        }

        const newVocabulary: Vocabulary = {
            word: word.trim(),
            meaning: meaning.trim().split(',').map(m => m.trim()),
            note: note.trim(),
            types,
            synonyms: synonymsList ? synonymsList.split(',').map(s => s.trim()) : [],
            antonyms: antonymsList ? antonymsList.split(',').map(a => a.trim()) : [],
            createdAt: new Date().toISOString()
        };

        const updatedList = [newVocabulary, ...vocabularyList];
        setVocabularyList(updatedList.slice(0, 10));
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
            Alert.alert("Lỗi", "Không thể reset trạng thái.");
        }
    };

    const isToday = (dateString?: string) => {
        if (!dateString) return false;
        const today = new Date();
        const target = new Date(dateString);
        return today.toDateString() === target.toDateString();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Detail')}>
                        <CloudNotif size={28} color={color.blue} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePress}>
                        <BluetoothRectangle size={28} color={color.blue} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.form}>
                    <Text style={styles.title}>Thêm Từ Vựng Mới</Text>

                    <TextInput style={styles.input} placeholder="Từ tiếng Anh" value={word} onChangeText={setWord} />
                    <TextInput style={styles.input} placeholder="Nghĩa tiếng Việt (phân tách bằng dấu ,)" value={meaning} onChangeText={setMeaning} />
                    <TextInput style={styles.input} placeholder="Ghi chú (nếu có)" value={note} onChangeText={setNote} />

                    <Text style={styles.subTitle}>Loại từ</Text>
                    <View style={styles.checkboxWrap}>
                        {validTypes.map((item) => (
                            <BouncyCheckbox
                                key={item}
                                size={20}
                                fillColor={color.blue}
                                unFillColor={color.white}
                                text={item}
                                iconStyle={{ borderColor: color.blue }}
                                textStyle={{ textDecorationLine: "none" }}
                                innerIconStyle={{ borderWidth: 2 }}
                                onPress={() => toggleType(item)}
                                isChecked={types.includes(item)}
                                style={styles.checkboxItem}
                            />
                        ))}
                    </View>

                    <TextInput style={styles.input} placeholder="Từ đồng nghĩa (cách nhau bằng dấu ,)" value={synonymsList} onChangeText={setSynonymsList} />
                    <TextInput style={styles.input} placeholder="Từ trái nghĩa (cách nhau bằng dấu ,)" value={antonymsList} onChangeText={setAntonymsList} />

                    <TouchableOpacity style={styles.addButton} onPress={addVocabulary}>
                        <Text style={styles.addButtonText}>➕ Thêm Từ Vựng</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>📘 Từ Vựng Mới Thêm</Text>
                    {vocabularyList.map((item, index) => (
                        <View key={index} style={styles.vocabCard}>
                            <Text style={styles.word}>{item.word}</Text>
                            {/* <Text style={styles.meaning}>{item.meaning.join(', ')}</Text> */}
                            <Text style={styles.meaning}>Nghĩa: {item.meaning}</Text>
                            <Text style={styles.meta}>Loại: {item.types?.join(', ')}</Text>
                            {item.note && <Text style={styles.meta}>Ghi chú: {item.note}</Text>}
                            <Text style={styles.meta}>Đồng nghĩa: {item.synonyms?.join(', ') || 'Không có'}</Text>
                            <Text style={styles.meta}>Trái nghĩa: {item.antonyms?.join(', ') || 'Không có'}</Text>
                            {isToday(item.createdAt) && <Text style={styles.newBadge}>🔥 Mới hôm nay</Text>}
                        </View>
                    ))}
                </ScrollView>
            </KeyboardAvoidingView>
            <Footer navigation={navigation} />
        </SafeAreaView>
    );
};


export default HomePage;

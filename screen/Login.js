import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, ImageBackground , TouchableOpacity} from 'react-native';
import { getVocabularyFromFile, isFileExists } from '../utils/fileSystem';
import TooltipComponent from '../Custom/TooltipComponent'; // Import TooltipComponent
import styles from '../Css/Login';

const Login = ({ navigation }) => {
    const [randomWord, setRandomWord] = useState(null); // Lưu đối tượng từ vựng
    const [userInput, setUserInput] = useState(''); // Dữ liệu người dùng nhập
    const [error, setError] = useState('');
    const [vocabularyInput, setVocabularyInput] = useState(" ");
    const [inputBorderColor, setInputBorderColor] = useState('black'); // Màu viền của TextInput
    const length = randomWord ? randomWord.word.length : 0;
    const meaning = randomWord ? randomWord.meaning : '';

    useEffect(() => {
        const fetchRandomWord = async () => {
            try {
                setError(''); // Reset lỗi

                const fileExists = await isFileExists();
                if (!fileExists) {
                    setError('Không tìm thấy file từ vựng trong thư mục ứng dụng.');
                    return;
                }

                const vocabulary = await getVocabularyFromFile();
                if (!vocabulary || vocabulary.length === 0) {
                    setError('File từ vựng trống.');
                    return;
                }

                const randomIndex = Math.floor(Math.random() * vocabulary.length);
                const word = vocabulary[randomIndex];
                setRandomWord(word);

            } catch (err) {
                console.error('Lỗi khi lấy từ ngẫu nhiên:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu từ vựng.');
            }
        };

        fetchRandomWord();
    }, []);

    const createPlaceholderString = (word) => {
        if (!word || word.trim() === '') return '';

        const trimmedWord = word.trim();
        const wordArray = trimmedWord.split('');
        const length = trimmedWord.replace(/\s/g, '').length;

        let hints = 0;
        if (length >= 6) hints = 1;
        if (length >= 8) hints = 2;
        if (length > 10) hints = 3;
        if (length > 12) hints = 4;

        const placeholderArray = wordArray.map((char) => (char === ' ' ? ' ' : '_'));

        const hintIndices = [];
        while (hintIndices.length < hints) {
            const randomIndex = Math.floor(Math.random() * wordArray.length);
            if (
                placeholderArray[randomIndex] === '_' &&
                !hintIndices.includes(randomIndex)
            ) {
                placeholderArray[randomIndex] = wordArray[randomIndex];
                hintIndices.push(randomIndex);
            }
        }

        return placeholderArray.join(' ');
    };

    useEffect(() => {
        setVocabularyInput(createPlaceholderString(randomWord ? randomWord.word : ''));
    }, [randomWord]);

    const handleInputChange = (input) => {
        setUserInput(input);
        setError(''); // Xóa thông báo lỗi
        setInputBorderColor('black'); // Đặt lại viền màu đen
    };

    const handleSubmit = () => {
        if (userInput.trim().toLowerCase() === randomWord.word.trim().toLowerCase()) {
            navigation.navigate('Demo');
        } else {
            setError('Sai rồi');
            setInputBorderColor('red'); // Đổi viền màu đỏ khi sai
        }
    };

    return (
        <ImageBackground
            source={require('../Picture/background.jpg')}
            style={styles.backgroundImage}
            imageStyle={{ resizeMode: 'cover' }}
        >
            <View style={styles.container}>
                <View style={styles.overlay} />
                <View style={styles.logoContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../Picture/logo.png')} style={styles.logo} />
                        <Text style={styles.title}>Hachi</Text>
                    </View>
                    <View>
                        <Text style={styles.slogan}>Success or failure starts with your effort today</Text>
                    </View>
                </View>

                <View style={styles.wordContainer}>
                    <Text style={styles.meaningText}>{meaning}</Text>
                    <Text style={styles.hintText}>{vocabularyInput}</Text>
                  
                    <TextInput
                        style={[styles.input, { borderColor: inputBorderColor, borderWidth: 2 }]} // Áp dụng màu viền
                        placeholder="Nhập từ"
                        placeholderTextColor="#aaa"
                        value={userInput}
                        onChangeText={handleInputChange}
                        maxLength={length}
                        textAlign="center"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                    />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity  onPress={handleSubmit} style={styles.buttonContinue}> 
                        <Text style={styles.textContinue}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default Login;

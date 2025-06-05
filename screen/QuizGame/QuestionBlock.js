import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AnswerOptions from './AnswerOptions';
import InputAnswerBox from './InputAnswerBox';
import ResultFeedback from './ResultFeedback';
import { generateHint } from './hintHelper'; // ✅ Hàm tạo gợi ý
import color from '../../Custom/Color';
const { width, height } = Dimensions.get('window'); // Lấy kích thước

const QuestionBlock = ({ data, onAnswer, showNext, onNext }) => {
    const [selected, setSelected] = useState('');
    const [inputText, setInputText] = useState('');
    const [status, setStatus] = useState(true);
    // ✅ Khởi tạo hint chỉ 1 lần duy nhất cho câu hiện tại
    const hint = useMemo(() => generateHint(data.correct), [data.correct]);

    const checkAnswer = (ans) => {
        const isCorrect =
            ans.trim().toLowerCase() === data.correct.trim().toLowerCase();
        setSelected(ans);
        onAnswer(isCorrect, data.type);
    };

    useEffect(() => {
        if (showNext) {
            setStatus(false);
        }
    }
        , [showNext]);
    useEffect(() => {
        setInputText(''); // reset mỗi khi sang câu mới
    }, [hint]);
    return (
        <View styles={styles.container}>
            <Text style={styles.prompt}>{data.prompt}</Text>

            {data.type === 'fill' ? (
                <>
                    <InputAnswerBox
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmit={() => checkAnswer(inputText)}
                        disabled={showNext}
                        correctWord={data.correct}
                        hint={hint} // ✅ Truyền hint xuống
                    />

                    {showNext && (
                        <ResultFeedback
                            isCorrect={
                                selected.trim().toLowerCase() === data.correct.trim().toLowerCase()
                            }
                            correctAnswer={data.correct}
                        />
                    )}
                </>
            ) : (
                <AnswerOptions
                    options={data.choices}
                    correct={data.correct}
                    selected={selected}
                    onSelect={checkAnswer}
                    showResult={showNext}
                />
            )}

            {/* {showNext && ( */}
            <TouchableOpacity
                style={[
                    styles.button,
                    showNext ? { backgroundColor: color.lightRed } : { backgroundColor: color.gray }

                ]}
                disabled={status}
                onPress={showNext ? onNext : null}

            >
                <Text style={styles.buttonText}>Câu tiếp theo</Text>
            </TouchableOpacity>
            {/* )}  */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: color.orange,
        borderRadius: 10,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    prompt: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    button: {

        position: 'absolute',
        marginTop: "97%",
        color: '#fff',
        width: '90%',
        padding: 15,

        borderRadius: width * 0.05,
        alignSelf: 'center',

    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 20,
    },
});

export default QuestionBlock;

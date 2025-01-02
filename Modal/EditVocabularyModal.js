import React, { useState, useEffect, useRef } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,

} from "react-native";
import { editVocabulary } from "../utils/fileSystem";
import color from "../Custom/Color";
import { AddSquare, Edit, CloseSquare, PenClose } from "iconsax-react-native";
const { width, height } = Dimensions.get("window");
import CheckBox from '@react-native-community/checkbox';

const EditVocabularyModal = ({ visible, onClose, vocabulary, onUpdated }) => {
    const [word, setWord] = useState(vocabulary.word);
    const [meaning, setMeaning] = useState(vocabulary.meaning);
    const [type, setType] = useState(vocabulary.type || []); // Lưu loại từ là mảng
    const [note, setNote] = useState(vocabulary.note);
    const wordRef = useRef(null);
    const meaningRef = useRef(null);
    const typeRef = useRef(null);
    const noteRef = useRef(null);

    const availableTypes = [
        "Noun",
        "Pronoun",
        "Verb",
        "Adjective",
        "Adverb",
        "Preposition",
        "Conjunction",
        "Interjection",
        "Determiner",
        "Article"
    ];

    const handleKeyPress = (nextFieldRef) => {
        nextFieldRef.current.focus();
    };

    useEffect(() => {
        if (vocabulary) {
            setWord(vocabulary.word || "");
            setMeaning(vocabulary.meaning || "");
            setType(vocabulary.type || []);
            setNote(vocabulary.note || "");
        }
    }, [vocabulary]);

    const handleSave = async () => {
        const updatedData = { word, meaning, type, note };
        const success = await editVocabulary(vocabulary.word, updatedData);
        if (success) {
            onUpdated();
            onClose();
        } else {
            alert("Chỉnh sửa thất bại. Vui lòng thử lại.");
        }
    };

    // Hàm để chọn hoặc bỏ chọn loại từ
    const toggleTypeSelection = (type) => {
        setType(prevState =>
            prevState.includes(type)
                ? prevState.filter(item => item !== type)
                : [...prevState, type]
        );
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss(); // Ẩn bàn phím khi nhấn ra ngoài modal
            }}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, styles.shadowEffect]}>
                        <View style={styles.title}>
                            <TouchableOpacity onPress={onClose} >
                                <CloseSquare size={30} color={color.red} />
                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>Chỉnh sửa từ vựng</Text>
                        </View>

                        <View style={styles.rowDetail}>
                            <Text style={styles.label}>Từ Vựng</Text>
                            <TextInput
                                ref={wordRef}
                                style={[styles.detailInput, { color: color.lightRed }]}
                                value={word}
                                onChangeText={setWord}
                                onSubmitEditing={() => handleKeyPress(meaningRef)} // Khi nhấn Enter, chuyển con trỏ đến trường "Nghĩa"
                            />
                        </View>

                        <View style={styles.rowDetail}>
                            <Text style={styles.label}>Nghĩa</Text>
                            <TextInput
                                ref={meaningRef}
                                style={styles.detailInput}
                                value={meaning}
                                onChangeText={setMeaning}
                                onSubmitEditing={() => handleKeyPress(typeRef)} // Khi nhấn Enter, chuyển con trỏ đến trường "Loại từ"
                            />
                        </View>

                        <View style={styles.rowDetail}>
                            <Text style={styles.label}>Loại từ</Text>
                            <View style={styles.checkBoxContainer}>
                                {availableTypes.map((item) => (
                                    <View key={item} style={styles.checkBoxRow}>
                                        <CheckBox
                                            value={type.includes(item)}
                                            onValueChange={() => toggleTypeSelection(item)}
                                        />
                                        <Text style={styles.checkBoxLabel}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.rowDetail}>
                            <Text style={styles.label}>Ghi chú</Text>
                            <TextInput
                                ref={noteRef}
                                style={styles.detailInput}
                                value={note}
                                onChangeText={setNote}
                                onSubmitEditing={handleSave} // Khi nhấn Enter, lưu dữ liệu
                            />
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                <Text style={styles.buttonText}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: width * 0.9,
        backgroundColor: color.white,
        borderRadius: width * 0.05,
        padding: width * 0.05,
    },
    shadowEffect: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        flexDirection: "row",
        marginBottom: height * 0.02,
    },
    modalTitle: {
        fontSize: height * 0.025,
        fontWeight: "bold",
        marginBottom: height * 0.02,
        textAlign: "center",
        marginLeft: width * 0.15,
    },
    rowDetail: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: height * 0.02,
    },
    label: {
        fontSize: height * 0.018,
        color: color.black,
        flex: 1,
    },
    detailInput: {
        flex: 3,
        borderWidth: 1,
        borderRadius: width * 0.02,
        backgroundColor: color.white,
        borderBottomColor: color.gray,
        fontSize: height * 0.018,
        paddingVertical: height * 0.01,
        color: color.black,
        fontStyle: "italic",
    },
    checkBoxContainer: {
        flexDirection: "column",
    },
    checkBoxRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkBoxLabel: {
        fontSize: height * 0.018,
        color: color.black,
        marginLeft: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: height * 0.02,
        width: width * 0.8,
        height: height * 0.07,
    },
    saveButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        borderRadius: width * 0.07,
        width: width * 0.25,
        height: height * 0.06,
    },
    buttonText: {
        color: color.white,
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: height * 0.02,
        textAlign: "center",
    },
});

export default EditVocabularyModal;

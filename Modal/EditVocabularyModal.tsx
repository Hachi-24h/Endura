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
    FlatList,
    Alert,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import color from "../Custom/Color";
import { CloseSquare } from "iconsax-react-native";

const { width, height } = Dimensions.get("window");

type VocabularyItem = {
    word: string;
    meaning: string;
    types?: string[];
    note?: string;
};

type EditVocabularyModalProps = {
    visible: boolean;
    onClose: () => void;
    vocabulary: VocabularyItem;
    onUpdated: () => void;
    editVocabulary: (oldWord: string, updatedData: VocabularyItem) => Promise<boolean>;
};

const EditVocabularyModal: React.FC<EditVocabularyModalProps> = ({
    visible,
    onClose,
    vocabulary,
    onUpdated,
    editVocabulary,
}) => {
    const [word, setWord] = useState(vocabulary.word);
    const [meaning, setMeaning] = useState(vocabulary.meaning);
    const [type, setType] = useState<string[]>(vocabulary.types || []);
    const [note, setNote] = useState(vocabulary.note || "");

    const availableTypes: string[] = [
        "Noun", "Pronoun", "Verb", "Adjective", "Adverb",
        "Preposition", "Conjunction", "Interjection",
        "Determiner", "Article"
    ];

    useEffect(() => {
        if (vocabulary) {
            setWord(vocabulary.word || "");
            setMeaning(vocabulary.meaning || "");
            setType(vocabulary.types || []);
            setNote(vocabulary.note || "");
        }
    }, [vocabulary]);

    const handleSave = async () => {
        const updatedData: VocabularyItem = { word, meaning, types: type, note };
        const success = await editVocabulary(vocabulary.word, updatedData);
        if (success) {
            onUpdated();
            onClose();
        } else {
            Alert.alert("Chỉnh sửa thất bại. Vui lòng thử lại.");
        }
    };

    const toggleTypeSelection = (selectedType: string) => {
        setType((prevTypes) =>
            prevTypes.includes(selectedType)
                ? prevTypes.filter((t) => t !== selectedType)
                : [...prevTypes, selectedType]
        );
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, styles.shadowEffect]}>
                        <View style={styles.title}>
                            <TouchableOpacity onPress={onClose}>
                                <CloseSquare size={30} color={color.red} />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Chỉnh sửa từ vựng</Text>
                        </View>

                        {/* Từ Vựng */}
                        <View style={styles.rowDetail}>
                            <Text style={styles.label}>Từ Vựng</Text>
                            <TextInput
                                style={[styles.detailInput, { color: color.lightRed }]}
                                value={word}
                                onChangeText={setWord}
                            />
                        </View>

                        {/* Nghĩa */}
                        <View style={styles.rowDetail}>
                            <Text style={styles.label}>Nghĩa</Text>
                            <TextInput
                                style={styles.detailInput}
                                value={meaning}
                                onChangeText={setMeaning}
                            />
                        </View>

                        {/* Loại từ */}
                        <View style={styles.rowDetailType}>
                            <Text style={styles.labelType}>Loại từ</Text>
                            <FlatList
                                data={availableTypes}
                                keyExtractor={(item) => item}
                                numColumns={2}
                                columnWrapperStyle={styles.checkboxRow}
                                renderItem={({ item }) => (
                                    <View style={styles.checkboxColumn}>
                                        <BouncyCheckbox
                                            size={25}
                                            fillColor={color.lightBlue}
                                            unFillColor={color.white}
                                            text={item}
                                            iconStyle={{}}
                                            innerIconStyle={{ borderWidth: 2 }}
                                            textStyle={{
                                                textDecorationLine: "none",
                                                fontSize: width * 0.035,
                                            }}
                                            onPress={() => toggleTypeSelection(item)}
                                            isChecked={type.includes(item)}
                                        />
                                    </View>
                                )}
                            />
                        </View>

                        {/* Ghi chú */}
                        <View style={styles.rowDetail}>
                            <Text style={styles.label}>Ghi chú</Text>
                            <TextInput
                                style={styles.detailInput}
                                value={note}
                                onChangeText={setNote}
                            />
                        </View>

                        {/* Nút Lưu */}
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
        alignItems: "center",
        marginBottom: height * 0.02,
    },
    modalTitle: {
        fontSize: height * 0.025,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    rowDetail: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: height * 0.02,
    },
    rowDetailType: {
        flexDirection: "row",
        marginBottom: height * 0.02,
    },
    labelType: {
        fontSize: height * 0.018,
        color: color.black,
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
        borderColor: color.gray,
        fontSize: height * 0.018,
        padding: height * 0.01,
        color: color.black,
        fontStyle: "italic",
    },
    checkboxRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    checkboxColumn: {
        flex: 1,
        marginHorizontal: 5,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: height * 0.02,
    },
    saveButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        borderRadius: width * 0.07,
    },
    buttonText: {
        color: color.white,
        fontWeight: "bold",
        fontSize: height * 0.02,
        textAlign: "center",
    },
});

export default EditVocabularyModal;

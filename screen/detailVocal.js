import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList, Keyboard,
    Dimensions, Modal, TouchableWithoutFeedback,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AddSquare, Edit, CloseSquare, PenClose } from "iconsax-react-native"; // Import icon từ thư viện
import styles from "../Css/detailVocal";
import Footer from "./footer";
import color from "../Custom/Color";
import { searchSimilarWords, addOrUpdateAntonym, addOrUpdateSynonym, searchExactWord, getRandomVocabulary } from '../utils/fileSystem';
import EditVocabularyModal from "../Modal/EditVocabularyModal"

const VocabularyDetailScreen = ({ navigation, route }) => {
    const [vocabulary, setVocabulary] = useState(null); // Từ hiện tại
    const [synonyms, setSynonyms] = useState([]); // Danh sách từ đồng nghĩa
    const [antonyms, setAntonyms] = useState([]); // Danh sách từ trái nghĩa
    const [type, setType] = useState([]);
    const [newSynonym, setNewSynonym] = useState("");
    const [newAntonym, setNewAntonym] = useState("");
    const { width, height } = Dimensions.get("window");
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const wordVocal = vocabulary ? vocabulary.word : "Unknown";
    const meaningVocal = vocabulary ? vocabulary.meaning : "Unknown";
    const sanitizedMeaningVocal = Array.isArray(meaningVocal)
        ? meaningVocal.filter(Boolean) // Loại bỏ undefined, null, hoặc giá trị falsy
        : [meaningVocal].filter(Boolean); // Đảm bảo luôn là mảng và lọc giá trị không hợp lệ

    const meaningVocalFinal = (sanitizedMeaningVocal.length === 0)
        ? " " // Hiển thị chuỗi rỗng nếu mảng không có giá trị hợp lệ
        : ` ${sanitizedMeaningVocal.map(item => `[ ${item} ]`).join(' , ').trim()}`;

    const noteVocal = vocabulary ? vocabulary.note : "Unknown";
    const validSynonyms = synonyms.filter(item => item.trim() !== "");
    const validAntonyms = antonyms.filter(item => item.trim() !== "");
    const [isSynonymModalVisible, setSynonymModalVisible] = useState(false);
    const [isAntonymModalVisible, setAntonymModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [historyStack, setHistoryStack] = useState([]);
    const typeColors = {
        "Noun": "#FF5733", // Cam đậm
        "Pronoun": "#FFCC99", // Tím nhạt
        "Verb": "#33FF57", // Xanh lá
        "Adjective": "#3357FF", // Xanh dương
        "Adverb": "#FF33A1", // Hồng
        "Preposition": "#FFD133", // Vàng
        "Conjunction": "#33FFF5", // Xanh ngọc
        "Interjection": "#006666", // Xanh đậm
        "Determiner": "#006600", // Xanh lá đậm
        "Article": "#009900" // Xanh lá sáng
    };

    const handleGoBackGesture = () => {
        if (historyStack.length > 0) {
            // Lấy từ trên cùng của stack
            const previousWord = historyStack[historyStack.length - 1];

            // Cập nhật từ hiện tại
            setVocabulary(previousWord);
            setSynonyms(previousWord.synonyms || []);
            setAntonyms(previousWord.antonyms || []);

            // Xóa phần tử trên cùng khỏi stack
            setHistoryStack((prevStack) => prevStack.slice(0, -1));
        } else {
            // Quay lại trang trước đó
            navigation.goBack();
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const onGestureBack = () => {
                handleGoBackGesture();
                return true; // Chặn hành vi mặc định
            };

            const unsubscribe = navigation.addListener("gestureStart", onGestureBack);

            return () => {
                unsubscribe();
            };
        }, [historyStack, navigation])
    );


    const handleSearch = async (text) => {
        setSearchText(text);
        if (text.trim() !== '') {
           
            const results = await searchSimilarWords(text);
           
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.resultItemSearch}
            onPress={() => {
                // console.log("Navigating to Detail with:", item); // Log kiểm tra
                setSearchResults([]);
                setSearchText('');

                navigation.navigate('Detail', { vocabulary: item }); Keyboard.dismiss();
            }}
        >
            <Text style={styles.resultTextSearch}>{item.word}</Text>
            <Text style={styles.resultTextMeaning}>{item.meaning}</Text>
        </TouchableOpacity>
    );
    // console.log("Vocabulary:", vocabulary);
    // Dữ liệu mẫu
    const sampleData = [
        {
            word: "Run",
            meaning: "To move quickly on foot sdhfkjd hdskfjjdsf sdhfjkdsf ",
            type: "Verb",
            note: "Commonly used in daily conversations hsdkhf sdfkj hsdjkf sdkfh",
            synonyms: ["Sprint", "Jog", "Dash", "Scurry"],
            antonyms: ["Walk", "Stop", "Stand"],
        },
    ];

    const fetchRandomWord = async () => {
        try {
            const randomWordList = await getRandomVocabulary(2);
           
            if (randomWordList.length > 0) {
                const randomWord = randomWordList[0];

                setVocabulary(randomWord);
                setType(randomWord.types || [])
                setSynonyms(randomWord.synonyms || []);
                setAntonyms(randomWord.antonyms || []);
            } else {
                console.log("No words found in the vocabulary.");
            }
        } catch (error) {
            console.error("Error fetching random word:", error);
        }
    };

    useEffect(() => {
        const loadVocabulary = () => {
            if (route.params && route.params.vocabulary) {
                setVocabulary(route.params.vocabulary);
                setType(route.params.vocabulary.types || []);
                setSynonyms(route.params.vocabulary.synonyms || []);
                setAntonyms(route.params.vocabulary.antonyms || []);
            } else {
                fetchRandomWord(); // Chỉ gọi khi không có từ trong `route.params`
            }
        };

        loadVocabulary();
    }, [route.params]);

    const handleAddSynonymFromModal = async (word, newSynonym) => {
        console.log("Current word:", word);
        console.log("New synonym to add:", newSynonym);
        const success = await addOrUpdateSynonym(word, newSynonym);
        if (success) {
            console.log("Synonym added successfully.");
            const updatedVocabulary = await searchSimilarWords(word);
            setVocabulary(updatedVocabulary[0]); // Lấy lại từ hiện tại
            setSynonyms(updatedVocabulary[0]?.synonyms || []);
        } else {
            console.error("Failed to add synonym.");
        }
    };

    const handleAddAntonymFromModal = async (word, newAntonym) => {
        const success = await addOrUpdateAntonym(word, newAntonym);
        if (success) {
            console.log("Antonym added successfully.");
            const updatedVocabulary = await searchSimilarWords(word);
            setVocabulary(updatedVocabulary[0]); // Lấy lại từ hiện tại
            setAntonyms(updatedVocabulary[0]?.antonyms || []);
        } else {
            console.error("Failed to add antonym.");
        }
    };

    const handleWordPress = async (word) => {
        try {
            const result = await searchExactWord(word);
            if (result) {
                // Lưu từ hiện tại vào stack
                setHistoryStack((prevStack) => [...prevStack, vocabulary]);

                // Điều hướng đến từ mới
                setVocabulary(result);
                setType(result.types || []);
                setSynonyms(result.synonyms || []);
                setAntonyms(result.antonyms || []);
            } else {
                alert("Không tìm thấy thông tin chi tiết về từ này.");
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm từ:", error);
            alert("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };


    const onUpdated = async () => {
        try {

            const updatedVocabulary = await searchExactWord(vocabulary.word);
            if (updatedVocabulary) {
                setVocabulary(updatedVocabulary);
                setSynonyms(updatedVocabulary.synonyms || []);
                setAntonyms(updatedVocabulary.antonyms || []);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật từ vựng:", error);
        }
    };

    const handleGoBack = () => {
        if (historyStack.length > 0) {
            // Lấy từ trên cùng của stack
            const previousWord = historyStack[historyStack.length - 1];

            // Cập nhật từ hiện tại
            setVocabulary(previousWord);
            setSynonyms(previousWord.synonyms || []);
            setAntonyms(previousWord.antonyms || []);

            // Xóa phần tử trên cùng khỏi stack
            setHistoryStack((prevStack) => prevStack.slice(0, -1));
        } else {
            const isPreviousDetail = navigation.canGoBack();

            if (isPreviousDetail) {
                // Quay lại màn hình trước đó nếu có
                navigation.goBack();
            } else {
                // Nếu không, điều hướng về HomePage
                navigation.navigate('Add');
            }
        }
    };


    return (
        <View style={styles.container}>
            {/* Thanh tìm kiếm */}
            <View style={styles.searchBar}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Image source={require("../Icon/back.png")} style={styles.backicon} />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search"
                    value={searchText}
                    onChangeText={handleSearch}
                    style={styles.searchInput}

                    placeholderTextColor="#FFA500" // Màu cam
                />
                {searchText.length > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            setSearchText('');
                            setSearchResults([]);
                            Keyboard.dismiss();
                        }}
                        style={{
                            position: "absolute",
                            right: width * 0.05,
                            justifyContent: "center",
                            alignItems: "center",
                            top: height * 0.034,
                        }}
                    >
                        <PenClose
                            size="32"
                            color="#FF8A65"
                            variant="Outline"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {/* Danh sách kết quả */}
            {searchResults.length > 0 && (

                <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    style={styles.resultList}
                />
            )}
            {/* FlatList */}
            <View style={styles.wrapper}>
                <FlatList
                    data={[]}
                    ListHeaderComponent={
                        <View>
                            {/* Phần chi tiết từ */}
                            <View style={styles.null}></View>
                            <View style={[styles.detailContainer, styles.shadowEffect]}>
                                <View style={[styles.rowDetail, { justifyContent: "space-between", }]}>
                                    <Text style={styles.label2}>Chi tiết</Text>
                                    <TouchableOpacity onPress={() => setEditModalVisible(true)}>
                                        <Edit size="32" color={color.lightBlue} variant="Bold" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.rowDetail}>
                                    <Text style={styles.label}>Từ Vựng</Text>
                                    <Text style={[styles.detail, { color: color.lightRed }]}>{wordVocal}</Text>
                                </View>
                                <View style={styles.rowDetail}>
                                    <Text style={styles.label}>Nghĩa</Text>
                                    <Text style={styles.detail}>{meaningVocalFinal}</Text>
                                </View>
                                <View style={styles.rowDetail}>
                                    <Text style={styles.label}>Loại từ</Text>

                                    <View style={{ width: width * 0.55 }}>
                                        <FlatList
                                            data={type} // Danh sách các loại từ, ví dụ ['Noun', 'Verb', 'Adjective']
                                            keyExtractor={(item, index) => index.toString()} // Key duy nhất cho mỗi phần tử
                                            horizontal={true} // Cuộn ngang
                                            showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
                                            renderItem={({ item }) => {
                                                const itemColor = typeColors[item] || "#000000"; // Mặc định màu đen nếu không tìm thấy
                                                return (
                                                    <View style={{ padding: 5 }}>
                                                        <Text style={{ color: itemColor, fontStyle: "italic", fontWeight: "bold" }}>
                                                            {item}
                                                        </Text>
                                                    </View>
                                                );
                                            }}
                                        />
                                    </View>


                                </View>
                                <View style={styles.rowDetail}>
                                    <Text style={styles.label}>Ghi chú</Text>
                                    <Text style={styles.detail}>{noteVocal}</Text>
                                </View>
                            </View>


                            {/* Phần từ đồng nghĩa */}
                            <View style={[styles.synAntContainer, styles.shadowEffect]}>
                                <View style={styles.synAntSection}>
                                    <View style={styles.row}>
                                        <Text style={styles.label2}>Đồng nghĩa</Text>
                                        <TouchableOpacity style={{ marginLeft: width * 0.3 }} >
                                            <Edit size="32" color={color.lightBlue} variant="Bold" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setSynonymModalVisible(true)} >
                                            <AddSquare size="32" color={color.lightBlue} variant="Bold" />
                                        </TouchableOpacity>

                                    </View>
                                    {validSynonyms && validSynonyms.length > 0 ? (
                                        <FlatList
                                            data={synonyms}
                                            renderItem={({ item }) => (
                                                <View style={styles.columnItem}>
                                                    <TouchableOpacity
                                                        onPress={() => handleWordPress(item)}
                                                    >
                                                        <Text style={[styles.listItem, { backgroundColor: "#FFCC99" }]}>{item}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            keyExtractor={(item, index) => index.toString()}
                                            numColumns={2}
                                        />
                                    ) : (
                                        <Text style={styles.emptyText}>Hãy nhập thêm từ đồng nghĩa</Text>
                                    )}

                                </View>
                            </View>


                            {/* Phần từ trái nghĩa */}
                            <View style={[styles.synAntContainer, styles.shadowEffect]}>
                                <View style={styles.synAntSection}>
                                    <View style={styles.row}>
                                        <Text style={styles.label2}>Trái nghĩa</Text>
                                        <TouchableOpacity style={{ marginLeft: width * 0.3 }} >
                                            <Edit size="32" color={color.lightBlue} variant="Bold" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setAntonymModalVisible(true)}>
                                            <AddSquare size="32" color={color.lightBlue} variant="Bold" />
                                        </TouchableOpacity>
                                    </View>

                                    {validAntonyms && validAntonyms.length > 0 ? (
                                        <FlatList
                                            data={validAntonyms}
                                            renderItem={({ item }) => (
                                                <View style={styles.columnItem}>
                                                    <TouchableOpacity
                                                        onPress={() => handleWordPress(item)}
                                                    >
                                                        <Text style={[styles.listItem, { backgroundColor: "#9999FF" }]}>{item}</Text>
                                                    </TouchableOpacity>

                                                </View>
                                            )}
                                            keyExtractor={(item, index) => index.toString()}
                                            numColumns={2}
                                        />
                                    ) : (
                                        <Text style={styles.emptyText}>Hãy nhập thêm từ trái nghĩa</Text>
                                    )}

                                </View>
                            </View>

                        </View>
                    }
                    keyExtractor={() => "key"}
                />
            </View>

            {/* Modal thêm từ đồng nghĩa */}
            <Modal
                visible={isSynonymModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSynonymModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setSynonymModalVisible(false)}>
                    <View style={styles.modalContainer}>

                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>

                                <TouchableOpacity style={styles.closeButton} onPress={() => setSynonymModalVisible(false)}>
                                    <CloseSquare size="40" color={color.red} variant="Bold" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Thêm từ đồng nghĩa</Text>
                            </View>

                            <TextInput
                                placeholder="Nhập từ đồng nghĩa"
                                value={newSynonym}
                                onChangeText={async (text) => {
                                    setNewSynonym(text);
                                    const results = await searchSimilarWords(text);
                                    setSearchResults(results);
                                }}
                                style={[styles.input, { textAlign: "left" }]} // Căn chỉnh văn bản sang phải
                            />

                            {/* Danh sách từ tìm được */}
                            <View style={styles.listItemContainer}>
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        // Mảng màu
                                        const backgroundColors = ["#66FFFF", "#66FFCC", "#66FF99", "#66FF66", "#66FF33", "#66FF00"];
                                        const textColors = ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000"];

                                        // Lấy màu tuần tự
                                        const sequentialColor = backgroundColors[index % backgroundColors.length];
                                        const sequentialColorText = textColors[index % textColors.length];

                                        return (
                                            <TouchableOpacity
                                                onPress={() => setNewSynonym(item.word)}
                                                style={[styles.resultItemHorizontal, { backgroundColor: sequentialColor }]} // Áp dụng màu tuần tự
                                            >
                                                <Text style={[styles.resultText, { color: sequentialColorText }]}>{item.word}</Text>
                                            </TouchableOpacity>
                                        );
                                    }}
                                    style={styles.resultListHorizontal}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        justifyContent: searchResults.length > 1 ? "flex-start" : "center", // Nếu có 1 từ thì căn giữa
                                        alignItems: "center", // Luôn căn giữa theo chiều dọc
                                    }}
                                />
                            </View>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={async () => {
                                        await handleAddSynonymFromModal(vocabulary.word, newSynonym);
                                        setNewSynonym("");
                                        setSynonymModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Thêm</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>



            {/* Modal thêm từ trái nghĩa */}
            <Modal
                visible={isAntonymModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setAntonymModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setAntonymModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {/* Header của modal */}
                            <View style={styles.modalHeader}>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setAntonymModalVisible(false)}>
                                    <CloseSquare size="40" color={color.red} variant="Bold" />
                                </TouchableOpacity>
                                <Text style={[styles.modalTitle, { color: "#9999FF" }]}>Thêm từ trái nghĩa</Text>
                            </View>

                            {/* Ô nhập */}
                            <TextInput
                                placeholder="Nhập từ trái nghĩa"
                                value={newAntonym}
                                onChangeText={async (text) => {
                                    setNewAntonym(text);
                                    const results = await searchSimilarWords(text);
                                    setSearchResults(results);
                                }}
                                style={[styles.input, { textAlign: "left" }]} // Căn chỉnh văn bản
                            />

                            {/* Danh sách từ tìm được */}
                            <View style={styles.listItemContainer}>
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        // Mảng màu
                                        const backgroundColors = ["#66FFFF", "#66FFCC", "#66FF99", "#66FF66", "#66FF33", "#66FF00"];
                                        const textColors = ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000"];

                                        // Lấy màu tuần tự
                                        const sequentialColor = backgroundColors[index % backgroundColors.length];
                                        const sequentialColorText = textColors[index % textColors.length];

                                        return (
                                            <TouchableOpacity
                                                onPress={() => setNewAntonym(item.word)}
                                                style={[styles.resultItemHorizontal, { backgroundColor: sequentialColor }]} // Áp dụng màu tuần tự
                                            >
                                                <Text style={[styles.resultText, { color: sequentialColorText }]}>{item.word}</Text>
                                            </TouchableOpacity>
                                        );
                                    }}
                                    style={styles.resultListHorizontal}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        justifyContent: searchResults.length > 1 ? "flex-start" : "center", // Nếu có 1 từ thì căn giữa
                                        alignItems: "center", // Luôn căn giữa theo chiều dọc
                                    }}
                                />
                            </View>

                            {/* Nút thêm */}
                            <View style={[styles.buttonRow,]}>
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: "#9999FF" }]}
                                    onPress={async () => {
                                        await handleAddAntonymFromModal(vocabulary.word, newAntonym);
                                        setNewAntonym("");
                                        setAntonymModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.buttonText,]}>Thêm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <EditVocabularyModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                vocabulary={vocabulary ? vocabulary : sampleData}
                onUpdated={onUpdated}
            />

            <Footer navigation={navigation} />
        </View>
    );
};

export default VocabularyDetailScreen;

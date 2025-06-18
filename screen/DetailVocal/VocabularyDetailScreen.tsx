import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Dimensions, Alert, Keyboard } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Footer from "../footer";
import {
    searchSimilarWords,
    addOrUpdateSynonym,
    addOrUpdateAntonym,
    searchExactWord,
    getRandomVocabulary,
    editVocabulary
} from "../../utils/fileSystem";
import styles from "../../Css/detailVocal";
import SearchBar from "./SearchBar";
import { RenderSearchItem } from "./RenderSearchItem";
import DetailCard from "./DetailCard";
import SynonymModal from "./SynonymModal";
import AntonymModal from "./AntonymModal";
import EditVocabularyModal from "../../Modal/EditVocabularyModal";

const { width, height } = Dimensions.get("window");

type Vocabulary = {
    word: string;
    meaning: string;
    note?: string;
    type?: string;
    types?: string[];
    synonyms?: string[];
    antonyms?: string[];
};

const VocabularyDetailScreen: React.FC<any> = ({ navigation, route }) => {
    const [vocabulary, setVocabulary] = useState<Vocabulary | null>(null);
    const [type, setType] = useState<string[]>([]);
    const [synonyms, setSynonyms] = useState<string[]>([]);
    const [antonyms, setAntonyms] = useState<string[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState<Vocabulary[]>([]);
    const [newSynonym, setNewSynonym] = useState("");
    const [newAntonym, setNewAntonym] = useState("");
    const [isSynonymModalVisible, setSynonymModalVisible] = useState(false);
    const [isAntonymModalVisible, setAntonymModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [historyStack, setHistoryStack] = useState<Vocabulary[]>([]);

    const wordVocal = vocabulary?.word || "Unknown";
    const meaningRaw = vocabulary?.meaning || "";
    const meaningArray = typeof meaningRaw === "string"
        ? meaningRaw.split(",").map(m => m.trim()).filter(Boolean)
        : Array.isArray(meaningRaw)
            ? (meaningRaw as string[]).filter(Boolean)
            : [];
    const meaningVocalFinal = meaningArray.length
        ? meaningArray.map((m: any) => `[ ${m} ]`).join(" , ")
        : " ";
    const noteVocal = vocabulary?.note || "";

    const validSynonyms = synonyms.filter(item => item.trim() !== "");
    const validAntonyms = antonyms.filter(item => item.trim() !== "");

    // ----- Load dữ liệu -----
    useEffect(() => {
        if (route.params?.vocabulary) {
            const v = route.params.vocabulary;
            setVocabulary(v);
            setType(v.types || []);
            setSynonyms(v.synonyms || []);
            setAntonyms(v.antonyms || []);
        } else {
            fetchRandomWord();
        }
    }, [route.params]);

    const fetchRandomWord = async () => {
        const list = await getRandomVocabulary(1);
        const word = list[0];
        if (word) {
            setVocabulary(word);
            setType(word.types || []);
            setSynonyms(word.synonyms || []);
            setAntonyms(word.antonyms || []);
        }
    };

    // ----- Điều hướng quay lại -----
    const handleGoBack = () => {
        if (historyStack.length > 0) {
            const prev = historyStack[historyStack.length - 1];
            setVocabulary(prev);
            setSynonyms(prev.synonyms || []);
            setAntonyms(prev.antonyms || []);
            setHistoryStack(stack => stack.slice(0, -1));
        } else {
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Add");
        }
    };

    useFocusEffect(useCallback(() => {
        const unsubscribe = navigation.addListener("gestureStart", () => {
            handleGoBack();
            return true;
        });
        return unsubscribe;
    }, [historyStack]));

    // ----- Xử lý tìm kiếm -----
    const handleSearch = async (text: string) => {
        setSearchText(text);
        if (text.trim()) {
            const result = await searchSimilarWords(text);
            setSearchResults(result);
        } else {
            setSearchResults([]);
        }
    };

    // ----- Khi bấm vào 1 từ -----
    const handleWordPress = async (word: string) => {
        try {
            const result = await searchExactWord(word);
            if (result) {
                setHistoryStack(prev => [...prev, vocabulary!]);
                setVocabulary(result);
                setType(result.types || []);
                setSynonyms(result.synonyms || []);
                setAntonyms(result.antonyms || []);
            } else {
                Alert.alert("Không tìm thấy thông tin từ này.");
            }
        } catch {
            Alert.alert("Lỗi xảy ra khi tìm từ.");
        }
    };

    // ----- Cập nhật lại sau khi sửa -----
    const onUpdated = async () => {
        const updated = await searchExactWord(wordVocal);
        if (updated) {
            setVocabulary(updated);
            setSynonyms(updated.synonyms || []);
            setAntonyms(updated.antonyms || []);
        }
    };

    const handleAddSynonymFromModal = async (word: string, syn: string) => {
        const ok = await addOrUpdateSynonym(word, syn);
        if (ok) {
            const updated = await searchExactWord(word);
            setVocabulary(updated);
            setSynonyms(updated.synonyms || []);
        }
    };

    const handleAddAntonymFromModal = async (word: string, ant: string) => {
        const ok = await addOrUpdateAntonym(word, ant);
        if (ok) {
            const updated = await searchExactWord(word);
            setVocabulary(updated);
            setAntonyms(updated.antonyms || []);
        }
    };

    return (
        <View style={styles.container}>
            <SearchBar
                navigation={navigation}
                searchText={searchText}
                setSearchText={handleSearch}
                setSearchResults={setSearchResults}
                handleGoBack={handleGoBack}
                width={width}
                height={height}
            />

            {searchResults.length > 0 && (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <RenderSearchItem
                            item={item}
                            navigation={navigation}
                            setSearchText={setSearchText}
                            setSearchResults={setSearchResults}
                        />
                    )}
                    style={styles.resultList}
                />
            )}

            <FlatList
                data={[]}
                renderItem={null}
                ListHeaderComponent={
                    <DetailCard
                        word={wordVocal}
                        meaning={meaningVocalFinal}
                        note={noteVocal}
                        type={type}
                        width={width}
                        synonyms={synonyms}
                        antonyms={antonyms}
                        validSynonyms={validSynonyms}
                        validAntonyms={validAntonyms}
                        onEditPress={() => setEditModalVisible(true)}
                        onSynonymAdd={() => setSynonymModalVisible(true)}
                        onAntonymAdd={() => setAntonymModalVisible(true)}
                        handleWordPress={handleWordPress}
                    />
                }
                keyExtractor={() => "detail"}
            />

            <SynonymModal
                visible={isSynonymModalVisible}
                onClose={() => setSynonymModalVisible(false)}
                newSynonym={newSynonym}
                setNewSynonym={setNewSynonym}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                vocabulary={vocabulary}
                onAdd={handleAddSynonymFromModal}
            />

            <AntonymModal
                visible={isAntonymModalVisible}
                onClose={() => setAntonymModalVisible(false)}
                newAntonym={newAntonym}
                setNewAntonym={setNewAntonym}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                vocabulary={vocabulary}
                onAdd={handleAddAntonymFromModal}
            />

            <EditVocabularyModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                vocabulary={vocabulary ?? { word: "", meaning: "" }}
                onUpdated={onUpdated}
                editVocabulary={editVocabulary}
            />

            <Footer navigation={navigation} />
        </View>
    );
};

export default VocabularyDetailScreen;

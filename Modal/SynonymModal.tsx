import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  FlatList
} from "react-native";
import { CloseSquare } from "iconsax-react-native";
import { searchSimilarWords } from "../utils/fileSystem";

import styles from "../Css/detailVocal";
import color from "../Custom/Color";

const SynonymModal = ({
  visible,
  onClose,
  newSynonym,
  setNewSynonym,
  searchResults,
  setSearchResults,
  vocabulary,
  onAdd
}: {
  visible: boolean;
  onClose: () => void;
  newSynonym: string;
  setNewSynonym: (val: string) => void;
  searchResults: any[];
  setSearchResults: (val: any[]) => void;
  vocabulary: any;
  onAdd: (word: string, synonym: string) => Promise<void>;
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
              style={[styles.input, { textAlign: "left" }]}
            />

            <View style={styles.listItemContainer}>
              <FlatList
                data={searchResults}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => {
                  const backgroundColors = ["#66FFFF", "#66FFCC", "#66FF99", "#66FF66", "#66FF33", "#66FF00"];
                  const sequentialColor = backgroundColors[index % backgroundColors.length];
                  return (
                    <TouchableOpacity
                      onPress={() => setNewSynonym(item.word)}
                      style={[styles.resultItemHorizontal, { backgroundColor: sequentialColor }]}
                    >
                      <Text style={[styles.resultText, { color: "#000" }]}>{item.word}</Text>
                    </TouchableOpacity>
                  );
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  justifyContent: searchResults.length > 1 ? "flex-start" : "center",
                  alignItems: "center",
                }}
                style={styles.resultListHorizontal}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  await onAdd(vocabulary.word, newSynonym);
                  setNewSynonym("");
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SynonymModal;

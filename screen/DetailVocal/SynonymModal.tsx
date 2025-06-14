import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";
import { CloseSquare } from "iconsax-react-native";
import styles from "../../Css/detailVocal";
import color from "../../Custom/Color";
import { searchSimilarWords } from "../../utils/fileSystem";

type Props = {
  visible: boolean;
  onClose: () => void;
  newSynonym: string;
  setNewSynonym: (text: string) => void;
  searchResults: any[];
  setSearchResults: (data: any[]) => void;
  vocabulary: any;
  onAdd: (word: string, syn: string) => void;
};

const SynonymModal: React.FC<Props> = ({
  visible,
  onClose,
  newSynonym,
  setNewSynonym,
  searchResults,
  setSearchResults,
  vocabulary,
  onAdd
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
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  const colors = ["#66FFFF", "#66FFCC", "#66FF99", "#66FF66"];
                  return (
                    <TouchableOpacity
                      onPress={() => setNewSynonym(item.word)}
                      style={[styles.resultItemHorizontal, { backgroundColor: colors[index % colors.length] }]}
                    >
                      <Text style={[styles.resultText, { color: "#000" }]}>{item.word}</Text>
                    </TouchableOpacity>
                  );
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
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

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
  newAntonym: string;
  setNewAntonym: (text: string) => void;
  searchResults: any[];
  setSearchResults: (data: any[]) => void;
  vocabulary: any;
  onAdd: (word: string, ant: string) => void;
};

const AntonymModal: React.FC<Props> = ({
  visible,
  onClose,
  newAntonym,
  setNewAntonym,
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
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <CloseSquare size="40" color={color.red} variant="Bold" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: "#9999FF" }]}>Thêm từ trái nghĩa</Text>
            </View>

            {/* Input */}
            <TextInput
              placeholder="Nhập từ trái nghĩa"
              value={newAntonym}
              onChangeText={async (text) => {
                setNewAntonym(text);
                const results = await searchSimilarWords(text);
                setSearchResults(results);
              }}
              style={[styles.input, { textAlign: "left" }]}
            />

            {/* Gợi ý kết quả */}
            <View style={styles.listItemContainer}>
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  const colors = ["#66FFFF", "#66FFCC", "#66FF99", "#66FF66"];
                  return (
                    <TouchableOpacity
                      onPress={() => setNewAntonym(item.word)}
                      style={[styles.resultItemHorizontal, { backgroundColor: colors[index % colors.length] }]}
                    >
                      <Text style={[styles.resultText, { color: "#000" }]}>{item.word}</Text>
                    </TouchableOpacity>
                  );
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  justifyContent: searchResults.length > 1 ? "flex-start" : "center",
                  alignItems: "center"
                }}
              />
            </View>

            {/* Nút Thêm */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#9999FF" }]}
                onPress={async () => {
                  await onAdd(vocabulary.word, newAntonym);
                  setNewAntonym("");
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

export default AntonymModal;

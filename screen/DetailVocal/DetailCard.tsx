import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Edit, AddSquare } from "iconsax-react-native";
import styles from "../../Css/detailVocal";
import color from "../../Custom/Color";

type Props = {
  word: string;
  meaning: string;
  note: string;
  type: string[];
  width: number;
  synonyms: string[];
  antonyms: string[];
  validSynonyms: string[];
  validAntonyms: string[];
  onEditPress: () => void;
  onSynonymAdd: () => void;
  onAntonymAdd: () => void;
  handleWordPress: (word: string) => void;
};

const typeColors: Record<string, string> = {
  Noun: "#FF5733",
  Pronoun: "#FFCC99",
  Verb: "#33FF57",
  Adjective: "#3357FF",
  Adverb: "#FF33A1",
  Preposition: "#FFD133",
  Conjunction: "#33FFF5",
  Interjection: "#006666",
  Determiner: "#006600",
  Article: "#009900"
};

const DetailCard: React.FC<Props> = ({
  word,
  meaning,
  note,
  type,
  width,
  synonyms,
  antonyms,
  validSynonyms,
  validAntonyms,
  onEditPress,
  onSynonymAdd,
  onAntonymAdd,
  handleWordPress
}) => {
  return (
    <View>
      <View style={styles.null} />
      <View style={[styles.detailContainer, styles.shadowEffect]}>
        <View style={[styles.rowDetail, { justifyContent: "space-between" }]}>
          <Text style={styles.label2}>Chi tiết</Text>
          <TouchableOpacity onPress={onEditPress}>
            <Edit size="32" color={color.lightBlue} variant="Bold" />
          </TouchableOpacity>
        </View>

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Từ Vựng</Text>
          <Text style={[styles.detail, { color: color.lightRed }]}>{word}</Text>
        </View>

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Nghĩa</Text>
          <Text style={styles.detail}>{meaning}</Text>
        </View>

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Loại từ</Text>
          <View style={{ width: width * 0.55 }}>
            <FlatList
              data={type}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const color = typeColors[item] || "#000";
                return (
                  <View style={{ padding: 5 }}>
                    <Text style={{ color, fontStyle: "italic", fontWeight: "bold" }}>{item}</Text>
                  </View>
                );
              }}
            />
          </View>
        </View>

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Ghi chú</Text>
          <Text style={styles.detail}>{note}</Text>
        </View>
      </View>

      {/* Synonym */}
      <View style={[styles.synAntContainer, styles.shadowEffect]}>
        <View style={styles.synAntSection}>
          <View style={styles.row}>
            <Text style={styles.label2}>Đồng nghĩa</Text>
            <TouchableOpacity style={{ marginLeft: width * 0.3 }}>
              <Edit size="32" color={color.lightBlue} variant="Bold" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSynonymAdd}>
              <AddSquare size="32" color={color.lightBlue} variant="Bold" />
            </TouchableOpacity>
          </View>

          {validSynonyms.length > 0 ? (
            <FlatList
              data={synonyms}
              renderItem={({ item }) => (
                <View style={styles.columnItem}>
                  <TouchableOpacity onPress={() => handleWordPress(item)}>
                    <Text style={[styles.listItem, { backgroundColor: "#FFCC99" }]}>{item}</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
            />
          ) : (
            <Text style={styles.resultText}>Hãy nhập thêm từ đồng nghĩa</Text>
          )}
        </View>
      </View>

      {/* Antonym */}
      <View style={[styles.synAntContainer, styles.shadowEffect]}>
        <View style={styles.synAntSection}>
          <View style={styles.row}>
            <Text style={styles.label2}>Trái nghĩa</Text>
            <TouchableOpacity style={{ marginLeft: width * 0.3 }}>
              <Edit size="32" color={color.lightBlue} variant="Bold" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onAntonymAdd}>
              <AddSquare size="32" color={color.lightBlue} variant="Bold" />
            </TouchableOpacity>
          </View>

          {validAntonyms.length > 0 ? (
            <FlatList
              data={antonyms}
              renderItem={({ item }) => (
                <View style={styles.columnItem}>
                  <TouchableOpacity onPress={() => handleWordPress(item)}>
                    <Text style={[styles.listItem, { backgroundColor: "#9999FF" }]}>{item}</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
            />
          ) : (
            <Text style={styles.resultText}>Hãy nhập thêm từ trái nghĩa</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default DetailCard;

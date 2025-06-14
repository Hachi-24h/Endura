import React from "react";
import { TouchableOpacity, Text, Keyboard } from "react-native";
import styles from "../../Css/detailVocal";

type Props = {
  item: any;
  navigation: any;
  setSearchText: (text: string) => void;
  setSearchResults: (list: any[]) => void;
};

export const RenderSearchItem: React.FC<Props> = ({
  item,
  navigation,
  setSearchText,
  setSearchResults
}) => (
  <TouchableOpacity
    style={styles.resultItemSearch}
    onPress={() => {
      setSearchText("");
      setSearchResults([]);
      navigation.navigate("Detail", { vocabulary: item });
      Keyboard.dismiss();
    }}
  >
    <Text style={styles.resultTextSearch}>{item.word}</Text>
    <Text style={styles.resultTextMeaning}>{item.meaning}</Text>
  </TouchableOpacity>
);

import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Keyboard
} from "react-native";
import { PenClose } from "iconsax-react-native";
import styles from "../../Css/detailVocal";

type Props = {
  navigation: any;
  searchText: string;
  setSearchText: (text: string) => void;
  setSearchResults: (list: any[]) => void;
  handleGoBack: () => void;
  width: number;
  height: number;
};

const SearchBar: React.FC<Props> = ({
  navigation,
  searchText,
  setSearchText,
  setSearchResults,
  handleGoBack,
  width,
  height
}) => {
  return (
    <View style={styles.searchBar}>
      <TouchableOpacity onPress={handleGoBack}>
        <Image source={require("../../Icon/back.png")} style={styles.backicon} />
      </TouchableOpacity>
      <TextInput
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        placeholderTextColor="#FFA500"
      />
      {searchText.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            setSearchText("");
            setSearchResults([]);
            Keyboard.dismiss();
          }}
          style={{
            position: "absolute",
            right: width * 0.05,
            justifyContent: "center",
            alignItems: "center",
            top: height * 0.034
          }}
        >
          <PenClose size="32" color="#FF8A65" variant="Outline" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

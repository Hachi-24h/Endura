import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import {
  Home,
  SearchNormal,
  Add,
  Book,
  Setting2,
} from "iconsax-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../Css/footer";
import color from "../Custom/Color";

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [active, setActive] = useState(route.name);

  const go = (routeName) => {
    setActive(routeName);
    navigation.navigate(routeName);
  };

  const renderItem = (routeName, label, Icon) => {
    const isActive = active === routeName;

    return (
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => go(routeName)}
      >
        <Icon
          size={isActive ? 28 : 22}
          color={isActive ? color.lightBlue : color.gray}
          variant={isActive ? "Bold" : "Outline"}
        />
        <Text
          style={[
            styles.label,
            isActive && styles.selectedLabel,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.footerContainer}>
      {renderItem("addtoJson", "Home", Home)}
      {renderItem("listword", "Search", SearchNormal)}
      {renderItem("addword", "Add", Add)}
      {renderItem("testword", "Test", Book)}
      {renderItem("SettingScreen", "Setting", Setting2)}
    </View>
  );
};

export default Footer;

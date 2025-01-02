import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Home, SearchNormal, Add, Notification, Profile } from "iconsax-react-native"; // Import các icon từ thư viện
import styles from "../Css/footer"; // Import CSS
import color from "../Custom/Color";
const Footer = ({ navigation }) => {
  const [selectedIcon, setSelectedIcon] = useState("home");

  const handleIconPress = (iconName) => {
    setSelectedIcon(iconName);

    // // Điều hướng màn hình
    // if (navigation) {
    //   navigation.navigate(iconName);
    // }
  };

  return (
    <View style={styles.footerContainer}>
      {/* Home Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("home")}
      >
        <Home
          size={selectedIcon === "home" ? 28 : 22}
          color={selectedIcon === "home" ? color.lightBlue  : color.gray}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "home" && styles.selectedLabel,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Search Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("search")}
      >
        <SearchNormal
           size={selectedIcon === "search" ? 28 : 22}
          color={selectedIcon === "search" ? color.lightBlue : color.gray}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "search" && styles.selectedLabel,
          ]}
        >
          Search
        </Text>
      </TouchableOpacity>

      {/* Add Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("add")}
      >
        <Add
          size={selectedIcon === "add" ? 28 : 22}
          color={selectedIcon === "add" ? color.lightBlue : color.gray}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "add" && styles.selectedLabel,
          ]}
        >
          Add
        </Text>
      </TouchableOpacity>

      {/* Notification Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("notifications")}
      >
        <Notification
            size={selectedIcon === "notifications" ? 28 : 22}
          color={selectedIcon === "notifications" ? color.lightBlue : color.gray}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "notifications" && styles.selectedLabel,
          ]}
        >
          Notify
        </Text>
      </TouchableOpacity>

      {/* Profile Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("profile")}
      >
        <Profile
          size={selectedIcon === "profile" ? 28 : 22}
          color={selectedIcon === "profile" ? color.lightBlue : color.gray}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "profile" && styles.selectedLabel,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

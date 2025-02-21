import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Home, SearchNormal, Add, Notification, Profile } from "iconsax-react-native"; // Import các icon từ thư viện
import styles from "../Css/footer"; // Import CSS
import color from "../Custom/Color";

const Footer = ({ navigation }) => {
  const [selectedIcon, setSelectedIcon] = useState("HomePage");

  const handleIconPress = (iconName) => {
    setSelectedIcon(iconName);
    // navigation.navigate(iconName);
    // // Điều hướng màn hình
    // // if (navigation) {
      
    // // }
  };

  return (
    <View style={styles.footerContainer}>
      {/* Home Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("HomePage")}
      >
        <Home
          size={selectedIcon === "HomePage" ? 28 : 22}
          color={selectedIcon === "HomePage" ? color.lightBlue  : color.gray}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "HomePage" && styles.selectedLabel,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Search Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("Detail")}
      >
        <SearchNormal
           size={selectedIcon === "Detail" ? 28 : 22}
          color={selectedIcon === "Detail" ? color.lightBlue : color.gray}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "Detail" && styles.selectedLabel,
          ]}
        >
          Search
        </Text>
      </TouchableOpacity>

      {/* Add Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("Add")}
      >
        <Add
          size={selectedIcon === "Add" ? 28 : 22}
          color={selectedIcon === "Add" ? color.lightBlue : color.gray}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "Add" && styles.selectedLabel,
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

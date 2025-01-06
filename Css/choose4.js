// LoginStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import color from '../Custom/Color';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      width: "90%",
      backgroundColor: "#fff",
      borderRadius: width * 0.05,
      padding: height * 0.03,
      elevation: 10, // Đổ bóng (Android)
      shadowColor: "#000", // Đổ bóng (iOS)
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    question: {
      fontSize: width * 0.05,
      fontWeight: "bold",
      marginBottom: height * 0.02,
      color: "#333",
    },
    answersContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: height * 0.02,
    },
    answerButton: {
      width: "47%",
      backgroundColor: "#f0f0f0",
      padding: height * 0.02,
      borderRadius: width * 0.03,
      marginBottom: height * 0.01,
      alignItems: "center",
      justifyContent: "center",
      elevation: 5, // Đổ bóng (Android)
      shadowColor: "#000", // Đổ bóng (iOS)
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    answerText: {
      fontSize: width * 0.045,
      textAlign: "center",
    },
  });

export default styles;

// import React, { useState } from "react";
// import {
//   View,
//   Button,
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   Alert,
// } from "react-native";
// import { getRandomVocabulary } from "../utils/fileSystem";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../navigation/types"; // 👈 Tùy bạn lưu type navigator ở đâu

// type Props = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

// const HomeScreen: React.FC<Props> = ({ navigation }) => {
//   const [loading, setLoading] = useState<boolean>(false);

//   const startQuiz = async () => {
//     setLoading(true);
//     try {
//       const randomWords = await getRandomVocabulary(25);
//       if (randomWords && randomWords.length > 0) {
//         console.log("📚 Đã lấy danh sách từ vựng:", randomWords);
//         navigation.navigate("QuizScreen", { vocabularyList: randomWords });
//       } else {
//         Alert.alert("Thông báo", "Không tìm thấy đủ dữ liệu để tạo quiz.");
//       }
//     } catch (error) {
//       console.error("❌ Lỗi khi tạo quiz:", error);
//       Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo quiz. Vui lòng thử lại.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📚 Chào bạn!</Text>
//       <Text style={styles.subtitle}>
//         Ấn nút dưới đây để bắt đầu bài kiểm tra từ vựng
//       </Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#007bff" />
//       ) : (
//         <Button title="📝 Bắt đầu làm bài" onPress={startQuiz} />
//       )}
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#f4f4f4",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#666",
//   },
// });

import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable'; // Thêm thư viện hiệu ứng
import LinearGradient from 'react-native-linear-gradient';
import color from '../Custom/Color'; // Đường dẫn tới file color.js

const { width, height } = Dimensions.get('window');

const Welcome02 = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#87ceeb']} // Màu gradient từ trắng sang xanh dương nhạt
      style={styles.container}
    >
      {/* Tiêu đề Mission */}
      <Animatable.Text
        animation="fadeInLeft" // Hiệu ứng xuất hiện từ trái
        duration={800}
        delay={500} // Delay 0.5 giây
        style={styles.missionTitle}
      >
      Hello, challenger!
      </Animatable.Text>

      {/* Nội dung câu 1 */}
      <Animatable.Text
        animation="fadeInLeft" // Hiệu ứng xuất hiện từ trái
        duration={800}
        delay={1000} // Delay sau tiêu đề Mission
        style={styles.missionText}
      >
        At Hachi, we value self-learning and proactivity because they help you become better.
      </Animatable.Text>

      {/* Nội dung câu 2 */}
      <Animatable.Text
        animation="fadeInLeft" // Hiệu ứng xuất hiện từ trái
        duration={800}
        delay={2000} // Delay sau câu 1
        style={styles.missionText}
      >
        I know you already have it within you.
      </Animatable.Text>

      {/* Nút Next */}
      <Animatable.View
        animation="slideInUp" // Hiệu ứng xuất hiện nhẹ nhàng
        duration={800}
        delay={100} // Delay sau câu 2
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Detail')} // Điều hướng về trang 1
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: width * 0.08, // Lớn hơn một chút
    color: color.darkGreen || '#004d40',
    fontWeight: 'bold',
    textAlign: 'left', // Căn lề trái
    marginLeft: width * 0.1, // Thụt lề trái
    marginBottom: height * 0.02,
    marginTop: height * 0.15,
  },
  missionText: {
    fontSize: width * 0.05,
    color:  '#5D7B6F',
    textAlign: 'left', // Căn lề trái
    marginLeft: width * 0.1, // Thụt lề trái
    marginRight: width * 0.1, // Thụt lề phải để cân chỉnh
    marginBottom: height * 0.02,
    lineHeight: height * 0.04, // Khoảng cách giữa các dòng
  },
  buttonContainer: {
    marginTop: height * 0.1,
    alignItems: 'center', // Canh giữa nút
  },
  button: {
    backgroundColor: color.orange || '#FF7043',
    marginTop: height * 0.2,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF', // Màu trắng cho chữ
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Welcome02;

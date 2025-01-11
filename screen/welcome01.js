import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import color from '../Custom/Color';

const { width, height } = Dimensions.get('window');

const Welcome01 = ({navigation}) => {
  return (
    <LinearGradient
      colors={['#87ceeb', '#FFFFFF']}
      style={styles.container}
    >
      {/* Logo */}
      <Animatable.Image
        animation="slideInDown" // Hiệu ứng trượt từ trên xuống
        duration={600} // Thời gian hiệu ứng (1 giây)
        source={require('../Picture/logo.png')}
        style={styles.logo}
      />

      {/* Title */}
      <Animatable.View
        animation="zoomIn" // Hiệu ứng trượt từ dưới lên
        duration={600} // Thời gian hiệu ứng (1.2 giây)
        delay={300} // Thêm độ trễ (0.5 giây)
        style={styles.titleContainer}
      >
        <Text style={styles.title}>Welcome to HACHI</Text>
        <Text style={styles.subtitle}>Your journey starts here</Text>
      </Animatable.View>

      {/* Button */}
      <Animatable.View
        animation="slideInUp" // Hiệu ứng trượt từ dưới lên
        duration={600} // Thời gian hiệu ứng (1.5 giây)
        delay={100} // Thêm độ trễ (1 giây)
        style={styles.buttonContainer}
      >
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('welcome02')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.15,
   
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    color: '#004d40',
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#00796b',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: height * 0.1,
  },
  button: {
    // backgroundColor: '#004d40',
    backgroundColor:color.orange,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: height * 0.2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Welcome01;

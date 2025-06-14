import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import styles from '../../Css/Homepage';
import * as Animatable from 'react-native-animatable';
import color from '../../Custom/Color';

const { width } = Dimensions.get('window');

const FilterSection: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <>
      <Animatable.Text
        animation={"fadeInLeft"}
        duration={1000}
        style={styles.titleMain}>Activity
      </Animatable.Text>
      <View style={styles.filterContainer}>
        {/* Cột trái */}
        <View style={styles.filterColumn}>
          <Animatable.View
            animation={"fadeInLeft"}
            duration={1000}
          >

            <TouchableOpacity style={[styles.filter_1, { backgroundColor: "#FFECB3", borderTopLeftRadius: width * 0.05, }]}
              onPress={() => navigation.navigate('QuizScreen')}
            >
              <Image source={require('../../Icon/quiz.png')} style={styles.logo} />

              <Text style={styles.filterText}>Quiz</Text>


            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View
            animation={"fadeInLeft"}
            duration={1000}
            delay={100}
          >
            <TouchableOpacity style={[styles.filter_1, { backgroundColor: "#AEDFF7", borderBottomLeftRadius: width * 0.05, }]}
              onPress={() => navigation.navigate('Detail2')}
            >
              <Image source={require('../../Icon/word.png')} style={styles.logo} />
              <Text style={styles.filterText}>Word</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        {/* Cột phải */}
        <View style={[styles.filterColumn, { backgroundColor: color.white }]} >
          <Animatable.View
            animation={"fadeInRight"}
            duration={1000}

          >
            <TouchableOpacity style={[styles.filter_1, { backgroundColor: "#A8E6CF", borderTopRightRadius: width * 0.05, }]}
              onPress={() => navigation.navigate('Detail')}
            >
              <Image source={require('../../Icon/search2.png')} style={styles.logo} />

              <Text style={styles.filterText}>Search</Text>


            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View
            animation={"fadeInRight"}
            duration={1000}
            delay={100}
          >
            <TouchableOpacity style={[styles.filter_1, { backgroundColor: "#D4A5E0", borderBottomRightRadius: width * 0.05, }]}
              onPress={() => navigation.navigate('addtoJson')}
            >
              <Image source={require('../../Icon/add.png')} style={styles.logo} />

              <Text style={styles.filterText}>Add</Text>


            </TouchableOpacity>

          </Animatable.View>
        </View>
      </View></>
  );
};

export default FilterSection;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import styles from '../../Css/Homepage';
import { SearchStatus1 } from 'iconsax-react-native';
import color from '../../Custom/Color';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const HeaderSection: React.FC<{ navigation: any; user: string }> = ({ navigation, user }) => {
   const [hello, setHello] = useState('Xin chào ,');
  return (
    <Animatable.View
      animation={"fadeInDown"}
      duration={1000}
      style={styles.header}>
      <View style={styles.box1}>
        <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Profile')}>
          <Image source={require('../../Icon/avt0.png')} style={styles.avt} />
        </TouchableOpacity>
        <View style={styles.box1_inner}>
          <Text style={{ fontSize: width * 0.045, marginBottom: height * 0.002 }}>
            {hello} <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>{user}</Text>👋
          </Text>
          <Text style={{ fontSize: width * 0.035, fontStyle: "italic", color: color.gray }}>
            Bạn đã sẵn sàng cho Quiz hôm nay chưa?
          </Text>
        </View>
      </View>
      <View style={styles.box2}>
        <View style={styles.box2_search}>
          <SearchStatus1 size="22" color="#000000" variant="Broken" />
          <TextInput
            placeholder="Tìm kiếm"
            style={styles.box2_search_input}
            // color={color.orange}
          />
        </View>
      </View>
    </Animatable.View>
  );
};

export default HeaderSection;

import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    TextInput,
    Button,
    FlatList,
    Text,
    StyleSheet,
    View,
    Alert,
    Image,
    TouchableOpacity
} from 'react-native';
import { isFileExists, saveVocabularyToFile, getVocabularyFromFile } from '../utils/fileSystem'; // Đảm bảo sử dụng react-native-fs
import Footer from './footer';
import styles from '../Css/Homepage';
const HomePage = ({ navigation }) => {
    return (
        <View style={styles.container}>

            <View style={styles.search}>
                <Image source={require('../Icon/search.png')} style={styles.iconsearch} />
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                />
            </View>
            <View style={styles.body}>
                <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Detail')}>
                   
                    <Text style={styles.text}>Vocabulary</Text>
                </TouchableOpacity>
            </View>
            <Footer navigation={navigation} />
        </View>
    )
}
export default HomePage;
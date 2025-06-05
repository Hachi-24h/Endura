import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Dimensions, ScrollView } from 'react-native';
import styles from '../Css/Homepage';
import { SearchStatus1 } from 'iconsax-react-native';
import color from '../Custom/Color';
import { getVocabularyList, getLength, getWordTypeCount } from '../utils/fileSystem';
import * as Animatable from 'react-native-animatable';


const { width, height } = Dimensions.get('window');

const HomePage = ({ navigation }) => {
    const [hello, setHello] = useState('Xin chào ,');
    const [user, setUser] = useState("Nam");
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const autoScrollRef = useRef(null);
    const [recentWords, setRecentWords] = useState([]);
    const [viewableItems, setViewableItems] = useState([]); // Lưu danh sách từ đang hiển thị
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [valueVocal, setValueVocal] = useState(0);
    const [valuetype, setValueType] = useState(null);
    // Xử lý khi từ vựng xuất hiện trên màn hình
    const onViewableItemsChanged = ({ viewableItems }) => {
        setViewableItems(viewableItems.map(item => item.index)); // Lưu lại index của các từ hiển thị
    };

    const viewabilityConfigRef = useRef({ itemVisiblePercentThreshold: 200 });

    const colorThemes = [
        { backgroundColor: '#FFEBEE', textColor1: '#D32F2F', textColor2: '#B71C1C' }, // Đỏ nhạt
        { backgroundColor: '#E3F2FD', textColor1: '#1976D2', textColor2: '#0D47A1' }, // Xanh dương nhạt
        { backgroundColor: '#E8F5E9', textColor1: '#388E3C', textColor2: '#1B5E20' }, // Xanh lá nhạt
        { backgroundColor: '#FFF3E0', textColor1: '#F57C00', textColor2: '#E65100' }, // Cam nhạt
        { backgroundColor: '#F3E5F5', textColor1: '#8E24AA', textColor2: '#6A1B9A' }, // Tím nhạt
    ];

    useEffect(() => {
        const fetchRecentWords = async () => {
            try {
                const vocabulary = await getVocabularyList();
                const length = await getLength();
                const typeCount = await getWordTypeCount();
                setValueVocal(length);
                setRecentWords(vocabulary.slice(-5).reverse()); // Lấy 5 từ gần nhất
                setValueType(typeCount);

            } catch (error) {
                console.error("Error fetching vocabulary:", error);
            }
        };
    
        fetchRecentWords();
    }, []);
    
    // console.log(valuetype);
    const startAutoScroll = () => {
        autoScrollRef.current = setInterval(() => {
            let nextIndex = (currentIndex + 1) % 3; // 4 thẻ cố định
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }, 5000); // 5 giây
    };

    useEffect(() => {
        startAutoScroll();
        return () => clearInterval(autoScrollRef.current);
    }, [currentIndex]);

    const handleScrollEnd = (event) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(slideIndex);
        clearInterval(autoScrollRef.current);
        startAutoScroll();
    };

    return (
        <ScrollView
            style={styles.container}
            onScroll={(event) => {
                const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
                    setShouldAnimate(true);
                } else {
                    setShouldAnimate(false);
                }
            }}
            scrollEventThrottle={16}
        >
            <Animatable.View
                animation={"fadeInDown"}
                duration={1000}
                style={styles.header}>
                <View style={styles.box1}>
                    <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Profile')}>
                        <Image source={require('../Icon/avt0.png')} style={styles.avt} />
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
                            color={color.orange}
                        />
                    </View>
                </View>
            </Animatable.View>

            <View style={styles.body}>
                <Animatable.Text
                    animation={"fadeInLeft"}
                    duration={1000}
                    style={styles.titleMain}>Activity
                </Animatable.Text>
                {/* Bộ lọc */}
                <View style={styles.filterContainer}>
                    {/* Cột trái */}
                    <View style={styles.filterColumn}>
                        <Animatable.View
                            animation={"fadeInLeft"}
                            duration={1000}
                        >

                            <TouchableOpacity style={[styles.filter_1, { backgroundColor: "#FFECB3", borderTopLeftRadius: width * 0.05, }]}
                                onPress={() => navigation.navigate('Add')}
                            >
                                <Image source={require('../Icon/quiz.png')} style={styles.logo} />

                                <Text style={styles.filterText}>Quiz</Text>


                            </TouchableOpacity>
                        </Animatable.View>

                        <Animatable.View
                            animation={"fadeInLeft"}
                            duration={1000}
                            delay={100}
                        >
                            <TouchableOpacity style={[styles.filter_1, { backgroundColor: "#AEDFF7", borderBottomLeftRadius: width * 0.05, }]}
                                onPress={() => navigation.navigate('Detail')}
                            >
                                <Image source={require('../Icon/word.png')} style={styles.logo} />
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
                                <Image source={require('../Icon/search2.png')} style={styles.logo} />

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
                                <Image source={require('../Icon/add.png')} style={styles.logo} />

                                <Text style={styles.filterText}>Add</Text>


                            </TouchableOpacity>

                        </Animatable.View>
                    </View>
                </View>

                {/* Slide */}
                <Animatable.Text
                    animation={"fadeInLeft"}
                    duration={1000}
                    style={styles.titleMain}>Besides
                </Animatable.Text>
                <Animatable.View
                    animation={"slideInLeft"}
                    duration={1000}
                    style={styles.slideContainer}
                >
                    <FlatList
                        ref={flatListRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        data={[1, 2, 3]} // 3 thẻ cố định
                        renderItem={({ index }) => {
                            if (index === 0) {
                                return (
                                    <View style={[styles.card, { backgroundColor: '#64B5F6' }]}>
                                        <Image source={require('../Icon/slide_vocal.png')} style={styles.courseImg} />
                                        <Text style={styles.courseTitle}>Số lượng từ vựng hiện có</Text>
                                        <Text style={styles.courseSubtitle}>1324 từ vựng</Text>
                                    </View>
                                );
                            } else if (index === 1) {
                                return (
                                    <View style={[styles.card, { backgroundColor: '#FFB74D' }]}>
                                        <Image source={require('../Icon/slide_quiz.png')} style={styles.courseImg} />
                                        <Text style={styles.courseTitle}>Advanced UX/UI</Text>
                                        <Text style={styles.courseSubtitle}>Created by UX Experts</Text>
                                    </View>
                                );
                            } else {
                                return (
                                    <View style={[styles.card, { backgroundColor: '#81C784' }]}>
                                        <Image source={require('../Icon/slide_ptich.png')} style={styles.courseImg} />
                                        <Text style={styles.courseTitle}>Mobile App Development</Text>
                                        <Text style={styles.courseSubtitle}>Created by Dev Team</Text>
                                    </View>
                                );
                            }
                        }}
                        onMomentumScrollEnd={handleScrollEnd}
                    />
                </Animatable.View>
                <View style={styles.pagination}>
                    {[0, 1, 2].map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === currentIndex ? color.gray : color.beige },
                            ]}
                        />
                    ))}
                </View>
                {/* Các từ vừa thêm gần đây*/}

                <Animatable.Text
                    animation={"fadeInLeft"}
                    duration={1000}

                    style={styles.titleMain}>Recent Added</Animatable.Text>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={recentWords}
                        keyExtractor={(item, index) => index.toString()}
                        nestedScrollEnabled={true} // ✅ Fix lỗi ScrollView
                        scrollEnabled={false} // ✅ Tránh xung đột cuộn
                        ListEmptyComponent={
                            <Text style={{ color: color.gray, fontSize: width * 0.04 }}>
                                Chưa có từ nào được thêm gần đây.
                            </Text>
                        }
                        renderItem={({ item, index }) => {
                            // Lấy bộ màu dựa theo index
                            const theme = colorThemes[index % colorThemes.length];

                            return (
                                <Animatable.View
                                    animation={shouldAnimate ? (index % 2 === 0 ? "slideInRight" : "slideInLeft") : undefined}
                                    duration={1500} // Mỗi từ xuất hiện trong 1.5s
                                    delay={index * 100} // Hiệu ứng trễ dần
                                    style={[
                                        styles.wordContainer,
                                        styles.shadowEffect,
                                        { backgroundColor: theme.backgroundColor, opacity: shouldAnimate ? 1 : 0 } // 🔥 Mặc định ẩn
                                    ]}
                                >
                                    <Text style={[styles.word, { color: theme.textColor1 }]}>
                                        {item.word}
                                    </Text>
                                    <Text
                                        style={[styles.meaning, { color: theme.textColor2 }]}
                                        numberOfLines={1} // ✅ Giới hạn 1 dòng
                                        ellipsizeMode="tail" // ✅ Hiển thị "..." nếu quá dài
                                    >
                                        {Array.isArray(item.meaning) ? item.meaning.join(', ') : "Chưa có nghĩa"}
                                    </Text>
                                </Animatable.View>
                            );
                        }}

                    />
                </View>

                       
                        {/* <QuestionModal  /> */}
            </View >
        </ScrollView >
    );
};

export default HomePage;

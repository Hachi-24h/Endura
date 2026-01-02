import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadVocabulary } from '../../utils/vocabularyStorage_NEW';
import Footer from '../footer';

const TYPE_STYLE: Record<string, { label: string; color: string }> = {
    Noun: { label: 'Noun', color: '#4f8ef7' },
    Verb: { label: 'Verb', color: '#f59e0b' },
    Adjective: { label: 'ADJ', color: '#8b5cf6' },
    Adverb: { label: 'ADV', color: '#10b981' },
};

/**
 * Chuẩn hoá meaning về array<string>
 */
const normalizeMeaningArray = (meaning: any): string[] => {
    if (Array.isArray(meaning)) return meaning;
    if (typeof meaning === 'string')
        return meaning.split(',').map(m => m.trim()).filter(Boolean);
    return [];
};

export default function ListWordScreen() {
    const nav = useNavigation<any>();

    const [rawList, setRawList] = useState<any[]>([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        loadVocabulary().then(data => {
            const normalized = data.map((item, index) => ({
                ...item,
                id: item.id ?? `word-${index}-${item.word}`, // 👈 FIX CHÍNH
                word: item.word ?? '',
                meanings: normalizeMeaningArray(item.meaning),
                type: item.type ?? 'Unknown',
            }));
            setRawList(normalized);
        });
    }, []);

    const filteredList = useMemo(() => {
        if (!query.trim()) return rawList;
        const q = query.toLowerCase();

        return rawList.filter(item => {
            const word = item.word.toLowerCase();
            const meaningText = item.meanings.join(' ').toLowerCase();
            return word.includes(q) || meaningText.includes(q);
        });
    }, [query, rawList]);

    const stats = useMemo(() => {
        const result: Record<string, number> = {};
        rawList.forEach(item => {
            result[item.type] = (result[item.type] || 0) + 1;
        });
        return result;
    }, [rawList]);

    const renderItem = ({ item }: any) => {
        const typeInfo =
            TYPE_STYLE[item.type] || { label: '?', color: '#9ca3af' };

        return (
            <View style={styles.itemCard}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.word}>{item.word}</Text>
                    <Text style={styles.meaning}>
                        {item.meanings.join(' / ')}
                    </Text>
                </View>

                <View
                    style={[
                        styles.typeBadge,
                        { backgroundColor: typeInfo.color },
                    ]}
                >
                    <Text style={styles.typeText}>{typeInfo.label}</Text>
                </View>

            </View>
        );
    };

    return (
        <View style={styles.root}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()}>
                    <Text style={styles.headerIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Danh Sách Từ Vựng</Text>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => nav.navigate('Add')}
                >
                    <Text style={styles.addText}>＋</Text>
                </TouchableOpacity>
            </View>

            {/* SEARCH */}
            <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm từ..."
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {/* SUMMARY */}
            <View style={styles.summary}>
                <Text style={styles.summaryText}>
                    Hiện có <Text style={{ fontWeight: '800' }}>{rawList.length}</Text> từ
                    vựng
                </Text>

                <View style={styles.badgeRow}>
                    {Object.keys(stats).map(type => {
                        const info = TYPE_STYLE[type];
                        if (!info) return null;
                        return (
                            <View
                                key={type}
                                style={[
                                    styles.summaryBadge,
                                    { backgroundColor: info.color },
                                ]}
                            >
                                <Text style={styles.summaryBadgeText}>
                                    {info.label} {stats[type]}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* LIST */}
            <FlatList
                data={filteredList}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            />
            <Footer />
        </View>
    );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#eaf2fb' },

    header: {
        height: 90,
        backgroundColor: '#5aa2e8',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        paddingTop: 40,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
    headerIcon: { fontSize: 22, color: '#fff' },
    addBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addText: { color: '#fff', fontSize: 22, fontWeight: '700' },

    searchBox: {
        margin: 16,
        backgroundColor: '#fff',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    searchIcon: { marginRight: 6 },
    searchInput: { flex: 1, paddingVertical: 12 },

    summary: {
        marginHorizontal: 16,
        backgroundColor: '#f0f7ff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 8,
    },
    summaryText: { marginBottom: 8 },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
    summaryBadge: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 6,
    },
    summaryBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },

    itemCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 18,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    word: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
    meaning: { fontSize: 14, color: '#6b7280' },
    typeBadge: {
        marginLeft: 12,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    typeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});

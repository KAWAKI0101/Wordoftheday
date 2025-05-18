import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


const HistoryScreen = () => {
    const [viewedWords, setViewedWords] = useState([]);

    // load data from AsyncStorge on mount 

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const stored = await AsyncStorage.getItem("viewedWords");
                console.log('RAW FROM STORAGE:', stored);
                const parsed = stored ? JSON.parse(stored) : [];

                console.log("Loaded history", parsed)
                setViewedWords(parsed);

            } catch (err) {
                console.error('Failed to load history:', err);

            }
        };
        const unsubscribe = loadHistory();

        return () => unsubscribe;
    }, [])

    //Clear all history 
    const clearHistory = async () => {
        try {
            await AsyncStorage.removeItem('viewedWords');
            setViewedWords([]);
        } catch (err) {
            console.error('Failed to clear history:', err);
        }
    }


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {
                viewedWords.length === 0 ? (
                    <Text style={styles.emptyText}> No word viewed yet. </Text>
                ) : (
                    viewedWords.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.word}>{item.word}</Text>
                            <Text style={styles.definition}>{item.definition}</Text>
                            <Text style={styles.example}> Example: {item.example}</Text>
                            <Text style={styles.date}>
                                Viewed : {new Date(item.viewedAt).toLocaleDateString()}
                            </Text>
                        </View>
                    ))
                )}


            {viewedWords.length > 0 && (
                <View style={styles.clearButton}>
                    <Button title='Clear History' onPress={clearHistory} color="#d9534f" />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    card: {
        backgroundColor: '#e0f7fa',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    word: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    definition: {
        fontSize: 16,
        marginTop: 5,
    },
    example: {
        fontSize: 14,
        marginTop: 5,
        fontStyle: 'italic',
    },
    date: {
        fontSize: 12,
        marginTop: 5,
        color: 'gray',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'gray',
        marginTop: 50,
    },
    clearButton: {
        marginTop: 20,
    },
    emptyText:{
        textAlign:"center",
        fontSize: 18,
        color:"gray",
    }
})

export default HistoryScreen

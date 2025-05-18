import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { words } from '../Dataofwords/Data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';




const HomeScreen = ({ navigation }) => {
    const [index, setIndex] = useState(0); // Start with the first word 
    const currentWord = words[index]; // Get the current word 


    const showNextWord = async () => {
        const viewedWords = {
            ...currentWord,
            viewedAt: new Date().toISOString() // save the time it was viewed
        }

        try {
            const existing = await AsyncStorage.getItem('viewedWords');
            const parsed = existing ? JSON.parse(existing) : [];

            // checking if word is already viewed Don't add
            const alreadyViewed = parsed.some(item => item.word === currentWord.word);
            if (!alreadyViewed) {
                parsed.push(viewedWords);
                await AsyncStorage.setItem('viewedWords', JSON.stringify(parsed));
            }

            // move to the next 
            const nextIndex = (index + 1) % words.length;
            setIndex(nextIndex);


        } catch (err) {
            console.error('Error storing viewed word:', err);

        }
    };

    const goToHistory = () => {
        navigation.navigate('History'); // We now load history directly in HistoryScreen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.word}> {currentWord.word} </Text>
            <Text style={styles.definition}> {currentWord.definition} </Text>
            <Text style={styles.example}> Example: {currentWord.example}</Text>


            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={showNextWord}>
                    <Icon name="autorenew" size={24} color="#fff" />
                    <Text style={styles.buttonText}>New Word</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={goToHistory}>
                    <Icon name="history" size={24} color="#fff" />
                    <Text style={styles.buttonText}>View History</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{ 
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },

    word:{
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10
    },
    definition: {
        fontSize: 18,
        marginBottom: 10
    },
    example: { fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 20
    },
    buttonContainer: { gap: 10 },
      iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
})

export default HomeScreen

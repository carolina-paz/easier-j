// src/screens/PlaybackScreen.tsx

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function PlaybackScreen() {
  // Ruta del archivo de audio grabado
  const audioUri = "file:///var/mobile/Containers/Data/Application/30339D60-0789-4938-99CE-712052D38533/Library/Caches/ExponentExperienceData/@anonymous/EasierJ-93b4ad19-2964-4267-9bde-8fc77beec939/AV/recording-597995C7-F638-484E-9D33-38D126289C48.caf";

  // Función para reproducir el audio
  async function playRecording(uri: string) {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      console.log("playing audio")
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing audio", error);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Play Recording" onPress={() => playRecording(audioUri)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

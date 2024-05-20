import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

export default function RecordAudioScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    async function requestPermissions() {
      const response = await Audio.requestPermissionsAsync();
      if (response.status !== 'granted') {
        alert('Permission to access microphone is required!');
      }
    }
    requestPermissions();
  }, []);

  const recordingOptions = {
    android: {
      extension: '.m4a',
      outputFormat: 2, // Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4
      audioEncoder: 3,  // Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.caf',
      audioQuality: 0, // Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
        numberOfChannels: 2,
        sampleRate: 44100,
      }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      setRecording(null);
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome.Button
        name="microphone"
        backgroundColor="#3b5998"
        onPress={recording ? stopRecording : startRecording}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </FontAwesome.Button>
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

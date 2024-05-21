import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios'
import FormData from 'form-data';


export default function RecordAudioScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState<string>('');
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

  const transcribeAudio = async (uri: string) => {
    const formData = new FormData();
    console.log("transcribe audio starts");
    formData.append('file', {
      uri,
      type: 'audio/x-caf',
      name: 'audio.caf',
    } as any);
  
    formData.append('model', 'whisper-1'); // Asegúrate de incluir el modelo
  
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer sk-proj-Qry6ZWxM0dIbcicfNpufT3BlbkFJFzPkqU4zR5OrcPa0avFs`,
        },
      });
      setTranscription(response.data.text);
      console.log("transcription");
    } catch (error) {
      console.error('Failed to transcribe audio', error);
    }
  };
  

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      if (uri) {
        await transcribeAudio(uri);  // Llamada a la función para transcribir el audio
      }
      setRecording(null);
    }
  };
    //


  return (
    <View style={styles.container}>
      <FontAwesome.Button
        name="microphone"
        backgroundColor="#3b5998"
        onPress={recording ? stopRecording : startRecording}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </FontAwesome.Button>
      {transcription ? <Text>{transcription}</Text> : null}
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

import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function AIProcessingCourt({
  visible,
  message,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={styles.court}>
          <ActivityIndicator
            size="large"
            color="#F0D47F"
          />
          <Text style={styles.title}>
            AI CUTOUT ACTIVE
          </Text>
          <Text style={styles.message}>
            {message ||
              'PROCESSING PORTRAIT'}
          </Text>
          <Text style={styles.note}>
            THIS ACTION RUNS ONLY AFTER
            YOUR BUTTON PRESS
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor:
      'rgba(5,3,3,0.88)',
  },
  court: {
    width: '82%',
    maxWidth: 420,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor:
      'rgba(240,212,127,0.48)',
    backgroundColor:
      'rgba(38,7,13,0.96)',
  },
  title: {
    marginTop: 16,
    color: '#F0D47F',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  message: {
    marginTop: 8,
    color: '#F8F4EA',
    fontSize: 13,
    textAlign: 'center',
  },
  note: {
    marginTop: 14,
    color:
      'rgba(248,244,234,0.56)',
    fontSize: 9,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
});

import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FreeformAIEditorWorkspace from './FreeformAIEditorWorkspace';
import MaleModelReplacementWorkspace from './MaleModelReplacementWorkspace';

export default function FullAIEditorWorkspace(props) {
  const [mode, setMode] = useState('TRANSPLANT');

  return (
    <View style={styles.root}>
      {mode === 'TRANSPLANT' ? (
        <MaleModelReplacementWorkspace {...props} />
      ) : (
        <FreeformAIEditorWorkspace {...props} />
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Switch AI Studio mode"
        onPress={() => setMode((current) => current === 'TRANSPLANT' ? 'FREEFORM' : 'TRANSPLANT')}
        style={styles.modeButton}
      >
        <Text style={styles.modeText}>
          {mode === 'TRANSPLANT' ? 'FREE' : 'SLOT'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#030202',
  },
  modeButton: {
    position: 'absolute',
    right: 14,
    bottom: 18,
    minWidth: 52,
    minHeight: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(214,166,67,0.68)',
    backgroundColor: 'rgba(5,2,3,0.90)',
    zIndex: 300,
  },
  modeText: {
    color: '#D6A643',
    fontWeight: '700',
    letterSpacing: 1,
  },
});

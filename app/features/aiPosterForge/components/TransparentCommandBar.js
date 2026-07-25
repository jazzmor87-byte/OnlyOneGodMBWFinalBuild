import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function TransparentCommandBar({ value, onChangeText, onRun }) {
  return (
    <View style={styles.shell}>
      <TextInput value={value} onChangeText={onChangeText} placeholder="Command your picture…" placeholderTextColor="rgba(240,212,127,0.48)" multiline style={styles.input} />
      <Pressable accessibilityRole="button" accessibilityLabel="Run local MBW picture command" onPress={onRun} style={styles.run}>
        <Text style={styles.runText}>♠️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flexDirection:'row', alignItems:'center', borderWidth:1, borderColor:'rgba(214,167,58,0.48)', backgroundColor:'rgba(5,3,3,0.62)', borderRadius:26, paddingLeft:14, paddingRight:7, paddingVertical:7 },
  input: { flex:1, minHeight:46, maxHeight:92, color:'#F8F4EA', textAlignVertical:'center' },
  run: { width:46, height:46, borderRadius:23, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#F0D47F', backgroundColor:'rgba(87,16,24,0.72)' },
  runText: { color:'#F0D47F', fontSize:22 },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function App() {
  return (
    <View style={s.bg}>
      <Text style={s.t}>MBW ROOT TEST 1.2.6</Text>
      <Text style={s.s}>App.js is live</Text>
    </View>
  );
}
const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#4A148C', justifyContent: 'center', alignItems: 'center' },
  t: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  s: { color: '#F8E7FF', fontSize: 16, marginTop: 12 }
});

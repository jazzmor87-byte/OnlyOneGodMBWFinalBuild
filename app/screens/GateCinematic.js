import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GateCinematic({ navigation }) {
  const moved = useRef(false);
  const go = () => {
    if (moved.current) return;
    moved.current = true;
    navigation.replace('GateLockedScreen');
  };

  useEffect(() => {
    const t = setTimeout(go, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.brand}>MEN BEHIND WALL</Text>
        <Text style={styles.line}>Two Paths. One Empire.</Text>
        <Text style={styles.note}>Safe visible entry screen active.</Text>
        <TouchableOpacity style={styles.btn} activeOpacity={0.86} onPress={go}>
          <Text style={styles.btnText}>ENTER GATE</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#111111' },
  safe: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  brand: { color: '#F4D88E', fontSize: 28, fontWeight: '800', textAlign: 'center' },
  line: { marginTop: 10, color: '#F4E8D0', fontSize: 15, textAlign: 'center' },
  note: { marginTop: 18, color: '#FFFFFF', fontSize: 13, textAlign: 'center' },
  btn: {
    marginTop: 28,
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(18,12,14,0.38)',
    borderWidth: 1.2,
    borderColor: 'rgba(212,175,55,0.42)',
    paddingVertical: 14,
    borderRadius: 16
  },
  btnText: { color: '#F4E8D0', fontSize: 14, fontWeight: '800', textAlign: 'center', letterSpacing: 0.4 }
});

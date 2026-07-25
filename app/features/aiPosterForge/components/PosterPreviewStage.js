import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function PosterPreviewStage({ posterSource, userImageUri, modeLabel }) {
  const body = (
    <View style={styles.stage}>
      {userImageUri ? <Image source={{ uri:userImageUri }} resizeMode="contain" style={styles.userImage} /> : (
        <View style={styles.empty}><Text style={styles.emptyIcon}>🖼️</Text><Text style={styles.emptyText}>USER IMAGE NOT SELECTED</Text></View>
      )}
      <View pointerEvents="none" style={styles.safeFrame} />
      <Text pointerEvents="none" style={styles.mode}>{modeLabel}</Text>
    </View>
  );
  return posterSource ? <ImageBackground source={posterSource} resizeMode="cover" style={styles.background} imageStyle={styles.backgroundImage}>{body}</ImageBackground> : <View style={styles.background}>{body}</View>;
}

const styles = StyleSheet.create({
  background: { minHeight:420, borderRadius:28, overflow:'hidden', backgroundColor:'#120607' },
  backgroundImage: { borderRadius:28 },
  stage: { flex:1, minHeight:420, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(5,3,3,0.22)' },
  userImage: { width:'72%', height:'76%' },
  empty: { alignItems:'center' },
  emptyIcon: { fontSize:48 },
  emptyText: { color:'rgba(240,212,127,0.68)', fontSize:11, letterSpacing:1.2, marginTop:10 },
  safeFrame: { position:'absolute', left:'24%', right:'24%', top:'13%', bottom:'18%', borderRadius:120, borderWidth:1, borderColor:'rgba(240,212,127,0.24)' },
  mode: { position:'absolute', bottom:18, color:'#F0D47F', fontSize:11, fontWeight:'900', letterSpacing:1 },
});

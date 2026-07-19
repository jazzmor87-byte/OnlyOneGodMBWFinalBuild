import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
export class MBWProductionErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('MBW_RUNTIME_FATAL', error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    return <SafeAreaView style={styles.root}><View style={styles.panel}><Text style={styles.title}>MBW SAFE RECOVERY</Text><Text style={styles.copy}>THE WORLD PAUSED SAFELY</Text><Pressable style={styles.button} onPress={() => this.setState({ error: null })}><Text style={styles.buttonText}>RESTART VIEW</Text></Pressable></View></SafeAreaView>;
  }
}
const styles = StyleSheet.create({ root:{flex:1,backgroundColor:'#030101',alignItems:'center',justifyContent:'center'},panel:{borderWidth:1,borderColor:'#e4bb62',borderRadius:24,padding:24,gap:14,backgroundColor:'rgba(3,1,1,0.92)'},title:{color:'#e4bb62',fontSize:18,fontWeight:'900',letterSpacing:2},copy:{color:'#ffe8aa',fontWeight:'700'},button:{borderWidth:1,borderColor:'#6d1228',borderRadius:18,padding:12,alignItems:'center'},buttonText:{color:'#ffe8aa',fontWeight:'900'} });

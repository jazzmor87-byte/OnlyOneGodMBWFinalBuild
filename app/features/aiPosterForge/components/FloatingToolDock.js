import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

export default function FloatingToolDock({ groups, selectedGroupId, onSelectGroup }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {groups.map((group) => {
        const active = selectedGroupId === group.id;
        return (
          <Pressable key={group.id} accessibilityRole="button" accessibilityLabel={group.label} onPress={() => onSelectGroup(group.id)} style={[styles.icon, active && styles.active]}>
            <Text style={styles.iconText}>{group.label.split(' ')[0]}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical:8, paddingHorizontal:2 },
  icon: { width:52, height:52, borderRadius:26, marginRight:10, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(214,167,58,0.36)', backgroundColor:'rgba(5,3,3,0.64)' },
  active: { borderColor:'#F0D47F', backgroundColor:'rgba(87,16,24,0.82)' },
  iconText: { fontSize:21 },
});

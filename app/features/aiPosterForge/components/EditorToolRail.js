import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  EDITOR_MODES,
} from '../constants/fullEditorCatalog';

export default function EditorToolRail({
  mode,
  onSelect,
}) {
  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {EDITOR_MODES.map((item) => {
          const active =
            item.id === mode;

          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={
                item.label
              }
              onPress={() =>
                onSelect?.(item.id)
              }
              style={[
                styles.tool,
                active &&
                  styles.toolActive,
              ]}
            >
              <Text style={styles.icon}>
                {item.icon}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  active &&
                    styles.labelActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor:
      'rgba(214,167,58,0.20)',
    backgroundColor:
      'rgba(5,3,3,0.94)',
  },
  content: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tool: {
    width: 74,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor:
      'rgba(214,167,58,0.14)',
  },
  toolActive: {
    borderColor: '#F0D47F',
    backgroundColor:
      'rgba(75,13,22,0.68)',
  },
  icon: {
    fontSize: 21,
  },
  label: {
    marginTop: 3,
    color:
      'rgba(248,244,234,0.56)',
    fontSize: 8,
    fontWeight: '800',
  },
  labelActive: {
    color: '#F0D47F',
  },
});

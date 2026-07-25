import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  MODE_ACTIONS,
} from '../constants/fullEditorCatalog';

export default function EditorInspector({
  mode,
  onAction,
  activeAction,
  disabled,
}) {
  const actions =
    MODE_ACTIONS[mode] || [];

  return (
    <View style={styles.root}>
      <Text style={styles.mode}>
        {mode}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.actions
        }
      >
        {actions.map((action) => {
          const active =
            activeAction === action;

          return (
            <Pressable
              key={action}
              accessibilityRole="button"
              accessibilityLabel={action}
              disabled={disabled}
              onPress={() =>
                onAction?.(action)
              }
              style={[
                styles.action,
                active &&
                  styles.actionActive,
                disabled &&
                  styles.actionDisabled,
              ]}
            >
              <Text
                style={[
                  styles.actionText,
                  active &&
                    styles.actionTextActive,
                ]}
              >
                {action}
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
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor:
      'rgba(20,5,8,0.96)',
  },
  mode: {
    paddingHorizontal: 12,
    color: '#D6A73A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  actions: {
    paddingHorizontal: 8,
    paddingTop: 7,
  },
  action: {
    marginHorizontal: 3,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor:
      'rgba(214,167,58,0.22)',
    backgroundColor:
      'rgba(5,3,3,0.55)',
  },
  actionActive: {
    borderColor: '#F0D47F',
    backgroundColor:
      'rgba(75,13,22,0.88)',
  },
  actionDisabled: {
    opacity: 0.36,
  },
  actionText: {
    color:
      'rgba(248,244,234,0.76)',
    fontSize: 10,
    fontWeight: '700',
  },
  actionTextActive: {
    color: '#F0D47F',
  },
});

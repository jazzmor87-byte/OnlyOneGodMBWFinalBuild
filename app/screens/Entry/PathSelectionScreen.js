import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

export const MBW_PATH_SELECTION_RUNTIME_CONTRACT = {
  publicHeadline: 'TWO PATHS. ONE EMPIRE.',
  masterOfLifeLabel: 'MASTER OF LIFE',
  fullAccessLabel: 'FULL ACCESS TO MBW ALL SECTIONS',
  nextRoute: 'SubscriptionSignup',
  transparentActions: true,
  bigCardsForbidden: true,
};

export default function PathSelectionScreen({ navigation }) {
  const selectPath = useCallback(
    (selectedPath) => {
      navigation?.navigate?.('SubscriptionSignup', {
        selectedPath,
        pathSelectionCompleted: true,
      });
    },
    [navigation]
  );

  return (
    <View style={styles.root} pointerEvents="box-none">
      <View style={styles.actionRail} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="MASTER OF LIFE"
          onPress={() => selectPath('MasterOfLife')}
          style={({ pressed }) => [
            styles.action,
            pressed ? styles.actionPressed : null,
          ]}
        >
          <Text style={styles.actionText}>MASTER OF LIFE</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="FULL ACCESS TO MBW ALL SECTIONS"
          onPress={() => selectPath('FullAccess')}
          style={({ pressed }) => [
            styles.action,
            pressed ? styles.actionPressed : null,
          ]}
        >
          <Text style={styles.actionText}>
            FULL ACCESS TO MBW ALL SECTIONS
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 42,
  },
  actionRail: {
    width: '100%',
    alignItems: 'center',
  },
  action: {
    minHeight: 44,
    maxWidth: 330,
    width: '100%',
    marginTop: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(214, 170, 70, 0.72)',
    backgroundColor: 'rgba(10, 5, 8, 0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  actionPressed: {
    opacity: 0.66,
    transform: [{ scale: 0.98 }],
  },
  actionText: {
    color: '#D6AA46',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textAlign: 'center',
  },
});

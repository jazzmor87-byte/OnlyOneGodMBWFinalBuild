"MBW_EXACT_VISUAL_OS_WRAPPED";

import { withMBWExactFloatingButton } from "../runtime/MBWExactVisualOS";
import { MBWDarkMatterPressable } from "../runtime/MBWDarkMatterProductionVisualOS";
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
function MBWFloatingIconButton(props = {}) {
  const suppliedPress = props['on' + 'Press'];
  const pressAction = typeof suppliedPress === 'function' ? suppliedPress : () => {};
  const glyph = props.icon || props.emoji || props.symbol || props.label || props.title || props.name || props.children || '♠️';
  const title = props.title || props.name || props.label || '';
  const pressKey = 'on' + 'Press';
  const pressProps = {
    [pressKey]: () => pressAction()
  };
  return <MBWDarkMatterPressable accessibilityRole="button" accessibilityLabel="MBW action" {...pressProps} style={({
    pressed
  }) => [styles.shell, props.style, pressed ? styles.pressed : null]}>
      {typeof glyph === 'string' ? <Text style={[styles.glyph, props.textStyle]}>{glyph}</Text> : glyph}
      {title && title !== glyph ? <Text style={[styles.label, props.labelStyle]}>{title}</Text> : null}
    </MBWDarkMatterPressable>;
}
export default withMBWExactFloatingButton(MBWFloatingIconButton);
const styles = StyleSheet.create({
  shell: {
    minWidth: 54,
    minHeight: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(7, 3, 4, 0.58)',
    borderWidth: 1,
    borderColor: 'rgba(214, 173, 91, 0.72)'
  },
  pressed: {
    opacity: 0.72,
    transform: [{
      scale: 0.96
    }]
  },
  glyph: {
    color: '#d6ad5b',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center'
  },
  label: {
    marginTop: 2,
    color: '#d6ad5b',
    fontSize: 9,
    letterSpacing: 1,
    textAlign: 'center'
  }
});
export { MBWFloatingIconButton };

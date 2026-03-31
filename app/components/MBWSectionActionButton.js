import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function MBWSectionActionButton({
  title,
  subtitle,
  badge,
  onPress,
  visual,
  floatStyle,
  textStyle,
  compact = false,
}) {
  return (
    <Animated.View style={[styles.wrap, floatStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.card,
          compact ? styles.cardCompact : null,
          visual?.edge ? { borderColor: visual.edge } : null,
        ]}
      >
        <View style={[styles.aura, visual?.buttonAura ? { backgroundColor: visual.buttonAura } : null]} pointerEvents="none" />

        <View style={styles.row}>
          <View style={[styles.badge, visual?.edge ? { borderColor: visual.edge } : null]}>
            <Text style={[styles.badgeText, visual?.text ? { color: visual.text } : null]}>{badge || "✦"}</Text>
          </View>

          <View style={styles.copy}>
            <Animated.Text style={[styles.title, visual?.text ? { color: visual.text } : null, textStyle]} numberOfLines={1}>
              {title}
            </Animated.Text>
            {!!subtitle && (
              <Animated.Text style={[styles.subtitle, textStyle]} numberOfLines={2}>
                {subtitle}
              </Animated.Text>
            )}
          </View>

          <View style={[styles.chev, visual?.edge ? { borderColor: visual.edge } : null]}>
            <Text style={[styles.chevText, visual?.text ? { color: visual.text } : null]}>›</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  card: {
    overflow: "hidden",
    borderWidth: 1.15,
    borderRadius: 18,
    backgroundColor: "rgba(8,6,6,0.34)",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cardCompact: {
    paddingVertical: 10,
    borderRadius: 16,
  },
  aura: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
    marginRight: 12,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: "800",
  },
  copy: {
    flex: 1,
  },
  title: {
    color: "#FAE8B8",
    fontSize: 15,
    fontWeight: "900",
  },
  subtitle: {
    color: "#F7EBCB",
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15,
  },
  chev: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.16)",
    marginLeft: 10,
  },
  chevText: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 21,
  },
});

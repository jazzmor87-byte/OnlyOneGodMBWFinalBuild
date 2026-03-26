import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function collectRouteNames(state, out = new Set()) {
  if (!state) return out;
  if (Array.isArray(state.routeNames)) state.routeNames.forEach((x) => out.add(x));
  if (Array.isArray(state.routes)) {
    state.routes.forEach((r) => {
      if (r?.name) out.add(r.name);
      if (r?.state) collectRouteNames(r.state, out);
    });
  }
  return out;
}

function resolveRoute(navigation, candidates = []) {
  const state = navigation?.getState?.();
  const names = collectRouteNames(state);
  for (const c of candidates) {
    if (names.has(c)) return c;
  }
  return candidates[0] || null;
}

export default function EntryStaticScreen({
  title,
  subtitle,
  asset,
  primaryLabel,
  primaryRoutes = [],
  secondaryLabel,
  secondaryRoutes = [],
}) {
  const navigation = useNavigation();

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  return (
    <ImageBackground source={asset} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.overlay}>
          <View style={styles.copy}>
            <Text style={styles.title}>{title}</Text>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          <View style={styles.actions}>
            {!!primaryLabel && (
              <TouchableOpacity style={styles.primaryBtn} onPress={() => go(primaryRoutes)}>
                <Text style={styles.primaryText}>{primaryLabel}</Text>
              </TouchableOpacity>
            )}
            {!!secondaryLabel && (
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => go(secondaryRoutes)}>
                <Text style={styles.secondaryText}>{secondaryLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#050505' },
  safe: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  copy: {
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignSelf: 'stretch',
  },
  title: {
    color: '#F1D27A',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#F7E8BD',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: 'rgba(120,0,38,0.82)',
    borderWidth: 1.4,
    borderColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 16,
  },
  primaryText: {
    color: '#F7E8BD',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(0,0,0,0.42)',
    borderWidth: 1.1,
    borderColor: '#7A5A20',
    paddingVertical: 11,
    borderRadius: 16,
  },
  secondaryText: {
    color: '#D4AF37',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
});

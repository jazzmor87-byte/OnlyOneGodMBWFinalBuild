import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPosterPoolForScreen, pickPosterForIndex } from "../../../core/posterResolver.generated";

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
  const names = collectRouteNames(navigation?.getState?.());
  for (const c of candidates) {
    if (names.has(c)) return c;
  }
  return candidates[0] || null;
}

export default function realm_main_alt() {
  const navigation = useNavigation();
  const __mbwPosterPool = getPosterPoolForScreen("app/screens/finalux/realm_main_alt.js", "realm_main_alt");
  const __mbwPickedPoster = pickPosterForIndex(__mbwPosterPool, 0) || require("../../assets/mbw_luxscreens/mb's_world_entry.png");

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  return (
    <ImageBackground source={__mbwPickedPoster} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.overlay}>
          <View style={styles.copy}>
            <Text style={styles.title}>REALM MAIN ALT</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => go(['RealmMain', 'MBWHome', 'RealmHome', 'HomeHub'])}>
              <Text style={styles.primaryText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => go(["mb's_world_entry", 'main_hub', 'HomeHub', 'MBWHome', 'RealmHome'])}>
              <Text style={styles.secondaryText}>Home</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  copy: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: {
    color: '#F4D88E',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  actions: { gap: 10 },
  primaryBtn: {
    backgroundColor: 'rgba(92,10,42,0.72)',
    borderWidth: 1.2,
    borderColor: '#D4AF37',
    paddingVertical: 11,
    borderRadius: 14,
  },
  primaryText: {
    color: '#FAE8B8',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderWidth: 1,
    borderColor: '#7A5A20',
    paddingVertical: 10,
    borderRadius: 14,
  },
  secondaryText: {
    color: '#D4AF37',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
  },
});

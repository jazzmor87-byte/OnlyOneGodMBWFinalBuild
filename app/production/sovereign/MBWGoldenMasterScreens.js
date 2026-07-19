import { withMBWExactVisualOS } from "../../runtime/MBWExactVisualOS";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { MBWActionButton, MBWBackButton, MBWInput, MBWListItem, MBWOneVisualSurface, MBWRow, MBWSectionTitle, MBWStatus } from './MBWOneVisualSurface';
import { MBW_MAIN_ROUTES } from './MBWGoldenMasterRegistry';
import { MBW_CONSENT_SECTIONS, MBW_PRIVACY_SECTIONS, MBW_ROUTE_LABELS, MBW_TERMS_SECTIONS, mbwVisibleMainRoutes } from './MBWReleaseContracts';
import { useMBWGoldenMaster } from './MBWGoldenMasterStore';
import { useMBWProduction } from "../MBWProductionProvider";
import { MBWSovereignBoundary } from "../../sovereign/index";
const CINEMATIC = require("../../assets/cinematic/mbw_cinematic.mp4");
const DEFAULT_SEED_VISUAL = require("../../assets/mbw_all_pad/ACE_MBW_ICON.png");
const TIERS = [{
  tier: '111',
  badge: 'BLACK',
  amount: 26,
  currency: 'USD'
}, {
  tier: '222',
  badge: 'GOLDEN',
  amount: 53,
  currency: 'USD'
}, {
  tier: '333',
  badge: 'MAROON',
  amount: 79.30,
  currency: 'USD'
}, {
  tier: '444',
  badge: 'ACE',
  amount: 105.99,
  currency: 'USD'
}];
const HUB_ORBIT_POSITIONS = Object.freeze([{
  top: '2%',
  left: '41%'
}, {
  top: '10%',
  left: '12%'
}, {
  top: '10%',
  right: '12%'
}, {
  top: '27%',
  left: '2%'
}, {
  top: '27%',
  right: '2%'
}, {
  top: '45%',
  left: '8%'
}, {
  top: '45%',
  right: '8%'
}, {
  top: '61%',
  left: '2%'
}, {
  top: '61%',
  right: '2%'
}, {
  top: '76%',
  left: '14%'
}, {
  top: '76%',
  right: '14%'
}, {
  top: '85%',
  left: '33%'
}, {
  top: '85%',
  right: '33%'
}]);
function GateStarMotion({
  children,
  amplitude = 92,
  duration = 2300
}) {
  const vertical = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([Animated.timing(vertical, {
      toValue: 1,
      duration,
      useNativeDriver: true
    }), Animated.timing(vertical, {
      toValue: -1,
      duration,
      useNativeDriver: true
    })]));
    loop.start();
    return () => loop.stop();
  }, [duration, vertical]);
  const translateY = vertical.interpolate({
    inputRange: [-1, 1],
    outputRange: [-amplitude, amplitude]
  });
  return <Animated.View style={[styles.gateMotion, {
    transform: [{
      translateY
    }]
  }]}>
      {children}
    </Animated.View>;
}
function Shell({
  routeName,
  navigation,
  children,
  showSeed = true,
  scroll = true
}) {
  return <MBWSovereignBoundary routeName={routeName}>
      <MBWOneVisualSurface routeName={routeName} navigation={navigation} showSeed={showSeed} scroll={scroll}>
        {children}
      </MBWOneVisualSurface>
    </MBWSovereignBoundary>;
}
function CompleteState({
  state
}) {
  return state.lifecycle.lastError ? <MBWStatus danger>{state.lifecycle.lastError}</MBWStatus> : null;
}
export function CinematicIntroScreen({
  navigation
}) {
  const [phase, setPhase] = useState('WELCOME TO');
  useEffect(() => {
    const wordTimer = setTimeout(() => setPhase('MBW'), 5000);
    const routeTimer = setTimeout(() => navigation.replace('GateLocked'), 11000);
    return () => {
      clearTimeout(wordTimer);
      clearTimeout(routeTimer);
    };
  }, [navigation]);
  return <View style={styles.cinematicRoot}>
      <Video source={CINEMATIC} shouldPlay isLooping={false} resizeMode={ResizeMode.COVER} style={StyleSheet.absoluteFill} useNativeControls={false} />
      <View pointerEvents="none" style={styles.cinematicVeil} />
      <Text style={phase === 'MBW' ? styles.cinematicMBW : styles.cinematicWelcome}>{phase}</Text>
    </View>;
}
export function GateLockedScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const production = useMBWProduction();
  const [secret, setSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const locked = state.security.gateLockedUntil > Date.now();
  const unlock = async () => {
    if (locked || busy || !secret.trim()) return;
    const value = secret.trim();
    if (value.toUpperCase() === 'ONLYONEGOD') {
      setSecret('');
      navigation.replace('GateOpen');
      return;
    }
    setBusy(true);
    try {
      await production.sovereignAccess(value);
      setSecret('');
      navigation.reset({
        index: 0,
        routes: [{
          name: 'MainHub'
        }]
      });
    } catch (_) {
      dispatch({
        type: 'GATE_FAILURE'
      });
    } finally {
      setBusy(false);
    }
  };
  return <Shell routeName="GateLocked" navigation={navigation} showSeed={false} scroll={false}>
      <View style={styles.gateScene}>
        <GateStarMotion amplitude={84}>
          <MBWActionButton icon="✦" label="ENTER" compact iconOnly onPress={unlock} disabled={locked || busy || !secret.trim()} />
        </GateStarMotion>
        <View style={styles.gateInputDock}>
          <MBWInput value={secret} onChangeText={setSecret} placeholder="ONLYONEGOD" secureTextEntry onSubmitEditing={unlock} />
          <CompleteState state={state} />
        </View>
      </View>
    </Shell>;
}
export function GateOpenScreen({
  navigation
}) {
  const {
    state
  } = useMBWGoldenMaster();
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace(state.lifecycle.firstRunComplete ? 'MainHub' : 'PathSelection'), 5000);
    return () => clearTimeout(timer);
  }, [navigation, state.lifecycle.firstRunComplete]);
  return <Shell routeName="GateOpen" navigation={navigation} showSeed={false} scroll={false}>
      <View style={styles.gateScene}>
        <GateStarMotion amplitude={112} duration={2600}>
          <Text style={styles.gateStar}>✦</Text>
        </GateStarMotion>
      </View>
    </Shell>;
}
export function PathSelectionScreen({
  navigation
}) {
  const {
    dispatch
  } = useMBWGoldenMaster();
  const choose = path => {
    dispatch({
      type: 'PATH',
      path
    });
    navigation.navigate('SubscriptionSignup');
  };
  return <Shell routeName="PathSelection" navigation={navigation} scroll={false}>
      <View style={styles.pathScene}>
        <View style={[styles.pathChoice, styles.pathChoiceLeft]}>
          <MBWActionButton compact icon="♛" label="MASTER OF LIFE" onPress={() => choose('MASTER_OF_LIFE')} />
        </View>
        <View style={[styles.pathChoice, styles.pathChoiceRight]}>
          <MBWActionButton compact icon="♠" label="FULL MBW" onPress={() => choose('FULL_MBW_APP')} />
        </View>
        <View style={styles.pathReturn}>
          <MBWBackButton navigation={navigation} />
        </View>
      </View>
    </Shell>;
}
export function SubscriptionSignupScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const production = useMBWProduction();
  const [name, setName] = useState(state.userSeed.displayName === 'ACE' ? '' : state.userSeed.displayName);
  const [phone, setPhone] = useState(state.auth.phone || '');
  const [tier, setTier] = useState(null);
  const [busy, setBusy] = useState(false);
  const ready = state.auth.signedUp && ['ACTIVE', 'GRACE', 'SOVEREIGN'].includes(state.subscription.status) && state.safety.privacyAccepted && state.safety.termsAccepted && state.safety.consentAccepted;
  const createProfile = async () => {
    const normalizedName = name.trim();
    const normalizedPhone = phone.replace(/[^0-9+]/g, '');
    if (normalizedName.length < 2 || normalizedPhone.replace(/\D/g, '').length < 7) {
      dispatch({
        type: 'ERROR',
        message: 'DISPLAY NAME AND WHATSAPP NUMBER REQUIRED'
      });
      return;
    }
    setBusy(true);
    try {
      await production.createProfile({
        displayName: normalizedName.toUpperCase(),
        whatsapp: normalizedPhone,
        path: state.userSeed.path || 'FULL_MBW_APP'
      });
    } catch (error) {
      dispatch({
        type: 'ERROR',
        message: String(error?.message || error)
      });
    } finally {
      setBusy(false);
    }
  };
  const acceptLegal = async () => {
    setBusy(true);
    try {
      await production.acceptLegal(MBW_LEGAL_VERSION);
    } catch (error) {
      dispatch({
        type: 'ERROR',
        message: String(error?.message || error)
      });
    } finally {
      setBusy(false);
    }
  };
  const purchase = async () => {
    if (!tier) {
      dispatch({
        type: 'ERROR',
        message: 'SELECT TIER'
      });
      return;
    }
    setBusy(true);
    try {
      await production.purchaseTier(tier.tier);
    } catch (error) {
      dispatch({
        type: 'ERROR',
        message: String(error?.message || error)
      });
    } finally {
      setBusy(false);
    }
  };
  const restore = async () => {
    setBusy(true);
    try {
      await production.restorePurchases();
    } catch (error) {
      dispatch({
        type: 'ERROR',
        message: String(error?.message || error)
      });
    } finally {
      setBusy(false);
    }
  };
  const finish = () => {
    if (!ready) {
      dispatch({
        type: 'ERROR',
        message: 'COMPLETE PROFILE · ENTITLEMENT · LEGAL'
      });
      return;
    }
    dispatch({
      type: 'FIRST_RUN_COMPLETE'
    });
    navigation.reset({
      index: 0,
      routes: [{
        name: 'MainHub'
      }]
    });
  };
  return <Shell routeName="SubscriptionSignup" navigation={navigation}>
      <View style={styles.signupScene}>
        <MBWInput value={name} onChangeText={setName} placeholder="DISPLAY NAME" />
        <MBWInput value={phone} onChangeText={setPhone} placeholder="WHATSAPP NUMBER" keyboardType="phone-pad" />
        <MBWRow><MBWActionButton icon="✓" label="CREATE PROFILE" onPress={createProfile} selected={state.auth.signedUp} disabled={busy} /></MBWRow>
        <MBWRow>{TIERS.map(item => <MBWActionButton compact key={item.tier} icon={item.tier === '444' ? '♛' : '♠'} label={`${item.tier} · $${item.amount}`} selected={tier?.tier === item.tier} onPress={() => setTier(item)} />)}</MBWRow>
        <MBWRow>
          <MBWActionButton icon="💳" label="PURCHASE" onPress={purchase} disabled={!state.auth.signedUp || !tier || busy} />
          <MBWActionButton icon="↻" label="RESTORE" onPress={restore} disabled={busy} />
        </MBWRow>
        <MBWRow><MBWActionButton compact icon="⚖️" label="ACCEPT 18+ · PRIVACY · TERMS · CONSENT" onPress={acceptLegal} selected={state.safety.privacyAccepted && state.safety.termsAccepted && state.safety.consentAccepted} disabled={busy} /></MBWRow>
        <MBWRow><MBWActionButton icon="✦" label="ENTER MBW" onPress={finish} selected={ready} disabled={!ready || busy} /></MBWRow>
        {production.error ? <MBWStatus danger>{production.error}</MBWStatus> : null}
      </View>
    </Shell>;
}
export function MainHubScreen({
  navigation
}) {
  const {
    state,
    navigateChecked
  } = useMBWGoldenMaster();
  const visibleRoutes = mbwVisibleMainRoutes(state, MBW_MAIN_ROUTES);
  return <Shell routeName="MainHub" navigation={navigation} scroll={false}>
      <View style={styles.hubOrbit}>
        {visibleRoutes.map(([route, icon], index) => <View key={route} style={[styles.hubOrbitSlot, HUB_ORBIT_POSITIONS[index % HUB_ORBIT_POSITIONS.length]]}>
            <MBWActionButton compact icon={icon} label={MBW_ROUTE_LABELS[route] || route} onPress={() => navigateChecked(navigation, route)} />
          </View>)}
      </View>
      {state.lifecycle.lastError ? <MBWStatus danger>{state.lifecycle.lastError}</MBWStatus> : null}
    </Shell>;
}
export function MasterOfLifeScreen({
  navigation
}) {
  const {
    state
  } = useMBWGoldenMaster();
  const completion = [state.auth.signedUp, state.auth.phoneVerified, state.subscription.status === 'TIER_SELECTED', state.safety.privacyAccepted, state.aiPoster.history.length > 0].filter(Boolean).length;
  return <Shell routeName="MasterOfLife" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>LIFE CORE {completion}/5</MBWSectionTitle>
      <MBWListItem icon="🌱" title={state.userSeed.displayName} subtitle={`${state.userSeed.tier} · ${state.userSeed.badge} · ${state.userSeed.path || 'PATH PENDING'}`} />
      <MBWListItem icon="🪙" title="COINS" right={String(state.coins.balance)} onPress={() => navigation.navigate('MasterOfCoins')} />
      <MBWListItem icon="❤️" title="MATCHES" right={String(state.matchmaking.matches.length)} onPress={() => navigation.navigate('Matchmaking')} />
      <MBWListItem icon="🧳" title="BOOKINGS" right={String(state.travel.bookings.length)} onPress={() => navigation.navigate('TravelLocal')} />
      <MBWListItem icon="📸" title="POSTERS" right={String(state.aiPoster.history.length)} onPress={() => navigation.navigate('AIPoster')} />
      <MBWListItem icon="⚙️" title="ACCOUNT AND SAFETY" subtitle="PRIVACY · TERMS · RESET" onPress={() => navigation.navigate('Settings')} />
    </Shell>;
}
export function MatchmakingScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const profile = state.matchmaking.profiles[state.matchmaking.cursor % state.matchmaking.profiles.length];
  return <Shell routeName="Matchmaking" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>{profile.name} · {profile.age}</MBWSectionTitle>
      <MBWStatus>{profile.city} · TIER {profile.tier} · {profile.compatibility}%</MBWStatus>
      <MBWRow>
        <MBWActionButton icon="✕" label="PASS" onPress={() => dispatch({
        type: 'MATCH_SWIPE',
        direction: 'PASS'
      })} />
        <MBWActionButton icon="❤️" label="LIKE" onPress={() => dispatch({
        type: 'MATCH_SWIPE',
        direction: 'LIKE'
      })} />
      </MBWRow>
      <MBWSectionTitle>MATCHES</MBWSectionTitle>
      {state.matchmaking.matches.length === 0 ? <MBWStatus>NO MATCH YET</MBWStatus> : state.matchmaking.matches.map(item => <MBWListItem key={item.id} icon="💘" title={item.name} subtitle={`${item.compatibility}% · ${item.city}`} onPress={() => {
      dispatch({
        type: 'SELECT_MATCH',
        id: item.id
      });
      navigation.navigate('MatchChat');
    }} />)}
    </Shell>;
}
function MatchChatScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const [text, setText] = useState('');
  const match = state.matchmaking.matches.find(item => item.id === state.matchmaking.selectedMatchId);
  const messages = state.matchmaking.chats[state.matchmaking.selectedMatchId] || [];
  const send = () => {
    if (!match || !text.trim()) return;
    dispatch({
      type: 'CHAT',
      id: match.id,
      text
    });
    setText('');
  };
  return <Shell routeName="MatchChat" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>{match?.name || 'SELECT A MATCH'}</MBWSectionTitle>
      {messages.map(message => <MBWListItem key={message.id} icon={message.sender === 'ME' ? '♠️' : '💘'} title={message.sender} subtitle={message.text} />)}
      <MBWInput value={text} onChangeText={setText} placeholder="MESSAGE" multiline />
      <MBWRow><MBWActionButton icon="➤" label="SEND" onPress={send} disabled={!match || !text.trim()} /></MBWRow>
    </Shell>;
}
const __MBWVisual_MatchChatScreen = withMBWExactVisualOS(MatchChatScreen, {
  screenId: "MatchChatScreen"
});
export { __MBWVisual_MatchChatScreen as MatchChatScreen };
export function GamesScreen({
  navigation
}) {
  const {
    dispatch,
    navigateChecked
  } = useMBWGoldenMaster();
  const open = game => {
    dispatch({
      type: 'SELECT_GAME',
      game
    });
    navigateChecked(navigation, 'GameRoom');
  };
  return <Shell routeName="Games" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWRow>
        <MBWActionButton icon="🎲" label="LUDO" onPress={() => open('LUDO')} />
        <MBWActionButton icon="🂡" label="SEEP / SWEEP" onPress={() => open('SEEP')} />
        <MBWActionButton icon="🎯" label="SICBO" onPress={() => open('SICBO')} />
        <MBWActionButton icon="🏆" label="VAULT" onPress={() => navigateChecked(navigation, 'MasterOfGames')} />
      </MBWRow>
    </Shell>;
}
export function GameRoomScreen({
  navigation
}) {
  const MBWLiveGameZone = require("../../games/MBWLiveGameZone").default;
  return <MBWLiveGameZone navigation={navigation} />;
}
export function MasterOfGamesScreen({
  navigation
}) {
  const {
    state
  } = useMBWGoldenMaster();
  return <Shell routeName="MasterOfGames" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>GAME HISTORY</MBWSectionTitle>
      {state.games.history.length === 0 ? <MBWStatus>PLAY A GAME TO OPEN HISTORY</MBWStatus> : state.games.history.map(item => <MBWListItem key={item.id} icon={item.won ? '🏆' : '🎲'} title={item.game} subtitle={item.detail} right={item.won ? 'WIN' : 'PLAYED'} />)}
    </Shell>;
}
export function MasterOfCoinsScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const claimedToday = state.coins.lastDailyClaim && state.coins.lastDailyClaim.slice(0, 10) === new Date().toISOString().slice(0, 10);
  return <Shell routeName="MasterOfCoins" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>{state.coins.balance} COINS</MBWSectionTitle>
      <MBWRow><MBWActionButton icon="5️⃣" label="DAILY 55" onPress={() => dispatch({
        type: 'DAILY_COINS'
      })} disabled={claimedToday} selected={claimedToday} /></MBWRow>
      {state.coins.ledger.map(item => <MBWListItem key={item.id} icon={item.type === 'CREDIT' ? '➕' : '➖'} title={item.reason} subtitle={item.at.slice(0, 10)} right={`${item.type === 'CREDIT' ? '+' : '-'}${item.amount}`} />)}
    </Shell>;
}
function TravelScreen({
  routeName,
  navigation,
  mode
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const trips = mode === 'LOCAL' ? state.travel.local : state.travel.overseas;
  const [hostTitle, setHostTitle] = useState('');
  const [hostPlace, setHostPlace] = useState('');
  return <Shell routeName={routeName} navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {trips.map(trip => <MBWListItem key={trip.id} icon={mode === 'LOCAL' ? '🧭' : '✈️'} title={trip.title} subtitle={`${trip.place} · ${trip.host}`} right={`$${trip.price}`} onPress={() => {
      dispatch({
        type: 'TRAVEL_SELECT',
        id: trip.id
      });
      navigation.navigate('TravelBooking', {
        mode
      });
    }} />)}
      <MBWSectionTitle>HOST</MBWSectionTitle>
      <MBWInput value={hostTitle} onChangeText={setHostTitle} placeholder="HOST TITLE" />
      <MBWInput value={hostPlace} onChangeText={setHostPlace} placeholder="PLACE" />
      <MBWRow><MBWActionButton icon="🏠" label="LIST HOST" onPress={() => {
        if (hostTitle.trim() && hostPlace.trim()) {
          dispatch({
            type: 'TRAVEL_HOST',
            title: hostTitle.trim(),
            place: hostPlace.trim(),
            capacity: 1
          });
          setHostTitle('');
          setHostPlace('');
        }
      }} /></MBWRow>
    </Shell>;
}
export function TravelLocalScreen(props) {
  return <TravelScreen {...props} routeName="TravelLocal" mode="LOCAL" />;
}
export function TravelOverseasScreen(props) {
  return <TravelScreen {...props} routeName="TravelOverseas" mode="OVERSEAS" />;
}
function TravelBookingScreen({
  navigation,
  route
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const all = [...state.travel.local, ...state.travel.overseas];
  const trip = all.find(item => item.id === state.travel.selectedTripId);
  return <Shell routeName="TravelBooking" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>{trip?.title || 'SELECT A TRIP'}</MBWSectionTitle>
      {trip ? <>
        <MBWStatus>{trip.place} · ${trip.price} · {route?.params?.mode || 'TRAVEL'}</MBWStatus>
        <MBWRow><MBWActionButton icon="🔖" label="SAVE" selected={state.travel.saved.includes(trip.id)} onPress={() => dispatch({
          type: 'TRAVEL_SAVE',
          id: trip.id
        })} /><MBWActionButton icon="✅" label="BOOK" onPress={() => dispatch({
          type: 'TRAVEL_BOOK',
          trip
        })} /></MBWRow>
      </> : null}
      <MBWSectionTitle>BOOKINGS</MBWSectionTitle>
      {state.travel.bookings.map(item => <View key={item.id}>
          <MBWListItem icon="🧳" title={item.title} subtitle={item.status} right={`$${item.price}`} />
          {item.status !== 'CANCELLED' ? <MBWRow><MBWActionButton icon="✕" label="CANCEL" onPress={() => dispatch({
          type: 'TRAVEL_CANCEL',
          id: item.id
        })} /></MBWRow> : null}
        </View>)}
    </Shell>;
}
const __MBWVisual_TravelBookingScreen = withMBWExactVisualOS(TravelBookingScreen, {
  screenId: "TravelBookingScreen"
});
export { __MBWVisual_TravelBookingScreen as TravelBookingScreen };
export function MerchandiseScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const total = state.commerce.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return <Shell routeName="Merchandise" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {state.commerce.products.map(product => <MBWListItem key={product.id} icon="💎" title={product.title} subtitle="MBW PRODUCT" right={`$${product.price}`} onPress={() => dispatch({
      type: 'CART_ADD',
      product
    })} />)}
      <MBWSectionTitle>CART ${total}</MBWSectionTitle>
      {state.commerce.cart.map(item => <MBWListItem key={item.id} icon="🛍️" title={item.title} subtitle={`QTY ${item.qty}`} right={`$${item.price * item.qty}`} onPress={() => dispatch({
      type: 'CART_REMOVE',
      id: item.id
    })} />)}
      <MBWRow><MBWActionButton icon="🧾" label="CHECKOUT" disabled={!state.commerce.cart.length} onPress={() => {
        dispatch({
          type: 'CHECKOUT'
        });
        navigation.navigate('CommerceReceipt');
      }} /></MBWRow>
    </Shell>;
}
function CommerceReceiptScreen({
  navigation
}) {
  const {
    state
  } = useMBWGoldenMaster();
  return <Shell routeName="CommerceReceipt" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {state.commerce.orders.length === 0 ? <MBWStatus>NO ORDER YET</MBWStatus> : state.commerce.orders.map(order => <MBWListItem key={order.id} icon="🧾" title={order.id} subtitle={`${order.items.length} ITEMS · ${order.status}`} right={`$${order.total}`} />)}
    </Shell>;
}
const __MBWVisual_CommerceReceiptScreen = withMBWExactVisualOS(CommerceReceiptScreen, {
  screenId: "CommerceReceiptScreen"
});
export { __MBWVisual_CommerceReceiptScreen as CommerceReceiptScreen };
export function KamashastraScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const keys = Object.keys(state.kamashastra.values);
  return <Shell routeName="Kamashastra" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {keys.map(key => <View key={key}><MBWSectionTitle>{key.toUpperCase()} · {state.kamashastra.values[key]}</MBWSectionTitle><MBWRow>{[2, 5, 8, 10].map(value => <MBWActionButton key={value} icon={value >= 8 ? '🔥' : '⚜️'} label={String(value)} selected={state.kamashastra.values[key] === value} onPress={() => dispatch({
          type: 'KAMA_VALUE',
          key,
          value
        })} />)}</MBWRow></View>)}
      <MBWRow><MBWActionButton icon="⚜️" label="CALCULATE" onPress={() => dispatch({
        type: 'KAMA_RESULT'
      })} /></MBWRow>
      {state.kamashastra.result ? <MBWStatus>{state.kamashastra.result.score}% · {state.kamashastra.result.label}</MBWStatus> : null}
    </Shell>;
}
export function LiveLoungeScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const [story, setStory] = useState('');
  const aceAllowed = state.userSeed.tier === '444';
  return <Shell routeName="LiveLounge" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWRow>
        <MBWActionButton icon={state.social.livePreview ? '🔴' : '🎙️'} label={state.social.livePreview ? 'END LIVE' : 'GO LIVE'} selected={state.social.livePreview} disabled={!aceAllowed} onPress={() => dispatch({
        type: 'LIVE_TOGGLE'
      })} />
      </MBWRow>
      {!aceAllowed ? <MBWStatus danger>ACE 444 REQUIRED</MBWStatus> : null}
      <MBWInput value={story} onChangeText={setStory} placeholder="STORY" multiline />
      <MBWRow><MBWActionButton icon="📡" label="POST STORY" disabled={!story.trim()} onPress={() => {
        dispatch({
          type: 'STORY_ADD',
          text: story
        });
        setStory('');
      }} /></MBWRow>
      {state.social.stories.filter(item => item.expiresAt > Date.now()).map(item => <MBWListItem key={item.id} icon="📡" title="STORY" subtitle={item.text} />)}
    </Shell>;
}
export function MensLoungeScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const [post, setPost] = useState('');
  return <Shell routeName="MensLounge" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWInput value={post} onChangeText={setPost} placeholder="POST" multiline />
      <MBWRow><MBWActionButton icon="♠️" label="PUBLISH" disabled={!post.trim()} onPress={() => {
        dispatch({
          type: 'POST_ADD',
          text: post
        });
        setPost('');
      }} /></MBWRow>
      {state.social.posts.map(item => <View key={item.id}><MBWListItem icon="♠️" title={item.author} subtitle={item.text} /><MBWRow><MBWActionButton icon="🚨" label="REPORT" onPress={() => dispatch({
          type: 'REPORT',
          target: item.id,
          reason: 'USER REPORT'
        })} /><MBWActionButton icon="⛔" label="BLOCK" onPress={() => dispatch({
          type: 'BLOCK',
          target: item.author
        })} /></MBWRow></View>)}
    </Shell>;
}
export function NearbyScreen({
  navigation
}) {
  const {
    state,
    requestNearby
  } = useMBWGoldenMaster();
  return <Shell routeName="Nearby" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWRow><MBWActionButton icon="📍" label="SCAN NEARBY" onPress={requestNearby} /></MBWRow>
      {state.nearby.results.map(item => <MBWListItem key={item.id} icon="📍" title={item.name} subtitle={`${item.city} · ${item.compatibility}%`} right={`${item.distanceKm} km`} />)}
      {state.nearby.permission === 'DENIED' ? <MBWStatus danger>ENABLE LOCATION IN ANDROID SETTINGS</MBWStatus> : null}
    </Shell>;
}
export function AIPosterScreen({
  navigation
}) {
  const {
    state,
    pickPoster,
    rotatePoster,
    cropPoster,
    savePoster
  } = useMBWGoldenMaster();
  return <Shell routeName="AIPoster" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {state.aiPoster.currentUri ? <Image source={{
      uri: state.aiPoster.currentUri
    }} style={styles.posterPreview} resizeMode="contain" /> : <MBWStatus>IMPORT ONE IMAGE</MBWStatus>}
      <MBWRow>
        <MBWActionButton icon="📁" label="IMPORT" onPress={pickPoster} />
        <MBWActionButton icon="↻" label="ROTATE" onPress={rotatePoster} disabled={!state.aiPoster.currentUri} />
        <MBWActionButton icon="✂️" label="CROP" onPress={cropPoster} disabled={!state.aiPoster.currentUri} />
        <MBWActionButton icon="💾" label="SAVE" onPress={savePoster} disabled={!state.aiPoster.currentUri} />
        <MBWActionButton icon="🖼️" label="HISTORY" onPress={() => navigation.navigate('ProfilePoster')} />
      </MBWRow>
      {state.aiPoster.lastError ? <MBWStatus danger>{state.aiPoster.lastError}</MBWStatus> : null}
    </Shell>;
}
export function ProfilePosterScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  return <Shell routeName="ProfilePoster" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {state.aiPoster.history.length === 0 ? <MBWStatus>NO SAVED POSTER</MBWStatus> : state.aiPoster.history.map(item => <Pressable key={item.id} accessibilityRole="button" onPress={() => dispatch({
      type: 'SEED_UPDATE',
      patch: {
        profilePoster: item.uri
      }
    })}><Image source={{
        uri: item.uri
      }} style={styles.posterHistory} /></Pressable>)}
    </Shell>;
}
export function SettingsScreen({
  navigation
}) {
  const routes = [['SeedProfile', '🌱'], ['Privacy', '🛡️'], ['Terms', '⚖️'], ['Consent', '✅'], ['Safety', '🚨'], ['AccountControl', '🔑']];
  return <Shell routeName="Settings" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWRow>{routes.map(([route, icon]) => <MBWActionButton key={route} icon={icon} label={MBW_ROUTE_LABELS[route] || route.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()} onPress={() => navigation.navigate(route)} />)}</MBWRow>
    </Shell>;
}
function SeedProfileScreen({
  navigation
}) {
  const {
    state,
    dispatch,
    pickSeedPoster
  } = useMBWGoldenMaster();
  const [name, setName] = useState(state.userSeed.displayName);
  const [orientation, setOrientation] = useState(state.userSeed.orientation);
  return <Shell routeName="SeedProfile" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <Pressable accessibilityRole="button" accessibilityLabel="Change seed image" onPress={pickSeedPoster}>
        <Image source={seedSource} style={styles.seedPoster} resizeMode="cover" />
      </Pressable>
      <MBWInput value={name} onChangeText={setName} placeholder="DISPLAY NAME" />
      <MBWRow>{['TOP', 'VT/V/VB', 'BOTTOM'].map(value => <MBWActionButton compact key={value} icon="✦" label={value} selected={orientation === value} onPress={() => setOrientation(value)} />)}</MBWRow>
      <MBWRow><MBWActionButton compact icon="□" label="SAVE" onPress={() => dispatch({
        type: 'SEED_UPDATE',
        patch: {
          displayName: name.trim().toUpperCase() || 'ACE',
          orientation
        }
      })} /></MBWRow>
    </Shell>;
}
const __MBWVisual_SeedProfileScreen = withMBWExactVisualOS(SeedProfileScreen, {
  screenId: "SeedProfileScreen"
});
export { __MBWVisual_SeedProfileScreen as SeedProfileScreen };
function LegalScreen({
  routeName,
  navigation,
  kind
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const key = kind === 'PRIVACY' ? 'privacyAccepted' : kind === 'TERMS' ? 'termsAccepted' : 'consentAccepted';
  const accepted = state.safety[key];
  const sections = kind === 'PRIVACY' ? MBW_PRIVACY_SECTIONS : kind === 'TERMS' ? MBW_TERMS_SECTIONS : MBW_CONSENT_SECTIONS;
  return <Shell routeName={routeName} navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {sections.map(([title, detail]) => <MBWListItem key={title} icon={kind === 'PRIVACY' ? '🛡️' : kind === 'TERMS' ? '⚖️' : '✅'} title={title} subtitle={detail} />)}
      <MBWRow><MBWActionButton icon="✅" label={accepted ? 'ACCEPTED' : 'ACCEPT'} selected={accepted} onPress={() => dispatch({
        type: 'CONSENT',
        key,
        value: !accepted
      })} /></MBWRow>
      <MBWStatus>VERSION {state.safety.legalVersion}</MBWStatus>
    </Shell>;
}
export function PrivacyScreen(props) {
  return <LegalScreen {...props} routeName="Privacy" kind="PRIVACY" />;
}
export function TermsScreen(props) {
  return <LegalScreen {...props} routeName="Terms" kind="TERMS" />;
}
export function ConsentScreen(props) {
  return <LegalScreen {...props} routeName="Consent" kind="CONSENT" />;
}
export function SafetyScreen({
  navigation
}) {
  const {
    state,
    dispatch
  } = useMBWGoldenMaster();
  const [target, setTarget] = useState('');
  return <Shell routeName="Safety" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWInput value={target} onChangeText={setTarget} placeholder="USER OR CONTENT ID" />
      <MBWRow><MBWActionButton icon="🚨" label="REPORT" disabled={!target.trim()} onPress={() => dispatch({
        type: 'REPORT',
        target: target.trim(),
        reason: 'SAFETY REPORT'
      })} /><MBWActionButton icon="⛔" label="BLOCK" disabled={!target.trim()} onPress={() => dispatch({
        type: 'BLOCK',
        target: target.trim()
      })} /></MBWRow>
      <MBWSectionTitle>REPORTS {state.safety.reports.length}</MBWSectionTitle>
      {state.safety.reports.map(item => <MBWListItem key={item.id} icon="🚨" title={item.target} subtitle={item.status} />)}
      <MBWSectionTitle>BLOCKED {state.safety.blocked.length}</MBWSectionTitle>
      {state.safety.blocked.map(item => <MBWListItem key={item} icon="⛔" title={item} />)}
    </Shell>;
}
export function AccountControlScreen({
  navigation
}) {
  const {
    state,
    resetAccount
  } = useMBWGoldenMaster();
  const execute = () => Alert.alert('DELETE MBW ACCOUNT', 'This removes the User Seed, encrypted state, copied posters, chats, bookings, receipts, reports, and local history from this device.', [{
    text: 'CANCEL',
    style: 'cancel'
  }, {
    text: 'DELETE',
    style: 'destructive',
    onPress: async () => {
      await resetAccount();
      navigation.reset({
        index: 0,
        routes: [{
          name: 'CinematicIntro'
        }]
      });
    }
  }]);
  return <Shell routeName="AccountControl" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWListItem icon="🌱" title={state.userSeed.displayName} subtitle={state.userSeed.id} />
      <MBWListItem icon="📱" title="PHONE" subtitle={state.auth.phoneVerified ? 'VERIFIED' : 'NOT VERIFIED'} />
      <MBWListItem icon="🔐" title="SUBSCRIPTION" subtitle={state.subscription.status} />
      <MBWRow><MBWActionButton icon="🗑️" label="DELETE ACCOUNT" danger onPress={execute} /></MBWRow>
    </Shell>;
}
const styles = StyleSheet.create({
  cinematicRoot: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center'
  },
  cinematicVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)'
  },
  cinematicWelcome: {
    position: 'absolute',
    bottom: 110,
    color: '#ffe8aa',
    fontSize: 15,
    letterSpacing: 6,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowRadius: 10
  },
  cinematicMBW: {
    position: 'absolute',
    bottom: 88,
    color: '#ffe8aa',
    fontSize: 48,
    letterSpacing: 10,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowRadius: 12
  },
  centerStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  gateScene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gateMotion: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5
  },
  gateInputDock: {
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 58
  },
  gateStar: {
    color: '#ffe8aa',
    fontSize: 148,
    textShadowColor: '#e4bb62',
    textShadowRadius: 26
  },
  pathScene: {
    flex: 1
  },
  pathChoice: {
    position: 'absolute',
    top: '48%'
  },
  pathChoiceLeft: {
    left: '34%'
  },
  pathChoiceRight: {
    right: '34%'
  },
  pathReturn: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '7%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signupScene: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingTop: 160,
    paddingBottom: 42,
    gap: 8
  },
  signupCodeField: {
    width: 110
  },
  hubOrbit: {
    flex: 1,
    position: 'relative'
  },
  hubOrbitSlot: {
    position: 'absolute',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center'
  },
  posterPreview: {
    width: '100%',
    height: 360,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.34)'
  },
  posterHistory: {
    width: '100%',
    height: 300,
    marginVertical: 8,
    borderRadius: 16
  },
  seedPoster: {
    width: 144,
    height: 144,
    borderRadius: 72,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e4bb62',
    backgroundColor: 'rgba(0,0,0,0.12)'
  }
});

// MBW_USER_SEED_GOLDEN_BRIDGE_V14
export * as MBWUserSeedRuntimeV14 from '../../runtime/MBWUserSeedRuntime';
export * as MBWUserSeedProviderV14 from '../../runtime/MBWUserSeedProvider';

/* MBW_APK_EXTRACTED_SEED_UNIVERSAL_V21 */
export * as MBWUniversalSeedRegistryV21 from '../../runtime/MBWUniversalSeedRegistryV21';

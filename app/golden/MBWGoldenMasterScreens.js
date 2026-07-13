import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import {
  MBWActionButton,
  MBWBackButton,
  MBWInput,
  MBWListItem,
  MBWOneVisualSurface,
  MBWRow,
  MBWSectionTitle,
  MBWStatus,
} from './MBWOneVisualSurface';
import { MBW_MAIN_ROUTES } from './MBWGoldenMasterRegistry';
import {
  MBW_CONSENT_SECTIONS,
  MBW_PRIVACY_SECTIONS,
  MBW_ROUTE_LABELS,
  MBW_TERMS_SECTIONS,
  mbwVisibleMainRoutes,
} from './MBWReleaseContracts';
import { useMBWGoldenMaster } from './MBWGoldenMasterStore';

const CINEMATIC = require('../assets/cinematic/mbw_cinematic.mp4');
const TIERS = [
  { tier: '111', badge: 'BLACK', amount: 26, currency: 'USD' },
  { tier: '222', badge: 'GOLDEN', amount: 53, currency: 'USD' },
  { tier: '333', badge: 'MAROON', amount: 79.30, currency: 'USD' },
  { tier: '444', badge: 'ACE', amount: 105.99, currency: 'USD' },
];

function Shell({ routeName, navigation, children, showSeed = true, scroll = true }) {
  return <MBWOneVisualSurface routeName={routeName} navigation={navigation} showSeed={showSeed} scroll={scroll}>{children}</MBWOneVisualSurface>;
}

function CompleteState({ state }) {
  return state.lifecycle.lastError ? <MBWStatus danger>{state.lifecycle.lastError}</MBWStatus> : null;
}

export function CinematicIntroScreen({ navigation }) {
  const [phase, setPhase] = useState('WELCOME TO');
  useEffect(() => {
    const wordTimer = setTimeout(() => setPhase('MBW'), 5000);
    const routeTimer = setTimeout(() => navigation.replace('GateLocked'), 11000);
    return () => { clearTimeout(wordTimer); clearTimeout(routeTimer); };
  }, [navigation]);
  return (
    <View style={styles.cinematicRoot}>
      <Video
        source={CINEMATIC}
        shouldPlay
        isLooping={false}
        resizeMode={ResizeMode.COVER}
        style={StyleSheet.absoluteFill}
        useNativeControls={false}
      />
      <View pointerEvents="none" style={styles.cinematicVeil} />
      <Text style={phase === 'MBW' ? styles.cinematicMBW : styles.cinematicWelcome}>{phase}</Text>
    </View>
  );
}

export function GateLockedScreen({ navigation }) {
  const { state, verifyGate } = useMBWGoldenMaster();
  const [secret, setSecret] = useState('');
  const submit = async () => {
    const accepted = await verifyGate(secret);
    if (accepted) {
      setSecret('');
      navigation.replace('GateOpen');
    }
  };
  return (
    <Shell routeName="GateLocked" navigation={navigation} showSeed={false} scroll={false}>
      <View style={styles.centerStage}>
        <MBWInput value={secret} onChangeText={setSecret} placeholder="ACCESS" secureTextEntry />
        <MBWActionButton icon="★" label="ENTER" onPress={submit} disabled={!secret.trim()} />
        <CompleteState state={state} />
      </View>
    </Shell>
  );
}

export function GateOpenScreen({ navigation }) {
  const { state } = useMBWGoldenMaster();
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace(state.lifecycle.firstRunComplete ? 'MainHub' : 'PathSelection'), 5000);
    return () => clearTimeout(timer);
  }, [navigation, state.lifecycle.firstRunComplete]);
  return (
    <Shell routeName="GateOpen" navigation={navigation} showSeed={false} scroll={false}>
      <View style={styles.centerStage}><Text style={styles.gateStar}>☆</Text><MBWStatus>ACCESS OPEN</MBWStatus></View>
    </Shell>
  );
}

export function PathSelectionScreen({ navigation }) {
  const { dispatch } = useMBWGoldenMaster();
  const choose = (path) => {
    dispatch({ type: 'PATH', path });
    navigation.navigate('SubscriptionSignup');
  };
  return (
    <Shell routeName="PathSelection" navigation={navigation}>
      <View style={styles.centerStage}>
        <MBWRow>
          <MBWActionButton icon="👑" label="MASTER OF LIFE" onPress={() => choose('MASTER_OF_LIFE')} />
          <MBWActionButton icon="♠️" label="FULL MBW" onPress={() => choose('FULL_MBW_APP')} />
        </MBWRow>
      </View>
    </Shell>
  );
}

export function SubscriptionSignupScreen({ navigation }) {
  const { state, dispatch, sendVerification, verifyPhone } = useMBWGoldenMaster();
  const [name, setName] = useState(state.userSeed.displayName === 'ACE' ? '' : state.userSeed.displayName);
  const [phone, setPhone] = useState(state.auth.phone || '');
  const [code, setCode] = useState('');
  const ready = state.auth.signedUp && state.auth.phoneVerified && state.subscription.status === 'ACTIVE_PREVIEW'
    && state.safety.privacyAccepted && state.safety.termsAccepted && state.safety.consentAccepted;

  const signup = () => {
    if (name.trim().length < 2 || phone.replace(/\D/g, '').length < 7) {
      dispatch({ type: 'ERROR', message: 'NAME AND PHONE REQUIRED' });
      return;
    }
    dispatch({ type: 'SIGNUP', displayName: name.trim().toUpperCase(), phone: phone.trim() });
  };
  const finish = () => {
    if (!ready) {
      dispatch({ type: 'ERROR', message: 'COMPLETE ALL ACCESS STEPS' });
      return;
    }
    dispatch({ type: 'FIRST_RUN_COMPLETE' });
    navigation.reset({ index: 0, routes: [{ name: 'MainHub' }] });
  };

  return (
    <Shell routeName="SubscriptionSignup" navigation={navigation}>
      <MBWSectionTitle>IDENTITY</MBWSectionTitle>
      <MBWInput value={name} onChangeText={setName} placeholder="DISPLAY NAME" />
      <MBWInput value={phone} onChangeText={setPhone} placeholder="PHONE" keyboardType="phone-pad" />
      <MBWRow><MBWActionButton icon="🌱" label={state.auth.signedUp ? 'SAVED' : 'CREATE SEED'} onPress={signup} selected={state.auth.signedUp} /></MBWRow>

      <MBWSectionTitle>VERIFY</MBWSectionTitle>
      <MBWRow>
        <MBWActionButton icon="📨" label="SEND CODE" onPress={sendVerification} disabled={!state.auth.signedUp} />
        <MBWInput value={code} onChangeText={setCode} placeholder="6 DIGITS" keyboardType="number-pad" />
        <MBWActionButton icon="✅" label="VERIFY" onPress={() => verifyPhone(code)} disabled={!state.auth.verificationCode} selected={state.auth.phoneVerified} />
      </MBWRow>

      <MBWSectionTitle>TIER</MBWSectionTitle>
      <MBWRow>
        {TIERS.map((item) => (
          <MBWActionButton key={item.tier} icon={item.tier === '444' ? '👑' : '♠️'} label={`${item.tier} · $${item.amount}`} selected={state.subscription.tier === item.tier} onPress={() => dispatch({ type: 'TIER', ...item })} />
        ))}
      </MBWRow>

      <MBWSectionTitle>CONSENT</MBWSectionTitle>
      <MBWRow>
        <MBWActionButton icon="🛡️" label="PRIVACY" selected={state.safety.privacyAccepted} onPress={() => dispatch({ type: 'CONSENT', key: 'privacyAccepted', value: !state.safety.privacyAccepted })} />
        <MBWActionButton icon="⚖️" label="TERMS" selected={state.safety.termsAccepted} onPress={() => dispatch({ type: 'CONSENT', key: 'termsAccepted', value: !state.safety.termsAccepted })} />
        <MBWActionButton icon="✅" label="CONSENT" selected={state.safety.consentAccepted} onPress={() => dispatch({ type: 'CONSENT', key: 'consentAccepted', value: !state.safety.consentAccepted })} />
      </MBWRow>
      <MBWRow><MBWActionButton icon="♠️" label="ENTER MBW" onPress={finish} disabled={!ready} selected={ready} /></MBWRow>
      <CompleteState state={state} />
    </Shell>
  );
}

export function MainHubScreen({ navigation }) {
  const { state, navigateChecked } = useMBWGoldenMaster();
  const visibleRoutes = mbwVisibleMainRoutes(state, MBW_MAIN_ROUTES);
  return (
    <Shell routeName="MainHub" navigation={navigation}>
      <MBWRow>
        {visibleRoutes.map(([route, icon]) => (
          <MBWActionButton
            key={route}
            icon={icon}
            label={MBW_ROUTE_LABELS[route] || route}
            onPress={() => navigateChecked(navigation, route)}
          />
        ))}
      </MBWRow>
      {state.lifecycle.lastError ? <MBWStatus danger>{state.lifecycle.lastError}</MBWStatus> : null}
    </Shell>
  );
}

export function MasterOfLifeScreen({ navigation }) {
  const { state } = useMBWGoldenMaster();
  const completion = [state.auth.signedUp, state.auth.phoneVerified, state.subscription.status === 'ACTIVE_PREVIEW', state.safety.privacyAccepted, state.aiPoster.history.length > 0].filter(Boolean).length;
  return (
    <Shell routeName="MasterOfLife" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>LIFE CORE {completion}/5</MBWSectionTitle>
      <MBWListItem icon="🌱" title={state.userSeed.displayName} subtitle={`${state.userSeed.tier} · ${state.userSeed.badge} · ${state.userSeed.path || 'PATH PENDING'}`} />
      <MBWListItem icon="🪙" title="COINS" right={String(state.coins.balance)} onPress={() => navigation.navigate('MasterOfCoins')} />
      <MBWListItem icon="❤️" title="MATCHES" right={String(state.matchmaking.matches.length)} onPress={() => navigation.navigate('Matchmaking')} />
      <MBWListItem icon="🧳" title="BOOKINGS" right={String(state.travel.bookings.length)} onPress={() => navigation.navigate('TravelLocal')} />
      <MBWListItem icon="📸" title="POSTERS" right={String(state.aiPoster.history.length)} onPress={() => navigation.navigate('AIPoster')} />
      <MBWListItem icon="⚙️" title="ACCOUNT AND SAFETY" subtitle="PRIVACY · TERMS · RESET" onPress={() => navigation.navigate('Settings')} />
    </Shell>
  );
}

export function MatchmakingScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const profile = state.matchmaking.profiles[state.matchmaking.cursor % state.matchmaking.profiles.length];
  return (
    <Shell routeName="Matchmaking" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>{profile.name} · {profile.age}</MBWSectionTitle>
      <MBWStatus>{profile.city} · TIER {profile.tier} · {profile.compatibility}%</MBWStatus>
      <MBWRow>
        <MBWActionButton icon="✕" label="PASS" onPress={() => dispatch({ type: 'MATCH_SWIPE', direction: 'PASS' })} />
        <MBWActionButton icon="❤️" label="LIKE" onPress={() => dispatch({ type: 'MATCH_SWIPE', direction: 'LIKE' })} />
      </MBWRow>
      <MBWSectionTitle>MATCHES</MBWSectionTitle>
      {state.matchmaking.matches.length === 0 ? <MBWStatus>NO MATCH YET</MBWStatus> : state.matchmaking.matches.map((item) => (
        <MBWListItem key={item.id} icon="💘" title={item.name} subtitle={`${item.compatibility}% · ${item.city}`} onPress={() => { dispatch({ type: 'SELECT_MATCH', id: item.id }); navigation.navigate('MatchChat'); }} />
      ))}
    </Shell>
  );
}

export function MatchChatScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const [text, setText] = useState('');
  const match = state.matchmaking.matches.find((item) => item.id === state.matchmaking.selectedMatchId);
  const messages = state.matchmaking.chats[state.matchmaking.selectedMatchId] || [];
  const send = () => {
    if (!match || !text.trim()) return;
    dispatch({ type: 'CHAT', id: match.id, text });
    setText('');
  };
  return (
    <Shell routeName="MatchChat" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>{match?.name || 'SELECT A MATCH'}</MBWSectionTitle>
      {messages.map((message) => <MBWListItem key={message.id} icon={message.sender === 'ME' ? '♠️' : '💘'} title={message.sender} subtitle={message.text} />)}
      <MBWInput value={text} onChangeText={setText} placeholder="MESSAGE" multiline />
      <MBWRow><MBWActionButton icon="➤" label="SEND" onPress={send} disabled={!match || !text.trim()} /></MBWRow>
    </Shell>
  );
}

export function GamesScreen({ navigation }) {
  const { dispatch, navigateChecked } = useMBWGoldenMaster();
  const open = (game) => {
    dispatch({ type: 'SELECT_GAME', game });
    navigateChecked(navigation, 'GameRoom');
  };
  return (
    <Shell routeName="Games" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWRow>
        <MBWActionButton icon="🎲" label="LUDO" onPress={() => open('LUDO')} />
        <MBWActionButton icon="🂡" label="SEEP / SWEEP" onPress={() => open('SEEP')} />
        <MBWActionButton icon="🎯" label="SICBO" onPress={() => open('SICBO')} />
        <MBWActionButton icon="🏆" label="VAULT" onPress={() => navigateChecked(navigation, 'MasterOfGames')} />
      </MBWRow>
    </Shell>
  );
}

export function GameRoomScreen({ navigation }) {
  const { state, dispatch, rollLudo, startSeep, playSicbo } = useMBWGoldenMaster();
  const game = state.games.selectedGame;
  const ludo = state.games.ludo;
  const seep = state.games.seep;
  const sicbo = state.games.sicbo;
  const tokenText = (tokens) => tokens.map((value) => value < 0 ? 'B' : value >= 57 ? 'H' : value).join(' · ');
  const sicboChoices = ['LOW', 'HIGH', 'ANY_TRIPLE', 'TOTAL_6', 'TOTAL_9', 'TOTAL_12', 'TOTAL_15'];
  return (
    <Shell routeName="GameRoom" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>{game}</MBWSectionTitle>

      {game === 'LUDO' ? <>
        <MBWStatus>YOU {tokenText(ludo.playerTokens)}</MBWStatus>
        <MBWStatus>AI {tokenText(ludo.aiTokens)}</MBWStatus>
        <MBWStatus>{ludo.message}</MBWStatus>
        <MBWRow>
          <MBWActionButton icon="🎲" label="ROLL" onPress={rollLudo} disabled={Boolean(ludo.winner)} />
          <MBWActionButton icon="↺" label="NEW" onPress={() => dispatch({ type: 'LUDO_NEW' })} />
        </MBWRow>
      </> : null}

      {game === 'SEEP' ? <>
        <MBWStatus>TABLE {seep.table.map((card) => card.id).join(' · ') || 'CLEAR'}</MBWStatus>
        <MBWStatus>{seep.score}-{seep.opponentScore} · SWEEPS {seep.playerSweeps}-{seep.aiSweeps}</MBWStatus>
        <MBWRow>
          {seep.hand.map((card) => (
            <MBWActionButton key={card.id} icon="🂡" label={card.id} onPress={() => dispatch({ type: 'SEEP_PLAY', cardId: card.id })} disabled={seep.finished} />
          ))}
        </MBWRow>
        <MBWRow><MBWActionButton icon="↺" label={seep.finished ? 'NEW' : 'RESHUFFLE'} onPress={startSeep} /></MBWRow>
        {seep.finished ? <MBWStatus>{seep.winner} · {seep.score}-{seep.opponentScore}</MBWStatus> : null}
      </> : null}

      {game === 'SICBO' ? <>
        <MBWStatus>{sicbo.lastDice.join('-') || '—'} · {sicbo.lastTotal ?? '—'} · {sicbo.lastResult || '—'}</MBWStatus>
        <MBWRow>
          {sicboChoices.map((choice) => (
            <MBWActionButton key={choice} icon="🎯" label={choice.replace('_', ' ')} selected={sicbo.choice === choice} onPress={() => { dispatch({ type: 'SICBO_CHOICE', choice }); playSicbo(choice); }} />
          ))}
        </MBWRow>
      </> : null}

      <MBWStatus>COINS {state.coins.balance}</MBWStatus>
    </Shell>
  );
}

export function MasterOfGamesScreen({ navigation }) {
  const { state } = useMBWGoldenMaster();
  return (
    <Shell routeName="MasterOfGames" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>GAME HISTORY</MBWSectionTitle>
      {state.games.history.length === 0 ? <MBWStatus>PLAY A GAME TO OPEN HISTORY</MBWStatus> : state.games.history.map((item) => <MBWListItem key={item.id} icon={item.won ? '🏆' : '🎲'} title={item.game} subtitle={item.detail} right={item.won ? 'WIN' : 'PLAYED'} />)}
    </Shell>
  );
}

export function MasterOfCoinsScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const claimedToday = state.coins.lastDailyClaim && state.coins.lastDailyClaim.slice(0, 10) === new Date().toISOString().slice(0, 10);
  return (
    <Shell routeName="MasterOfCoins" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>{state.coins.balance} COINS</MBWSectionTitle>
      <MBWRow><MBWActionButton icon="5️⃣" label="DAILY 55" onPress={() => dispatch({ type: 'DAILY_COINS' })} disabled={claimedToday} selected={claimedToday} /></MBWRow>
      {state.coins.ledger.map((item) => <MBWListItem key={item.id} icon={item.type === 'CREDIT' ? '➕' : '➖'} title={item.reason} subtitle={item.at.slice(0, 10)} right={`${item.type === 'CREDIT' ? '+' : '-'}${item.amount}`} />)}
    </Shell>
  );
}

function TravelScreen({ routeName, navigation, mode }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const trips = mode === 'LOCAL' ? state.travel.local : state.travel.overseas;
  const [hostTitle, setHostTitle] = useState('');
  const [hostPlace, setHostPlace] = useState('');
  return (
    <Shell routeName={routeName} navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {trips.map((trip) => <MBWListItem key={trip.id} icon={mode === 'LOCAL' ? '🧭' : '✈️'} title={trip.title} subtitle={`${trip.place} · ${trip.host}`} right={`$${trip.price}`} onPress={() => { dispatch({ type: 'TRAVEL_SELECT', id: trip.id }); navigation.navigate('TravelBooking', { mode }); }} />)}
      <MBWSectionTitle>HOST</MBWSectionTitle>
      <MBWInput value={hostTitle} onChangeText={setHostTitle} placeholder="HOST TITLE" />
      <MBWInput value={hostPlace} onChangeText={setHostPlace} placeholder="PLACE" />
      <MBWRow><MBWActionButton icon="🏠" label="LIST HOST" onPress={() => { if (hostTitle.trim() && hostPlace.trim()) { dispatch({ type: 'TRAVEL_HOST', title: hostTitle.trim(), place: hostPlace.trim(), capacity: 1 }); setHostTitle(''); setHostPlace(''); } }} /></MBWRow>
    </Shell>
  );
}

export function TravelLocalScreen(props) { return <TravelScreen {...props} routeName="TravelLocal" mode="LOCAL" />; }
export function TravelOverseasScreen(props) { return <TravelScreen {...props} routeName="TravelOverseas" mode="OVERSEAS" />; }

export function TravelBookingScreen({ navigation, route }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const all = [...state.travel.local, ...state.travel.overseas];
  const trip = all.find((item) => item.id === state.travel.selectedTripId);
  return (
    <Shell routeName="TravelBooking" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWSectionTitle>{trip?.title || 'SELECT A TRIP'}</MBWSectionTitle>
      {trip ? <>
        <MBWStatus>{trip.place} · ${trip.price} · {route?.params?.mode || 'TRAVEL'}</MBWStatus>
        <MBWRow><MBWActionButton icon="🔖" label="SAVE" selected={state.travel.saved.includes(trip.id)} onPress={() => dispatch({ type: 'TRAVEL_SAVE', id: trip.id })} /><MBWActionButton icon="✅" label="BOOK" onPress={() => dispatch({ type: 'TRAVEL_BOOK', trip })} /></MBWRow>
      </> : null}
      <MBWSectionTitle>BOOKINGS</MBWSectionTitle>
      {state.travel.bookings.map((item) => (
        <View key={item.id}>
          <MBWListItem icon="🧳" title={item.title} subtitle={item.status} right={`$${item.price}`} />
          {item.status !== 'CANCELLED' ? <MBWRow><MBWActionButton icon="✕" label="CANCEL" onPress={() => dispatch({ type: 'TRAVEL_CANCEL', id: item.id })} /></MBWRow> : null}
        </View>
      ))}
    </Shell>
  );
}

export function MerchandiseScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const total = state.commerce.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <Shell routeName="Merchandise" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {state.commerce.products.map((product) => <MBWListItem key={product.id} icon="💎" title={product.title} subtitle="MBW PRODUCT" right={`$${product.price}`} onPress={() => dispatch({ type: 'CART_ADD', product })} />)}
      <MBWSectionTitle>CART ${total}</MBWSectionTitle>
      {state.commerce.cart.map((item) => <MBWListItem key={item.id} icon="🛍️" title={item.title} subtitle={`QTY ${item.qty}`} right={`$${item.price * item.qty}`} onPress={() => dispatch({ type: 'CART_REMOVE', id: item.id })} />)}
      <MBWRow><MBWActionButton icon="🧾" label="CHECKOUT" disabled={!state.commerce.cart.length} onPress={() => { dispatch({ type: 'CHECKOUT' }); navigation.navigate('CommerceReceipt'); }} /></MBWRow>
    </Shell>
  );
}

export function CommerceReceiptScreen({ navigation }) {
  const { state } = useMBWGoldenMaster();
  return (
    <Shell routeName="CommerceReceipt" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {state.commerce.orders.length === 0 ? <MBWStatus>NO ORDER YET</MBWStatus> : state.commerce.orders.map((order) => <MBWListItem key={order.id} icon="🧾" title={order.id} subtitle={`${order.items.length} ITEMS · ${order.status}`} right={`$${order.total}`} />)}
    </Shell>
  );
}

export function KamashastraScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const keys = Object.keys(state.kamashastra.values);
  return (
    <Shell routeName="Kamashastra" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {keys.map((key) => <View key={key}><MBWSectionTitle>{key.toUpperCase()} · {state.kamashastra.values[key]}</MBWSectionTitle><MBWRow>{[2, 5, 8, 10].map((value) => <MBWActionButton key={value} icon={value >= 8 ? '🔥' : '⚜️'} label={String(value)} selected={state.kamashastra.values[key] === value} onPress={() => dispatch({ type: 'KAMA_VALUE', key, value })} />)}</MBWRow></View>)}
      <MBWRow><MBWActionButton icon="⚜️" label="CALCULATE" onPress={() => dispatch({ type: 'KAMA_RESULT' })} /></MBWRow>
      {state.kamashastra.result ? <MBWStatus>{state.kamashastra.result.score}% · {state.kamashastra.result.label}</MBWStatus> : null}
    </Shell>
  );
}

export function LiveLoungeScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const [story, setStory] = useState('');
  const aceAllowed = state.userSeed.tier === '444';
  return (
    <Shell routeName="LiveLounge" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWRow>
        <MBWActionButton
          icon={state.social.livePreview ? '🔴' : '🎙️'}
          label={state.social.livePreview ? 'END LIVE' : 'GO LIVE'}
          selected={state.social.livePreview}
          disabled={!aceAllowed}
          onPress={() => dispatch({ type: 'LIVE_TOGGLE' })}
        />
      </MBWRow>
      {!aceAllowed ? <MBWStatus danger>ACE 444 REQUIRED</MBWStatus> : null}
      <MBWInput value={story} onChangeText={setStory} placeholder="STORY" multiline />
      <MBWRow><MBWActionButton icon="📡" label="POST STORY" disabled={!story.trim()} onPress={() => { dispatch({ type: 'STORY_ADD', text: story }); setStory(''); }} /></MBWRow>
      {state.social.stories.filter((item) => item.expiresAt > Date.now()).map((item) => <MBWListItem key={item.id} icon="📡" title="STORY" subtitle={item.text} />)}
    </Shell>
  );
}

export function MensLoungeScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const [post, setPost] = useState('');
  return (
    <Shell routeName="MensLounge" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWInput value={post} onChangeText={setPost} placeholder="POST" multiline />
      <MBWRow><MBWActionButton icon="♠️" label="PUBLISH" disabled={!post.trim()} onPress={() => { dispatch({ type: 'POST_ADD', text: post }); setPost(''); }} /></MBWRow>
      {state.social.posts.map((item) => <View key={item.id}><MBWListItem icon="♠️" title={item.author} subtitle={item.text} /><MBWRow><MBWActionButton icon="🚨" label="REPORT" onPress={() => dispatch({ type: 'REPORT', target: item.id, reason: 'USER REPORT' })} /><MBWActionButton icon="⛔" label="BLOCK" onPress={() => dispatch({ type: 'BLOCK', target: item.author })} /></MBWRow></View>)}
    </Shell>
  );
}

export function NearbyScreen({ navigation }) {
  const { state, requestNearby } = useMBWGoldenMaster();
  return (
    <Shell routeName="Nearby" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWRow><MBWActionButton icon="📍" label="SCAN NEARBY" onPress={requestNearby} /></MBWRow>
      {state.nearby.results.map((item) => <MBWListItem key={item.id} icon="📍" title={item.name} subtitle={`${item.city} · ${item.compatibility}%`} right={`${item.distanceKm} km`} />)}
      {state.nearby.permission === 'DENIED' ? <MBWStatus danger>ENABLE LOCATION IN ANDROID SETTINGS</MBWStatus> : null}
    </Shell>
  );
}

export function AIPosterScreen({ navigation }) {
  const { state, pickPoster, rotatePoster, cropPoster, savePoster } = useMBWGoldenMaster();
  return (
    <Shell routeName="AIPoster" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {state.aiPoster.currentUri ? <Image source={{ uri: state.aiPoster.currentUri }} style={styles.posterPreview} resizeMode="contain" /> : <MBWStatus>IMPORT ONE IMAGE</MBWStatus>}
      <MBWRow>
        <MBWActionButton icon="📁" label="IMPORT" onPress={pickPoster} />
        <MBWActionButton icon="↻" label="ROTATE" onPress={rotatePoster} disabled={!state.aiPoster.currentUri} />
        <MBWActionButton icon="✂️" label="CROP" onPress={cropPoster} disabled={!state.aiPoster.currentUri} />
        <MBWActionButton icon="💾" label="SAVE" onPress={savePoster} disabled={!state.aiPoster.currentUri} />
        <MBWActionButton icon="🖼️" label="HISTORY" onPress={() => navigation.navigate('ProfilePoster')} />
      </MBWRow>
      {state.aiPoster.lastError ? <MBWStatus danger>{state.aiPoster.lastError}</MBWStatus> : null}
    </Shell>
  );
}

export function ProfilePosterScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  return (
    <Shell routeName="ProfilePoster" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {state.aiPoster.history.length === 0 ? <MBWStatus>NO SAVED POSTER</MBWStatus> : state.aiPoster.history.map((item) => <Pressable key={item.id} accessibilityRole="button" onPress={() => dispatch({ type: 'SEED_UPDATE', patch: { profilePoster: item.uri } })}><Image source={{ uri: item.uri }} style={styles.posterHistory} /></Pressable>)}
    </Shell>
  );
}

export function SettingsScreen({ navigation }) {
  const routes = [['SeedProfile', '🌱'], ['Privacy', '🛡️'], ['Terms', '⚖️'], ['Consent', '✅'], ['Safety', '🚨'], ['AccountControl', '🔑']];
  return (
    <Shell routeName="Settings" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWRow>{routes.map(([route, icon]) => <MBWActionButton key={route} icon={icon} label={MBW_ROUTE_LABELS[route] || route.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()} onPress={() => navigation.navigate(route)} />)}</MBWRow>
    </Shell>
  );
}

export function SeedProfileScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const [name, setName] = useState(state.userSeed.displayName);
  const [orientation, setOrientation] = useState(state.userSeed.orientation);
  return (
    <Shell routeName="SeedProfile" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {state.userSeed.profilePoster ? <Image source={{ uri: state.userSeed.profilePoster }} style={styles.seedPoster} /> : null}
      <MBWInput value={name} onChangeText={setName} placeholder="DISPLAY NAME" />
      <MBWRow>{['TOP', 'VT/V/VB', 'BOTTOM'].map((value) => <MBWActionButton key={value} icon="🌱" label={value} selected={orientation === value} onPress={() => setOrientation(value)} />)}</MBWRow>
      <MBWRow><MBWActionButton icon="💾" label="SAVE SEED" onPress={() => dispatch({ type: 'SEED_UPDATE', patch: { displayName: name.trim().toUpperCase() || 'ACE', orientation } })} /></MBWRow>
      <MBWStatus>SEED · {state.userSeed.id.slice(-8).toUpperCase()}</MBWStatus>
      <MBWStatus>{state.userSeed.path} · {state.userSeed.tier} · {state.userSeed.subscriptionState}</MBWStatus>
    </Shell>
  );
}

function LegalScreen({ routeName, navigation, kind }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const key = kind === 'PRIVACY' ? 'privacyAccepted' : kind === 'TERMS' ? 'termsAccepted' : 'consentAccepted';
  const accepted = state.safety[key];
  const sections = kind === 'PRIVACY'
    ? MBW_PRIVACY_SECTIONS
    : kind === 'TERMS'
      ? MBW_TERMS_SECTIONS
      : MBW_CONSENT_SECTIONS;
  return (
    <Shell routeName={routeName} navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      {sections.map(([title, detail]) => <MBWListItem key={title} icon={kind === 'PRIVACY' ? '🛡️' : kind === 'TERMS' ? '⚖️' : '✅'} title={title} subtitle={detail} />)}
      <MBWRow><MBWActionButton icon="✅" label={accepted ? 'ACCEPTED' : 'ACCEPT'} selected={accepted} onPress={() => dispatch({ type: 'CONSENT', key, value: !accepted })} /></MBWRow>
      <MBWStatus>VERSION {state.safety.legalVersion}</MBWStatus>
    </Shell>
  );
}

export function PrivacyScreen(props) { return <LegalScreen {...props} routeName="Privacy" kind="PRIVACY" />; }
export function TermsScreen(props) { return <LegalScreen {...props} routeName="Terms" kind="TERMS" />; }
export function ConsentScreen(props) { return <LegalScreen {...props} routeName="Consent" kind="CONSENT" />; }

export function SafetyScreen({ navigation }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const [target, setTarget] = useState('');
  return (
    <Shell routeName="Safety" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWInput value={target} onChangeText={setTarget} placeholder="USER OR CONTENT ID" />
      <MBWRow><MBWActionButton icon="🚨" label="REPORT" disabled={!target.trim()} onPress={() => dispatch({ type: 'REPORT', target: target.trim(), reason: 'SAFETY REPORT' })} /><MBWActionButton icon="⛔" label="BLOCK" disabled={!target.trim()} onPress={() => dispatch({ type: 'BLOCK', target: target.trim() })} /></MBWRow>
      <MBWSectionTitle>REPORTS {state.safety.reports.length}</MBWSectionTitle>
      {state.safety.reports.map((item) => <MBWListItem key={item.id} icon="🚨" title={item.target} subtitle={item.status} />)}
      <MBWSectionTitle>BLOCKED {state.safety.blocked.length}</MBWSectionTitle>
      {state.safety.blocked.map((item) => <MBWListItem key={item} icon="⛔" title={item} />)}
    </Shell>
  );
}

export function AccountControlScreen({ navigation }) {
  const { state, resetAccount } = useMBWGoldenMaster();
  const execute = () => Alert.alert('DELETE MBW ACCOUNT', 'This removes the User Seed, encrypted state, copied posters, chats, bookings, receipts, reports, and local history from this device.', [
    { text: 'CANCEL', style: 'cancel' },
    { text: 'DELETE', style: 'destructive', onPress: async () => { await resetAccount(); navigation.reset({ index: 0, routes: [{ name: 'CinematicIntro' }] }); } },
  ]);
  return (
    <Shell routeName="AccountControl" navigation={navigation}>
      <MBWBackButton navigation={navigation} />
      <MBWListItem icon="🌱" title={state.userSeed.displayName} subtitle={state.userSeed.id} />
      <MBWListItem icon="📱" title="PHONE" subtitle={state.auth.phoneVerified ? 'VERIFIED' : 'NOT VERIFIED'} />
      <MBWListItem icon="🔐" title="SUBSCRIPTION" subtitle={state.subscription.status} />
      <MBWRow><MBWActionButton icon="🗑️" label="DELETE ACCOUNT" danger onPress={execute} /></MBWRow>
    </Shell>
  );
}

const styles = StyleSheet.create({
  cinematicRoot: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  cinematicVeil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.08)' },
  cinematicWelcome: { position: 'absolute', bottom: 110, color: '#ffe8aa', fontSize: 15, letterSpacing: 6, fontWeight: '900', textShadowColor: '#000', textShadowRadius: 10 },
  cinematicMBW: { position: 'absolute', bottom: 88, color: '#ffe8aa', fontSize: 48, letterSpacing: 10, fontWeight: '900', textShadowColor: '#000', textShadowRadius: 12 },
  centerStage: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  gateStar: { color: '#ffe8aa', fontSize: 164, textShadowColor: '#e4bb62', textShadowRadius: 24 },
  posterPreview: { width: '100%', height: 360, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.34)' },
  posterHistory: { width: '100%', height: 300, marginVertical: 8, borderRadius: 16 },
  seedPoster: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 12 },
});

// MBW_PLAYABLE_GAMES_UNIVERSE_V1
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
const Core = require('./MBWGameEngineCore.cjs');
const GOLD = '#D9AB57';
const BLACK = '#050202';
const GREEN = '#A6E7A2';
const PLAYER_TONES = ['♠', '♦', '♣', '♥'];
const SUIT_SYMBOL = {
  S: '♠',
  H: '♥',
  D: '♦',
  C: '♣'
};
function OrbButton({
  label,
  glyph,
  onPress
}) {
  return <Pressable onPress={onPress} style={styles.orbButton}>
      <Text style={styles.orbGlyph}>{glyph}</Text>
      <Text style={styles.orbLabel}>{label}</Text>
    </Pressable>;
}
function ModePicker({
  value,
  onChange
}) {
  return <View style={styles.modeRow}>
      {[2, 4].map(mode => <Pressable key={mode} onPress={() => onChange(mode)} style={[styles.modeChoice, value === mode && styles.modeChoiceActive]}>
          <Text style={styles.modeText}>{mode} PLAYERS</Text>
        </Pressable>)}
    </View>;
}
function LudoGame() {
  const [playerCount, setPlayerCount] = useState(2);
  const [state, setState] = useState(() => Core.createLudo(2));
  const reset = count => {
    setPlayerCount(count);
    setState(Core.createLudo(count));
  };
  const validMoves = Core.ludoValidMoves(state);
  return <ScrollView contentContainerStyle={styles.gameBody}>
      <Text style={styles.gameTitle}>MASTER OF LUDO</Text>
      <ModePicker value={playerCount} onChange={reset} />
      <Text style={styles.status}>
        PLAYER {state.currentPlayer + 1} · {state.message}
      </Text>

      <View style={styles.diceOrbit}>
        <Pressable onPress={() => setState(previous => Core.ludoRoll(previous))} disabled={state.dice !== null || state.winner !== null} style={styles.diceButton}>
          <Text style={styles.diceText}>{state.dice || 'ROLL'}</Text>
        </Pressable>
      </View>

      {state.players.map((player, playerIndex) => <View key={player.id} style={styles.playerLane}>
          <Text style={styles.playerName}>
            {PLAYER_TONES[playerIndex]} PLAYER {playerIndex + 1}
          </Text>
          <View style={styles.tokenRow}>
            {player.tokens.map((progress, tokenIndex) => {
          const active = playerIndex === state.currentPlayer && validMoves.includes(tokenIndex);
          return <Pressable key={`${player.id}-${tokenIndex}`} disabled={!active} onPress={() => setState(previous => Core.ludoMove(previous, tokenIndex))} style={[styles.token, active && styles.tokenActive, progress === 57 && styles.tokenFinished]}>
                  <Text style={styles.tokenText}>
                    {progress === -1 ? 'YARD' : progress === 57 ? 'CROWN' : progress}
                  </Text>
                </Pressable>;
        })}
          </View>
        </View>)}

      <Pressable onPress={() => reset(playerCount)} style={styles.resetButton}>
        <Text style={styles.resetText}>NEW LUDO</Text>
      </Pressable>
    </ScrollView>;
}
function SeepItem({
  item,
  selected,
  onPress
}) {
  const text = item.type === 'HOUSE' ? `HOUSE ${item.value}` : `${SUIT_SYMBOL[item.cards[0].suit]}${item.value}`;
  return <Pressable onPress={onPress} style={[styles.playingPiece, selected && styles.playingPieceSelected]}>
      <Text style={styles.playingPieceText}>{text}</Text>
    </Pressable>;
}
function SeepGame() {
  const [playerCount, setPlayerCount] = useState(2);
  const [state, setState] = useState(() => Core.createSeep(2));
  const [handIndex, setHandIndex] = useState(null);
  const [tableIds, setTableIds] = useState([]);
  const reset = count => {
    setPlayerCount(count);
    setState(Core.createSeep(count));
    setHandIndex(null);
    setTableIds([]);
  };
  const toggleTable = id => {
    setTableIds(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
  };
  const captureReady = handIndex !== null && Core.seepCanCapture(state, handIndex, tableIds);
  const buildValues = handIndex === null ? [] : Core.seepBuildValues(state, handIndex, tableIds);
  const act = action => {
    try {
      setState(previous => Core.seepPlay(previous, {
        ...action,
        handIndex,
        tableIds
      }));
      setHandIndex(null);
      setTableIds([]);
    } catch (error) {
      setState(previous => ({
        ...previous,
        message: String(error.message)
      }));
    }
  };
  const scores = Core.seepScores(state);
  return <ScrollView contentContainerStyle={styles.gameBody}>
      <Text style={styles.gameTitle}>SEEP · SWEEP</Text>
      <ModePicker value={playerCount} onChange={reset} />
      <Text style={styles.status}>
        PLAYER {state.currentPlayer + 1} · {state.message}
      </Text>
      <Text style={styles.scoreLine}>SCORE {scores.join(' · ')}</Text>

      <Text style={styles.zoneTitle}>TABLE</Text>
      <View style={styles.pieceWrap}>
        {state.table.map(item => <SeepItem key={item.id} item={item} selected={tableIds.includes(item.id)} onPress={() => toggleTable(item.id)} />)}
      </View>

      <Text style={styles.zoneTitle}>YOUR HAND</Text>
      <View style={styles.pieceWrap}>
        {state.hands[state.currentPlayer].map((card, index) => <Pressable key={card.id} onPress={() => setHandIndex(index)} style={[styles.playingPiece, handIndex === index && styles.playingPieceSelected]}>
            <Text style={styles.playingPieceText}>
              {SUIT_SYMBOL[card.suit]}{card.rank}
            </Text>
          </Pressable>)}
      </View>

      <View style={styles.actionRow}>
        <Pressable disabled={!captureReady} onPress={() => act({
        type: 'CAPTURE'
      })} style={[styles.actionCapsule, !captureReady && styles.disabled]}>
          <Text style={styles.actionText}>CAPTURE</Text>
        </Pressable>

        <Pressable disabled={handIndex === null} onPress={() => act({
        type: 'DROP'
      })} style={[styles.actionCapsule, handIndex === null && styles.disabled]}>
          <Text style={styles.actionText}>DROP</Text>
        </Pressable>
      </View>

      {buildValues.map(value => <Pressable key={value} onPress={() => act({
      type: 'BUILD',
      houseValue: value
    })} style={styles.actionCapsule}>
          <Text style={styles.actionText}>BUILD HOUSE {value}</Text>
        </Pressable>)}

      <Pressable onPress={() => reset(playerCount)} style={styles.resetButton}>
        <Text style={styles.resetText}>NEW SEEP</Text>
      </Pressable>
    </ScrollView>;
}
const SICBO_BETS = [{
  type: "SMALL",
  label: "SMALL"
}, {
  type: "BIG",
  label: "BIG"
}, {
  type: "ODD",
  label: "ODD"
}, {
  type: "EVEN",
  label: "EVEN"
}, {
  type: "ANY_TRIPLE",
  label: "ANY TRIPLE"
}, {
  type: "DOUBLE",
  value: 1,
  label: "DOUBLE 1"
}, {
  type: "DOUBLE",
  value: 2,
  label: "DOUBLE 2"
}, {
  type: "DOUBLE",
  value: 3,
  label: "DOUBLE 3"
}, {
  type: "DOUBLE",
  value: 4,
  label: "DOUBLE 4"
}, {
  type: "DOUBLE",
  value: 5,
  label: "DOUBLE 5"
}, {
  type: "DOUBLE",
  value: 6,
  label: "DOUBLE 6"
}, {
  type: "SPECIFIC_TRIPLE",
  value: 1,
  label: "TRIPLE 1"
}, {
  type: "SPECIFIC_TRIPLE",
  value: 2,
  label: "TRIPLE 2"
}, {
  type: "SPECIFIC_TRIPLE",
  value: 3,
  label: "TRIPLE 3"
}, {
  type: "SPECIFIC_TRIPLE",
  value: 4,
  label: "TRIPLE 4"
}, {
  type: "SPECIFIC_TRIPLE",
  value: 5,
  label: "TRIPLE 5"
}, {
  type: "SPECIFIC_TRIPLE",
  value: 6,
  label: "TRIPLE 6"
}, {
  type: "TOTAL",
  value: 4,
  label: "TOTAL 4"
}, {
  type: "TOTAL",
  value: 5,
  label: "TOTAL 5"
}, {
  type: "TOTAL",
  value: 6,
  label: "TOTAL 6"
}, {
  type: "TOTAL",
  value: 7,
  label: "TOTAL 7"
}, {
  type: "TOTAL",
  value: 8,
  label: "TOTAL 8"
}, {
  type: "TOTAL",
  value: 9,
  label: "TOTAL 9"
}, {
  type: "TOTAL",
  value: 10,
  label: "TOTAL 10"
}, {
  type: "TOTAL",
  value: 11,
  label: "TOTAL 11"
}, {
  type: "TOTAL",
  value: 12,
  label: "TOTAL 12"
}, {
  type: "TOTAL",
  value: 13,
  label: "TOTAL 13"
}, {
  type: "TOTAL",
  value: 14,
  label: "TOTAL 14"
}, {
  type: "TOTAL",
  value: 15,
  label: "TOTAL 15"
}, {
  type: "TOTAL",
  value: 16,
  label: "TOTAL 16"
}, {
  type: "TOTAL",
  value: 17,
  label: "TOTAL 17"
}];
function SicBoGame() {
  const [playerCount, setPlayerCount] = useState(2);
  const [state, setState] = useState(() => Core.createSicBo(2));
  const [bet, setBet] = useState(SICBO_BETS[0]);
  const [stake, setStake] = useState('10');
  const reset = count => {
    setPlayerCount(count);
    setState(Core.createSicBo(count));
  };
  const play = () => {
    try {
      setState(previous => Core.sicBoPlay(previous, bet, Number(stake)));
    } catch (error) {
      setState(previous => ({
        ...previous,
        message: String(error.message)
      }));
    }
  };
  return <ScrollView contentContainerStyle={styles.gameBody}>
      <Text style={styles.gameTitle}>SIC BO</Text>
      <ModePicker value={playerCount} onChange={reset} />
      <Text style={styles.status}>
        PLAYER {state.currentPlayer + 1} · {state.message}
      </Text>
      <Text style={styles.virtualOnly}>VIRTUAL CHIPS ONLY</Text>

      <View style={styles.diceRow}>
        {state.lastDice.map((die, index) => <View key={`${die}-${index}`} style={styles.die}>
            <Text style={styles.dieText}>{die}</Text>
          </View>)}
      </View>

      <Text style={styles.scoreLine}>
        {state.players.map(player => `P${player.id + 1}: ${player.chips}`).join(' · ')}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.betRow}>
          {SICBO_BETS.map(option => <Pressable key={option.label} onPress={() => setBet(option)} style={[styles.actionCapsule, bet.label === option.label && styles.modeChoiceActive]}>
              <Text style={styles.actionText}>{option.label}</Text>
            </Pressable>)}
        </View>
      </ScrollView>

      <TextInput value={stake} onChangeText={setStake} keyboardType="number-pad" placeholder="STAKE" placeholderTextColor="rgba(217,171,87,0.45)" style={styles.stakeInput} />

      <Pressable onPress={play} style={styles.rollCapsule}>
        <Text style={styles.rollText}>ROLL THREE DICE</Text>
      </Pressable>

      <Pressable onPress={() => reset(playerCount)} style={styles.resetButton}>
        <Text style={styles.resetText}>NEW SIC BO</Text>
      </Pressable>
    </ScrollView>;
}
function PlayableGamesDock() {
  const [activeGame, setActiveGame] = useState(null);
  const content = useMemo(() => {
    if (activeGame === 'LUDO') return <LudoGame />;
    if (activeGame === 'SEEP') return <SeepGame />;
    if (activeGame === 'SICBO') return <SicBoGame />;
    return null;
  }, [activeGame]);
  return <>
      <View pointerEvents="box-none" style={styles.dock}>
        <OrbButton label="LUDO" glyph="♟" onPress={() => setActiveGame('LUDO')} />
        <OrbButton label="SEEP" glyph="♠" onPress={() => setActiveGame('SEEP')} />
        <OrbButton label="SIC BO" glyph="⚄" onPress={() => setActiveGame('SICBO')} />
      </View>

      <Modal visible={activeGame !== null} animationType="fade" transparent={false} onRequestClose={() => setActiveGame(null)}>
        <SafeAreaView style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeadline}>MASTER OF GAMES</Text>
            <Pressable onPress={() => setActiveGame(null)}>
              <Text style={styles.closeText}>CLOSE</Text>
            </Pressable>
          </View>
          {content}
        </SafeAreaView>
      </Modal>
    </>;
}
export function withMBWPlayableGamesHub(ScreenComponent) {
  function MBWPlayableGamesHubScreen(props) {
    return <View style={styles.host}>
        <ScreenComponent {...props} />
        <PlayableGamesDock />
      </View>;
  }
  MBWPlayableGamesHubScreen.displayName = `MBWPlayableGamesHub(${ScreenComponent.displayName || ScreenComponent.name || 'Screen'})`;
  return MBWPlayableGamesHubScreen;
}
const styles = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  dock: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 26,
    zIndex: 900,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  orbButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(217,171,87,0.70)',
    backgroundColor: 'rgba(5,2,2,0.90)'
  },
  orbGlyph: {
    color: GOLD,
    fontSize: 24
  },
  orbLabel: {
    marginTop: 3,
    color: GOLD,
    fontFamily: 'serif',
    fontSize: 10,
    letterSpacing: 1.4
  },
  modalRoot: {
    flex: 1,
    backgroundColor: BLACK
  },
  modalHeader: {
    minHeight: 74,
    paddingHorizontal: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(217,171,87,0.42)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalHeadline: {
    color: GOLD,
    fontFamily: 'serif',
    fontSize: 18,
    letterSpacing: 3.4
  },
  closeText: {
    color: GOLD,
    fontSize: 12,
    letterSpacing: 2
  },
  gameBody: {
    padding: 20,
    paddingBottom: 80
  },
  gameTitle: {
    color: GOLD,
    fontFamily: 'serif',
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 4,
    marginBottom: 18
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16
  },
  modeChoice: {
    minWidth: 118,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(217,171,87,0.48)'
  },
  modeChoiceActive: {
    borderColor: GOLD,
    backgroundColor: 'rgba(75,6,28,0.70)'
  },
  modeText: {
    color: GOLD,
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 1.4
  },
  status: {
    color: '#F0DFC0',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 1.2
  },
  scoreLine: {
    color: GREEN,
    textAlign: 'center',
    marginBottom: 15
  },
  diceOrbit: {
    alignItems: 'center',
    marginVertical: 14
  },
  diceButton: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: 'rgba(81,32,93,0.38)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  diceText: {
    color: GOLD,
    fontFamily: 'serif',
    fontSize: 23
  },
  playerLane: {
    marginVertical: 10
  },
  playerName: {
    color: GOLD,
    fontFamily: 'serif',
    marginBottom: 8,
    letterSpacing: 1.4
  },
  tokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  token: {
    minWidth: 70,
    minHeight: 48,
    margin: 4,
    paddingHorizontal: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(217,171,87,0.38)',
    backgroundColor: 'rgba(75,6,28,0.34)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tokenActive: {
    borderColor: GOLD,
    backgroundColor: 'rgba(81,32,93,0.65)'
  },
  tokenFinished: {
    borderColor: GREEN
  },
  tokenText: {
    color: '#F0DFC0',
    fontSize: 11
  },
  zoneTitle: {
    color: GOLD,
    fontFamily: 'serif',
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 2
  },
  pieceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  playingPiece: {
    minWidth: 58,
    minHeight: 72,
    margin: 4,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217,171,87,0.45)',
    backgroundColor: 'rgba(5,2,2,0.85)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playingPieceSelected: {
    borderColor: GREEN,
    backgroundColor: 'rgba(81,32,93,0.58)'
  },
  playingPieceText: {
    color: GOLD,
    fontFamily: 'serif',
    fontSize: 16
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16
  },
  actionCapsule: {
    margin: 5,
    paddingVertical: 11,
    paddingHorizontal: 17,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: 'rgba(75,6,28,0.44)'
  },
  actionText: {
    color: GOLD,
    fontSize: 11,
    letterSpacing: 1.2
  },
  disabled: {
    opacity: 0.28
  },
  resetButton: {
    alignSelf: 'center',
    marginTop: 28,
    paddingVertical: 11,
    paddingHorizontal: 22
  },
  resetText: {
    color: GOLD,
    letterSpacing: 2
  },
  virtualOnly: {
    color: GREEN,
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 1.4,
    marginBottom: 12
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 14
  },
  die: {
    width: 66,
    height: 66,
    marginHorizontal: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: 'rgba(81,32,93,0.48)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dieText: {
    color: GOLD,
    fontFamily: 'serif',
    fontSize: 28
  },
  betRow: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  stakeInput: {
    alignSelf: 'center',
    minWidth: 170,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: GOLD,
    color: '#F0DFC0',
    textAlign: 'center'
  },
  rollCapsule: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: 'rgba(75,6,28,0.66)'
  },
  rollText: {
    color: GOLD,
    fontFamily: 'serif',
    letterSpacing: 2
  }
});

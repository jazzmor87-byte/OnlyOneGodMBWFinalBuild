import React from 'react';
import { Text, View } from 'react-native';
import MBWScreenGuard from '../components/MBWScreenGuard';

import * as MBWRouteModule_0_ArcadeHubScreen from '../../screens/ArcadeHubScreen';
import * as MBWRouteModule_1_CinematicIntroScreen from '../screens/Entry/CinematicIntroScreen';
import * as MBWRouteModule_2_DashboardScreen from '../../screens/DashboardScreen';
import * as MBWRouteModule_3_GamesActionScreen from '../screens/Generated208/Games/GamesActionScreen';
import * as MBWRouteModule_4_GamesAssetsScreen from '../screens/Generated208/Games/GamesAssetsScreen';
import * as MBWRouteModule_5_GamesButtonsScreen from '../screens/Generated208/Games/GamesButtonsScreen';
import * as MBWRouteModule_6_GamesEntryScreen from '../screens/Generated208/Games/GamesEntryScreen';
import * as MBWRouteModule_7_GamesLiveScreen from '../screens/Generated208/Games/GamesLiveScreen';
import * as MBWRouteModule_8_GamesLogicScreen from '../screens/Generated208/Games/GamesLogicScreen';
import * as MBWRouteModule_9_GamesMotionScreen from '../screens/Generated208/Games/GamesMotionScreen';
import * as MBWRouteModule_10_GamesOverviewScreen from '../screens/Generated208/Games/GamesOverviewScreen';
import * as MBWRouteModule_11_GamesPanchTatvaScreen from '../screens/Generated208/Games/GamesPanchTatvaScreen';
import * as MBWRouteModule_12_GamesPosterScreen from '../screens/Generated208/Games/GamesPosterScreen';
import * as MBWRouteModule_13_GamesProofScreen from '../screens/Generated208/Games/GamesProofScreen';
import * as MBWRouteModule_14_GamesResultScreen from '../screens/Generated208/Games/GamesResultScreen';
import * as MBWRouteModule_15_GamesReturnScreen from '../screens/Generated208/Games/GamesReturnScreen';
import * as MBWRouteModule_16_GamesScreen from '../screens/Sections/GamesScreen';
import * as MBWRouteModule_17_GamesSeedScreen from '../screens/Generated208/Games/GamesSeedScreen';
import * as MBWRouteModule_18_GamesStateScreen from '../screens/Generated208/Games/GamesStateScreen';
import * as MBWRouteModule_19_GamesVaultScreen from '../screens/Generated208/Games/GamesVaultScreen';
import * as MBWRouteModule_20_GateLockedScreen from '../screens/Entry/GateLockedScreen';
import * as MBWRouteModule_21_GateOpenScreen from '../screens/Entry/GateOpenScreen';
import * as MBWRouteModule_22_KamashastraActionScreen from '../screens/Generated208/Kamashastra/KamashastraActionScreen';
import * as MBWRouteModule_23_KamashastraAssetsScreen from '../screens/Generated208/Kamashastra/KamashastraAssetsScreen';
import * as MBWRouteModule_24_KamashastraButtonsScreen from '../screens/Generated208/Kamashastra/KamashastraButtonsScreen';
import * as MBWRouteModule_25_KamashastraEntryScreen from '../screens/Generated208/Kamashastra/KamashastraEntryScreen';
import * as MBWRouteModule_26_KamashastraLiveScreen from '../screens/Generated208/Kamashastra/KamashastraLiveScreen';
import * as MBWRouteModule_27_KamashastraLogicScreen from '../screens/Generated208/Kamashastra/KamashastraLogicScreen';
import * as MBWRouteModule_28_KamashastraMotionScreen from '../screens/Generated208/Kamashastra/KamashastraMotionScreen';
import * as MBWRouteModule_29_KamashastraOverviewScreen from '../screens/Generated208/Kamashastra/KamashastraOverviewScreen';
import * as MBWRouteModule_30_KamashastraPanchTatvaScreen from '../screens/Generated208/Kamashastra/KamashastraPanchTatvaScreen';
import * as MBWRouteModule_31_KamashastraPosterScreen from '../screens/Generated208/Kamashastra/KamashastraPosterScreen';
import * as MBWRouteModule_32_KamashastraProofScreen from '../screens/Generated208/Kamashastra/KamashastraProofScreen';
import * as MBWRouteModule_33_KamashastraResultScreen from '../../src/screens/KamashastraResultScreen';
import * as MBWRouteModule_34_KamashastraReturnScreen from '../screens/Generated208/Kamashastra/KamashastraReturnScreen';
import * as MBWRouteModule_35_KamashastraScreen from '../screens/Sections/KamashastraScreen';
import * as MBWRouteModule_36_KamashastraSeedScreen from '../screens/Generated208/Kamashastra/KamashastraSeedScreen';
import * as MBWRouteModule_37_KamashastraStateScreen from '../screens/Generated208/Kamashastra/KamashastraStateScreen';
import * as MBWRouteModule_38_KamashastraVaultScreen from '../screens/Generated208/Kamashastra/KamashastraVaultScreen';
import * as MBWRouteModule_39_LiveLoungeActionScreen from '../screens/Generated208/LiveLounge/LiveLoungeActionScreen';
import * as MBWRouteModule_40_LiveLoungeAssetsScreen from '../screens/Generated208/LiveLounge/LiveLoungeAssetsScreen';
import * as MBWRouteModule_41_LiveLoungeButtonsScreen from '../screens/Generated208/LiveLounge/LiveLoungeButtonsScreen';
import * as MBWRouteModule_42_LiveLoungeEntryScreen from '../screens/Generated208/LiveLounge/LiveLoungeEntryScreen';
import * as MBWRouteModule_43_LiveLoungeLiveScreen from '../screens/Generated208/LiveLounge/LiveLoungeLiveScreen';
import * as MBWRouteModule_44_LiveLoungeLogicScreen from '../screens/Generated208/LiveLounge/LiveLoungeLogicScreen';
import * as MBWRouteModule_45_LiveLoungeMotionScreen from '../screens/Generated208/LiveLounge/LiveLoungeMotionScreen';
import * as MBWRouteModule_46_LiveLoungeOverviewScreen from '../screens/Generated208/LiveLounge/LiveLoungeOverviewScreen';
import * as MBWRouteModule_47_LiveLoungePanchTatvaScreen from '../screens/Generated208/LiveLounge/LiveLoungePanchTatvaScreen';
import * as MBWRouteModule_48_LiveLoungePosterScreen from '../screens/Generated208/LiveLounge/LiveLoungePosterScreen';
import * as MBWRouteModule_49_LiveLoungeProofScreen from '../screens/Generated208/LiveLounge/LiveLoungeProofScreen';
import * as MBWRouteModule_50_LiveLoungeResultScreen from '../screens/Generated208/LiveLounge/LiveLoungeResultScreen';
import * as MBWRouteModule_51_LiveLoungeReturnScreen from '../screens/Generated208/LiveLounge/LiveLoungeReturnScreen';
import * as MBWRouteModule_52_LiveLoungeScreen from '../screens/Sections/LiveLoungeScreen';
import * as MBWRouteModule_53_LiveLoungeSeedScreen from '../screens/Generated208/LiveLounge/LiveLoungeSeedScreen';
import * as MBWRouteModule_54_LiveLoungeStateScreen from '../screens/Generated208/LiveLounge/LiveLoungeStateScreen';
import * as MBWRouteModule_55_LiveLoungeVaultScreen from '../screens/Generated208/LiveLounge/LiveLoungeVaultScreen';
import * as MBWRouteModule_56_MBWOSRuntimeCarryScreen from '../screens/OS/MBWOSRuntimeCarryScreen';
import * as MBWRouteModule_58_MainHubScreen from '../screens/MainHubScreen';
import * as MBWRouteModule_59_MasterOfCoinsActionScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsActionScreen';
import * as MBWRouteModule_60_MasterOfCoinsAssetsScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsAssetsScreen';
import * as MBWRouteModule_61_MasterOfCoinsButtonsScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsButtonsScreen';
import * as MBWRouteModule_62_MasterOfCoinsEntryScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsEntryScreen';
import * as MBWRouteModule_63_MasterOfCoinsLiveScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsLiveScreen';
import * as MBWRouteModule_64_MasterOfCoinsLogicScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsLogicScreen';
import * as MBWRouteModule_65_MasterOfCoinsMotionScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsMotionScreen';
import * as MBWRouteModule_66_MasterOfCoinsOverviewScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsOverviewScreen';
import * as MBWRouteModule_67_MasterOfCoinsPanchTatvaScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsPanchTatvaScreen';
import * as MBWRouteModule_68_MasterOfCoinsPosterScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsPosterScreen';
import * as MBWRouteModule_69_MasterOfCoinsProofScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsProofScreen';
import * as MBWRouteModule_70_MasterOfCoinsResultScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsResultScreen';
import * as MBWRouteModule_71_MasterOfCoinsReturnScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsReturnScreen';
import * as MBWRouteModule_72_MasterOfCoinsScreen from '../screens/Sections/MasterOfCoinsScreen';
import * as MBWRouteModule_73_MasterOfCoinsSeedScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsSeedScreen';
import * as MBWRouteModule_74_MasterOfCoinsStateScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsStateScreen';
import * as MBWRouteModule_75_MasterOfCoinsVaultScreen from '../screens/Generated208/MasterOfCoins/MasterOfCoinsVaultScreen';
import * as MBWRouteModule_76_MasterOfLifeActionScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeActionScreen';
import * as MBWRouteModule_77_MasterOfLifeAssetsScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeAssetsScreen';
import * as MBWRouteModule_78_MasterOfLifeButtonsScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeButtonsScreen';
import * as MBWRouteModule_79_MasterOfLifeEntryScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeEntryScreen';
import * as MBWRouteModule_80_MasterOfLifeLiveScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeLiveScreen';
import * as MBWRouteModule_81_MasterOfLifeLogicScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeLogicScreen';
import * as MBWRouteModule_82_MasterOfLifeMotionScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeMotionScreen';
import * as MBWRouteModule_83_MasterOfLifeOverviewScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeOverviewScreen';
import * as MBWRouteModule_84_MasterOfLifePanchTatvaScreen from '../screens/Generated208/MasterOfLife/MasterOfLifePanchTatvaScreen';
import * as MBWRouteModule_85_MasterOfLifePosterScreen from '../screens/Generated208/MasterOfLife/MasterOfLifePosterScreen';
import * as MBWRouteModule_86_MasterOfLifeProofScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeProofScreen';
import * as MBWRouteModule_87_MasterOfLifeResultScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeResultScreen';
import * as MBWRouteModule_88_MasterOfLifeReturnScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeReturnScreen';
import * as MBWRouteModule_89_MasterOfLifeScreen from '../screens/Sections/MasterOfLifeScreen';
import * as MBWRouteModule_90_MasterOfLifeSeedScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeSeedScreen';
import * as MBWRouteModule_91_MasterOfLifeStateScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeStateScreen';
import * as MBWRouteModule_92_MasterOfLifeVaultScreen from '../screens/Generated208/MasterOfLife/MasterOfLifeVaultScreen';
import * as MBWRouteModule_93_MatchFinalReincarnationScreen from '../../src/screens/MatchFinalReincarnationScreen';
import * as MBWRouteModule_94_MatchmakingActionScreen from '../screens/Generated208/Matchmaking/MatchmakingActionScreen';
import * as MBWRouteModule_95_MatchmakingAssetsScreen from '../screens/Generated208/Matchmaking/MatchmakingAssetsScreen';
import * as MBWRouteModule_96_MatchmakingButtonsScreen from '../screens/Generated208/Matchmaking/MatchmakingButtonsScreen';
import * as MBWRouteModule_97_MatchmakingEntryScreen from '../screens/Generated208/Matchmaking/MatchmakingEntryScreen';
import * as MBWRouteModule_98_MatchmakingLiveScreen from '../screens/Generated208/Matchmaking/MatchmakingLiveScreen';
import * as MBWRouteModule_99_MatchmakingLogicScreen from '../screens/Generated208/Matchmaking/MatchmakingLogicScreen';
import * as MBWRouteModule_100_MatchmakingMotionScreen from '../screens/Generated208/Matchmaking/MatchmakingMotionScreen';
import * as MBWRouteModule_101_MatchmakingOverviewScreen from '../screens/Generated208/Matchmaking/MatchmakingOverviewScreen';
import * as MBWRouteModule_102_MatchmakingPanchTatvaScreen from '../screens/Generated208/Matchmaking/MatchmakingPanchTatvaScreen';
import * as MBWRouteModule_103_MatchmakingPosterScreen from '../screens/Generated208/Matchmaking/MatchmakingPosterScreen';
import * as MBWRouteModule_104_MatchmakingProofScreen from '../screens/Generated208/Matchmaking/MatchmakingProofScreen';
import * as MBWRouteModule_105_MatchmakingResultScreen from '../screens/Generated208/Matchmaking/MatchmakingResultScreen';
import * as MBWRouteModule_106_MatchmakingReturnScreen from '../screens/Generated208/Matchmaking/MatchmakingReturnScreen';
import * as MBWRouteModule_107_MatchmakingScreen from '../screens/Sections/MatchmakingScreen';
import * as MBWRouteModule_108_MatchmakingSeedScreen from '../screens/Generated208/Matchmaking/MatchmakingSeedScreen';
import * as MBWRouteModule_109_MatchmakingStateScreen from '../screens/Generated208/Matchmaking/MatchmakingStateScreen';
import * as MBWRouteModule_110_MatchmakingVaultScreen from '../screens/Generated208/Matchmaking/MatchmakingVaultScreen';
import * as MBWRouteModule_111_MensLoungeActionScreen from '../screens/Generated208/MensLounge/MensLoungeActionScreen';
import * as MBWRouteModule_112_MensLoungeAssetsScreen from '../screens/Generated208/MensLounge/MensLoungeAssetsScreen';
import * as MBWRouteModule_113_MensLoungeButtonsScreen from '../screens/Generated208/MensLounge/MensLoungeButtonsScreen';
import * as MBWRouteModule_114_MensLoungeEntryScreen from '../screens/Generated208/MensLounge/MensLoungeEntryScreen';
import * as MBWRouteModule_115_MensLoungeLiveScreen from '../screens/Generated208/MensLounge/MensLoungeLiveScreen';
import * as MBWRouteModule_116_MensLoungeLogicScreen from '../screens/Generated208/MensLounge/MensLoungeLogicScreen';
import * as MBWRouteModule_117_MensLoungeMotionScreen from '../screens/Generated208/MensLounge/MensLoungeMotionScreen';
import * as MBWRouteModule_118_MensLoungeOverviewScreen from '../screens/Generated208/MensLounge/MensLoungeOverviewScreen';
import * as MBWRouteModule_119_MensLoungePanchTatvaScreen from '../screens/Generated208/MensLounge/MensLoungePanchTatvaScreen';
import * as MBWRouteModule_120_MensLoungePosterScreen from '../screens/Generated208/MensLounge/MensLoungePosterScreen';
import * as MBWRouteModule_121_MensLoungeProofScreen from '../screens/Generated208/MensLounge/MensLoungeProofScreen';
import * as MBWRouteModule_122_MensLoungeResultScreen from '../screens/Generated208/MensLounge/MensLoungeResultScreen';
import * as MBWRouteModule_123_MensLoungeReturnScreen from '../screens/Generated208/MensLounge/MensLoungeReturnScreen';
import * as MBWRouteModule_124_MensLoungeScreen from '../screens/Sections/MensLoungeScreen';
import * as MBWRouteModule_125_MensLoungeSeedScreen from '../screens/Generated208/MensLounge/MensLoungeSeedScreen';
import * as MBWRouteModule_126_MensLoungeStateScreen from '../screens/Generated208/MensLounge/MensLoungeStateScreen';
import * as MBWRouteModule_127_MensLoungeVaultScreen from '../screens/Generated208/MensLounge/MensLoungeVaultScreen';
import * as MBWRouteModule_128_MerchandiseActionScreen from '../screens/Generated208/Merchandise/MerchandiseActionScreen';
import * as MBWRouteModule_129_MerchandiseAssetsScreen from '../screens/Generated208/Merchandise/MerchandiseAssetsScreen';
import * as MBWRouteModule_130_MerchandiseButtonsScreen from '../screens/Generated208/Merchandise/MerchandiseButtonsScreen';
import * as MBWRouteModule_131_MerchandiseEntryScreen from '../screens/Generated208/Merchandise/MerchandiseEntryScreen';
import * as MBWRouteModule_132_MerchandiseLiveScreen from '../screens/Generated208/Merchandise/MerchandiseLiveScreen';
import * as MBWRouteModule_133_MerchandiseLogicScreen from '../screens/Generated208/Merchandise/MerchandiseLogicScreen';
import * as MBWRouteModule_134_MerchandiseMotionScreen from '../screens/Generated208/Merchandise/MerchandiseMotionScreen';
import * as MBWRouteModule_135_MerchandiseOverviewScreen from '../screens/Generated208/Merchandise/MerchandiseOverviewScreen';
import * as MBWRouteModule_136_MerchandisePanchTatvaScreen from '../screens/Generated208/Merchandise/MerchandisePanchTatvaScreen';
import * as MBWRouteModule_137_MerchandisePosterScreen from '../screens/Generated208/Merchandise/MerchandisePosterScreen';
import * as MBWRouteModule_138_MerchandiseProofScreen from '../screens/Generated208/Merchandise/MerchandiseProofScreen';
import * as MBWRouteModule_139_MerchandiseResultScreen from '../screens/Generated208/Merchandise/MerchandiseResultScreen';
import * as MBWRouteModule_140_MerchandiseReturnScreen from '../screens/Generated208/Merchandise/MerchandiseReturnScreen';
import * as MBWRouteModule_141_MerchandiseScreen from '../screens/Sections/MerchandiseScreen';
import * as MBWRouteModule_142_MerchandiseSeedScreen from '../screens/Generated208/Merchandise/MerchandiseSeedScreen';
import * as MBWRouteModule_143_MerchandiseStateScreen from '../screens/Generated208/Merchandise/MerchandiseStateScreen';
import * as MBWRouteModule_144_MerchandiseVaultScreen from '../screens/Generated208/Merchandise/MerchandiseVaultScreen';
import * as MBWRouteModule_145_NearbyActionScreen from '../screens/Generated208/Nearby/NearbyActionScreen';
import * as MBWRouteModule_146_NearbyAssetsScreen from '../screens/Generated208/Nearby/NearbyAssetsScreen';
import * as MBWRouteModule_147_NearbyButtonsScreen from '../screens/Generated208/Nearby/NearbyButtonsScreen';
import * as MBWRouteModule_148_NearbyEntryScreen from '../screens/Generated208/Nearby/NearbyEntryScreen';
import * as MBWRouteModule_149_NearbyLiveScreen from '../screens/Generated208/Nearby/NearbyLiveScreen';
import * as MBWRouteModule_150_NearbyLogicScreen from '../screens/Generated208/Nearby/NearbyLogicScreen';
import * as MBWRouteModule_151_NearbyMotionScreen from '../screens/Generated208/Nearby/NearbyMotionScreen';
import * as MBWRouteModule_152_NearbyOverviewScreen from '../screens/Generated208/Nearby/NearbyOverviewScreen';
import * as MBWRouteModule_153_NearbyPanchTatvaScreen from '../screens/Generated208/Nearby/NearbyPanchTatvaScreen';
import * as MBWRouteModule_154_NearbyPosterScreen from '../screens/Generated208/Nearby/NearbyPosterScreen';
import * as MBWRouteModule_155_NearbyProofScreen from '../screens/Generated208/Nearby/NearbyProofScreen';
import * as MBWRouteModule_156_NearbyResultScreen from '../screens/Generated208/Nearby/NearbyResultScreen';
import * as MBWRouteModule_157_NearbyReturnScreen from '../screens/Generated208/Nearby/NearbyReturnScreen';
import * as MBWRouteModule_158_NearbyScreen from '../screens/Sections/NearbyScreen';
import * as MBWRouteModule_159_NearbySeedScreen from '../screens/Generated208/Nearby/NearbySeedScreen';
import * as MBWRouteModule_160_NearbyStateScreen from '../screens/Generated208/Nearby/NearbyStateScreen';
import * as MBWRouteModule_161_NearbyVaultScreen from '../screens/Generated208/Nearby/NearbyVaultScreen';
import * as MBWRouteModule_162_PathSelectionScreen from '../screens/Entry/PathSelectionScreen';
import * as MBWRouteModule_163_PentagramArcadeScreen from '../../screens/arcade/PentagramArcadeScreen';
import * as MBWRouteModule_164_ProfilePosterActionScreen from '../screens/Generated208/ProfilePoster/ProfilePosterActionScreen';
import * as MBWRouteModule_165_ProfilePosterAssetsScreen from '../screens/Generated208/ProfilePoster/ProfilePosterAssetsScreen';
import * as MBWRouteModule_166_ProfilePosterButtonsScreen from '../screens/Generated208/ProfilePoster/ProfilePosterButtonsScreen';
import * as MBWRouteModule_167_ProfilePosterEntryScreen from '../screens/Generated208/ProfilePoster/ProfilePosterEntryScreen';
import * as MBWRouteModule_168_ProfilePosterLiveScreen from '../screens/Generated208/ProfilePoster/ProfilePosterLiveScreen';
import * as MBWRouteModule_169_ProfilePosterLogicScreen from '../screens/Generated208/ProfilePoster/ProfilePosterLogicScreen';
import * as MBWRouteModule_170_ProfilePosterMotionScreen from '../screens/Generated208/ProfilePoster/ProfilePosterMotionScreen';
import * as MBWRouteModule_171_ProfilePosterOverviewScreen from '../screens/Generated208/ProfilePoster/ProfilePosterOverviewScreen';
import * as MBWRouteModule_172_ProfilePosterPanchTatvaScreen from '../screens/Generated208/ProfilePoster/ProfilePosterPanchTatvaScreen';
import * as MBWRouteModule_173_ProfilePosterPosterScreen from '../screens/Generated208/ProfilePoster/ProfilePosterPosterScreen';
import * as MBWRouteModule_174_ProfilePosterProofScreen from '../screens/Generated208/ProfilePoster/ProfilePosterProofScreen';
import * as MBWRouteModule_175_ProfilePosterResultScreen from '../screens/Generated208/ProfilePoster/ProfilePosterResultScreen';
import * as MBWRouteModule_176_ProfilePosterReturnScreen from '../screens/Generated208/ProfilePoster/ProfilePosterReturnScreen';
import * as MBWRouteModule_177_ProfilePosterScreen from '../screens/Sections/AIPosterScreen';
import * as MBWRouteModule_178_ProfilePosterSeedScreen from '../screens/Generated208/ProfilePoster/ProfilePosterSeedScreen';
import * as MBWRouteModule_179_ProfilePosterStateScreen from '../screens/Generated208/ProfilePoster/ProfilePosterStateScreen';
import * as MBWRouteModule_180_ProfilePosterVaultScreen from '../screens/Generated208/ProfilePoster/ProfilePosterVaultScreen';
import * as MBWRouteModule_181_SettingsActionScreen from '../screens/Generated208/Settings/SettingsActionScreen';
import * as MBWRouteModule_182_SettingsAssetsScreen from '../screens/Generated208/Settings/SettingsAssetsScreen';
import * as MBWRouteModule_183_SettingsButtonsScreen from '../screens/Generated208/Settings/SettingsButtonsScreen';
import * as MBWRouteModule_184_SettingsEntryScreen from '../screens/Generated208/Settings/SettingsEntryScreen';
import * as MBWRouteModule_185_SettingsLiveScreen from '../screens/Generated208/Settings/SettingsLiveScreen';
import * as MBWRouteModule_186_SettingsLogicScreen from '../screens/Generated208/Settings/SettingsLogicScreen';
import * as MBWRouteModule_187_SettingsMotionScreen from '../screens/Generated208/Settings/SettingsMotionScreen';
import * as MBWRouteModule_188_SettingsOverviewScreen from '../screens/Generated208/Settings/SettingsOverviewScreen';
import * as MBWRouteModule_189_SettingsPanchTatvaScreen from '../screens/Generated208/Settings/SettingsPanchTatvaScreen';
import * as MBWRouteModule_190_SettingsPosterScreen from '../screens/Generated208/Settings/SettingsPosterScreen';
import * as MBWRouteModule_191_SettingsProofScreen from '../screens/Generated208/Settings/SettingsProofScreen';
import * as MBWRouteModule_192_SettingsResultScreen from '../screens/Generated208/Settings/SettingsResultScreen';
import * as MBWRouteModule_193_SettingsReturnScreen from '../screens/Generated208/Settings/SettingsReturnScreen';
import * as MBWRouteModule_194_SettingsScreen from '../screens/Sections/SettingsScreen';
import * as MBWRouteModule_195_SettingsSeedScreen from '../screens/Generated208/Settings/SettingsSeedScreen';
import * as MBWRouteModule_196_SettingsStateScreen from '../screens/Generated208/Settings/SettingsStateScreen';
import * as MBWRouteModule_197_SettingsVaultScreen from '../screens/Generated208/Settings/SettingsVaultScreen';
import * as MBWRouteModule_198_SubscriptionSignupScreen from '../screens/Entry/SubscriptionSignupScreen';
import * as MBWRouteModule_199_TravelLocalActionScreen from '../screens/Generated208/TravelLocal/TravelLocalActionScreen';
import * as MBWRouteModule_200_TravelLocalAssetsScreen from '../screens/Generated208/TravelLocal/TravelLocalAssetsScreen';
import * as MBWRouteModule_201_TravelLocalButtonsScreen from '../screens/Generated208/TravelLocal/TravelLocalButtonsScreen';
import * as MBWRouteModule_202_TravelLocalEntryScreen from '../screens/Generated208/TravelLocal/TravelLocalEntryScreen';
import * as MBWRouteModule_203_TravelLocalLiveScreen from '../screens/Generated208/TravelLocal/TravelLocalLiveScreen';
import * as MBWRouteModule_204_TravelLocalLogicScreen from '../screens/Generated208/TravelLocal/TravelLocalLogicScreen';
import * as MBWRouteModule_205_TravelLocalMotionScreen from '../screens/Generated208/TravelLocal/TravelLocalMotionScreen';
import * as MBWRouteModule_206_TravelLocalOverviewScreen from '../screens/Generated208/TravelLocal/TravelLocalOverviewScreen';
import * as MBWRouteModule_207_TravelLocalPanchTatvaScreen from '../screens/Generated208/TravelLocal/TravelLocalPanchTatvaScreen';
import * as MBWRouteModule_208_TravelLocalPosterScreen from '../screens/Generated208/TravelLocal/TravelLocalPosterScreen';
import * as MBWRouteModule_209_TravelLocalProofScreen from '../screens/Generated208/TravelLocal/TravelLocalProofScreen';
import * as MBWRouteModule_210_TravelLocalResultScreen from '../screens/Generated208/TravelLocal/TravelLocalResultScreen';
import * as MBWRouteModule_211_TravelLocalReturnScreen from '../screens/Generated208/TravelLocal/TravelLocalReturnScreen';
import * as MBWRouteModule_212_TravelLocalScreen from '../screens/Sections/TravelLocalScreen';
import * as MBWRouteModule_213_TravelLocalSeedScreen from '../screens/Generated208/TravelLocal/TravelLocalSeedScreen';
import * as MBWRouteModule_214_TravelLocalStateScreen from '../screens/Generated208/TravelLocal/TravelLocalStateScreen';
import * as MBWRouteModule_215_TravelLocalVaultScreen from '../screens/Generated208/TravelLocal/TravelLocalVaultScreen';
import * as MBWRouteModule_216_TravelOverseasActionScreen from '../screens/Generated208/TravelOverseas/TravelOverseasActionScreen';
import * as MBWRouteModule_217_TravelOverseasAssetsScreen from '../screens/Generated208/TravelOverseas/TravelOverseasAssetsScreen';
import * as MBWRouteModule_218_TravelOverseasButtonsScreen from '../screens/Generated208/TravelOverseas/TravelOverseasButtonsScreen';
import * as MBWRouteModule_219_TravelOverseasEntryScreen from '../screens/Generated208/TravelOverseas/TravelOverseasEntryScreen';
import * as MBWRouteModule_220_TravelOverseasLiveScreen from '../screens/Generated208/TravelOverseas/TravelOverseasLiveScreen';
import * as MBWRouteModule_221_TravelOverseasLogicScreen from '../screens/Generated208/TravelOverseas/TravelOverseasLogicScreen';
import * as MBWRouteModule_222_TravelOverseasMotionScreen from '../screens/Generated208/TravelOverseas/TravelOverseasMotionScreen';
import * as MBWRouteModule_223_TravelOverseasOverviewScreen from '../screens/Generated208/TravelOverseas/TravelOverseasOverviewScreen';
import * as MBWRouteModule_224_TravelOverseasPanchTatvaScreen from '../screens/Generated208/TravelOverseas/TravelOverseasPanchTatvaScreen';
import * as MBWRouteModule_225_TravelOverseasPosterScreen from '../screens/Generated208/TravelOverseas/TravelOverseasPosterScreen';
import * as MBWRouteModule_226_TravelOverseasProofScreen from '../screens/Generated208/TravelOverseas/TravelOverseasProofScreen';
import * as MBWRouteModule_227_TravelOverseasResultScreen from '../screens/Generated208/TravelOverseas/TravelOverseasResultScreen';
import * as MBWRouteModule_228_TravelOverseasReturnScreen from '../screens/Generated208/TravelOverseas/TravelOverseasReturnScreen';
import * as MBWRouteModule_229_TravelOverseasScreen from '../screens/Sections/TravelOverseasScreen';
import * as MBWRouteModule_230_TravelOverseasSeedScreen from '../screens/Generated208/TravelOverseas/TravelOverseasSeedScreen';
import * as MBWRouteModule_231_TravelOverseasStateScreen from '../screens/Generated208/TravelOverseas/TravelOverseasStateScreen';
import * as MBWRouteModule_232_TravelOverseasVaultScreen from '../screens/Generated208/TravelOverseas/TravelOverseasVaultScreen';

import { MBWScreenOSBridge } from './MBWScreenOSBridge';
const MBWRouteSafeBody = ({ route }) => (
  <MBWScreenGuard screenName={route?.name || 'MBW SAFE ROUTE'}>
    <View style={{ minHeight: 320, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#d6a643', letterSpacing: 2, textAlign: 'center' }}>MEN BEHIND WALL</Text>
      <Text style={{ color: '#ffffff99', marginTop: 12, textAlign: 'center' }}>ROUTE </Text>
    </View>
  </MBWScreenGuard>
);

function resolveMBWRouteComponent(moduleValue, exportName) {
  const chosen = moduleValue?.default || moduleValue?.[exportName];
  if (typeof chosen === 'function' || typeof chosen === 'object') return chosen;
  return MBWRouteSafeBody;
}


export const wrappedComponent = true;

function wrapMBWRouteComponent(screenName, ScreenComponent) {
  const MBWRouteWrapped = (props) => (
    <MBWScreenOSBridge
      screenName={screenName}
      ScreenComponent={ScreenComponent}
      {...props}
    />
  );
  MBWRouteWrapped.displayName = `MBWRouteWrapped_${screenName}`;
  return MBWRouteWrapped;
}

export const MBW_GENERATED_ROUTE_REGISTRY = Object.freeze([
  { name: 'ArcadeHubScreen', component: wrapMBWRouteComponent('ArcadeHubScreen', resolveMBWRouteComponent(MBWRouteModule_0_ArcadeHubScreen, 'ArcadeHubScreen')) },
  { name: 'CinematicIntroScreen', component: wrapMBWRouteComponent('CinematicIntroScreen', resolveMBWRouteComponent(MBWRouteModule_1_CinematicIntroScreen, 'CinematicIntroScreen')) },
  { name: 'DashboardScreen', component: wrapMBWRouteComponent('DashboardScreen', resolveMBWRouteComponent(MBWRouteModule_2_DashboardScreen, 'DashboardScreen')) },
  { name: 'GamesActionScreen', component: wrapMBWRouteComponent('GamesActionScreen', resolveMBWRouteComponent(MBWRouteModule_3_GamesActionScreen, 'GamesActionScreen')) },
  { name: 'GamesAssetsScreen', component: wrapMBWRouteComponent('GamesAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_4_GamesAssetsScreen, 'GamesAssetsScreen')) },
  { name: 'GamesButtonsScreen', component: wrapMBWRouteComponent('GamesButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_5_GamesButtonsScreen, 'GamesButtonsScreen')) },
  { name: 'GamesEntryScreen', component: wrapMBWRouteComponent('GamesEntryScreen', resolveMBWRouteComponent(MBWRouteModule_6_GamesEntryScreen, 'GamesEntryScreen')) },
  { name: 'GamesLiveScreen', component: wrapMBWRouteComponent('GamesLiveScreen', resolveMBWRouteComponent(MBWRouteModule_7_GamesLiveScreen, 'GamesLiveScreen')) },
  { name: 'GamesLogicScreen', component: wrapMBWRouteComponent('GamesLogicScreen', resolveMBWRouteComponent(MBWRouteModule_8_GamesLogicScreen, 'GamesLogicScreen')) },
  { name: 'GamesMotionScreen', component: wrapMBWRouteComponent('GamesMotionScreen', resolveMBWRouteComponent(MBWRouteModule_9_GamesMotionScreen, 'GamesMotionScreen')) },
  { name: 'GamesOverviewScreen', component: wrapMBWRouteComponent('GamesOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_10_GamesOverviewScreen, 'GamesOverviewScreen')) },
  { name: 'GamesPanchTatvaScreen', component: wrapMBWRouteComponent('GamesPanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_11_GamesPanchTatvaScreen, 'GamesPanchTatvaScreen')) },
  { name: 'GamesPosterScreen', component: wrapMBWRouteComponent('GamesPosterScreen', resolveMBWRouteComponent(MBWRouteModule_12_GamesPosterScreen, 'GamesPosterScreen')) },
  { name: 'GamesProofScreen', component: wrapMBWRouteComponent('GamesProofScreen', resolveMBWRouteComponent(MBWRouteModule_13_GamesProofScreen, 'GamesProofScreen')) },
  { name: 'GamesResultScreen', component: wrapMBWRouteComponent('GamesResultScreen', resolveMBWRouteComponent(MBWRouteModule_14_GamesResultScreen, 'GamesResultScreen')) },
  { name: 'GamesReturnScreen', component: wrapMBWRouteComponent('GamesReturnScreen', resolveMBWRouteComponent(MBWRouteModule_15_GamesReturnScreen, 'GamesReturnScreen')) },
  { name: 'GamesScreen', component: wrapMBWRouteComponent('GamesScreen', resolveMBWRouteComponent(MBWRouteModule_16_GamesScreen, 'GamesScreen')) },
  { name: 'GamesSeedScreen', component: wrapMBWRouteComponent('GamesSeedScreen', resolveMBWRouteComponent(MBWRouteModule_17_GamesSeedScreen, 'GamesSeedScreen')) },
  { name: 'GamesStateScreen', component: wrapMBWRouteComponent('GamesStateScreen', resolveMBWRouteComponent(MBWRouteModule_18_GamesStateScreen, 'GamesStateScreen')) },
  { name: 'GamesVaultScreen', component: wrapMBWRouteComponent('GamesVaultScreen', resolveMBWRouteComponent(MBWRouteModule_19_GamesVaultScreen, 'GamesVaultScreen')) },
  { name: 'GateLockedScreen', component: wrapMBWRouteComponent('GateLockedScreen', resolveMBWRouteComponent(MBWRouteModule_20_GateLockedScreen, 'GateLockedScreen')) },
  { name: 'GateOpenScreen', component: wrapMBWRouteComponent('GateOpenScreen', resolveMBWRouteComponent(MBWRouteModule_21_GateOpenScreen, 'GateOpenScreen')) },
  { name: 'KamashastraActionScreen', component: wrapMBWRouteComponent('KamashastraActionScreen', resolveMBWRouteComponent(MBWRouteModule_22_KamashastraActionScreen, 'KamashastraActionScreen')) },
  { name: 'KamashastraAssetsScreen', component: wrapMBWRouteComponent('KamashastraAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_23_KamashastraAssetsScreen, 'KamashastraAssetsScreen')) },
  { name: 'KamashastraButtonsScreen', component: wrapMBWRouteComponent('KamashastraButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_24_KamashastraButtonsScreen, 'KamashastraButtonsScreen')) },
  { name: 'KamashastraEntryScreen', component: wrapMBWRouteComponent('KamashastraEntryScreen', resolveMBWRouteComponent(MBWRouteModule_25_KamashastraEntryScreen, 'KamashastraEntryScreen')) },
  { name: 'KamashastraLiveScreen', component: wrapMBWRouteComponent('KamashastraLiveScreen', resolveMBWRouteComponent(MBWRouteModule_26_KamashastraLiveScreen, 'KamashastraLiveScreen')) },
  { name: 'KamashastraLogicScreen', component: wrapMBWRouteComponent('KamashastraLogicScreen', resolveMBWRouteComponent(MBWRouteModule_27_KamashastraLogicScreen, 'KamashastraLogicScreen')) },
  { name: 'KamashastraMotionScreen', component: wrapMBWRouteComponent('KamashastraMotionScreen', resolveMBWRouteComponent(MBWRouteModule_28_KamashastraMotionScreen, 'KamashastraMotionScreen')) },
  { name: 'KamashastraOverviewScreen', component: wrapMBWRouteComponent('KamashastraOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_29_KamashastraOverviewScreen, 'KamashastraOverviewScreen')) },
  { name: 'KamashastraPanchTatvaScreen', component: wrapMBWRouteComponent('KamashastraPanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_30_KamashastraPanchTatvaScreen, 'KamashastraPanchTatvaScreen')) },
  { name: 'KamashastraPosterScreen', component: wrapMBWRouteComponent('KamashastraPosterScreen', resolveMBWRouteComponent(MBWRouteModule_31_KamashastraPosterScreen, 'KamashastraPosterScreen')) },
  { name: 'KamashastraProofScreen', component: wrapMBWRouteComponent('KamashastraProofScreen', resolveMBWRouteComponent(MBWRouteModule_32_KamashastraProofScreen, 'KamashastraProofScreen')) },
  { name: 'KamashastraResultScreen', component: wrapMBWRouteComponent('KamashastraResultScreen', resolveMBWRouteComponent(MBWRouteModule_33_KamashastraResultScreen, 'KamashastraResultScreen')) },
  { name: 'KamashastraReturnScreen', component: wrapMBWRouteComponent('KamashastraReturnScreen', resolveMBWRouteComponent(MBWRouteModule_34_KamashastraReturnScreen, 'KamashastraReturnScreen')) },
  { name: 'KamashastraScreen', component: wrapMBWRouteComponent('KamashastraScreen', resolveMBWRouteComponent(MBWRouteModule_35_KamashastraScreen, 'KamashastraScreen')) },
  { name: 'KamashastraSeedScreen', component: wrapMBWRouteComponent('KamashastraSeedScreen', resolveMBWRouteComponent(MBWRouteModule_36_KamashastraSeedScreen, 'KamashastraSeedScreen')) },
  { name: 'KamashastraStateScreen', component: wrapMBWRouteComponent('KamashastraStateScreen', resolveMBWRouteComponent(MBWRouteModule_37_KamashastraStateScreen, 'KamashastraStateScreen')) },
  { name: 'KamashastraVaultScreen', component: wrapMBWRouteComponent('KamashastraVaultScreen', resolveMBWRouteComponent(MBWRouteModule_38_KamashastraVaultScreen, 'KamashastraVaultScreen')) },
  { name: 'LiveLoungeActionScreen', component: wrapMBWRouteComponent('LiveLoungeActionScreen', resolveMBWRouteComponent(MBWRouteModule_39_LiveLoungeActionScreen, 'LiveLoungeActionScreen')) },
  { name: 'LiveLoungeAssetsScreen', component: wrapMBWRouteComponent('LiveLoungeAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_40_LiveLoungeAssetsScreen, 'LiveLoungeAssetsScreen')) },
  { name: 'LiveLoungeButtonsScreen', component: wrapMBWRouteComponent('LiveLoungeButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_41_LiveLoungeButtonsScreen, 'LiveLoungeButtonsScreen')) },
  { name: 'LiveLoungeEntryScreen', component: wrapMBWRouteComponent('LiveLoungeEntryScreen', resolveMBWRouteComponent(MBWRouteModule_42_LiveLoungeEntryScreen, 'LiveLoungeEntryScreen')) },
  { name: 'LiveLoungeLiveScreen', component: wrapMBWRouteComponent('LiveLoungeLiveScreen', resolveMBWRouteComponent(MBWRouteModule_43_LiveLoungeLiveScreen, 'LiveLoungeLiveScreen')) },
  { name: 'LiveLoungeLogicScreen', component: wrapMBWRouteComponent('LiveLoungeLogicScreen', resolveMBWRouteComponent(MBWRouteModule_44_LiveLoungeLogicScreen, 'LiveLoungeLogicScreen')) },
  { name: 'LiveLoungeMotionScreen', component: wrapMBWRouteComponent('LiveLoungeMotionScreen', resolveMBWRouteComponent(MBWRouteModule_45_LiveLoungeMotionScreen, 'LiveLoungeMotionScreen')) },
  { name: 'LiveLoungeOverviewScreen', component: wrapMBWRouteComponent('LiveLoungeOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_46_LiveLoungeOverviewScreen, 'LiveLoungeOverviewScreen')) },
  { name: 'LiveLoungePanchTatvaScreen', component: wrapMBWRouteComponent('LiveLoungePanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_47_LiveLoungePanchTatvaScreen, 'LiveLoungePanchTatvaScreen')) },
  { name: 'LiveLoungePosterScreen', component: wrapMBWRouteComponent('LiveLoungePosterScreen', resolveMBWRouteComponent(MBWRouteModule_48_LiveLoungePosterScreen, 'LiveLoungePosterScreen')) },
  { name: 'LiveLoungeProofScreen', component: wrapMBWRouteComponent('LiveLoungeProofScreen', resolveMBWRouteComponent(MBWRouteModule_49_LiveLoungeProofScreen, 'LiveLoungeProofScreen')) },
  { name: 'LiveLoungeResultScreen', component: wrapMBWRouteComponent('LiveLoungeResultScreen', resolveMBWRouteComponent(MBWRouteModule_50_LiveLoungeResultScreen, 'LiveLoungeResultScreen')) },
  { name: 'LiveLoungeReturnScreen', component: wrapMBWRouteComponent('LiveLoungeReturnScreen', resolveMBWRouteComponent(MBWRouteModule_51_LiveLoungeReturnScreen, 'LiveLoungeReturnScreen')) },
  { name: 'LiveLoungeScreen', component: wrapMBWRouteComponent('LiveLoungeScreen', resolveMBWRouteComponent(MBWRouteModule_52_LiveLoungeScreen, 'LiveLoungeScreen')) },
  { name: 'LiveLoungeSeedScreen', component: wrapMBWRouteComponent('LiveLoungeSeedScreen', resolveMBWRouteComponent(MBWRouteModule_53_LiveLoungeSeedScreen, 'LiveLoungeSeedScreen')) },
  { name: 'LiveLoungeStateScreen', component: wrapMBWRouteComponent('LiveLoungeStateScreen', resolveMBWRouteComponent(MBWRouteModule_54_LiveLoungeStateScreen, 'LiveLoungeStateScreen')) },
  { name: 'LiveLoungeVaultScreen', component: wrapMBWRouteComponent('LiveLoungeVaultScreen', resolveMBWRouteComponent(MBWRouteModule_55_LiveLoungeVaultScreen, 'LiveLoungeVaultScreen')) },
  { name: 'MBWOSRuntimeCarryScreen', component: wrapMBWRouteComponent('MBWOSRuntimeCarryScreen', resolveMBWRouteComponent(MBWRouteModule_56_MBWOSRuntimeCarryScreen, 'MBWOSRuntimeCarryScreen')) },
  { name: 'MainHubScreen', component: wrapMBWRouteComponent('MainHubScreen', resolveMBWRouteComponent(MBWRouteModule_58_MainHubScreen, 'MainHubScreen')) },
  { name: 'MasterOfCoinsActionScreen', component: wrapMBWRouteComponent('MasterOfCoinsActionScreen', resolveMBWRouteComponent(MBWRouteModule_59_MasterOfCoinsActionScreen, 'MasterOfCoinsActionScreen')) },
  { name: 'MasterOfCoinsAssetsScreen', component: wrapMBWRouteComponent('MasterOfCoinsAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_60_MasterOfCoinsAssetsScreen, 'MasterOfCoinsAssetsScreen')) },
  { name: 'MasterOfCoinsButtonsScreen', component: wrapMBWRouteComponent('MasterOfCoinsButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_61_MasterOfCoinsButtonsScreen, 'MasterOfCoinsButtonsScreen')) },
  { name: 'MasterOfCoinsEntryScreen', component: wrapMBWRouteComponent('MasterOfCoinsEntryScreen', resolveMBWRouteComponent(MBWRouteModule_62_MasterOfCoinsEntryScreen, 'MasterOfCoinsEntryScreen')) },
  { name: 'MasterOfCoinsLiveScreen', component: wrapMBWRouteComponent('MasterOfCoinsLiveScreen', resolveMBWRouteComponent(MBWRouteModule_63_MasterOfCoinsLiveScreen, 'MasterOfCoinsLiveScreen')) },
  { name: 'MasterOfCoinsLogicScreen', component: wrapMBWRouteComponent('MasterOfCoinsLogicScreen', resolveMBWRouteComponent(MBWRouteModule_64_MasterOfCoinsLogicScreen, 'MasterOfCoinsLogicScreen')) },
  { name: 'MasterOfCoinsMotionScreen', component: wrapMBWRouteComponent('MasterOfCoinsMotionScreen', resolveMBWRouteComponent(MBWRouteModule_65_MasterOfCoinsMotionScreen, 'MasterOfCoinsMotionScreen')) },
  { name: 'MasterOfCoinsOverviewScreen', component: wrapMBWRouteComponent('MasterOfCoinsOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_66_MasterOfCoinsOverviewScreen, 'MasterOfCoinsOverviewScreen')) },
  { name: 'MasterOfCoinsPanchTatvaScreen', component: wrapMBWRouteComponent('MasterOfCoinsPanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_67_MasterOfCoinsPanchTatvaScreen, 'MasterOfCoinsPanchTatvaScreen')) },
  { name: 'MasterOfCoinsPosterScreen', component: wrapMBWRouteComponent('MasterOfCoinsPosterScreen', resolveMBWRouteComponent(MBWRouteModule_68_MasterOfCoinsPosterScreen, 'MasterOfCoinsPosterScreen')) },
  { name: 'MasterOfCoinsProofScreen', component: wrapMBWRouteComponent('MasterOfCoinsProofScreen', resolveMBWRouteComponent(MBWRouteModule_69_MasterOfCoinsProofScreen, 'MasterOfCoinsProofScreen')) },
  { name: 'MasterOfCoinsResultScreen', component: wrapMBWRouteComponent('MasterOfCoinsResultScreen', resolveMBWRouteComponent(MBWRouteModule_70_MasterOfCoinsResultScreen, 'MasterOfCoinsResultScreen')) },
  { name: 'MasterOfCoinsReturnScreen', component: wrapMBWRouteComponent('MasterOfCoinsReturnScreen', resolveMBWRouteComponent(MBWRouteModule_71_MasterOfCoinsReturnScreen, 'MasterOfCoinsReturnScreen')) },
  { name: 'MasterOfCoinsScreen', component: wrapMBWRouteComponent('MasterOfCoinsScreen', resolveMBWRouteComponent(MBWRouteModule_72_MasterOfCoinsScreen, 'MasterOfCoinsScreen')) },
  { name: 'MasterOfCoinsSeedScreen', component: wrapMBWRouteComponent('MasterOfCoinsSeedScreen', resolveMBWRouteComponent(MBWRouteModule_73_MasterOfCoinsSeedScreen, 'MasterOfCoinsSeedScreen')) },
  { name: 'MasterOfCoinsStateScreen', component: wrapMBWRouteComponent('MasterOfCoinsStateScreen', resolveMBWRouteComponent(MBWRouteModule_74_MasterOfCoinsStateScreen, 'MasterOfCoinsStateScreen')) },
  { name: 'MasterOfCoinsVaultScreen', component: wrapMBWRouteComponent('MasterOfCoinsVaultScreen', resolveMBWRouteComponent(MBWRouteModule_75_MasterOfCoinsVaultScreen, 'MasterOfCoinsVaultScreen')) },
  { name: 'MasterOfLifeActionScreen', component: wrapMBWRouteComponent('MasterOfLifeActionScreen', resolveMBWRouteComponent(MBWRouteModule_76_MasterOfLifeActionScreen, 'MasterOfLifeActionScreen')) },
  { name: 'MasterOfLifeAssetsScreen', component: wrapMBWRouteComponent('MasterOfLifeAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_77_MasterOfLifeAssetsScreen, 'MasterOfLifeAssetsScreen')) },
  { name: 'MasterOfLifeButtonsScreen', component: wrapMBWRouteComponent('MasterOfLifeButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_78_MasterOfLifeButtonsScreen, 'MasterOfLifeButtonsScreen')) },
  { name: 'MasterOfLifeEntryScreen', component: wrapMBWRouteComponent('MasterOfLifeEntryScreen', resolveMBWRouteComponent(MBWRouteModule_79_MasterOfLifeEntryScreen, 'MasterOfLifeEntryScreen')) },
  { name: 'MasterOfLifeLiveScreen', component: wrapMBWRouteComponent('MasterOfLifeLiveScreen', resolveMBWRouteComponent(MBWRouteModule_80_MasterOfLifeLiveScreen, 'MasterOfLifeLiveScreen')) },
  { name: 'MasterOfLifeLogicScreen', component: wrapMBWRouteComponent('MasterOfLifeLogicScreen', resolveMBWRouteComponent(MBWRouteModule_81_MasterOfLifeLogicScreen, 'MasterOfLifeLogicScreen')) },
  { name: 'MasterOfLifeMotionScreen', component: wrapMBWRouteComponent('MasterOfLifeMotionScreen', resolveMBWRouteComponent(MBWRouteModule_82_MasterOfLifeMotionScreen, 'MasterOfLifeMotionScreen')) },
  { name: 'MasterOfLifeOverviewScreen', component: wrapMBWRouteComponent('MasterOfLifeOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_83_MasterOfLifeOverviewScreen, 'MasterOfLifeOverviewScreen')) },
  { name: 'MasterOfLifePanchTatvaScreen', component: wrapMBWRouteComponent('MasterOfLifePanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_84_MasterOfLifePanchTatvaScreen, 'MasterOfLifePanchTatvaScreen')) },
  { name: 'MasterOfLifePosterScreen', component: wrapMBWRouteComponent('MasterOfLifePosterScreen', resolveMBWRouteComponent(MBWRouteModule_85_MasterOfLifePosterScreen, 'MasterOfLifePosterScreen')) },
  { name: 'MasterOfLifeProofScreen', component: wrapMBWRouteComponent('MasterOfLifeProofScreen', resolveMBWRouteComponent(MBWRouteModule_86_MasterOfLifeProofScreen, 'MasterOfLifeProofScreen')) },
  { name: 'MasterOfLifeResultScreen', component: wrapMBWRouteComponent('MasterOfLifeResultScreen', resolveMBWRouteComponent(MBWRouteModule_87_MasterOfLifeResultScreen, 'MasterOfLifeResultScreen')) },
  { name: 'MasterOfLifeReturnScreen', component: wrapMBWRouteComponent('MasterOfLifeReturnScreen', resolveMBWRouteComponent(MBWRouteModule_88_MasterOfLifeReturnScreen, 'MasterOfLifeReturnScreen')) },
  { name: 'MasterOfLifeScreen', component: wrapMBWRouteComponent('MasterOfLifeScreen', resolveMBWRouteComponent(MBWRouteModule_89_MasterOfLifeScreen, 'MasterOfLifeScreen')) },
  { name: 'MasterOfLifeSeedScreen', component: wrapMBWRouteComponent('MasterOfLifeSeedScreen', resolveMBWRouteComponent(MBWRouteModule_90_MasterOfLifeSeedScreen, 'MasterOfLifeSeedScreen')) },
  { name: 'MasterOfLifeStateScreen', component: wrapMBWRouteComponent('MasterOfLifeStateScreen', resolveMBWRouteComponent(MBWRouteModule_91_MasterOfLifeStateScreen, 'MasterOfLifeStateScreen')) },
  { name: 'MasterOfLifeVaultScreen', component: wrapMBWRouteComponent('MasterOfLifeVaultScreen', resolveMBWRouteComponent(MBWRouteModule_92_MasterOfLifeVaultScreen, 'MasterOfLifeVaultScreen')) },
  { name: 'MatchFinalReincarnationScreen', component: wrapMBWRouteComponent('MatchFinalReincarnationScreen', resolveMBWRouteComponent(MBWRouteModule_93_MatchFinalReincarnationScreen, 'MatchFinalReincarnationScreen')) },
  { name: 'MatchmakingActionScreen', component: wrapMBWRouteComponent('MatchmakingActionScreen', resolveMBWRouteComponent(MBWRouteModule_94_MatchmakingActionScreen, 'MatchmakingActionScreen')) },
  { name: 'MatchmakingAssetsScreen', component: wrapMBWRouteComponent('MatchmakingAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_95_MatchmakingAssetsScreen, 'MatchmakingAssetsScreen')) },
  { name: 'MatchmakingButtonsScreen', component: wrapMBWRouteComponent('MatchmakingButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_96_MatchmakingButtonsScreen, 'MatchmakingButtonsScreen')) },
  { name: 'MatchmakingEntryScreen', component: wrapMBWRouteComponent('MatchmakingEntryScreen', resolveMBWRouteComponent(MBWRouteModule_97_MatchmakingEntryScreen, 'MatchmakingEntryScreen')) },
  { name: 'MatchmakingLiveScreen', component: wrapMBWRouteComponent('MatchmakingLiveScreen', resolveMBWRouteComponent(MBWRouteModule_98_MatchmakingLiveScreen, 'MatchmakingLiveScreen')) },
  { name: 'MatchmakingLogicScreen', component: wrapMBWRouteComponent('MatchmakingLogicScreen', resolveMBWRouteComponent(MBWRouteModule_99_MatchmakingLogicScreen, 'MatchmakingLogicScreen')) },
  { name: 'MatchmakingMotionScreen', component: wrapMBWRouteComponent('MatchmakingMotionScreen', resolveMBWRouteComponent(MBWRouteModule_100_MatchmakingMotionScreen, 'MatchmakingMotionScreen')) },
  { name: 'MatchmakingOverviewScreen', component: wrapMBWRouteComponent('MatchmakingOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_101_MatchmakingOverviewScreen, 'MatchmakingOverviewScreen')) },
  { name: 'MatchmakingPanchTatvaScreen', component: wrapMBWRouteComponent('MatchmakingPanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_102_MatchmakingPanchTatvaScreen, 'MatchmakingPanchTatvaScreen')) },
  { name: 'MatchmakingPosterScreen', component: wrapMBWRouteComponent('MatchmakingPosterScreen', resolveMBWRouteComponent(MBWRouteModule_103_MatchmakingPosterScreen, 'MatchmakingPosterScreen')) },
  { name: 'MatchmakingProofScreen', component: wrapMBWRouteComponent('MatchmakingProofScreen', resolveMBWRouteComponent(MBWRouteModule_104_MatchmakingProofScreen, 'MatchmakingProofScreen')) },
  { name: 'MatchmakingResultScreen', component: wrapMBWRouteComponent('MatchmakingResultScreen', resolveMBWRouteComponent(MBWRouteModule_105_MatchmakingResultScreen, 'MatchmakingResultScreen')) },
  { name: 'MatchmakingReturnScreen', component: wrapMBWRouteComponent('MatchmakingReturnScreen', resolveMBWRouteComponent(MBWRouteModule_106_MatchmakingReturnScreen, 'MatchmakingReturnScreen')) },
  { name: 'MatchmakingScreen', component: wrapMBWRouteComponent('MatchmakingScreen', resolveMBWRouteComponent(MBWRouteModule_107_MatchmakingScreen, 'MatchmakingScreen')) },
  { name: 'MatchmakingSeedScreen', component: wrapMBWRouteComponent('MatchmakingSeedScreen', resolveMBWRouteComponent(MBWRouteModule_108_MatchmakingSeedScreen, 'MatchmakingSeedScreen')) },
  { name: 'MatchmakingStateScreen', component: wrapMBWRouteComponent('MatchmakingStateScreen', resolveMBWRouteComponent(MBWRouteModule_109_MatchmakingStateScreen, 'MatchmakingStateScreen')) },
  { name: 'MatchmakingVaultScreen', component: wrapMBWRouteComponent('MatchmakingVaultScreen', resolveMBWRouteComponent(MBWRouteModule_110_MatchmakingVaultScreen, 'MatchmakingVaultScreen')) },
  { name: 'MensLoungeActionScreen', component: wrapMBWRouteComponent('MensLoungeActionScreen', resolveMBWRouteComponent(MBWRouteModule_111_MensLoungeActionScreen, 'MensLoungeActionScreen')) },
  { name: 'MensLoungeAssetsScreen', component: wrapMBWRouteComponent('MensLoungeAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_112_MensLoungeAssetsScreen, 'MensLoungeAssetsScreen')) },
  { name: 'MensLoungeButtonsScreen', component: wrapMBWRouteComponent('MensLoungeButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_113_MensLoungeButtonsScreen, 'MensLoungeButtonsScreen')) },
  { name: 'MensLoungeEntryScreen', component: wrapMBWRouteComponent('MensLoungeEntryScreen', resolveMBWRouteComponent(MBWRouteModule_114_MensLoungeEntryScreen, 'MensLoungeEntryScreen')) },
  { name: 'MensLoungeLiveScreen', component: wrapMBWRouteComponent('MensLoungeLiveScreen', resolveMBWRouteComponent(MBWRouteModule_115_MensLoungeLiveScreen, 'MensLoungeLiveScreen')) },
  { name: 'MensLoungeLogicScreen', component: wrapMBWRouteComponent('MensLoungeLogicScreen', resolveMBWRouteComponent(MBWRouteModule_116_MensLoungeLogicScreen, 'MensLoungeLogicScreen')) },
  { name: 'MensLoungeMotionScreen', component: wrapMBWRouteComponent('MensLoungeMotionScreen', resolveMBWRouteComponent(MBWRouteModule_117_MensLoungeMotionScreen, 'MensLoungeMotionScreen')) },
  { name: 'MensLoungeOverviewScreen', component: wrapMBWRouteComponent('MensLoungeOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_118_MensLoungeOverviewScreen, 'MensLoungeOverviewScreen')) },
  { name: 'MensLoungePanchTatvaScreen', component: wrapMBWRouteComponent('MensLoungePanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_119_MensLoungePanchTatvaScreen, 'MensLoungePanchTatvaScreen')) },
  { name: 'MensLoungePosterScreen', component: wrapMBWRouteComponent('MensLoungePosterScreen', resolveMBWRouteComponent(MBWRouteModule_120_MensLoungePosterScreen, 'MensLoungePosterScreen')) },
  { name: 'MensLoungeProofScreen', component: wrapMBWRouteComponent('MensLoungeProofScreen', resolveMBWRouteComponent(MBWRouteModule_121_MensLoungeProofScreen, 'MensLoungeProofScreen')) },
  { name: 'MensLoungeResultScreen', component: wrapMBWRouteComponent('MensLoungeResultScreen', resolveMBWRouteComponent(MBWRouteModule_122_MensLoungeResultScreen, 'MensLoungeResultScreen')) },
  { name: 'MensLoungeReturnScreen', component: wrapMBWRouteComponent('MensLoungeReturnScreen', resolveMBWRouteComponent(MBWRouteModule_123_MensLoungeReturnScreen, 'MensLoungeReturnScreen')) },
  { name: 'MensLoungeScreen', component: wrapMBWRouteComponent('MensLoungeScreen', resolveMBWRouteComponent(MBWRouteModule_124_MensLoungeScreen, 'MensLoungeScreen')) },
  { name: 'MensLoungeSeedScreen', component: wrapMBWRouteComponent('MensLoungeSeedScreen', resolveMBWRouteComponent(MBWRouteModule_125_MensLoungeSeedScreen, 'MensLoungeSeedScreen')) },
  { name: 'MensLoungeStateScreen', component: wrapMBWRouteComponent('MensLoungeStateScreen', resolveMBWRouteComponent(MBWRouteModule_126_MensLoungeStateScreen, 'MensLoungeStateScreen')) },
  { name: 'MensLoungeVaultScreen', component: wrapMBWRouteComponent('MensLoungeVaultScreen', resolveMBWRouteComponent(MBWRouteModule_127_MensLoungeVaultScreen, 'MensLoungeVaultScreen')) },
  { name: 'MerchandiseActionScreen', component: wrapMBWRouteComponent('MerchandiseActionScreen', resolveMBWRouteComponent(MBWRouteModule_128_MerchandiseActionScreen, 'MerchandiseActionScreen')) },
  { name: 'MerchandiseAssetsScreen', component: wrapMBWRouteComponent('MerchandiseAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_129_MerchandiseAssetsScreen, 'MerchandiseAssetsScreen')) },
  { name: 'MerchandiseButtonsScreen', component: wrapMBWRouteComponent('MerchandiseButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_130_MerchandiseButtonsScreen, 'MerchandiseButtonsScreen')) },
  { name: 'MerchandiseEntryScreen', component: wrapMBWRouteComponent('MerchandiseEntryScreen', resolveMBWRouteComponent(MBWRouteModule_131_MerchandiseEntryScreen, 'MerchandiseEntryScreen')) },
  { name: 'MerchandiseLiveScreen', component: wrapMBWRouteComponent('MerchandiseLiveScreen', resolveMBWRouteComponent(MBWRouteModule_132_MerchandiseLiveScreen, 'MerchandiseLiveScreen')) },
  { name: 'MerchandiseLogicScreen', component: wrapMBWRouteComponent('MerchandiseLogicScreen', resolveMBWRouteComponent(MBWRouteModule_133_MerchandiseLogicScreen, 'MerchandiseLogicScreen')) },
  { name: 'MerchandiseMotionScreen', component: wrapMBWRouteComponent('MerchandiseMotionScreen', resolveMBWRouteComponent(MBWRouteModule_134_MerchandiseMotionScreen, 'MerchandiseMotionScreen')) },
  { name: 'MerchandiseOverviewScreen', component: wrapMBWRouteComponent('MerchandiseOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_135_MerchandiseOverviewScreen, 'MerchandiseOverviewScreen')) },
  { name: 'MerchandisePanchTatvaScreen', component: wrapMBWRouteComponent('MerchandisePanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_136_MerchandisePanchTatvaScreen, 'MerchandisePanchTatvaScreen')) },
  { name: 'MerchandisePosterScreen', component: wrapMBWRouteComponent('MerchandisePosterScreen', resolveMBWRouteComponent(MBWRouteModule_137_MerchandisePosterScreen, 'MerchandisePosterScreen')) },
  { name: 'MerchandiseProofScreen', component: wrapMBWRouteComponent('MerchandiseProofScreen', resolveMBWRouteComponent(MBWRouteModule_138_MerchandiseProofScreen, 'MerchandiseProofScreen')) },
  { name: 'MerchandiseResultScreen', component: wrapMBWRouteComponent('MerchandiseResultScreen', resolveMBWRouteComponent(MBWRouteModule_139_MerchandiseResultScreen, 'MerchandiseResultScreen')) },
  { name: 'MerchandiseReturnScreen', component: wrapMBWRouteComponent('MerchandiseReturnScreen', resolveMBWRouteComponent(MBWRouteModule_140_MerchandiseReturnScreen, 'MerchandiseReturnScreen')) },
  { name: 'MerchandiseScreen', component: wrapMBWRouteComponent('MerchandiseScreen', resolveMBWRouteComponent(MBWRouteModule_141_MerchandiseScreen, 'MerchandiseScreen')) },
  { name: 'MerchandiseSeedScreen', component: wrapMBWRouteComponent('MerchandiseSeedScreen', resolveMBWRouteComponent(MBWRouteModule_142_MerchandiseSeedScreen, 'MerchandiseSeedScreen')) },
  { name: 'MerchandiseStateScreen', component: wrapMBWRouteComponent('MerchandiseStateScreen', resolveMBWRouteComponent(MBWRouteModule_143_MerchandiseStateScreen, 'MerchandiseStateScreen')) },
  { name: 'MerchandiseVaultScreen', component: wrapMBWRouteComponent('MerchandiseVaultScreen', resolveMBWRouteComponent(MBWRouteModule_144_MerchandiseVaultScreen, 'MerchandiseVaultScreen')) },
  { name: 'NearbyActionScreen', component: wrapMBWRouteComponent('NearbyActionScreen', resolveMBWRouteComponent(MBWRouteModule_145_NearbyActionScreen, 'NearbyActionScreen')) },
  { name: 'NearbyAssetsScreen', component: wrapMBWRouteComponent('NearbyAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_146_NearbyAssetsScreen, 'NearbyAssetsScreen')) },
  { name: 'NearbyButtonsScreen', component: wrapMBWRouteComponent('NearbyButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_147_NearbyButtonsScreen, 'NearbyButtonsScreen')) },
  { name: 'NearbyEntryScreen', component: wrapMBWRouteComponent('NearbyEntryScreen', resolveMBWRouteComponent(MBWRouteModule_148_NearbyEntryScreen, 'NearbyEntryScreen')) },
  { name: 'NearbyLiveScreen', component: wrapMBWRouteComponent('NearbyLiveScreen', resolveMBWRouteComponent(MBWRouteModule_149_NearbyLiveScreen, 'NearbyLiveScreen')) },
  { name: 'NearbyLogicScreen', component: wrapMBWRouteComponent('NearbyLogicScreen', resolveMBWRouteComponent(MBWRouteModule_150_NearbyLogicScreen, 'NearbyLogicScreen')) },
  { name: 'NearbyMotionScreen', component: wrapMBWRouteComponent('NearbyMotionScreen', resolveMBWRouteComponent(MBWRouteModule_151_NearbyMotionScreen, 'NearbyMotionScreen')) },
  { name: 'NearbyOverviewScreen', component: wrapMBWRouteComponent('NearbyOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_152_NearbyOverviewScreen, 'NearbyOverviewScreen')) },
  { name: 'NearbyPanchTatvaScreen', component: wrapMBWRouteComponent('NearbyPanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_153_NearbyPanchTatvaScreen, 'NearbyPanchTatvaScreen')) },
  { name: 'NearbyPosterScreen', component: wrapMBWRouteComponent('NearbyPosterScreen', resolveMBWRouteComponent(MBWRouteModule_154_NearbyPosterScreen, 'NearbyPosterScreen')) },
  { name: 'NearbyProofScreen', component: wrapMBWRouteComponent('NearbyProofScreen', resolveMBWRouteComponent(MBWRouteModule_155_NearbyProofScreen, 'NearbyProofScreen')) },
  { name: 'NearbyResultScreen', component: wrapMBWRouteComponent('NearbyResultScreen', resolveMBWRouteComponent(MBWRouteModule_156_NearbyResultScreen, 'NearbyResultScreen')) },
  { name: 'NearbyReturnScreen', component: wrapMBWRouteComponent('NearbyReturnScreen', resolveMBWRouteComponent(MBWRouteModule_157_NearbyReturnScreen, 'NearbyReturnScreen')) },
  { name: 'NearbyScreen', component: wrapMBWRouteComponent('NearbyScreen', resolveMBWRouteComponent(MBWRouteModule_158_NearbyScreen, 'NearbyScreen')) },
  { name: 'NearbySeedScreen', component: wrapMBWRouteComponent('NearbySeedScreen', resolveMBWRouteComponent(MBWRouteModule_159_NearbySeedScreen, 'NearbySeedScreen')) },
  { name: 'NearbyStateScreen', component: wrapMBWRouteComponent('NearbyStateScreen', resolveMBWRouteComponent(MBWRouteModule_160_NearbyStateScreen, 'NearbyStateScreen')) },
  { name: 'NearbyVaultScreen', component: wrapMBWRouteComponent('NearbyVaultScreen', resolveMBWRouteComponent(MBWRouteModule_161_NearbyVaultScreen, 'NearbyVaultScreen')) },
  { name: 'PathSelectionScreen', component: wrapMBWRouteComponent('PathSelectionScreen', resolveMBWRouteComponent(MBWRouteModule_162_PathSelectionScreen, 'PathSelectionScreen')) },
  { name: 'PentagramArcadeScreen', component: wrapMBWRouteComponent('PentagramArcadeScreen', resolveMBWRouteComponent(MBWRouteModule_163_PentagramArcadeScreen, 'PentagramArcadeScreen')) },
  { name: 'ProfilePosterActionScreen', component: wrapMBWRouteComponent('ProfilePosterActionScreen', resolveMBWRouteComponent(MBWRouteModule_164_ProfilePosterActionScreen, 'ProfilePosterActionScreen')) },
  { name: 'ProfilePosterAssetsScreen', component: wrapMBWRouteComponent('ProfilePosterAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_165_ProfilePosterAssetsScreen, 'ProfilePosterAssetsScreen')) },
  { name: 'ProfilePosterButtonsScreen', component: wrapMBWRouteComponent('ProfilePosterButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_166_ProfilePosterButtonsScreen, 'ProfilePosterButtonsScreen')) },
  { name: 'ProfilePosterEntryScreen', component: wrapMBWRouteComponent('ProfilePosterEntryScreen', resolveMBWRouteComponent(MBWRouteModule_167_ProfilePosterEntryScreen, 'ProfilePosterEntryScreen')) },
  { name: 'ProfilePosterLiveScreen', component: wrapMBWRouteComponent('ProfilePosterLiveScreen', resolveMBWRouteComponent(MBWRouteModule_168_ProfilePosterLiveScreen, 'ProfilePosterLiveScreen')) },
  { name: 'ProfilePosterLogicScreen', component: wrapMBWRouteComponent('ProfilePosterLogicScreen', resolveMBWRouteComponent(MBWRouteModule_169_ProfilePosterLogicScreen, 'ProfilePosterLogicScreen')) },
  { name: 'ProfilePosterMotionScreen', component: wrapMBWRouteComponent('ProfilePosterMotionScreen', resolveMBWRouteComponent(MBWRouteModule_170_ProfilePosterMotionScreen, 'ProfilePosterMotionScreen')) },
  { name: 'ProfilePosterOverviewScreen', component: wrapMBWRouteComponent('ProfilePosterOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_171_ProfilePosterOverviewScreen, 'ProfilePosterOverviewScreen')) },
  { name: 'ProfilePosterPanchTatvaScreen', component: wrapMBWRouteComponent('ProfilePosterPanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_172_ProfilePosterPanchTatvaScreen, 'ProfilePosterPanchTatvaScreen')) },
  { name: 'ProfilePosterPosterScreen', component: wrapMBWRouteComponent('ProfilePosterPosterScreen', resolveMBWRouteComponent(MBWRouteModule_173_ProfilePosterPosterScreen, 'ProfilePosterPosterScreen')) },
  { name: 'ProfilePosterProofScreen', component: wrapMBWRouteComponent('ProfilePosterProofScreen', resolveMBWRouteComponent(MBWRouteModule_174_ProfilePosterProofScreen, 'ProfilePosterProofScreen')) },
  { name: 'ProfilePosterResultScreen', component: wrapMBWRouteComponent('ProfilePosterResultScreen', resolveMBWRouteComponent(MBWRouteModule_175_ProfilePosterResultScreen, 'ProfilePosterResultScreen')) },
  { name: 'ProfilePosterReturnScreen', component: wrapMBWRouteComponent('ProfilePosterReturnScreen', resolveMBWRouteComponent(MBWRouteModule_176_ProfilePosterReturnScreen, 'ProfilePosterReturnScreen')) },
  { name: 'AIPosterScreen', component: wrapMBWRouteComponent('AIPosterScreen', resolveMBWRouteComponent(MBWRouteModule_177_ProfilePosterScreen, 'AIPosterScreen')) },
  { name: 'ProfilePosterSeedScreen', component: wrapMBWRouteComponent('ProfilePosterSeedScreen', resolveMBWRouteComponent(MBWRouteModule_178_ProfilePosterSeedScreen, 'ProfilePosterSeedScreen')) },
  { name: 'ProfilePosterStateScreen', component: wrapMBWRouteComponent('ProfilePosterStateScreen', resolveMBWRouteComponent(MBWRouteModule_179_ProfilePosterStateScreen, 'ProfilePosterStateScreen')) },
  { name: 'ProfilePosterVaultScreen', component: wrapMBWRouteComponent('ProfilePosterVaultScreen', resolveMBWRouteComponent(MBWRouteModule_180_ProfilePosterVaultScreen, 'ProfilePosterVaultScreen')) },
  { name: 'SettingsActionScreen', component: wrapMBWRouteComponent('SettingsActionScreen', resolveMBWRouteComponent(MBWRouteModule_181_SettingsActionScreen, 'SettingsActionScreen')) },
  { name: 'SettingsAssetsScreen', component: wrapMBWRouteComponent('SettingsAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_182_SettingsAssetsScreen, 'SettingsAssetsScreen')) },
  { name: 'SettingsButtonsScreen', component: wrapMBWRouteComponent('SettingsButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_183_SettingsButtonsScreen, 'SettingsButtonsScreen')) },
  { name: 'SettingsEntryScreen', component: wrapMBWRouteComponent('SettingsEntryScreen', resolveMBWRouteComponent(MBWRouteModule_184_SettingsEntryScreen, 'SettingsEntryScreen')) },
  { name: 'SettingsLiveScreen', component: wrapMBWRouteComponent('SettingsLiveScreen', resolveMBWRouteComponent(MBWRouteModule_185_SettingsLiveScreen, 'SettingsLiveScreen')) },
  { name: 'SettingsLogicScreen', component: wrapMBWRouteComponent('SettingsLogicScreen', resolveMBWRouteComponent(MBWRouteModule_186_SettingsLogicScreen, 'SettingsLogicScreen')) },
  { name: 'SettingsMotionScreen', component: wrapMBWRouteComponent('SettingsMotionScreen', resolveMBWRouteComponent(MBWRouteModule_187_SettingsMotionScreen, 'SettingsMotionScreen')) },
  { name: 'SettingsOverviewScreen', component: wrapMBWRouteComponent('SettingsOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_188_SettingsOverviewScreen, 'SettingsOverviewScreen')) },
  { name: 'SettingsPanchTatvaScreen', component: wrapMBWRouteComponent('SettingsPanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_189_SettingsPanchTatvaScreen, 'SettingsPanchTatvaScreen')) },
  { name: 'SettingsPosterScreen', component: wrapMBWRouteComponent('SettingsPosterScreen', resolveMBWRouteComponent(MBWRouteModule_190_SettingsPosterScreen, 'SettingsPosterScreen')) },
  { name: 'SettingsProofScreen', component: wrapMBWRouteComponent('SettingsProofScreen', resolveMBWRouteComponent(MBWRouteModule_191_SettingsProofScreen, 'SettingsProofScreen')) },
  { name: 'SettingsResultScreen', component: wrapMBWRouteComponent('SettingsResultScreen', resolveMBWRouteComponent(MBWRouteModule_192_SettingsResultScreen, 'SettingsResultScreen')) },
  { name: 'SettingsReturnScreen', component: wrapMBWRouteComponent('SettingsReturnScreen', resolveMBWRouteComponent(MBWRouteModule_193_SettingsReturnScreen, 'SettingsReturnScreen')) },
  { name: 'SettingsScreen', component: wrapMBWRouteComponent('SettingsScreen', resolveMBWRouteComponent(MBWRouteModule_194_SettingsScreen, 'SettingsScreen')) },
  { name: 'SettingsSeedScreen', component: wrapMBWRouteComponent('SettingsSeedScreen', resolveMBWRouteComponent(MBWRouteModule_195_SettingsSeedScreen, 'SettingsSeedScreen')) },
  { name: 'SettingsStateScreen', component: wrapMBWRouteComponent('SettingsStateScreen', resolveMBWRouteComponent(MBWRouteModule_196_SettingsStateScreen, 'SettingsStateScreen')) },
  { name: 'SettingsVaultScreen', component: wrapMBWRouteComponent('SettingsVaultScreen', resolveMBWRouteComponent(MBWRouteModule_197_SettingsVaultScreen, 'SettingsVaultScreen')) },
  { name: 'SubscriptionSignupScreen', component: wrapMBWRouteComponent('SubscriptionSignupScreen', resolveMBWRouteComponent(MBWRouteModule_198_SubscriptionSignupScreen, 'SubscriptionSignupScreen')) },
  { name: 'TravelLocalActionScreen', component: wrapMBWRouteComponent('TravelLocalActionScreen', resolveMBWRouteComponent(MBWRouteModule_199_TravelLocalActionScreen, 'TravelLocalActionScreen')) },
  { name: 'TravelLocalAssetsScreen', component: wrapMBWRouteComponent('TravelLocalAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_200_TravelLocalAssetsScreen, 'TravelLocalAssetsScreen')) },
  { name: 'TravelLocalButtonsScreen', component: wrapMBWRouteComponent('TravelLocalButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_201_TravelLocalButtonsScreen, 'TravelLocalButtonsScreen')) },
  { name: 'TravelLocalEntryScreen', component: wrapMBWRouteComponent('TravelLocalEntryScreen', resolveMBWRouteComponent(MBWRouteModule_202_TravelLocalEntryScreen, 'TravelLocalEntryScreen')) },
  { name: 'TravelLocalLiveScreen', component: wrapMBWRouteComponent('TravelLocalLiveScreen', resolveMBWRouteComponent(MBWRouteModule_203_TravelLocalLiveScreen, 'TravelLocalLiveScreen')) },
  { name: 'TravelLocalLogicScreen', component: wrapMBWRouteComponent('TravelLocalLogicScreen', resolveMBWRouteComponent(MBWRouteModule_204_TravelLocalLogicScreen, 'TravelLocalLogicScreen')) },
  { name: 'TravelLocalMotionScreen', component: wrapMBWRouteComponent('TravelLocalMotionScreen', resolveMBWRouteComponent(MBWRouteModule_205_TravelLocalMotionScreen, 'TravelLocalMotionScreen')) },
  { name: 'TravelLocalOverviewScreen', component: wrapMBWRouteComponent('TravelLocalOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_206_TravelLocalOverviewScreen, 'TravelLocalOverviewScreen')) },
  { name: 'TravelLocalPanchTatvaScreen', component: wrapMBWRouteComponent('TravelLocalPanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_207_TravelLocalPanchTatvaScreen, 'TravelLocalPanchTatvaScreen')) },
  { name: 'TravelLocalPosterScreen', component: wrapMBWRouteComponent('TravelLocalPosterScreen', resolveMBWRouteComponent(MBWRouteModule_208_TravelLocalPosterScreen, 'TravelLocalPosterScreen')) },
  { name: 'TravelLocalProofScreen', component: wrapMBWRouteComponent('TravelLocalProofScreen', resolveMBWRouteComponent(MBWRouteModule_209_TravelLocalProofScreen, 'TravelLocalProofScreen')) },
  { name: 'TravelLocalResultScreen', component: wrapMBWRouteComponent('TravelLocalResultScreen', resolveMBWRouteComponent(MBWRouteModule_210_TravelLocalResultScreen, 'TravelLocalResultScreen')) },
  { name: 'TravelLocalReturnScreen', component: wrapMBWRouteComponent('TravelLocalReturnScreen', resolveMBWRouteComponent(MBWRouteModule_211_TravelLocalReturnScreen, 'TravelLocalReturnScreen')) },
  { name: 'TravelLocalScreen', component: wrapMBWRouteComponent('TravelLocalScreen', resolveMBWRouteComponent(MBWRouteModule_212_TravelLocalScreen, 'TravelLocalScreen')) },
  { name: 'TravelLocalSeedScreen', component: wrapMBWRouteComponent('TravelLocalSeedScreen', resolveMBWRouteComponent(MBWRouteModule_213_TravelLocalSeedScreen, 'TravelLocalSeedScreen')) },
  { name: 'TravelLocalStateScreen', component: wrapMBWRouteComponent('TravelLocalStateScreen', resolveMBWRouteComponent(MBWRouteModule_214_TravelLocalStateScreen, 'TravelLocalStateScreen')) },
  { name: 'TravelLocalVaultScreen', component: wrapMBWRouteComponent('TravelLocalVaultScreen', resolveMBWRouteComponent(MBWRouteModule_215_TravelLocalVaultScreen, 'TravelLocalVaultScreen')) },
  { name: 'TravelOverseasActionScreen', component: wrapMBWRouteComponent('TravelOverseasActionScreen', resolveMBWRouteComponent(MBWRouteModule_216_TravelOverseasActionScreen, 'TravelOverseasActionScreen')) },
  { name: 'TravelOverseasAssetsScreen', component: wrapMBWRouteComponent('TravelOverseasAssetsScreen', resolveMBWRouteComponent(MBWRouteModule_217_TravelOverseasAssetsScreen, 'TravelOverseasAssetsScreen')) },
  { name: 'TravelOverseasButtonsScreen', component: wrapMBWRouteComponent('TravelOverseasButtonsScreen', resolveMBWRouteComponent(MBWRouteModule_218_TravelOverseasButtonsScreen, 'TravelOverseasButtonsScreen')) },
  { name: 'TravelOverseasEntryScreen', component: wrapMBWRouteComponent('TravelOverseasEntryScreen', resolveMBWRouteComponent(MBWRouteModule_219_TravelOverseasEntryScreen, 'TravelOverseasEntryScreen')) },
  { name: 'TravelOverseasLiveScreen', component: wrapMBWRouteComponent('TravelOverseasLiveScreen', resolveMBWRouteComponent(MBWRouteModule_220_TravelOverseasLiveScreen, 'TravelOverseasLiveScreen')) },
  { name: 'TravelOverseasLogicScreen', component: wrapMBWRouteComponent('TravelOverseasLogicScreen', resolveMBWRouteComponent(MBWRouteModule_221_TravelOverseasLogicScreen, 'TravelOverseasLogicScreen')) },
  { name: 'TravelOverseasMotionScreen', component: wrapMBWRouteComponent('TravelOverseasMotionScreen', resolveMBWRouteComponent(MBWRouteModule_222_TravelOverseasMotionScreen, 'TravelOverseasMotionScreen')) },
  { name: 'TravelOverseasOverviewScreen', component: wrapMBWRouteComponent('TravelOverseasOverviewScreen', resolveMBWRouteComponent(MBWRouteModule_223_TravelOverseasOverviewScreen, 'TravelOverseasOverviewScreen')) },
  { name: 'TravelOverseasPanchTatvaScreen', component: wrapMBWRouteComponent('TravelOverseasPanchTatvaScreen', resolveMBWRouteComponent(MBWRouteModule_224_TravelOverseasPanchTatvaScreen, 'TravelOverseasPanchTatvaScreen')) },
  { name: 'TravelOverseasPosterScreen', component: wrapMBWRouteComponent('TravelOverseasPosterScreen', resolveMBWRouteComponent(MBWRouteModule_225_TravelOverseasPosterScreen, 'TravelOverseasPosterScreen')) },
  { name: 'TravelOverseasProofScreen', component: wrapMBWRouteComponent('TravelOverseasProofScreen', resolveMBWRouteComponent(MBWRouteModule_226_TravelOverseasProofScreen, 'TravelOverseasProofScreen')) },
  { name: 'TravelOverseasResultScreen', component: wrapMBWRouteComponent('TravelOverseasResultScreen', resolveMBWRouteComponent(MBWRouteModule_227_TravelOverseasResultScreen, 'TravelOverseasResultScreen')) },
  { name: 'TravelOverseasReturnScreen', component: wrapMBWRouteComponent('TravelOverseasReturnScreen', resolveMBWRouteComponent(MBWRouteModule_228_TravelOverseasReturnScreen, 'TravelOverseasReturnScreen')) },
  { name: 'TravelOverseasScreen', component: wrapMBWRouteComponent('TravelOverseasScreen', resolveMBWRouteComponent(MBWRouteModule_229_TravelOverseasScreen, 'TravelOverseasScreen')) },
  { name: 'TravelOverseasSeedScreen', component: wrapMBWRouteComponent('TravelOverseasSeedScreen', resolveMBWRouteComponent(MBWRouteModule_230_TravelOverseasSeedScreen, 'TravelOverseasSeedScreen')) },
  { name: 'TravelOverseasStateScreen', component: wrapMBWRouteComponent('TravelOverseasStateScreen', resolveMBWRouteComponent(MBWRouteModule_231_TravelOverseasStateScreen, 'TravelOverseasStateScreen')) },
  { name: 'TravelOverseasVaultScreen', component: wrapMBWRouteComponent('TravelOverseasVaultScreen', resolveMBWRouteComponent(MBWRouteModule_232_TravelOverseasVaultScreen, 'TravelOverseasVaultScreen')) },
]);

export const MBW_GENERATED_ROUTE_COUNT = MBW_GENERATED_ROUTE_REGISTRY.length;

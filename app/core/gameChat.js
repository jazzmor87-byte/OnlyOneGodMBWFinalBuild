import { getSeedUsers, getOnlineSeedUsers, getAppRoster, getSectionMembers } from "./seedUsers";\nimport { getAuraLevel } from './auraSystem';

export const getHotChat = () => {
  const hot = [
  "🔥 Stay focused",
  "🔥 You're falling behind",
  "🔥 Control the moment",
  "🔥 Watch closely"
  ];
  const aura = getAuraLevel();
const msg = hot[Math.floor(Math.random()*hot.length)];
return aura >=3 ? msg.toUpperCase() : msg;
};

export const getColdChat = () => {
  const cold = [
  "❄️ Well played",
  "❄️ Interesting presence",
  "❄️ You have potential",
  "❄️ We'll cross paths again"
  ];
  return cold[Math.floor(Math.random()*cold.length)];
};


export const getDelayedChat = (mode="hot", cb) => {
  const msg = mode==="hot" ? getHotChat() : getColdChat();

  cb("...");
  setTimeout(()=>{
    cb(msg);
  }, 1200 + Math.random()*1000);
};\n\n/* MBW_SEED_ENTIRE_APP */
export const getChatMembers = async () => getSectionMembers('Games');
export const getGameRoomMembers = async () => getSectionMembers('Games');
\n
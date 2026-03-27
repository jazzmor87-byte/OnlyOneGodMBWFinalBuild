import { getSeedUsers, getOnlineSeedUsers, getAppRoster, getSectionMembers } from "./seedUsers";\n
export const profiles = [
{ name:"Adrian", age:24, type:"Top", vibe:"Chill", location:"KL" },
{ name:"Riz", age:27, type:"Vers", vibe:"Fun", location:"KL" },
{ name:"Ken", age:22, type:"Bottom", vibe:"Calm", location:"KL" },
{ name:"Zayn", age:26, type:"Top", vibe:"Bold", location:"KL" },
{ name:"Leo", age:23, type:"Vers", vibe:"Chill", location:"KL" }
];\n\n/* MBW_SEED_ENTIRE_APP */
export const getProfiles = async () => getSeedUsers();
export const getFeaturedProfiles = async () => getSeedUsers().slice(0, 6);
export const getProfileById = async (id) => getSeedUsers().find((u) => u.id === id || u.username === id) || null;
\n
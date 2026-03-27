import { getSeedUsers, getOnlineSeedUsers, getAppRoster, getSectionMembers } from "./seedUsers";\nimport { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const createUser = async (user) => {
  try{
    await addDoc(collection(db, "users"), user);
    return true;
  }catch(e){
    return false;
  }
};\n\n/* MBW_SEED_ENTIRE_APP */
export const getUsers = async () => getSeedUsers();
export const getAllUsers = async () => getSeedUsers();
export const getVisibleUsers = async () => getSeedUsers();
export const getOnlineUsers = async () => getOnlineSeedUsers();
export const getMemberRoster = async () => getAppRoster();
export const getUserById = async (id) => getSeedUsers().find((u) => u.id === id || u.username === id) || null;
\n
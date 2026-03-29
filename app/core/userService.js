import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const createUser = async (user) => {
  try{
    await addDoc(collection(db, "users"), user);
    return true;
  }catch(e){
    return false;
  }
};


import { addUser } from '../storage/userDB';

export const seedUsers = () => {
  const sample = [
    {name:'Adrian',age:24,type:'Top',vibe:'Chill',location:'KL'},
    {name:'Riz',age:27,type:'Vers',vibe:'Fun',location:'KL'},
    {name:'Ken',age:22,type:'Bottom',vibe:'Calm',location:'KL'},
    {name:'Zayn',age:26,type:'Top',vibe:'Bold',location:'KL'}
  ];

  sample.forEach(addUser);
};

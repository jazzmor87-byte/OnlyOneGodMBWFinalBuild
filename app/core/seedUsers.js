export const SEED_USERS = [
  {
    id: 'seed-01',
    username: 'ace_aeron',
    displayName: 'Aeron Vale',
    role: 'MBW',
    tier: 'ACE',
    city: 'Kuala Lumpur',
    age: 27,
    online: true,
    section: 'Live Lounge',
    headline: 'High-signal host with a calm luxury aura.',
    status: 'Available now'
  },
  {
    id: 'seed-02',
    username: 'noir_kael',
    displayName: 'Kael Noir',
    role: 'USER',
    tier: 'Gold',
    city: 'Bangkok',
    age: 25,
    online: true,
    section: 'Matchmaking',
    headline: 'Curated chemistry and elegant conversation.',
    status: 'Exploring matches'
  },
  {
    id: 'seed-03',
    username: 'orian_rue',
    displayName: 'Orian Rue',
    role: 'MBW',
    tier: 'Crown',
    city: 'Singapore',
    age: 29,
    online: true,
    section: 'Travel',
    headline: 'Travel-ready host with premium taste.',
    status: 'Planning overseas route'
  },
  {
    id: 'seed-04',
    username: 'soren_lux',
    displayName: 'Soren Lux',
    role: 'USER',
    tier: 'Silver',
    city: 'Tokyo',
    age: 24,
    online: false,
    section: 'Games',
    headline: 'Playful energy with strategic charm.',
    status: 'Away for now'
  },
  {
    id: 'seed-05',
    username: 'darian_cole',
    displayName: 'Darian Cole',
    role: 'MBW',
    tier: 'Ace',
    city: 'Seoul',
    age: 30,
    online: true,
    section: 'Profile',
    headline: 'Refined presence and direct intent.',
    status: 'Profile active'
  },
  {
    id: 'seed-06',
    username: 'mika_roy',
    displayName: 'Mika Roy',
    role: 'USER',
    tier: 'Gold',
    city: 'Jakarta',
    age: 26,
    online: true,
    section: 'Live Lounge',
    headline: 'Fast replies and smooth room energy.',
    status: 'In the lounge'
  },
  {
    id: 'seed-07',
    username: 'eiden_cross',
    displayName: 'Eiden Cross',
    role: 'MBW',
    tier: 'Crown',
    city: 'Manila',
    age: 28,
    online: false,
    section: 'Travel',
    headline: 'Border-crossing charm with structure.',
    status: 'Offline'
  },
  {
    id: 'seed-08',
    username: 'levin_kade',
    displayName: 'Levin Kade',
    role: 'USER',
    tier: 'Silver',
    city: 'Hong Kong',
    age: 23,
    online: true,
    section: 'Matchmaking',
    headline: 'Warm chemistry and quick attraction logic.',
    status: 'Searching now'
  },
  {
    id: 'seed-09',
    username: 'riven_ash',
    displayName: 'Riven Ash',
    role: 'MBW',
    tier: 'ACE',
    city: 'Dubai',
    age: 31,
    online: true,
    section: 'Coins',
    headline: 'Collector mindset with premium signals.',
    status: 'Watching the market'
  },
  {
    id: 'seed-10',
    username: 'cael_voss',
    displayName: 'Cael Voss',
    role: 'USER',
    tier: 'Gold',
    city: 'Taipei',
    age: 27,
    online: false,
    section: 'Profile',
    headline: 'Elegant profile with steady intent.',
    status: 'Last seen recently'
  },
  {
    id: 'seed-11',
    username: 'niko_faen',
    displayName: 'Niko Faen',
    role: 'MBW',
    tier: 'Crown',
    city: 'Bali',
    age: 29,
    online: true,
    section: 'Travel',
    headline: 'Host energy for local and overseas routes.',
    status: 'Open to requests'
  },
  {
    id: 'seed-12',
    username: 'zayden_marc',
    displayName: 'Zayden Marc',
    role: 'USER',
    tier: 'Silver',
    city: 'Kuala Lumpur',
    age: 22,
    online: true,
    section: 'Games',
    headline: 'Competitive, social, and responsive.',
    status: 'Ready to play'
  }
];

export const getSeedUsers = () => SEED_USERS.slice();
export const getSeedUserById = (id) => SEED_USERS.find((u) => u.id === id || u.username === id) || null;
export const getSeedUsersByRole = (role) => SEED_USERS.filter((u) => String(u.role).toLowerCase() == String(role).toLowerCase());
export const getOnlineSeedUsers = () => SEED_USERS.filter((u) => !!u.online);
export const getSectionMembers = (section) => SEED_USERS.filter((u) => String(u.section).toLowerCase() == String(section).toLowerCase());
export const getAppRoster = () => SEED_USERS.map((u, i) => ({ ...u, rank: i + 1, presence: u.online ? 'online' : 'offline' }));
export default SEED_USERS;

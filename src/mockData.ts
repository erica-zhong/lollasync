import { Artist, Stage, Friend } from './types';

export const STAGES: Stage[] = [
  { name: 'T-Mobile', zone: 'South', description: 'South Main Stage' },
  { name: 'Allianz', zone: 'South', description: 'South Sub-Main Stage' },
  { name: 'Tito\'s Handmade Vodka', zone: 'South', description: 'South Side Stage' },
  { name: 'Perry\'s', zone: 'Mid', description: 'EDM & Dance Stage' },
  { name: 'BMI', zone: 'Mid', description: 'Mid Side Stage' },
  { name: 'Kidzapalooza', zone: 'Mid', description: 'Daytime Kids Stage' },
  { name: 'Bud Light', zone: 'North', description: 'North Main Stage' },
  { name: 'Airbnb', zone: 'North', description: 'North Sub-Main Stage' }
];

export const DEFAULT_FRIENDS: Friend[] = [
  { id: 'me', name: 'Me (You)', color: '#FF007F', avatar: 'MY' }
];

// Helper to convert "HH:MM" 24h time to minutes relative to 12:00 PM (noon)
const t = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  const totalMinutes = h * 60 + m;
  const noonMinutes = 12 * 60; // 720 minutes
  return totalMinutes - noonMinutes;
};

// Formatting helper for visual display (e.g. 13:30 -> 1:30 PM)
export const formatTimeStr = (time24: string): string => {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${suffix}`;
};

export const MOCK_ARTISTS: Artist[] = [
  // --- THURSDAY (FROM ACTUAL SET TIMES IMAGE) ---
  
  // T-Mobile (South)
  {
    id: 'th-asha-banks',
    name: 'Asha Banks',
    genre: 'Indie / Alt',
    day: 'Thursday',
    startTime: '12:45',
    endTime: '13:30',
    startMinutes: t('12:45'),
    endMinutes: t('13:30'),
    stage: 'T-Mobile'
  },
  {
    id: 'th-haute-freddy',
    name: 'Haute & Freddy',
    genre: 'Pop / Duo',
    day: 'Thursday',
    startTime: '14:30',
    endTime: '15:30',
    startMinutes: t('14:30'),
    endMinutes: t('15:30'),
    stage: 'T-Mobile'
  },
  {
    id: 'th-5sos',
    name: '5 Seconds of Summer',
    genre: 'Pop Rock',
    day: 'Thursday',
    startTime: '16:30',
    endTime: '17:30',
    startMinutes: t('16:30'),
    endMinutes: t('17:30'),
    stage: 'T-Mobile'
  },
  {
    id: 'th-sombr',
    name: 'Sombr',
    genre: 'Indie / Pop',
    day: 'Thursday',
    startTime: '18:30',
    endTime: '19:30',
    startMinutes: t('18:30'),
    endMinutes: t('19:30'),
    stage: 'T-Mobile'
  },
  {
    id: 'th-lorde',
    name: 'Lorde',
    genre: 'Art Pop',
    day: 'Thursday',
    startTime: '20:30',
    endTime: '22:00',
    startMinutes: t('20:30'),
    endMinutes: t('22:00'),
    stage: 'T-Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60'
  },

  // Perry's (Mid)
  {
    id: 'th-klo',
    name: 'Klo',
    genre: 'Electronic',
    day: 'Thursday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Perry\'s'
  },
  {
    id: 'th-know-good',
    name: 'Know Good',
    genre: 'Bass House',
    day: 'Thursday',
    startTime: '12:45',
    endTime: '13:30',
    startMinutes: t('12:45'),
    endMinutes: t('13:30'),
    stage: 'Perry\'s'
  },
  {
    id: 'th-devault-perry',
    name: 'Devault',
    genre: 'Midtempo / Electronic',
    day: 'Thursday',
    startTime: '13:45',
    endTime: '14:45',
    startMinutes: t('13:45'),
    endMinutes: t('14:45'),
    stage: 'Perry\'s'
  },
  {
    id: 'th-mph',
    name: 'MPH',
    genre: 'UK Garage',
    day: 'Thursday',
    startTime: '15:00',
    endTime: '16:00',
    startMinutes: t('15:00'),
    endMinutes: t('16:00'),
    stage: 'Perry\'s'
  },
  {
    id: 'th-boys-noize',
    name: 'Boys Noize',
    genre: 'Acid / Industrial Techno',
    day: 'Thursday',
    startTime: '16:15',
    endTime: '17:15',
    startMinutes: t('16:15'),
    endMinutes: t('17:15'),
    stage: 'Perry\'s'
  },
  {
    id: 'th-boris-brejcha',
    name: 'Boris Brejcha',
    genre: 'High-Tech Minimal',
    day: 'Thursday',
    startTime: '17:45',
    endTime: '18:45',
    startMinutes: t('17:45'),
    endMinutes: t('18:45'),
    stage: 'Perry\'s'
  },
  {
    id: 'th-kettama',
    name: 'Kettama',
    genre: 'Ghetto House',
    day: 'Thursday',
    startTime: '19:00',
    endTime: '20:00',
    startMinutes: t('19:00'),
    endMinutes: t('20:00'),
    stage: 'Perry\'s'
  },
  {
    id: 'th-worship',
    name: 'Worship (Sub Focus & Dimension)',
    genre: 'Drum & Bass',
    day: 'Thursday',
    startTime: '20:30',
    endTime: '21:45',
    startMinutes: t('20:30'),
    endMinutes: t('21:45'),
    stage: 'Perry\'s'
  },

  // Allianz (South Sub)
  {
    id: 'th-pearly-drops',
    name: 'Pearly Drops',
    genre: 'Dream Pop',
    day: 'Thursday',
    startTime: '12:00',
    endTime: '12:45',
    startMinutes: t('12:00'),
    endMinutes: t('12:45'),
    stage: 'Allianz'
  },
  {
    id: 'th-bad-nerves',
    name: 'Bad Nerves',
    genre: 'Garage Rock',
    day: 'Thursday',
    startTime: '13:30',
    endTime: '14:30',
    startMinutes: t('13:30'),
    endMinutes: t('14:30'),
    stage: 'Allianz'
  },
  {
    id: 'th-sb19',
    name: 'SB19',
    genre: 'P-Pop',
    day: 'Thursday',
    startTime: '15:30',
    endTime: '16:30',
    startMinutes: t('15:30'),
    endMinutes: t('16:30'),
    stage: 'Allianz'
  },
  {
    id: 'th-audrey-hobert',
    name: 'Audrey Hobert',
    genre: 'Singer-Songwriter',
    day: 'Thursday',
    startTime: '17:30',
    endTime: '18:30',
    startMinutes: t('17:30'),
    endMinutes: t('18:30'),
    stage: 'Allianz'
  },
  {
    id: 'th-wetleg',
    name: 'Wet Leg',
    genre: 'Indie Rock',
    day: 'Thursday',
    startTime: '19:30',
    endTime: '20:30',
    startMinutes: t('19:30'),
    endMinutes: t('20:30'),
    stage: 'Allianz'
  },

  // Kidzapalooza (Mid)
  {
    id: 'th-mister-g',
    name: 'Mister G',
    genre: 'Kids / Family',
    day: 'Thursday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'th-school-of-rock',
    name: 'School of Rock',
    genre: 'Rock Covers',
    day: 'Thursday',
    startTime: '13:30',
    endTime: '14:00',
    startMinutes: t('13:30'),
    endMinutes: t('14:00'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'th-miss-tutti',
    name: 'Miss Tutti & The Fruity Band',
    genre: 'Kids / Family',
    day: 'Thursday',
    startTime: '15:00',
    endTime: '15:30',
    startMinutes: t('15:00'),
    endMinutes: t('15:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'th-jazzy-ash',
    name: 'Jazzy Ash',
    genre: 'Kids / Jazz',
    day: 'Thursday',
    startTime: '17:15',
    endTime: '17:45',
    startMinutes: t('17:15'),
    endMinutes: t('17:45'),
    stage: 'Kidzapalooza'
  },

  // BMI (Mid Side)
  {
    id: 'th-braymores',
    name: 'The Braymores',
    genre: 'Alt Rock',
    day: 'Thursday',
    startTime: '13:00',
    endTime: '13:40',
    startMinutes: t('13:00'),
    endMinutes: t('13:40'),
    stage: 'BMI'
  },
  {
    id: 'th-simon-grossmann',
    name: 'Simon Grossmann',
    genre: 'Latin Indie',
    day: 'Thursday',
    startTime: '14:10',
    endTime: '14:50',
    startMinutes: t('14:10'),
    endMinutes: t('14:50'),
    stage: 'BMI'
  },
  {
    id: 'th-elizabeth-nichols',
    name: 'Elizabeth Nichols',
    genre: 'Indie Folk',
    day: 'Thursday',
    startTime: '15:20',
    endTime: '16:00',
    startMinutes: t('15:20'),
    endMinutes: t('16:00'),
    stage: 'BMI'
  },
  {
    id: 'th-bella-kay',
    name: 'Bella Kay',
    genre: 'Country Pop',
    day: 'Thursday',
    startTime: '16:30',
    endTime: '17:10',
    startMinutes: t('16:30'),
    endMinutes: t('17:10'),
    stage: 'BMI'
  },
  {
    id: 'th-chalk',
    name: 'Chalk',
    genre: 'Post-Punk',
    day: 'Thursday',
    startTime: '17:40',
    endTime: '18:20',
    startMinutes: t('17:40'),
    endMinutes: t('18:20'),
    stage: 'BMI'
  },
  {
    id: 'th-evening-elephants',
    name: 'Evening Elephants',
    genre: 'Indie Pop',
    day: 'Thursday',
    startTime: '18:50',
    endTime: '19:30',
    startMinutes: t('18:50'),
    endMinutes: t('19:30'),
    stage: 'BMI'
  },

  // Airbnb (North Sub)
  {
    id: 'th-kim-theory',
    name: 'Kim Theory',
    genre: 'Synth Pop',
    day: 'Thursday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Airbnb'
  },
  {
    id: 'th-penelope-road',
    name: 'Penelope Road',
    genre: 'Indie Rock',
    day: 'Thursday',
    startTime: '12:50',
    endTime: '13:30',
    startMinutes: t('12:50'),
    endMinutes: t('13:30'),
    stage: 'Airbnb'
  },
  {
    id: 'th-marlon-funaki',
    name: 'Marlon Funaki',
    genre: 'Surf / Indie Rock',
    day: 'Thursday',
    startTime: '13:50',
    endTime: '14:30',
    startMinutes: t('13:50'),
    endMinutes: t('14:30'),
    stage: 'Airbnb'
  },
  {
    id: 'th-ecca-vandal',
    name: 'Ecca Vandal',
    genre: 'Punk / Dance',
    day: 'Thursday',
    startTime: '14:50',
    endTime: '15:30',
    startMinutes: t('14:50'),
    endMinutes: t('15:30'),
    stage: 'Airbnb'
  },
  {
    id: 'th-ninajirachi',
    name: 'Ninajirachi',
    genre: 'Club / Electronic',
    day: 'Thursday',
    startTime: '16:00',
    endTime: '16:45',
    startMinutes: t('16:00'),
    endMinutes: t('16:45'),
    stage: 'Airbnb'
  },
  {
    id: 'th-amble',
    name: 'Amble',
    genre: 'Folk',
    day: 'Thursday',
    startTime: '17:15',
    endTime: '18:00',
    startMinutes: t('17:15'),
    endMinutes: t('18:00'),
    stage: 'Airbnb'
  },
  {
    id: 'th-cmat',
    name: 'CMAT',
    genre: 'Indie Country Pop',
    day: 'Thursday',
    startTime: '18:30',
    endTime: '19:15',
    startMinutes: t('18:30'),
    endMinutes: t('19:15'),
    stage: 'Airbnb'
  },
  {
    id: 'th-snow-strippers',
    name: 'Snow Strippers',
    genre: 'Electroclash',
    day: 'Thursday',
    startTime: '19:45',
    endTime: '20:30',
    startMinutes: t('19:45'),
    endMinutes: t('20:30'),
    stage: 'Airbnb'
  },
  {
    id: 'th-viagra-boys',
    name: 'Viagra Boys',
    genre: 'Post-Punk',
    day: 'Thursday',
    startTime: '21:00',
    endTime: '22:00',
    startMinutes: t('21:00'),
    endMinutes: t('22:00'),
    stage: 'Airbnb'
  },

  // Tito's (South Side)
  {
    id: 'th-faouzia',
    name: 'Faouzia',
    genre: 'Pop / Vocal',
    day: 'Thursday',
    startTime: '12:15',
    endTime: '13:00',
    startMinutes: t('12:15'),
    endMinutes: t('13:00'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'th-kingfishr',
    name: 'Kingfishr',
    genre: 'Irish Folk',
    day: 'Thursday',
    startTime: '13:45',
    endTime: '14:45',
    startMinutes: t('13:45'),
    endMinutes: t('14:45'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'th-paris-paloma',
    name: 'Paris Paloma',
    genre: 'Indie Pop',
    day: 'Thursday',
    startTime: '15:45',
    endTime: '16:45',
    startMinutes: t('15:45'),
    endMinutes: t('16:45'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'th-little-simz',
    name: 'Little Simz',
    genre: 'Hip Hop / Rap',
    day: 'Thursday',
    startTime: '17:45',
    endTime: '18:45',
    startMinutes: t('17:45'),
    endMinutes: t('18:45'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'th-devault-titos',
    name: 'Devault (Tito\'s)',
    genre: 'Electronic',
    day: 'Thursday',
    startTime: '19:30',
    endTime: '20:30',
    startMinutes: t('19:30'),
    endMinutes: t('20:30'),
    stage: 'Tito\'s Handmade Vodka'
  },

  // Bud Light (North)
  {
    id: 'th-bixby',
    name: 'Bixby',
    genre: 'Bedroom Pop',
    day: 'Thursday',
    startTime: '13:00',
    endTime: '13:45',
    startMinutes: t('13:00'),
    endMinutes: t('13:45'),
    stage: 'Bud Light'
  },
  {
    id: 'th-between-friends',
    name: 'Between Friends',
    genre: 'Dream Pop',
    day: 'Thursday',
    startTime: '14:45',
    endTime: '15:45',
    startMinutes: t('14:45'),
    endMinutes: t('15:45'),
    stage: 'Bud Light'
  },
  {
    id: 'th-blood-orange',
    name: 'Blood Orange',
    genre: 'R&B / Soul',
    day: 'Thursday',
    startTime: '16:45',
    endTime: '17:45',
    startMinutes: t('16:45'),
    endMinutes: t('17:45'),
    stage: 'Bud Light'
  },
  {
    id: 'th-empire-of-the-sun',
    name: 'Empire of the Sun',
    genre: 'Synth-Pop',
    day: 'Thursday',
    startTime: '18:30',
    endTime: '19:30',
    startMinutes: t('18:30'),
    endMinutes: t('19:30'),
    stage: 'Bud Light'
  },
  {
    id: 'th-johnsummit',
    name: 'John Summit',
    genre: 'Tech House',
    day: 'Thursday',
    startTime: '20:30',
    endTime: '22:00',
    startMinutes: t('20:30'),
    endMinutes: t('22:00'),
    stage: 'Bud Light',
    imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&auto=format&fit=crop&q=60'
  },

  // --- FRIDAY (FROM ACTUAL SET TIMES IMAGE) ---
  
  // T-Mobile (South)
  {
    id: 'fr-partyof2',
    name: 'PartyOf2',
    genre: 'Pop / Duo',
    day: 'Friday',
    startTime: '12:55',
    endTime: '13:40',
    startMinutes: t('12:55'),
    endMinutes: t('13:40'),
    stage: 'T-Mobile'
  },
  {
    id: 'fr-idle',
    name: 'I-DLE',
    genre: 'K-Pop',
    day: 'Friday',
    startTime: '14:40',
    endTime: '15:40',
    startMinutes: t('14:40'),
    endMinutes: t('15:40'),
    stage: 'T-Mobile'
  },
  {
    id: 'fr-zaralarsson',
    name: 'Zara Larsson',
    genre: 'Pop / Dance',
    day: 'Friday',
    startTime: '16:40',
    endTime: '17:40',
    startMinutes: t('16:40'),
    endMinutes: t('17:40'),
    stage: 'T-Mobile'
  },
  {
    id: 'fr-liluzivert',
    name: 'Lil Uzi Vert',
    genre: 'Hip Hop',
    day: 'Friday',
    startTime: '18:40',
    endTime: '19:40',
    startMinutes: t('18:40'),
    endMinutes: t('19:40'),
    stage: 'T-Mobile'
  },
  {
    id: 'fr-charlixcx',
    name: 'Charli XCX',
    genre: 'Hyperpop / Electronic',
    day: 'Friday',
    startTime: '20:40',
    endTime: '22:00',
    startMinutes: t('20:40'),
    endMinutes: t('22:00'),
    stage: 'T-Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60'
  },

  // Perry's (Mid)
  {
    id: 'fr-bradeazy',
    name: 'Bradeazy',
    genre: 'Electronic / DJ',
    day: 'Friday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Perry\'s'
  },
  {
    id: 'fr-avello',
    name: 'Avello',
    genre: 'Electronic',
    day: 'Friday',
    startTime: '12:45',
    endTime: '13:30',
    startMinutes: t('12:45'),
    endMinutes: t('13:30'),
    stage: 'Perry\'s'
  },
  {
    id: 'fr-lyny',
    name: 'LYNY',
    genre: 'Trap / Electronic',
    day: 'Friday',
    startTime: '13:45',
    endTime: '14:45',
    startMinutes: t('13:45'),
    endMinutes: t('14:45'),
    stage: 'Perry\'s'
  },
  {
    id: 'fr-roz',
    name: 'RØZ',
    genre: 'Electronic / House',
    day: 'Friday',
    startTime: '15:00',
    endTime: '16:00',
    startMinutes: t('15:00'),
    endMinutes: t('16:00'),
    stage: 'Perry\'s'
  },
  {
    id: 'fr-notion',
    name: 'Notion',
    genre: 'UK Garage / Bass',
    day: 'Friday',
    startTime: '16:15',
    endTime: '17:15',
    startMinutes: t('16:15'),
    endMinutes: t('17:15'),
    stage: 'Perry\'s'
  },
  {
    id: 'fr-sidepiece',
    name: 'SIDEPIECE',
    genre: 'House / Tech House',
    day: 'Friday',
    startTime: '17:45',
    endTime: '18:45',
    startMinutes: t('17:45'),
    endMinutes: t('18:45'),
    stage: 'Perry\'s'
  },
  {
    id: 'fr-mustard',
    name: 'Mustard',
    genre: 'Hip Hop / DJ',
    day: 'Friday',
    startTime: '19:00',
    endTime: '20:00',
    startMinutes: t('19:00'),
    endMinutes: t('20:00'),
    stage: 'Perry\'s'
  },
  {
    id: 'fr-majorlazer',
    name: 'Major Lazer',
    genre: 'Electronic / Dance',
    day: 'Friday',
    startTime: '20:30',
    endTime: '21:45',
    startMinutes: t('20:30'),
    endMinutes: t('21:45'),
    stage: 'Perry\'s'
  },

  // Allianz (South Sub)
  {
    id: 'fr-armynavy',
    name: 'The Army, The Navy',
    genre: 'Indie Folk',
    day: 'Friday',
    startTime: '12:10',
    endTime: '12:55',
    startMinutes: t('12:10'),
    endMinutes: t('12:55'),
    stage: 'Allianz'
  },
  {
    id: 'fr-clairerosinkranz',
    name: 'Claire Rosinkranz',
    genre: 'Indie Pop',
    day: 'Friday',
    startTime: '13:40',
    endTime: '14:40',
    startMinutes: t('13:40'),
    endMinutes: t('14:40'),
    stage: 'Allianz'
  },
  {
    id: 'fr-skyenewman',
    name: 'Skye Newman',
    genre: 'Pop / Singer-Songwriter',
    day: 'Friday',
    startTime: '15:40',
    endTime: '16:40',
    startMinutes: t('15:40'),
    endMinutes: t('16:40'),
    stage: 'Allianz'
  },
  {
    id: 'fr-sukiwaterhouse',
    name: 'Suki Waterhouse',
    genre: 'Dream Pop / Indie',
    day: 'Friday',
    startTime: '17:40',
    endTime: '18:40',
    startMinutes: t('17:40'),
    endMinutes: t('18:40'),
    stage: 'Allianz'
  },
  {
    id: 'fr-notforradio',
    name: 'Not For Radio',
    genre: 'Alternative / Rock',
    day: 'Friday',
    startTime: '19:40',
    endTime: '20:40',
    startMinutes: t('19:40'),
    endMinutes: t('20:40'),
    stage: 'Allianz'
  },

  // Kidzapalooza (Mid)
  {
    id: 'fr-misstutti',
    name: 'Miss Tutti & The Fruity Band',
    genre: 'Kids / Family',
    day: 'Friday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'fr-misterg',
    name: 'Mister G',
    genre: 'Kids / Family',
    day: 'Friday',
    startTime: '13:30',
    endTime: '14:00',
    startMinutes: t('13:30'),
    endMinutes: t('14:00'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'fr-jazzyash',
    name: 'Jazzy Ash',
    genre: 'Kids / Jazz',
    day: 'Friday',
    startTime: '15:00',
    endTime: '15:30',
    startMinutes: t('15:00'),
    endMinutes: t('15:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'fr-schoolofrock',
    name: 'School of Rock',
    genre: 'Rock Covers',
    day: 'Friday',
    startTime: '17:15',
    endTime: '17:45',
    startMinutes: t('17:15'),
    endMinutes: t('17:45'),
    stage: 'Kidzapalooza'
  },

  // BMI (Mid Side)
  {
    id: 'fr-whitneywhitney',
    name: 'Whitney Whitney',
    genre: 'Alternative',
    day: 'Friday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'BMI'
  },
  {
    id: 'fr-valenciagrace',
    name: 'Valencia Grace',
    genre: 'R&B / Soul',
    day: 'Friday',
    startTime: '13:00',
    endTime: '13:40',
    startMinutes: t('13:00'),
    endMinutes: t('13:40'),
    stage: 'BMI'
  },
  {
    id: 'fr-ellaboh',
    name: 'Ella Boh',
    genre: 'Indie Pop',
    day: 'Friday',
    startTime: '14:10',
    endTime: '14:50',
    startMinutes: t('14:10'),
    endMinutes: t('14:50'),
    stage: 'BMI'
  },
  {
    id: 'fr-emigrace',
    name: 'Emi Grace',
    genre: 'Singer-Songwriter',
    day: 'Friday',
    startTime: '15:20',
    endTime: '16:00',
    startMinutes: t('15:20'),
    endMinutes: t('16:00'),
    stage: 'BMI'
  },
  {
    id: 'fr-ivri',
    name: 'Ivri',
    genre: 'Alternative Pop',
    day: 'Friday',
    startTime: '16:30',
    endTime: '17:10',
    startMinutes: t('16:30'),
    endMinutes: t('17:10'),
    stage: 'BMI'
  },
  {
    id: 'fr-ellared',
    name: 'Ella Red',
    genre: 'Indie Pop / Rock',
    day: 'Friday',
    startTime: '17:40',
    endTime: '18:20',
    startMinutes: t('17:40'),
    endMinutes: t('18:20'),
    stage: 'BMI'
  },
  {
    id: 'fr-palomamorphy',
    name: 'Paloma Morphy',
    genre: 'Indie Pop',
    day: 'Friday',
    startTime: '18:50',
    endTime: '19:30',
    startMinutes: t('18:50'),
    endMinutes: t('19:30'),
    stage: 'BMI'
  },

  // Airbnb (North Sub)
  {
    id: 'fr-beno',
    name: 'Beno',
    genre: 'Electro Indie',
    day: 'Friday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Airbnb'
  },
  {
    id: 'fr-dayweran',
    name: 'Day We Ran',
    genre: 'Indie Rock',
    day: 'Friday',
    startTime: '12:50',
    endTime: '13:30',
    startMinutes: t('12:50'),
    endMinutes: t('13:30'),
    stage: 'Airbnb'
  },
  {
    id: 'fr-lovespells',
    name: 'Love Spells',
    genre: 'Lo-Fi / Dream Pop',
    day: 'Friday',
    startTime: '13:50',
    endTime: '14:30',
    startMinutes: t('13:50'),
    endMinutes: t('14:30'),
    stage: 'Airbnb'
  },
  {
    id: 'fr-54ultra',
    name: '54 Ultra',
    genre: 'Electronic',
    day: 'Friday',
    startTime: '14:50',
    endTime: '15:30',
    startMinutes: t('14:50'),
    endMinutes: t('15:30'),
    stage: 'Airbnb'
  },
  {
    id: 'fr-finnwolfhard',
    name: 'Finn Wolfhard',
    genre: 'Indie Rock',
    day: 'Friday',
    startTime: '16:00',
    endTime: '16:45',
    startMinutes: t('16:00'),
    endMinutes: t('16:45'),
    stage: 'Airbnb'
  },
  {
    id: 'fr-oklou',
    name: 'Oklou',
    genre: 'Ambient Pop / Electronic',
    day: 'Friday',
    startTime: '17:30',
    endTime: '18:15',
    startMinutes: t('17:30'),
    endMinutes: t('18:15'),
    stage: 'Airbnb'
  },
  {
    id: 'fr-slayyyter',
    name: 'Slayyyter',
    genre: 'Dance Pop / Electro-Pop',
    day: 'Friday',
    startTime: '18:45',
    endTime: '19:30',
    startMinutes: t('18:45'),
    endMinutes: t('19:30'),
    stage: 'Airbnb'
  },
  {
    id: 'fr-horsegiirl',
    name: 'horsegiirl',
    genre: 'Eurodance / Happy Hardcore',
    day: 'Friday',
    startTime: '20:00',
    endTime: '20:45',
    startMinutes: t('20:00'),
    endMinutes: t('20:45'),
    stage: 'Airbnb'
  },
  {
    id: 'fr-freddie-gibbs',
    name: 'Freddie Gibbs',
    genre: 'Hip Hop / Rap',
    day: 'Friday',
    startTime: '21:15',
    endTime: '22:00',
    startMinutes: t('21:15'),
    endMinutes: t('22:00'),
    stage: 'Airbnb'
  },

  // Tito's (South Side)
  {
    id: 'fr-chicagomade',
    name: 'Chicago Made',
    genre: 'Various Genres',
    day: 'Friday',
    startTime: '12:15',
    endTime: '13:00',
    startMinutes: t('12:15'),
    endMinutes: t('13:00'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'fr-juliawolf',
    name: 'Julia Wolf',
    genre: 'Pop / Indie',
    day: 'Friday',
    startTime: '13:45',
    endTime: '14:30',
    startMinutes: t('13:45'),
    endMinutes: t('14:30'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'fr-mothermother',
    name: 'Mother Mother',
    genre: 'Indie Rock',
    day: 'Friday',
    startTime: '15:30',
    endTime: '16:30',
    startMinutes: t('15:30'),
    endMinutes: t('16:30'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'fr-loathe',
    name: 'Loathe',
    genre: 'Alternative Metal / Shoegaze',
    day: 'Friday',
    startTime: '17:30',
    endTime: '18:30',
    startMinutes: t('17:30'),
    endMinutes: t('18:30'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'fr-nettspend',
    name: 'Nettspend',
    genre: 'Pluggent / Trap',
    day: 'Friday',
    startTime: '19:30',
    endTime: '20:30',
    startMinutes: t('19:30'),
    endMinutes: t('20:30'),
    stage: 'Tito\'s Handmade Vodka'
  },

  // Bud Light (North)
  {
    id: 'fr-highvis',
    name: 'High Vis',
    genre: 'Post-Punk',
    day: 'Friday',
    startTime: '13:00',
    endTime: '13:45',
    startMinutes: t('13:00'),
    endMinutes: t('13:45'),
    stage: 'Bud Light'
  },
  {
    id: 'fr-balubrigada',
    name: 'Balu Brigada',
    genre: 'Indie Pop',
    day: 'Friday',
    startTime: '14:30',
    endTime: '15:30',
    startMinutes: t('14:30'),
    endMinutes: t('15:30'),
    stage: 'Bud Light'
  },
  {
    id: 'fr-storysofar',
    name: 'The Story So Far',
    genre: 'Pop Punk',
    day: 'Friday',
    startTime: '16:30',
    endTime: '17:30',
    startMinutes: t('16:30'),
    endMinutes: t('17:30'),
    stage: 'Bud Light'
  },
  {
    id: 'fr-yungblud',
    name: 'Yungblud',
    genre: 'Alternative / Rock',
    day: 'Friday',
    startTime: '18:30',
    endTime: '19:30',
    startMinutes: t('18:30'),
    endMinutes: t('19:30'),
    stage: 'Bud Light'
  },
  {
    id: 'fr-smashingpumpkins',
    name: 'The Smashing Pumpkins',
    genre: 'Alternative Rock',
    day: 'Friday',
    startTime: '20:30',
    endTime: '22:00',
    startMinutes: t('20:30'),
    endMinutes: t('22:00'),
    stage: 'Bud Light',
    imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&auto=format&fit=crop&q=60'
  },

  // --- SATURDAY (FROM ACTUAL SET TIMES IMAGE) ---
  
  // T-Mobile (South)
  {
    id: 'sa-lucybedroque',
    name: 'Lucy Bedroque',
    genre: 'Alternative Pop',
    day: 'Saturday',
    startTime: '13:10',
    endTime: '13:55',
    startMinutes: t('13:10'),
    endMinutes: t('13:55'),
    stage: 'T-Mobile'
  },
  {
    id: 'sa-cortis',
    name: 'Cortis',
    genre: 'Indie Rock',
    day: 'Saturday',
    startTime: '14:55',
    endTime: '15:45',
    startMinutes: t('14:55'),
    endMinutes: t('15:45'),
    stage: 'T-Mobile'
  },
  {
    id: 'sa-leonthomas',
    name: 'Leon Thomas',
    genre: 'R&B / Soul',
    day: 'Saturday',
    startTime: '16:30',
    endTime: '17:30',
    startMinutes: t('16:30'),
    endMinutes: t('17:30'),
    stage: 'T-Mobile'
  },
  {
    id: 'sa-theneighbourhood',
    name: 'The Neighbourhood',
    genre: 'Indie Pop / Rock',
    day: 'Saturday',
    startTime: '18:30',
    endTime: '19:30',
    startMinutes: t('18:30'),
    endMinutes: t('19:30'),
    stage: 'T-Mobile'
  },
  {
    id: 'sa-oliviadean',
    name: 'Olivia Dean',
    genre: 'Neo-Soul / Soul',
    day: 'Saturday',
    startTime: '20:30',
    endTime: '22:00',
    startMinutes: t('20:30'),
    endMinutes: t('22:00'),
    stage: 'T-Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60'
  },

  // Perry's (Mid)
  {
    id: 'sa-peacecontrol',
    name: 'Peace Control',
    genre: 'House / EDM',
    day: 'Saturday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Perry\'s'
  },
  {
    id: 'sa-mc4d',
    name: 'MC4D',
    genre: 'Electronic',
    day: 'Saturday',
    startTime: '12:45',
    endTime: '13:30',
    startMinutes: t('12:45'),
    endMinutes: t('13:30'),
    stage: 'Perry\'s'
  },
  {
    id: 'sa-omnom',
    name: 'OMNOM',
    genre: 'Tech House',
    day: 'Saturday',
    startTime: '13:45',
    endTime: '14:45',
    startMinutes: t('13:45'),
    endMinutes: t('14:45'),
    stage: 'Perry\'s'
  },
  {
    id: 'sa-ayybo',
    name: 'AYYBO',
    genre: 'House / Funk',
    day: 'Saturday',
    startTime: '15:00',
    endTime: '16:00',
    startMinutes: t('15:00'),
    endMinutes: t('16:00'),
    stage: 'Perry\'s'
  },
  {
    id: 'sa-whethan',
    name: 'Whethan',
    genre: 'Future Bass / Electronic',
    day: 'Saturday',
    startTime: '16:15',
    endTime: '17:15',
    startMinutes: t('16:15'),
    endMinutes: t('17:15'),
    stage: 'Perry\'s'
  },
  {
    id: 'sa-maxstyler',
    name: 'Max Styler',
    genre: 'House / Melodic Techno',
    day: 'Saturday',
    startTime: '17:45',
    endTime: '18:45',
    startMinutes: t('17:45'),
    endMinutes: t('18:45'),
    stage: 'Perry\'s'
  },
  {
    id: 'sa-alisonwonderland',
    name: 'Alison Wonderland',
    genre: 'Trap / Future Bass',
    day: 'Saturday',
    startTime: '19:00',
    endTime: '20:00',
    startMinutes: t('19:00'),
    endMinutes: t('20:00'),
    stage: 'Perry\'s'
  },
  {
    id: 'sa-discolines',
    name: 'Disco Lines',
    genre: 'Dance Pop / House',
    day: 'Saturday',
    startTime: '20:30',
    endTime: '21:45',
    startMinutes: t('20:30'),
    endMinutes: t('21:45'),
    stage: 'Perry\'s'
  },

  // Allianz (South Sub)
  {
    id: 'sa-sunday1994',
    name: 'Sunday (1994)',
    genre: 'Indie Rock',
    day: 'Saturday',
    startTime: '12:25',
    endTime: '13:10',
    startMinutes: t('12:25'),
    endMinutes: t('13:10'),
    stage: 'Allianz'
  },
  {
    id: 'sa-jimlegxacy',
    name: 'Jim Legxacy',
    genre: 'Experimental R&B / Rap',
    day: 'Saturday',
    startTime: '13:55',
    endTime: '14:55',
    startMinutes: t('13:55'),
    endMinutes: t('14:55'),
    stage: 'Allianz'
  },
  {
    id: 'sa-khamari',
    name: 'Khamari',
    genre: 'R&B / Soul',
    day: 'Saturday',
    startTime: '15:45',
    endTime: '16:30',
    startMinutes: t('15:45'),
    endMinutes: t('16:30'),
    stage: 'Allianz'
  },
  {
    id: 'sa-spaceyjane',
    name: 'Spacey Jane',
    genre: 'Indie Rock',
    day: 'Saturday',
    startTime: '17:30',
    endTime: '18:30',
    startMinutes: t('17:30'),
    endMinutes: t('18:30'),
    stage: 'Allianz'
  },
  {
    id: 'sa-geese',
    name: 'Geese',
    genre: 'Indie Rock / Post-Punk',
    day: 'Saturday',
    startTime: '19:30',
    endTime: '20:30',
    startMinutes: t('19:30'),
    endMinutes: t('20:30'),
    stage: 'Allianz'
  },

  // Kidzapalooza (Mid)
  {
    id: 'sa-florbromley',
    name: 'Flor Bromley',
    genre: 'Kids / Family',
    day: 'Saturday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'sa-megaran',
    name: 'Mega Ran',
    genre: 'Nerdcore / Hip Hop',
    day: 'Saturday',
    startTime: '13:30',
    endTime: '14:00',
    startMinutes: t('13:30'),
    endMinutes: t('14:00'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'sa-luckydiaz',
    name: 'Lucky Diaz',
    genre: 'Kids / Family',
    day: 'Saturday',
    startTime: '15:00',
    endTime: '15:30',
    startMinutes: t('15:00'),
    endMinutes: t('15:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'sa-happinessclub',
    name: 'The Happiness Club',
    genre: 'Youth Performance / Pop',
    day: 'Saturday',
    startTime: '16:00',
    endTime: '16:30',
    startMinutes: t('16:00'),
    endMinutes: t('16:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'sa-qbrothers',
    name: 'Q Brothers',
    genre: 'Kids Hip Hop / Theatre',
    day: 'Saturday',
    startTime: '17:15',
    endTime: '17:45',
    startMinutes: t('17:15'),
    endMinutes: t('17:45'),
    stage: 'Kidzapalooza'
  },

  // BMI (Mid Side)
  {
    id: 'sa-creekers',
    name: 'The Creekers',
    genre: 'Country Rock',
    day: 'Saturday',
    startTime: '13:00',
    endTime: '13:40',
    startMinutes: t('13:00'),
    endMinutes: t('13:40'),
    stage: 'BMI'
  },
  {
    id: 'sa-nextofkin',
    name: 'Next of Kin',
    genre: 'Alternative',
    day: 'Saturday',
    startTime: '14:10',
    endTime: '14:50',
    startMinutes: t('14:10'),
    endMinutes: t('14:50'),
    stage: 'BMI'
  },
  {
    id: 'sa-ink',
    name: 'INK',
    genre: 'Indie Pop',
    day: 'Saturday',
    startTime: '15:20',
    endTime: '16:00',
    startMinutes: t('15:20'),
    endMinutes: t('16:00'),
    stage: 'BMI'
  },
  {
    id: 'sa-calderallen',
    name: 'Calder Allen',
    genre: 'Americana / Folk',
    day: 'Saturday',
    startTime: '16:30',
    endTime: '17:10',
    startMinutes: t('16:30'),
    endMinutes: t('17:10'),
    stage: 'BMI'
  },
  {
    id: 'sa-jaestephens',
    name: 'Jae Stephens',
    genre: 'R&B / Soul',
    day: 'Saturday',
    startTime: '17:40',
    endTime: '18:20',
    startMinutes: t('17:40'),
    endMinutes: t('18:20'),
    stage: 'BMI'
  },
  {
    id: 'sa-ryman',
    name: 'Ryman',
    genre: 'Indie Pop',
    day: 'Saturday',
    startTime: '18:50',
    endTime: '19:30',
    startMinutes: t('18:50'),
    endMinutes: t('19:30'),
    stage: 'BMI'
  },

  // Airbnb (North Sub)
  {
    id: 'sa-natmyers',
    name: 'Nat Myers',
    genre: 'Blues / Americana',
    day: 'Saturday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Airbnb'
  },
  {
    id: 'sa-villanelle',
    name: 'Villanelle',
    genre: 'Indie Rock',
    day: 'Saturday',
    startTime: '12:50',
    endTime: '13:30',
    startMinutes: t('12:50'),
    endMinutes: t('13:30'),
    stage: 'Airbnb'
  },
  {
    id: 'sa-diespitz',
    name: 'Die Spitz',
    genre: 'Punk / Grunge',
    day: 'Saturday',
    startTime: '13:50',
    endTime: '14:30',
    startMinutes: t('13:50'),
    endMinutes: t('14:30'),
    stage: 'Airbnb'
  },
  {
    id: 'sa-frostchildren',
    name: 'Frost Children',
    genre: 'Electropop / Glitchcore',
    day: 'Saturday',
    startTime: '14:50',
    endTime: '15:30',
    startMinutes: t('14:50'),
    endMinutes: t('15:30'),
    stage: 'Airbnb'
  },
  {
    id: 'sa-quadeca',
    name: 'Quadeca',
    genre: 'Experimental Hip Hop / Folktronica',
    day: 'Saturday',
    startTime: '16:00',
    endTime: '16:45',
    startMinutes: t('16:00'),
    endMinutes: t('16:45'),
    stage: 'Airbnb'
  },
  {
    id: 'sa-siennaspiro',
    name: 'Sienna Spiro',
    genre: 'Soul / Pop',
    day: 'Saturday',
    startTime: '17:15',
    endTime: '18:00',
    startMinutes: t('17:15'),
    endMinutes: t('18:00'),
    stage: 'Airbnb'
  },
  {
    id: 'sa-kwn',
    name: 'KWN',
    genre: 'R&B / Soul',
    day: 'Saturday',
    startTime: '18:30',
    endTime: '19:15',
    startMinutes: t('18:30'),
    endMinutes: t('19:15'),
    stage: 'Airbnb'
  },
  {
    id: 'sa-cameronwhitcomb',
    name: 'Cameron Whitcomb',
    genre: 'Folk / Country',
    day: 'Saturday',
    startTime: '19:45',
    endTime: '20:30',
    startMinutes: t('19:45'),
    endMinutes: t('20:30'),
    stage: 'Airbnb'
  },
  {
    id: 'sa-trixiemattel',
    name: 'DJ Trixie Mattel',
    genre: 'Electronic / DJ',
    day: 'Saturday',
    startTime: '21:00',
    endTime: '22:00',
    startMinutes: t('21:00'),
    endMinutes: t('22:00'),
    stage: 'Airbnb'
  },

  // Tito's (South Side)
  {
    id: 'sa-chezile',
    name: 'Chezile',
    genre: 'R&B / Soul',
    day: 'Saturday',
    startTime: '12:45',
    endTime: '13:30',
    startMinutes: t('12:45'),
    endMinutes: t('13:30'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'sa-goldieboutilier',
    name: 'Goldie Boutilier',
    genre: 'Pop',
    day: 'Saturday',
    startTime: '14:15',
    endTime: '15:15',
    startMinutes: t('14:15'),
    endMinutes: t('15:15'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'sa-momma',
    name: 'Momma',
    genre: 'Indie Rock',
    day: 'Saturday',
    startTime: '16:15',
    endTime: '17:15',
    startMinutes: t('16:15'),
    endMinutes: t('17:15'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'sa-bbnos',
    name: 'bbno$',
    genre: 'Hip Hop / Pop',
    day: 'Saturday',
    startTime: '18:15',
    endTime: '19:15',
    startMinutes: t('18:15'),
    endMinutes: t('19:15'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'sa-cyso',
    name: 'Chicago Youth Symphony Orchestra',
    genre: 'Classical / Instrumental',
    day: 'Saturday',
    startTime: '20:15',
    endTime: '21:00',
    startMinutes: t('20:15'),
    endMinutes: t('21:00'),
    stage: 'Tito\'s Handmade Vodka'
  },

  // Bud Light (North)
  {
    id: 'sa-chace',
    name: 'Chace',
    genre: 'House / Pop',
    day: 'Saturday',
    startTime: '13:30',
    endTime: '14:15',
    startMinutes: t('13:30'),
    endMinutes: t('14:15'),
    stage: 'Bud Light'
  },
  {
    id: 'sa-wolfalice',
    name: 'Wolf Alice',
    genre: 'Alternative Rock',
    day: 'Saturday',
    startTime: '15:15',
    endTime: '16:15',
    startMinutes: t('15:15'),
    endMinutes: t('16:15'),
    stage: 'Bud Light'
  },
  {
    id: 'sa-clipse',
    name: 'Clipse',
    genre: 'Hip Hop / Rap',
    day: 'Saturday',
    startTime: '17:15',
    endTime: '18:15',
    startMinutes: t('17:15'),
    endMinutes: t('18:15'),
    stage: 'Bud Light'
  },
  {
    id: 'sa-etheland',
    name: 'Ethel Cain',
    genre: 'Dream Pop / Slowcore',
    day: 'Saturday',
    startTime: '19:15',
    endTime: '20:15',
    startMinutes: t('19:15'),
    endMinutes: t('20:15'),
    stage: 'Bud Light'
  },
  {
    id: 'sa-jennie',
    name: 'JENNIE',
    genre: 'Pop / K-Pop',
    day: 'Saturday',
    startTime: '21:00',
    endTime: '22:00',
    startMinutes: t('21:00'),
    endMinutes: t('22:00'),
    stage: 'Bud Light',
    imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&auto=format&fit=crop&q=60'
  },
  // --- SUNDAY (FROM ACTUAL SET TIMES IMAGE) ---
  
  // T-Mobile (South)
  {
    id: 'su-newconstellations',
    name: 'New Constellations',
    genre: 'Alternative Pop',
    day: 'Sunday',
    startTime: '13:15',
    endTime: '14:00',
    startMinutes: t('13:15'),
    endMinutes: t('14:00'),
    stage: 'T-Mobile'
  },
  {
    id: 'su-adela',
    name: 'Adéla',
    genre: 'Singer-Songwriter',
    day: 'Sunday',
    startTime: '15:00',
    endTime: '15:45',
    startMinutes: t('15:00'),
    endMinutes: t('15:45'),
    stage: 'T-Mobile'
  },
  {
    id: 'su-muna',
    name: 'MUNA',
    genre: 'Indie Pop / Synth-Pop',
    day: 'Sunday',
    startTime: '16:45',
    endTime: '17:45',
    startMinutes: t('16:45'),
    endMinutes: t('17:45'),
    stage: 'T-Mobile'
  },
  {
    id: 'su-beabadoobee',
    name: 'Beabadoobee',
    genre: 'Indie Rock / Bedroom Pop',
    day: 'Sunday',
    startTime: '18:45',
    endTime: '19:45',
    startMinutes: t('18:45'),
    endMinutes: t('19:45'),
    stage: 'T-Mobile'
  },
  {
    id: 'su-tatemcrae',
    name: 'Tate McRae',
    genre: 'Pop / Dance',
    day: 'Sunday',
    startTime: '20:45',
    endTime: '22:00',
    startMinutes: t('20:45'),
    endMinutes: t('22:00'),
    stage: 'T-Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60'
  },

  // Perry's (Mid)
  {
    id: 'su-zackmartino',
    name: 'Zack Martino',
    genre: 'House / EDM',
    day: 'Sunday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Perry\'s'
  },
  {
    id: 'su-jackiehollander',
    name: 'Jackie Hollander',
    genre: 'Techno / House',
    day: 'Sunday',
    startTime: '12:45',
    endTime: '13:30',
    startMinutes: t('12:45'),
    endMinutes: t('13:30'),
    stage: 'Perry\'s'
  },
  {
    id: 'su-westend',
    name: 'Westend',
    genre: 'Tech House',
    day: 'Sunday',
    startTime: '13:45',
    endTime: '14:45',
    startMinutes: t('13:45'),
    endMinutes: t('14:45'),
    stage: 'Perry\'s'
  },
  {
    id: 'su-riordan',
    name: 'Riordan',
    genre: 'Tech House',
    day: 'Sunday',
    startTime: '15:00',
    endTime: '16:00',
    startMinutes: t('15:00'),
    endMinutes: t('16:00'),
    stage: 'Perry\'s'
  },
  {
    id: 'su-dombresky',
    name: 'Dombresky',
    genre: 'House / Disco House',
    day: 'Sunday',
    startTime: '16:15',
    endTime: '17:15',
    startMinutes: t('16:15'),
    endMinutes: t('17:15'),
    stage: 'Perry\'s'
  },
  {
    id: 'su-dukedumont',
    name: 'Duke Dumont',
    genre: 'House / Electronic',
    day: 'Sunday',
    startTime: '17:45',
    endTime: '18:45',
    startMinutes: t('17:45'),
    endMinutes: t('18:45'),
    stage: 'Perry\'s'
  },
  {
    id: 'su-elibrown',
    name: 'Eli Brown',
    genre: 'Techno / House',
    day: 'Sunday',
    startTime: '19:00',
    endTime: '20:00',
    startMinutes: t('19:00'),
    endMinutes: t('20:00'),
    stage: 'Perry\'s'
  },
  {
    id: 'su-chainsmokers',
    name: 'The Chainsmokers',
    genre: 'Dance Pop / EDM',
    day: 'Sunday',
    startTime: '20:30',
    endTime: '21:45',
    startMinutes: t('20:30'),
    endMinutes: t('21:45'),
    stage: 'Perry\'s'
  },

  // Allianz (South Sub)
  {
    id: 'su-stellalefty',
    name: 'Stella Lefty',
    genre: 'Indie Pop',
    day: 'Sunday',
    startTime: '12:30',
    endTime: '13:15',
    startMinutes: t('12:30'),
    endMinutes: t('13:15'),
    stage: 'Allianz'
  },
  {
    id: 'su-destinconrad',
    name: 'Destin Conrad',
    genre: 'R&B',
    day: 'Sunday',
    startTime: '14:00',
    endTime: '15:00',
    startMinutes: t('14:00'),
    endMinutes: t('15:00'),
    stage: 'Allianz'
  },
  {
    id: 'su-ambermark',
    name: 'Amber Mark',
    genre: 'R&B / Soul',
    day: 'Sunday',
    startTime: '15:45',
    endTime: '16:45',
    startMinutes: t('15:45'),
    endMinutes: t('16:45'),
    stage: 'Allianz'
  },
  {
    id: 'su-jade',
    name: 'Jade',
    genre: 'Pop',
    day: 'Sunday',
    startTime: '17:45',
    endTime: '18:45',
    startMinutes: t('17:45'),
    endMinutes: t('18:45'),
    stage: 'Allianz'
  },
  {
    id: 'su-aespa',
    name: 'aespa',
    genre: 'K-Pop',
    day: 'Sunday',
    startTime: '19:45',
    endTime: '20:45',
    startMinutes: t('19:45'),
    endMinutes: t('20:45'),
    stage: 'Allianz'
  },

  // Kidzapalooza (Mid)
  {
    id: 'su-florbromley',
    name: 'Flor Bromley',
    genre: 'Kids / Family',
    day: 'Sunday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'su-luckydiaz',
    name: 'Lucky Diaz',
    genre: 'Kids / Family',
    day: 'Sunday',
    startTime: '13:30',
    endTime: '14:00',
    startMinutes: t('13:30'),
    endMinutes: t('14:00'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'su-qbrothers',
    name: 'Q Brothers',
    genre: 'Kids Hip Hop',
    day: 'Sunday',
    startTime: '15:00',
    endTime: '15:30',
    startMinutes: t('15:00'),
    endMinutes: t('15:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'su-happinessclub',
    name: 'The Happiness Club',
    genre: 'Youth Pop',
    day: 'Sunday',
    startTime: '16:00',
    endTime: '16:30',
    startMinutes: t('16:00'),
    endMinutes: t('16:30'),
    stage: 'Kidzapalooza'
  },
  {
    id: 'su-megaran',
    name: 'Mega Ran',
    genre: 'Nerdcore / Hip Hop',
    day: 'Sunday',
    startTime: '17:15',
    endTime: '17:45',
    startMinutes: t('17:15'),
    endMinutes: t('17:45'),
    stage: 'Kidzapalooza'
  },

  // BMI (Mid Side)
  {
    id: 'su-snacktime',
    name: 'Snacktime',
    genre: 'Brass Band / Funk',
    day: 'Sunday',
    startTime: '13:00',
    endTime: '13:40',
    startMinutes: t('13:00'),
    endMinutes: t('13:40'),
    stage: 'BMI'
  },
  {
    id: 'su-surfingfordaisy',
    name: 'Surfing for Daisy',
    genre: 'Indie Rock',
    day: 'Sunday',
    startTime: '14:10',
    endTime: '14:50',
    startMinutes: t('14:10'),
    endMinutes: t('14:50'),
    stage: 'BMI'
  },
  {
    id: 'su-caseoats',
    name: 'Case Oats',
    genre: 'Indie Country',
    day: 'Sunday',
    startTime: '15:20',
    endTime: '16:00',
    startMinutes: t('15:20'),
    endMinutes: t('16:00'),
    stage: 'BMI'
  },
  {
    id: 'su-justineskye',
    name: 'Justine Skye',
    genre: 'R&B / Pop',
    day: 'Sunday',
    startTime: '16:30',
    endTime: '17:10',
    startMinutes: t('16:30'),
    endMinutes: t('17:10'),
    stage: 'BMI'
  },
  {
    id: 'su-porchlight',
    name: 'Porch Light',
    genre: 'Indie Folk',
    day: 'Sunday',
    startTime: '17:40',
    endTime: '18:20',
    startMinutes: t('17:40'),
    endMinutes: t('18:20'),
    stage: 'BMI'
  },
  {
    id: 'su-willswinton',
    name: 'Will Swinton',
    genre: 'Singer-Songwriter',
    day: 'Sunday',
    startTime: '18:50',
    endTime: '19:30',
    startMinutes: t('18:50'),
    endMinutes: t('19:30'),
    stage: 'BMI'
  },

  // Airbnb (North Sub)
  {
    id: 'su-sunshine',
    name: 'Sunshine',
    genre: 'Indie Pop',
    day: 'Sunday',
    startTime: '12:00',
    endTime: '12:30',
    startMinutes: t('12:00'),
    endMinutes: t('12:30'),
    stage: 'Airbnb'
  },
  {
    id: 'su-thebends',
    name: 'The Bends',
    genre: 'Garage Rock',
    day: 'Sunday',
    startTime: '12:50',
    endTime: '13:30',
    startMinutes: t('12:50'),
    endMinutes: t('13:30'),
    stage: 'Airbnb'
  },
  {
    id: 'su-after',
    name: 'After',
    genre: 'Electronic',
    day: 'Sunday',
    startTime: '13:50',
    endTime: '14:30',
    startMinutes: t('13:50'),
    endMinutes: t('14:30'),
    stage: 'Airbnb'
  },
  {
    id: 'su-waterfromyoureyes',
    name: 'Water From Your Eyes',
    genre: 'Experimental Pop / Indie',
    day: 'Sunday',
    startTime: '14:50',
    endTime: '15:30',
    startMinutes: t('14:50'),
    endMinutes: t('15:30'),
    stage: 'Airbnb'
  },
  {
    id: 'su-inji',
    name: 'Inji',
    genre: 'House / Dance Pop',
    day: 'Sunday',
    startTime: '16:00',
    endTime: '16:45',
    startMinutes: t('16:00'),
    endMinutes: t('16:45'),
    stage: 'Airbnb'
  },
  {
    id: 'su-losretros',
    name: 'Los Retros',
    genre: 'Indie Pop / Psychedelic',
    day: 'Sunday',
    startTime: '17:15',
    endTime: '18:00',
    startMinutes: t('17:15'),
    endMinutes: t('18:00'),
    stage: 'Airbnb'
  },
  {
    id: 'su-monaleo',
    name: 'Monaleo',
    genre: 'Hip Hop / Rap',
    day: 'Sunday',
    startTime: '18:30',
    endTime: '19:15',
    startMinutes: t('18:30'),
    endMinutes: t('19:15'),
    stage: 'Airbnb'
  },
  {
    id: 'su-fakemink',
    name: 'Fakemink',
    genre: 'Electronic',
    day: 'Sunday',
    startTime: '19:45',
    endTime: '20:30',
    startMinutes: t('19:45'),
    endMinutes: t('20:30'),
    stage: 'Airbnb'
  },
  {
    id: 'su-ado',
    name: 'Ado',
    genre: 'J-Pop / Rock',
    day: 'Sunday',
    startTime: '21:15',
    endTime: '22:00',
    startMinutes: t('21:15'),
    endMinutes: t('22:00'),
    stage: 'Airbnb'
  },

  // Tito's (South Side)
  {
    id: 'su-easyhoney',
    name: 'Easy Honey',
    genre: 'Indie Rock',
    day: 'Sunday',
    startTime: '12:45',
    endTime: '13:30',
    startMinutes: t('12:45'),
    endMinutes: t('13:30'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'su-cruzbeckham',
    name: 'Cruz Beckham & The Breakers',
    genre: 'Indie Pop',
    day: 'Sunday',
    startTime: '14:15',
    endTime: '15:00',
    startMinutes: t('14:15'),
    endMinutes: t('15:00'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'su-wunderhorse',
    name: 'Wunderhorse',
    genre: 'Alternative Rock',
    day: 'Sunday',
    startTime: '16:00',
    endTime: '17:00',
    startMinutes: t('16:00'),
    endMinutes: t('17:00'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'su-hotmulligan',
    name: 'Hot Mulligan',
    genre: 'Emo / Pop Punk',
    day: 'Sunday',
    startTime: '18:00',
    endTime: '19:00',
    startMinutes: t('18:00'),
    endMinutes: t('19:00'),
    stage: 'Tito\'s Handmade Vodka'
  },
  {
    id: 'su-vandelux',
    name: 'Vandelux',
    genre: 'Electronic / Synthpop',
    day: 'Sunday',
    startTime: '20:00',
    endTime: '20:45',
    startMinutes: t('20:00'),
    endMinutes: t('20:45'),
    stage: 'Tito\'s Handmade Vodka'
  },

  // Bud Light (North)
  {
    id: 'su-whatmore',
    name: 'Whatmore',
    genre: 'Indie Pop',
    day: 'Sunday',
    startTime: '13:30',
    endTime: '14:15',
    startMinutes: t('13:30'),
    endMinutes: t('14:15'),
    stage: 'Bud Light'
  },
  {
    id: 'su-waylonwyatt',
    name: 'Waylon Wyatt',
    genre: 'Country / Folk',
    day: 'Sunday',
    startTime: '15:00',
    endTime: '16:00',
    startMinutes: t('15:00'),
    endMinutes: t('16:00'),
    stage: 'Bud Light'
  },
  {
    id: 'su-yoasobi',
    name: 'Yoasobi',
    genre: 'J-Pop / Electronic',
    day: 'Sunday',
    startTime: '17:00',
    endTime: '18:00',
    startMinutes: t('17:00'),
    endMinutes: t('18:00'),
    stage: 'Bud Light'
  },
  {
    id: 'su-turnstile',
    name: 'Turnstile',
    genre: 'Hardcore Punk',
    day: 'Sunday',
    startTime: '19:00',
    endTime: '20:00',
    startMinutes: t('19:00'),
    endMinutes: t('20:00'),
    stage: 'Bud Light'
  },
  {
    id: 'su-thexx',
    name: 'The xx',
    genre: 'Dream Pop / Electronic',
    day: 'Sunday',
    startTime: '20:45',
    endTime: '22:00',
    startMinutes: t('20:45'),
    endMinutes: t('22:00'),
    stage: 'Bud Light',
    imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&auto=format&fit=crop&q=60'
  }
];

// Returns estimated walk time in minutes between stage zones
// Grant Park distance: South end to North end is a solid 15-20 min walk through crowds.
// South to Mid is ~8 mins. North to Mid is ~8 mins. Same zone is 2-3 mins.
export const getWalkingTime = (stage1Name: string, stage2Name: string): number => {
  const s1 = STAGES.find(s => s.name === stage1Name);
  const s2 = STAGES.find(s => s.name === stage2Name);
  if (!s1 || !s2) return 0;
  if (s1.name === s2.name) return 0;

  const z1 = s1.zone;
  const z2 = s2.zone;

  if (z1 === z2) return 3; // e.g. T-Mobile to Allianz or Tito's (in South)
  if ((z1 === 'South' && z2 === 'North') || (z1 === 'North' && z2 === 'South')) {
    return 15; // Walk of shame! Across the whole park.
  }
  return 8; // Mid-to-North or Mid-to-South (e.g. Perry's/BMI/Kidzapalooza to Bud Light or T-Mobile)
};

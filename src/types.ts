export type HypeLevel = 'must' | 'want' | 'maybe' | 'none';

export type StageZone = 'North' | 'South' | 'Mid';

export interface Stage {
  name: string;
  zone: StageZone;
  description?: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  day: 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "14:30"
  endTime: string;   // "15:30"
  startMinutes: number; // minutes from 12:00 PM (e.g., 14:30 is 150 mins)
  endMinutes: number;   // minutes from 12:00 PM
  stage: string;
  imageUrl?: string;
}

export interface Friend {
  id: string;
  name: string;
  color: string; // hex or tailwind-like color string
  avatar: string; // initials
}

// Maps artist.id -> HypeLevel
export type FriendPreferences = Record<string, HypeLevel>;

// Maps friend.id -> FriendPreferences
export type GroupPreferences = Record<string, FriendPreferences>;

export interface WalkWarning {
  fromArtist: Artist;
  toArtist: Artist;
  minutesGap: number;
  estimatedWalkTime: number; // e.g. 15 for South-to-North
  isImpossible: boolean; // Gap is less than walking time
}

export interface Conflict {
  artistA: Artist;
  artistB: Artist;
  overlapMinutes: number;
}

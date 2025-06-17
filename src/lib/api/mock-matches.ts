// src/lib/api/mock-matches.ts
import { Match } from './betsapi';

export const mockMatches: Match[] = [
  {
    id: 'mock-1',
    sport_key: 'soccer_epl',
    homeTeam: 'Manchester United',
    awayTeam: 'Chelsea',
    date: '2025-06-18',
    time: '16:00',
    league: 'Premier League',
    bookmaker: 'MockBook',
    odds: { home: 1.85, draw: 3.2, away: 4.1 },
    commence_time: '2025-06-18T16:00:00Z',
  },
  {
    id: 'mock-2',
    sport_key: 'soccer_epl',
    homeTeam: 'Liverpool',
    awayTeam: 'Arsenal',
    date: '2025-06-19',
    time: '18:30',
    league: 'Premier League',
    bookmaker: 'MockBook',
    odds: { home: 2.1, draw: 3.0, away: 3.5 },
    commence_time: '2025-06-19T18:30:00Z',
  },
  {
    id: 'mock-3',
    sport_key: 'basketball_nba',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    date: '2025-06-20',
    time: '21:00',
    league: 'NBA',
    bookmaker: 'MockBook',
    odds: { home: 1.7, draw: null, away: 2.2 },
    commence_time: '2025-06-20T21:00:00Z',
  },
];

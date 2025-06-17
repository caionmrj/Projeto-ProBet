// Tipos para a API The Odds API (v4)
// Documentação: https://the-odds-api.com/liveapi/guides/v4/

// Interface para Esportes (baseado em /sports endpoint)
export interface Sport {
  key: string; // Ex: "soccer_epl"
  group: string; // Ex: "Soccer"
  title: string; // Ex: "EPL"
  description: string; // Ex: "English Premier League"
  active: boolean;
  has_outrights: boolean;
  // Adicionando campos para compatibilidade com UI anterior (podem ser ajustados)
  id: string; // Usaremos 'key' como id
  name: string; // Usaremos 'title' como name
  icon: string; // Mapear manualmente ou deixar vazio
}

// Interface para Odds/Eventos (baseado em /sports/{sport_key}/odds endpoint)
export interface Outcome {
  name: string; // Ex: "Manchester United"
  price: number; // Ex: 1.95 (Decimal odds)
}

export interface Market {
  key: string; // Ex: "h2h", "spreads", "totals"
  last_update: string; // ISO 8601 format
  outcomes: Outcome[];
}

export interface BookmakerOdds {
  key: string; // Ex: "draftkings"
  title: string; // Ex: "DraftKings"
  last_update: string; // ISO 8601 format
  markets: Market[];
}

export interface EventOdds {
  id: string; // ID do evento
  sport_key: string;
  sport_title: string;
  commence_time: string; // ISO 8601 format
  home_team: string;
  away_team: string;
  bookmakers: BookmakerOdds[];
}

// Interface para Scores/Resultados (baseado em /sports/{sport_key}/scores endpoint)
export interface EventScore {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: { name: string; score: string }[];
  last_update: string;
}

// Interface para detalhes completos de uma partida
export interface MatchDetail {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  league: string;
  bookmaker: string;
  odds: {
    home: number;
    draw: number | null;
    away: number;
  };
  sport_key: string;
  commence_time: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  score?: {
    home: string;
    away: string;
  };
  last_update?: string;
}

// --- Adaptação das interfaces antigas para manter alguma compatibilidade inicial --- 
// A interface Match será mapeada a partir de EventOdds
export interface Match {
  id: string; // Event ID from The Odds API
  homeTeam: string;
  awayTeam: string;
  date: string; // Data formatada de commence_time
  time: string; // Hora formatada de commence_time
  league: string; // sport_title from The Odds API
  bookmaker: string; // Nome da primeira casa de apostas encontrada
  odds: {
    home: number;
    draw: number | null; // Nem todos os mercados/esportes têm empate
    away: number;
  };
  sport_key: string; // Adicionado para referência
  commence_time: string; // Adicionado para ordenação
}

// Sistema de Cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheEntry<any>>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos em milissegundos

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public clear(): void {
    this.cache.clear();
  }
}

// Classe para interagir com a The Odds API
export class OddsAPIClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.the-odds-api.com/v4';
  private cache: Cache;
  private lastRequestTime: number = 0;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 segundo entre requisições

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.cache = Cache.getInstance();
    if (!this.apiKey) {
      console.error('API Key da The Odds API não fornecida!');
    }
  }

  // Método para fazer requisições à API com controle de rate limit
  private async fetchAPI<T>(endpoint: string, params: Record<string, string> = {}, useCache: boolean = true): Promise<T> {
    if (!this.apiKey) {
      throw new Error('API Key não configurada.');
    }

    // Gerar chave de cache
    const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;

    // Verificar cache se habilitado
    if (useCache) {
      const cachedData = this.cache.get<T>(cacheKey);
      if (cachedData) {
        console.log(`[OddsAPIClient] Cache hit for ${cacheKey}`);
        return cachedData;
      }
    }

    // Controle de rate limit
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('apiKey', this.apiKey);

    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    console.log(`[OddsAPIClient] Fetching: ${url.toString()}`);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
      });

      console.log(`[OddsAPIClient] Headers - Requests Remaining: ${response.headers.get('x-requests-remaining')}`);
      console.log(`[OddsAPIClient] Headers - Requests Used: ${response.headers.get('x-requests-used')}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[OddsAPIClient] API request failed with status ${response.status}: ${errorText}`);
        if (response.status === 429) {
          console.error("[OddsAPIClient] Rate limit excedido! Verifique seu plano ou aguarde.");
          // Tentar usar cache em caso de rate limit
          const cachedData = this.cache.get<T>(cacheKey);
          if (cachedData) {
            console.log(`[OddsAPIClient] Using cached data due to rate limit`);
            return cachedData;
          }
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      this.lastRequestTime = Date.now();

      // Armazenar no cache
      if (useCache) {
        this.cache.set(cacheKey, data);
      }

      return data as T;
    } catch (error) {
      console.error(`[OddsAPIClient] Error fetching from The Odds API (${endpoint}):`, error);
      throw error;
    }
  }

  // Obter esportes disponíveis
  async getSports(all: boolean = false): Promise<Sport[]> {
    console.log('[OddsAPIClient] Fetching sports...');
    try {
      // Corrigido: params sempre com string
      const params: Record<string, string> = all ? { all: 'true' } : {};
      const sportsData = await this.fetchAPI<any[]>('/sports', params, true);
      console.log('[OddsAPIClient] Raw sports data received:', sportsData);
      return sportsData.map(sport => ({
        ...sport,
        id: sport.key,
        name: sport.title,
        icon: this.mapSportGroupToIcon(sport.group)
      }));
    } catch (error) {
      console.error('[OddsAPIClient] Failed to fetch sports:', error);
      return [];
    }
  }

  // Obter Odds para um esporte específico
  async getOddsBySport(sportKey: string, regions: string = 'eu', markets: string = 'h2h'): Promise<EventOdds[]> {
    console.log(`[OddsAPIClient] Fetching odds for sport: ${sportKey}...`);
    try {
      const oddsData = await this.fetchAPI<EventOdds[]>(`/sports/${sportKey}/odds`, {
        regions,
        markets,
        dateFormat: 'iso',
        oddsFormat: 'decimal'
      }, true);
      return oddsData;
    } catch (error) {
      console.error(`[OddsAPIClient] Failed to fetch odds for sport ${sportKey}:`, error);
      return [];
    }
  }

  // Obter Scores/Resultados para um esporte específico
  async getScoresBySport(sportKey: string, daysFrom: string = '3'): Promise<EventScore[]> {
    console.log(`[OddsAPIClient] Fetching scores for sport: ${sportKey}...`);
    try {
      const scoresData = await this.fetchAPI<EventScore[]>(`/sports/${sportKey}/scores`, {
        daysFrom,
        dateFormat: 'iso'
      }, true);
      return scoresData;
    } catch (error) {
      console.error(`[OddsAPIClient] Failed to fetch scores for sport ${sportKey}:`, error);
      return [];
    }
  }

  // --- Métodos Adaptados para UI --- 

  // NOVO: Obter próximos jogos das ligas de futebol em destaque para a Home
  async getFeaturedFootballMatches(regions: string = 'eu', markets: string = 'h2h', limit: number = 4): Promise<Match[]> {
    const featuredLeagueKeys = [
      'soccer_epl',          // Premier League (UK)
      'soccer_spain_la_liga', // La Liga (Spain)
      'soccer_italy_serie_a', // Serie A (Italy)
      'soccer_brazil_campeonato' // Brasileirão (Brazil)
    ];
    console.log(`[OddsAPIClient] Fetching featured football matches for leagues: ${featuredLeagueKeys.join(', ')}`);

    let allMatches: Match[] = [];

    try {
      // Fazer chamadas para cada liga em paralelo
      const promises = featuredLeagueKeys.map(key => this.getOddsBySport(key, regions, markets));
      const results = await Promise.allSettled(promises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const leagueKey = featuredLeagueKeys[index];
          console.log(`[OddsAPIClient] Received ${result.value.length} matches for ${leagueKey}`);
          const mappedMatches = result.value.map(event => this.mapEventOddsToMatch(event));
          allMatches = allMatches.concat(mappedMatches);
        } else {
          console.error(`[OddsAPIClient] Failed to fetch odds for league ${featuredLeagueKeys[index]}:`, result.reason);
        }
      });

      // Ordenar todos os jogos por data/hora de início
      allMatches.sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());

      // Limitar ao número desejado
      const limitedMatches = allMatches.slice(0, limit);
      console.log(`[OddsAPIClient] Returning ${limitedMatches.length} featured matches after sorting and limiting.`);
      return limitedMatches;

    } catch (error) {
      console.error('[OddsAPIClient] Failed to fetch featured football matches:', error);
      return [];
    }
  }

  // Obter detalhes de uma partida específica (usando o endpoint de scores)
  async getMatchDetails(sportKey: string, eventId: string): Promise<MatchDetail | null> {
    console.log(`[OddsAPIClient] Fetching details for match ${eventId} in sport ${sportKey}...`);
    try {
      let eventScore: EventScore | undefined;
      try {
        const scores = await this.getScoresBySport(sportKey);
        eventScore = scores.find(score => score.id === eventId);
      } catch (scoreError) {
        console.warn(`[OddsAPIClient] Failed to fetch scores for ${sportKey}, proceeding to fetch odds only. Error:`, scoreError);
      }

      let eventOdds: EventOdds | undefined;
      try {
        const oddsEvents = await this.getOddsBySport(sportKey);
        eventOdds = oddsEvents.find(event => event.id === eventId);
      } catch (oddsError) {
        console.error(`[OddsAPIClient] Failed to fetch odds for ${sportKey}. Cannot get full match details. Error:`, oddsError);
        if (!eventScore) return null;
      }

      if (eventScore) {
        console.log(`[OddsAPIClient] Found score details for event ${eventId}. Merging with odds info if available.`);
        return this.mapEventScoreToMatchDetail(eventScore, eventOdds);
      } else if (eventOdds) {
        console.warn(`[OddsAPIClient] No score details found for event ${eventId}. Returning details based on odds info only.`);
        return this.mapEventOddsToMatchDetail(eventOdds);
      } else {
        console.error(`[OddsAPIClient] No score or odds found for event ${eventId}.`);
        return null;
      }
    } catch (error) {
      console.error(`[OddsAPIClient] Failed to fetch match details for ${eventId}:`, error);
      return null;
    }
  }

  // --- Funções Auxiliares de Mapeamento ---

  private mapSportGroupToIcon(group: string): string {
    switch (group.toLowerCase()) {
      case 'soccer': return '⚽';
      case 'american football': return '🏈';
      case 'basketball': return '🏀';
      case 'ice hockey': return '🏒';
      case 'baseball': return '⚾';
      case 'tennis': return '🎾';
      case 'volleyball': return '🏐';
      case 'mixed martial arts': return '🥊';
      case 'esports': return '🎮';
      case 'golf': return '⛳';
      case 'cricket': return '🏏';
      default: return '🏅';
    }
  }

  private mapEventOddsToMatch(event: EventOdds): Match {
    const commenceTime = new Date(event.commence_time);
    const firstBookmaker = event.bookmakers?.[0];
    const h2hMarket = firstBookmaker?.markets.find(m => m.key === 'h2h');

    let homeOdds = 0;
    let awayOdds = 0;
    let drawOdds = null;

    if (h2hMarket) {
      homeOdds = h2hMarket.outcomes.find(o => o.name === event.home_team)?.price || 0;
      awayOdds = h2hMarket.outcomes.find(o => o.name === event.away_team)?.price || 0;
      const drawOutcome = h2hMarket.outcomes.find(o => o.name.toLowerCase() === 'draw');
      if (drawOutcome) {
        drawOdds = drawOutcome.price;
      }
    }

    return {
      id: event.id,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      date: commenceTime.toLocaleDateString(),
      time: commenceTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      league: event.sport_title,
      bookmaker: firstBookmaker?.title || 'N/A',
      odds: {
        home: homeOdds,
        draw: drawOdds,
        away: awayOdds,
      },
      sport_key: event.sport_key,
      commence_time: event.commence_time,
    };
  }

  private mapEventScoreToMatchDetail(scoreInfo: EventScore, oddsInfo?: EventOdds): MatchDetail {
    const commenceTime = new Date(scoreInfo.commence_time);
    let status = 'Upcoming';
    if (scoreInfo.completed) {
      status = 'Completed';
    } else if (commenceTime < new Date()) {
      status = 'Live';
    }

    const mappedOdds = { home: 0, draw: null as number | null, away: 0 };
    let bookmaker = 'N/A';

    if (oddsInfo) {
      const firstBookmaker = oddsInfo.bookmakers?.[0];
      const h2hMarket = firstBookmaker?.markets.find(m => m.key === 'h2h');
      bookmaker = firstBookmaker?.title || 'N/A';
      if (h2hMarket) {
        mappedOdds.home = h2hMarket.outcomes.find(o => o.name === oddsInfo.home_team)?.price || 0;
        mappedOdds.away = h2hMarket.outcomes.find(o => o.name === oddsInfo.away_team)?.price || 0;
        const drawOutcome = h2hMarket.outcomes.find(o => o.name.toLowerCase() === 'draw');
        if (drawOutcome) {
          mappedOdds.draw = drawOutcome.price;
        }
      }
    }

    return {
      id: scoreInfo.id,
      homeTeam: scoreInfo.home_team,
      awayTeam: scoreInfo.away_team,
      date: commenceTime.toLocaleDateString(),
      time: commenceTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      league: scoreInfo.sport_title,
      bookmaker: bookmaker,
      odds: mappedOdds,
      sport_key: scoreInfo.sport_key,
      commence_time: scoreInfo.commence_time,
      status: status as 'Upcoming' | 'Live' | 'Completed',
      score: scoreInfo.scores ? {
        home: scoreInfo.scores.find(s => s.name === scoreInfo.home_team)?.score || '?',
        away: scoreInfo.scores.find(s => s.name === scoreInfo.away_team)?.score || '?'
      } : undefined,
      last_update: scoreInfo.last_update,
    };
  }

  private mapEventOddsToMatchDetail(oddsInfo: EventOdds): MatchDetail {
    const commenceTime = new Date(oddsInfo.commence_time);
    const firstBookmaker = oddsInfo.bookmakers?.[0];
    const h2hMarket = firstBookmaker?.markets.find(m => m.key === 'h2h');

    let homeOdds = 0;
    let awayOdds = 0;
    let drawOdds = null;

    if (h2hMarket) {
      homeOdds = h2hMarket.outcomes.find(o => o.name === oddsInfo.home_team)?.price || 0;
      awayOdds = h2hMarket.outcomes.find(o => o.name === oddsInfo.away_team)?.price || 0;
      const drawOutcome = h2hMarket.outcomes.find(o => o.name.toLowerCase() === 'draw');
      if (drawOutcome) {
        drawOdds = drawOutcome.price;
      }
    }

    return {
      id: oddsInfo.id,
      homeTeam: oddsInfo.home_team,
      awayTeam: oddsInfo.away_team,
      date: commenceTime.toLocaleDateString(),
      time: commenceTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      league: oddsInfo.sport_title,
      bookmaker: firstBookmaker?.title || 'N/A',
      odds: {
        home: homeOdds,
        draw: drawOdds,
        away: awayOdds,
      },
      sport_key: oddsInfo.sport_key,
      commence_time: oddsInfo.commence_time,
      status: 'Upcoming',
    };
  }
}

// Singleton instance
let oddsApiClientInstance: OddsAPIClient | null = null;

export function getOddsAPIClient(): OddsAPIClient {
  if (!oddsApiClientInstance) {
    // Chave fixa do usuário
    const apiKey = '11bbf76fea430d52554edaadc3f8dcc0';
    if (!apiKey) {
      console.error("API Key para The Odds API não encontrada!");
      throw new Error("API Key não configurada");
    }
    oddsApiClientInstance = new OddsAPIClient(apiKey);
  }
  return oddsApiClientInstance;
}

// Factory function to get an instance of the API client
export const getBetsAPI = (): OddsAPIClient => {
  const apiKey = process.env.THE_ODDS_API_KEY; // Assuming the key is in this env var
  if (!apiKey) {
    throw new Error("THE_ODDS_API_KEY environment variable is not set.");
  }
  return new OddsAPIClient(apiKey);
};

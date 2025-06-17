// src/lib/hooks/useMatches.ts
import { useEffect, useState } from 'react';
import { Match, getOddsAPIClient } from '../api/betsapi';

interface UseMatchesOptions {
  sportKey?: string;
  leagueKey?: string;
  featured?: boolean;
  limit?: number;
}

export function useMatches(options: UseMatchesOptions) {
  const { sportKey, leagueKey, featured, limit } = options;
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiClient = getOddsAPIClient();
        let data: Match[] = [];
        // Validação de sportKey/leagueKey
        if (sportKey) {
          const sports = await apiClient.getSports(true);
          const validSport = sports.find(s => s.key === sportKey || s.id === sportKey);
          if (!validSport) {
            setError('Esporte não encontrado ou não suportado.');
            setMatches([]);
            setIsLoading(false);
            return;
          }
        }
        if (leagueKey) {
          // Opcional: validar leagueKey se necessário
        }
        if (featured) {
          data = await apiClient.getFeaturedFootballMatches('eu', 'h2h', limit || 4);
        } else if (leagueKey) {
          const events = await apiClient.getOddsBySport(leagueKey, 'eu', 'h2h');
          data = events.map((event: any) => apiClient['mapEventOddsToMatch'](event));
        } else if (sportKey) {
          const events = await apiClient.getOddsBySport(sportKey, 'eu', 'h2h');
          data = events.map((event: any) => apiClient['mapEventOddsToMatch'](event));
        }
        setMatches(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar partidas');
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportKey, leagueKey, featured, limit]);

  return { matches, isLoading, error };
}

'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // Hook para ler query params
// Importar o novo cliente e tipos da API
import { MatchDetail, getOddsAPIClient } from '@/lib/api/betsapi';

export default function MatchPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const match_id = resolvedParams.id;
  const searchParams = useSearchParams();
  const sport_key = searchParams.get('sport_key'); // Obter sport_key da URL

  const [isLoading, setIsLoading] = useState(true);
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      // Verificar se temos ID da partida e a chave do esporte
      if (!match_id || !sport_key) {
        setError('ID da partida ou chave do esporte não fornecidos na URL.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log(`[MatchPage] Fetching details for match ${match_id}, sport ${sport_key}`);

        // Usar o novo cliente da API
        const apiClient = getOddsAPIClient();
        const matchData = await apiClient.getMatchDetails(sport_key, match_id);

        console.log(`[MatchPage] Match details received:`, matchData);

        if (matchData) {
          setMatch(matchData);
        } else {
          setError('Detalhes da partida não encontrados.');
          setMatch(null);
        }
      } catch (err) {
        console.error('[MatchPage] Error fetching match details:', err);
        setError('Erro ao carregar detalhes da partida. Verifique o console.');
        setMatch(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchDetails();
  }, [match_id, sport_key]); // Adicionar sport_key como dependência

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Carregando detalhes da partida...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container-custom py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-500">{error || 'Partida não encontrada'}</p>
          {error && error.includes('demonstração') && (
            <p className="text-orange-500">Você está visualizando dados de demonstração porque a API está indisponível ou com cota excedida.</p>
          )}
          <Link href="/" className="mt-4 inline-block text-green-800 hover:text-green-600">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  // Renderização com dados da The Odds API (estrutura MatchDetail mapeada)
  return (
    <div className="container-custom py-8">
      {/* Cabeçalho da partida */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-black">{match.homeTeam}</h2>
            <p className="text-gray-500 dark:text-gray-400">{match.league}</p> {/* League/Sport Title */}
          </div>

          <div className="flex-shrink-0 text-center">
            {/* Exibir placar se disponível */}
            {match.status === 'Completed' || match.status === 'Live' ? (
              <div className="text-4xl font-bold mb-1">
                {match.score?.home ?? '?'} - {match.score?.away ?? '?'}
              </div>
            ) : (
              <div className="text-3xl font-bold mb-2 dark:text-black">VS</div>
            )}
            <div className="text-sm text-gray-500">{match.date} {match.time}</div>
            <div className={`mt-2 text-xs px-3 py-1 rounded-full inline-block ${match.status === 'Completed' ? 'bg-gray-200 text-gray-700' : match.status === 'Live' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {match.status}
            </div>
            {match.last_update &&
              <div className="text-xs text-gray-400 mt-1">Última att: {new Date(match.last_update).toLocaleString()}</div>
            }
          </div>

          <div className="flex-1 text-center md:text-right mt-4 md:mt-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-black">{match.awayTeam}</h2>
            <p className="text-gray-500 dark:text-gray-400">&nbsp;</p> {/* Placeholder for alignment */}
          </div>
        </div>
      </div>

      {/* Odds da partida */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="x-6 py-4 border-b border-gray-200 dark:border-gray-200 bg-green-50 dark:bg-white">
          <h3 className="text-xl font-semibold text-green-800 dark:text-black">Odds (H2H)</h3>
          <p className="text-sm text-green-700 dark:text-gray-400">Casa de apostas: {match.bookmaker}</p>
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
          <div className="p-6 text-center hover:bg-green-50">
            <p className="text-green-800 dark:text-black mb-2">Casa</p>
            <div className="text-2xl font-bold text-gray-900 dark:text-black">{match.odds.home > 0 ? match.odds.home.toFixed(2) : '-'}</div>
            <p className="text-sm mt-2 text-gray-600 dark:text-black">{match.homeTeam}</p>
          </div>

          <div className="p-6 text-center hover:bg-green-50">
            <p className="text-green-800 dark:text-black mb-2">Empate</p>
            <div className="text-2xl font-bold text-gray-900 dark:text-black">{match.odds.draw !== null && match.odds.draw > 0 ? match.odds.draw.toFixed(2) : '-'}</div>
            <p className="text-sm mt-2 text-gray-600 dark:text-black">X</p>
          </div>

          <div className="p-6 text-center hover:bg-green-50">
            <p className="text-green-800 dark:text-black mb-2">Fora</p>
            <div className="text-2xl font-bold text-gray-900 dark:text-black">{match.odds.away > 0 ? match.odds.away.toFixed(2) : '-'}</div>
            <p className="text-sm mt-2 text-gray-600 dark:text-black">{match.awayTeam}</p>
          </div>
        </div>
      </div>

      {/* Informações adicionais (simplificado, pois a API não fornece tudo) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Informações Adicionais</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Esporte/Liga</h4>
            <p className="text-gray-600">{match.league}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">ID do Evento</h4>
            <p className="text-gray-600">{match.id}</p>
          </div>
        </div>

        <div className="mt-6">
          {/* Link de volta para a página do esporte */}
          <Link href={`/sports/${match.sport_key}`} className="text-green-800 hover:text-green-600">
            ← Voltar para {match.league}
          </Link>
        </div>
      </div>
    </div>
  );
}


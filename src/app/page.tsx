'use client';

import { useMatches } from '@/lib/hooks/useMatches';
import Link from 'next/link';
import { getSportIcon } from '@/lib/utils/sport-icons';

export default function Home() {
  const { matches: featuredMatches, isLoading: isLoadingFeaturedMatches, error: errorFeaturedMatches } = useMatches({ featured: true, limit: 4 });

  // Esportes em Destaque - Mostrar apenas Futebol, Basquete e MMA
  // Atualizar hrefs para apontar para as páginas de grupo
  const SPORTS_DATA_DISPLAY = [
    { key: 'soccer', name: 'Futebol', icon: '⚽', active: true, href: '/sports/soccer' },
    { key: 'basketball', name: 'Basquete', icon: '🏀', active: true, href: '/sports/basketball' },
    { key: 'mma', name: 'MMA', icon: '🥊', active: true, href: '/sports/mma_mixed_martial_arts' },
  ];

  return (
    <div className="container-custom">
      {/* Esportes em Destaque */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Esportes em Destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPORTS_DATA_DISPLAY.map((sport) => (
            <Link
              key={sport.key}
              href={sport.href}
              className="block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-orange-400 dark:border-orange-400">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-orange-600 dark:text-white mb-2">{sport.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{getSportIcon(sport.key)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Próximos Jogos (Futebol em Destaque) */}
      <section className="mb-12">
        <div className="bg-orange-400 rounded-xl p-6">
          <h2 className="text-3xl font-extrabold mb-6 text-white ">Jogos de Futebol em Destaque</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-orange-400 rounded-xl overflow-hidden">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Jogo / Liga</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Data/Hora</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Casa</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Empate</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Fora</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Casa de Apostas</th>
                </tr>
              </thead>
              <tbody>
                {featuredMatches.map((match) => (
                  <tr key={match.id} className="bg-white">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/match/${match.id}?sport_key=${match.sport_key}`} className="text-orange-800 hover:text-orange-600 font-medium">
                        {match.homeTeam} vs {match.awayTeam}
                      </Link>
                      <div className="text-xs text-gray-500">{match.league}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.date} {match.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-gray-900">{match.odds.home > 0 ? match.odds.home.toFixed(2) : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-gray-900">{match.odds.draw !== null && match.odds.draw > 0 ? match.odds.draw.toFixed(2) : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-gray-900">{match.odds.away > 0 ? match.odds.away.toFixed(2) : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{match.bookmaker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {errorFeaturedMatches && (
        <div className="bg-white rounded-lg shadow p-6 text-center mb-4">
          <p className="text-red-500 mb-2">{errorFeaturedMatches}</p>
          {errorFeaturedMatches.includes('demonstração') && (
            <p className="text-orange-500">Você está visualizando dados de demonstração porque a API está indisponível ou com cota excedida.</p>
          )}
        </div>
      )}
    </div>
  );
}


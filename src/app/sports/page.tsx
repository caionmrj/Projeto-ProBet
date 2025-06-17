'use client';

import Link from 'next/link';
import { getSportIcon } from '@/lib/utils/sport-icons';

// Mapeamento de slugs de grupo para exibição
// Usaremos os slugs corretos da API ou grupos genéricos para os links
const SPORTS_DISPLAY_DATA = [
  { slug: 'soccer', name: 'Futebol', icon: '⚽' },
  { slug: 'basketball', name: 'Basquete', icon: '🏀' },
  { slug: 'tennis', name: 'Tênis', icon: '🎾' },
  { slug: 'volleyball', name: 'Vôlei', icon: '🏐' }, // Usar slug que corresponda ao grupo da API se existir, ou um genérico
  { slug: 'mma_mixed_martial_arts', name: 'MMA', icon: '🥊' }, // Verificar slug exato do grupo na API
  { slug: 'esports', name: 'eSports', icon: '🎮' }, // Verificar slug exato do grupo na API
];

export default function SportsPage() {
  return (
    <div className="container-custom">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Esportes Disponíveis</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPORTS_DISPLAY_DATA.map((sport) => (
          <Link
            key={sport.slug}
            href={`/sports/${sport.slug}`}
            className="block"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-green-600 dark:text-white mb-2">{sport.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{getSportIcon(sport.slug)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


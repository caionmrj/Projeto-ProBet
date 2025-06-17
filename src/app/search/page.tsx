'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/lib/search/search-context';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Carregando busca...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const { searchQuery, setIsSearching } = useSearch();
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setIsSearching(true);
            // Aqui você pode implementar a lógica de busca real
            // Por enquanto, vamos apenas simular uma busca
            setTimeout(() => {
                setResults([
                    { id: 1, title: 'Futebol', type: 'sport', slug: 'soccer' },
                    { id: 2, title: 'Basquete', type: 'sport', slug: 'basketball' },
                    { id: 3, title: 'Tênis', type: 'sport', slug: 'tennis' },
                    { id: 4, title: 'MMA', type: 'sport', slug: 'mma' },
                ].filter(item =>
                    item.title.toLowerCase().includes(query.toLowerCase())
                ));
                setIsLoading(false);
            }, 500);
        }
    }, [searchParams, setIsSearching]);

    if (isLoading) {
        return (
            <div className="container-custom">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Buscando resultados para: {searchQuery}
                </h1>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Resultados para: {searchQuery}
            </h1>

            {results.length === 0 ? (
                <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhum resultado encontrado
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Tente buscar por outro termo ou navegue pelas categorias
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((result) => (
                        <Link
                            key={result.id}
                            href={`/sports/${result.slug}`}
                            className="card hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center space-x-4">
                                <Trophy className="w-8 h-8 text-green-600 dark:text-green-500" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {result.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {result.type === 'sport' ? 'Esporte' : 'Liga'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
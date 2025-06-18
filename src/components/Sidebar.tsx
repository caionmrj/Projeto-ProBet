'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Trophy, ChevronDown, ChevronUp, Menu } from 'lucide-react';
import { useSearch } from '@/lib/search/search-context';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { searchQuery, setSearchQuery, isSearching, setIsSearching } = useSearch();
    const [openSports, setOpenSports] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (path: string) => {
        return pathname === path;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearching(true);
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        if (!pathname.includes('/search')) {
            setSearchQuery('');
            setIsSearching(false);
        }
    }, [pathname, setSearchQuery, setIsSearching]);

    return (
        <>
            {/* Botão Hamburguer para mobile */}
            <button
                className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white dark:bg-gray-900 border md:hidden shadow"
                onClick={() => setIsMobileOpen((prev) => !prev)}
                aria-label="Abrir menu"
            >
                <Menu className="w-6 h-6 text-orange-600 dark:text-white" />
            </button>

            {/* Sidebar para desktop */}
            <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 z-20 hidden md:block">
                {/* Logo */}
                <div className="flex items-center space-x-2 mb-8">
                    <Trophy className="h-8 w-8 text-orange-600 dark:text-gray-200" />
                    <h1 className="text-xl font-bold text-orange-600 dark:text-white">BetPro</h1>
                </div>

                {/* Barra de Pesquisa */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
                        />
                        <button
                            type="submit"
                            className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* Navegação */}
                <nav className="space-y-2">
                    <Link
                        href="/"
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${pathname === '/'
                            ? 'bg-orange-400 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                    </Link>

                    {/* Botão Esportes com animação de abrir/fechar */}
                    <button
                        type="button"
                        onClick={() => setOpenSports((prev) => !prev)}
                        className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-colors text-left font-semibold ${openSports ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <span>Esportes</span>
                        {openSports ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSports ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <Link href="/sports/soccer" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/soccer') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Futebol</Link>
                        <Link href="/sports/basketball" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/basketball') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Basquete</Link>
                        <Link href="/sports/mma_mixed_martial_arts" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/mma_mixed_martial_arts') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>MMA</Link>
                        <Link href="/sports/tennis" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/tennis') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Tênis</Link>
                        <Link href="/sports/volleyball" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/volleyball') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Vôlei</Link>
                        <Link href="/sports/esports" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/esports') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>eSports</Link>
                    </div>
                </nav>
            </div>

            {/* Sidebar para mobile */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden" onClick={() => setIsMobileOpen(false)}>
                    <div
                        className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 shadow-lg flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botão para fechar o menu mobile */}
                        <button
                            className="self-end mb-4 p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => setIsMobileOpen(false)}
                            aria-label="Fechar menu"
                        >
                            <span className="text-xl">&times;</span>
                        </button>

                        {/* Logo */}
                        <div className="flex items-center space-x-2 mb-8">
                            <Trophy className="h-8 w-8 text-orange-600 dark:text-gray-200" />
                            <h1 className="text-xl font-bold text-orange-600 dark:text-white">BetPro</h1>
                        </div>

                        {/* Barra de Pesquisa */}
                        <div className="mb-6">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
                                />
                                <button
                                    type="submit"
                                    className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        {/* Navegação */}
                        <nav className="space-y-2">
                            <Link
                                href="/"
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${pathname === '/'
                                    ? 'bg-orange-400 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </Link>

                            {/* Botão Esportes com animação de abrir/fechar */}
                            <button
                                type="button"
                                onClick={() => setOpenSports((prev) => !prev)}
                                className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-colors text-left font-semibold ${openSports ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <span>Esportes</span>
                                {openSports ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openSports ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <Link href="/sports/soccer" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/soccer') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Futebol</Link>
                                <Link href="/sports/basketball" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/basketball') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Basquete</Link>
                                <Link href="/sports/mma_mixed_martial_arts" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/mma_mixed_martial_arts') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>MMA</Link>
                                <Link href="/sports/tennis" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/tennis') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Tênis</Link>
                                <Link href="/sports/volleyball" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/volleyball') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Vôlei</Link>
                                <Link href="/sports/esports" className={`block px-8 py-2 rounded-lg transition-colors ${pathname.startsWith('/sports/esports') ? 'bg-orange-400 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>eSports</Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
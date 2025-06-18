'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useTheme } from '@/lib/theme/theme-context';
import { Sun, Moon, User, LogOut, Trophy } from 'lucide-react';
import LoginModal from '@/components/auth/LoginModal';

export default function Header() {
  const { user, openModal, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 right-0 left-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full shadow-sm">
      <div className="flex items-center h-16">
        {/* Logo e nome da plataforma acima do menu lateral */}
        <div className="flex items-center space-x-2 fixed left-0 top-0 h-16 pl-6 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-64 md:w-64">
          <Trophy className="h-8 w-8 text-orange-600 dark:text-gray-200" />
          <span className="text-xl font-bold text-orange-600 dark:text-white">BetPro</span>
        </div>
        {/* Espaço para não sobrepor o conteúdo */}
        <div className="w-64" />
        {/* Botões de Ação no canto superior direito */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Auth Buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openModal}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors shadow-sm"
            >
              Entrar
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal />
    </header>
  );
}

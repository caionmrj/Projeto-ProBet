'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GitHubUser, loginWithGitHub, logoutFromGitHub } from './github-auth';

// Definindo o tipo para o contexto de autenticação
interface AuthContextType {
  user: GitHubUser | null;
  isLoading: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// Criando o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Componente provedor de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    // Verificar se há um usuário no localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Função para abrir o modal de login
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Função para fechar o modal de login
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Função para fazer login com GitHub
  const login = async () => {
    try {
      setIsLoading(true);
      const githubUser = await loginWithGitHub();
      setUser(githubUser);
      localStorage.setItem('user', JSON.stringify(githubUser));
      closeModal();
    } catch (error) {
      console.error('Erro ao fazer login com GitHub:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutFromGitHub();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Valor do contexto
  const value = {
    user,
    isLoading,
    isModalOpen,
    openModal,
    closeModal,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

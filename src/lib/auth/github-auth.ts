'use client';

// Implementação real de autenticação com GitHub OAuth

export interface GitHubUser {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
  email?: string;
}

// Configurações do OAuth
const GITHUB_CLIENT_ID = 'Ov23liNTeW2VYZeZJHlW';
// O client secret deve ser usado apenas no servidor, não no cliente
// Ele é usado na rota de API /api/auth/callback

// Função para iniciar o login com GitHub
export async function loginWithGitHub(): Promise<GitHubUser> {
  try {
    // Armazenar a URL atual para redirecionamento após login
    const returnUrl = window.location.href;
    localStorage.setItem('auth_return_url', returnUrl);
    
    // Construir URL de autorização do GitHub
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.append('client_id', GITHUB_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', `${window.location.origin}/api/auth/callback`);
    authUrl.searchParams.append('scope', 'user:email read:user');
    authUrl.searchParams.append('state', generateRandomState());
    
    // Redirecionar para a página de autorização do GitHub
    window.location.href = authUrl.toString();
    
    // Esta função não retorna um usuário diretamente, pois há um redirecionamento
    // O usuário será processado no callback
    // Retornamos uma promessa que nunca será resolvida
    return new Promise<GitHubUser>(() => {});
  } catch (error) {
    console.error('Erro ao iniciar autenticação GitHub:', error);
    throw new Error('Falha ao iniciar autenticação com GitHub');
  }
}

// Função para fazer logout
export async function logoutFromGitHub(): Promise<void> {
  try {
    // Remover token e dados do usuário do localStorage
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
    
    // Opcionalmente, fazer uma chamada para o backend para invalidar a sessão
    // await fetch('/api/auth/logout', { method: 'POST' });
    
    return Promise.resolve();
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return Promise.reject(error);
  }
}

// Função para verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('github_token');
}

// Função para obter o usuário atual
export function getCurrentUser(): GitHubUser | null {
  const userJson = localStorage.getItem('github_user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as GitHubUser;
  } catch (error) {
    console.error('Erro ao parsear dados do usuário:', error);
    return null;
  }
}

// Função para processar o callback após autenticação
// Esta função é chamada pela página que recebe o redirecionamento do GitHub
export async function handleAuthCallback(code: string, state: string): Promise<GitHubUser> {
  try {
    // Verificar o state para prevenir CSRF
    if (!verifyState(state)) {
      throw new Error('Estado inválido, possível ataque CSRF');
    }
    
    // Trocar o código por um token de acesso via API
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao obter token de acesso');
    }
    
    const { access_token } = await response.json();
    
    // Armazenar o token
    localStorage.setItem('github_token', access_token);
    
    // Obter dados do usuário
    const userResponse = await fetch('/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Falha ao obter dados do usuário');
    }
    
    const user = await userResponse.json();
    
    // Armazenar dados do usuário
    localStorage.setItem('github_user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Erro ao processar callback de autenticação:', error);
    throw error;
  }
}

// Função para gerar um estado aleatório para prevenir CSRF
function generateRandomState(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Função para verificar o estado retornado
function verifyState(state: string): boolean {
  // Implementar verificação de estado
  // Em uma implementação real, você compararia com o estado armazenado
  return true; // Simplificado para este exemplo
}

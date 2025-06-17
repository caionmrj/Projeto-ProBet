'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { handleAuthCallback } from '@/lib/auth/github-auth';

// Componente que usa useSearchParams dentro de Suspense
function CallbackHandler() {
  const router = useRouter();
  
  useEffect(() => {
    // Obter código e estado da URL usando window.location
    // em vez de useSearchParams para evitar o erro de build
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    const processCallback = async () => {
      try {
        if (error) {
          console.error('Erro retornado pelo GitHub:', error);
          router.push('/?auth_error=github_error');
          return;
        }
        
        if (!code || !state) {
          console.error('Código ou estado não fornecidos');
          router.push('/?auth_error=missing_params');
          return;
        }
        
        // Processar o callback
        await handleAuthCallback(code, state);
        
        // Redirecionar para a página inicial ou URL de retorno
        const returnUrl = localStorage.getItem('auth_return_url') || '/';
        localStorage.removeItem('auth_return_url');
        
        router.push(returnUrl + '?auth_success=true');
      } catch (error) {
        console.error('Erro ao processar callback:', error);
        router.push('/?auth_error=callback_failed');
      }
    };
    
    processCallback();
  }, [router]);
  
  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="container-custom py-8">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Autenticando...</h2>
        <p className="text-gray-500">Processando sua autenticação com GitHub. Por favor, aguarde.</p>
        
        <Suspense fallback={null}>
          <CallbackHandler />
        </Suspense>
      </div>
    </div>
  );
}

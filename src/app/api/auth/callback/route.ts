// Arquivo para implementar a rota de callback do OAuth do GitHub
// Este arquivo deve ser colocado em src/app/api/auth/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Função para lidar com o callback do OAuth do GitHub
export async function GET(request: NextRequest) {
  try {
    // Obter o código de autorização e estado da URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (!code || !state) {
      // Redirecionar para a página de callback do cliente com erro
      const redirectUrl = new URL('/auth/callback', request.nextUrl.origin);
      redirectUrl.searchParams.set('error', 'missing_params');
      return NextResponse.redirect(redirectUrl);
    }
    
    // Redirecionar para a página de callback do cliente com o código e estado
    // A página do cliente processará o código e obterá o token
    const redirectUrl = new URL('/auth/callback', request.nextUrl.origin);
    redirectUrl.searchParams.set('code', code);
    redirectUrl.searchParams.set('state', state);
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Erro durante o callback do OAuth:', error);
    
    // Redirecionar para a página de callback do cliente com erro
    const redirectUrl = new URL('/auth/callback', request.nextUrl.origin);
    redirectUrl.searchParams.set('error', 'server_error');
    
    return NextResponse.redirect(redirectUrl);
  }
}

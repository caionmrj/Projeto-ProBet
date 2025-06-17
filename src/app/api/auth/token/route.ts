import { NextRequest, NextResponse } from 'next/server';

// Rota para trocar o código de autorização por um token de acesso
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Código de autorização não fornecido' },
        { status: 400 }
      );
    }

    // Configurações do OAuth
    const clientId = 'Ov23liNTeW2VYZeZJHlW';
    const clientSecret = 'df378ed2b0875092600230c4d4e46c2d4059fc21';

    // Trocar o código por um token de acesso
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json(
        { success: false, error: 'Falha ao obter token de acesso' },
        { status: 400 }
      );
    }

    // Retornar o token de acesso para o cliente
    return NextResponse.json({
      success: true,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      scope: tokenData.scope
    });
  } catch (error) {
    console.error('Erro ao obter token de acesso:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar token' },
      { status: 500 }
    );
  }
}

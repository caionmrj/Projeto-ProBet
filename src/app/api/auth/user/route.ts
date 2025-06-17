import { NextRequest, NextResponse } from 'next/server';

// Rota para obter dados do usuário do GitHub
export async function GET(request: NextRequest) {
  try {
    // Obter o token de acesso do cabeçalho de autorização
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token de acesso não fornecido' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7); // Remover 'Bearer ' do início
    
    // Obter dados do usuário do GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'User-Agent': 'SportOdds-App'
      }
    });
    
    if (!userResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Falha ao obter dados do usuário' },
        { status: userResponse.status }
      );
    }
    
    const userData = await userResponse.json();
    
    // Obter email do usuário (pode ser necessário uma chamada separada)
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'User-Agent': 'SportOdds-App'
      }
    });
    
    let primaryEmail = null;
    
    if (emailsResponse.ok) {
      const emailsData = await emailsResponse.json();
      // Encontrar o email primário
      const primaryEmailObj = emailsData.find((email: any) => email.primary);
      primaryEmail = primaryEmailObj ? primaryEmailObj.email : null;
    }
    
    // Construir objeto de usuário
    const user = {
      id: userData.id.toString(),
      login: userData.login,
      name: userData.name || userData.login,
      avatar_url: userData.avatar_url,
      email: primaryEmail
    };
    
    return NextResponse.json({
      success: true,
      ...user
    });
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar dados do usuário' },
      { status: 500 }
    );
  }
}

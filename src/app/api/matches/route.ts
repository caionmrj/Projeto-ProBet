import { NextRequest, NextResponse } from 'next/server';
import { getBetsAPI } from '@/lib/api/betsapi';

// Rota para obter próximos jogos de futebol (para a página Home)
export async function GET(request: NextRequest) {
  try {
    const betsAPI = getBetsAPI();
    // Garantindo que apenas jogos de futebol sejam retornados
    const upcomingMatches = await betsAPI.getUpcomingMatches();
    
    // Filtrando apenas jogos de futebol, caso a API retorne outros esportes
    const soccerMatches = upcomingMatches.filter(match => 
      // Assumindo que jogos de futebol têm leagueId relacionado a futebol
      // ou verificando se o nome da liga contém termos relacionados a futebol
      match.leagueId.includes('soccer') || 
      match.league.toLowerCase().includes('league') ||
      match.league.toLowerCase().includes('série') ||
      match.league.toLowerCase().includes('copa') ||
      match.league.toLowerCase().includes('campeonato')
    );
    
    return NextResponse.json({ success: true, data: soccerMatches });
  } catch (error) {
    console.error('Error fetching upcoming soccer matches:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao carregar os próximos jogos de futebol' },
      { status: 500 }
    );
  }
}

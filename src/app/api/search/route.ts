import { NextRequest, NextResponse } from 'next/server';
import { getBetsAPI } from '@/lib/api/betsapi';

// Rota para buscar ligas e esportes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        success: false, 
        error: 'Search query must be at least 2 characters' 
      }, { status: 400 });
    }
    
    const betsAPI = getBetsAPI();
    
    // Buscar todos os esportes
    const sports = await betsAPI.getSports();
    
    // Filtrar esportes que correspondem à consulta
    const matchedSports = sports.filter(sport => 
      sport.name.toLowerCase().includes(query)
    );
    
    // Buscar ligas de futebol (foco no MVP)
    const soccerLeagues = await betsAPI.getLeaguesBySport('soccer');
    
    // Filtrar ligas que correspondem à consulta
    const matchedLeagues = soccerLeagues.filter(league => 
      league.name.toLowerCase().includes(query)
    );
    
    return NextResponse.json({ 
      success: true, 
      data: {
        sports: matchedSports,
        leagues: matchedLeagues
      }
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}

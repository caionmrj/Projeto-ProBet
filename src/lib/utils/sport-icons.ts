// src/lib/utils/sport-icons.ts

/**
 * Retorna o emoji correspondente ao grupo ou slug de esporte.
 */
export function getSportIcon(groupOrSlug: string): string {
  const lower = groupOrSlug.toLowerCase();
  if (lower.includes('soccer')) return '⚽';
  if (lower.includes('basketball')) return '🏀';
  if (lower.includes('tennis')) return '🎾';
  if (lower.includes('volleyball')) return '🏐';
  if (lower.includes('mma') || lower.includes('mixed_martial_arts')) return '🥊';
  if (lower.includes('esports')) return '🎮';
  if (lower.includes('ice hockey')) return '🏒';
  if (lower.includes('baseball')) return '⚾';
  if (lower.includes('golf')) return '⛳';
  if (lower.includes('cricket')) return '🏏';
  if (lower.includes('american football')) return '🏈';
  return '🏅';
}

// Exemplo de uso: getSportIcon('soccer') // '⚽'

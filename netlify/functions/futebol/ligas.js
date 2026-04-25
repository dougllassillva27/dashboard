// Dicionário e Normalização de Ligas

export const CAMPEONATOS_SUPORTADOS = [
  'Brasileirão Série A',
  'Brasileirão Série B',
  'Copa do Brasil',
  'Libertadores',
  'Sul-Americana',
  'Copa do Mundo',
  'Premier League',
  'La Liga',
];

export const MAPA_LIGAS = {
  'Brasileirão Série A': [
    'Brasileirão Série A',
    'Brasileiro Série A',
    'Campeonato Brasileiro Série A',
    'Campeonato Brasileiro 2025',
    'Campeonato Brasileiro 2026',
  ],
  'Brasileirão Série B': ['Brasileirão Série B', 'Brasileiro Série B', 'Campeonato Brasileiro Série B'],
  'Copa do Brasil': ['Copa do Brasil'],
  Libertadores: ['CONMEBOL Libertadores', 'Copa Libertadores', 'Libertadores'],
  'Sul-Americana': [
    'CONMEBOL Sudamericana',
    'CONMEBOL Sul-Americana',
    'Copa Sul-Americana',
    'Sul-Americana',
    'Sudamericana',
  ],
  'Copa do Mundo': ['FIFA World Cup', 'World Cup', 'Copa do Mundo'],
  'Premier League': ['Premier League'],
  'La Liga': ['LaLiga', 'LaLiga EA Sports', 'Campeonato Espanhol'],
};

export function normalizarTexto(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizarLiga(ligaOriginal) {
  if (!ligaOriginal) return null;
  const liga = normalizarTexto(ligaOriginal);
  for (const [ligaPadrao, aliases] of Object.entries(MAPA_LIGAS)) {
    const encontrou = aliases.some((alias) => liga.includes(normalizarTexto(alias)));
    if (encontrou) return ligaPadrao;
  }
  return null;
}

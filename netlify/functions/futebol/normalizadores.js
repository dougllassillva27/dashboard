// Módulo de Normalização de Dados

import { normalizarTexto } from './ligas.js';

export function gerarChaveJogo(jogo) {
  const data = jogo.dataISO ? jogo.dataISO.slice(0, 10) : '';

  return [jogo.campeonato, data, jogo.mandante?.nome, jogo.visitante?.nome].map(normalizarTexto).join('|');
}

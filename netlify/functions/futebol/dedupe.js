// Módulo de Deduplicação de Jogos

import { gerarChaveJogo } from './normalizadores.js';

const PESO_FONTE = {
  cbf: 1,
  conmebol: 2,
  fifa: 3,
  premierleague: 4,
  laliga: 5,
  ogol: 6,
};

export function deduplicarJogos(jogos) {
  const mapa = new Map();

  for (const jogo of jogos) {
    const chave = gerarChaveJogo(jogo);
    if (!mapa.has(chave)) {
      mapa.set(chave, jogo);
    } else {
      const existente = mapa.get(chave);
      const pesoNovo = PESO_FONTE[jogo.fonte] || 99;
      const pesoExistente = PESO_FONTE[existente.fonte] || 99;

      if (pesoNovo < pesoExistente) {
        mapa.set(chave, jogo);
      }
    }
  }

  return Array.from(mapa.values());
}

// Módulo de Cache em Memória

const CACHE = new Map();

export const obterCache = (chave) => {
  const item = CACHE.get(chave);
  if (!item) return null;
  if (Date.now() > item.expiraEm) {
    CACHE.delete(chave);
    return null;
  }
  return item.dados;
};

export const salvarCache = (chave, dados, ttlMs) => {
  CACHE.set(chave, {
    dados,
    geradoEm: Date.now(),
    expiraEm: Date.now() + ttlMs,
  });
};

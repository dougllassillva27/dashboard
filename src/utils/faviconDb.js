const FAVICON_API = '/.netlify/functions/favicon';

/**
 * Busca todos os favicons salvos no banco.
 * Retorna objeto { domain: favicon_url } ou {} em caso de falha.
 */
export const carregarFaviconsDb = async (token) => {
  try {
    const res = await fetch(FAVICON_API, {
      headers: { 'x-sync-token': token },
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.favicons || {};
  } catch {
    return {};
  }
};

/**
 * Salva ou atualiza o favicon de um domínio no banco.
 * Fire-and-forget: erros são silenciados intencionalmente.
 */
export const salvarFaviconDb = async (token, domain, favicon_url) => {
  try {
    await fetch(FAVICON_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sync-token': token,
      },
      body: JSON.stringify({ domain, favicon_url }),
    });
  } catch {
    // silenciado — operação de cache, não crítica
  }
};

/**
 * Remove o favicon de um domínio do banco.
 * Chamado ao excluir site (se domínio não for mais usado por nenhum outro site).
 */
export const deletarFaviconDb = async (token, domain) => {
  try {
    await fetch(`${FAVICON_API}?domain=${encodeURIComponent(domain)}`, {
      method: 'DELETE',
      headers: { 'x-sync-token': token },
    });
  } catch {
    // silenciado — operação de cache, não crítica
  }
};

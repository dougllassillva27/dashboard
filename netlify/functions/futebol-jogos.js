import { buscarJogosOgol } from './futebol/rss-ogol.js';
import { buscarJogosCBF } from './futebol/fontes/cbf.js';
import { buscarJogosConmebol } from './futebol/fontes/conmebol.js';
import { buscarJogosFifa } from './futebol/fontes/fifa.js';
import { buscarJogosPremierLeague } from './futebol/fontes/premier-league.js';
import { buscarJogosLaLiga } from './futebol/fontes/la-liga.js';
import { deduplicarJogos } from './futebol/dedupe.js';
import { obterCache, salvarCache } from './futebol/cache.js';
import { CAMPEONATOS_SUPORTADOS } from './futebol/ligas.js';

export const handler = async (event) => {
  const { urlProx, urlRes } = event.queryStringParameters || {};
  const rssProx = urlProx || 'https://www.ogol.com.br/rss/proxjogos.php';
  const rssRes = urlRes || 'https://www.ogol.com.br/rss/resultados.php';

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const cacheKey = `futebol:jogos:${today}`;

  const cacheValido = obterCache(cacheKey);
  if (cacheValido) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cacheValido),
    };
  }

  const avisos = [];
  const fontesStatus = {
    ogol: 'ok',
    cbf: 'ignorado_sem_lacuna',
    conmebol: 'ignorado_sem_lacuna',
    fifa: 'ignorado_sem_lacuna',
    premierleague: 'ignorado_sem_lacuna',
    laliga: 'ignorado_sem_lacuna',
  };
  let todosJogos = [];

  try {
    const jogosOgol = await buscarJogosOgol(rssProx, rssRes);
    todosJogos = [...jogosOgol];

    const encontrados = new Set(todosJogos.map((j) => j.campeonato));
    const faltantes = CAMPEONATOS_SUPORTADOS.filter((c) => !encontrados.has(c));

    if (faltantes.length > 0) {
      avisos.push(`RSS ogol não retornou: ${faltantes.join(', ')}. Fallbacks acionados.`);
      const promises = [];

      if (faltantes.some((f) => f.includes('Brasileirão') || f.includes('Copa do Brasil'))) {
        fontesStatus.cbf = 'processando';
        promises.push(
          buscarJogosCBF()
            .then((j) => {
              fontesStatus.cbf = 'ok';
              return j;
            })
            .catch(() => {
              fontesStatus.cbf = 'erro';
              return [];
            })
        );
      }

      if (faltantes.some((f) => f === 'Libertadores' || f === 'Sul-Americana')) {
        fontesStatus.conmebol = 'processando';
        promises.push(
          buscarJogosConmebol()
            .then((j) => {
              fontesStatus.conmebol = 'ok';
              return j;
            })
            .catch(() => {
              fontesStatus.conmebol = 'erro';
              return [];
            })
        );
      }

      if (faltantes.includes('Copa do Mundo')) {
        fontesStatus.fifa = 'processando';
        promises.push(
          buscarJogosFifa()
            .then((j) => {
              fontesStatus.fifa = 'ok';
              return j;
            })
            .catch(() => {
              fontesStatus.fifa = 'erro';
              return [];
            })
        );
      }

      if (faltantes.includes('Premier League')) {
        fontesStatus.premierleague = 'processando';
        promises.push(
          buscarJogosPremierLeague()
            .then((j) => {
              fontesStatus.premierleague = 'ok';
              return j;
            })
            .catch(() => {
              fontesStatus.premierleague = 'erro';
              return [];
            })
        );
      }

      if (faltantes.includes('La Liga')) {
        fontesStatus.laliga = 'processando';
        promises.push(
          buscarJogosLaLiga()
            .then((j) => {
              fontesStatus.laliga = 'ok';
              return j;
            })
            .catch(() => {
              fontesStatus.laliga = 'erro';
              return [];
            })
        );
      }

      const resultadosFallbacks = await Promise.allSettled(promises);
      resultadosFallbacks.forEach((res) => {
        if (res.status === 'fulfilled') {
          todosJogos = [...todosJogos, ...res.value];
        }
      });
    }

    const jogosDeduplicados = deduplicarJogos(todosJogos);

    jogosDeduplicados.sort((a, b) => {
      const getPeso = (s) => {
        if (['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(s)) return 1;
        if (s === 'NS') return 2;
        return 3;
      };
      const pesoA = getPeso(a.status);
      const pesoB = getPeso(b.status);
      if (pesoA !== pesoB) return pesoA - pesoB;
      return a.horario.localeCompare(b.horario);
    });

    // Limita para não estourar a interface
    const limitados = jogosDeduplicados.slice(0, 20);

    const payloadFinal = {
      dataReferencia: today,
      cache: { hit: false, ttlMs: 600000, geradoEm: new Date().toISOString() },
      fontes: fontesStatus,
      avisos,
      jogos: limitados,
    };

    salvarCache(cacheKey, payloadFinal, 600000); // 10 minutos

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadFinal),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

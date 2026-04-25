// Parser e Extrator do RSS do Ogol

import Parser from 'rss-parser';
import { normalizarLiga } from './ligas.js';

const parser = new Parser({
  customFields: {
    item: [['dc:subject', 'subject']],
  },
});

const fetchAndParse = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
    },
  });

  if (!response.ok) throw new Error(`Status ${response.status} ao acessar ${url}`);

  const buffer = await response.arrayBuffer();
  let xml = new TextDecoder('utf-8').decode(buffer);
  if (xml.includes('encoding="ISO-8859-1"') || xml.includes('encoding="iso-8859-1"')) {
    xml = new TextDecoder('iso-8859-1').decode(buffer);
  }
  return parser.parseString(xml);
};

export async function buscarJogosOgol(urlProx, urlRes) {
  const jogos = [];
  try {
    const [feedProx, feedRes] = await Promise.all([
      fetchAndParse(urlProx).catch(() => ({ items: [] })),
      fetchAndParse(urlRes).catch(() => ({ items: [] })),
    ]);

    // Próximos Jogos (Agendados)
    feedProx.items.forEach((item, index) => {
      const match = item.title.match(/^(?:\[(.*?)\]\s*)?(.*?)\s+(?:x|v|vs|-)\s+(.*)$/i);
      if (match) {
        const ligaOriginal = item.subject || (match[1] ? match[1].trim() : null);
        const ligaNormalizada = normalizarLiga(ligaOriginal);

        if (!ligaNormalizada) return; // Descarta jogos fora do filtro

        let horarioFormatado = '';
        try {
          const d = new Date(item.pubDate || item.isoDate);
          if (!isNaN(d.getTime())) {
            horarioFormatado = d.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Sao_Paulo',
            });
          }
        } catch (e) {}

        jogos.push({
          id: `ogol-prox-${index}`,
          campeonato: ligaNormalizada,
          campeonatoOriginal: ligaOriginal,
          rodada: '',
          horario: horarioFormatado || '00:00',
          status: 'NS',
          minuto: null,
          mandante: { nome: match[2] ? match[2].trim() : 'Desconhecido', escudo: null },
          visitante: { nome: match[3] ? match[3].trim() : 'Desconhecido', escudo: null },
          placar: { mandante: null, visitante: null },
          fonte: 'ogol',
          link: item.link || '',
        });
      }
    });

    // Resultados (Encerrados)
    feedRes.items.forEach((item, index) => {
      const match = item.title.match(/^(?:\[(.*?)\]\s*)?(.*?)\s+(\d+)\s*(?:x|-)\s*(\d+)\s+(.*)$/i);
      if (match) {
        const ligaOriginal = item.subject || (match[1] ? match[1].trim() : null);
        const ligaNormalizada = normalizarLiga(ligaOriginal);

        if (!ligaNormalizada) return; // Descarta jogos fora do filtro

        jogos.push({
          id: `ogol-res-${index}`,
          campeonato: ligaNormalizada,
          campeonatoOriginal: ligaOriginal,
          rodada: '',
          horario: 'Encerrado',
          status: 'FT',
          minuto: null,
          mandante: { nome: match[2].trim(), escudo: null },
          visitante: { nome: match[5].trim(), escudo: null },
          placar: { mandante: parseInt(match[3], 10), visitante: parseInt(match[4], 10) },
          fonte: 'ogol',
          link: item.link || '',
        });
      }
    });
  } catch (error) {
    console.error('Erro Ogol RSS:', error);
  }
  return jogos;
}

// Scraper Fallback: FIFA

import * as cheerio from 'cheerio';

export async function buscarJogosFifa() {
  const jogos = [];
  try {
    const url = 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) return jogos;

    const html = await response.text();
    const $ = cheerio.load(html);

    $('.match-block, .fixture-block, .ff-match-card').each((i, el) => {
      const mandante = $(el).find('.home-team .team-name, .team-home .name').text().trim();
      const visitante = $(el).find('.away-team .team-name, .team-away .name').text().trim();

      if (!mandante || !visitante) return;

      const placarMandante = parseInt($(el).find('.home-team .score, .team-home .score').text().trim(), 10);
      const placarVisitante = parseInt($(el).find('.away-team .score, .team-away .score').text().trim(), 10);
      const horarioMatch = $(el)
        .find('.match-time, .time')
        .text()
        .trim()
        .match(/\d{2}:\d{2}/);

      jogos.push({
        id: `fifa-wc-${i}`,
        campeonato: 'Copa do Mundo',
        campeonatoOriginal: 'FIFA World Cup',
        rodada: '',
        horario: horarioMatch ? horarioMatch[0] : '00:00',
        status: !isNaN(placarMandante) && !isNaN(placarVisitante) ? 'FT' : 'NS',
        minuto: null,
        mandante: { nome: mandante, escudo: null },
        visitante: { nome: visitante, escudo: null },
        placar: {
          mandante: isNaN(placarMandante) ? null : placarMandante,
          visitante: isNaN(placarVisitante) ? null : placarVisitante,
        },
        fonte: 'fifa',
        link: url,
      });
    });
  } catch (error) {
    console.error('Erro Fonte FIFA:', error.message);
  }
  return jogos;
}

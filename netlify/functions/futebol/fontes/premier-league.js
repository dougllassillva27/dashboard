// Scraper Fallback: Premier League

import * as cheerio from 'cheerio';

export async function buscarJogosPremierLeague() {
  const jogos = [];
  try {
    const url = 'https://www.premierleague.com/matches';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
      },
    });

    if (!response.ok) return jogos;

    const html = await response.text();
    const $ = cheerio.load(html);

    $('.matchList .matchFixtureContainer').each((i, el) => {
      const mandante =
        $(el).find('.teamName.home .shortname').text().trim() || $(el).find('.teamName.home').text().trim();
      const visitante =
        $(el).find('.teamName.away .shortname').text().trim() || $(el).find('.teamName.away').text().trim();

      if (!mandante || !visitante) return;

      const placarStr = $(el).find('.score').text().trim().split('-');
      const placarMandante = placarStr[0] ? parseInt(placarStr[0], 10) : null;
      const placarVisitante = placarStr[1] ? parseInt(placarStr[1], 10) : null;

      const horarioMatch = $(el)
        .find('.time')
        .text()
        .trim()
        .match(/\d{2}:\d{2}/);

      jogos.push({
        id: `pl-${i}`,
        campeonato: 'Premier League',
        campeonatoOriginal: 'Premier League',
        rodada: '',
        horario: horarioMatch ? horarioMatch[0] : '00:00',
        status: placarMandante !== null && !isNaN(placarMandante) ? 'FT' : 'NS',
        minuto: null,
        mandante: { nome: mandante, escudo: null },
        visitante: { nome: visitante, escudo: null },
        placar: {
          mandante: isNaN(placarMandante) ? null : placarMandante,
          visitante: isNaN(placarVisitante) ? null : placarVisitante,
        },
        fonte: 'premierleague',
        link: url,
      });
    });
  } catch (error) {
    console.error('Erro Fonte Premier League:', error.message);
  }
  return jogos;
}

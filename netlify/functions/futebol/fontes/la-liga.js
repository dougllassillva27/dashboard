// Scraper Fallback: La Liga

import * as cheerio from 'cheerio';

export async function buscarJogosLaLiga() {
  const jogos = [];
  try {
    const url = 'https://www.laliga.com/en-GB/laliga-easports/calendar';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept-Language': 'en-GB,en;q=0.9',
      },
    });

    if (!response.ok) return jogos;

    const html = await response.text();
    const $ = cheerio.load(html);

    $('.match-fixture, .shield-name-container')
      .closest('tr, li, div.match')
      .each((i, el) => {
        const times = $(el).find('.shield-name');
        if (times.length < 2) return;

        const mandante = $(times[0]).text().trim();
        const visitante = $(times[1]).text().trim();

        const placarStr = $(el).find('.score').text().trim().split('-');
        const placarMandante = placarStr[0] ? parseInt(placarStr[0], 10) : null;
        const placarVisitante = placarStr[1] ? parseInt(placarStr[1], 10) : null;

        const horarioMatch = $(el)
          .find('.time')
          .text()
          .trim()
          .match(/\d{2}:\d{2}/);

        jogos.push({
          id: `laliga-${i}`,
          campeonato: 'La Liga',
          campeonatoOriginal: 'LaLiga EA Sports',
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
          fonte: 'laliga',
          link: url,
        });
      });
  } catch (error) {
    console.error('Erro Fonte La Liga:', error.message);
  }
  return jogos;
}

// Scraper Fallback: CBF

import * as cheerio from 'cheerio';

export async function buscarJogosCBF() {
  const jogos = [];
  try {
    const fetchOptions = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    };

    const campeonatos = [
      {
        nome: 'Brasileirão Série A',
        url: 'https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-a',
      },
      {
        nome: 'Brasileirão Série B',
        url: 'https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-b',
      },
    ];

    const todayStr = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).substring(0, 5); // "25/04"

    for (const camp of campeonatos) {
      try {
        const response = await fetch(camp.url, fetchOptions);
        if (!response.ok) continue;

        const html = await response.text();
        const $ = cheerio.load(html);

        $('.swiper-slide.active .box, .aside-rodadas .box').each((i, el) => {
          const partidaDesc = $(el).find('.partida-desc').text().trim();

          if (!partidaDesc.includes(todayStr) && !partidaDesc.toLowerCase().includes('hoje')) {
            return;
          }

          const mandante =
            $(el).find('.time.pull-left .time-sigla').attr('title') ||
            $(el).find('.time.pull-left .time-nome').text().trim();
          const visitante =
            $(el).find('.time.pull-right .time-sigla').attr('title') ||
            $(el).find('.time.pull-right .time-nome').text().trim();

          if (!mandante || !visitante) return;

          const placarMandanteStr = $(el).find('.time.pull-left .bg-azul').text().trim();
          const placarVisitanteStr = $(el).find('.time.pull-right .bg-azul').text().trim();

          const placarMandante = placarMandanteStr ? parseInt(placarMandanteStr, 10) : null;
          const placarVisitante = placarVisitanteStr ? parseInt(placarVisitanteStr, 10) : null;

          const horarioMatch = partidaDesc.match(/\d{2}:\d{2}/);
          const horario = horarioMatch ? horarioMatch[0] : '00:00';

          jogos.push({
            id: `cbf-${camp.nome}-${i}`,
            campeonato: camp.nome,
            campeonatoOriginal: camp.nome,
            rodada: '',
            horario: horario,
            status: placarMandante !== null && !isNaN(placarMandante) ? 'FT' : 'NS',
            minuto: null,
            mandante: { nome: mandante, escudo: null },
            visitante: { nome: visitante, escudo: null },
            placar: {
              mandante: isNaN(placarMandante) ? null : placarMandante,
              visitante: isNaN(placarVisitante) ? null : placarVisitante,
            },
            fonte: 'cbf',
            link: camp.url,
          });
        });
      } catch (err) {
        console.error(`Erro ao processar ${camp.nome}:`, err.message);
      }
    }
  } catch (error) {
    console.error('Erro Fonte CBF:', error.message);
  }
  return jogos;
}

// Scraper Fallback: CONMEBOL

import * as cheerio from 'cheerio';

export async function buscarJogosConmebol() {
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
      { nome: 'Libertadores', url: 'https://www.conmebol.com/pt-br/conmebol-libertadores/' },
      { nome: 'Sul-Americana', url: 'https://www.conmebol.com/pt-br/conmebol-sudamericana/' },
    ];

    for (const camp of campeonatos) {
      try {
        const response = await fetch(camp.url, fetchOptions);
        if (!response.ok) continue;

        const html = await response.text();
        const $ = cheerio.load(html);

        $('.match-card, .partida-box, .fixture-card').each((i, el) => {
          const mandante = $(el).find('.home-team, .local .name, .team-name').first().text().trim();
          const visitante = $(el).find('.away-team, .visitante .name, .team-name').last().text().trim();

          if (!mandante || !visitante || mandante === visitante) return;

          const placarMandanteStr = $(el).find('.home-score, .local .score').text().trim();
          const placarVisitanteStr = $(el).find('.away-score, .visitante .score').text().trim();

          const placarMandante = placarMandanteStr ? parseInt(placarMandanteStr, 10) : null;
          const placarVisitante = placarVisitanteStr ? parseInt(placarVisitanteStr, 10) : null;

          const horarioStr = $(el).find('.match-time, .hora, .time').text().trim();
          const horarioMatch = horarioStr.match(/\d{2}:\d{2}/);
          const horario = horarioMatch ? horarioMatch[0] : '00:00';

          const statusTexto = $(el).find('.status, .estado').text().trim().toUpperCase();
          let status = 'NS';
          if (
            statusTexto.includes('FIN') ||
            statusTexto.includes('ENCERRADO') ||
            (!isNaN(placarMandante) && !isNaN(placarVisitante))
          ) {
            status = 'FT';
          } else if (statusTexto.includes('VIVO') || statusTexto.includes('LIVE')) {
            status = 'LIVE';
          }

          jogos.push({
            id: `conmebol-${camp.nome}-${i}`,
            campeonato: camp.nome,
            campeonatoOriginal: camp.nome,
            rodada: '',
            horario,
            status,
            minuto: null,
            mandante: { nome: mandante, escudo: null },
            visitante: { nome: visitante, escudo: null },
            placar: {
              mandante: isNaN(placarMandante) ? null : placarMandante,
              visitante: isNaN(placarVisitante) ? null : placarVisitante,
            },
            fonte: 'conmebol',
            link: camp.url,
          });
        });
      } catch (err) {
        console.error(`Erro ao processar ${camp.nome}:`, err.message);
      }
    }
  } catch (error) {
    console.error('Erro Fonte CONMEBOL:', error.message);
  }
  return jogos;
}

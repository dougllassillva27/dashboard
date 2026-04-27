import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

export const handler = async (event) => {
  const rssUrl = event.queryStringParameters?.url || 'https://www.ogol.com.br/rss/noticias.php';

  try {
    const fetchOptions = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'application/rss+xml, application/xml, text/xml, */*;q=0.9',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    };

    let response = await fetch(rssUrl, fetchOptions).catch(() => null);

    // Se falhou ou foi barrado pelo Cloudflare (403), aciona o fallback via proxy
    if (!response || !response.ok) {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
      response = await fetch(proxyUrl, fetchOptions);
    }

    if (!response || !response.ok) {
      throw new Error(`Falha de rede ou bloqueio ativo. Status: ${response?.status}`);
    }

    const buffer = await response.arrayBuffer();
    let xml = new TextDecoder('utf-8').decode(buffer);

    // Previne crash do parser caso o proxy devolva o desafio HTML do Cloudflare disfarçado de 200 OK
    if (xml.trim().toLowerCase().startsWith('<!doctype html') || xml.includes('Just a moment...')) {
      throw new Error('Acesso bloqueado permanentemente pelo Cloudflare do servidor de origem.');
    }

    if (xml.includes('encoding="ISO-8859-1"') || xml.includes('encoding="iso-8859-1"')) {
      xml = new TextDecoder('iso-8859-1').decode(buffer);
    }

    const feed = await parser.parseString(xml);
    const items = [];

    for (const item of feed.items.slice(0, 16)) {
      let imagem = null;

      if (item.media && item.media.$ && item.media.$.url) {
        imagem = item.media.$.url;
      } else {
        const html = item.content || item.contentEncoded || item.contentSnippet || '';
        const imgMatch = html.match(/<img[^>]+src="([^">]+)"/i);
        if (imgMatch) {
          imagem = imgMatch[1];
        }
      }

      items.push({
        id: item.guid || item.id || item.link,
        titulo: item.title,
        link: item.link,
        dataPublicacao: item.pubDate || item.isoDate,
        fonte: feed.title || 'Futebol Notícias',
        imagem: imagem,
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itens: items }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

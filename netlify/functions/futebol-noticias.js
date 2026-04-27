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

    let xml = null;

    const proxies = [
      (url) => url, // 1. Direto
      (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`, // 2. Proxy A
      (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, // 3. Proxy B
      (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, // 4. Proxy C
    ];

    for (const proxyFn of proxies) {
      try {
        const targetUrl = proxyFn(rssUrl);
        const response = await fetch(targetUrl, fetchOptions);

        if (!response.ok) continue;

        const buffer = await response.arrayBuffer();
        let text = new TextDecoder('utf-8').decode(buffer);

        if (text.includes('encoding="ISO-8859-1"') || text.includes('encoding="iso-8859-1"')) {
          text = new TextDecoder('iso-8859-1').decode(buffer);
        }

        // Validação WAF (Cloudflare/Sucuri)
        if (text.trim().toLowerCase().startsWith('<!doctype') || text.includes('Just a moment...')) {
          continue;
        }

        xml = text;
        break;
      } catch (err) {
        continue;
      }
    }

    if (!xml) {
      throw new Error(
        'Bloqueado por WAF em todos os proxies. Use o RSS do GE nas configurações: https://ge.globo.com/rss/futebol/'
      );
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

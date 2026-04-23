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
  const rssUrl = event.queryStringParameters?.url || 'https://ge.globo.com/Esportes/Rss/0,,AS0-9825,00.xml';

  try {
    const feed = await parser.parseURL(rssUrl);
    const items = [];

    for (const item of feed.items.slice(0, 8)) {
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

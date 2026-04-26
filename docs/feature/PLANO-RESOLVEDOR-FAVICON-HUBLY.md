# Plano: Resolvedor de Favicon Hubly (Serverless)

## Objetivo

Implementar um Web Scraper especializado via Netlify Functions capaz de resolver o melhor ícone de um site (favicon, apple-touch-icon, manifest) evitando problemas de CORS no frontend e blindando a aplicação contra placeholders genéricos.

## Contrato do Endpoint

- **URL**: `GET /.netlify/functions/resolver-favicon?url=<site>`
- **Retorno Sucesso (200)**: `{ "favicon_url": "https://..." }`
- **Retorno Erro Controlado (403/400/500)**: `{ "error": "motivo..." }`

## Proteção SSRF Aplicada

A Netlify Function roda na AWS e precisa ser protegida contra DNS Rebinding e Server-Side Request Forgery.
Utilizamos `node:dns` para resolver o hostname antes do `fetch`. Qualquer IP que caia em blocos CIDR privados ou reservados (ex: 127.0.0.x, 10.x.x.x, 192.168.x.x) tem a conexão sumariamente abortada com HTTP 403.

## Estratégia de Fallback e Prioridade

O frontend do Hubly (`SiteCard.jsx`) adota o seguinte funil de prioridade na renderização:

1. **Custom Icon**: Inserido manualmente pelo usuário.
2. **Neon DB Cache**: Se o domínio já teve seu favicon resolvido pela nuvem.
3. **Local Transient Cache**: `localStorage` (7-day TTL) para poupar as Netlify Functions em _reloads_ subsequentes ou imports em massa sem token.
4. **Resolvedor Serverless**: Scraper varre o HTML/Manifest do site em busca da melhor resolução.
5. **Fallbacks Legados**: Google S2 e fallback root absoluto (`/favicon.ico`).
6. **Placeholder Visual**: Letra inicial baseada na string de nome do site.

## Otimizações de Scraper

Para poupar memória (GB-s) na Netlify Function e otimizar tempo de resposta:

1. **Leitura via Stream**: O download do HTML alvo é feito via Chunk Streams e é abortado (Early Abort) no exato momento que a tag `</head>` é encontrada ou 150KB são transferidos.
2. **Curto-Circuito (PWA)**: Manifests `manifest.json` só são lidos e parseados caso o scraper não encontre um `.svg`, `apple-touch-icon` ou ícone nativo `> 144px` declarado diretamente no DOM.

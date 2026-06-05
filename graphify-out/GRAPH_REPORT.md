# Graph Report - hubly  (2026-06-05)

## Corpus Check
- 56 files · ~286,845 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 245 nodes · 307 edges · 28 communities (25 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae824d5c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 33|Community 33]]

## God Nodes (most connected - your core abstractions)
1. `🚀 Hubly` - 26 edges
2. `useStore` - 20 edges
3. `📦 Responsabilidades por pasta` - 11 edges
4. `SiteCard()` - 8 edges
5. `AGENTS.md — Hubly` - 8 edges
6. `Padrões de Código` - 7 edges
7. `isLocalDomain()` - 6 edges
8. `scripts` - 5 edges
9. `getDomain()` - 5 edges
10. `handler()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `BottomSection()` --calls--> `useStore`  [EXTRACTED]
  src/components/BottomSection.jsx → src/store/useStore.js
- `NewsFeed()` --calls--> `useStore`  [EXTRACTED]
  src/components/NewsFeed.jsx → src/store/useStore.js
- `SearchBar()` --calls--> `useStore`  [EXTRACTED]
  src/components/SearchBar.jsx → src/store/useStore.js
- `SiteGrid()` --calls--> `useStore`  [EXTRACTED]
  src/components/SiteGrid.jsx → src/store/useStore.js
- `App()` --calls--> `useStore`  [EXTRACTED]
  src/App.jsx → src/store/useStore.js

## Communities (28 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.25
Nodes (12): getAvatarColor(), getProxiedUrl(), SiteCard(), SiteGrid(), getCachedFavicon(), queue, resolverFavicon(), setCachedFavicon() (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (12): SearchBar(), defaultFutebolCampeonatos, searchProviders, decrypt(), encrypt(), carregarFaviconsDb(), deletarFaviconDb(), salvarFaviconDb() (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.70
Nodes (4): extractIcons(), getBestIcon(), handler(), isPrivateIP()

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (7): diretorioBase, diretoriosIgnorados, __dirname, extensoesAlvo, __filename, gerarHash(), processarUrl()

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (25): AddSiteModal(), AIChatModal(), CategoryFilter(), categoryLabels, days, months, ConfirmModal(), FloatingMenu() (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (7): BottomSection(), tabs, gnewsTopics, NewsFeed(), rssFeeds, NoticiasFutebol(), useNoticiasFutebol()

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (32): 1. Persistência local, 2. Persistência remota opcional, 🏗️ Arquitetura, 🌐 Backend serverless, 🐘 Banco de dados, 📝 Bloco de notas, 🏗️ Build, 🌦️ Clima (+24 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (22): dependencies, cheerio, crypto-js, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, lucide-react, @neondatabase/serverless (+14 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (14): AGENTS.md — Hubly, APIs Externas (client-side), Checklist ao Alterar Código, Comandos, Componentes Principais, Dados Padrão (`src/utils/storage.js`), Estado (Zustand), Estrutura de Diretórios (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (11): `docs/sql/`, `netlify/functions/`, 📦 Responsabilidades por pasta, `src/`, `src/App.jsx`, `src/components/`, `src/hooks/`, `src/main.jsx` (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (8): devDependencies, autoprefixer, postcss, tailwindcss, @types/react, @types/react-dom, vite, @vitejs/plugin-react

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (4): Meta Commands, RTK - Rust Token Killer (Google Antigravity), Rule, Why

## Knowledge Gaps
- **108 isolated node(s):** `dataReferencia`, `jogos`, `name`, `private`, `version` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useStore` connect `Community 4` to `Community 0`, `Community 1`, `Community 5`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `🚀 Hubly` connect `Community 7` to `Community 16`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `📦 Responsabilidades por pasta` connect `Community 16` to `Community 7`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `dataReferencia`, `jogos`, `name` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.05990338164251208 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
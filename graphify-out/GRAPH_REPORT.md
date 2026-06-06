# Graph Report - hubly  (2026-06-06)

## Corpus Check
- 72 files · ~289,609 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 310 nodes · 363 edges · 38 communities (32 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9143db6c`
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
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 33|Community 33]]

## God Nodes (most connected - your core abstractions)
1. `🚀 Hubly` - 26 edges
2. `useStore` - 20 edges
3. `📦 Responsabilidades por pasta` - 11 edges
4. `SiteCard()` - 8 edges
5. `AGENTS.md — Hubly` - 8 edges
6. `Dodo Starter Pack - Manifesto Anti-Vibe Coding` - 8 edges
7. `rules` - 7 edges
8. `Padrões de Código` - 7 edges
9. `isLocalDomain()` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `BottomSection()` --calls--> `useStore`  [EXTRACTED]
  src/components/BottomSection.jsx → src/store/useStore.js
- `NewsFeed()` --calls--> `useStore`  [EXTRACTED]
  src/components/NewsFeed.jsx → src/store/useStore.js
- `SiteGrid()` --calls--> `useStore`  [EXTRACTED]
  src/components/SiteGrid.jsx → src/store/useStore.js
- `App()` --calls--> `useStore`  [EXTRACTED]
  src/App.jsx → src/store/useStore.js
- `AddSiteModal()` --calls--> `useStore`  [EXTRACTED]
  src/components/AddSiteModal.jsx → src/store/useStore.js

## Communities (38 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.25
Nodes (12): getAvatarColor(), getProxiedUrl(), SiteCard(), SiteGrid(), getCachedFavicon(), queue, resolverFavicon(), setCachedFavicon() (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (15): env, browser, es2021, node, extends, parserOptions, ecmaVersion, sourceType (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.70
Nodes (4): extractIcons(), getBestIcon(), handler(), isPrivateIP()

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (7): diretorioBase, diretoriosIgnorados, __dirname, extensoesAlvo, __filename, gerarHash(), processarUrl()

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (37): AddSiteModal(), AIChatModal(), CategoryFilter(), categoryLabels, days, months, ConfirmModal(), FloatingMenu() (+29 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (7): BottomSection(), tabs, gnewsTopics, NewsFeed(), rssFeeds, NoticiasFutebol(), useNoticiasFutebol()

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (32): 1. Persistência local, 2. Persistência remota opcional, 🏗️ Arquitetura, 🌐 Backend serverless, 🐘 Banco de dados, 📝 Bloco de notas, 🏗️ Build, 🌦️ Clima (+24 more)

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (30): dependencies, cheerio, crypto-js, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, lucide-react, @neondatabase/serverless (+22 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (14): AGENTS.md — Hubly, APIs Externas (client-side), Checklist ao Alterar Código, Comandos, Componentes Principais, Dados Padrão (`src/utils/storage.js`), Estado (Zustand), Estrutura de Diretórios (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (11): `docs/sql/`, `netlify/functions/`, 📦 Responsabilidades por pasta, `src/`, `src/App.jsx`, `src/components/`, `src/hooks/`, `src/main.jsx` (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.20
Nodes (9): 🧠 A Lei da Memória Virtual (ID-Based), Fase 1: Discuss & Diagnose (A Regra do Mago Acadêmico), Fase 2: Plan & Develop (O Planejamento Checklist), Fase 3: Execute & Deliver (Execução Atômica e Testabilidade), Fase 4: Verify & Commit (UAT e Auditoria de Mutação), 🚀 Fluxo GSD (Get Shit Done) 4-D & Protocolo de Memória, O Arquivo `resumo-de-trabalho.md`, 🏛️ O Fluxo GSD 4-D em Quatro Etapas (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (4): Meta Commands, RTK - Rust Token Killer (Google Antigravity), Rule, Why

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (8): Comandos Essenciais, Dodo Starter Pack - Manifesto Anti-Vibe Coding, Estrutura de Dominio Recomendada, Referencia Cruzada, Regras Globais, Regras Inegociaveis (Anti-Vibe Coding), Setup Obrigatorio (Primeira Execucao), Stack do Projeto

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (7): 1. Camada de Filtro (Precision Search), 2. Camada de Scan (Linhas Imediatas), 3. Camada de Deep Dive (Leitura Seletiva), 🏎️ O Protocolo de Busca Cirúrgica em 3 Camadas, 🛡️ Prefixo RTK Obrigatório no Terminal, ⚡ RTK (Rust Token Killer) Mindset — Eficiência de Tokens, 🔇 Supressão de Ruído no Terminal

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (6): Garante que segredos reais sejam casados pelas regexes de segurança., Valida se caminhos protegidos e secretos são interceptados de forma correta., Valida se o formato Conventional Commit + ID de Observação é rigidamente exigido, test_commit_msg_validation(), test_pre_commit_protected_paths(), test_pre_commit_secret_detection()

### Community 25 - "Community 25"
Cohesion: 0.70
Nodes (4): get_staged_files(), main(), run_quality_checks(), scan_file()

## Knowledge Gaps
- **141 isolated node(s):** `browser`, `es2021`, `node`, `extends`, `ecmaVersion` (+136 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useStore` connect `Community 4` to `Community 0`, `Community 5`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `🚀 Hubly` connect `Community 7` to `Community 16`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `📦 Responsabilidades por pasta` connect `Community 16` to `Community 7`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _144 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.052403846153846155 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
# Plano de Implementação — Hubly Futebol (Netlify-First)

## Objetivo

Adicionar uma experiência de futebol no Hubly com duas áreas principais, garantindo funcionamento **100% compatível com Netlify**:

1. **Guia "Notícias Futebol"**
   - Consome um **RSS editorial**
   - Fonte inicial: **GE Futebol**
   - Exibe manchetes recentes com link, data, fonte e imagem quando disponível

2. **Bloco "Jogos Hoje"**
   - Consome uma **API de partidas**
   - Prioridade para solução **grátis ou freemium**
   - Exibe jogos do dia com horário, times, status, competição e placar quando disponível

---

# Diretriz principal

A implementação deve ser pensada desde o início para rodar em **Netlify**, usando:

- **Frontend SPA**
- **Netlify Functions** como backend intermediário
- **Variáveis de ambiente do Netlify**
- **Sem chaves expostas no frontend**
- **Sem dependência de recursos que não funcionem em ambiente serverless**

---

# Objetivos funcionais

## 1. Notícias Futebol
### Requisitos
- Criar nova guia chamada `Futebol`
- Consumir RSS do GE Futebol
- Exibir:
  - título
  - link
  - data de publicação
  - fonte
  - imagem, se existir
- Limitar quantidade inicial de itens
- Loading
- Estado vazio
- Tratamento de erro

## 2. Jogos Hoje
### Requisitos
- Criar bloco `Jogos Hoje`
- Exibir:
  - campeonato
  - horário
  - mandante
  - visitante
  - escudos, se houver
  - status do jogo
  - placar, se houver
- Ordenação:
  1. Ao vivo
  2. Agendados de hoje
  3. Encerrados
- Loading
- Estado vazio
- Tratamento de erro

---

# Decisão de fontes

## Notícias
### Fonte principal
- **RSS do GE Futebol**

### Motivo
- Forte cobertura de futebol no Brasil
- Conteúdo editorial adequado para a guia de notícias
- Boa aderência ao objetivo do Hubly

---

## Jogos
### Opção principal
- **API-Football**

### Motivo
- Boa cobertura de futebol
- Estrutura madura
- Dados de partida mais completos
- Melhor chance de suportar bem cenário Brasil

### Observação
Mesmo sendo freemium, ela deve ser consumida **somente pelo backend**, nunca pelo frontend.

### Fallback futuro
- **TheSportsDB**

### Motivo
- Pode servir como plano B
- Útil caso a limitação do plano principal vire problema

---

# Regra arquitetural

## Separação obrigatória
- **RSS** para notícias
- **API** para jogos

## Motivo
RSS resolve melhor:
- manchete
- link
- data
- conteúdo editorial

API resolve melhor:
- partidas
- status
- placar
- campeonato
- ordenação
- horário
- escudos

---

# Arquitetura proposta

## Frontend
Responsável por:
- renderizar a guia Futebol
- exibir notícias
- exibir jogos
- tratar loading, erro e vazio
- manter UX consistente com o Hubly

## Netlify Functions
Responsável por:
- buscar RSS
- converter XML para JSON
- buscar API de jogos
- normalizar resposta
- aplicar cache
- proteger chaves
- reduzir CORS
- filtrar e ordenar dados

---

# Regras específicas para Netlify

## 1. Nada de chave no frontend
Toda chamada para API de jogos deve passar por função serverless.

### Correto
Frontend chama:
- `/.netlify/functions/futebol-jogos`

Função chama:
- API externa de futebol

### Errado
Frontend chamando diretamente:
- API-Football
- qualquer URL com chave exposta

---

## 2. RSS também deve passar por function
Mesmo sendo feed público, é melhor consumir RSS via function.

### Motivos
- evita CORS
- padroniza payload
- centraliza parsing
- facilita cache
- facilita trocar fonte depois

---

## 3. Funções devem ser leves
Como Netlify Functions possuem limitações de tempo e ambiente, a função deve:
- fazer apenas o necessário
- evitar dependências pesadas
- evitar processamento excessivo
- retornar JSON simples
- aplicar timeout nas chamadas externas

---

## 4. Cache obrigatório
Para evitar limites de API e melhorar tempo de resposta, implementar cache lógico.

### Notícias RSS
- cache curto: 5 a 15 minutos

### Jogos Hoje
- cache curto: 5 a 15 minutos para MVP
- se evoluir para foco em ao vivo, reavaliar cache menor no futuro

---

## 5. Tolerância a falhas
Se a fonte externa falhar:
- a function deve retornar erro controlado
- o frontend deve exibir estado amigável
- a home não pode quebrar

---

# Estrutura sugerida de arquivos

```txt
src/
  components/
    futebol/
      FutebolWidget.jsx
      NoticiasFutebol.jsx
      JogosHoje.jsx
      CardNoticiaFutebol.jsx
      CardJogoHoje.jsx
      EstadoVazioFutebol.jsx
      EstadoErroFutebol.jsx
      LoadingFutebol.jsx

  hooks/
    useNoticiasFutebol.js
    useJogosHoje.js

  services/
    futebol/
      buscarNoticiasFutebol.js
      buscarJogosHoje.js
      normalizarNoticias.js
      normalizarJogos.js

  utils/
    futebol/
      formatarDataNoticia.js
      formatarDataJogo.js
      formatarStatusJogo.js
      ordenarJogos.js

netlify/
  functions/
    futebol-noticias.js
    futebol-jogos.js
```

---

# Contrato interno de dados

## Notícias
Toda fonte RSS deve ser convertida para este formato:

```js
{
  itens: [
    {
      id: "string-unico",
      titulo: "Título da notícia",
      link: "https://...",
      dataPublicacao: "2026-04-23T10:30:00Z",
      fonte: "GE Futebol",
      imagem: "https://..." || null,
      resumo: "..." || null
    }
  ]
}
```

## Jogos
Toda API externa deve ser convertida para este formato:

```js
{
  dataReferencia: "2026-04-23",
  jogos: [
    {
      id: "jogo-001",
      campeonato: "Brasileirão Série A",
      rodada: "Rodada 5",
      horario: "19:00",
      status: "agendado",
      minuto: null,
      mandante: {
        nome: "Grêmio",
        escudo: "https://..." || null
      },
      visitante: {
        nome: "Internacional",
        escudo: "https://..." || null
      },
      placar: {
        mandante: null,
        visitante: null
      }
    }
  ]
}
```

---

# Fases de implementação

## Fase 1 — Mapeamento do ponto de encaixe no Hubly
### Objetivo
Entender onde a nova guia Futebol entra na UI atual sem quebrar a arquitetura existente.

### Tarefas
- localizar onde as guias/widgets atuais são renderizados
- identificar padrão de layout, cards e hooks
- definir se `Jogos Hoje` fica:
  - dentro da guia Futebol
  - ou como seção destacada dentro da mesma guia
- mapear como o tema atual afeta novos componentes

### Critérios de aceite
- ponto de integração identificado
- padrão visual conhecido
- sem duplicação desnecessária de lógica

---

## Fase 2 — Implementar function de notícias RSS
### Objetivo
Criar pipeline seguro e estável para notícias de futebol.

### Arquivo
- `netlify/functions/futebol-noticias.js`

### Responsabilidades
- buscar RSS do GE Futebol
- aplicar timeout
- converter XML para JSON
- mapear apenas os campos necessários
- limitar quantidade de itens
- retornar payload padronizado
- tratar erros de rede ou parsing

### Regras Netlify
- evitar libs muito pesadas
- resposta rápida
- saída JSON simples
- headers corretos

### Critérios de aceite
- function responde corretamente no ambiente local e Netlify
- sem CORS no frontend
- notícias padronizadas e consumíveis

---

## Fase 3 — Criar frontend de notícias
### Objetivo
Exibir notícias de forma limpa e compatível com o design do Hubly.

### Componentes
- `NoticiasFutebol.jsx`
- `CardNoticiaFutebol.jsx`
- `LoadingFutebol.jsx`
- `EstadoErroFutebol.jsx`
- `EstadoVazioFutebol.jsx`

### Hook
- `useNoticiasFutebol.js`

### Regras
- buscar dados da function interna
- exibir loading
- exibir fallback em erro
- exibir data formatada
- abrir link em nova aba
- tratar ausência de imagem

### Critérios de aceite
- UI estável
- sem quebra visual em textos longos
- consistente com tema atual

---

## Fase 4 — Implementar function de jogos
### Objetivo
Criar endpoint interno para partidas do dia com base em API externa.

### Arquivo
- `netlify/functions/futebol-jogos.js`

### Responsabilidades
- consumir API-Football
- usar chave apenas via env
- aplicar timeout
- filtrar jogos relevantes
- normalizar resposta
- ordenar dados
- tratar erros
- retornar contrato interno do Hubly

### Regra crítica
O frontend não deve conhecer a estrutura bruta da API externa.

### Critérios de aceite
- function responde com payload estável
- chave protegida
- resposta padronizada
- fácil troca futura de fornecedor

---

## Fase 5 — Criar frontend de Jogos Hoje
### Objetivo
Exibir partidas do dia com boa legibilidade e hierarquia visual.

### Componentes
- `JogosHoje.jsx`
- `CardJogoHoje.jsx`

### Hook
- `useJogosHoje.js`

### Regras de exibição
- mostrar ao vivo primeiro
- depois jogos agendados
- depois encerrados
- centro do card mostra:
  - placar, se existir
  - senão horário
- mostrar campeonato em subtítulo
- suportar ausência de escudo sem quebrar layout

### Status suportados
- `agendado`
- `ao_vivo`
- `intervalo`
- `encerrado`
- `adiado`

### Critérios de aceite
- leitura rápida
- layout compacto
- comportamento consistente em mobile e desktop

---

## Fase 6 — Integrar guia Futebol
### Objetivo
Unificar notícias e jogos em uma única experiência.

### Estrutura sugerida
Dentro da guia Futebol:

1. Cabeçalho da seção
2. Lista de notícias
3. Bloco Jogos Hoje

### Regras
- preservar visual do Hubly
- evitar poluição
- manter hierarquia clara
- responsividade obrigatória

### Critérios de aceite
- integração fluida com o restante da home
- sem desalinhamentos
- guia utilizável em todas as larguras previstas

---

## Fase 7 — Cache, performance e resiliência
### Objetivo
Garantir bom comportamento no Netlify e evitar rate limit.

### Estratégia
- aplicar cache no nível da function quando possível
- minimizar chamadas repetidas
- tratar timeout
- retornar fallback seguro

### Proteções
- não deixar erro da fonte quebrar a página
- tratar campos ausentes
- prevenir lentidão excessiva

### Critérios de aceite
- função continua estável em produção
- chamadas externas reduzidas
- resposta rápida o suficiente para uso real

---

## Fase 8 — Variáveis de ambiente e deploy
### Objetivo
Garantir deploy funcional no Netlify.

### Variáveis esperadas
```env
API_FOOTBALL_KEY=xxxxx
API_FOOTBALL_BASE_URL=https://...
GE_FUTEBOL_RSS_URL=https://...
```

### Tarefas
- cadastrar env vars no painel do Netlify
- garantir que nenhuma chave vá para `import.meta.env` no frontend
- validar build
- validar functions publicadas
- validar rotas das functions em produção

### Critérios de aceite
- deploy sobe sem falha
- functions acessíveis em produção
- segredo não aparece no bundle

---

## Fase 9 — Testes
### Objetivo
Validar cenários principais e de falha.

## Testes de notícias
- RSS responde normalmente
- RSS vazio
- RSS sem imagem
- RSS com item sem data
- erro de rede

## Testes de jogos
- lista de jogos do dia
- jogo ao vivo
- jogo encerrado
- jogo sem escudo
- resposta vazia
- erro da API
- chave inválida ou indisponível

## Testes visuais
- desktop
- mobile
- tema claro
- tema escuro
- títulos longos
- nomes longos de clubes

## Testes Netlify
- function de notícias responde em produção
- function de jogos responde em produção
- env vars disponíveis
- sem CORS
- sem erro 500 silencioso

### Critérios de aceite
- fluxo principal funcionando
- falhas tratadas
- deploy confiável

---

# Ordem recomendada de execução

1. Mapear encaixe da guia Futebol na UI atual
2. Definir contrato interno de dados
3. Criar `futebol-noticias.js`
4. Criar hook e UI de notícias
5. Criar `futebol-jogos.js`
6. Criar hook e UI de jogos
7. Integrar na guia Futebol
8. Aplicar cache e timeout
9. Configurar env vars no Netlify
10. Validar deploy
11. Testar cenários de erro
12. Ajustar UX final

---

# Regras de implementação

## Não fazer
- não chamar API externa direto do frontend
- não expor chave em código cliente
- não confiar em payload bruto de terceiros
- não acoplar componente visual à estrutura da API externa

## Fazer
- usar functions como camada adaptadora
- padronizar resposta
- isolar parsing
- tratar falhas de forma defensiva
- preparar troca futura de fornecedor

---

# MVP recomendado

## Notícias
- manchetes do GE Futebol
- título
- data
- link
- imagem opcional

## Jogos
- jogos do dia
- nomes dos times
- horário ou placar
- status
- campeonato

## Fica fora do MVP
- classificação
- estatísticas detalhadas
- escalação
- eventos minuto a minuto
- favoritos por time
- múltiplas fontes simultâneas

---

# Evoluções futuras

## Notícias
- múltiplas fontes
- deduplicação
- filtro por clube
- destaque principal

## Jogos
- jogos de amanhã
- resultados recentes
- favoritos por clube
- separação por campeonato
- atualização mais frequente para ao vivo
- classificação e tabela

---

# Riscos conhecidos

## 1. RSS mudar estrutura
### Mitigação
- parsing tolerante
- campos opcionais
- fallback defensivo

## 2. Limite da API externa
### Mitigação
- cache
- timeout
- fallback futuro
- backend intermediário

## 3. Latência em function
### Mitigação
- resposta enxuta
- evitar dependências pesadas
- reduzir processamento

## 4. Timezone inconsistente
### Mitigação
- padronizar exibição para Brasil
- usar utilitário central de formatação

## 5. Layout quebrar com nomes grandes
### Mitigação
- truncamento elegante
- testes reais com clubes brasileiros

---

# Checklist final

- [ ] Guia Futebol criada
- [ ] Function de notícias criada
- [ ] RSS convertido em JSON padronizado
- [ ] Notícias renderizadas corretamente
- [ ] Function de jogos criada
- [ ] API convertida em JSON padronizado
- [ ] Jogos Hoje renderizado
- [ ] Loading, erro e vazio cobertos
- [ ] Cache aplicado
- [ ] Timeout aplicado
- [ ] Env vars configuradas no Netlify
- [ ] Sem segredo exposto no frontend
- [ ] Deploy validado em produção
- [ ] Responsividade validada
- [ ] Testes mínimos executados

---


---

# Configurabilidade via Settings

## Diretriz adicional
Sempre que possível, a implementação deve permitir trocar:

- a **fonte de RSS das notícias**
- a **fonte/API dos jogos**

diretamente pelas **configurações do Hubly**, sem exigir refatoração do frontend.

## Objetivo
Evitar acoplamento rígido com:
- GE Futebol
- API-Football

Essas serão as fontes iniciais recomendadas, mas a arquitetura deve nascer preparada para substituição futura.

---

## Requisitos de configuração

### Notícias
Permitir definir nas configurações:
- nome da fonte RSS
- URL do feed RSS ativo
- quantidade máxima de notícias
- habilitar/desabilitar exibição de imagem

### Jogos
Permitir definir nas configurações:
- provedor da API de jogos
- campeonato/escopo padrão, quando aplicável
- quantidade máxima de jogos exibidos
- habilitar/desabilitar exibição de escudos
- modo de ordenação, se necessário no futuro

---

## Regra arquitetural obrigatória

A camada visual nunca deve depender diretamente de:
- URL fixa do RSS
- nome fixo da API
- schema bruto de fornecedor externo

Em vez disso, deve existir:

1. **Configuração ativa**
2. **Camada adaptadora**
3. **Contrato interno único**

---

## Estratégia recomendada

### 1. Criar configuração central de futebol
Exemplo de estrutura:

```js
{
  noticias: {
    fonteAtiva: "ge_futebol",
    limite: 8,
    mostrarImagem: true
  },
  jogos: {
    provedorAtivo: "api_football",
    limite: 10,
    mostrarEscudos: true
  }
}
```

### 2. Criar catálogo de provedores
Separar um catálogo interno com metadados dos provedores disponíveis.

#### Exemplo conceitual
```js
const provedoresNoticias = {
  ge_futebol: {
    nome: "GE Futebol",
    tipo: "rss",
    url: "https://..."
  },
  outra_fonte: {
    nome: "Outra Fonte",
    tipo: "rss",
    url: "https://..."
  }
};

const provedoresJogos = {
  api_football: {
    nome: "API-Football",
    tipo: "api"
  },
  the_sports_db: {
    nome: "TheSportsDB",
    tipo: "api"
  }
};
```

### 3. Function deve receber ou resolver a fonte ativa
As Netlify Functions podem:
- ler a configuração salva do usuário
- ou receber parâmetros controlados do frontend
- ou usar defaults internos quando não houver customização

### 4. Normalização obrigatória
Mesmo trocando a fonte:
- o retorno de notícias continua no mesmo formato interno
- o retorno de jogos continua no mesmo formato interno

---

## Requisitos de UI nas configurações

### Seção nova nas configurações
Adicionar uma área como:
- `Configurações > Futebol`

### Campos sugeridos
#### Notícias
- seletor de fonte RSS
- campo opcional de URL customizada
- limite de notícias
- toggle para imagem

#### Jogos
- seletor de provedor da API
- limite de jogos
- toggle para escudos
- futuros filtros por competição/time

---

## Regras de segurança para Netlify

### RSS customizado
Se for permitido inserir URL manual:
- validar formato da URL
- validar protocolo seguro quando possível
- tratar timeout
- bloquear payloads inválidos
- evitar confiar cegamente em XML arbitrário

### API customizada
Se houver troca de provedor:
- nunca expor chave no frontend
- manter segredo apenas nas Functions
- cada provedor precisa ter adaptador próprio
- não permitir que o frontend monte URL arbitrária com segredo

---

## Requisitos de persistência

A escolha da fonte deve ser persistida no mesmo padrão de configuração já usado pelo Hubly.

### Persistir ao menos
- fonte RSS ativa
- provedor ativo de jogos
- limites visuais
- toggles de exibição

### Critério
Ao recarregar a home:
- a configuração deve ser reaplicada automaticamente

---

## Fase adicional — Configurações dinâmicas de Futebol

### Objetivo
Permitir troca futura de fontes sem alterar a UI principal.

### Tarefas
- criar estrutura de config para futebol
- criar catálogo de provedores suportados
- ligar configurações à leitura do widget
- persistir escolha do usuário
- adicionar fallback para fonte padrão

### Critérios de aceite
- usuário consegue trocar fonte RSS via settings
- usuário consegue trocar provedor de jogos via settings
- UI principal continua igual
- functions continuam seguras no Netlify
- troca de provedor não exige mexer em card, hook ou layout

---

## Ordem recomendada com configurabilidade

1. Mapear encaixe da guia Futebol
2. Definir contrato interno
3. Criar catálogo de provedores
4. Criar config persistida de futebol
5. Criar function de notícias
6. Criar UI de notícias
7. Criar function de jogos
8. Criar UI de jogos
9. Criar tela/área de configurações
10. Ligar settings às functions e hooks
11. Validar fallback padrão
12. Validar deploy no Netlify

---

## MVP da configurabilidade

### Notícias
- seletor de fonte RSS entre opções pré-cadastradas
- opcionalmente URL manual em fase posterior

### Jogos
- seletor de provedor entre opções pré-cadastradas
- fallback interno para provedor principal

### Recomendação
No MVP:
- permitir troca por **lista controlada**
- evitar inicialmente URL/API totalmente arbitrária
- isso reduz risco, simplifica validação e mantém compatibilidade com Netlify

---

## Decisão final ampliada

A implementação deve começar com:
- **GE Futebol** para notícias
- **API-Football** para jogos

Mas a arquitetura deve permitir, pelas configurações:
- trocar o RSS ativo
- trocar o provedor de jogos
- ajustar limites e opções visuais

Sem alterar:
- layout principal
- contrato de dados interno
- componentes visuais já criados

# Decisão final recomendada

## Notícias
- **RSS do GE Futebol**

## Jogos
- **API-Football**
- fallback futuro: **TheSportsDB**

## Arquitetura
- frontend consome apenas Netlify Functions
- functions normalizam todas as fontes externas
- contrato interno único para o Hubly
- implementação pensada para rodar corretamente em produção no Netlify

# Manual de Estrutura RSS — Futebol ao Vivo

![Status](https://img.shields.io/badge/status-active-success)
![Fonte](https://img.shields.io/badge/fonte-ogol.com.br-blue)
![Formato](https://img.shields.io/badge/formato-RSS%202.0-orange)

Manual técnico para leitura, normalização e uso dos feeds RSS do **ogol.com.br** na tela de futebol ao vivo.

> Objetivo: substituir a antiga API por feeds RSS, mantendo uma estrutura previsível para frontend, backend/proxy e camada de cache.

---

## Fontes RSS

| Tipo             | Endpoint                                     | Finalidade                   |
| ---------------- | -------------------------------------------- | ---------------------------- |
| Próximos jogos   | `https://www.ogol.com.br/rss/proxjogos.php`  | Lista partidas futuras       |
| Jogos realizados | `https://www.ogol.com.br/rss/resultados.php` | Lista partidas com resultado |

---

## Estrutura base do RSS

Os dois feeds usam RSS 2.0 com namespaces adicionais:

```xml
<rss
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  version="2.0"
>
  <channel>
    <atom:link />
    <title></title>
    <link></link>
    <description></description>
    <language></language>

    <item>
      ...
    </item>
  </channel>
</rss>
```

---

## Estrutura do canal

### Próximos jogos

```xml
<title>Próximos Jogos ogol.com.br</title>
<link>https://www.ogol.com.br/</link>
<description>Próximos Jogos</description>
<language>br-br</language>
```

### Jogos realizados

```xml
<title>Resultados ogol.com.br</title>
<link>https://www.ogol.com.br/</link>
<description>Resultados</description>
<language>br-br</language>
```

---

## Campos comuns por item

| Campo XML     |                Tipo | Obrigatório | Uso recomendado                           |
| ------------- | ------------------: | ----------: | ----------------------------------------- |
| `title`       |              string |         Sim | Nome do jogo ou jogo com placar           |
| `guid`        |          string URL |         Sim | ID único principal                        |
| `link`        |          string URL |         Sim | Link da página do jogo                    |
| `description` |   string HTML/CDATA |         Sim | Dados extras: data, liga, TV, local, gols |
| `dc:subject`  |              string |         Sim | Nome normalizado da liga/competição       |
| `dc:creator`  |              string |         Sim | Origem do item                            |
| `dc:date`     | string ISO ou vazio |     Parcial | Data limpa quando disponível              |

---

## Diferença entre os feeds

| Recurso          | Próximos jogos    | Jogos realizados                |
| ---------------- | ----------------- | ------------------------------- |
| `title`          | `Time A - Time B` | `Time A 1-0 Time B`             |
| Placar no título | Não               | Sim                             |
| `dc:date`        | Preenchido        | Vazio                           |
| Data confiável   | `dc:date`         | Primeira linha da `description` |
| TV               | Pode existir      | Normalmente não aparece         |
| Gols             | Não aparece       | Pode aparecer em `description`  |
| Local            | Pode existir      | Pode existir                    |
| Liga oficial     | `dc:subject`      | `dc:subject`                    |

---

# Próximos jogos

Endpoint:

```txt
https://www.ogol.com.br/rss/proxjogos.php
```

## Exemplo real

```xml
<item>
  <title><![CDATA[ Liverpool - Crystal Palace ]]></title>
  <guid>https://www.ogol.com.br/jogo.php?id=11047798</guid>
  <link>https://www.ogol.com.br/jogo.php?id=11047798</link>
  <description><![CDATA[
    2026-04-25 15:00:00<br/>
    <b>Premier League</b><br />
    <b>TV:</b> X Sports<br />
    <b>Local:</b> Liverpool<br />
  ]]></description>
  <dc:subject>Premier League</dc:subject>
  <dc:creator>ogol.com.br</dc:creator>
  <dc:date>2026-04-25T15:00+00:00</dc:date>
</item>
```

## Campos confiáveis

| Campo normalizado | Origem        | Observação                           |
| ----------------- | ------------- | ------------------------------------ |
| `id`              | `guid`        | Melhor identificador                 |
| `titulo`          | `title`       | Texto original                       |
| `timeCasa`        | `title`       | Antes de `-`                         |
| `timeFora`        | `title`       | Depois de `-`                        |
| `liga`            | `dc:subject`  | Campo mais confiável para competição |
| `data`            | `dc:date`     | Campo mais limpo para data           |
| `tv`              | `description` | Opcional                             |
| `local`           | `description` | Opcional                             |
| `link`            | `link`        | Link do jogo                         |
| `origem`          | `dc:creator`  | Geralmente `ogol.com.br`             |

## Modelo normalizado

```js
{
  id: "https://www.ogol.com.br/jogo.php?id=11047798",
  tipo: "proximo",
  titulo: "Liverpool - Crystal Palace",
  timeCasa: "Liverpool",
  timeFora: "Crystal Palace",
  placarCasa: null,
  placarFora: null,
  liga: "Premier League",
  data: "2026-04-25T15:00+00:00",
  tv: "X Sports",
  local: "Liverpool",
  gols: [],
  link: "https://www.ogol.com.br/jogo.php?id=11047798",
  origem: "ogol.com.br"
}
```

---

# Jogos realizados

Endpoint:

```txt
https://www.ogol.com.br/rss/resultados.php
```

## Exemplo real

```xml
<item>
  <title><![CDATA[ FC Augsburg 1-1 Eintracht Frankfurt ]]></title>
  <guid>https://www.ogol.com.br/jogo.php?id=11058126</guid>
  <link>https://www.ogol.com.br/jogo.php?id=11058126</link>
  <description><![CDATA[
    2026-04-25T14:30:00+01:00<br/>
    <b>1. Bundesliga 25/26</b><br />
    <b>Local:</b> Augsburg<br />
    <b>Golos:</b><br />
    Ritsu Doan 66<br />
    Anton Kade 44<br />
  ]]></description>
  <dc:subject>1. Bundesliga</dc:subject>
  <dc:creator>ogol.com.br</dc:creator>
  <dc:date/>
</item>
```

## Campos confiáveis

| Campo normalizado | Origem                          | Observação                           |
| ----------------- | ------------------------------- | ------------------------------------ |
| `id`              | `guid`                          | Melhor identificador                 |
| `titulo`          | `title`                         | Contém times e placar                |
| `timeCasa`        | `title`                         | Precisa de regex                     |
| `timeFora`        | `title`                         | Precisa de regex                     |
| `placarCasa`      | `title`                         | Número antes do hífen do placar      |
| `placarFora`      | `title`                         | Número depois do hífen do placar     |
| `liga`            | `dc:subject`                    | Campo mais confiável para competição |
| `data`            | Primeira linha da `description` | `dc:date` vem vazio                  |
| `local`           | `description`                   | Opcional                             |
| `gols`            | `description`                   | Opcional                             |
| `link`            | `link`                          | Link do jogo                         |
| `origem`          | `dc:creator`                    | Geralmente `ogol.com.br`             |

## Modelo normalizado

```js
{
  id: "https://www.ogol.com.br/jogo.php?id=11058126",
  tipo: "resultado",
  titulo: "FC Augsburg 1-1 Eintracht Frankfurt",
  timeCasa: "FC Augsburg",
  timeFora: "Eintracht Frankfurt",
  placarCasa: 1,
  placarFora: 1,
  liga: "1. Bundesliga",
  data: "2026-04-25T14:30:00+01:00",
  tv: null,
  local: "Augsburg",
  gols: [
    {
      jogador: "Ritsu Doan",
      minuto: 66
    },
    {
      jogador: "Anton Kade",
      minuto: 44
    }
  ],
  link: "https://www.ogol.com.br/jogo.php?id=11058126",
  origem: "ogol.com.br"
}
```

---

## Parsing do título

### Próximos jogos

Formato:

```txt
Time Casa - Time Fora
```

Regex recomendada:

```js
/^(.+?)\s-\s(.+)$/;
```

Resultado:

```js
{
  timeCasa: "Liverpool",
  timeFora: "Crystal Palace"
}
```

---

### Jogos realizados

Formato:

```txt
Time Casa 1-0 Time Fora
```

Regex recomendada:

```js
/^(.+?)\s(\d+)-(\d+)\s(.+)$/;
```

Resultado:

```js
{
  timeCasa: "Fulham",
  placarCasa: 1,
  placarFora: 0,
  timeFora: "Aston Villa"
}
```

---

## Parsing da description

A `description` vem dentro de `CDATA`, mas contém HTML.

### Próximos jogos

Formato comum:

```html
2026-04-25 15:00:00
<br />
<b>Premier League</b>
<br />
<b>TV:</b>
ESPN
<br />
<b>Local:</b>
Wolverhampton
<br />
```

### Jogos realizados

Formato comum:

```html
2026-04-25T14:30:00+01:00
<br />
<b>1. Bundesliga 25/26</b>
<br />
<b>Local:</b>
Augsburg
<br />
<b>Golos:</b>
<br />
Ritsu Doan 66
<br />
Anton Kade 44
<br />
```

---

## Campos extraíveis da description

| Campo           | Regex sugerida                      | Observação                |
| --------------- | ----------------------------------- | ------------------------- |
| Data inicial    | primeira linha antes de `<br`       | Fallback de data          |
| Liga descritiva | primeiro `<b>...</b>` sem `:`       | Usar apenas como fallback |
| TV              | `<b>TV:</b>\s*(.*?)<br`             | Opcional                  |
| Local           | `<b>Local:</b>\s*(.*?)<br`          | Pode vir vazio            |
| Gols/Golos      | conteúdo após `<b>Golos:</b><br />` | Opcional                  |

---

## Regras de prioridade

### ID

```txt
guid > link > hash(title + description)
```

### Liga

```txt
dc:subject > primeira tag <b> sem ":" da description
```

### Data

Para próximos jogos:

```txt
dc:date > primeira linha da description
```

Para resultados:

```txt
primeira linha da description > dc:date
```

Motivo: em resultados, `dc:date` aparece vazio.

### Local

```txt
description Local > null
```

### TV

```txt
description TV > null
```

### Gols

```txt
description Golos > []
```

---

## Função de normalização sugerida

```js
function removerHtml(valor) {
  return String(valor || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function limparValor(valor) {
  const texto = String(valor || '')
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .trim();

  return texto || null;
}

function extrairPrimeiraLinhaDescricao(descricao) {
  const valor = limparValor(descricao);

  if (!valor) {
    return null;
  }

  const partes = valor.split(/<br\s*\/?>/i);
  return limparValor(removerHtml(partes[0]));
}

function extrairCampoHtml(descricao, nomeCampo) {
  const valor = limparValor(descricao);

  if (!valor) {
    return null;
  }

  const regex = new RegExp(`<b>${nomeCampo}:<\\/b>\\s*(.*?)<br`, 'i');
  const encontrado = valor.match(regex);

  if (!encontrado) {
    return null;
  }

  return limparValor(removerHtml(encontrado[1]));
}

function extrairGols(descricao) {
  const valor = limparValor(descricao);

  if (!valor || !valor.includes('<b>Golos:</b>')) {
    return [];
  }

  const bloco = valor.split(/<b>Golos:<\/b>\s*<br\s*\/?>/i)[1];

  if (!bloco) {
    return [];
  }

  return bloco
    .split(/<br\s*\/?>/i)
    .map((linha) => removerHtml(linha))
    .map((linha) => linha.trim())
    .filter(Boolean)
    .map((linha) => {
      const encontrado = linha.match(/^(.+?)\s+(\d+)$/);

      if (!encontrado) {
        return {
          jogador: linha,
          minuto: null,
        };
      }

      return {
        jogador: encontrado[1].trim(),
        minuto: Number(encontrado[2]),
      };
    });
}

function normalizarProximoJogo(item) {
  const titulo = limparValor(item.title);
  const partesTitulo = titulo?.match(/^(.+?)\s-\s(.+)$/);

  return {
    id: limparValor(item.guid) || limparValor(item.link),
    tipo: 'proximo',
    titulo,
    timeCasa: partesTitulo ? partesTitulo[1].trim() : null,
    timeFora: partesTitulo ? partesTitulo[2].trim() : null,
    placarCasa: null,
    placarFora: null,
    liga: limparValor(item['dc:subject']),
    data: limparValor(item['dc:date']) || extrairPrimeiraLinhaDescricao(item.description),
    tv: extrairCampoHtml(item.description, 'TV'),
    local: extrairCampoHtml(item.description, 'Local'),
    gols: [],
    link: limparValor(item.link),
    origem: limparValor(item['dc:creator']) || 'ogol.com.br',
  };
}

function normalizarResultado(item) {
  const titulo = limparValor(item.title);
  const partesTitulo = titulo?.match(/^(.+?)\s(\d+)-(\d+)\s(.+)$/);

  return {
    id: limparValor(item.guid) || limparValor(item.link),
    tipo: 'resultado',
    titulo,
    timeCasa: partesTitulo ? partesTitulo[1].trim() : null,
    timeFora: partesTitulo ? partesTitulo[4].trim() : null,
    placarCasa: partesTitulo ? Number(partesTitulo[2]) : null,
    placarFora: partesTitulo ? Number(partesTitulo[3]) : null,
    liga: limparValor(item['dc:subject']),
    data: extrairPrimeiraLinhaDescricao(item.description) || limparValor(item['dc:date']),
    tv: extrairCampoHtml(item.description, 'TV'),
    local: extrairCampoHtml(item.description, 'Local'),
    gols: extrairGols(item.description),
    link: limparValor(item.link),
    origem: limparValor(item['dc:creator']) || 'ogol.com.br',
  };
}
```

---

## Estrutura JSON final para a aplicação

```js
{
  fonte: "ogol.com.br",
  atualizadoEm: "2026-04-25T00:00:00.000Z",
  proximosJogos: [],
  jogosRealizados: [],
  agrupamentos: {
    porLiga: {},
    porData: {}
  }
}
```

---

## Agrupamento recomendado

### Por liga

```js
function agruparPorLiga(jogos) {
  return jogos.reduce((grupos, jogo) => {
    const liga = jogo.liga || 'Sem liga';

    if (!grupos[liga]) {
      grupos[liga] = [];
    }

    grupos[liga].push(jogo);

    return grupos;
  }, {});
}
```

### Por data

```js
function agruparPorData(jogos) {
  return jogos.reduce((grupos, jogo) => {
    const data = jogo.data ? jogo.data.slice(0, 10) : 'Sem data';

    if (!grupos[data]) {
      grupos[data] = [];
    }

    grupos[data].push(jogo);

    return grupos;
  }, {});
}
```

---

## Cuidados técnicos

### 1. RSS não é JSON

O retorno precisa ser convertido de XML para objeto JavaScript.

### 2. Pode haver bloqueio de CORS

Evitar buscar direto no navegador.

Recomendado:

```txt
Frontend -> Backend/Proxy -> RSS ogol -> JSON normalizado -> Frontend
```

### 3. `description` contém HTML

Nunca renderizar direto sem sanitização.

### 4. `dc:date` não é confiável nos resultados

Nos jogos realizados, ele aparece vazio.

### 5. O feed não traz apenas futebol

Foram encontrados jogos de futsal, handebol, basquete, hóquei e vôlei.

Se a tela for apenas futebol, será necessário criar filtro por liga, por esporte ou por whitelist.

### 6. Existem caracteres possivelmente quebrados

Exemplos vistos:

```txt
Colï¿½nia
Dï¿½cines-Charpieu
```

Recomendado tratar encoding no backend/proxy e manter fallback visual no frontend.

---

## Cache recomendado

| Feed             | Cache recomendado | Motivo                                        |
| ---------------- | ----------------: | --------------------------------------------- |
| Próximos jogos   |    5 a 15 minutos | Dados mudam pouco                             |
| Jogos realizados |     1 a 5 minutos | Resultado pode atualizar com maior frequência |

---

## Checklist de implementação

- [ ] Buscar RSS via backend/proxy
- [ ] Converter XML para objeto
- [ ] Ler `channel`
- [ ] Ler todos os `item`
- [ ] Normalizar próximos jogos
- [ ] Normalizar jogos realizados
- [ ] Extrair times
- [ ] Extrair placar
- [ ] Extrair data
- [ ] Extrair liga por `dc:subject`
- [ ] Extrair TV quando existir
- [ ] Extrair local quando existir
- [ ] Extrair gols quando existir
- [ ] Agrupar por liga
- [ ] Agrupar por data
- [ ] Retornar JSON final para o frontend
- [ ] Aplicar cache
- [ ] Tratar erro de RSS indisponível
- [ ] Tratar item malformado sem quebrar a tela

---

## Commit sugerido

```bash
docs: adiciona manual dos RSS do futebol
```

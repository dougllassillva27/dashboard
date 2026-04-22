-- Script de configuração inicial do banco de dados Neon para o Sol Hub

-- Tabela: solhub_sync
-- Finalidade: Armazenar o blob de sincronização (configurações, sites, categorias)
-- token: Identificador único (Senha Mestra) do "cofre" do usuário
-- data: Objeto JSON contendo todo o estado exportado do frontend
-- updated_at: Registro de data/hora da última sincronização
CREATE TABLE IF NOT EXISTS solhub_sync (
  token VARCHAR(255) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: solhub_favicons
-- Finalidade: Cache persistente de favicons resolvidos para evitar re-resolução e placeholder zoados
-- domain: O domínio do site (ex: google.com), serve como chave única
-- favicon_url: A URL final e validada do ícone (Google S2, icon.horse ou origin)
-- updated_at: Registro de data/hora de quando o ícone foi resolvido/atualizado
CREATE TABLE IF NOT EXISTS solhub_favicons (
  domain TEXT PRIMARY KEY,
  favicon_url TEXT NOT NULL,
-- Script de configuração inicial do banco de dados Neon para o Hubly
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
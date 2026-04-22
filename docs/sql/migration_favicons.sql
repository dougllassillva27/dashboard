-- Migração: tabela de cache de favicons persistidos no Neon DB
-- PK: domain (ex: github.com) — compartilhado entre dispositivos e sites com a mesma URL base
-- Rodar manualmente no console do Neon antes do deploy

CREATE TABLE IF NOT EXISTS solhub_favicons (
  domain        TEXT PRIMARY KEY,
  favicon_url   TEXT NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

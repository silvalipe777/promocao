-- PromoHunt Brasil - Schema do Banco de Dados
-- Execute este SQL no Supabase SQL Editor

-- Habilita a extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de promoções
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    old_price DECIMAL(10, 2),
    discount_percent INTEGER,
    url TEXT NOT NULL,
    image TEXT,
    store TEXT,
    category TEXT,
    source_telegram_group TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT valid_discount CHECK (discount_percent >= 0 AND discount_percent <= 100),
    CONSTRAINT valid_prices CHECK (price IS NULL OR price >= 0)
);

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Garante que um usuário não pode favoritar a mesma promoção duas vezes
    UNIQUE(user_id, promotion_id)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_promotions_created_at ON promotions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_promotions_store ON promotions(store);
CREATE INDEX IF NOT EXISTS idx_promotions_category ON promotions(category);
CREATE INDEX IF NOT EXISTS idx_promotions_price ON promotions(price);
CREATE INDEX IF NOT EXISTS idx_promotions_discount ON promotions(discount_percent DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_promotion_id ON favorites(promotion_id);

-- Índices de texto completo para busca
CREATE INDEX IF NOT EXISTS idx_promotions_title_search ON promotions USING gin(to_tsvector('portuguese', title));
CREATE INDEX IF NOT EXISTS idx_promotions_description_search ON promotions USING gin(to_tsvector('portuguese', description));

-- Row Level Security (RLS)

-- Habilita RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas para promotions
-- Todos podem ler promoções
CREATE POLICY "Promoções são visíveis para todos"
    ON promotions FOR SELECT
    USING (true);

-- Apenas autenticados podem inserir (via service role na API)
CREATE POLICY "Apenas API pode inserir promoções"
    ON promotions FOR INSERT
    WITH CHECK (false);

-- Políticas para favorites
-- Usuários podem ver apenas seus próprios favoritos
CREATE POLICY "Usuários podem ver seus favoritos"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

-- Usuários podem adicionar favoritos
CREATE POLICY "Usuários podem adicionar favoritos"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuários podem remover seus favoritos
CREATE POLICY "Usuários podem remover favoritos"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Função para limpar promoções antigas (opcional)
CREATE OR REPLACE FUNCTION delete_expired_promotions()
RETURNS void AS $$
BEGIN
    DELETE FROM promotions
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o contador de favoritos (opcional, para estatísticas)
CREATE OR REPLACE FUNCTION update_promotion_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Aqui você pode adicionar lógica adicional se quiser manter contadores
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Habilita Realtime para a tabela promotions
ALTER PUBLICATION supabase_realtime ADD TABLE promotions;

-- Comentários nas tabelas
COMMENT ON TABLE promotions IS 'Armazena todas as promoções capturadas do Telegram';
COMMENT ON TABLE favorites IS 'Armazena os favoritos dos usuários';

COMMENT ON COLUMN promotions.title IS 'Título da promoção';
COMMENT ON COLUMN promotions.description IS 'Descrição completa da promoção';
COMMENT ON COLUMN promotions.price IS 'Preço atual do produto';
COMMENT ON COLUMN promotions.old_price IS 'Preço antigo (antes do desconto)';
COMMENT ON COLUMN promotions.discount_percent IS 'Percentual de desconto';
COMMENT ON COLUMN promotions.url IS 'Link para a oferta';
COMMENT ON COLUMN promotions.image IS 'URL da imagem do produto';
COMMENT ON COLUMN promotions.store IS 'Nome da loja (Amazon, Shopee, etc)';
COMMENT ON COLUMN promotions.category IS 'Categoria do produto';
COMMENT ON COLUMN promotions.source_telegram_group IS 'Grupo do Telegram de origem';
COMMENT ON COLUMN promotions.expires_at IS 'Data de expiração da promoção (opcional)';

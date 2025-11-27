-- Tabela de promoções
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  old_price DECIMAL(10,2),
  discount_percent INTEGER,
  url TEXT NOT NULL UNIQUE,
  image TEXT,
  store TEXT,
  category TEXT,
  source_telegram_group TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_promotions_created_at ON public.promotions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_promotions_store ON public.promotions(store);
CREATE INDEX IF NOT EXISTS idx_promotions_category ON public.promotions(category);
CREATE INDEX IF NOT EXISTS idx_promotions_expires_at ON public.promotions(expires_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Política: permitir leitura pública
CREATE POLICY "Permitir leitura pública de promoções"
  ON public.promotions
  FOR SELECT
  USING (true);

-- Política: permitir inserção para usuários autenticados via service_role
CREATE POLICY "Permitir inserção via service_role"
  ON public.promotions
  FOR INSERT
  WITH CHECK (true);

-- Política: permitir atualização via service_role
CREATE POLICY "Permitir atualização via service_role"
  ON public.promotions
  FOR UPDATE
  USING (true);

-- Comentários
COMMENT ON TABLE public.promotions IS 'Tabela de promoções capturadas do Telegram';
COMMENT ON COLUMN public.promotions.title IS 'Título da promoção';
COMMENT ON COLUMN public.promotions.url IS 'URL do produto (chave única)';
COMMENT ON COLUMN public.promotions.source_telegram_group IS 'Nome do grupo do Telegram de origem';

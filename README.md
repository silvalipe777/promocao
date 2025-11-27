# 🔥 PromoHunt Brasil

**Site completo de promoções capturadas automaticamente do Telegram**

Sistema full-stack que monitora grupos e canais do Telegram em tempo real, identifica promoções automaticamente usando IA pattern matching, e exibe tudo em uma interface moderna e responsiva.

## ✨ Funcionalidades

### Frontend (Next.js 14 + React)
- 🎨 Design moderno e responsivo com TailwindCSS
- 🌓 Dark mode e Light mode
- 🔍 Busca em tempo real
- 🏷️ Filtros por loja, categoria e preço
- ⭐ Sistema de favoritos
- 🔔 Notificações push de novas promoções
- ⚡ Atualização em tempo real com Supabase Realtime
- 📱 100% mobile-friendly

### Backend (Telegram Bot + API)
- 🤖 Bot Python com Pyrogram
- 🧠 Parser inteligente de promoções
- 💰 Extração automática de preços e descontos
- 🏪 Identificação de lojas (Shopee, Amazon, Mercado Livre, etc)
- 🏷️ Categorização automática de produtos
- 📸 Captura de imagens
- 🔄 Processamento 24/7
- 🚫 Anti-duplicação

### Database & Auth
- 🗄️ Supabase (PostgreSQL)
- 🔐 Autenticação completa
- 🔒 Row Level Security (RLS)
- ⚡ Realtime subscriptions

---

## 🚀 Setup Completo

### 1. Pré-requisitos

- Node.js 18+ e npm/yarn
- Python 3.9+
- Conta no Supabase (grátis)
- Conta no Telegram

### 2. Clone e Instale Dependências

```bash
# Clone o projeto
cd sitepromocoes

# Instale dependências do Next.js
npm install

# Instale dependências do bot Python
cd telegram_bot
pip install -r requirements.txt
cd ..
```

### 3. Configuração do Supabase

#### 3.1. Crie um projeto no Supabase
1. Acesse https://supabase.com
2. Crie um novo projeto
3. Anote a URL e as chaves de API

#### 3.2. Configure o banco de dados
1. No dashboard do Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo de `supabase/schema.sql`
3. Cole e execute no SQL Editor
4. Verifique se as tabelas foram criadas:
   - `promotions`
   - `favorites`

#### 3.3. Habilite autenticação por email
1. Vá em **Authentication > Providers**
2. Habilite **Email**
3. Configure as URLs de redirect se necessário

#### 3.4. Habilite Realtime
1. Vá em **Database > Replication**
2. Habilite replicação para a tabela `promotions`

### 4. Configuração do Telegram

#### 4.1. Obtenha credenciais da API do Telegram
1. Acesse https://my.telegram.org
2. Faça login com seu número
3. Vá em **API Development Tools**
4. Crie um novo app e anote:
   - `api_id`
   - `api_hash`

#### 4.2. Configure os grupos para monitorar
1. Abra `telegram_bot/main.py`
2. Na variável `MONITORED_GROUPS`, adicione:
   - IDs numéricos dos grupos (ex: `-1001234567890`)
   - Ou usernames (ex: `"promocoesoficiais"`)

**Dica:** Para descobrir o ID de um grupo:
- Adicione o bot `@userinfobot` ao grupo
- Ele mostrará o ID do grupo

### 5. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Telegram Bot
TELEGRAM_API_ID=seu_api_id
TELEGRAM_API_HASH=seu_api_hash
TELEGRAM_PHONE_NUMBER=+5511999999999

# API
API_SECRET_KEY=crie_uma_senha_forte_aqui

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 6. Rodando Localmente

#### Terminal 1 - Next.js
```bash
npm run dev
```
Acesse: http://localhost:3000

#### Terminal 2 - Bot do Telegram
```bash
cd telegram_bot
python main.py
```

**Primeira execução:**
- O Pyrogram pedirá um código de verificação
- Você receberá o código no Telegram
- Cole o código no terminal
- Uma sessão será salva (arquivo `.session`)

---

## 📁 Estrutura do Projeto

```
sitepromocoes/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── promotions/
│   │   │       └── route.ts          # API endpoint
│   │   ├── favoritos/
│   │   │   └── page.tsx              # Página de favoritos
│   │   ├── login/
│   │   │   └── page.tsx              # Login
│   │   ├── promocao/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Promoção individual
│   │   ├── registro/
│   │   │   └── page.tsx              # Registro
│   │   ├── globals.css               # Estilos globais
│   │   ├── layout.tsx                # Layout principal
│   │   └── page.tsx                  # Homepage
│   ├── components/
│   │   ├── AuthProvider.tsx          # Context de autenticação
│   │   ├── FavoriteButton.tsx        # Botão de favorito
│   │   ├── Filter.tsx                # Filtros
│   │   ├── Navbar.tsx                # Barra de navegação
│   │   ├── NotificationPrompt.tsx    # Prompt de notificações
│   │   ├── PromotionCard.tsx         # Card de promoção
│   │   ├── PromotionsList.tsx        # Lista com realtime
│   │   ├── Providers.tsx             # Providers gerais
│   │   ├── ShareButton.tsx           # Botão compartilhar
│   │   └── ThemeProvider.tsx         # Dark/Light mode
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Cliente Supabase
│   │   │   └── server.ts             # Server Supabase
│   │   └── utils.ts                  # Utilitários
│   └── types/
│       └── database.ts               # Types do Supabase
├── telegram_bot/
│   ├── main.py                       # Bot principal
│   ├── requirements.txt              # Dependências Python
│   └── config.example.py             # Exemplo de config
├── supabase/
│   └── schema.sql                    # Schema do banco
├── .env.example                      # Exemplo de variáveis
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 🎯 Como Funciona

### Fluxo de Dados

```
Telegram Groups
      ↓
[Pyrogram Bot] → Parser Inteligente
      ↓
Identifica promoção?
      ↓ (sim)
Extrai: preço, loja, categoria, imagem
      ↓
POST /api/promotions (Next.js API)
      ↓
Salva no Supabase
      ↓
Supabase Realtime notifica clientes
      ↓
Frontend atualiza automaticamente
      ↓
Notificação push (se ativada)
```

### Parser de Promoções

O bot identifica promoções usando:

**Palavras-chave:**
- promoção, oferta, desconto, cupom
- grátis, frete grátis, black friday
- preço histórico, barato, imperdível

**Padrões de preço:**
- `R$ 99,90`
- `por 49.90`
- `89 reais`

**Padrões de desconto:**
- `50% OFF`
- `desconto de 30%`
- `-20%`

**Lojas detectadas:**
- Shopee, Amazon, Mercado Livre
- Aliexpress, Magalu, Americanas
- E mais...

**Categorias automáticas:**
- Eletrônicos, Moda, Casa
- Beleza, Esportes, Games
- Livros, Alimentos

---

## 🌐 Deploy em Produção

### Vercel (Frontend)

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel

# Adicione as variáveis de ambiente no dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - API_SECRET_KEY
# - NEXT_PUBLIC_SITE_URL (sua URL da Vercel)
```

### Bot do Telegram (Servidor)

Você precisa de um servidor que rode 24/7. Opções:

**1. VPS (DigitalOcean, AWS, etc)**
```bash
# No servidor
git clone seu-repositorio
cd sitepromocoes/telegram_bot
pip install -r requirements.txt

# Configure .env
nano .env

# Rode com screen ou tmux
screen -S telegram-bot
python main.py
# Ctrl+A+D para desanexar
```

**2. Railway**
- Conecte seu repositório
- Configure as variáveis de ambiente
- Defina o comando start: `cd telegram_bot && python main.py`

**3. Render**
- Crie um novo Web Service
- Configure Python 3.9+
- Build: `cd telegram_bot && pip install -r requirements.txt`
- Start: `python telegram_bot/main.py`

---

## ⚙️ Configurações Avançadas

### Personalizar o Parser

Edite `telegram_bot/main.py`:

```python
# Adicionar novas lojas
STORE_PATTERNS = {
    'MinhaLoja': r'minhaloja|loja\.com',
    # ...
}

# Adicionar categorias
CATEGORIES = {
    'Tecnologia': r'tech|tecnologia',
    # ...
}

# Ajustar palavras-chave
PROMOTION_KEYWORDS = [
    'sua_palavra',
    # ...
]
```

### Filtrar por valor mínimo

No `telegram_bot/main.py`, adicione validação:

```python
if promotion_data and promotion_data['price']:
    if promotion_data['price'] < 10:  # Ignora abaixo de R$ 10
        return
```

### Webhook ao invés de polling

Modifique a API route para aceitar webhooks do Telegram Bot API.

---

## 🔧 Solução de Problemas

### Bot não está recebendo mensagens
- Verifique se você está nos grupos configurados
- Confirme que `MONITORED_GROUPS` está correto
- Teste deixando a lista vazia para monitorar todos

### Erro de autenticação do Telegram
- Delete o arquivo `.session` e rode novamente
- Verifique se API_ID e API_HASH estão corretos

### Promoções não aparecem no site
- Verifique os logs do bot
- Teste a API manualmente:
```bash
curl -X POST http://localhost:3000/api/promotions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_API_SECRET" \
  -d '{"title":"Teste","url":"http://test.com","source_telegram_group":"Teste"}'
```

### Realtime não funciona
- Verifique se habilitou Replication no Supabase
- Confira o console do navegador

---

## 📝 Próximos Passos / Melhorias

- [ ] Painel admin para gerenciar promoções
- [ ] Sistema de votos/curtidas
- [ ] Comentários nas promoções
- [ ] Integração com mais plataformas (WhatsApp, Discord)
- [ ] Machine Learning para classificação
- [ ] API pública para terceiros
- [ ] App mobile nativo
- [ ] Sistema de alertas personalizados

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

---

## 🙋‍♂️ Suporte

Problemas? Abra uma issue no GitHub ou entre em contato.

---

**Desenvolvido com ❤️ usando Next.js, Supabase e Pyrogram**

---

## 📚 Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Pyrogram](https://docs.pyrogram.org)
- [TailwindCSS](https://tailwindcss.com/docs)

---

## ⚠️ Avisos Legais

- Respeite os termos de uso do Telegram
- Não faça spam
- Use apenas em grupos onde você tem permissão
- Respeite a privacidade dos usuários
- Este projeto é para fins educacionais

---

**Bom uso e boas promoções! 🎉**

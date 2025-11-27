# 🚀 Guia de Deploy - PromoHunt Brasil

## Deploy Frontend (Netlify)

### Passo 1: Preparar o Repositório

```bash
# Inicialize o git se ainda não tiver
git init
git add .
git commit -m "Initial commit - PromoHunt Brasil"

# Crie um repositório no GitHub e faça push
git remote add origin https://github.com/seu-usuario/promohunt-brasil.git
git branch -M main
git push -u origin main
```

### Passo 2: Deploy no Netlify

1. Acesse https://www.netlify.com
2. Faça login com GitHub
3. Clique em "Add new site" > "Import an existing project"
4. Selecione seu repositório `promohunt-brasil`
5. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
   - O arquivo `netlify.toml` já está configurado!

### Passo 3: Variáveis de Ambiente

No dashboard do Netlify, vá em **Site settings > Environment variables** e adicione:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dsrtuybzqbfvmwqrsgmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcnR1eWJ6cWJmdm13cXJzZ21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjU4ODUsImV4cCI6MjA3OTIwMTg4NX0.7LwtPecdMRaj1gF1HQU2XD_h0lf5YLakOeAMTUS43vc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcnR1eWJ6cWJmdm13cXJzZ21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjU4ODUsImV4cCI6MjA3OTIwMTg4NX0.7LwtPecdMRaj1gF1HQU2XD_h0lf5YLakOeAMTUS43vc
API_SECRET_KEY=8f4d9c2e1a6b7f3e5d8c9a4b2e1f6d3c
NEXT_PUBLIC_SITE_URL=https://seu-site.netlify.app
```

**IMPORTANTE:** Após o deploy, atualize `NEXT_PUBLIC_SITE_URL` com a URL real do seu site Netlify.

### Passo 4: Deploy

1. Clique em "Deploy site"
2. Aguarde o build (2-3 min)
3. Seu site estará em `https://seu-site.netlify.app`
4. Volte nas variáveis de ambiente e atualize `NEXT_PUBLIC_SITE_URL` com a URL real
5. Faça um novo deploy (Deploys > Trigger deploy)

---

## Deploy Bot Telegram (Railway)

### Opção 1: Railway (Recomendado)

1. Acesse https://railway.app
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha seu repositório

#### Configuração do Railway

1. Adicione um **Python Service**
2. Configure as variáveis de ambiente:

```env
TELEGRAM_API_ID=38498874
TELEGRAM_API_HASH=718410c5b7c183466089cce88d9e5345
TELEGRAM_PHONE_NUMBER=+5577991600444
API_SECRET_KEY=8f4d9c2e1a6b7f3e5d8c9a4b2e1f6d3c
NEXT_PUBLIC_SITE_URL=https://seu-site.netlify.app
```

3. Configure o Start Command:
```bash
python telegram_bot/bot_simple.py
```

4. Configure o Build Command:
```bash
pip install -r telegram_bot/requirements.txt
```

5. Deploy

**IMPORTANTE:** O bot `bot_simple.py` não precisa de autenticação do Telegram! Ele funciona via scraping público dos grupos.

### Opção 2: Render

1. Acesse https://render.com
2. Clique em "New +"
3. Selecione "Background Worker"
4. Conecte seu repositório
5. Configure:
   - **Name:** promohunt-telegram-bot
   - **Environment:** Python 3
   - **Build Command:** `cd telegram_bot && pip install -r requirements.txt`
   - **Start Command:** `cd telegram_bot && python main.py`

6. Adicione as variáveis de ambiente (mesmas do Railway)

### Opção 3: VPS (DigitalOcean, AWS, etc)

#### Criar Droplet (DigitalOcean)

1. Crie um droplet Ubuntu 22.04
2. Escolha o plano básico ($6/mês)
3. Adicione sua chave SSH

#### Configurar o Servidor

```bash
# Conecte via SSH
ssh root@seu-ip

# Atualize o sistema
apt update && apt upgrade -y

# Instale Python e Git
apt install python3 python3-pip git -y

# Clone o repositório
git clone https://github.com/seu-usuario/promohunt-brasil.git
cd promohunt-brasil/telegram_bot

# Instale dependências
pip3 install -r requirements.txt

# Configure o .env
nano .env
# Cole suas variáveis de ambiente
# Ctrl+X, Y, Enter para salvar

# Primeira execução (autenticação)
python3 main.py
# Digite o código do Telegram

# Instale screen para manter rodando
apt install screen -y

# Inicie em background
screen -S telegram-bot
python3 main.py
# Ctrl+A+D para desanexar

# Para reconectar:
screen -r telegram-bot
```

#### Configurar Autostart (Opcional)

Crie um serviço systemd:

```bash
nano /etc/systemd/system/promohunt-bot.service
```

Conteúdo:

```ini
[Unit]
Description=PromoHunt Telegram Bot
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/promohunt-brasil/telegram_bot
ExecStart=/usr/bin/python3 main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Ative:

```bash
systemctl enable promohunt-bot
systemctl start promohunt-bot
systemctl status promohunt-bot
```

---

## Deploy Bot Telegram (Alternativa: Docker)

### Dockerfile

Crie `telegram_bot/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  telegram-bot:
    build: ./telegram_bot
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./telegram_bot:/app
```

### Deploy

```bash
docker-compose up -d
```

---

## Configurações Pós-Deploy

### 1. Atualizar URL no Bot

Certifique-se de que a variável `NEXT_PUBLIC_SITE_URL` aponta para sua URL da Vercel.

### 2. Configurar Domínio Customizado (Opcional)

#### Vercel

1. Compre um domínio (Namecheap, GoDaddy, etc)
2. Na Vercel, vá em **Settings > Domains**
3. Adicione seu domínio
4. Configure os DNS conforme instruído

### 3. Habilitar HTTPS

Vercel já fornece HTTPS automaticamente.

### 4. Configurar Redirecionamentos

No `next.config.js`:

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/promo/:id',
        destination: '/promocao/:id',
        permanent: true,
      },
    ]
  },
}
```

---

## Monitoramento

### Logs do Frontend (Vercel)

1. Dashboard da Vercel
2. Aba "Deployments"
3. Clique no deployment
4. "View Function Logs"

### Logs do Bot

**Railway:**
- Dashboard > Deploy Logs

**Render:**
- Dashboard > Logs

**VPS:**
```bash
# Se usando systemd
journalctl -u promohunt-bot -f

# Se usando screen
screen -r telegram-bot
```

---

## Backup do Banco de Dados

### Backup Manual (Supabase)

1. Dashboard do Supabase
2. **Database > Backups**
3. "Create Backup"

### Backup Automático

Supabase faz backups diários automaticamente no plano gratuito.

### Restauração

1. Dashboard > Database > Backups
2. Selecione o backup
3. "Restore"

---

## Troubleshooting

### Erro: Build Failed (Vercel)

```bash
# Verifique se todas as dependências estão instaladas
npm install

# Teste o build localmente
npm run build
```

### Bot não está enviando promoções

1. Verifique os logs
2. Confirme que `NEXT_PUBLIC_SITE_URL` está correto
3. Teste a API manualmente:

```bash
curl -X POST https://seu-site.vercel.app/api/promotions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_API_SECRET" \
  -d '{"title":"Teste","url":"http://test.com","source_telegram_group":"Teste"}'
```

### Realtime não funciona em produção

1. Verifique se habilitou Replication no Supabase
2. Confirme que a URL do Supabase está correta
3. Verifique o console do navegador

---

## Otimizações de Performance

### 1. Habilitar Cache

Em `next.config.js`:

```javascript
module.exports = {
  experimental: {
    optimizeCss: true,
  },
}
```

### 2. Otimizar Imagens

As imagens já estão otimizadas com `next/image`.

### 3. Adicionar Analytics

Instale Vercel Analytics:

```bash
npm install @vercel/analytics
```

Em `layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react'

// No return
<Analytics />
```

---

## Custos Estimados

### Gratuito
- ✅ Vercel (Frontend): Grátis para projetos pessoais
- ✅ Supabase: Grátis até 500MB de banco
- ✅ Railway: $5 de crédito inicial

### Pago (se necessário)
- 💰 VPS: $6-12/mês (DigitalOcean, Linode)
- 💰 Railway Pro: $5/mês
- 💰 Supabase Pro: $25/mês (se ultrapassar limites)

---

## Segurança

### 1. Proteja suas chaves

Nunca commit:
- `.env`
- `*.session`
- Service role keys

### 2. Rate Limiting

Adicione rate limiting à API:

```bash
npm install @upstash/ratelimit @upstash/redis
```

### 3. CORS

Configure em `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://seu-dominio.com' },
        ],
      },
    ]
  },
}
```

---

## Atualizações

### Atualizar o Frontend

```bash
git add .
git commit -m "Update: descrição"
git push
# Vercel fará deploy automaticamente
```

### Atualizar o Bot

**Railway/Render:**
- Push para o GitHub
- Deploy automático

**VPS:**
```bash
ssh root@seu-ip
cd promohunt-brasil
git pull
systemctl restart promohunt-bot
```

---

**Deploy concluído! 🎉**

Seu site está no ar e capturando promoções 24/7!

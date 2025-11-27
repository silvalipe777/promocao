# ⚡ Comandos Úteis - PromoHunt Brasil

## Desenvolvimento

### Instalar Dependências
```bash
# Frontend
npm install

# Bot Telegram
cd telegram_bot
pip install -r requirements.txt
cd ..
```

### Rodar em Desenvolvimento
```bash
# Terminal 1 - Frontend (localhost:3000)
npm run dev

# Terminal 2 - Bot Telegram
cd telegram_bot
python main.py

# Rodar apenas build de produção
npm run build
npm start
```

### Linter e Formatação
```bash
# Verificar erros
npm run lint

# Build de produção (testa se compila)
npm run build
```

## Git

### Comandos Básicos
```bash
# Status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: adiciona nova funcionalidade"

# Push
git push origin main

# Pull (atualizar)
git pull origin main
```

### Branches
```bash
# Criar branch
git checkout -b feature/minha-feature

# Listar branches
git branch

# Mudar de branch
git checkout main

# Merge
git merge feature/minha-feature

# Deletar branch local
git branch -d feature/minha-feature
```

## Supabase

### Executar Schema
1. Acesse Supabase Dashboard
2. SQL Editor
3. Cole conteúdo de `supabase/schema.sql`
4. Run

### Ver Dados
```sql
-- Ver todas as promoções
SELECT * FROM promotions ORDER BY created_at DESC LIMIT 10;

-- Ver favoritos de um usuário
SELECT * FROM favorites WHERE user_id = 'uuid-aqui';

-- Ver estatísticas
SELECT
  COUNT(*) as total,
  AVG(discount_percent) as desconto_medio,
  COUNT(DISTINCT store) as total_lojas
FROM promotions;

-- Promoções de hoje
SELECT * FROM promotions
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC;
```

### Limpar Banco (CUIDADO!)
```sql
-- Deletar todas as promoções
DELETE FROM promotions;

-- Deletar todos os favoritos
DELETE FROM favorites;

-- Resetar auto-increment (se necessário)
TRUNCATE TABLE promotions RESTART IDENTITY CASCADE;
```

## Python (Bot Telegram)

### Ambiente Virtual (Recomendado)
```bash
# Criar venv
python -m venv venv

# Ativar (Windows)
venv\Scripts\activate

# Ativar (Mac/Linux)
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Desativar
deactivate
```

### Testar Bot Localmente
```bash
cd telegram_bot

# Rodar bot
python main.py

# Ver logs em tempo real
python main.py | tee bot.log
```

### Atualizar Session do Telegram
```bash
# Se der erro de autenticação
# 1. Delete o arquivo .session
rm *.session

# 2. Rode novamente
python main.py

# 3. Digite o código que você receber no Telegram
```

## NPM Scripts Customizados

Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "telegram:bot": "python telegram_bot/main.py",
    "db:migrate": "echo 'Execute schema.sql no Supabase'",
    "dev:all": "concurrently \"npm run dev\" \"npm run telegram:bot\"",
    "clean": "rm -rf .next node_modules",
    "reinstall": "npm run clean && npm install"
  }
}
```

### Rodar Tudo Junto (Opcional)
```bash
# Instale concurrently
npm install -D concurrently

# Rode frontend + bot juntos
npm run dev:all
```

## Testes

### Testar API Manualmente
```bash
# Criar promoção
curl -X POST http://localhost:3000/api/promotions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sua_api_secret_key" \
  -d '{
    "title": "Teste",
    "url": "https://example.com",
    "price": 99.90,
    "store": "Teste",
    "source_telegram_group": "Teste Manual"
  }'

# Listar promoções
curl http://localhost:3000/api/promotions
```

### Testar Realtime
1. Abra http://localhost:3000 no navegador
2. Abra Console (F12)
3. Envie uma mensagem de promoção no Telegram
4. Veja a promoção aparecer automaticamente

### Testar Notificações
1. Abra site no navegador
2. Permita notificações
3. Envie promoção no Telegram
4. Veja notificação aparecer

## Debug

### Ver Logs do Next.js
```bash
npm run dev
# Logs aparecem no terminal
```

### Ver Logs do Supabase
1. Dashboard Supabase
2. Logs (menu lateral)
3. Selecione tipo de log

### Ver Logs do Bot
```bash
# Bot imprime no console
python main.py

# Salvar logs em arquivo
python main.py > bot.log 2>&1
```

### Debug Mode (Next.js)
Adicione ao `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

## Performance

### Analisar Bundle
```bash
# Instalar
npm install -D @next/bundle-analyzer

# Configurar next.config.js
# Analisar
ANALYZE=true npm run build
```

### Lighthouse (Performance)
1. Abra site no Chrome
2. F12 > Lighthouse
3. Generate Report

## Produção

### Build e Deploy Vercel
```bash
# Build local
npm run build

# Deploy
vercel

# Deploy produção
vercel --prod
```

### Atualizar Código em Produção
```bash
git add .
git commit -m "update: descrição"
git push
# Vercel faz deploy automático
```

## Troubleshooting

### Port Já em Uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Cache Issues
```bash
# Limpar cache Next.js
rm -rf .next

# Reinstalar node_modules
rm -rf node_modules
npm install

# Limpar cache npm
npm cache clean --force
```

### Erro de TypeScript
```bash
# Reinstalar types
npm install -D @types/node @types/react @types/react-dom
```

## Utilitários

### Gerar Secret Key
```bash
# Node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Python
python -c "import secrets; print(secrets.token_hex(32))"

# OpenSSL
openssl rand -hex 32
```

### Ver Tamanho do Projeto
```bash
# Mac/Linux
du -sh .

# Windows PowerShell
(Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
```

### Backup do Banco
```bash
# Via Supabase Dashboard
# Settings > Database > Backups > Create Backup
```

## Aliases Úteis (Opcional)

Adicione ao `.bashrc` ou `.zshrc`:

```bash
alias promo-dev="cd /caminho/promohunt && npm run dev"
alias promo-bot="cd /caminho/promohunt/telegram_bot && python main.py"
alias promo-logs="tail -f telegram_bot/bot.log"
alias promo-build="npm run build"
alias promo-deploy="git push && vercel --prod"
```

## Cheatsheet Rápido

```bash
# Setup inicial
npm install
cp .env.example .env
# [Editar .env]

# Desenvolvimento
npm run dev              # Frontend
python telegram_bot/main.py  # Bot

# Deploy
git push                 # Trigger Vercel deploy
vercel --prod           # Deploy direto

# Manutenção
npm run lint            # Verificar código
npm run build           # Testar build
git status              # Ver mudanças
```

---

**Comandos essenciais sempre à mão! 🚀**

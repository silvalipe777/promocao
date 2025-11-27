# 🚀 Guia de Instalação Rápida - PromoHunt Brasil

## Instalação em 10 minutos

### Passo 1: Supabase (3 min)

1. Acesse https://supabase.com e crie uma conta
2. Clique em "New Project"
3. Preencha:
   - Nome: `promohunt-brasil`
   - Database Password: (crie uma senha forte)
   - Região: `South America (São Paulo)`
4. Aguarde a criação (1-2 min)
5. Vá em **Project Settings > API**
6. Copie:
   - `URL`
   - `anon public`
   - `service_role` (clique em "Reveal")

### Passo 2: Configure o Banco (2 min)

1. No Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Abra o arquivo `supabase/schema.sql` deste projeto
4. Copie TODO o conteúdo
5. Cole no SQL Editor
6. Clique em "Run" (botão verde)
7. Verifique se não há erros (deve aparecer "Success")

### Passo 3: Telegram API (2 min)

1. Acesse https://my.telegram.org
2. Faça login com seu número do Telegram
3. Clique em **API Development Tools**
4. Preencha o formulário:
   - App title: `PromoHunt Bot`
   - Short name: `promohunt`
   - Platform: `Other`
5. Clique em "Create application"
6. Copie:
   - `api_id`
   - `api_hash`

### Passo 4: Configurar o Projeto (3 min)

1. Abra o terminal nesta pasta
2. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

3. Abra o arquivo `.env` e preencha:

```env
# Cole as informações do Passo 1
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Cole as informações do Passo 3
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=abcdef1234567890abcdef1234567890
TELEGRAM_PHONE_NUMBER=+5511999999999

# Crie uma senha aleatória
API_SECRET_KEY=minha_senha_super_secreta_123

# Deixe como está por enquanto
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Instale as dependências:
```bash
npm install
cd telegram_bot
pip install -r requirements.txt
cd ..
```

### Passo 5: Rodar o Projeto

**Terminal 1 - Frontend:**
```bash
npm run dev
```

Abra http://localhost:3000

**Terminal 2 - Bot do Telegram:**
```bash
cd telegram_bot
python main.py
```

Na primeira vez, ele vai pedir:
1. Código de verificação (você receberá no Telegram)
2. Digite o código
3. Pronto! O bot está rodando

### Passo 6: Configurar Grupos

1. Abra `telegram_bot/main.py`
2. Procure por `MONITORED_GROUPS`
3. Adicione os IDs dos grupos que você quer monitorar:

```python
MONITORED_GROUPS = [
    -1001234567890,  # ID do grupo 1
    "@nomeDoGrupo",  # Username do grupo 2
]
```

**Como descobrir o ID de um grupo?**
- Adicione o bot `@userinfobot` ao grupo
- Ele mostrará o ID

### ✅ Pronto!

Agora você tem:
- ✅ Site rodando em http://localhost:3000
- ✅ Bot monitorando grupos do Telegram
- ✅ Banco de dados configurado
- ✅ Sistema de autenticação funcionando

## Testando

1. Envie uma mensagem de teste em um grupo monitorado:
```
🔥 PROMOÇÃO IMPERDÍVEL! 🔥

Notebook Dell por R$ 2.499,90
De R$ 3.999,00
-37% OFF

https://amzn.to/exemplo
```

2. O bot deve detectar e enviar para o site
3. Recarregue http://localhost:3000
4. A promoção deve aparecer!

## Próximos Passos

- Leia o [README.md](README.md) completo para mais detalhes
- Configure mais grupos
- Ajuste o parser conforme necessário
- Faça deploy em produção

## Problemas Comuns

**Erro: "Module not found"**
```bash
npm install
```

**Bot não inicia:**
- Verifique se Python 3.9+ está instalado
- Instale as dependências: `pip install -r requirements.txt`

**Promoções não aparecem:**
- Verifique os logs do bot
- Confirme que o grupo está em `MONITORED_GROUPS`
- Teste a API manualmente (veja README.md)

**Erro no Supabase:**
- Verifique se as URLs e chaves estão corretas
- Confirme que executou o schema.sql

## Ajuda

Problemas? Abra uma issue no GitHub ou verifique o README.md completo.

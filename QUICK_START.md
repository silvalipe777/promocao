# ⚡ Quick Start - PromoHunt Brasil

## Comandos Essenciais

### Desenvolvimento

```bash
# Instalar dependências
npm install
cd telegram_bot && pip install -r requirements.txt && cd ..

# Rodar o site
npm run dev

# Rodar o bot (em outro terminal)
cd telegram_bot && python main.py
```

### Estrutura de Arquivos Principais

```
sitepromocoes/
├── src/app/page.tsx              # Página inicial
├── src/components/               # Componentes reutilizáveis
├── telegram_bot/main.py          # Bot do Telegram
├── supabase/schema.sql           # Schema do banco
├── .env                          # Variáveis de ambiente (criar)
└── README.md                     # Documentação completa
```

### Arquivos de Configuração

**`.env` (CRIAR ESTE ARQUIVO):**
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service
TELEGRAM_API_ID=seu_api_id
TELEGRAM_API_HASH=seu_api_hash
TELEGRAM_PHONE_NUMBER=+55119999999
API_SECRET_KEY=senha_forte
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Configurar Grupos do Telegram

Edite `telegram_bot/main.py`:

```python
MONITORED_GROUPS = [
    -1001234567890,    # ID do grupo
    "@nomeDoGrupo",    # Username do grupo
]
```

## Checklist de Setup

- [ ] Criar projeto no Supabase
- [ ] Executar `schema.sql` no SQL Editor
- [ ] Obter credenciais da API do Telegram
- [ ] Criar arquivo `.env` com todas as variáveis
- [ ] Executar `npm install`
- [ ] Executar `pip install -r requirements.txt`
- [ ] Configurar grupos em `MONITORED_GROUPS`
- [ ] Rodar `npm run dev`
- [ ] Rodar bot: `python telegram_bot/main.py`
- [ ] Testar enviando mensagem no grupo

## URLs Importantes

- **Site local:** http://localhost:3000
- **API local:** http://localhost:3000/api/promotions
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Telegram API:** https://my.telegram.org

## Testes Rápidos

### Testar API

```bash
curl -X POST http://localhost:3000/api/promotions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sua_api_secret" \
  -d '{"title":"Teste","url":"http://test.com","source_telegram_group":"Teste"}'
```

### Mensagem de Teste no Telegram

```
🔥 OFERTA RELÂMPAGO! 🔥
Mouse Gamer RGB por R$ 79,90
De R$ 149,90 - 47% OFF
https://amzn.to/exemplo
```

## Problemas Comuns

**Erro: "Module not found"**
→ `npm install`

**Bot não inicia**
→ `pip install -r requirements.txt`

**Promoções não aparecem**
→ Verifique grupos em `MONITORED_GROUPS`

**Erro de autenticação Supabase**
→ Verifique variáveis no `.env`

## Próximos Passos

1. ✅ Leia [INSTALL.md](INSTALL.md) para setup detalhado
2. ✅ Leia [README.md](README.md) para documentação completa
3. ✅ Leia [DEPLOY.md](DEPLOY.md) para fazer deploy
4. ✅ Leia [API.md](API.md) para usar a API

## Suporte

- 📖 Documentação: [README.md](README.md)
- 🚀 Deploy: [DEPLOY.md](DEPLOY.md)
- 📡 API: [API.md](API.md)
- ⚡ Setup: [INSTALL.md](INSTALL.md)

**Desenvolvido com ❤️ para a comunidade brasileira de promoções!**

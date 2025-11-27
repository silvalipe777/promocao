# Guia de Uso do Bot Telegram

## Nova Versao com Telethon (Mais Estavel)

### Passo 1: Instalar Dependencias

```bash
cd telegram_bot
pip install -r requirements.txt
```

### Passo 2: Autenticar (Primeira Vez)

Execute o script de autenticacao:

```bash
python auth_telethon.py
```

Voce vai:
1. Receber um codigo no Telegram
2. Digitar o codigo quando solicitado
3. A sessao sera salva automaticamente

### Passo 3: Executar o Bot

Depois de autenticado, execute:

```bash
python bot_telethon.py
```

O bot vai:
- Monitorar os grupos configurados
- Detectar promocoes automaticamente
- Enviar para a API do site

## Configuracao

Os grupos monitorados estao no arquivo `bot_telethon.py`:

```python
MONITORED_GROUPS = [
    "economizanderson",
    "descontoemgames",
    "pcdofafapromo",
    "fafaofertas",
    "especialistaemti",
    "infoBRpromos",
]
```

Para adicionar mais grupos, basta adicionar o username do grupo na lista.

## Troubleshooting

### Bot nao detecta promocoes
- Verifique se o grupo esta na lista MONITORED_GROUPS
- Verifique se voce esta no grupo
- Teste enviando mensagem com palavras-chave como "promocao", "oferta", "desconto"

### Erro de autenticacao
- Delete o arquivo `promohunt_telethon.session`
- Execute novamente `python auth_telethon.py`

### API nao recebe promocoes
- Verifique se o servidor Next.js esta rodando
- Verifique a URL em NEXT_PUBLIC_SITE_URL no .env
- Verifique o API_SECRET_KEY no .env

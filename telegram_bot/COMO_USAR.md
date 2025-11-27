# Como Usar o Bot de Promoções

## ✅ SOLUÇÃO FUNCIONANDO - bot_simple.py

Este bot funciona **SEM necessidade de autenticação**! Ele faz scraping dos grupos públicos do Telegram.

### Como executar:

```bash
cd telegram_bot
python bot_simple.py
```

### O que o bot faz:

1. Verifica os grupos públicos do Telegram a cada 5 minutos
2. Detecta automaticamente mensagens que são promoções
3. Extrai informações (título, preço, desconto, loja)
4. Envia para a API do site

### Grupos monitorados:

- economizanderson
- descontoemgames
- pcdofafapromo
- fafaofertas
- especialistaemti
- infoBRpromos

### Para adicionar mais grupos:

Edite o arquivo `bot_simple.py` e adicione o username do grupo na lista `MONITORED_GROUPS`:

```python
MONITORED_GROUPS = [
    "economizanderson",
    "seu_novo_grupo_aqui",  # Adicione aqui
]
```

### Como deixar rodando 24/7:

**Opção 1: Deixar terminal aberto**
- Execute `python bot_simple.py`
- Minimize a janela do terminal
- O bot vai continuar rodando

**Opção 2: Executar como serviço (Windows)**
- Use o Task Scheduler do Windows
- Configure para executar na inicialização

**Opção 3: Usar screen/tmux (se estiver no Linux/Mac)**
```bash
screen -S promocoes
python bot_simple.py
# Pressione Ctrl+A, depois D para desanexar
```

### Verificar se está funcionando:

O bot mostra mensagens assim:

```
[15:33:50] Verificando grupos...
  - Verificando: economizanderson
    [PROMO] JBL Boombox 4...
            Preco: R$ 2331.0
            Loja: Aliexpress
[OK] Promocao enviada: JBL Boombox 4...
```

### Troubleshooting:

**Erro: "Failed to establish connection"**
- O servidor Next.js não está rodando
- Inicie com: `npm run dev` na pasta principal

**Não está encontrando promoções**
- Os grupos podem estar privados
- Aguarde alguns minutos, o bot verifica a cada 5 min
- Verifique se os grupos existem em t.me/s/nome_do_grupo

**Dependências faltando**
```bash
pip install -r requirements.txt
```

### Arquivos importantes:

- `bot_simple.py` - Bot que funciona sem autenticação (RECOMENDADO)
- `bot_telethon.py` - Bot com Telethon (precisa autenticar)
- `main.py` - Bot com Pyrogram (precisa autenticar)
- `requirements.txt` - Dependências Python

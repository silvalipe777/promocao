# 📱 Configuração de Grupos - PromoHunt Brasil

## Grupos Configurados Atualmente

### ✅ Grupos Ativos

1. **infoBRpromos**
   - Link: https://t.me/infoBRpromos
   - Status: ✅ Configurado
   - Tipo: Username

## Como Adicionar Mais Grupos

### Opção 1: Por Username (Mais Fácil)

Edite o arquivo `telegram_bot/main.py` na linha `MONITORED_GROUPS`:

```python
MONITORED_GROUPS = [
    "infoBRpromos",
    "outroGrupo",      # Adicione aqui (sem @)
    "maisUmGrupo",     # Mais um exemplo
]
```

**Exemplo de links e como extrair o username:**
- Link: `https://t.me/promocoesbrasil` → Username: `"promocoesbrasil"`
- Link: `https://t.me/ofertasrelampago` → Username: `"ofertasrelampago"`

### Opção 2: Por ID Numérico (Mais Confiável)

**Passo 1:** Descubra o ID do grupo

Método 1 - Usando Bot:
1. Adicione o bot [@userinfobot](https://t.me/userinfobot) ao grupo
2. O bot mostrará o ID do grupo (ex: `-1001234567890`)

Método 2 - Pelos Logs:
1. Deixe `MONITORED_GROUPS = []` (vazio)
2. Rode o bot: `python main.py`
3. Envie uma mensagem em qualquer grupo que você participa
4. O bot mostrará nos logs o ID de todos os grupos
5. Copie o ID do grupo desejado

**Passo 2:** Adicione o ID:

```python
MONITORED_GROUPS = [
    "infoBRpromos",
    -1001234567890,    # ID numérico (note o sinal de menos)
    -1009876543210,    # Outro grupo por ID
]
```

## Monitorar TODOS os Grupos

Se você quer que o bot monitore TODOS os grupos que você participa:

```python
MONITORED_GROUPS = []  # Lista vazia = monitora tudo
```

**⚠️ Aviso:** Isso pode gerar muitos falsos positivos!

## Descobrir ID de Grupos Privados

Para grupos privados sem username:

1. Entre no grupo
2. Rode o bot com `MONITORED_GROUPS = []`
3. Envie uma mensagem de teste no grupo
4. Veja o ID nos logs do bot:

```
📨 Nova mensagem de: Nome do Grupo
   ID: -1001234567890
```

5. Use esse ID na configuração

## Exemplos Completos

### Exemplo 1: Apenas Username
```python
MONITORED_GROUPS = [
    "infoBRpromos",
    "pelando",
    "promobit",
]
```

### Exemplo 2: Mix de Username e ID
```python
MONITORED_GROUPS = [
    "infoBRpromos",          # Username
    -1001234567890,          # ID numérico
    "outroGrupo",            # Username
    -1009876543210,          # ID numérico
]
```

### Exemplo 3: Apenas IDs
```python
MONITORED_GROUPS = [
    -1001234567890,
    -1009876543210,
    -1008765432109,
]
```

## Testando a Configuração

Depois de adicionar grupos:

1. Salve o arquivo `main.py`
2. Rode o bot:
```bash
cd telegram_bot
python main.py
```

3. Envie uma mensagem de teste em um dos grupos:
```
🔥 PROMOÇÃO TESTE!

Mouse Gamer por R$ 79,90
De R$ 149,90

https://amzn.to/teste
```

4. Veja nos logs:
```
📨 Nova mensagem de: infoBRpromos
🎯 Promoção detectada!
   Título: Mouse Gamer por R$ 79,90
   Preço: R$ 79.90
   Loja: Amazon
✅ Promoção enviada: Mouse Gamer...
```

## Adicionar Grupos Dinamicamente (Futuro)

**Funcionalidade em desenvolvimento:**
- Adicionar grupos via interface web
- Ativar/desativar grupos sem reiniciar o bot
- Dashboard de grupos monitorados

## Troubleshooting

### Bot não recebe mensagens do grupo

**Possíveis causas:**

1. **Username incorreto**
   - ✅ Correto: `"infoBRpromos"`
   - ❌ Errado: `"@infoBRpromos"` (não use @)
   - ❌ Errado: `"https://t.me/infoBRpromos"` (não use URL completa)

2. **Você não está no grupo**
   - O bot usa sua conta, então você precisa estar no grupo

3. **Grupo não aceita bots**
   - Use sua conta pessoal (Pyrogram já faz isso)

4. **ID do grupo mudou**
   - Descubra o novo ID usando o método acima

### Bot detecta grupo errado

Se o bot está monitorando um grupo que você não quer:

1. Confira se não está com `MONITORED_GROUPS = []`
2. Liste explicitamente os grupos desejados

### Como parar de monitorar um grupo

Simplesmente remova da lista:

```python
# Antes
MONITORED_GROUPS = [
    "infoBRpromos",
    "grupoIndesejado",  # ← Remova esta linha
]

# Depois
MONITORED_GROUPS = [
    "infoBRpromos",
]
```

## Lista de Grupos Brasileiros Populares

Grupos públicos conhecidos de promoções (adicione se quiser):

```python
MONITORED_GROUPS = [
    "infoBRpromos",
    # Adicione outros grupos públicos aqui
]
```

**Nota:** Sempre respeite as regras dos grupos e os termos de serviço do Telegram.

## Atualizar Configuração em Produção

Se estiver rodando em servidor:

### VPS/Servidor
```bash
# 1. Edite o arquivo
nano telegram_bot/main.py

# 2. Reinicie o bot
systemctl restart promohunt-bot
# ou
pkill -f main.py && python main.py
```

### Railway/Render
```bash
# 1. Edite localmente
# 2. Commit e push
git add telegram_bot/main.py
git commit -m "update: adiciona novos grupos"
git push

# Deploy automático
```

## Perguntas Frequentes

**P: Posso monitorar canais também?**
R: Sim! Use o mesmo método (username ou ID).

**P: Quantos grupos posso monitorar?**
R: Não há limite técnico, mas muitos grupos = muitas mensagens.

**P: O bot envia mensagens nos grupos?**
R: Não! Ele apenas lê mensagens.

**P: Preciso ser admin do grupo?**
R: Não, basta ser membro.

**P: Grupos privados funcionam?**
R: Sim, desde que você esteja neles. Use o ID numérico.

---

**Configuração atualizada! Grupo infoBRpromos está sendo monitorado! ✅**

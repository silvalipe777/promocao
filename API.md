# 📡 API Documentation - PromoHunt Brasil

## Endpoints Disponíveis

### POST /api/promotions

Cria uma nova promoção no banco de dados.

**Autenticação:** Bearer Token (API_SECRET_KEY)

**Request:**

```http
POST /api/promotions
Content-Type: application/json
Authorization: Bearer sua_api_secret_key

{
  "title": "Notebook Dell Inspiron 15",
  "description": "Notebook com processador Intel i5, 8GB RAM, 256GB SSD",
  "price": 2499.90,
  "old_price": 3999.00,
  "discount_percent": 37,
  "url": "https://amzn.to/3exemplo",
  "image": "https://example.com/image.jpg",
  "store": "Amazon",
  "category": "Eletrônicos",
  "source_telegram_group": "Promoções Brasil"
}
```

**Campos:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| title | string | ✅ | Título da promoção |
| description | string | ❌ | Descrição detalhada |
| price | number | ❌ | Preço atual (em reais) |
| old_price | number | ❌ | Preço anterior |
| discount_percent | number | ❌ | Percentual de desconto (0-100) |
| url | string | ✅ | Link da oferta |
| image | string | ❌ | URL da imagem |
| store | string | ❌ | Nome da loja |
| category | string | ❌ | Categoria do produto |
| source_telegram_group | string | ✅ | Origem da promoção |

**Response (200 OK):**

```json
{
  "success": true,
  "promotion": {
    "id": "uuid-aqui",
    "title": "Notebook Dell Inspiron 15",
    "price": 2499.90,
    "created_at": "2024-01-15T10:30:00Z",
    ...
  }
}
```

**Response (400 Bad Request):**

```json
{
  "error": "Missing required fields: title and url"
}
```

**Response (401 Unauthorized):**

```json
{
  "error": "Unauthorized"
}
```

---

### GET /api/promotions

Lista promoções com paginação.

**Autenticação:** Não requerida

**Query Parameters:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| limit | number | 50 | Quantidade de resultados |
| offset | number | 0 | Pular N resultados |

**Request:**

```http
GET /api/promotions?limit=20&offset=0
```

**Response (200 OK):**

```json
{
  "promotions": [
    {
      "id": "uuid-1",
      "title": "Promoção 1",
      "price": 99.90,
      "url": "https://...",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid-2",
      "title": "Promoção 2",
      ...
    }
  ]
}
```

---

## Exemplos de Uso

### cURL

#### Criar Promoção

```bash
curl -X POST http://localhost:3000/api/promotions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sua_api_secret_key" \
  -d '{
    "title": "Fone Bluetooth JBL",
    "price": 149.90,
    "old_price": 299.90,
    "discount_percent": 50,
    "url": "https://amzn.to/exemplo",
    "store": "Amazon",
    "category": "Eletrônicos",
    "source_telegram_group": "Ofertas Tech"
  }'
```

#### Listar Promoções

```bash
curl http://localhost:3000/api/promotions?limit=10
```

---

### Python (requests)

```python
import requests

# Criar promoção
url = "http://localhost:3000/api/promotions"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer sua_api_secret_key"
}
data = {
    "title": "Promoção de Teste",
    "url": "https://example.com",
    "price": 99.90,
    "store": "Loja Teste",
    "source_telegram_group": "Grupo Teste"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())

# Listar promoções
response = requests.get("http://localhost:3000/api/promotions?limit=5")
promotions = response.json()["promotions"]
for promo in promotions:
    print(f"{promo['title']} - R$ {promo['price']}")
```

---

### JavaScript (fetch)

```javascript
// Criar promoção
async function createPromotion() {
  const response = await fetch('/api/promotions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sua_api_secret_key'
    },
    body: JSON.stringify({
      title: 'Mouse Gamer Logitech',
      price: 89.90,
      old_price: 149.90,
      url: 'https://example.com/mouse',
      store: 'Kabum',
      category: 'Eletrônicos',
      source_telegram_group: 'Tech Promos'
    })
  })

  const data = await response.json()
  console.log(data)
}

// Listar promoções
async function getPromotions() {
  const response = await fetch('/api/promotions?limit=10')
  const data = await response.json()
  console.log(data.promotions)
}
```

---

### Node.js (axios)

```javascript
const axios = require('axios')

const API_URL = 'http://localhost:3000/api/promotions'
const API_KEY = 'sua_api_secret_key'

// Criar promoção
async function createPromotion() {
  try {
    const response = await axios.post(API_URL, {
      title: 'Teclado Mecânico',
      price: 199.90,
      url: 'https://example.com',
      store: 'Kabum',
      source_telegram_group: 'Ofertas'
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    })

    console.log('Promoção criada:', response.data)
  } catch (error) {
    console.error('Erro:', error.response.data)
  }
}

// Listar promoções
async function listPromotions() {
  try {
    const response = await axios.get(API_URL, {
      params: { limit: 20, offset: 0 }
    })

    console.log(`${response.data.promotions.length} promoções encontradas`)
  } catch (error) {
    console.error('Erro:', error)
  }
}
```

---

## Rate Limiting

Atualmente não há rate limiting implementado. Para produção, recomenda-se:

1. Implementar rate limiting por IP
2. Usar serviços como Upstash Redis
3. Limitar requests para 100/minuto por IP

---

## Webhooks (Futuro)

Em desenvolvimento: sistema de webhooks para notificar aplicações externas quando novas promoções são criadas.

---

## Erros Comuns

### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

**Solução:** Verifique se o header `Authorization` está correto.

### 400 Bad Request

```json
{
  "error": "Missing required fields: title and url"
}
```

**Solução:** Certifique-se de enviar `title` e `url` no body.

### 500 Internal Server Error

```json
{
  "error": "Failed to create promotion",
  "details": "mensagem de erro"
}
```

**Solução:** Verifique os logs do servidor e a configuração do Supabase.

---

## Testando a API

### Ferramenta: Postman

1. Crie uma nova request
2. Método: POST
3. URL: `http://localhost:3000/api/promotions`
4. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer sua_api_secret_key`
5. Body (raw JSON):
```json
{
  "title": "Teste Postman",
  "url": "https://example.com",
  "price": 99.90,
  "source_telegram_group": "Teste"
}
```

### Ferramenta: Thunder Client (VS Code)

1. Instale a extensão Thunder Client
2. New Request
3. Configure conforme acima
4. Send

---

## Integrações Sugeridas

### Zapier

Crie um Zap que:
1. Monitora novos registros no Supabase
2. Envia notificação para Slack/Discord
3. Posta no Twitter/X

### Make.com (Integromat)

Crie um cenário que:
1. Recebe webhook de nova promoção
2. Formata a mensagem
3. Envia para múltiplas plataformas

### N8N (Self-hosted)

Workflow para:
1. Buscar promoções da API a cada X minutos
2. Filtrar por categoria/preço
3. Enviar alertas personalizados

---

## Segurança

### Boas Práticas

1. ✅ Nunca exponha `API_SECRET_KEY`
2. ✅ Use HTTPS em produção
3. ✅ Implemente rate limiting
4. ✅ Valide todos os inputs
5. ✅ Use CORS adequadamente

### Headers de Segurança

Adicione ao `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ]
}
```

---

**API v1.0** - PromoHunt Brasil

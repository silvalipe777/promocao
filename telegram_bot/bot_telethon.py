import os
import re
import asyncio
from datetime import datetime
from dotenv import load_dotenv
from telethon import TelegramClient, events
import requests

load_dotenv()

API_ID = int(os.getenv('TELEGRAM_API_ID'))
API_HASH = os.getenv('TELEGRAM_API_HASH')
PHONE = os.getenv('TELEGRAM_PHONE_NUMBER')
API_ENDPOINT = os.getenv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
API_SECRET = os.getenv('API_SECRET_KEY')

# Grupos para monitorar
MONITORED_GROUPS = [
    "economizanderson",
    "descontoemgames",
    "pcdofafapromo",
    "fafaofertas",
    "especialistaemti",
    "infoBRpromos",
]

class PromotionParser:
    """Parser para extrair informações de promoções"""

    PRICE_PATTERNS = [
        r'R\$\s*(\d+(?:[.,]\d{2})?)',
        r'(\d+(?:[.,]\d{2})?)\s*reais',
        r'por\s*(\d+(?:[.,]\d{2})?)',
    ]

    DISCOUNT_PATTERNS = [
        r'(\d+)%\s*(?:off|desc|desconto)',
        r'(?:off|desc|desconto)\s*(?:de\s*)?(\d+)%',
        r'-\s*(\d+)%',
    ]

    STORE_PATTERNS = {
        'Shopee': r'shopee|shope\.ee',
        'Amazon': r'amazon|amzn\.to',
        'Mercado Livre': r'mercado\s*livre|mercadolivre|mlv\.re',
        'Aliexpress': r'aliexpress|ali\.ski',
        'Magalu': r'magalu|magazine\s*luiza',
        'Americanas': r'americanas',
        'Kabum': r'kabum|kbm\.re',
    }

    PROMOTION_KEYWORDS = [
        'promoção', 'oferta', 'desconto', 'cupom', 'grátis', 'frete grátis',
        'black friday', 'prime', 'barato', 'imperdível'
    ]

    @staticmethod
    def is_promotion(text):
        if not text:
            return False
        text_lower = text.lower()
        has_keywords = any(kw in text_lower for kw in PromotionParser.PROMOTION_KEYWORDS)
        has_price = any(re.search(p, text, re.I) for p in PromotionParser.PRICE_PATTERNS)
        has_link = 'http' in text_lower or 'bit.ly' in text_lower
        return has_keywords or (has_price and has_link)

    @staticmethod
    def extract_prices(text):
        prices = []
        for pattern in PromotionParser.PRICE_PATTERNS:
            for match in re.finditer(pattern, text, re.I):
                try:
                    prices.append(float(match.group(1).replace(',', '.')))
                except:
                    pass

        if not prices:
            return {'price': None, 'old_price': None}
        if len(prices) >= 2:
            return {'price': min(prices), 'old_price': max(prices)}
        return {'price': prices[0], 'old_price': None}

    @staticmethod
    def extract_discount(text):
        for pattern in PromotionParser.DISCOUNT_PATTERNS:
            match = re.search(pattern, text, re.I)
            if match:
                try:
                    return int(match.group(1))
                except:
                    pass
        return None

    @staticmethod
    def extract_store(text):
        for store, pattern in PromotionParser.STORE_PATTERNS.items():
            if re.search(pattern, text, re.I):
                return store
        return None

    @staticmethod
    def extract_url(text):
        match = re.search(r'https?://[^\s]+', text)
        return match.group(0) if match else None

    @staticmethod
    def generate_title(text, max_length=100):
        text = re.sub(r'https?://[^\s]+', '', text)
        text = re.sub(r'[🎉🔥💥⚡️✨🎊🎁👉👈⬇️➡️]+', '', text)
        text = re.sub(r'\n+', ' ', text)
        text = ' '.join(text.split())
        if len(text) > max_length:
            text = text[:max_length].rsplit(' ', 1)[0] + '...'
        return text.strip()


async def send_to_api(promotion_data):
    """Envia promoção para a API"""
    try:
        response = requests.post(
            f"{API_ENDPOINT}/api/promotions",
            json=promotion_data,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {API_SECRET}'
            },
            timeout=10
        )

        if response.status_code == 200:
            print(f"[OK] Promocao enviada: {promotion_data['title'][:50]}...")
            return True
        else:
            print(f"[ERRO] API {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"[ERRO] Erro ao conectar com API: {e}")
        return False


async def main():
    """Função principal"""

    # Cria o cliente
    client = TelegramClient('promohunt_telethon', API_ID, API_HASH)

    print("Iniciando PromoHunt Bot (Telethon)...")
    print(f"Monitorando {len(MONITORED_GROUPS)} grupos")
    print("=" * 60)

    # Conecta e autentica
    await client.start(phone=PHONE)
    print("[OK] Autenticado com sucesso!")

    # Obtém informações do usuário
    me = await client.get_me()
    print(f"Logado como: {me.first_name} ({me.phone})")
    print("Aguardando mensagens...\n")

    @client.on(events.NewMessage(chats=MONITORED_GROUPS))
    async def handler(event):
        """Handler para novas mensagens"""
        try:
            text = event.message.message
            if not text:
                return

            chat = await event.get_chat()
            chat_name = getattr(chat, 'title', getattr(chat, 'username', 'Desconhecido'))

            print(f"\n[MSG] Mensagem de: {chat_name}")

            # Verifica se é promoção
            if not PromotionParser.is_promotion(text):
                print("[INFO] Nao e promocao")
                return

            # Extrai informações
            url = PromotionParser.extract_url(text)
            if not url:
                print("[INFO] Sem link de produto")
                return

            prices = PromotionParser.extract_prices(text)
            discount = PromotionParser.extract_discount(text)

            # Calcula desconto se possível
            if discount is None and prices['price'] and prices['old_price']:
                discount = int(((prices['old_price'] - prices['price']) / prices['old_price']) * 100)

            store = PromotionParser.extract_store(text)
            title = PromotionParser.generate_title(text)

            promotion_data = {
                'title': title,
                'description': text[:500],
                'price': prices['price'],
                'old_price': prices['old_price'],
                'discount_percent': discount,
                'url': url,
                'store': store,
                'source_telegram_group': chat_name,
            }

            print(f"[PROMO] Promocao detectada!")
            print(f"   Titulo: {title}")
            print(f"   Preco: R$ {prices['price']}")
            print(f"   Loja: {store}")

            # Envia para API
            await send_to_api(promotion_data)

        except Exception as e:
            print(f"[ERRO] Erro ao processar mensagem: {e}")

    # Mantém o bot rodando
    print("\n[OK] Bot ativo! Pressione Ctrl+C para parar.\n")
    await client.run_until_disconnected()


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nEncerrando bot...")
    except Exception as e:
        print(f"\n[ERRO] Erro: {e}")

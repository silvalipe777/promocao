import os
import re
import json
import asyncio
import sys
from datetime import datetime
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from pyrogram import Client, filters
from pyrogram.types import Message
import requests

# Fix encoding para Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

load_dotenv()

API_ID = os.getenv('TELEGRAM_API_ID')
API_HASH = os.getenv('TELEGRAM_API_HASH')
PHONE_NUMBER = os.getenv('TELEGRAM_PHONE_NUMBER')
API_ENDPOINT = os.getenv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
API_SECRET = os.getenv('API_SECRET_KEY')

MONITORED_GROUPS = [
    # Grupos de promoções configurados
    "economizanderson",
    "descontoemgames",
    "pcdofafapromo",
    "fafaofertas",
    "especialistaemti",
    "infoBRpromos",

    # Para monitorar TODOS os grupos, deixe a lista vazia: []
    # Para adicionar por ID numérico: -1001234567890
]

class PromotionParser:
    """Parser inteligente para extrair informações de promoções"""

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
        'Americanas': r'americanas|americanas\.com',
        'Submarino': r'submarino',
        'Casas Bahia': r'casas\s*bahia',
        'Kabum': r'kabum|kbm\.re',
        'Shein': r'shein',
        'Netshoes': r'netshoes',
    }

    CATEGORIES = {
        'Eletrônicos': r'celular|smartphone|notebook|tablet|fone|headphone|tv|monitor|mouse|teclado|console|playstation|xbox|switch',
        'Moda': r'roupa|camiseta|calça|vestido|sapato|tênis|bolsa|relógio|óculos',
        'Casa': r'cama|mesa|banho|cozinha|panela|frigideira|edredom|travesseiro',
        'Beleza': r'perfume|maquiagem|shampoo|condicionador|creme|skincare',
        'Esportes': r'fitness|academia|bicicleta|patins|esporte|treino',
        'Livros': r'livro|ebook|kindle',
        'Games': r'jogo|game|ps4|ps5|xbox|nintendo',
        'Alimentos': r'comida|bebida|snack|chocolate|café',
    }

    PROMOTION_KEYWORDS = [
        'promoção', 'oferta', 'desconto', 'cupom', 'grátis', 'frete grátis',
        'black friday', 'oferta relâmpago', 'prime', 'preço histórico',
        'barato', 'imperdível', 'aproveite', 'por tempo limitado'
    ]

    @staticmethod
    def is_promotion(text: str) -> bool:
        """Verifica se a mensagem parece ser uma promoção"""
        if not text:
            return False

        text_lower = text.lower()

        # Verifica se contém palavras-chave de promoção
        has_keywords = any(keyword in text_lower for keyword in PromotionParser.PROMOTION_KEYWORDS)

        # Verifica se contém preço
        has_price = any(re.search(pattern, text, re.IGNORECASE) for pattern in PromotionParser.PRICE_PATTERNS)

        # Verifica se contém link
        has_link = 'http' in text_lower or 'bit.ly' in text_lower or 'amzn.to' in text_lower

        return has_keywords or (has_price and has_link)

    @staticmethod
    def extract_prices(text: str) -> Dict[str, Optional[float]]:
        """Extrai preços do texto"""
        prices = []

        for pattern in PromotionParser.PRICE_PATTERNS:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                price_str = match.group(1).replace(',', '.')
                try:
                    prices.append(float(price_str))
                except ValueError:
                    continue

        if not prices:
            return {'price': None, 'old_price': None}

        # Se encontrou múltiplos preços, assume que o menor é o atual e o maior é o antigo
        if len(prices) >= 2:
            return {
                'price': min(prices),
                'old_price': max(prices)
            }

        return {'price': prices[0], 'old_price': None}

    @staticmethod
    def extract_discount(text: str) -> Optional[int]:
        """Extrai percentual de desconto"""
        for pattern in PromotionParser.DISCOUNT_PATTERNS:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    return int(match.group(1))
                except ValueError:
                    continue
        return None

    @staticmethod
    def extract_store(text: str, url: str = '') -> Optional[str]:
        """Identifica a loja"""
        combined_text = f"{text} {url}".lower()

        for store, pattern in PromotionParser.STORE_PATTERNS.items():
            if re.search(pattern, combined_text, re.IGNORECASE):
                return store

        return None

    @staticmethod
    def extract_category(text: str) -> Optional[str]:
        """Identifica a categoria do produto"""
        text_lower = text.lower()

        for category, pattern in PromotionParser.CATEGORIES.items():
            if re.search(pattern, text_lower, re.IGNORECASE):
                return category

        return None

    @staticmethod
    def extract_url(message: Message) -> Optional[str]:
        """Extrai URL da mensagem"""
        # Verifica entities
        if message.entities:
            for entity in message.entities:
                if entity.type in ['url', 'text_link']:
                    if entity.type == 'text_link':
                        return entity.url
                    else:
                        return message.text[entity.offset:entity.offset + entity.length]

        # Procura por URLs no texto
        url_pattern = r'https?://[^\s]+'
        match = re.search(url_pattern, message.text or message.caption or '')
        if match:
            return match.group(0)

        return None

    @staticmethod
    def generate_title(text: str, max_length: int = 100) -> str:
        """Gera um título limpo para a promoção"""
        # Remove links
        text = re.sub(r'https?://[^\s]+', '', text)

        # Remove emojis excessivos
        text = re.sub(r'[🎉🔥💥⚡️✨🎊🎁👉👈⬇️➡️]+', '', text)

        # Remove múltiplas quebras de linha
        text = re.sub(r'\n+', ' ', text)

        # Remove espaços extras
        text = ' '.join(text.split())

        # Trunca se necessário
        if len(text) > max_length:
            text = text[:max_length].rsplit(' ', 1)[0] + '...'

        return text.strip()

    @classmethod
    def parse_message(cls, message: Message) -> Optional[Dict[str, Any]]:
        """Processa uma mensagem e retorna dados da promoção"""
        text = message.text or message.caption or ''

        if not cls.is_promotion(text):
            return None

        url = cls.extract_url(message)
        if not url:
            return None

        prices = cls.extract_prices(text)
        discount = cls.extract_discount(text)

        # Se não encontrou desconto mas tem ambos os preços, calcula
        if discount is None and prices['price'] and prices['old_price']:
            discount = int(((prices['old_price'] - prices['price']) / prices['old_price']) * 100)

        # Extrai imagem se houver
        image_url = None
        if message.photo:
            # Pega a maior resolução
            image_url = f"telegram_photo_{message.photo.file_id}"

        store = cls.extract_store(text, url)
        category = cls.extract_category(text)
        title = cls.generate_title(text)

        return {
            'title': title,
            'description': text[:500] if len(text) > 500 else text,
            'price': prices['price'],
            'old_price': prices['old_price'],
            'discount_percent': discount,
            'url': url,
            'image': image_url,
            'store': store,
            'category': category,
            'source_telegram_group': message.chat.title or message.chat.username or str(message.chat.id),
        }


class TelegramMonitor:
    """Monitor de grupos do Telegram"""

    def __init__(self):
        self.app = Client(
            "promohunt_session",
            api_id=API_ID,
            api_hash=API_HASH,
            phone_number=PHONE_NUMBER
        )

        self.parser = PromotionParser()

    async def send_to_api(self, promotion_data: Dict[str, Any]):
        """Envia promoção para a API do Next.js"""
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
                print(f"✅ Promoção enviada: {promotion_data['title'][:50]}...")
            else:
                print(f"❌ Erro ao enviar promoção: {response.status_code}")
                print(f"   Response: {response.text}")

        except Exception as e:
            print(f"❌ Erro ao conectar com API: {e}")

    async def handle_message(self, client: Client, message: Message):
        """Processa mensagens recebidas"""
        try:
            # Verifica se a mensagem é de um grupo monitorado
            if MONITORED_GROUPS and message.chat.id not in MONITORED_GROUPS:
                if message.chat.username not in MONITORED_GROUPS:
                    return

            print(f"\n📨 Nova mensagem de: {message.chat.title or message.chat.username}")

            # Processa a mensagem
            promotion_data = self.parser.parse_message(message)

            if promotion_data:
                print(f"🎯 Promoção detectada!")
                print(f"   Título: {promotion_data['title']}")
                print(f"   Preço: R$ {promotion_data['price']}")
                print(f"   Loja: {promotion_data['store']}")

                # Envia para a API
                await self.send_to_api(promotion_data)
            else:
                print(f"ℹ️  Mensagem não identificada como promoção")

        except Exception as e:
            print(f"❌ Erro ao processar mensagem: {e}")

    async def start(self):
        """Inicia o monitoramento"""
        print("🚀 Iniciando PromoHunt Telegram Monitor...")
        print(f"📡 Monitorando {len(MONITORED_GROUPS) if MONITORED_GROUPS else 'TODOS OS'} grupos")
        print("=" * 50)

        @self.app.on_message(filters.group | filters.channel)
        async def message_handler(client, message):
            await self.handle_message(client, message)

        await self.app.start()
        print("✅ Bot iniciado com sucesso!")
        print("⏳ Aguardando mensagens...\n")

        # Mantém o bot rodando
        await asyncio.Event().wait()


def main():
    """Função principal"""
    if not API_ID or not API_HASH:
        print("❌ Erro: Configure TELEGRAM_API_ID e TELEGRAM_API_HASH no arquivo .env")
        return

    monitor = TelegramMonitor()

    try:
        asyncio.run(monitor.start())
    except KeyboardInterrupt:
        print("\n\n👋 Encerrando bot...")
    except Exception as e:
        print(f"\n❌ Erro fatal: {e}")


if __name__ == "__main__":
    main()

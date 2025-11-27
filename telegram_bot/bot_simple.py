import os
import re
import time
import requests
from datetime import datetime
from dotenv import load_dotenv
from bs4 import BeautifulSoup

load_dotenv()

API_ENDPOINT = os.getenv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
API_SECRET = os.getenv('API_SECRET_KEY')

# Grupos publicos do Telegram (via t.me)
MONITORED_GROUPS = [
    "economizanderson",
    "descontoemgames",
    "pcdofafapromo",
    "fafaofertas",
    "especialistaemti",
    "infoBRpromos",
]

class PromotionParser:
    """Parser para extrair promocoes"""

    PRICE_PATTERNS = [
        r'R\$\s*(\d+(?:[.,]\d{1,2})?)',
        r'(\d+(?:[.,]\d{1,2})?)\s*reais',
        r'por\s*R?\$?\s*(\d+(?:[.,]\d{1,2})?)',
        r'de\s*R?\$?\s*(\d+(?:[.,]\d{1,2})?)\s*por',
        r'preco[:\s]*R?\$?\s*(\d+(?:[.,]\d{1,2})?)',
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
        'promocao', 'oferta', 'desconto', 'cupom', 'gratis', 'frete gratis',
        'black friday', 'prime', 'barato', 'imperdivel'
    ]

    @staticmethod
    def is_promotion(text):
        if not text:
            return False
        text_lower = text.lower()
        has_keywords = any(kw in text_lower for kw in PromotionParser.PROMOTION_KEYWORDS)
        has_price = any(re.search(p, text, re.I) for p in PromotionParser.PRICE_PATTERNS)
        has_link = 'http' in text_lower
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
        match = re.search(r'https?://[^\s<>"]+', text)
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


def send_to_api(promotion_data):
    """Envia promocao para API"""
    try:
        # Remove emojis problematicos do titulo e descricao
        import re
        if promotion_data.get('title'):
            promotion_data['title'] = re.sub(r'[^\x00-\x7F]+', '', promotion_data['title']).strip()
        if promotion_data.get('description'):
            promotion_data['description'] = re.sub(r'[^\x00-\x7F]+', '', promotion_data['description']).strip()

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


def fetch_group_preview(group_username):
    """Busca preview publico do grupo via Telegram"""
    try:
        # Tenta acessar o preview publico
        url = f"https://t.me/s/{group_username}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        response = requests.get(url, headers=headers, timeout=15)

        if response.status_code != 200:
            print(f"[ERRO] Grupo {group_username} nao acessivel (codigo {response.status_code})")
            return []

        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        messages = []

        # Busca mensagens completas (nao apenas o texto)
        message_widgets = soup.find_all('div', class_='tgme_widget_message')

        for msg_widget in message_widgets[-10:]:  # Ultimas 10 mensagens
            # Extrai o texto
            text_div = msg_widget.find('div', class_='tgme_widget_message_text')
            if not text_div:
                continue

            text = text_div.get_text(strip=True)

            # Extrai todos os links da mensagem (incluindo botoes e links no texto)
            all_links = []

            # Links no texto
            for link in text_div.find_all('a'):
                href = link.get('href')
                if href:
                    all_links.append(href)

            # Links nos botoes
            button_wrap = msg_widget.find('div', class_='tgme_widget_message_link_preview')
            if button_wrap:
                for link in button_wrap.find_all('a'):
                    href = link.get('href')
                    if href:
                        all_links.append(href)

            if PromotionParser.is_promotion(text):
                # Tenta extrair URL do texto primeiro
                url = PromotionParser.extract_url(text)

                # Se nao encontrou no texto, usa os links extraidos do HTML
                if not url and all_links:
                    # Filtra links do telegram e links invalidos
                    product_links = [l for l in all_links if 't.me' not in l.lower() and 'telegram' not in l.lower() and l.startswith('http')]
                    if product_links:
                        url = product_links[0]

                # Valida se a URL eh valida
                if url and url.startswith('http') and 't.me' not in url.lower() and 'telegram' not in url.lower():
                    prices = PromotionParser.extract_prices(text)
                    discount = PromotionParser.extract_discount(text)

                    if discount is None and prices['price'] and prices['old_price']:
                        discount = int(((prices['old_price'] - prices['price']) / prices['old_price']) * 100)

                    store = PromotionParser.extract_store(text + ' ' + url)
                    title = PromotionParser.generate_title(text)

                    promo_data = {
                        'title': title,
                        'description': text[:500],
                        'price': prices['price'],
                        'old_price': prices['old_price'],
                        'discount_percent': discount,
                        'url': url,
                        'store': store,
                        'source_telegram_group': group_username,
                    }

                    # Debug: mostra URL capturada
                    try:
                        print(f"    [DEBUG] URL capturada: {url[:80]}...")
                    except:
                        print(f"    [DEBUG] URL capturada: (url com caracteres especiais)")

                    messages.append(promo_data)

        return messages

    except Exception as e:
        try:
            print(f"[ERRO] Erro ao buscar grupo {group_username}: {e}")
        except:
            print(f"[ERRO] Erro ao buscar grupo {group_username}")
        return []


def main():
    """Funcao principal"""
    import sys
    print("=" * 60, flush=True)
    print("BOT PROMOCOES - MODO SCRAPING PUBLICO", flush=True)
    print("=" * 60, flush=True)
    print(f"Monitorando {len(MONITORED_GROUPS)} grupos", flush=True)
    print("Verificando a cada 5 minutos...", flush=True)
    print("=" * 60, flush=True)
    print(flush=True)
    sys.stdout.flush()

    processed_urls = set()  # Evita duplicatas

    while True:
        try:
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Verificando grupos...")

            total_found = 0

            for group in MONITORED_GROUPS:
                print(f"\n  - Verificando: {group}")
                promotions = fetch_group_preview(group)

                for promo in promotions:
                    # Verifica se ja processou essa URL
                    if promo['url'] in processed_urls:
                        continue

                    processed_urls.add(promo['url'])

                    try:
                        print(f"    [PROMO] {promo['title'][:50]}...")
                        print(f"            Preco: R$ {promo['price']}")
                        print(f"            Loja: {promo['store']}")
                    except UnicodeEncodeError:
                        print(f"    [PROMO] (titulo com caracteres especiais)")
                        print(f"            Preco: R$ {promo['price']}")
                        print(f"            Loja: {promo['store']}")

                    # Envia para API
                    send_to_api(promo)
                    total_found += 1

                    time.sleep(1)  # Aguarda 1s entre envios

                time.sleep(2)  # Aguarda 2s entre grupos

            print(f"\n[OK] Verificacao completa! {total_found} novas promocoes encontradas")
            print(f"Proxima verificacao em 5 minutos...")

            # Aguarda 5 minutos
            time.sleep(300)

        except KeyboardInterrupt:
            print("\n\nEncerrando bot...")
            break
        except Exception as e:
            print(f"\n[ERRO] Erro geral: {e}")
            print("Tentando novamente em 30 segundos...")
            time.sleep(30)


if __name__ == '__main__':
    main()

import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_ENDPOINT = os.getenv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
API_SECRET = os.getenv('API_SECRET_KEY')

# Promocoes encontradas pelo bot
promotions = [
    {
        'title': 'JBL Boombox 4 Bluetooth Amplified Portable 210W',
        'description': 'JBL Boombox 4 Bluetooth Amplified Portable 210W USB e P2 Preto',
        'price': 2331.00,
        'old_price': 3500.00,
        'discount_percent': 33,
        'url': 'https://s.click.aliexpress.com/e/_DmFcIvv',
        'store': 'Aliexpress',
        'category': 'Eletronicos',
        'source_telegram_group': 'economizanderson',
    },
    {
        'title': 'Kit Com 2 Camisetas Masculina Crew-neck Calvin Klein',
        'description': 'Kit Com 2 Camisetas Masculina Crew-neck Calvin Klein Original',
        'price': 40.00,
        'old_price': 120.00,
        'discount_percent': 67,
        'url': 'https://mercadolivre.com.br/camiseta-calvin-klein',
        'store': 'Mercado Livre',
        'category': 'Moda',
        'source_telegram_group': 'economizanderson',
    },
    {
        'title': 'Notebook Gamer Lenovo LOQ E Core i5-12450HX 8GB 512GB',
        'description': 'Notebook Gamer Lenovo LOQ E Core i5-12450HX 8GB 512GB SSD RTX 3050 15.6" FHD',
        'price': 3420.00,
        'old_price': 4500.00,
        'discount_percent': 24,
        'url': 'https://amazon.com.br/notebook-lenovo-loq',
        'store': 'Amazon',
        'category': 'Eletronicos',
        'source_telegram_group': 'descontoemgames',
    },
    {
        'title': 'Controle PowerA Nano com Fio + Grip Pokemon',
        'description': 'Controle PowerA Nano com Fio + Grip Pokemon Sweet Dreams para Nintendo Switch',
        'price': 145.64,
        'old_price': 200.00,
        'discount_percent': 27,
        'url': 'https://amazon.com.br/controle-powera-pokemon',
        'store': 'Amazon',
        'category': 'Games',
        'source_telegram_group': 'descontoemgames',
    },
    {
        'title': 'Suporte Apoio De Notebook Laptop Compacto',
        'description': 'Suporte Apoio De Notebook Laptop Compacto Articulado Ergonomico',
        'price': 10.00,
        'old_price': 30.00,
        'discount_percent': 67,
        'url': 'https://shopee.com.br/suporte-notebook',
        'store': 'Shopee',
        'category': 'Eletronicos',
        'source_telegram_group': 'especialistaemti',
    },
    {
        'title': 'Celular Samsung Galaxy A56 5G, 8GB, 128GB',
        'description': 'Celular Samsung Galaxy A56 5G, 8GB, 128GB, Tela 6.5"',
        'price': 1609.00,
        'old_price': 2200.00,
        'discount_percent': 27,
        'url': 'https://aliexpress.com/samsung-a56',
        'store': 'Aliexpress',
        'category': 'Eletronicos',
        'source_telegram_group': 'especialistaemti',
    },
    {
        'title': 'Echo Dot 5a geracao Amazon, com Alexa',
        'description': 'Echo Dot 5a geracao Amazon, com Alexa, Smart Speaker',
        'price': 255.00,
        'old_price': 350.00,
        'discount_percent': 27,
        'url': 'https://amazon.com.br/echo-dot-5',
        'store': 'Amazon',
        'category': 'Eletronicos',
        'source_telegram_group': 'infoBRpromos',
    },
    {
        'title': 'Placa de Video MSI NVIDIA GeForce RTX 5060',
        'description': 'Placa de Video MSI NVIDIA GeForce RTX 5060 Inspire 8GB GDDR6',
        'price': 1999.00,
        'old_price': 2800.00,
        'discount_percent': 29,
        'url': 'https://kabum.com.br/rtx-5060-msi',
        'store': 'Kabum',
        'category': 'Eletronicos',
        'source_telegram_group': 'infoBRpromos',
    },
    {
        'title': 'Water Cooler DeepCool LE240 V2, ARGB, 240mm',
        'description': 'Water Cooler DeepCool LE240 V2, ARGB, 240mm, Intel e AMD',
        'price': 269.00,
        'old_price': 400.00,
        'discount_percent': 33,
        'url': 'https://kabum.com.br/water-cooler-deepcool',
        'store': 'Kabum',
        'category': 'Eletronicos',
        'source_telegram_group': 'infoBRpromos',
    },
    {
        'title': 'Notebook Acer Aspire Go 15 AG15-71P-76Z8 Intel i7',
        'description': 'Notebook Acer Aspire Go 15 AG15-71P-76Z8 Intel i7 8GB 512GB SSD',
        'price': 2860.00,
        'old_price': 3800.00,
        'discount_percent': 25,
        'url': 'https://amazon.com.br/notebook-acer-aspire',
        'store': 'Amazon',
        'category': 'Eletronicos',
        'source_telegram_group': 'especialistaemti',
    },
    {
        'title': 'Celular Samsung Galaxy S24, 8GB, 256GB',
        'description': 'Celular Samsung Galaxy S24, 8GB, 256GB, Tela de 6.2"',
        'price': 2799.00,
        'old_price': 3800.00,
        'discount_percent': 26,
        'url': 'https://aliexpress.com/samsung-s24',
        'store': 'Aliexpress',
        'category': 'Eletronicos',
        'source_telegram_group': 'especialistaemti',
    },
    {
        'title': 'Webcam Full HD Logitech C920s com Microfone',
        'description': 'Webcam Full HD Logitech C920s com Microfone Embutido 1080p',
        'price': 340.00,
        'old_price': 500.00,
        'discount_percent': 32,
        'url': 'https://amazon.com.br/webcam-logitech-c920s',
        'store': 'Amazon',
        'category': 'Eletronicos',
        'source_telegram_group': 'especialistaemti',
    },
]

def insert_promotions():
    """Insere promocoes via API"""
    print("Inserindo promocoes encontradas pelo bot...")
    print("=" * 60)

    success_count = 0
    error_count = 0

    for promo in promotions:
        try:
            response = requests.post(
                f"{API_ENDPOINT}/api/promotions",
                json=promo,
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {API_SECRET}'
                },
                timeout=10
            )

            if response.status_code == 200:
                print(f"[OK] {promo['title'][:50]}...")
                success_count += 1
            else:
                print(f"[ERRO] {promo['title'][:50]}... - Status: {response.status_code}")
                error_count += 1

        except Exception as e:
            print(f"[ERRO] {promo['title'][:50]}... - {e}")
            error_count += 1

    print("=" * 60)
    print(f"Total: {success_count} inseridas, {error_count} erros")

if __name__ == '__main__':
    insert_promotions()

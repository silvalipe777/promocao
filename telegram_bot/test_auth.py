import os
import sys
from dotenv import load_dotenv
from pyrogram import Client

# Fix encoding para Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

load_dotenv()

API_ID = os.getenv('TELEGRAM_API_ID')
API_HASH = os.getenv('TELEGRAM_API_HASH')
PHONE_NUMBER = os.getenv('TELEGRAM_PHONE_NUMBER')

print(f"API_ID: {API_ID}")
print(f"API_HASH: {API_HASH[:10]}...")
print(f"PHONE: {PHONE_NUMBER}")
print("\nTentando conectar ao Telegram...")

try:
    app = Client(
        "test_session",
        api_id=API_ID,
        api_hash=API_HASH,
        phone_number=PHONE_NUMBER
    )

    print("Cliente criado com sucesso!")
    print("Iniciando conexão...")

    app.start()

    print("✅ Conectado com sucesso!")
    print(f"Conta: {app.get_me().first_name}")

    app.stop()

except Exception as e:
    print(f"❌ Erro: {e}")
    import traceback
    traceback.print_exc()

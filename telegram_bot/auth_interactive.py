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

print("=" * 60)
print("🔐 AUTENTICAÇÃO TELEGRAM - PROMOHUNT BOT")
print("=" * 60)
print(f"📱 Número: {PHONE_NUMBER}")
print(f"🔑 API ID: {API_ID}")
print("=" * 60)
print("\n⏳ Conectando ao Telegram...")
print("📨 Um código será enviado para o seu número via SMS ou Telegram.")
print("🔢 Digite o código quando solicitado.\n")

app = Client(
    "promohunt_session",
    api_id=API_ID,
    api_hash=API_HASH,
    phone_number=PHONE_NUMBER
)

try:
    app.start()

    me = app.get_me()
    print("\n" + "=" * 60)
    print("✅ AUTENTICAÇÃO REALIZADA COM SUCESSO!")
    print("=" * 60)
    print(f"👤 Nome: {me.first_name}")
    print(f"📱 Telefone: {me.phone_number}")
    print(f"🆔 ID: {me.id}")
    print("=" * 60)
    print("\n✨ Arquivo de sessão criado com sucesso!")
    print("📁 Arquivo: promohunt_session.session")
    print("\n🚀 Agora você pode rodar o bot normalmente com: python main.py")
    print("=" * 60)

    app.stop()

except Exception as e:
    print("\n" + "=" * 60)
    print("❌ ERRO NA AUTENTICAÇÃO")
    print("=" * 60)
    print(f"Erro: {e}")
    print("=" * 60)
    import traceback
    traceback.print_exc()

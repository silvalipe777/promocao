import os
import sys
from dotenv import load_dotenv
from telethon.sync import TelegramClient

load_dotenv()

API_ID = int(os.getenv('TELEGRAM_API_ID'))
API_HASH = os.getenv('TELEGRAM_API_HASH')
PHONE = os.getenv('TELEGRAM_PHONE_NUMBER')

def main():
    """Script de autenticacao"""
    print("=" * 60)
    print("AUTENTICACAO DO BOT TELEGRAM")
    print("=" * 60)
    print("\nVoce vai receber um codigo no seu Telegram.")
    print("Digite o codigo quando solicitado.\n")

    # Cria cliente sincronizado (mais simples para autenticacao)
    with TelegramClient('promohunt_telethon', API_ID, API_HASH) as client:
        client.start(phone=PHONE)

        me = client.get_me()
        print(f"\n[OK] Autenticado com sucesso!")
        print(f"Usuario: {me.first_name} {me.last_name or ''}")
        print(f"Telefone: {me.phone}")
        print(f"\nSessao salva em: promohunt_telethon.session")
        print("\nAgora voce pode executar o bot com: python bot_telethon.py")
        print("\nPressione Enter para sair...")
        input()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\nCancelado pelo usuario")
    except Exception as e:
        print(f"\n[ERRO] {e}")
        sys.exit(1)

import Link from 'next/link'
import { Zap, Heart, Github, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              <Zap className="w-6 h-6" />
              <span>PromoHunt Brasil</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              As melhores promoções do Brasil, capturadas em tempo real dos grupos do Telegram.
              Economize dinheiro e não perca nenhuma oferta!
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@promohunt.com.br"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Promoções
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/registro" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Criar conta
                </Link>
              </li>
            </ul>
          </div>

          {/* Lojas Parceiras */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Lojas Monitoradas
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Amazon</li>
              <li>Shopee</li>
              <li>Mercado Livre</li>
              <li>Aliexpress</li>
              <li>Magalu</li>
              <li>Kabum</li>
              <li>E muito mais...</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            © 2024 PromoHunt Brasil. Desenvolvido com <Heart className="w-4 h-4 inline text-red-500 fill-current" /> para a comunidade.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              Privacidade
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              Termos
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

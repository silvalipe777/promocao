import { Sparkles, Zap, TrendingDown } from 'lucide-react'

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)] pointer-events-none" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-pulse-slow">
        <Sparkles className="w-8 h-8 text-primary-200 opacity-50" />
      </div>
      <div className="absolute bottom-20 right-10 animate-pulse-slow" style={{ animationDelay: '1s' }}>
        <Zap className="w-10 h-10 text-primary-200 opacity-50" />
      </div>
      <div className="absolute top-1/2 right-1/4 animate-pulse-slow" style={{ animationDelay: '2s' }}>
        <TrendingDown className="w-6 h-6 text-primary-200 opacity-50" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Atualizado em tempo real</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            As Melhores Promoções
            <br />
            <span className="text-primary-200">do Brasil</span>
          </h1>

          <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Descubra ofertas incríveis capturadas automaticamente dos melhores grupos do Telegram.
            Economize dinheiro e não perca nenhuma promoção!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-primary-100">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Monitorando 24/7</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-primary-300 rounded-full" />
            <div className="flex items-center gap-2 text-primary-100">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm">Até 90% de desconto</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-primary-300 rounded-full" />
            <div className="flex items-center gap-2 text-primary-100">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Novas ofertas diariamente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 sm:h-16 text-gray-50 dark:text-gray-900"
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48h1440V0c-274.29 48-548.57 48-822.86 0C342.86 48 171.43 48 0 0v48z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  )
}

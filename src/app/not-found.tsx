import Link from 'next/link'
import { AlertCircle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Página não encontrada
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Desculpe, não conseguimos encontrar a página que você está procurando.
          Ela pode ter sido removida ou o link está incorreto.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          <Home className="w-5 h-5" />
          <span>Voltar para a home</span>
        </Link>
      </div>
    </div>
  )
}

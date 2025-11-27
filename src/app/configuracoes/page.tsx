import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Settings, Bell, User, Moon } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Configurações
          </h1>
        </div>

        <div className="space-y-6">
          {/* Perfil */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Perfil
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-900 dark:text-gray-100">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID do Usuário
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 text-sm font-mono">
                  {user.id}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Membro desde
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-900 dark:text-gray-100">
                  {new Date(user.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Notificações */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Notificações
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Notificações Push
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receba alertas de novas promoções em tempo real
                  </p>
                </div>
                <button
                  onClick={() => {
                    if ('Notification' in window) {
                      Notification.requestPermission()
                    }
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Ativar
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status atual:{' '}
                  <span className="font-medium">
                    {typeof window !== 'undefined' && 'Notification' in window
                      ? Notification.permission === 'granted'
                        ? '✅ Ativadas'
                        : '⚠️ Desativadas'
                      : '❌ Não suportado'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Preferências */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Preferências
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Tema
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use o botão na barra de navegação para alternar entre claro e escuro
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Suas Estatísticas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  Promoções Favoritadas
                </p>
                <p className="text-3xl font-bold text-primary-700 dark:text-primary-300 mt-2">
                  {/* Você pode adicionar uma query aqui */}
                  -
                </p>
              </div>

              <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4">
                <p className="text-sm text-accent-600 dark:text-accent-400 font-medium">
                  Economia Total Estimada
                </p>
                <p className="text-3xl font-bold text-accent-700 dark:text-accent-300 mt-2">
                  R$ -
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

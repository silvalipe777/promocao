'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

export function NotificationPrompt() {
  const [show, setShow] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)

      // Mostra o prompt após 5 segundos se não tiver permissão
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setShow(true)
        }, 5000)

        return () => clearTimeout(timer)
      }
    }
  }, [])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      setShow(false)

      if (result === 'granted') {
        new Notification('PromoHunt Brasil', {
          body: 'Você receberá notificações de novas promoções!',
          icon: '/icon.png',
        })
      }
    }
  }

  if (!show || permission !== 'default') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Ativar notificações?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Receba alertas instantâneos quando novas promoções forem encontradas!
            </p>

            <div className="flex gap-2">
              <button
                onClick={requestPermission}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Ativar
              </button>
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Agora não
              </button>
            </div>
          </div>

          <button
            onClick={() => setShow(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

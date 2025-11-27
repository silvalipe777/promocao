'use client'

import { useEffect, useState } from 'react'
import { Promotion } from '@/types/database'
import { PromotionCard } from '@/components/PromotionCard'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { Loader2, Sparkles, X } from 'lucide-react'

interface PromotionsListProps {
  initialPromotions: Promotion[]
  currentCategory?: string
  currentStore?: string
}

export function PromotionsList({ initialPromotions, currentCategory, currentStore }: PromotionsListProps) {
  const { user } = useAuth()
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [newPromotionsCount, setNewPromotionsCount] = useState(0)
  const [showNewPromotionsBanner, setShowNewPromotionsBanner] = useState(false)

  useEffect(() => {
    setPromotions(initialPromotions)
  }, [initialPromotions])

  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      setFavorites(new Set())
    }
  }, [user])

  useEffect(() => {
    const channel = supabase
      .channel('promotions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'promotions',
        },
        (payload) => {
          const newPromotion = payload.new as Promotion

          // Verifica se a nova promoção corresponde aos filtros ativos
          const matchesCategory = !currentCategory || newPromotion.category === currentCategory
          const matchesStore = !currentStore || newPromotion.store === currentStore

          if (matchesCategory && matchesStore) {
            setPromotions((prev) => [newPromotion, ...prev])
            setNewPromotionsCount((prev) => prev + 1)
            setShowNewPromotionsBanner(true)

            // Auto-hide banner after 5 seconds
            setTimeout(() => {
              setShowNewPromotionsBanner(false)
              setNewPromotionsCount(0)
            }, 5000)

            if (typeof window !== 'undefined' && 'Notification' in window) {
              if (Notification.permission === 'granted') {
                new Notification('Nova Promoção!', {
                  body: newPromotion.title,
                  icon: newPromotion.image || '/icon.png',
                })
              }
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'promotions',
        },
        (payload) => {
          const updatedPromotion = payload.new as Promotion

          // Verifica se a promoção atualizada corresponde aos filtros
          const matchesCategory = !currentCategory || updatedPromotion.category === currentCategory
          const matchesStore = !currentStore || updatedPromotion.store === currentStore

          if (matchesCategory && matchesStore) {
            setPromotions((prev) =>
              prev.map((p) => (p.id === updatedPromotion.id ? updatedPromotion : p))
            )
          } else {
            // Remove a promoção se não corresponder mais aos filtros
            setPromotions((prev) => prev.filter((p) => p.id !== updatedPromotion.id))
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'promotions',
        },
        (payload) => {
          const deletedPromotion = payload.old as Promotion
          setPromotions((prev) => prev.filter((p) => p.id !== deletedPromotion.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentCategory, currentStore])

  const loadFavorites = async () => {
    if (!user) return

    const { data } = await supabase
      .from('favorites')
      .select('promotion_id')
      .eq('user_id', user.id)

    if (data) {
      setFavorites(new Set(data.map((f) => f.promotion_id)))
    }
  }

  return (
    <div>
      {/* New Promotions Banner */}
      {showNewPromotionsBanner && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">
              {newPromotionsCount === 1
                ? '1 nova promoção adicionada!'
                : `${newPromotionsCount} novas promoções adicionadas!`}
            </span>
            <button
              onClick={() => {
                setShowNewPromotionsBanner(false)
                setNewPromotionsCount(0)
              }}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            promotion={promotion}
            isFavorited={favorites.has(promotion.id)}
            onFavoriteChange={loadFavorites}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}
    </div>
  )
}

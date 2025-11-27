'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  promotionId: string
}

export function FavoriteButton({ promotionId }: FavoriteButtonProps) {
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      checkFavorite()
    }
  }, [user, promotionId])

  const checkFavorite = async () => {
    if (!user) return

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('promotion_id', promotionId)
      .single()

    setFavorited(!!data)
  }

  const handleToggle = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    setLoading(true)

    try {
      if (favorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('promotion_id', promotionId)

        if (!error) {
          setFavorited(false)
        }
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            promotion_id: promotionId,
          })

        if (!error) {
          setFavorited(true)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "flex items-center justify-center gap-2 flex-1 px-6 py-4 rounded-lg font-semibold transition-all border-2",
        favorited
          ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
        loading && "opacity-50 cursor-not-allowed"
      )}
    >
      <Heart className={cn("w-5 h-5", favorited && "fill-current")} />
      <span>{favorited ? 'Remover favorito' : 'Adicionar favorito'}</span>
    </button>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ExternalLink, Tag } from 'lucide-react'
import { Promotion } from '@/types/database'
import { formatPrice, formatDiscount, getTimeAgo, extractDomain, cn } from '@/lib/utils'
import { useAuth } from '@/components/AuthProvider'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface PromotionCardProps {
  promotion: Promotion
  isFavorited?: boolean
  onFavoriteChange?: () => void
}

export function PromotionCard({ promotion, isFavorited = false, onFavoriteChange }: PromotionCardProps) {
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(isFavorited)
  const [loading, setLoading] = useState(false)

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
          .eq('promotion_id', promotion.id)

        if (!error) {
          setFavorited(false)
          onFavoriteChange?.()
        }
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            promotion_id: promotion.id,
          })

        if (!error) {
          setFavorited(true)
          onFavoriteChange?.()
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  const domain = extractDomain(promotion.url)

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <Link href={`/promocao/${promotion.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          {promotion.image ? (
            <Image
              src={promotion.image}
              alt={promotion.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="w-16 h-16 text-gray-300 dark:text-gray-600" />
            </div>
          )}

          {/* Discount Badge */}
          {promotion.discount_percent && (
            <div className="absolute top-3 left-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {formatDiscount(promotion.discount_percent)}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={loading}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all",
              favorited && "text-red-500",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Heart
              className={cn("w-5 h-5", favorited && "fill-current")}
            />
          </button>

          {/* Store Badge */}
          {promotion.store && (
            <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium">
              {promotion.store}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {promotion.title}
          </h3>

          {/* Description */}
          {promotion.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {promotion.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            {promotion.old_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(promotion.old_price)}
              </span>
            )}
            {promotion.price !== null && (
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(promotion.price)}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span>{domain}</span>
            </div>
            <span>{getTimeAgo(promotion.created_at)}</span>
          </div>

          {/* Category */}
          {promotion.category && (
            <div className="mt-2">
              <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                {promotion.category}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

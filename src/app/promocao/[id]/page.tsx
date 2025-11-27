import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Calendar, Tag, Store, ArrowLeft, Share2 } from 'lucide-react'
import { formatPrice, formatDiscount, getTimeAgo } from '@/lib/utils'
import { FavoriteButton } from '@/components/FavoriteButton'
import { ShareButton } from '@/components/ShareButton'

export const revalidate = 0

export default async function PromotionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: promotion, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !promotion) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative aspect-video lg:aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {promotion.image ? (
                <Image
                  src={promotion.image}
                  alt={promotion.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="w-24 h-24 text-gray-300 dark:text-gray-600" />
                </div>
              )}

              {promotion.discount_percent && (
                <div className="absolute top-4 left-4 bg-accent-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  {formatDiscount(promotion.discount_percent)}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {promotion.title}
                </h1>

                {/* Description */}
                {promotion.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {promotion.description}
                  </p>
                )}

                {/* Price */}
                <div className="mb-6">
                  {promotion.old_price && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-400 line-through text-lg">
                        {formatPrice(promotion.old_price)}
                      </span>
                      {promotion.discount_percent && (
                        <span className="bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 px-3 py-1 rounded-full text-sm font-semibold">
                          {formatDiscount(promotion.discount_percent)} OFF
                        </span>
                      )}
                    </div>
                  )}
                  {promotion.price !== null ? (
                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {formatPrice(promotion.price)}
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-accent-600 dark:text-accent-400">
                      Grátis
                    </div>
                  )}
                </div>

                {/* Meta Information */}
                <div className="space-y-3 mb-6">
                  {promotion.store && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Store className="w-5 h-5" />
                      <span>{promotion.store}</span>
                    </div>
                  )}

                  {promotion.category && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Tag className="w-5 h-5" />
                      <span>{promotion.category}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <span>Postado {getTimeAgo(promotion.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <a
                  href={promotion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Ir para a oferta</span>
                </a>

                <div className="flex gap-3">
                  <FavoriteButton promotionId={promotion.id} />
                  <ShareButton
                    title={promotion.title}
                    url={`${process.env.NEXT_PUBLIC_SITE_URL}/promocao/${promotion.id}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 dark:bg-gray-900 px-8 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fonte: <span className="font-medium">{promotion.source_telegram_group}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

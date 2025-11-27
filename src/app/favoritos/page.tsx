import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PromotionCard } from '@/components/PromotionCard'
import { Heart } from 'lucide-react'

export const revalidate = 0

export default async function FavoritesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      promotion_id,
      promotions (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const promotions = favorites?.map((f: any) => f.promotions).filter(Boolean) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary-600 dark:text-primary-400 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Meus Favoritos
          </h1>
        </div>

        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion: any) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                isFavorited={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Comece a favoritar promoções para vê-las aqui!
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Ver promoções
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

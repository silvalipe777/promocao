import { createClient } from '@/lib/supabase/server'
import { PromotionCard } from '@/components/PromotionCard'
import { PromotionsList } from '@/components/PromotionsList'
import { Filter } from '@/components/Filter'
import { Hero } from '@/components/Hero'
import { Stats } from '@/components/Stats'

export const revalidate = 0

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : ''
  const store = typeof params.store === 'string' ? params.store : ''
  const category = typeof params.category === 'string' ? params.category : ''
  const minPrice = typeof params.minPrice === 'string' ? parseFloat(params.minPrice) : undefined
  const maxPrice = typeof params.maxPrice === 'string' ? parseFloat(params.maxPrice) : undefined
  const minDiscount = typeof params.minDiscount === 'string' ? parseFloat(params.minDiscount) : undefined
  const sort = typeof params.sort === 'string' ? params.sort : 'recent'

  const supabase = await createClient()

  let query = supabase
    .from('promotions')
    .select('*')

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (store) {
    query = query.eq('store', store)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice).not('price', 'is', null)
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice).not('price', 'is', null)
  }

  if (minDiscount !== undefined) {
    query = query.gte('discount_percent', minDiscount).not('discount_percent', 'is', null)
  }

  // Aplicar ordenação
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true, nullsFirst: false })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false, nullsFirst: false })
      break
    case 'discount':
      query = query.order('discount_percent', { ascending: false, nullsFirst: false })
      break
    case 'recent':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data: promotions, error } = await query.limit(50)

  if (error) {
    console.error('Error fetching promotions:', error)
  }

  const { data: stores } = await supabase
    .from('promotions')
    .select('store')
    .not('store', 'is', null)
    .order('store')

  const uniqueStores = Array.from(new Set(stores?.map((s) => s.store))).filter(Boolean) as string[]

  const { data: categories } = await supabase
    .from('promotions')
    .select('category')
    .not('category', 'is', null)
    .order('category')

  const uniqueCategories = Array.from(new Set(categories?.map((c) => c.category))).filter(Boolean) as string[]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="py-8">
          <Stats
            totalPromotions={promotions?.length || 0}
            todayPromotions={promotions?.filter(p => {
              const today = new Date()
              const createdAt = new Date(p.created_at)
              return createdAt.toDateString() === today.toDateString()
            }).length || 0}
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Filter
            stores={uniqueStores}
            categories={uniqueCategories}
            currentStore={store}
            currentCategory={category}
          />
        </div>

        {/* Promotions Grid */}
        <div className="pb-12">
          {promotions && promotions.length > 0 ? (
            <PromotionsList
              initialPromotions={promotions}
              currentCategory={category}
              currentStore={store}
            />
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Nenhuma promoção encontrada.
              </p>
              {search && (
                <p className="text-gray-400 dark:text-gray-500 mt-2">
                  Tente buscar por outro termo.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

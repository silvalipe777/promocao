'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter as FilterIcon, X, ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FilterProps {
  stores: string[]
  categories: string[]
  currentStore?: string
  currentCategory?: string
}

export function Filter({ stores, categories, currentStore, currentCategory }: FilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentMinDiscount = searchParams.get('minDiscount') || ''
  const currentSort = searchParams.get('sort') || 'recent'

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/')
  }

  const hasActiveFilters = currentStore || currentCategory || currentMinPrice || currentMaxPrice || currentMinDiscount || (currentSort && currentSort !== 'recent')

  return (
    <div className="space-y-4">
      {/* Quick Category Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleFilterChange('category', currentCategory === 'PS5' ? '' : 'PS5')}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all duration-200",
            currentCategory === 'PS5'
              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
              : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 text-gray-700 dark:text-gray-300"
          )}
        >
          🎮 PS5
        </button>
        <button
          onClick={() => handleFilterChange('category', currentCategory === 'Monitor' ? '' : 'Monitor')}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all duration-200",
            currentCategory === 'Monitor'
              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
              : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 text-gray-700 dark:text-gray-300"
          )}
        >
          🖥️ Monitor
        </button>
        <button
          onClick={() => handleFilterChange('category', currentCategory === 'Memória RAM' ? '' : 'Memória RAM')}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all duration-200",
            currentCategory === 'Memória RAM'
              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
              : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 text-gray-700 dark:text-gray-300"
          )}
        >
          💾 Memória RAM
        </button>
      </div>

      {/* Sort and Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        {/* Sort Dropdown */}
        <select
          value={currentSort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          <option value="recent">Mais Recentes</option>
          <option value="price_asc">Menor Preço</option>
          <option value="price_desc">Maior Preço</option>
          <option value="discount">Maior Desconto</option>
        </select>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FilterIcon className="w-4 h-4" />
          <span>Filtros Avançados</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
              Ativos
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Filtrar por
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Filter */}
            {stores.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loja
                </label>
                <select
                  value={currentStore || ''}
                  onChange={(e) => handleFilterChange('store', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todas as lojas</option>
                  {stores.map((store) => (
                    <option key={store} value={store}>
                      {store}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  value={currentCategory || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Min Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preço Mínimo
              </label>
              <input
                type="number"
                value={currentMinPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="R$ 0"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preço Máximo
              </label>
              <input
                type="number"
                value={currentMaxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="R$ 10000"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Min Discount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desconto Mínimo (%)
              </label>
              <input
                type="number"
                value={currentMinDiscount}
                onChange={(e) => handleFilterChange('minDiscount', e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {currentStore && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  <span>Loja: {currentStore}</span>
                  <button
                    onClick={() => handleFilterChange('store', '')}
                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {currentCategory && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  <span>Categoria: {currentCategory}</span>
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {currentMinPrice && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  <span>Preço Min: R$ {currentMinPrice}</span>
                  <button
                    onClick={() => handleFilterChange('minPrice', '')}
                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {currentMaxPrice && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  <span>Preço Max: R$ {currentMaxPrice}</span>
                  <button
                    onClick={() => handleFilterChange('maxPrice', '')}
                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {currentMinDiscount && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  <span>Desconto Min: {currentMinDiscount}%</span>
                  <button
                    onClick={() => handleFilterChange('minDiscount', '')}
                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {currentSort && currentSort !== 'recent' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  <span>
                    Ordem: {currentSort === 'price_asc' ? 'Menor Preço' :
                            currentSort === 'price_desc' ? 'Maior Preço' :
                            'Maior Desconto'}
                  </span>
                  <button
                    onClick={() => handleFilterChange('sort', 'recent')}
                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

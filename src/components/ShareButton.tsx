'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface ShareButtonProps {
  title: string
  url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Error copying to clipboard:', error)
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 flex-1 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5" />
          <span>Copiado!</span>
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5" />
          <span>Compartilhar</span>
        </>
      )}
    </button>
  )
}

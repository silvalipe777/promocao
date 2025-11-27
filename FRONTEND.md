# 🎨 Frontend - PromoHunt Brasil

## Estrutura do Frontend

### Páginas (App Router)

```
src/app/
├── page.tsx                 # Homepage com lista de promoções
├── layout.tsx               # Layout principal
├── loading.tsx              # Loading state global
├── error.tsx                # Error boundary global
├── not-found.tsx            # Página 404
├── globals.css              # Estilos globais
│
├── api/
│   └── promotions/
│       └── route.ts         # API endpoint
│
├── favoritos/
│   └── page.tsx             # Página de favoritos
│
├── login/
│   └── page.tsx             # Página de login
│
├── registro/
│   └── page.tsx             # Página de registro
│
├── configuracoes/
│   └── page.tsx             # Página de configurações
│
└── promocao/
    └── [id]/
        └── page.tsx         # Página individual da promoção
```

### Componentes

#### Layout & Navegação
- **`Navbar.tsx`** - Barra de navegação com busca, menu e autenticação
- **`Footer.tsx`** - Rodapé com links e informações
- **`Hero.tsx`** - Banner principal da homepage com animações
- **`ScrollToTop.tsx`** - Botão flutuante para voltar ao topo

#### Promoções
- **`PromotionCard.tsx`** - Card individual de promoção
- **`PromotionsList.tsx`** - Lista com realtime e favoritos
- **`PromotionCardSkeleton.tsx`** - Loading state dos cards
- **`Filter.tsx`** - Sistema de filtros (loja, categoria, preço)
- **`Stats.tsx`** - Estatísticas da homepage

#### UI & UX
- **`FavoriteButton.tsx`** - Botão de favoritar (página individual)
- **`ShareButton.tsx`** - Botão de compartilhar
- **`EmptyState.tsx`** - Estado vazio (sem resultados)
- **`NotificationPrompt.tsx`** - Prompt de permissão de notificações

#### Providers
- **`Providers.tsx`** - Agrupa todos os providers
- **`ThemeProvider.tsx`** - Dark/Light mode
- **`AuthProvider.tsx`** - Contexto de autenticação

### Tecnologias Frontend

| Tecnologia | Uso |
|------------|-----|
| **Next.js 14** | Framework React com App Router |
| **React 18** | Biblioteca UI |
| **TypeScript** | Tipagem estática |
| **TailwindCSS** | Estilização |
| **Lucide React** | Ícones |
| **Framer Motion** | Animações (pronto para uso) |
| **Supabase JS** | Client para banco e auth |
| **@supabase/ssr** | Server-side rendering |

## Recursos Implementados

### ✅ Design & UI

- 🎨 Design profissional estilo Pelando/Promobit
- 🌓 Dark mode e Light mode completos
- 📱 100% responsivo (mobile-first)
- 🎭 Animações suaves
- ⚡ Loading states e skeletons
- 🎯 Empty states informativos
- 🔝 Scroll to top
- 💫 Hero section com efeitos visuais

### ✅ Funcionalidades

- 🔍 **Busca em tempo real** - Navbar com busca global
- 🏷️ **Filtros avançados** - Por loja, categoria, preço
- ⭐ **Sistema de favoritos** - Salvar promoções
- 🔔 **Notificações push** - Alertas de novas ofertas
- ⚡ **Realtime updates** - Supabase Realtime
- 🔐 **Autenticação completa** - Login/Registro
- 👤 **Perfil de usuário** - Configurações
- 📊 **Estatísticas** - Cards com métricas

### ✅ Performance

- ⚡ Server Components (Next.js 14)
- 🖼️ Otimização de imagens (next/image)
- 📦 Code splitting automático
- 🔄 Revalidação inteligente
- 💾 Cache otimizado

### ✅ Acessibilidade

- ♿ Semântica HTML correta
- ⌨️ Navegação por teclado
- 🎯 ARIA labels
- 🌈 Contraste adequado
- 📱 Touch targets otimizados

## Paleta de Cores

### Light Mode
```css
Background: #F9FAFB (gray-50)
Card: #FFFFFF (white)
Text: #111827 (gray-900)
Primary: #EF4444 (red-500)
Accent: #22C55E (green-500)
```

### Dark Mode
```css
Background: #111827 (gray-900)
Card: #1F2937 (gray-800)
Text: #F9FAFB (gray-50)
Primary: #F87171 (red-400)
Accent: #4ADE80 (green-400)
```

## Componentes Principais

### Hero Section
```tsx
<Hero />
```
Banner principal com:
- Gradiente animado
- Grid pattern de fundo
- Elementos flutuantes
- Wave SVG no rodapé
- Badges informativos

### Promotion Card
```tsx
<PromotionCard
  promotion={promotion}
  isFavorited={false}
  onFavoriteChange={() => {}}
/>
```
Features:
- Imagem responsiva
- Badge de desconto
- Botão de favorito
- Preço com riscado
- Loja e categoria
- Timestamp relativo
- Hover effects

### Filter System
```tsx
<Filter
  stores={['Amazon', 'Shopee']}
  categories={['Eletrônicos', 'Moda']}
  currentStore="Amazon"
  currentCategory=""
/>
```
Features:
- Dropdown de lojas
- Dropdown de categorias
- Tags de filtros ativos
- Limpar filtros
- URL query params

### Stats Cards
```tsx
<Stats
  totalPromotions={150}
  todayPromotions={23}
/>
```
Exibe:
- Promoções ativas
- Adicionadas hoje
- Economia média
- Lojas monitoradas

## States & Contextos

### Theme Context
```tsx
const { theme, toggleTheme } = useTheme()
// 'light' | 'dark'
```

### Auth Context
```tsx
const { user, session, loading, signIn, signUp, signOut } = useAuth()
```

## Hooks Personalizados

Você pode criar hooks personalizados em `src/hooks/`:

```tsx
// src/hooks/usePromotions.ts
export function usePromotions() {
  // lógica de promoções
}

// src/hooks/useFavorites.ts
export function useFavorites() {
  // lógica de favoritos
}
```

## Realtime Updates

As promoções são atualizadas em tempo real via Supabase:

```tsx
// PromotionsList.tsx
useEffect(() => {
  const channel = supabase
    .channel('promotions-changes')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'promotions',
    }, (payload) => {
      setPromotions(prev => [payload.new, ...prev])
      // Notificação push
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [])
```

## Notificações Push

```tsx
// NotificationPrompt.tsx
const requestPermission = async () => {
  const result = await Notification.requestPermission()

  if (result === 'granted') {
    new Notification('PromoHunt Brasil', {
      body: 'Você receberá notificações!',
      icon: '/icon.png'
    })
  }
}
```

Quando uma nova promoção chega via Realtime:

```tsx
if (Notification.permission === 'granted') {
  new Notification('Nova Promoção!', {
    body: promotion.title,
    icon: promotion.image || '/icon.png'
  })
}
```

## Responsividade

### Breakpoints (TailwindCSS)

```
sm:  640px   # Tablet pequeno
md:  768px   # Tablet
lg:  1024px  # Desktop pequeno
xl:  1280px  # Desktop
2xl: 1536px  # Desktop grande
```

### Grid de Promoções

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 coluna */}
  {/* Tablet: 2 colunas */}
  {/* Desktop: 3 colunas */}
</div>
```

## Customização

### Mudar Cores Primárias

Edite `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        50: '#fef2f2',
        // ... suas cores
        900: '#7f1d1d',
      },
    },
  },
}
```

### Adicionar Fonte Customizada

Em `layout.tsx`:

```tsx
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700']
})

// Use: className={poppins.className}
```

### Criar Novo Componente

```bash
# Criar arquivo
touch src/components/MeuComponente.tsx
```

```tsx
// MeuComponente.tsx
'use client' // Se precisar de interatividade

import { useState } from 'react'

export function MeuComponente() {
  return (
    <div className="...">
      Meu componente
    </div>
  )
}
```

## Performance Tips

### 1. Use Server Components quando possível

```tsx
// ✅ Bom (Server Component)
export default async function Page() {
  const data = await fetch(...)
  return <div>{data}</div>
}

// ❌ Evite Client Component desnecessário
'use client'
export default function Page() { ... }
```

### 2. Otimize Imagens

```tsx
import Image from 'next/image'

<Image
  src={promotion.image}
  alt={promotion.title}
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  className="object-cover"
/>
```

### 3. Use Skeleton durante Loading

```tsx
import { PromotionsGridSkeleton } from '@/components/PromotionCardSkeleton'

export default function Page() {
  return (
    <Suspense fallback={<PromotionsGridSkeleton count={6} />}>
      <PromotionsList />
    </Suspense>
  )
}
```

## Deploy Frontend

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel

# Configure env vars no dashboard
```

### Build Local

```bash
npm run build
npm start
```

## Estrutura de Arquivos Completa

```
src/
├── app/                     # Pages & Routes
│   ├── api/                 # API Routes
│   ├── favoritos/
│   ├── login/
│   ├── promocao/
│   ├── registro/
│   ├── configuracoes/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/              # Componentes React
│   ├── AuthProvider.tsx
│   ├── EmptyState.tsx
│   ├── FavoriteButton.tsx
│   ├── Filter.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── NotificationPrompt.tsx
│   ├── PromotionCard.tsx
│   ├── PromotionCardSkeleton.tsx
│   ├── PromotionsList.tsx
│   ├── Providers.tsx
│   ├── ScrollToTop.tsx
│   ├── ShareButton.tsx
│   ├── Stats.tsx
│   └── ThemeProvider.tsx
│
├── lib/                     # Utilitários
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
│
└── types/                   # TypeScript Types
    └── database.ts
```

## Próximos Passos Frontend

Sugestões de melhorias:

- [ ] Adicionar infinite scroll na lista
- [ ] Implementar sistema de tags
- [ ] Criar página de categorias
- [ ] Adicionar gráficos de economia
- [ ] Sistema de comentários
- [ ] Compartilhamento social aprimorado
- [ ] PWA (Progressive Web App)
- [ ] App mobile com React Native

---

**Frontend pronto e otimizado! 🎨✨**

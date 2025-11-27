import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Verifica autenticação
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.API_SECRET_KEY}`

    if (authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validação básica
    if (!body.title || !body.url) {
      return NextResponse.json(
        { error: 'Missing required fields: title and url' },
        { status: 400 }
      )
    }

    // Verifica se a promoção já existe (evita duplicatas)
    const { data: existing } = await supabase
      .from('promotions')
      .select('id')
      .eq('url', body.url)
      .single()

    if (existing) {
      return NextResponse.json(
        { message: 'Promotion already exists', id: existing.id },
        { status: 200 }
      )
    }

    // Insere a nova promoção
    const { data, error } = await supabase
      .from('promotions')
      .insert({
        title: body.title,
        description: body.description || null,
        price: body.price || null,
        old_price: body.old_price || null,
        discount_percent: body.discount_percent || null,
        url: body.url,
        image: body.image || null,
        store: body.store || null,
        category: body.category || null,
        source_telegram_group: body.source_telegram_group || 'Telegram',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create promotion', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      promotion: data,
    })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch promotions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ promotions: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File) || !file.type.startsWith('image/')) return NextResponse.json({ error: 'Image required' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
  const blob = await put(`profiles/${session.user.id}/${crypto.randomUUID()}-${file.name}`, file, { access: 'public' })
  return NextResponse.json({ url: blob.url })
}

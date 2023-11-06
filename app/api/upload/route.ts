import { put, list, del } from '@vercel/blob'
import { NextResponse, NextRequest } from 'next/server'
import { customAlphabet } from 'nanoid'

export const runtime = 'edge'

export async function POST(req: Request) {
  const file = req.body || ''
  const contentType = req.headers.get('content-type') || 'text/plain'
  const filename = req.headers.get('x-filename')
  // @ts-ignore
  const blob = await put(filename, file, {
    contentType,
    access: 'public',
  })

  return NextResponse.json(blob)
}

export async function GET(req: Request) {
  const results = await list()
    return NextResponse.json({results})
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const fileUrl = url.searchParams.get("url")
  console.log(fileUrl)
  // @ts-ignore
  const blob = await del(fileUrl)
  return NextResponse.json(blob)
}
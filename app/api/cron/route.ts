import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/process-feeds`, {
      method: 'GET',
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


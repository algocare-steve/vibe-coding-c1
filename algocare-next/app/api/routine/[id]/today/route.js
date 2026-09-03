import { toggleRoutineToday } from '@/lib/routine'

export async function POST(request, { params }) {
  const { id } = await params
  const result = toggleRoutineToday(id)

  if (result.error === 'NOT_FOUND') {
    return Response.json({ error: 'NOT_FOUND' }, { status: 404 })
  }
  if (result.error === 'NOT_ADDED') {
    return Response.json({ error: 'NOT_ADDED' }, { status: 409 })
  }

  return Response.json(result.state)
}

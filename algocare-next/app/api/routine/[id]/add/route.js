import { toggleRoutineAdd } from '@/lib/routine'

export async function POST(request, { params }) {
  const { id } = await params
  const result = toggleRoutineAdd(id)

  if (result.error === 'NOT_FOUND') {
    return Response.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  return Response.json(result.state)
}

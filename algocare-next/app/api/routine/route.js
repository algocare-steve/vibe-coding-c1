import { getState } from '@/lib/routine'

export async function GET() {
  return Response.json(getState())
}

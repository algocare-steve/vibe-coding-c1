const API_BASE = 'http://localhost:3000'

export async function fetchRoutine() {
  const res = await fetch(`${API_BASE}/api/routine`)
  if (!res.ok) throw new Error('루틴 정보를 불러오지 못했습니다.')
  return res.json()
}

export async function toggleAdd(id) {
  const res = await fetch(`${API_BASE}/api/routine/${id}/add`, { method: 'POST' })
  if (!res.ok) throw new Error('담기 처리에 실패했습니다.')
  return res.json()
}

export async function toggleToday(id) {
  const res = await fetch(`${API_BASE}/api/routine/${id}/today`, { method: 'POST' })
  if (!res.ok) throw new Error('오늘 챙김 처리에 실패했습니다.')
  return res.json()
}

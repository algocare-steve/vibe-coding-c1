import express from 'express'
import cors from 'cors'
import { db } from './db.js'

const app = express()
const PORT = 3000

// 화면(http://localhost:5173)과 서버(http://localhost:3000)는 "창구 번호"(포트)가 달라서
// 브라우저가 기본적으로 요청을 막는다. 5173에서 오는 요청만 예외로 허용해준다.
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const PRODUCTS = [
  { id: 'omega3', name: '오메가3', description: '혈행 관리의 기본' },
  { id: 'coq10', name: '코큐텐', description: '일상의 활력 충전' },
  { id: 'lutein', name: '루테인지아잔틴', description: '눈 건강 지킴이' },
  { id: 'probiotics', name: '프로바이오틱스', description: '장 건강 밸런스' },
]

const findRoutineByName = db.prepare('SELECT * FROM routine WHERE name = ?')
const insertRoutine = db.prepare('INSERT INTO routine (name, added_at) VALUES (?, ?)')
const deleteRoutine = db.prepare('DELETE FROM routine WHERE id = ?')
const findIntake = db.prepare('SELECT * FROM intake WHERE routine_id = ? AND taken_on = ?')
const insertIntake = db.prepare('INSERT INTO intake (routine_id, taken_on) VALUES (?, ?)')
const deleteIntake = db.prepare('DELETE FROM intake WHERE routine_id = ? AND taken_on = ?')
const countRecentIntake = db.prepare('SELECT COUNT(*) AS cnt FROM intake WHERE taken_on >= ?')

function todayStr() {
  return dateStr(new Date())
}

function daysAgoStr(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return dateStr(d)
}

function dateStr(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function buildState() {
  const today = todayStr()

  const items = PRODUCTS.map((product) => {
    const routineRow = findRoutineByName.get(product.name)
    const added = Boolean(routineRow)
    const checkedToday = added ? Boolean(findIntake.get(routineRow.id, today)) : false
    return { ...product, added, today: checkedToday }
  })

  const weeklyCount = countRecentIntake.get(daysAgoStr(6)).cnt

  return {
    count: items.filter((item) => item.added).length,
    weeklyCount,
    items,
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/routine', (req, res) => {
  res.json(buildState())
})

app.post('/api/routine/:id/add', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id)
  if (!product) {
    return res.status(404).json({ error: 'NOT_FOUND' })
  }

  const existing = findRoutineByName.get(product.name)
  if (existing) {
    deleteRoutine.run(existing.id)
  } else {
    insertRoutine.run(product.name, new Date().toISOString())
  }

  res.json(buildState())
})

app.post('/api/routine/:id/today', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id)
  if (!product) {
    return res.status(404).json({ error: 'NOT_FOUND' })
  }

  const routineRow = findRoutineByName.get(product.name)
  if (!routineRow) {
    return res.status(409).json({ error: 'NOT_ADDED' })
  }

  const today = todayStr()
  if (findIntake.get(routineRow.id, today)) {
    deleteIntake.run(routineRow.id, today)
  } else {
    insertIntake.run(routineRow.id, today)
  }

  res.json(buildState())
})

app.listen(PORT, () => {
  console.log(`algocare-server listening on http://localhost:${PORT}`)
})

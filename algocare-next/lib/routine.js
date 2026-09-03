import { db } from './db'
import { PRODUCTS } from './products'

const findRoutineByName = db.prepare('SELECT * FROM routine WHERE name = ?')
const insertRoutine = db.prepare('INSERT INTO routine (name, added_at) VALUES (?, ?)')
const deleteRoutine = db.prepare('DELETE FROM routine WHERE id = ?')
const findIntake = db.prepare('SELECT * FROM intake WHERE routine_id = ? AND taken_on = ?')
const insertIntake = db.prepare('INSERT INTO intake (routine_id, taken_on) VALUES (?, ?)')
const deleteIntake = db.prepare('DELETE FROM intake WHERE routine_id = ? AND taken_on = ?')
const countRecentIntake = db.prepare('SELECT COUNT(*) AS cnt FROM intake WHERE taken_on >= ?')

function dateStr(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function todayStr() {
  return dateStr(new Date())
}

function daysAgoStr(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return dateStr(d)
}

export function getState() {
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

export function toggleRoutineAdd(productId) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    return { error: 'NOT_FOUND' }
  }

  const existing = findRoutineByName.get(product.name)
  if (existing) {
    deleteRoutine.run(existing.id)
  } else {
    insertRoutine.run(product.name, new Date().toISOString())
  }

  return { state: getState() }
}

export function toggleRoutineToday(productId) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    return { error: 'NOT_FOUND' }
  }

  const routineRow = findRoutineByName.get(product.name)
  if (!routineRow) {
    return { error: 'NOT_ADDED' }
  }

  const today = todayStr()
  if (findIntake.get(routineRow.id, today)) {
    deleteIntake.run(routineRow.id, today)
  } else {
    insertIntake.run(routineRow.id, today)
  }

  return { state: getState() }
}

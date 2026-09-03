'use client'

import { useEffect, useState } from 'react'
import LineupCard from './components/LineupCard'
import { fetchRoutine, toggleAdd, toggleToday } from '@/lib/api'

const REASONS = [
  { title: '5.1mm 초소형 정제', description: '편안한 목넘김, 정확한 용량' },
  { title: '고밀도 압축 공정', description: '부형제는 줄이고 유효 성분 비중은 높였어요' },
  { title: '프리미엄 원료', description: '독일·프랑스·미국 등 세계 상위 5% 원료, 출처와 기준을 투명하게 관리' },
]

export default function Page() {
  const [lineup, setLineup] = useState([])
  const [weeklyCount, setWeeklyCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRoutine()
      .then((data) => {
        setLineup(data.items)
        setWeeklyCount(data.weeklyCount)
      })
      .catch(() => setError('루틴 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'))
      .finally(() => setLoading(false))
  }, [])

  const routineCount = lineup.filter((item) => item.added).length

  const handleToggleAdd = async (id) => {
    try {
      const data = await toggleAdd(id)
      setLineup(data.items)
      setWeeklyCount(data.weeklyCount)
    } catch {
      setError('담기 처리에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleToggleToday = async (id) => {
    try {
      const data = await toggleToday(id)
      setLineup(data.items)
      setWeeklyCount(data.weeklyCount)
    } catch {
      setError('오늘 챙김 처리에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <>
      <p id="routine-counter">
        내 루틴: <span id="routine-count">{routineCount}</span>개 · 이번 주 <span id="weekly-count">{weeklyCount}</span>회
      </p>

      <header>
        <h1>차원이 다른 알고케어 뉴트리션</h1>
        <p className="tagline">매일 챙기는 걸 기록하는 곳</p>
        <p className="badge">작지만 꽉 찬 5.1mm 초소형 영양제</p>
        <p>서울대 약사 연구진이 자체 연구·개발한 알고케어만의 프리미엄 영양제</p>
      </header>

      <main>
        <section>
          <h2>믿을 수 있는 3가지 이유</h2>
          <ol>
            {REASONS.map((reason) => (
              <li key={reason.title}>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2>라인업</h2>
          <p>총 14종 중 대표 4종</p>
          {error && <p>{error}</p>}
          {!error && loading && <p>불러오는 중...</p>}
          {!error && !loading && (
            <ul>
              {lineup.map((item) => (
                <LineupCard
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  added={item.added}
                  today={item.today}
                  onToggleAdd={() => handleToggleAdd(item.id)}
                  onToggleToday={() => handleToggleToday(item.id)}
                />
              ))}
            </ul>
          )}
        </section>

        <section>
          <p>불필요한 마케팅과 유통구조를 개선해, 프리미엄 영양제를 합리적인 가격으로.</p>
          <button type="button">내 루틴으로 시작하기</button>
        </section>
      </main>
    </>
  )
}

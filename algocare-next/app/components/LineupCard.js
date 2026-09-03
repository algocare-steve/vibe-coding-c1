function LineupCard({ name, description, added, today, onToggleAdd, onToggleToday }) {
  return (
    <li>
      <h3>{name}</h3>
      <p>{description}</p>
      <button type="button" className="routine-add" aria-pressed={added} onClick={onToggleAdd}>
        {added ? '담김 ✓' : '루틴에 담기'}
      </button>
      <button
        type="button"
        className="routine-today"
        aria-pressed={today}
        hidden={!added}
        onClick={onToggleToday}
      >
        {today ? '오늘 챙김 ✓' : '오늘 챙김'}
      </button>
    </li>
  )
}

export default LineupCard

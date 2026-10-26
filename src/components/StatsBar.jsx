export default function StatsBar({ total, completed }) {
  return (
    <div className="stats-bar" role="status" aria-live="polite">
      <span className="stat">
        <span className="stat-dot" aria-hidden="true"></span>
        <span className="stat-value">{total}</span>
        {total === 1 ? ' task' : ' tasks'}
      </span>
      <span className="stat">
        <span className="stat-dot done" aria-hidden="true"></span>
        <span className="stat-value">{completed}</span>
        {' completed'}
      </span>
      <span className="stat">
        <span className="stat-dot" style={{ background: '#f59e0b' }} aria-hidden="true"></span>
        <span className="stat-value" style={{ color: '#f59e0b' }}>{total - completed}</span>
        {' pending'}
      </span>
    </div>
  )
}

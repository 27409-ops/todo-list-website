const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
]

export default function FilterBar({ active, onChange }) {
  return (
    <nav className="filters" aria-label="Task filters">
      {FILTERS.map(f => (
        <button
          key={f.id}
          id={`filter-${f.id}`}
          className={`filter-btn${active === f.id ? ' active' : ''}`}
          onClick={() => onChange(f.id)}
          aria-pressed={active === f.id}
        >
          {f.label}
        </button>
      ))}
    </nav>
  )
}

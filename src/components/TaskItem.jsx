export default function TaskItem({ task, onToggle, onDelete }) {
  const checkboxId = `task-cb-${task.id}`

  return (
    <li className={`task-item${task.completed ? ' completed' : ''}`} role="listitem">
      {/* Custom Checkbox */}
      <span className="task-checkbox-wrapper">
        <input
          type="checkbox"
          id={checkboxId}
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.text}" as ${task.completed ? 'pending' : 'completed'}`}
        />
        <label htmlFor={checkboxId} className="checkbox-custom" aria-hidden="true">
          {/* Checkmark SVG */}
          <svg viewBox="0 0 12 10" aria-hidden="true" focusable="false">
            <polyline points="1.5,5 4.5,8.5 10.5,1.5" />
          </svg>
        </label>
      </span>

      {/* Task Text */}
      <span className="task-text">{task.text}</span>

      {/* Delete Button */}
      <button
        id={`delete-${task.id}`}
        className="btn-delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.text}`}
        title="Delete task"
      >
        {/* Trash icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </li>
  )
}

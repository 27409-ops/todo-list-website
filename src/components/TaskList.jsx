import TaskItem from './TaskItem'

const EMPTY_MESSAGES = {
  all: { icon: '📋', text: 'No tasks yet. Add one above!' },
  pending: { icon: '✅', text: 'No pending tasks — you\'re all caught up!' },
  completed: { icon: '🏆', text: 'No completed tasks yet. Keep going!' },
}

export default function TaskList({ tasks, onToggle, onDelete, filter }) {
  if (tasks.length === 0) {
    const { icon, text } = EMPTY_MESSAGES[filter] ?? EMPTY_MESSAGES.all
    return (
      <div className="task-list-empty" role="status">
        <span className="empty-icon" aria-hidden="true">{icon}</span>
        <span className="empty-text">{text}</span>
      </div>
    )
  }

  return (
    <ul className="task-list" role="list" aria-label="Task list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

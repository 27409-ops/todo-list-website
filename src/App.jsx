import { useState, useEffect } from 'react'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import TaskInput from './components/TaskInput'
import FilterBar from './components/FilterBar'
import TaskList from './components/TaskList'

const STORAGE_KEY = 'my-tasks-v1'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'completed'

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks(prev => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const filtered =
    filter === 'all'
      ? tasks
      : filter === 'pending'
      ? tasks.filter(t => !t.completed)
      : tasks.filter(t => t.completed)

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="app">
      <div className="card">
        <Header />
        <StatsBar total={tasks.length} completed={completedCount} />
        <TaskInput onAdd={addTask} />
        <FilterBar active={filter} onChange={setFilter} />
        <TaskList tasks={filtered} onToggle={toggleTask} onDelete={deleteTask} filter={filter} />
      </div>
      <p className="app-footer">Tasks are saved automatically · {new Date().getFullYear()}</p>
    </div>
  )
}

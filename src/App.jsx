import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import TaskInput from './components/TaskInput'
import FilterBar from './components/FilterBar'
import TaskList from './components/TaskList'

export default function App() {
  const [tasks, setTasks]   = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  // ── Fetch all tasks from Supabase ──────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setError(null)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('Could not load tasks. Check your Supabase connection.')
      console.error('fetchTasks error:', error)
    } else {
      setTasks(data)
    }
    setLoading(false)
  }, [])

  // ── Initial load + real-time subscription ─────────────────────────────────
  useEffect(() => {
    fetchTasks()

    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev =>
              prev.map(t => (t.id === payload.new.id ? payload.new : t))
            )
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(t => t.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchTasks])

  // ── Add task ───────────────────────────────────────────────────────────────
  async function addTask(text) {
    const trimmed = text.trim()
    if (!trimmed) return

    const { error } = await supabase
      .from('tasks')
      .insert([{ text: trimmed, completed: false }])

    if (error) {
      console.error('addTask error:', error)
      setError('Failed to add task.')
    }
    // Real-time INSERT event will update state automatically
  }

  // ── Toggle completed ───────────────────────────────────────────────────────
  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id)

    if (error) {
      console.error('toggleTask error:', error)
      setError('Failed to update task.')
    }
  }

  // ── Delete task ────────────────────────────────────────────────────────────
  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('deleteTask error:', error)
      setError('Failed to delete task.')
    }
  }

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered =
    filter === 'all'       ? tasks
    : filter === 'pending' ? tasks.filter(t => !t.completed)
    :                        tasks.filter(t => t.completed)

  const completedCount = tasks.filter(t => t.completed).length

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <div className="card">
        <Header />
        <StatsBar total={tasks.length} completed={completedCount} />
        <TaskInput onAdd={addTask} />
        <FilterBar active={filter} onChange={setFilter} />

        {error && (
          <div className="error-banner" role="alert">
            ⚠️ {error}
            <button onClick={() => setError(null)} className="error-dismiss">✕</button>
          </div>
        )}

        {loading
          ? <div className="task-list-empty"><span className="empty-icon">⏳</span><span className="empty-text">Loading tasks…</span></div>
          : <TaskList tasks={filtered} onToggle={toggleTask} onDelete={deleteTask} filter={filter} />
        }
      </div>
      <p className="app-footer">
        Synced with Supabase · {new Date().getFullYear()}
      </p>
    </div>
  )
}

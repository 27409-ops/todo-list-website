import { useState, useRef } from 'react'

export default function TaskInput({ onAdd }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value)
    setValue('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit(e)
  }

  return (
    <div className="task-input-area">
      <form className="input-row" onSubmit={handleSubmit} role="search" aria-label="Add a task">
        <input
          ref={inputRef}
          id="new-task-input"
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="New task name"
          maxLength={200}
          autoComplete="off"
        />
        <button
          id="add-task-btn"
          type="submit"
          className="btn-add"
          aria-label="Add task"
          disabled={!value.trim()}
        >
          Add Task
        </button>
      </form>
    </div>
  )
}

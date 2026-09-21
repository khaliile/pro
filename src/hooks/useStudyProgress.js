import { useCallback, useEffect, useRef, useState } from 'react'
import { emptyProgress, sanitizeProgress, STORAGE_KEY, toggleQuest } from '../lib/study.js'

function readSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { progress: emptyProgress(), warning: '' }
    const saved = JSON.parse(raw)
    if (saved?.version !== 1 || !saved.completions || typeof saved.completions !== 'object' || Array.isArray(saved.completions)) throw new Error('Invalid save')
    return { progress: sanitizeProgress(saved), warning: '' }
  } catch {
    return {
      progress: emptyProgress(),
      warning: 'Saved progress could not be read. You can still study; your next completed quest will start a new save.',
    }
  }
}

export function useStudyProgress() {
  const [initial] = useState(readSavedProgress)
  const [progress, setProgress] = useState(initial.progress)
  const [warning, setWarning] = useState(initial.warning)
  const changed = useRef(false)

  useEffect(() => {
    // Do not overwrite an unreadable save just by opening the application.
    if (!changed.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
      setWarning('')
    } catch {
      setWarning('Your progress is saved only for this session. Device storage is unavailable or full.')
    }
  }, [progress])

  const toggle = useCallback((key, id) => {
    changed.current = true
    setProgress((previous) => toggleQuest(previous, key, id))
  }, [])

  return { progress, toggle, warning }
}

export function useLocalDate() {
  const [today, setToday] = useState(() => new Date())
  const refresh = useCallback(() => setToday(new Date()), [])

  useEffect(() => {
    // Refresh after midnight, sleep, or a local timezone change.
    const interval = setInterval(refresh, 30_000)
    const onVisibility = () => { if (!document.hidden) refresh() }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [refresh])

  return { today, refresh }
}

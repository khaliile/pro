import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Coffee, Headphones, Pause, Play, RotateCcw, Sparkles } from 'lucide-react'

const DURATIONS = { focus: 25 * 60, rest: 5 * 60 }

export default function FocusTimer() {
  const [mode, setMode] = useState('focus')
  const [remaining, setRemaining] = useState(DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const { t } = useTranslation()
  const deadline = useRef(0)

  useEffect(() => {
    if (!running) return
    const tick = () => {
      // A deadline, not a tick counter, remains accurate after laptop sleep.
      const seconds = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
      setRemaining(seconds)
      if (!seconds) {
        setRunning(false)
        setFinished(true)
      }
    }
    const interval = setInterval(tick, 250)
    tick()
    return () => clearInterval(interval)
  }, [running])

  const reset = (nextMode = mode) => {
    setRunning(false)
    setFinished(false)
    setMode(nextMode)
    setRemaining(DURATIONS[nextMode])
  }

  const toggle = () => {
    if (running) {
      const seconds = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
      setRemaining(seconds)
      setFinished(seconds === 0)
      setRunning(false)
    } else {
      const seconds = remaining || DURATIONS[mode]
      setRemaining(seconds)
      deadline.current = Date.now() + seconds * 1000
      setFinished(false)
      setRunning(true)
    }
  }

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
  const seconds = String(remaining % 60).padStart(2, '0')
  const percentage = ((DURATIONS[mode] - remaining) / DURATIONS[mode]) * 100

  return (
    <section className="focus-card" aria-labelledby="focus-heading">
      <div className="section-heading compact">
        <h2 id="focus-heading"><Headphones size={18} /> {t('timer.heading')}</h2>
        <span className={`live-dot ${running ? 'running' : ''}`} aria-label={running ? t('timer.running') : t('timer.idle')} />
      </div>
      <div className="timer-tabs" aria-label="Timer mode">
        <button className={mode === 'focus' ? 'selected' : ''} aria-pressed={mode === 'focus'} onClick={() => reset('focus')}>{t('timer.studyTime')}</button>
        <button className={mode === 'rest' ? 'selected' : ''} aria-pressed={mode === 'rest'} onClick={() => reset('rest')}><Coffee size={13} /> {t('timer.shortBreak')}</button>
      </div>
      <div className="timer-face" role="timer" aria-label={`${minutes} minutes ${seconds} seconds remaining`}>
        {minutes}<span>:</span>{seconds}
      </div>
      <p className="timer-description">{mode === 'focus' ? t('timer.focusDescription') : t('timer.restDescription')}</p>
      <div className="timer-progress" aria-hidden="true"><span style={{ width: `${percentage}%` }} /></div>
      <div className="timer-actions">
        <button className="primary-button" onClick={toggle}>
          {running ? <Pause size={16} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
          {running ? t('timer.pause') : remaining < DURATIONS[mode] && remaining > 0 ? t('timer.keepGoing') : mode === 'focus' ? t('timer.start') : t('timer.startBreak')}
        </button>
        <button className="icon-button timer-reset" onClick={() => reset()} aria-label={t('timer.reset')} title={t('timer.reset')}><RotateCcw size={17} /></button>
      </div>
      <p className={`timer-note ${finished ? 'timer-finished' : ''}`} role="status">
        {finished ? <><Sparkles size={13} /> {mode === 'focus' ? t('timer.focusFinished') : t('timer.restFinished')}</> : t('timer.note')}
      </p>
    </section>
  )
}

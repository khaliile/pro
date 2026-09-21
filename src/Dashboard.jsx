import { useRef, useState } from 'react'
import { useTranslation } from './hooks/useTranslation'
import {
  Activity, ArrowRight, Atom, Award, BookOpen, CalendarDays, Check, CheckCheck,
  ChevronRight, CircleHelp, Clock3, Coffee, Flame, Flower2, Globe2,
  GraduationCap, Heart, Languages, LayoutDashboard, Leaf, LockKeyhole,
  MessageCircle, Orbit, Sparkles, Sprout, Sun, Trophy, X, Zap, Calculator,
  NotebookPen, Star, Lightbulb, Trash2, Plus, Timer, CalendarClock, AlarmClock,
} from 'lucide-react'
import FocusTimer from './components/FocusTimer.jsx'
import LanguageToggle from './components/LanguageToggle.jsx'
import SchedulePage from './components/SchedulePage.jsx'
import { LittlePlant, StudyIllustration } from './components/StudyIllustration.jsx'
import { useLocalDate, useStudyProgress } from './hooks/useStudyProgress.js'
import {
  dateKey, READINESS_GOAL, readinessPercent, studyStreak,
  SUBJECTS, totalXP, WEEKLY_SCHEDULE, weekDates, XP_PER_QUEST,
} from './lib/study.js'

const SUBJECT_ICONS = {
  languages: Languages, calculator: Calculator, book: BookOpen,
  messages: MessageCircle, sun: Sun, globe: Globe2, atom: Atom,
  leaf: Leaf, activity: Activity,
}
const NAVIGATION = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'schedule', icon: AlarmClock },
  { id: 'week', icon: CalendarDays },
  { id: 'progress', icon: Orbit },
  { id: 'notes', icon: NotebookPen },
  { id: 'exams', icon: CalendarClock },
  { id: 'motivation', icon: Star },
]

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function SubjectIcon({ subject, small = false }) {
  const Icon = SUBJECT_ICONS[subject.icon] || BookOpen
  return <span className={`subject-icon ${small ? 'small' : ''} ${subject.color}`}><Icon size={small ? 16 : 22} strokeWidth={1.7} /></span>
}

function CategoryLegend() {
  const { t } = useTranslation()
  return (
    <div className="category-legend">
      <span><i className="bg-blue-400" />{t('categories.sciences')}</span>
      <span><i className="bg-purple-400" />{t('categories.languages')}</span>
      <span><i className="bg-amber-400" />{t('categories.humanities')}</span>
      <span><i className="bg-emerald-400" />{t('categories.wellbeing')}</span>
    </div>
  )
}

function WeeklySchedule({ today, progress }) {
  const { t, language } = useTranslation()
  const dateLocale = language === 'ar' ? 'ar-MA' : 'en-US'

  return (
    <section className="weekly-section" aria-labelledby="weekly-heading">
      <div className="section-heading">
        <div>
          <h2 id="weekly-heading">{t('week.heading')}</h2>
          <p>{t('week.description')}</p>
        </div>
        <CalendarDays size={21} />
      </div>
      <CategoryLegend />
      <div className="schedule-grid">
        {weekDates(today).map((date) => {
          const key = dateKey(date)
          const isToday = key === dateKey(today)
          const ids = WEEKLY_SCHEDULE[date.getDay()]
          const done = progress.completions[key] || []
          const dayKey = DAY_KEYS[date.getDay()]
          return (
            <article key={key} className={`schedule-day ${isToday ? 'is-today' : ''}`}>
              <div className="schedule-day-heading">
                <h3>{t(`days.${dayKey}`)}</h3>
                {isToday ? <span className="today-badge">{t('week.today')}</span> : <span>{date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })}</span>}
              </div>
              {ids.map((id) => {
                const subject = SUBJECTS[id]
                const subjectName = t(`subjects.${id}.name`) || subject.name
                return (
                  <div className="schedule-subject" key={id}>
                    <SubjectIcon subject={subject} small />
                    <span>{subjectName}</span>
                    {done.includes(id) && <Check size={15} className="text-emerald-600" aria-label={t('week.completed')} />}
                  </div>
                )
              })}
              {!ids.length && <div className="rest-day"><Coffee size={24} /><span>{t('week.restDay')}</span></div>}
              {!!ids.length && <div className="schedule-day-footer">{ids.length} {t('week.quests')} <span>·</span> {ids.length * XP_PER_QUEST} {t('week.available')}</div>}
            </article>
          )
        })}
      </div>
      <p className="muted-note">{t('week.note')}</p>
    </section>
  )
}

function ProgressView({ today, progress, xp, streak }) {
  const { t } = useTranslation()
  const days = weekDates(today)
  const weekXP = days.reduce((sum, date) => sum + (progress.completions[dateKey(date)]?.length || 0) * XP_PER_QUEST, 0)
  const milestones = [
    { name: t('milestones.first.name'), description: t('milestones.first.description'), icon: Sprout, unlocked: xp >= 25 },
    { name: t('milestones.flow.name'), description: t('milestones.flow.description'), icon: Flame, unlocked: streak >= 3 },
    { name: t('milestones.curious.name'), description: t('milestones.curious.description'), icon: BookOpen, unlocked: xp >= 250 },
    { name: t('milestones.stronger.name'), description: t('milestones.stronger.description'), icon: Trophy, unlocked: xp >= READINESS_GOAL },
  ]

  return (
    <section aria-labelledby="progress-heading">
      <div className="section-heading">
        <div>
          <h2 id="progress-heading">{t('progress.heading')}</h2>
          <p>{t('progress.description')}</p>
        </div>
        <Sprout size={23} />
      </div>
      <div className="progress-panel">
        <div className="section-heading compact">
          <h3>{t('progress.thisWeek')}</h3>
          <span className="xp-label">{weekXP} XP</span>
        </div>
        <div className="activity-chart" role="img" aria-label={`${t('progress.thisWeek')}: ${weekXP} XP.`}>
          {days.map((date) => {
            const completed = progress.completions[dateKey(date)]?.length || 0
            const dayKey = DAY_KEYS[date.getDay()]
            return (
              <div className={`chart-column ${dateKey(date) === dateKey(today) ? 'current' : ''}`} key={dateKey(date)}>
                <span className="chart-count">{completed * XP_PER_QUEST}</span>
                <div className="chart-track"><div style={{ height: `${completed / 4 * 100}%` }} /></div>
                <span>{t(`daysShort.${dayKey}`)}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="section-heading milestone-heading">
        <h3>{t('progress.milestones')}</h3>
        <span>{milestones.filter((milestone) => milestone.unlocked).length} / 4 {t('progress.active')}</span>
      </div>
      <div className="milestone-grid">
        {milestones.map(({ name, description, icon: Icon, unlocked }) => (
          <div className={`milestone ${unlocked ? 'unlocked' : ''}`} key={name}>
            <span className="milestone-icon"><Icon size={23} /></span>
            <h3>{name}</h3>
            <p>{description}</p>
            <span className="milestone-state">
              {unlocked ? <><Check size={12} /> {t('progress.achieved')}</> : <><LockKeyhole size={11} /> {t('progress.keepGrowing')}</>}
            </span>
          </div>
        ))}
      </div>
      <p className="muted-note">{t('progress.note')}</p>
    </section>
  )
}

/* ─── Notes Page ─── */
function NotesPage() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studyquest.notes') || '[]') } catch { return [] }
  })
  const [draft, setDraft] = useState('')

  const save = () => {
    const text = draft.trim()
    if (!text) return
    const next = [{ id: Date.now(), text, date: new Date().toISOString() }, ...notes]
    setNotes(next)
    localStorage.setItem('studyquest.notes', JSON.stringify(next))
    setDraft('')
  }

  const remove = (id) => {
    const next = notes.filter((n) => n.id !== id)
    setNotes(next)
    localStorage.setItem('studyquest.notes', JSON.stringify(next))
  }

  return (
    <section aria-labelledby="notes-heading">
      <div className="section-heading">
        <div>
          <h2 id="notes-heading">{t('notes.heading')}</h2>
          <p>{t('notes.description')}</p>
        </div>
        <NotebookPen size={23} />
      </div>
      <div className="notes-composer">
        <textarea
          className="notes-textarea"
          placeholder={t('notes.placeholder')}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save() }}
        />
        <button className="primary-button notes-save" onClick={save}>
          <Plus size={15} /> {t('notes.save')}
        </button>
      </div>
      {notes.length === 0 && (
        <div className="empty-state">
          <NotebookPen size={38} strokeWidth={1.3} />
          <p>{t('notes.empty')}</p>
        </div>
      )}
      <div className="notes-list">
        {notes.map(({ id, text, date }) => (
          <div className="note-card" key={id}>
            <p>{text}</p>
            <div className="note-footer">
              <span>{new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              <button className="icon-button danger" onClick={() => remove(id)} aria-label={t('notes.delete')}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Exam Countdown Page ─── */
const EXAM_SUBJECTS = ['math', 'physics', 'arabic', 'french', 'english', 'islamic', 'social', 'svt', 'history', 'civics']

function ExamsPage() {
  const { t } = useTranslation()
  const [exams, setExams] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studyquest.exams') || '[]') } catch { return [] }
  })
  const [form, setForm] = useState({ subject: 'math', date: '' })
  const [showForm, setShowForm] = useState(false)

  const addExam = () => {
    if (!form.date) return
    const next = [...exams, { id: Date.now(), subject: form.subject, date: form.date }]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
    setExams(next)
    localStorage.setItem('studyquest.exams', JSON.stringify(next))
    setForm({ subject: 'math', date: '' })
    setShowForm(false)
  }

  const removeExam = (id) => {
    const next = exams.filter((e) => e.id !== id)
    setExams(next)
    localStorage.setItem('studyquest.exams', JSON.stringify(next))
  }

  const daysUntil = (dateStr) => {
    const diff = new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)
    return Math.ceil(diff / 86400000)
  }

  return (
    <section aria-labelledby="exams-heading">
      <div className="section-heading">
        <div>
          <h2 id="exams-heading">{t('exams.heading')}</h2>
          <p>{t('exams.description')}</p>
        </div>
        <CalendarClock size={23} />
      </div>
      <button className="primary-button add-exam-btn" onClick={() => setShowForm((v) => !v)}>
        <Plus size={15} /> {t('exams.add')}
      </button>
      {showForm && (
        <div className="exam-form">
          <select
            className="exam-select"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          >
            {EXAM_SUBJECTS.map((s) => (
              <option key={s} value={s}>{t(`subjects.${s}.name`) || s}</option>
            ))}
          </select>
          <input
            type="date"
            className="exam-date-input"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          <button className="primary-button" onClick={addExam}>{t('exams.save')}</button>
        </div>
      )}
      {exams.length === 0 && !showForm && (
        <div className="empty-state">
          <CalendarClock size={38} strokeWidth={1.3} />
          <p>{t('exams.empty')}</p>
        </div>
      )}
      <div className="exam-list">
        {exams.map(({ id, subject, date }) => {
          const days = daysUntil(date)
          const urgent = days >= 0 && days <= 3
          const passed = days < 0
          return (
            <div className={`exam-card ${urgent ? 'urgent' : ''} ${passed ? 'passed' : ''}`} key={id}>
              <div className="exam-info">
                <strong>{t(`subjects.${subject}.name`) || subject}</strong>
                <span>{new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="exam-days">
                {passed
                  ? <span className="days-label passed-label">{t('exams.passed')}</span>
                  : days === 0
                    ? <span className="days-label today-label">{t('exams.today')}</span>
                    : <><span className="days-number">{days}</span><span className="days-label">{t('exams.daysLeft')}</span></>
                }
              </div>
              <button className="icon-button danger" onClick={() => removeExam(id)} aria-label={t('exams.remove')}>
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ─── Motivation Page ─── */
const TIPS_KEYS = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5', 'tip6']
const AFF_KEYS = ['aff1', 'aff2', 'aff3', 'aff4', 'aff5', 'aff6']

function MotivationPage() {
  const { t } = useTranslation()
  const [tipIdx, setTipIdx] = useState(() => Math.floor(Math.random() * TIPS_KEYS.length))
  const [affIdx, setAffIdx] = useState(() => Math.floor(Math.random() * AFF_KEYS.length))

  return (
    <section aria-labelledby="motivation-heading">
      <div className="section-heading">
        <div>
          <h2 id="motivation-heading">{t('motivation.heading')}</h2>
          <p>{t('motivation.description')}</p>
        </div>
        <Star size={23} />
      </div>

      <div className="motivation-card affirmation-card">
        <div className="motivation-card-header">
          <span><Sparkles size={16} /> {t('motivation.affirmationTitle')}</span>
          <button className="icon-button" onClick={() => setAffIdx((i) => (i + 1) % AFF_KEYS.length)} title={t('motivation.shuffle')}>
            <ArrowRight size={15} />
          </button>
        </div>
        <blockquote className="motivation-quote">
          &ldquo;{t(`motivation.affirmations.${AFF_KEYS[affIdx]}`)}&rdquo;
        </blockquote>
      </div>

      <div className="motivation-tips-heading">
        <Lightbulb size={17} /> <h3>{t('motivation.tipsTitle')}</h3>
      </div>
      <div className="motivation-tips-grid">
        {TIPS_KEYS.map((key, i) => (
          <div
            className={`tip-card ${i === tipIdx ? 'tip-highlighted' : ''}`}
            key={key}
            onClick={() => setTipIdx(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setTipIdx(i)}
          >
            <span className="tip-number">{i + 1}</span>
            <p>{t(`motivation.tips.${key}`)}</p>
          </div>
        ))}
      </div>

      <div className="motivation-tips-heading" style={{ marginTop: '28px' }}>
        <Timer size={17} /> <h3>{t('motivation.challengeTitle')}</h3>
      </div>
      <div className="micro-challenge-card">
        <p>{t('motivation.challengeText')}</p>
        <span className="challenge-badge"><Clock3 size={12} /> 5 min</span>
      </div>
    </section>
  )
}

export default function Dashboard() {

  const [page, setPage] = useState('dashboard')
  const [announcement, setAnnouncement] = useState('')
  const { today, refresh } = useLocalDate()
  const { progress, toggle, warning } = useStudyProgress()
  const { t, language } = useTranslation()
  const guide = useRef(null)
  const todayKey = dateKey(today)
  const todaysQuests = WEEKLY_SCHEDULE[today.getDay()]
  const completed = progress.completions[todayKey] || []
  const xp = totalXP(progress)
  const readiness = readinessPercent(xp)
  const streak = studyStreak(progress, today)
  const level = Math.floor(xp / 250) + 1
  const nextLevelXP = 250 - (xp % 250)
  const schoolYear = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1
  const allDone = todaysQuests.length > 0 && completed.length === todaysQuests.length
  const dayKey = DAY_KEYS[today.getDay()]
  const dateLocale = language === 'ar' ? 'ar-MA' : 'en-US'

  const handleComplete = (id) => {
    if (dateKey(new Date()) !== todayKey) {
      refresh()
      setAnnouncement(t('announcements.newDay'))
      return
    }
    const wasDone = completed.includes(id)
    toggle(todayKey, id)
    const subjectName = t(`subjects.${id}.name`) || SUBJECTS[id].name
    setAnnouncement(wasDone ? `${subjectName} ${t('announcements.questReopened')}` : `${subjectName} ${t('announcements.questComplete')}`)
  }

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('studyquest.sidebar.collapsed') === 'true'
    } catch {
      return false
    }
  })

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('studyquest.sidebar.collapsed', String(next))
      } catch {}
      return next
    })
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <a className="skip-link" href="#main-content">{t('nav.skipLink')}</a>
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} aria-expanded={!sidebarCollapsed}>
        <button
          type="button"
          className="brand"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? t('brand.expand') : t('brand.collapse')}
          title={sidebarCollapsed ? t('brand.expand') : t('brand.collapse')}
        >
          <span className="brand-mark"><BookOpen size={24} /><Sparkles size={12} className="brand-sparkle" /></span>
          <span className="brand-text">study<span className="brand-light">quest</span><span className="brand-period">.</span></span>
        </button>
        <div className="workspace-label">{t('brand.tagline')}</div>
        <nav aria-label="Main navigation">
          {NAVIGATION.map(({ id, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              aria-current={page === id ? 'page' : undefined}
              onClick={() => setPage(id)}
              title={t(`nav.${id}`)}
            >
              <Icon size={19} strokeWidth={1.7} />
              <span>{t(`nav.${id}`)}</span>
              {page === id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="grow-card">
            <LittlePlant />
            <h3>{t('growCard.heading')}</h3>
            <p>{t('growCard.description')}</p>
            <span>{t('growCard.tagline')} <Heart size={10} /></span>
          </div>
          <button className="guide-button" onClick={() => guide.current?.showModal()} title={t('guide.button')}>
            <CircleHelp size={17} /> <span>{t('guide.button')}</span> <ChevronRight size={14} />
          </button>
          <LanguageToggle />
          <div className="profile">
            <span className="profile-avatar"><Flower2 size={23} strokeWidth={1.5} /></span>
            <div>
              <strong>{t('profile.mySpace')}</strong>
              <span>3APIC · {t('profile.classOf')} {schoolYear + 1}</span>
            </div>
            <span className="profile-status" title={t('profile.offline')} />
          </div>
        </div>
      </aside>

      <main id="main-content" className="main-content">
        <header className="topbar">
          <span className="breadcrumb">{t('profile.mySpace')} <ChevronRight size={12} /><span>{t(`nav.${page}`)}</span></span>
          <span className="school-year" dir="ltr"><GraduationCap size={15} /> 3APIC <span>·</span> {schoolYear}–{schoolYear + 1}</span>
        </header>
        <div className="page-content">
          <div className="page-intro">
            <div>
              <div className="eyebrow"><Sun size={15} /> {t(`page.${page}.eyebrow`)}</div>
              <h1>{t(`page.${page}.heading`)}</h1>
              <p>{t(`page.${page}.description`)}</p>
            </div>
            <div className="date-pill">
              <CalendarDays size={17} />
              <div>
                <strong>{t(`days.${dayKey}`)}</strong>
                <span>{today.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {warning && <div className="storage-warning" role="alert"><CircleHelp size={18} />{warning}</div>}

          {(page === 'dashboard' || page === 'progress') && (
            <section className="readiness-card" aria-labelledby="readiness-heading">
              <div className="readiness-content">
                <div className="hero-eyebrow">
                  <span><Sparkles size={13} /> {t('readiness.eyebrow')}</span>
                  <span className="brevet-tag">{t('readiness.tag')}</span>
                </div>
                <h2 id="readiness-heading">{t('readiness.heading')}</h2>
                <p>{t('readiness.description')}</p>
                <div className="readiness-numbers">
                  <span><strong>{readiness}%</strong> {t('readiness.ofGoal')}</span>
                  <span dir="ltr">{xp.toLocaleString(dateLocale)} <span>/ {READINESS_GOAL.toLocaleString(dateLocale)} XP</span></span>
                </div>
                <div className="readiness-track" role="progressbar" aria-label={t('readiness.heading')} aria-valuenow={readiness} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${readiness} percent`}>
                  <div style={{ width: `${readiness}%` }} />
                </div>
                <div className="hero-footer">
                  <span><Sprout size={13} /> {readiness === 100 ? t('readiness.complete') : t('readiness.growing')}</span>
                  <button onClick={() => setPage(page === 'progress' ? 'dashboard' : 'progress')}>
                    {page === 'progress' ? t('readiness.viewQuests') : t('readiness.viewProgress')} <ArrowRight size={13} />
                  </button>
                </div>
              </div>
              <StudyIllustration />
            </section>
          )}

          {page === 'dashboard' && (
            <div className="stats-row">
              <div className="stat-card">
                <span className="stat-icon mint"><CheckCheck size={21} /></span>
                <div>
                  <span className="stat-label">{t('stats.todayQuests')}</span>
                  <div className="stat-value">
                    <span dir="ltr">{completed.length} / {todaysQuests.length}</span>
                    <span className="stat-description">{allDone ? t('stats.allDone') : todaysQuests.length ? t('stats.littleWins') : t('stats.restRecharge')}</span>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon lilac"><Zap size={20} /></span>
                <div>
                  <span className="stat-label">{t('stats.totalXp')}</span>
                  <div className="stat-value">
                    <span dir="ltr">{xp.toLocaleString(dateLocale)} XP</span>
                    <span className="level-chip">{t('stats.level')} {level}</span>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon peach"><Flame size={21} /></span>
                <div>
                  <span className="stat-label">{t('stats.streak')}</span>
                  <div className="stat-value">
                    <span dir="ltr">{streak} {streak === 1 ? t('stats.day') : t('stats.days')}</span>
                    <span className="stat-description">{streak ? t('stats.keepGlow') : t('stats.startSpark')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={`dashboard-columns${page === 'schedule' ? ' full-width' : ''}`}>
            <div className="primary-column">
              {page === 'dashboard' && (
                <section aria-labelledby="quests-heading">
                  <div className="section-heading">
                    <div>
                      <h2 id="quests-heading">{t('quests.heading')} <span className="quest-count">{todaysQuests.length}</span></h2>
                      <p>{t('quests.description')}</p>
                    </div>
                    <span className="day-label">{t(`days.${dayKey}`)}</span>
                  </div>
                  <div className="quest-list">
                    {todaysQuests.map((id, index) => {
                      const subject = SUBJECTS[id]
                      const done = completed.includes(id)
                      const subjectName = t(`subjects.${id}.name`) || subject.name
                      const subjectTask = t(`subjects.${id}.task`) || subject.task
                      const categoryKey = subject.category.toLowerCase().replace(/[^a-z]/g, '')
                      const categoryName = t(`categories.${categoryKey}`) || subject.category
                      return (
                        <label className={`quest-card ${done ? 'completed' : ''}`} key={`${todayKey}-${id}`} style={{ '--quest-index': index }}>
                          <SubjectIcon subject={subject} />
                          <span className="quest-details">
                            <span className="quest-title">{subjectName}</span>
                            <span className="quest-task">{subjectTask}</span>
                            <span className="quest-meta">
                              <Clock3 size={11} /> {id === 'pe' ? t('quests.activity') : t('quests.homework')}
                              <span className="meta-dot">·</span>
                              <span>{categoryName}</span>
                            </span>
                          </span>
                          <span className="quest-reward"><Zap size={12} /> +{XP_PER_QUEST} XP</span>
                          <span className="quest-checkbox">
                            <input type="checkbox" checked={done} onChange={() => handleComplete(id)} aria-label={`${t('quests.complete')} ${subjectName}`} />
                            <span aria-hidden="true">{done && <Check size={15} strokeWidth={2.8} />}</span>
                          </span>
                        </label>
                      )
                    })}
                    {!todaysQuests.length && (
                      <div className="sunday-card">
                        <Coffee size={36} strokeWidth={1.4} />
                        <h3>{t('sunday.heading')}</h3>
                        <p>{t('sunday.description')}<br />{t('sunday.nextChapter')}</p>
                        <button className="text-button" onClick={() => setPage('week')}>{t('sunday.viewWeek')} <ArrowRight size={15} /></button>
                      </div>
                    )}
                  </div>
                  <div className={`quest-encouragement ${allDone ? 'all-done' : ''}`}>
                    <span>{allDone ? <Sparkles size={17} /> : <Heart size={17} />}</span>
                    <p>{allDone ? t('quests.allDone') : t('quests.encouragement')}</p>
                  </div>
                  <CategoryLegend />
                </section>
              )}
              {page === 'schedule' && (
                <SchedulePage
                  today={today}
                  completedQuests={completed}
                  onToggleQuest={handleComplete}
                />
              )}
              {page === 'week' && <WeeklySchedule today={today} progress={progress} />}
              {page === 'progress' && <ProgressView today={today} progress={progress} xp={xp} streak={streak} />}
              {page === 'notes' && <NotesPage />}
              {page === 'exams' && <ExamsPage />}
              {page === 'motivation' && <MotivationPage />}
            </div>
            <aside className="right-column" aria-label="Study companions">
              <FocusTimer />
              <section className="level-card">
                <span className="level-badge"><Award size={25} strokeWidth={1.5} /></span>
                <div className="level-info">
                  <span className="eyebrow">{t('level.eyebrow')}</span>
                  <h3>{level === 1 ? t('level.beginner') : level < 5 ? t('level.explorer') : t('level.bookworm')}</h3>
                  <p>{t('stats.level')} {level} <span>·</span> {nextLevelXP} {t('level.toNext')}</p>
                </div>
                <div className="level-track" role="progressbar" aria-label={`${t('level.progressLabel')} ${level + 1}`} aria-valuenow={xp % 250} aria-valuemin={0} aria-valuemax={250}>
                  <span style={{ width: `${(xp % 250) / 250 * 100}%` }} />
                </div>
              </section>
              <section className="little-reminder">
                <span className="reminder-heading"><Flower2 size={17} /> {t('reminder.heading')}</span>
                <blockquote>“{t('reminder.quote')}”</blockquote>
                <span className="reminder-line" />
              </section>
            </aside>
          </div>
          <footer className="page-footer">
            <span><Leaf size={13} /> {t('footer.tagline')}</span>
            <span><span className="offline-dot" /> {warning ? (t('footer.checkStorage') || warning) : t('footer.offline')}</span>
          </footer>
        </div>
      </main>
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
      <dialog ref={guide} className="guide-dialog" aria-labelledby="guide-title" onClick={(event) => { if (event.target === event.currentTarget) guide.current.close() }}>
        <button className="icon-button dialog-close" onClick={() => guide.current.close()} aria-label={t('guide.close')}><X size={20} /></button>
        <span className="guide-icon"><BookOpen size={28} /></span>
        <h2 id="guide-title">{t('guide.title')}</h2>
        <p>{t('guide.subtitle')}</p>
        <div className="guide-item"><CheckCheck size={20} /><div><h3>{t('guide.quest.title')}</h3><p>{t('guide.quest.description')}</p></div></div>
        <div className="guide-item"><Zap size={20} /><div><h3>{t('guide.xp.title')}</h3><p>{t('guide.xp.description')}</p></div></div>
        <div className="guide-item"><Clock3 size={20} /><div><h3>{t('guide.rhythm.title')}</h3><p>{t('guide.rhythm.description')}</p></div></div>
        <div className="guide-item"><LockKeyhole size={20} /><div><h3>{t('guide.privacy.title')}</h3><p>{t('guide.privacy.description')}</p></div></div>
        <button className="primary-button guide-done" onClick={() => guide.current.close()}>{t('guide.done')} <Sprout size={16} /></button>
      </dialog>
    </div>
  )
}

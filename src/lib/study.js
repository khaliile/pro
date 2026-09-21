export const XP_PER_QUEST = 25
export const READINESS_GOAL = 1000
export const STORAGE_KEY = 'study-quest.progress.v1'
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// JavaScript's getDay() uses Sunday = 0. The written schedule is authoritative.
export const WEEKLY_SCHEDULE = {
  0: [],
  1: ['french', 'math', 'arabic', 'english'],
  2: ['islamic', 'math', 'french', 'social'],
  3: ['physics', 'svt', 'math'],
  4: ['arabic', 'islamic', 'svt', 'physics'],
  5: ['english', 'arabic', 'pe', 'physics'],
  6: ['french', 'math'],
}

// Full Tailwind class names keep color utilities discoverable at build time.
export const SUBJECTS = {
  french: { name: 'French', category: 'Languages', icon: 'languages', color: 'bg-purple-100 text-purple-700', short: 'FR', task: 'A little grammar, a little confidence.' },
  math: { name: 'Math', category: 'Sciences', icon: 'calculator', color: 'bg-blue-100 text-blue-700', short: 'MA', task: 'One problem at a time. You’ve got this.' },
  arabic: { name: 'Arabic', category: 'Languages', icon: 'book', color: 'bg-purple-100 text-purple-700', short: 'AR', task: 'Read, write, and find your flow.' },
  english: { name: 'English', category: 'Languages', icon: 'messages', color: 'bg-purple-100 text-purple-700', short: 'EN', task: 'New words open up new worlds.' },
  islamic: { name: 'Islamic Education', category: 'Humanities', icon: 'sun', color: 'bg-amber-100 text-amber-700', short: 'IE', task: 'Take a moment to review and reflect.' },
  social: { name: 'Social Studies', category: 'Humanities', icon: 'globe', color: 'bg-amber-100 text-amber-700', short: 'SS', task: 'Connect the people, places, and ideas.' },
  physics: { name: 'Physics & Chemistry', category: 'Sciences', icon: 'atom', color: 'bg-blue-100 text-blue-700', short: 'PC', task: 'Turn a little curiosity into understanding.' },
  svt: { name: 'Life & Earth Sciences (SVT)', category: 'Sciences', icon: 'leaf', color: 'bg-blue-100 text-blue-700', short: 'SVT', task: 'Explore the world, one concept at a time.' },
  pe: { name: 'Physical Education', category: 'Well-being', icon: 'activity', color: 'bg-emerald-100 text-emerald-700', short: 'PE', task: 'Move, stretch, and recharge.' },
}

// Local calendar dates avoid moving quests to another day at UTC midnight.
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function parseDate(key) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(year, month - 1, day, 12)
  return dateKey(date) === key ? date : null
}

export function emptyProgress() {
  return { version: 1, completions: {} }
}

export function sanitizeProgress(value) {
  const clean = emptyProgress()
  if (!value || value.version !== 1 || !value.completions || typeof value.completions !== 'object' || Array.isArray(value.completions)) return clean
  for (const [key, ids] of Object.entries(value.completions)) {
    const date = parseDate(key)
    if (!date || !Array.isArray(ids)) continue
    const valid = [...new Set(ids.filter((id) => WEEKLY_SCHEDULE[date.getDay()].includes(id)))]
    if (valid.length) clean.completions[key] = valid
  }
  return clean
}

export function toggleQuest(progress, key, subjectId) {
  const date = parseDate(key)
  if (!date || !WEEKLY_SCHEDULE[date.getDay()].includes(subjectId)) return progress
  const completed = progress.completions[key] || []
  const next = completed.includes(subjectId)
    ? completed.filter((id) => id !== subjectId)
    : [...completed, subjectId]
  const completions = { ...progress.completions }
  if (next.length) completions[key] = next
  else delete completions[key]
  return { version: 1, completions }
}

export function totalXP(progress) {
  return Object.values(progress.completions).reduce((total, ids) => total + ids.length * XP_PER_QUEST, 0)
}

export function readinessPercent(xp) {
  return Math.max(0, Math.min(100, Math.round((xp / READINESS_GOAL) * 100)))
}

export function weekDates(today = new Date()) {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7), 12)
  return Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i, 12))
}

// A streak counts study days with at least one quest. Sunday is a free rest day.
export function studyStreak(progress, today = new Date()) {
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)
  const previous = () => cursor.setDate(cursor.getDate() - 1)
  if (cursor.getDay() === 0 || !progress.completions[dateKey(cursor)]?.length) previous()
  let streak = 0
  for (;;) {
    if (cursor.getDay() === 0) { previous(); continue }
    if (!progress.completions[dateKey(cursor)]?.length) break
    streak += 1
    previous()
  }
  return streak
}

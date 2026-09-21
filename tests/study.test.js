import test from 'node:test'
import assert from 'node:assert/strict'
import {
  dateKey, emptyProgress, parseDate, readinessPercent, sanitizeProgress,
  studyStreak, SUBJECTS, toggleQuest, totalXP, WEEKLY_SCHEDULE, weekDates,
} from '../src/lib/study.js'

const monday = '2026-09-21'

// All dates use the user's local calendar, including these fixtures.
test('the full weekly schedule matches the requested subjects and order', () => {
  assert.deepEqual(WEEKLY_SCHEDULE, {
    0: [],
    1: ['french', 'math', 'arabic', 'english'],
    2: ['islamic', 'math', 'french', 'social'],
    3: ['physics', 'svt', 'math'],
    4: ['arabic', 'islamic', 'svt', 'physics'],
    5: ['english', 'arabic', 'pe', 'physics'],
    6: ['french', 'math'],
  })
})

test('all scheduled subjects have metadata and appropriate color categories', () => {
  for (const ids of Object.values(WEEKLY_SCHEDULE)) {
    for (const id of ids) assert.ok(SUBJECTS[id]?.name)
  }
  for (const id of ['math', 'physics', 'svt']) assert.equal(SUBJECTS[id].color, 'bg-blue-100 text-blue-700')
  for (const id of ['arabic', 'french', 'english']) assert.equal(SUBJECTS[id].color, 'bg-purple-100 text-purple-700')
  for (const id of ['islamic', 'social']) assert.equal(SUBJECTS[id].color, 'bg-amber-100 text-amber-700')
})

test('date keys use the local date even near midnight', () => {
  assert.equal(dateKey(new Date(2026, 8, 21, 0, 1)), monday)
  assert.equal(dateKey(new Date(2026, 8, 21, 23, 59)), monday)
  assert.equal(dateKey(new Date(2026, 0, 2)), '2026-01-02')
})

test('invalid and overflow calendar dates are rejected', () => {
  for (const key of ['2026-02-30', '2026-13-01', 'garbage', '2026-9-21', null, '__proto__']) assert.equal(parseDate(key), null)
  assert.equal(dateKey(parseDate('2024-02-29')), '2024-02-29')
})

test('a checked quest earns exactly 25 XP without mutating existing state', () => {
  const original = emptyProgress()
  const next = toggleQuest(original, monday, 'french')
  assert.equal(totalXP(next), 25)
  assert.deepEqual(next.completions[monday], ['french'])
  assert.deepEqual(original, emptyProgress())
})

test('unchecking reverses XP and repeated toggles cannot farm experience', () => {
  let progress = emptyProgress()
  for (let i = 0; i < 20; i++) progress = toggleQuest(progress, monday, 'french')
  assert.equal(totalXP(progress), 0)
  assert.deepEqual(progress, emptyProgress())
  progress = toggleQuest(progress, monday, 'french')
  progress = toggleQuest(progress, monday, 'math')
  assert.equal(totalXP(progress), 50)
})

test('unscheduled subjects and Sunday completions are ignored', () => {
  const progress = emptyProgress()
  assert.equal(toggleQuest(progress, monday, 'physics'), progress)
  assert.equal(toggleQuest(progress, '2026-09-27', 'french'), progress)
  assert.equal(toggleQuest(progress, 'invalid', 'french'), progress)
})

test('progress survives a JSON round trip, with independent dates', () => {
  let progress = toggleQuest(emptyProgress(), monday, 'math')
  progress = toggleQuest(progress, '2026-09-28', 'math')
  const restored = sanitizeProgress(JSON.parse(JSON.stringify(progress)))
  assert.deepEqual(restored, progress)
  assert.equal(totalXP(restored), 50)
  assert.equal(restored.completions['2026-09-22'], undefined)
})

test('saved progress drops duplicates, unknown subjects, and invalid dates', () => {
  const restored = sanitizeProgress({ version: 1, completions: {
    [monday]: ['math', 'math', 'unknown', 'physics', null],
    '2026-09-22': ['french', 'social'],
    '2026-09-27': ['math'],
    '2026-02-30': ['math'],
    bad: ['math'],
    '2026-09-23': 'math',
  } })
  assert.deepEqual(restored.completions, { [monday]: ['math'], '2026-09-22': ['french', 'social'] })
  assert.equal(totalXP(restored), 75)
})

test('invalid storage schemas safely return empty state', () => {
  for (const data of [null, [], 'bad', {}, { version: 2, completions: {} }, { version: 1, completions: [] }]) assert.deepEqual(sanitizeProgress(data), emptyProgress())
})

test('the readiness bar is capped while XP can continue growing', () => {
  assert.equal(readinessPercent(0), 0)
  assert.equal(readinessPercent(250), 25)
  assert.equal(readinessPercent(1000), 100)
  assert.equal(readinessPercent(1500), 100)
  assert.equal(readinessPercent(-25), 0)
})

test('weeks start on Monday and cross year boundaries correctly', () => {
  assert.deepEqual(weekDates(new Date(2026, 8, 27)).map(dateKey), [
    '2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27',
  ])
  const dates = weekDates(new Date(2027, 0, 1))
  assert.equal(dateKey(dates[0]), '2026-12-28')
  assert.equal(dateKey(dates[6]), '2027-01-03')
})

test('study streaks continue over Sunday and allow today to be unfinished', () => {
  let progress = toggleQuest(emptyProgress(), '2026-09-25', 'arabic')
  progress = toggleQuest(progress, '2026-09-26', 'math')
  assert.equal(studyStreak(progress, new Date(2026, 8, 27)), 2)
  assert.equal(studyStreak(progress, new Date(2026, 8, 28)), 2)
  progress = toggleQuest(progress, '2026-09-28', 'math')
  assert.equal(studyStreak(progress, new Date(2026, 8, 28)), 3)
})

test('missing a scheduled day breaks the streak, including Saturday', () => {
  const progress = toggleQuest(emptyProgress(), '2026-09-25', 'arabic')
  assert.equal(studyStreak(progress, new Date(2026, 8, 26)), 1)
  assert.equal(studyStreak(progress, new Date(2026, 8, 27)), 0)
  assert.equal(studyStreak(progress, new Date(2026, 8, 28)), 0)
  assert.equal(studyStreak(emptyProgress(), new Date(2026, 8, 21)), 0)
})

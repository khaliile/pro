import test from 'node:test'
import assert from 'node:assert/strict'
import en from '../src/translations/en.json' with { type: 'json' }
import ar from '../src/translations/ar.json' with { type: 'json' }
import { WEEKLY_SCHEDULE, SUBJECTS } from '../src/lib/study.js'

function getAllKeys(obj, prefix = '') {
  let keys = []
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getAllKeys(v, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

function getNestedValue(obj, keys) {
  let current = obj
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k]
    } else {
      return undefined
    }
  }
  return current
}

test('all English translation keys have matching Arabic translations', () => {
  const enKeys = getAllKeys(en)
  const arKeys = getAllKeys(ar)

  for (const key of enKeys) {
    const arVal = getNestedValue(ar, key.split('.'))
    assert.ok(
      arVal !== undefined && arVal !== '',
      `Missing Arabic translation for key: ${key}`
    )
  }
})

test('all Arabic translation keys have matching English translations', () => {
  const arKeys = getAllKeys(ar)

  for (const key of arKeys) {
    const enVal = getNestedValue(en, key.split('.'))
    assert.ok(
      enVal !== undefined && enVal !== '',
      `Missing English translation for key: ${key}`
    )
  }
})

test('all subjects in weekly schedule have valid English and Arabic translations', () => {
  const allSubjectIds = new Set()
  for (const list of Object.values(WEEKLY_SCHEDULE)) {
    for (const id of list) allSubjectIds.add(id)
  }

  for (const id of allSubjectIds) {
    assert.ok(en.subjects[id], `Missing subject in en.json: ${id}`)
    assert.ok(ar.subjects[id], `Missing subject in ar.json: ${id}`)
    assert.ok(en.subjects[id].name, `Missing subject name in en.json: ${id}`)
    assert.ok(ar.subjects[id].name, `Missing subject name in ar.json: ${id}`)
    assert.ok(en.subjects[id].task, `Missing subject task in en.json: ${id}`)
    assert.ok(ar.subjects[id].task, `Missing subject task in ar.json: ${id}`)
  }
})

test('all categories have English and Arabic translations', () => {
  for (const subject of Object.values(SUBJECTS)) {
    const catKey = subject.category.toLowerCase().replace(/[^a-z]/g, '')
    assert.ok(en.categories[catKey], `Missing category in en.json: ${catKey}`)
    assert.ok(ar.categories[catKey], `Missing category in ar.json: ${catKey}`)
  }
})

test('all 7 days and short days have English and Arabic translations', () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  for (const d of days) {
    assert.ok(en.days[d], `Missing day in en.json: ${d}`)
    assert.ok(ar.days[d], `Missing day in ar.json: ${d}`)
    assert.ok(en.daysShort[d], `Missing short day in en.json: ${d}`)
    assert.ok(ar.daysShort[d], `Missing short day in ar.json: ${d}`)
  }
})

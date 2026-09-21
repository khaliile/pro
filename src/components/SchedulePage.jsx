import { useState, useMemo, useEffect, useRef } from 'react'
import {
  Sun, Moon, Pencil, Brain, Zap, Utensils,
  AlarmClock, GraduationCap, ChevronDown, Check, BedDouble,
  Calculator, Globe2, Atom, Leaf, Languages, MessageCircle,
  Activity, Sparkles, BookOpen, Coffee, LayoutGrid, BarChart3,
  Flame, CheckCheck, Smile, Star, X, RotateCcw, Plus, CheckCircle2,
  TrendingUp, Compass, Timer, Heart, Play, Pause, Headphones
} from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

/* ─── Translations & Labels ────────────────────────────────────────── */
const LABELS = {
  ar: {
    heading: 'الجدول اليومي',
    subheading: 'تنظيم يومك الدراسي والشخصي خطوة بخطوة — 3APIC · 2026–2027',
    viewGrid: 'شبكة الفترات',
    viewChart: 'المخطط الذكي',
    viewLabel: 'طريقة العرض:',
    revision: 'المراجعة',
    revisionSlot1: 'مراجعة 1',
    revisionSlot2: 'مراجعة 2',
    pickRevisionHint: 'اختر مادتي المراجعة المسائية:',
    legendTitle: 'دليل الألوان:',
    summarySchool: 'حصص المدرسة',
    summaryRevision: 'المراجعة المسائية',
    summarySleep: 'النوم الصحي',
    summaryDone: 'الكتل المنجزة',
    sleepTime: '00:00 ← 07:00 (7 س)',
    revisionTotal: '3 س 30 د',
    hourUnit: 'س',
    minuteUnit: 'د',
    block: 'كتلة',
    blocks: 'كتل',
    clickHint: 'انقر على أي كتلة لتسجيل إنجازها. لتعديلها اضغط ✎. لبدء مؤقت بومودورو اضغط ▶.',
    allDoneEncouragement: 'رائع جداً! أنجزت جميع كتل هذا اليوم بنجاح!',
    todayBadge: 'اليوم',
    restHeading: 'الأحد — راحة وتجديد الطاقة',
    restBody: 'لا توجد حصص دراسية اليوم. خذ قسطاً كافياً من الراحة والنوم، واقضِ وقتاً ممتعاً مع العائلة.',
    restNote: 'فصلك الدراسي الجديد يبدأ صباح الاثنين بكل همة ونشاط.',
    deepSleep: 'النوم العميق والصحي',
    deepSleepDesc: 'نوم منتظم ومريح لإعادة شحن العقل والجسد قبل الاستيقاظ في 07:00.',
    editBlock: 'تعديل هذه الكتلة',
    editModalTitle: 'تعديل كتلة في الجدول',
    editModalSubtitle: 'يمكنك تخصيص اسم المادة، الوقت، أو التصنيف بحرية:',
    fieldName: 'اسم المادة أو النشاط:',
    fieldStart: 'وقت البدء:',
    fieldEnd: 'وقت الانتهاء:',
    fieldType: 'التصنيف / النوع:',
    fieldColor: 'اللون المميز:',
    quickSuggestions: 'اقتراحات سريعة:',
    saveChanges: 'حفظ التعديلات',
    cancel: 'إلغاء',
    resetDefault: 'استعادة الأصل',
    resetSuccess: 'تمت استعادة القيمة الأصلية',
    customTag: 'معدلة',
    startSession: 'ابدأ',
    startPomodoro: 'ابدأ جلسة بومودورو لهذه المادة',
    focusSession: 'جلسة تركيز بومودورو',
    restSession: 'استراحة قصيرة',
    timerTaskTime: 'كامل وقت الفترة',
    pauseTimer: 'إيقاف مؤقت',
    resumeTimer: 'متابعة',
    resetTimer: 'إعادة ضبط',
    finishAndMarkDone: 'إتمام وتحديد كمنجز ✓',
    sessionFinished: 'أحسنت! أتممت جلسة التركيز بنجاح!',
    chartHeading: 'المسار الزمني الذكي لليوم (07:00 ← 00:00)',
    timeDistribution: 'تحليل توزيع ساعات اليوم (24 ساعة)',
    energyCurve: 'منحنى الطاقة والتركيز الذهني',
    academicFocus: 'التعلم المدرسي والمراجعة',
    restAndHealth: 'الراحة، التغذية والنوم',
    energyPhases: [
      { name: 'قمة التركيز الصباحي', time: '08:00 – 12:00', level: '100% تركيز', desc: 'أعلى مستوى استيعاب للمواد العلمية واللغات', icon: 'sun', color: '#3b82f6' },
      { name: 'استراحة وتجديد طاقة', time: '12:00 – 14:00', level: 'غداء + قيلولة', desc: 'استعادة النشاط الذهني والبدني', icon: 'food', color: '#f97316' },
      { name: 'الاستيعاب والتطبيق المسائي', time: '14:00 – 18:00', level: '85% تركيز', desc: 'حصص مسائية وتطبيقات عملية', icon: 'book', color: '#8b5cf6' },
      { name: 'المراجعة المسائية العميقة', time: '19:00 – 22:00', level: '90% تركيز', desc: 'تثبيت المفاهيم وحل التمارين المنزلية', icon: 'notes', color: '#7c3aed' },
      { name: 'التهدئة والنوم الهانئ', time: '22:00 – 07:00', level: 'راحة تامة', desc: 'عشاء خفيف، ابتعاد عن الشاشات، ونوم 7 ساعات', icon: 'moon', color: '#6366f1' },
    ],
    days: [
      { id: 0, key: 'sun', short: 'أحد', full: 'الأحد' },
      { id: 1, key: 'mon', short: 'اثن', full: 'الاثنين' },
      { id: 2, key: 'tue', short: 'ثلا', full: 'الثلاثاء' },
      { id: 3, key: 'wed', short: 'أرب', full: 'الأربعاء' },
      { id: 4, key: 'thu', short: 'خمي', full: 'الخميس' },
      { id: 5, key: 'fri', short: 'جمع', full: 'الجمعة' },
      { id: 6, key: 'sat', short: 'سبت', full: 'السبت' },
    ],
    periods: {
      morning: {
        title: 'الفترة الصباحية',
        time: '07:00 – 12:00',
        badge: 'صباحاً',
      },
      afternoon: {
        title: 'الظهيرة وبعد الظهر',
        time: '12:00 – 18:00',
        badge: 'مساءً',
      },
      evening: {
        title: 'المساء والمراجعة والليل',
        time: '18:00 – 00:00',
        badge: 'ليلاً',
      },
    },
    types: {
      class: 'حصة',
      revision: 'مراجعة',
      break: 'استراحة',
      routine: 'روتين',
      activity: 'نشاط',
      sleep: 'نوم',
    },
    subjects: {
      math: 'الرياضيات',
      arabic: 'اللغة العربية',
      french: 'اللغة الفرنسية',
      english: 'اللغة الإنجليزية',
      physics: 'الفيزياء والكيمياء',
      svt: 'علوم الحياة والأرض',
      islamic: 'التربية الإسلامية',
      social: 'الاجتماعيات',
      pe: 'التربية البدنية',
    },
    routineBlocks: {
      wakeupBreakfast: 'الاستيقاظ والإفطار الصحي',
      lunch: 'استراحة الغداء',
      nap: 'راحة وقيلولة لشحن الطاقة',
      walk: 'نزهة مسائية وهواء نقي',
      dinner: 'العشاء والاسترخاء',
      windDown: 'مراجعة الملاحظات والاستعداد للنوم',
      freeStudy: 'وقت مراجعة حرة / نشاط',
      weekendRest: 'عطلة نهاية الأسبوع',
      fridayPrayer: 'صلاة الجمعة واستراحة الغداء',
    },
    suggestions: [
      { name: 'الرياضيات', type: 'class', color: 'blue', icon: 'calculator' },
      { name: 'اللغة الفرنسية', type: 'class', color: 'purple', icon: 'languages' },
      { name: 'اللغة العربية', type: 'class', color: 'purple', icon: 'book' },
      { name: 'اللغة الإنجليزية', type: 'class', color: 'violet', icon: 'messages' },
      { name: 'الفيزياء والكيمياء', type: 'class', color: 'blue', icon: 'atom' },
      { name: 'علوم الحياة والأرض', type: 'class', color: 'emerald', icon: 'leaf' },
      { name: 'التربية الإسلامية', type: 'class', color: 'amber', icon: 'sun' },
      { name: 'الاجتماعيات', type: 'class', color: 'amber', icon: 'globe' },
      { name: 'التربية البدنية', type: 'class', color: 'emerald', icon: 'activity' },
      { name: 'مراجعة واختبارات', type: 'revision', color: 'violet', icon: 'pencil' },
      { name: 'استراحة وقهوة', type: 'break', color: 'orange', icon: 'food' },
      { name: 'نزهة ورياضة', type: 'activity', color: 'teal', icon: 'activity' },
    ],
  },
  en: {
    heading: 'Daily schedule',
    subheading: 'Your full day from wake-up to lights out — 3APIC · 2026–2027',
    viewGrid: 'Period Grid',
    viewChart: 'Smart Chart',
    viewLabel: 'View style:',
    revision: 'Revision',
    revisionSlot1: 'Revision 1',
    revisionSlot2: 'Revision 2',
    pickRevisionHint: 'Select evening revision subjects:',
    legendTitle: 'Legend:',
    summarySchool: 'School Classes',
    summaryRevision: 'Evening Revision',
    summarySleep: 'Healthy Sleep',
    summaryDone: 'Completed Tasks',
    sleepTime: '00:00 → 07:00 (7h)',
    revisionTotal: '3h 30m',
    hourUnit: 'h',
    minuteUnit: 'm',
    block: 'block',
    blocks: 'blocks',
    clickHint: 'Click any block to mark done. Click ✎ to edit. Click ▶ to start Pomodoro timer.',
    allDoneEncouragement: 'Outstanding! You completed all scheduled blocks for today!',
    todayBadge: 'Today',
    restHeading: 'Sunday — Rest & Recharge',
    restBody: 'No classes today. Rest well, sleep in, spend time with family, or do a light review if you feel like it.',
    restNote: 'Your next school week starts fresh on Monday morning.',
    deepSleep: 'Deep & Healthy Sleep',
    deepSleepDesc: 'Consistent, restful sleep to recharge body and mind before 07:00 wake-up.',
    editBlock: 'Edit this block',
    editModalTitle: 'Edit Schedule Block',
    editModalSubtitle: 'Customize the subject name, time, or category freely:',
    fieldName: 'Subject or Activity Name:',
    fieldStart: 'Start time:',
    fieldEnd: 'End time:',
    fieldType: 'Category / Type:',
    fieldColor: 'Accent Color:',
    quickSuggestions: 'Quick suggestions:',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    resetDefault: 'Reset to default',
    resetSuccess: 'Reverted to default',
    customTag: 'Edited',
    startSession: 'Start',
    startPomodoro: 'Start Pomodoro session for this subject',
    focusSession: 'Pomodoro Focus Session',
    restSession: 'Short Break',
    timerTaskTime: 'Full Block Time',
    pauseTimer: 'Pause',
    resumeTimer: 'Resume',
    resetTimer: 'Reset',
    finishAndMarkDone: 'Finish & Mark Done ✓',
    sessionFinished: 'Well done! Focus session completed successfully!',
    chartHeading: 'Smart Day Timeline Chart (07:00 → 00:00)',
    timeDistribution: 'Daily 24-Hour Time Distribution',
    energyCurve: 'Cognitive Focus & Energy Flow',
    academicFocus: 'School & Revision Hours',
    restAndHealth: 'Rest, Meals & Sleep',
    energyPhases: [
      { name: 'Morning Peak Focus', time: '08:00 – 12:00', level: '100% Focus', desc: 'Highest cognitive clarity for sciences and languages', icon: 'sun', color: '#3b82f6' },
      { name: 'Midday Recharge', time: '12:00 – 14:00', level: 'Lunch + Nap', desc: 'Replenishing energy and mental recovery', icon: 'food', color: '#f97316' },
      { name: 'Afternoon Application', time: '14:00 – 18:00', level: '85% Focus', desc: 'Afternoon classes and practical exercises', icon: 'book', color: '#8b5cf6' },
      { name: 'Evening Deep Study', time: '19:00 – 22:00', level: '90% Focus', desc: 'Consolidating knowledge and homework review', icon: 'notes', color: '#7c3aed' },
      { name: 'Wind Down & Sleep', time: '22:00 – 07:00', level: 'Full Recovery', desc: 'Light dinner, no screens, and 7 hours healthy sleep', icon: 'moon', color: '#6366f1' },
    ],
    days: [
      { id: 0, key: 'sun', short: 'Sun', full: 'Sunday' },
      { id: 1, key: 'mon', short: 'Mon', full: 'Monday' },
      { id: 2, key: 'tue', short: 'Tue', full: 'Tuesday' },
      { id: 3, key: 'wed', short: 'Wed', full: 'Wednesday' },
      { id: 4, key: 'thu', short: 'Thu', full: 'Thursday' },
      { id: 5, key: 'fri', short: 'Fri', full: 'Friday' },
      { id: 6, key: 'sat', short: 'Sat', full: 'Saturday' },
    ],
    periods: {
      morning: {
        title: 'Morning Period',
        time: '07:00 – 12:00',
        badge: 'Morning',
      },
      afternoon: {
        title: 'Midday & Afternoon',
        time: '12:00 – 18:00',
        badge: 'Afternoon',
      },
      evening: {
        title: 'Evening & Revision',
        time: '18:00 – 00:00',
        badge: 'Night',
      },
    },
    types: {
      class: 'Class',
      revision: 'Revision',
      break: 'Break',
      routine: 'Routine',
      activity: 'Activity',
      sleep: 'Sleep',
    },
    subjects: {
      math: 'Math',
      arabic: 'Arabic',
      french: 'French',
      english: 'English',
      physics: 'Physics & Chemistry',
      svt: 'Life & Earth Sciences',
      islamic: 'Islamic Education',
      social: 'Social Studies',
      pe: 'Physical Education',
    },
    routineBlocks: {
      wakeupBreakfast: 'Wake up & Healthy Breakfast',
      lunch: 'Lunch break',
      nap: 'Rest & power nap to recharge',
      walk: 'Evening walk & fresh air',
      dinner: 'Dinner & relaxation',
      windDown: 'Review notes & wind down for sleep',
      freeStudy: 'Free study / personal project',
      weekendRest: 'Weekend rest & free time',
      fridayPrayer: 'Friday prayer & lunch break',
    },
    suggestions: [
      { name: 'Math', type: 'class', color: 'blue', icon: 'calculator' },
      { name: 'French', type: 'class', color: 'purple', icon: 'languages' },
      { name: 'Arabic', type: 'class', color: 'purple', icon: 'book' },
      { name: 'English', type: 'class', color: 'violet', icon: 'messages' },
      { name: 'Physics & Chemistry', type: 'class', color: 'blue', icon: 'atom' },
      { name: 'SVT', type: 'class', color: 'emerald', icon: 'leaf' },
      { name: 'Islamic Education', type: 'class', color: 'amber', icon: 'sun' },
      { name: 'Social Studies', type: 'class', color: 'amber', icon: 'globe' },
      { name: 'Physical Education', type: 'class', color: 'emerald', icon: 'activity' },
      { name: 'Exam Preparation', type: 'revision', color: 'violet', icon: 'pencil' },
      { name: 'Coffee & Snack', type: 'break', color: 'orange', icon: 'food' },
      { name: 'Outdoor Walk', type: 'activity', color: 'teal', icon: 'activity' },
    ],
  },
}

/* ─── School timetable (3APIC-11, 2026-2027) ──────────────────────── */
const SCHOOL_TIMETABLE = {
  0: [], // Sunday
  1: [ // Monday
    { start: '08:00', end: '10:00', subjectId: 'french',  icon: 'languages', color: 'purple', type: 'class', startH: 8, endH: 10 },
    { start: '10:00', end: '12:00', subjectId: 'math',    icon: 'calculator', color: 'blue',   type: 'class', startH: 10, endH: 12 },
    { start: '14:00', end: '16:00', subjectId: 'arabic',  icon: 'book',       color: 'purple', type: 'class', startH: 14, endH: 16 },
    { start: '16:00', end: '18:00', subjectId: 'english', icon: 'messages',   color: 'violet', type: 'class', startH: 16, endH: 18 },
  ],
  2: [ // Tuesday
    { start: '08:00', end: '10:00', subjectId: 'islamic', icon: 'sun',        color: 'amber',   type: 'class', startH: 8, endH: 10 },
    { start: '10:00', end: '12:00', subjectId: 'math',    icon: 'calculator', color: 'blue',    type: 'class', startH: 10, endH: 12 },
    { start: '14:00', end: '16:00', subjectId: 'french',  icon: 'languages',  color: 'purple',  type: 'class', startH: 14, endH: 16 },
    { start: '16:00', end: '18:00', subjectId: 'social',  icon: 'globe',      color: 'amber',   type: 'class', startH: 16, endH: 18 },
  ],
  3: [ // Wednesday
    { start: '08:00', end: '10:00', subjectId: 'physics', icon: 'atom',       color: 'blue',    type: 'class', startH: 8, endH: 10 },
    { start: '10:00', end: '12:00', subjectId: 'svt',     icon: 'leaf',       color: 'emerald', type: 'class', startH: 10, endH: 12 },
    { start: '14:00', end: '16:00', subjectId: 'math',    icon: 'calculator', color: 'blue',    type: 'class', startH: 14, endH: 16 },
    { start: '16:00', end: '18:00', key: 'freeStudy',    icon: 'brain',      color: 'teal',    type: 'routine', startH: 16, endH: 18 },
  ],
  4: [ // Thursday
    { start: '08:00', end: '10:00', subjectId: 'arabic',  icon: 'book',       color: 'purple',  type: 'class', startH: 8, endH: 10 },
    { start: '10:00', end: '12:00', subjectId: 'islamic', icon: 'sun',        color: 'amber',   type: 'class', startH: 10, endH: 12 },
    { start: '14:00', end: '16:00', subjectId: 'svt',     icon: 'leaf',       color: 'emerald', type: 'class', startH: 14, endH: 16 },
    { start: '16:00', end: '18:00', subjectId: 'physics', icon: 'atom',       color: 'blue',    type: 'class', startH: 16, endH: 18 },
  ],
  5: [ // Friday
    { start: '08:00', end: '10:00', subjectId: 'english', icon: 'messages',   color: 'violet',  type: 'class', startH: 8, endH: 10 },
    { start: '10:00', end: '12:00', subjectId: 'arabic',  icon: 'book',       color: 'purple',  type: 'class', startH: 10, endH: 12 },
    { start: '14:00', end: '15:00', subjectId: 'pe',      icon: 'activity',   color: 'emerald', type: 'class', startH: 14, endH: 15 },
    { start: '15:00', end: '17:00', subjectId: 'physics', icon: 'atom',       color: 'blue',    type: 'class', startH: 15, endH: 17 },
    { start: '17:00', end: '18:00', key: 'freeStudy',    icon: 'sparkles',   color: 'teal',    type: 'routine', startH: 17, endH: 18 },
  ],
  6: [ // Saturday
    { start: '08:00', end: '10:00', subjectId: 'french',  icon: 'languages',  color: 'purple',  type: 'class', startH: 8, endH: 10 },
    { start: '10:00', end: '12:00', subjectId: 'math',    icon: 'calculator', color: 'blue',    type: 'class', startH: 10, endH: 12 },
    { start: '14:00', end: '18:00', key: 'weekendRest',  icon: 'sun',        color: 'amber',   type: 'activity', startH: 14, endH: 18 },
  ],
}

/* ─── Fixed daily routine (hour-by-hour) ───────────────────────────── */
const ROUTINE_FIXED = [
  { key: 'wakeupBreakfast', start: '07:00', end: '08:00', icon: 'sun',     color: 'amber',  type: 'routine', startH: 7,  endH: 8,  period: 'morning' },
  { key: 'lunch',           start: '12:00', end: '13:00', icon: 'food',    color: 'orange', type: 'break',   startH: 12, endH: 13, period: 'afternoon' },
  { key: 'nap',             start: '13:00', end: '14:00', icon: 'moon',    color: 'indigo', type: 'break',   startH: 13, endH: 14, period: 'afternoon' },
  { key: 'walk',            start: '18:00', end: '19:00', icon: 'wind',    color: 'teal',   type: 'activity', startH: 18, endH: 19, period: 'evening' },
  { key: 'rev1',            start: '19:00', end: '20:30', icon: 'pencil',  color: 'violet', type: 'revision', slot: 1, startH: 19, endH: 20.5, period: 'evening' },
  { key: 'rev2',            start: '20:30', end: '22:00', icon: 'pencil',  color: 'purple', type: 'revision', slot: 2, startH: 20.5, endH: 22, period: 'evening' },
  { key: 'dinner',          start: '22:00', end: '23:00', icon: 'food',    color: 'orange', type: 'break',   startH: 22, endH: 23, period: 'evening' },
  { key: 'windDown',        start: '23:00', end: '00:00', icon: 'notes',   color: 'blue',   type: 'routine', startH: 23, endH: 24, period: 'evening' },
]

const SUBJECTS_ORDER = ['math', 'arabic', 'french', 'english', 'physics', 'svt', 'islamic', 'social', 'pe']

const COLOR_MAP = {
  blue:    { border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8', name: 'Blue' },
  purple:  { border: '#8b5cf6', bg: '#f5f3ff', text: '#6d28d9', name: 'Purple' },
  violet:  { border: '#7c3aed', bg: '#ede9fe', text: '#5b21b6', name: 'Violet' },
  amber:   { border: '#f59e0b', bg: '#fffbeb', text: '#b45309', name: 'Amber' },
  emerald: { border: '#10b981', bg: '#ecfdf5', text: '#047857', name: 'Emerald' },
  orange:  { border: '#f97316', bg: '#fff7ed', text: '#c2410c', name: 'Orange' },
  teal:    { border: '#14b8a6', bg: '#f0fdfa', text: '#0f766e', name: 'Teal' },
  indigo:  { border: '#6366f1', bg: '#eef2ff', text: '#4338ca', name: 'Indigo' },
}

const AVAILABLE_HOURS = [
  '06:00', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00',
  '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
  '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
  '22:30', '23:00', '23:30', '00:00'
]

function BlockIcon({ icon, size = 16 }) {
  const p = { size, strokeWidth: 1.8 }
  switch (icon) {
    case 'calculator': return <Calculator {...p} />
    case 'languages':  return <Languages  {...p} />
    case 'book':       return <BookOpen   {...p} />
    case 'messages':   return <MessageCircle {...p} />
    case 'sun':        return <Sun        {...p} />
    case 'globe':      return <Globe2     {...p} />
    case 'atom':       return <Atom       {...p} />
    case 'leaf':       return <Leaf       {...p} />
    case 'activity':   return <Activity   {...p} />
    case 'food':       return <Utensils   {...p} />
    case 'moon':       return <Moon       {...p} />
    case 'wind':       return <Activity   {...p} />
    case 'pencil':     return <Pencil     {...p} />
    case 'notes':      return <Brain      {...p} />
    case 'sleep':      return <BedDouble  {...p} />
    case 'sparkles':   return <Sparkles   {...p} />
    default:           return <Star       {...p} />
  }
}

// Gentle audio chime for session completion
function playCompletionChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.setValueAtTime(880, now + 0.15) // A5
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
    osc.start(now)
    osc.stop(now + 0.8)
  } catch {}
}

export default function SchedulePage() {
  const { language } = useTranslation()
  const isAr = language === 'ar'
  const L = LABELS[language] || LABELS.en

  const today = new Date()
  const dayIdx = today.getDay()
  const [selectedDay, setSelectedDay] = useState(dayIdx)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'chart'
  const [revSubjects, setRevSubjects] = useState({ 1: 'math', 2: 'arabic' })

  // User Customizations state (persisted in localStorage)
  const [customOverrides, setCustomOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem('study-quest.schedule.custom.v2')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Done completion state
  const [done, setDone] = useState(() => {
    try {
      const saved = localStorage.getItem('study-quest.schedule.done')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Active Pomodoro Session state
  const [activePomodoro, setActivePomodoro] = useState(null)
  const timerDeadline = useRef(0)

  // Editing modal state
  const [editingBlock, setEditingBlock] = useState(null)
  const [editFormData, setEditFormData] = useState({
    label: '',
    start: '',
    end: '',
    type: 'class',
    color: 'blue',
    icon: 'book',
  })

  // Save customizations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('study-quest.schedule.custom.v2', JSON.stringify(customOverrides))
    } catch {}
  }, [customOverrides])

  // Save done state
  useEffect(() => {
    try {
      localStorage.setItem('study-quest.schedule.done', JSON.stringify(done))
    } catch {}
  }, [done])

  // Pomodoro Live Countdown Interval
  useEffect(() => {
    if (!activePomodoro || !activePomodoro.isRunning) return

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((timerDeadline.current - Date.now()) / 1000))
      setActivePomodoro(prev => {
        if (!prev) return null
        if (remaining === 0 && prev.remainingSeconds > 0) {
          playCompletionChime()
          return { ...prev, remainingSeconds: 0, isRunning: false, isFinished: true }
        }
        return { ...prev, remainingSeconds: remaining }
      })
    }

    const interval = setInterval(tick, 250)
    tick()
    return () => clearInterval(interval)
  }, [activePomodoro?.isRunning])

  const schoolBlocks = SCHOOL_TIMETABLE[selectedDay] || []
  const isRestDay = selectedDay === 0

  /* Build full list of blocks for the day with custom user overrides */
  const dayBlocks = useMemo(() => {
    if (isRestDay) return []

    // Map routine
    const routine = ROUTINE_FIXED.map(b => {
      let label = ''
      if (b.slot === 1) {
        label = `${L.revision} · ${L.subjects[revSubjects[1]] || revSubjects[1]}`
      } else if (b.slot === 2) {
        label = `${L.revision} · ${L.subjects[revSubjects[2]] || revSubjects[2]}`
      } else {
        label = L.routineBlocks[b.key] || b.key
      }
      return {
        ...b,
        id: `routine-${b.key}-${selectedDay}`,
        label,
        period: b.period,
      }
    })

    // Map school classes
    const classes = schoolBlocks.map(b => {
      let label = ''
      let period = 'morning'
      if (b.startH >= 12 && b.startH < 18) period = 'afternoon'
      else if (b.startH >= 18) period = 'evening'

      if (b.subjectId) {
        label = L.subjects[b.subjectId] || b.subjectId
      } else if (b.key) {
        label = L.routineBlocks[b.key] || b.key
      }

      return {
        ...b,
        id: `class-${selectedDay}-${b.startH}-${b.endH}`,
        label,
        period,
      }
    })

    const rawList = [...routine, ...classes]

    // Apply any custom overrides saved by the user!
    return rawList.map(b => {
      const override = customOverrides[b.id]
      if (!override) return b

      const startParts = (override.start || b.start).split(':').map(Number)
      const endParts = (override.end || b.end).split(':').map(Number)
      const startH = startParts[0] + (startParts[1] || 0) / 60
      const endH = (endParts[0] === 0 ? 24 : endParts[0]) + (endParts[1] || 0) / 60

      let period = b.period
      if (startH < 12) period = 'morning'
      else if (startH < 18) period = 'afternoon'
      else period = 'evening'

      return {
        ...b,
        ...override,
        startH,
        endH,
        period,
        isCustomized: true,
      }
    }).sort((a, b) => a.startH - b.startH || a.start.localeCompare(b.start))
  }, [selectedDay, revSubjects, isRestDay, L, customOverrides])

  // Group blocks into 3 periods for the system grid
  const periods = useMemo(() => {
    const morning = dayBlocks.filter(b => b.period === 'morning')
    const afternoon = dayBlocks.filter(b => b.period === 'afternoon')
    const evening = dayBlocks.filter(b => b.period === 'evening')
    return { morning, afternoon, evening }
  }, [dayBlocks])

  const toggleDone = (id) => {
    setDone(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Summary numbers
  const schoolHours = useMemo(() => {
    return dayBlocks.filter(b => b.type === 'class').reduce((acc, b) => acc + (b.endH - b.startH), 0)
  }, [dayBlocks])

  const revisionHours = useMemo(() => {
    return dayBlocks.filter(b => b.type === 'revision').reduce((acc, b) => acc + (b.endH - b.startH), 0)
  }, [dayBlocks])

  const breakHours = useMemo(() => {
    return dayBlocks.filter(b => b.type === 'break' || b.type === 'activity' || b.type === 'routine').reduce((acc, b) => acc + (b.endH - b.startH), 0)
  }, [dayBlocks])

  const doneCount = useMemo(() => {
    return dayBlocks.filter(b => done[b.id]).length
  }, [dayBlocks, done])

  // Start Pomodoro function based on selected task and its scheduled time
  const startPomodoro = (title, taskId, durationHours = 1.5, color = '#7c3aed') => {
    // Lookup block if present to get live duration and subject label
    const block = taskId ? dayBlocks.find(b => b.id === taskId) : null
    const effectiveHours = block ? (block.endH - block.startH) : durationHours
    const totalMinutes = Math.max(5, Math.round(effectiveHours * 60))
    // Duration is based directly on the task time clicked by the user!
    const initialMinutes = totalMinutes
    const totalSeconds = initialMinutes * 60
    timerDeadline.current = Date.now() + totalSeconds * 1000

    setActivePomodoro({
      taskTitle: block ? block.label : title,
      taskId,
      taskMinutes: totalMinutes,
      totalSeconds,
      remainingSeconds: totalSeconds,
      preset: 'task',
      isRunning: true,
      isFinished: false,
      mode: 'focus',
      color: block && COLOR_MAP[block.color]?.border ? COLOR_MAP[block.color].border : color,
    })
  }

  // Change Pomodoro Preset Duration (25m / 45m / full task duration)
  const setPomodoroPreset = (minutes, presetKey) => {
    if (!activePomodoro) return
    const totalSeconds = minutes * 60
    timerDeadline.current = Date.now() + totalSeconds * 1000
    setActivePomodoro(prev => ({
      ...prev,
      totalSeconds,
      remainingSeconds: totalSeconds,
      preset: presetKey,
      isRunning: true,
      isFinished: false,
    }))
  }

  // Toggle play/pause
  const togglePomodoroRunning = () => {
    if (!activePomodoro) return
    if (activePomodoro.isRunning) {
      // Pause
      const remaining = Math.max(0, Math.ceil((timerDeadline.current - Date.now()) / 1000))
      setActivePomodoro(prev => ({
        ...prev,
        remainingSeconds: remaining,
        isRunning: false,
      }))
    } else {
      // Resume
      const seconds = activePomodoro.remainingSeconds || activePomodoro.totalSeconds
      timerDeadline.current = Date.now() + seconds * 1000
      setActivePomodoro(prev => ({
        ...prev,
        isRunning: true,
        isFinished: false,
      }))
    }
  }

  // Reset Pomodoro
  const resetPomodoro = () => {
    if (!activePomodoro) return
    timerDeadline.current = Date.now() + activePomodoro.totalSeconds * 1000
    setActivePomodoro(prev => ({
      ...prev,
      remainingSeconds: prev.totalSeconds,
      isRunning: false,
      isFinished: false,
    }))
  }

  // Complete and mark task done in the schedule!
  const completePomodoroAndMarkDone = () => {
    if (!activePomodoro) return
    if (activePomodoro.taskId) {
      setDone(prev => ({ ...prev, [activePomodoro.taskId]: true }))
    }
    playCompletionChime()
    setActivePomodoro(null)
  }

  // Open Edit Modal
  const handleOpenEdit = (block) => {
    setEditingBlock(block)
    setEditFormData({
      label: block.label || '',
      start: block.start || '08:00',
      end: block.end || '10:00',
      type: block.type || 'class',
      color: block.color || 'blue',
      icon: block.icon || 'book',
    })
  }

  // Save Edit Form
  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingBlock) return

    setCustomOverrides(prev => ({
      ...prev,
      [editingBlock.id]: {
        label: editFormData.label.trim() || editingBlock.label,
        start: editFormData.start,
        end: editFormData.end,
        type: editFormData.type,
        color: editFormData.color,
        icon: editFormData.icon,
      }
    }))

    setEditingBlock(null)
  }

  // Reset Block to default
  const handleResetBlock = () => {
    if (!editingBlock) return
    setCustomOverrides(prev => {
      const next = { ...prev }
      delete next[editingBlock.id]
      return next
    })
    setEditingBlock(null)
  }

  // Quick suggestion click
  const applySuggestion = (sug) => {
    setEditFormData(prev => ({
      ...prev,
      label: sug.name,
      type: sug.type,
      color: sug.color,
      icon: sug.icon,
    }))
  }

  // Formatter for HH:MM:SS or MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <section className="sched-page" aria-labelledby="sched-heading" dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── Top Bar: Day selector tabs ── */}
      <div className="sched-top-nav">
        <div className="sched-tabs" role="tablist" aria-label="Days of the week">
          {L.days.map((d) => {
            const isToday = d.id === dayIdx
            const isSel = d.id === selectedDay
            return (
              <button
                key={d.id}
                role="tab"
                aria-selected={isSel}
                className={`sched-tab${isSel ? ' active' : ''}${isToday ? ' is-today' : ''}`}
                onClick={() => setSelectedDay(d.id)}
              >
                <span className="sched-tab-name">{d.full}</span>
                <span className="sched-tab-short">{d.short}</span>
                {isToday && <span className="sched-today-indicator">{L.todayBadge}</span>}
              </button>
            )
          })}
        </div>

        {/* ── View switcher: Period Grid vs Smart Chart ── */}
        <div className="sched-view-switcher">
          <button
            className={`sched-view-btn${viewMode === 'grid' ? ' active' : ''}`}
            onClick={() => setViewMode('grid')}
            title={L.viewGrid}
          >
            <LayoutGrid size={15} />
            <span>{L.viewGrid}</span>
          </button>
          <button
            className={`sched-view-btn${viewMode === 'chart' ? ' active' : ''}`}
            onClick={() => setViewMode('chart')}
            title={L.viewChart}
          >
            <BarChart3 size={15} />
            <span>{L.viewChart}</span>
          </button>
        </div>
      </div>

      {/* ── Revision subject selectors + Start Pomodoro Buttons + Legend bar ── */}
      {!isRestDay && (
        <div className="sched-config-bar">
          <div className="sched-pickers-group">
            <span className="sched-pickers-label">
              <Pencil size={13} />
              <span>{L.pickRevisionHint}</span>
            </span>

            <div className="sched-picker-pair">
              {/* Revision 1 Picker + Start Button */}
              <div className="sched-picker">
                <span className="sched-picker-tag">{L.revisionSlot1}</span>
                <div className="sched-select-shell">
                  <select
                    value={revSubjects[1]}
                    onChange={(e) => setRevSubjects(prev => ({ ...prev, 1: e.target.value }))}
                    className="sched-select"
                    aria-label={L.revisionSlot1}
                  >
                    {SUBJECTS_ORDER.map(id => (
                      <option key={id} value={id}>{L.subjects[id]}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="sched-select-icon" />
                </div>
                <button
                  type="button"
                  className="sched-start-pomodoro-btn"
                  onClick={() => startPomodoro(
                    `${L.revision} 1 · ${L.subjects[revSubjects[1]] || revSubjects[1]}`,
                    `routine-rev1-${selectedDay}`,
                    1.5,
                    '#7c3aed'
                  )}
                  title={L.startPomodoro}
                >
                  <Play size={11} fill="currentColor" />
                  <span>{L.startSession}</span>
                </button>
              </div>

              {/* Revision 2 Picker + Start Button */}
              <div className="sched-picker">
                <span className="sched-picker-tag">{L.revisionSlot2}</span>
                <div className="sched-select-shell">
                  <select
                    value={revSubjects[2]}
                    onChange={(e) => setRevSubjects(prev => ({ ...prev, 2: e.target.value }))}
                    className="sched-select"
                    aria-label={L.revisionSlot2}
                  >
                    {SUBJECTS_ORDER.map(id => (
                      <option key={id} value={id}>{L.subjects[id]}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="sched-select-icon" />
                </div>
                <button
                  type="button"
                  className="sched-start-pomodoro-btn"
                  onClick={() => startPomodoro(
                    `${L.revision} 2 · ${L.subjects[revSubjects[2]] || revSubjects[2]}`,
                    `routine-rev2-${selectedDay}`,
                    1.5,
                    '#8b5cf6'
                  )}
                  title={L.startPomodoro}
                >
                  <Play size={11} fill="currentColor" />
                  <span>{L.startSession}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="sched-legend">
            <span className="sched-legend-item"><i style={{ background: '#3b82f6' }} />{L.types.class}</span>
            <span className="sched-legend-item"><i style={{ background: '#8b5cf6' }} />{L.types.revision}</span>
            <span className="sched-legend-item"><i style={{ background: '#f97316' }} />{L.types.break}</span>
            <span className="sched-legend-item"><i style={{ background: '#f59e0b' }} />{L.types.routine}</span>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      {isRestDay ? (
        <div className="sched-sunday-card">
          <div className="sched-sunday-glow">
            <Coffee size={44} strokeWidth={1.4} />
          </div>
          <h3>{L.restHeading}</h3>
          <p>{L.restBody}</p>
          <div className="sched-sunday-footer">
            <Sparkles size={15} />
            <span>{L.restNote}</span>
          </div>
        </div>
      ) : viewMode === 'chart' ? (
        /* ═════════════════════════════════════════════════════════════
           1. SMART ANALYTICS CHARTS (Clean, Simple, Focused)
           ═════════════════════════════════════════════════════════════ */
        <div className="sched-smart-chart-wrapper">
          <div className="sched-analytics-grid">

            {/* Time Distribution Bars */}
            <div className="sched-analytics-card">
              <div className="sched-analytics-hdr">
                <Timer size={16} className="text-blue-600" />
                <strong>{L.timeDistribution}</strong>
              </div>

              <div className="sched-dist-stack">
                <div className="sched-dist-row">
                  <div className="sched-dist-label">
                    <span><i style={{ background: '#3b82f6' }} />{L.summarySchool}</span>
                    <strong>{schoolHours} {L.hourUnit} ({Math.round((schoolHours / 24) * 100)}%)</strong>
                  </div>
                  <div className="sched-dist-track">
                    <span style={{ width: `${(schoolHours / 24) * 100}%`, background: '#3b82f6' }} />
                  </div>
                </div>

                <div className="sched-dist-row">
                  <div className="sched-dist-label">
                    <span><i style={{ background: '#8b5cf6' }} />{L.summaryRevision}</span>
                    <strong>{revisionHours} {L.hourUnit} ({Math.round((revisionHours / 24) * 100)}%)</strong>
                  </div>
                  <div className="sched-dist-track">
                    <span style={{ width: `${(revisionHours / 24) * 100}%`, background: '#8b5cf6' }} />
                  </div>
                </div>

                <div className="sched-dist-row">
                  <div className="sched-dist-label">
                    <span><i style={{ background: '#f97316' }} />{L.restAndHealth}</span>
                    <strong>{breakHours} {L.hourUnit} ({Math.round((breakHours / 24) * 100)}%)</strong>
                  </div>
                  <div className="sched-dist-track">
                    <span style={{ width: `${(breakHours / 24) * 100}%`, background: '#f97316' }} />
                  </div>
                </div>

                <div className="sched-dist-row">
                  <div className="sched-dist-label">
                    <span><i style={{ background: '#6366f1' }} />{L.summarySleep}</span>
                    <strong>7 {L.hourUnit} (29%)</strong>
                  </div>
                  <div className="sched-dist-track">
                    <span style={{ width: `${(7 / 24) * 100}%`, background: '#6366f1' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Cognitive Energy Phases */}
            <div className="sched-analytics-card">
              <div className="sched-analytics-hdr">
                <TrendingUp size={16} className="text-purple-600" />
                <strong>{L.energyCurve}</strong>
              </div>

              <div className="sched-energy-list">
                {L.energyPhases.map((phase, idx) => (
                  <div key={idx} className="sched-energy-item">
                    <div className="sched-energy-left">
                      <span className="sched-energy-dot" style={{ background: phase.color }} />
                      <div>
                        <strong>{phase.name}</strong>
                        <span className="sched-energy-desc">{phase.desc}</span>
                      </div>
                    </div>
                    <div className="sched-energy-right">
                      <span className="sched-energy-time" dir="ltr">{phase.time}</span>
                      <span className="sched-energy-badge" style={{ color: phase.color }}>{phase.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════
           2. PERIOD SYSTEM GRID (3 Columns taking Max Width, No Scroll)
           ═════════════════════════════════════════════════════════════ */
        <div className="sched-period-grid">

          {/* Morning Period */}
          <div className="sched-col sched-col-morning">
            <div className="sched-col-hdr">
              <div className="sched-col-title">
                <Sun size={17} className="text-amber-500" />
                <span>{L.periods.morning.title}</span>
              </div>
              <span className="sched-col-time" dir="ltr">{L.periods.morning.time}</span>
            </div>

            <div className="sched-card-stack">
              {periods.morning.map(b => {
                const isCompleted = done[b.id]
                const color = COLOR_MAP[b.color] || COLOR_MAP.blue
                const duration = (b.endH - b.startH).toFixed(1).replace('.0', '')
                return (
                  <div
                    key={b.id}
                    className={`sched-card sched-card-${b.type}${isCompleted ? ' completed' : ''}${b.isCustomized ? ' is-customized' : ''}`}
                    style={{ '--theme-color': color.border, '--theme-bg': color.bg }}
                    onClick={() => toggleDone(b.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleDone(b.id)}
                  >
                    <div className="sched-card-icon" style={{ color: color.border, background: color.bg }}>
                      <BlockIcon icon={b.icon} size={15} />
                    </div>
                    <div className="sched-card-content">
                      <div className="sched-card-top">
                        <span className="sched-card-name" title={b.label}>{b.label}</span>
                        <div className="sched-card-badges">
                          {b.isCustomized && <span className="sched-custom-tag" title={L.customTag}>★</span>}
                          <span className={`sched-badge sched-badge-${b.type}`}>
                            {L.types[b.type]}
                          </span>
                        </div>
                      </div>
                      <div className="sched-card-meta">
                        <span className="sched-card-time" dir="ltr">{b.start} – {b.end}</span>
                        <span className="sched-card-dot">·</span>
                        <span className="sched-card-dur">{duration} {L.hourUnit}</span>
                      </div>
                    </div>

                    {/* Start Pomodoro button for this card */}
                    <button
                      type="button"
                      className="sched-card-start-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        startPomodoro(b.label, b.id, b.endH - b.startH, color.border)
                      }}
                      title={L.startPomodoro}
                      aria-label={L.startPomodoro}
                    >
                      <Play size={11} fill="currentColor" />
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      className="sched-card-edit-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEdit(b)
                      }}
                      title={L.editBlock}
                      aria-label={L.editBlock}
                    >
                      <Pencil size={12} />
                    </button>

                    {/* Done checkmark */}
                    <span className={`sched-card-check${isCompleted ? ' active' : ''}`} aria-hidden="true">
                      {isCompleted && <Check size={13} strokeWidth={3} />}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Midday & Afternoon Period */}
          <div className="sched-col sched-col-afternoon">
            <div className="sched-col-hdr">
              <div className="sched-col-title">
                <GraduationCap size={17} className="text-indigo-500" />
                <span>{L.periods.afternoon.title}</span>
              </div>
              <span className="sched-col-time" dir="ltr">{L.periods.afternoon.time}</span>
            </div>

            <div className="sched-card-stack">
              {periods.afternoon.map(b => {
                const isCompleted = done[b.id]
                const color = COLOR_MAP[b.color] || COLOR_MAP.purple
                const duration = (b.endH - b.startH).toFixed(1).replace('.0', '')
                return (
                  <div
                    key={b.id}
                    className={`sched-card sched-card-${b.type}${isCompleted ? ' completed' : ''}${b.isCustomized ? ' is-customized' : ''}`}
                    style={{ '--theme-color': color.border, '--theme-bg': color.bg }}
                    onClick={() => toggleDone(b.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleDone(b.id)}
                  >
                    <div className="sched-card-icon" style={{ color: color.border, background: color.bg }}>
                      <BlockIcon icon={b.icon} size={15} />
                    </div>
                    <div className="sched-card-content">
                      <div className="sched-card-top">
                        <span className="sched-card-name" title={b.label}>{b.label}</span>
                        <div className="sched-card-badges">
                          {b.isCustomized && <span className="sched-custom-tag" title={L.customTag}>★</span>}
                          <span className={`sched-badge sched-badge-${b.type}`}>
                            {L.types[b.type]}
                          </span>
                        </div>
                      </div>
                      <div className="sched-card-meta">
                        <span className="sched-card-time" dir="ltr">{b.start} – {b.end}</span>
                        <span className="sched-card-dot">·</span>
                        <span className="sched-card-dur">{duration} {L.hourUnit}</span>
                      </div>
                    </div>

                    {/* Start Pomodoro button for this card */}
                    <button
                      type="button"
                      className="sched-card-start-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        startPomodoro(b.label, b.id, b.endH - b.startH, color.border)
                      }}
                      title={L.startPomodoro}
                      aria-label={L.startPomodoro}
                    >
                      <Play size={11} fill="currentColor" />
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      className="sched-card-edit-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEdit(b)
                      }}
                      title={L.editBlock}
                      aria-label={L.editBlock}
                    >
                      <Pencil size={12} />
                    </button>

                    {/* Done checkmark */}
                    <span className={`sched-card-check${isCompleted ? ' active' : ''}`} aria-hidden="true">
                      {isCompleted && <Check size={13} strokeWidth={3} />}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Evening & Night Revision Period */}
          <div className="sched-col sched-col-evening">
            <div className="sched-col-hdr">
              <div className="sched-col-title">
                <Moon size={17} className="text-purple-500" />
                <span>{L.periods.evening.title}</span>
              </div>
              <span className="sched-col-time" dir="ltr">{L.periods.evening.time}</span>
            </div>

            <div className="sched-card-stack">
              {periods.evening.map(b => {
                const isCompleted = done[b.id]
                const color = COLOR_MAP[b.color] || COLOR_MAP.violet
                const duration = (b.endH - b.startH).toFixed(1).replace('.0', '')
                return (
                  <div
                    key={b.id}
                    className={`sched-card sched-card-${b.type}${isCompleted ? ' completed' : ''}${b.isCustomized ? ' is-customized' : ''}`}
                    style={{ '--theme-color': color.border, '--theme-bg': color.bg }}
                    onClick={() => toggleDone(b.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleDone(b.id)}
                  >
                    <div className="sched-card-icon" style={{ color: color.border, background: color.bg }}>
                      <BlockIcon icon={b.icon} size={15} />
                    </div>
                    <div className="sched-card-content">
                      <div className="sched-card-top">
                        <span className="sched-card-name" title={b.label}>{b.label}</span>
                        <div className="sched-card-badges">
                          {b.isCustomized && <span className="sched-custom-tag" title={L.customTag}>★</span>}
                          <span className={`sched-badge sched-badge-${b.type}`}>
                            {L.types[b.type]}
                          </span>
                        </div>
                      </div>
                      <div className="sched-card-meta">
                        <span className="sched-card-time" dir="ltr">{b.start} – {b.end}</span>
                        <span className="sched-card-dot">·</span>
                        <span className="sched-card-dur">{duration} {L.hourUnit}</span>
                      </div>
                    </div>

                    {/* Start Pomodoro button for this card */}
                    <button
                      type="button"
                      className="sched-card-start-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        startPomodoro(b.label, b.id, b.endH - b.startH, color.border)
                      }}
                      title={L.startPomodoro}
                      aria-label={L.startPomodoro}
                    >
                      <Play size={11} fill="currentColor" />
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      className="sched-card-edit-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEdit(b)
                      }}
                      title={L.editBlock}
                      aria-label={L.editBlock}
                    >
                      <Pencil size={12} />
                    </button>

                    {/* Done checkmark */}
                    <span className={`sched-card-check${isCompleted ? ' active' : ''}`} aria-hidden="true">
                      {isCompleted && <Check size={13} strokeWidth={3} />}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Sleep Banner (00:00 → 07:00, Full Width) ── */}
      {!isRestDay && (
        <div
          className={`sched-sleep-banner${done['deep-sleep'] ? ' completed' : ''}`}
          onClick={() => toggleDone('deep-sleep')}
          role="button"
          tabIndex={0}
        >
          <div className="sched-sleep-left">
            <span className="sched-sleep-icon">
              <BedDouble size={20} />
            </span>
            <div>
              <div className="sched-sleep-title">
                <strong>{L.deepSleep}</strong>
                <span className="sched-sleep-time" dir="ltr">00:00 → 07:00</span>
              </div>
              <p className="sched-sleep-desc">{L.deepSleepDesc}</p>
            </div>
          </div>
          <div className="sched-sleep-right">
            <span className="sched-badge sched-badge-sleep">{L.types.sleep}</span>
            <span className={`sched-card-check${done['deep-sleep'] ? ' active' : ''}`}>
              {done['deep-sleep'] && <Check size={13} strokeWidth={3} />}
            </span>
          </div>
        </div>
      )}

      {/* ── Summary Counters Bar ── */}
      {!isRestDay && (
        <div className="sched-summary-bar">
          <div className="sched-sum-tile">
            <span className="sched-sum-ico text-blue-600 bg-blue-50"><GraduationCap size={18} /></span>
            <div>
              <span className="sched-sum-label">{L.summarySchool}</span>
              <strong>{schoolHours} {L.hourUnit}</strong>
            </div>
          </div>

          <div className="sched-sum-tile">
            <span className="sched-sum-ico text-purple-600 bg-purple-50"><Brain size={18} /></span>
            <div>
              <span className="sched-sum-label">{L.summaryRevision}</span>
              <strong>{revisionHours} {L.hourUnit}</strong>
            </div>
          </div>

          <div className="sched-sum-tile">
            <span className="sched-sum-ico text-indigo-600 bg-indigo-50"><BedDouble size={18} /></span>
            <div>
              <span className="sched-sum-label">{L.summarySleep}</span>
              <strong dir="ltr">{L.sleepTime}</strong>
            </div>
          </div>

          <div className="sched-sum-tile">
            <span className="sched-sum-ico text-emerald-600 bg-emerald-50"><CheckCheck size={18} /></span>
            <div>
              <span className="sched-sum-label">{L.summaryDone}</span>
              <strong>{doneCount} {doneCount === 1 ? L.block : L.blocks}</strong>
            </div>
          </div>
        </div>
      )}

      <p className="sched-hint">{L.clickHint}</p>

      {/* ═════════════════════════════════════════════════════════════
          3. ACTIVE POMODORO FLOATING BAR (Sticky Focus Companion)
          ═════════════════════════════════════════════════════════════ */}
      {activePomodoro && (
        <div className="sched-pomodoro-bar" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="sched-pomo-left">
            <div className="sched-pomo-status">
              <span className={`sched-pomo-pulse${activePomodoro.isRunning ? ' running' : ''}`} />
              <Headphones size={20} className="text-purple-300" />
            </div>
            <div className="sched-pomo-info">
              <div className="sched-pomo-title-row">
                <strong className="sched-pomo-title">{activePomodoro.taskTitle}</strong>
                <span className="sched-pomo-mode-badge">{L.focusSession}</span>
              </div>
              <div className="sched-pomo-presets">
                <button
                  type="button"
                  className={`sched-pomo-preset-btn${activePomodoro.preset === 'task' ? ' active' : ''}`}
                  onClick={() => setPomodoroPreset(activePomodoro.taskMinutes, 'task')}
                >
                  {activePomodoro.taskMinutes} {L.minuteUnit} ({L.timerTaskTime})
                </button>
                <button
                  type="button"
                  className={`sched-pomo-preset-btn${activePomodoro.preset === '25' ? ' active' : ''}`}
                  onClick={() => setPomodoroPreset(25, '25')}
                >
                  25 {L.minuteUnit}
                </button>
                <button
                  type="button"
                  className={`sched-pomo-preset-btn${activePomodoro.preset === '45' ? ' active' : ''}`}
                  onClick={() => setPomodoroPreset(45, '45')}
                >
                  45 {L.minuteUnit}
                </button>
                {activePomodoro.taskMinutes > 60 && activePomodoro.taskMinutes !== 60 && (
                  <button
                    type="button"
                    className={`sched-pomo-preset-btn${activePomodoro.preset === '60' ? ' active' : ''}`}
                    onClick={() => setPomodoroPreset(60, '60')}
                  >
                    60 {L.minuteUnit}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="sched-pomo-center">
            <div className="sched-pomo-countdown" dir="ltr" role="timer">
              {formatTime(activePomodoro.remainingSeconds)}
            </div>
            <div className="sched-pomo-progress-track">
              <span
                style={{
                  width: `${activePomodoro.totalSeconds > 0 ? ((activePomodoro.totalSeconds - activePomodoro.remainingSeconds) / activePomodoro.totalSeconds) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          <div className="sched-pomo-right">
            <button
              type="button"
              className={`sched-pomo-ctrl-btn sched-pomo-toggle${activePomodoro.isRunning ? ' is-running' : ''}`}
              onClick={togglePomodoroRunning}
              title={activePomodoro.isRunning ? L.pauseTimer : L.resumeTimer}
            >
              {activePomodoro.isRunning ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
            </button>

            <button
              type="button"
              className="sched-pomo-ctrl-btn sched-pomo-reset"
              onClick={resetPomodoro}
              title={L.resetTimer}
            >
              <RotateCcw size={16} />
            </button>

            <button
              type="button"
              className="sched-pomo-done-btn"
              onClick={completePomodoroAndMarkDone}
              title={L.finishAndMarkDone}
            >
              <Check size={14} strokeWidth={3} />
              <span>{L.finishAndMarkDone}</span>
            </button>

            <button
              type="button"
              className="sched-pomo-close-btn"
              onClick={() => setActivePomodoro(null)}
              title={L.cancel}
              aria-label={L.cancel}
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          4. EDIT BLOCK MODAL (Interactive Box Customization)
          ═════════════════════════════════════════════════════════════ */}
      {editingBlock && (
        <div
          className="sched-modal-backdrop"
          onClick={() => setEditingBlock(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-edit-title"
        >
          <div
            className="sched-modal"
            onClick={(e) => e.stopPropagation()}
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="sched-modal-hdr">
              <div className="sched-modal-title-group">
                <span className="sched-modal-icon">
                  <Pencil size={18} />
                </span>
                <div>
                  <h3 id="modal-edit-title">{L.editModalTitle}</h3>
                  <p>{L.editModalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                className="sched-modal-close"
                onClick={() => setEditingBlock(null)}
                aria-label={L.cancel}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="sched-modal-form">
              {/* Quick suggestions chips */}
              <div className="sched-form-group">
                <label className="sched-form-label">{L.quickSuggestions}</label>
                <div className="sched-sug-chips">
                  {L.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      className="sched-sug-chip"
                      onClick={() => applySuggestion(sug)}
                    >
                      {sug.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title / Label Input */}
              <div className="sched-form-group">
                <label className="sched-form-label" htmlFor="edit-block-name">
                  {L.fieldName}
                </label>
                <input
                  id="edit-block-name"
                  type="text"
                  className="sched-form-input"
                  value={editFormData.label}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, label: e.target.value }))}
                  required
                  autoFocus
                />
              </div>

              {/* Time Range Pickers */}
              <div className="sched-form-row">
                <div className="sched-form-group">
                  <label className="sched-form-label" htmlFor="edit-block-start">
                    {L.fieldStart}
                  </label>
                  <select
                    id="edit-block-start"
                    className="sched-form-select"
                    value={editFormData.start}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, start: e.target.value }))}
                    dir="ltr"
                  >
                    {AVAILABLE_HOURS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="sched-form-group">
                  <label className="sched-form-label" htmlFor="edit-block-end">
                    {L.fieldEnd}
                  </label>
                  <select
                    id="edit-block-end"
                    className="sched-form-select"
                    value={editFormData.end}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, end: e.target.value }))}
                    dir="ltr"
                  >
                    {AVAILABLE_HOURS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category / Type Selector */}
              <div className="sched-form-group">
                <label className="sched-form-label">{L.fieldType}</label>
                <div className="sched-type-selector">
                  {['class', 'revision', 'break', 'routine', 'activity'].map(typeKey => (
                    <button
                      key={typeKey}
                      type="button"
                      className={`sched-type-btn sched-type-btn-${typeKey}${editFormData.type === typeKey ? ' active' : ''}`}
                      onClick={() => setEditFormData(prev => ({ ...prev, type: typeKey }))}
                    >
                      {L.types[typeKey]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Color Selector */}
              <div className="sched-form-group">
                <label className="sched-form-label">{L.fieldColor}</label>
                <div className="sched-color-picker">
                  {Object.entries(COLOR_MAP).map(([cKey, cVal]) => (
                    <button
                      key={cKey}
                      type="button"
                      className={`sched-color-circle${editFormData.color === cKey ? ' active' : ''}`}
                      style={{ background: cVal.border }}
                      onClick={() => setEditFormData(prev => ({ ...prev, color: cKey }))}
                      title={cVal.name}
                      aria-label={cVal.name}
                    >
                      {editFormData.color === cKey && <Check size={14} color="#ffffff" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="sched-modal-actions">
                <button
                  type="button"
                  className="sched-btn-reset"
                  onClick={handleResetBlock}
                  title={L.resetDefault}
                >
                  <RotateCcw size={14} />
                  <span>{L.resetDefault}</span>
                </button>

                <div className="sched-modal-right-actions">
                  <button
                    type="button"
                    className="sched-btn-secondary"
                    onClick={() => setEditingBlock(null)}
                  >
                    {L.cancel}
                  </button>

                  <button
                    type="submit"
                    className="sched-btn-primary"
                  >
                    <CheckCircle2 size={16} />
                    <span>{L.saveChanges}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

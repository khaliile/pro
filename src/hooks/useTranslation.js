import { useLanguage } from '../contexts/LanguageContext'
import enTranslations from '../translations/en.json'
import arTranslations from '../translations/ar.json'

const translations = {
  en: enTranslations,
  ar: arTranslations
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

export function useTranslation() {
  const { language } = useLanguage()
  
  const t = (key) => {
    if (!key || typeof key !== 'string') return ''
    const keys = key.split('.')
    
    const val = getNestedValue(translations[language], keys)
    if (val !== undefined && val !== null) {
      return val
    }
    
    const fallback = getNestedValue(translations.en, keys)
    if (fallback !== undefined && fallback !== null) {
      return fallback
    }
    
    return key
  }
  
  return { t, language }
}

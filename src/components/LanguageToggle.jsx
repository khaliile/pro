import { Languages } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()
  
  return (
    <button 
      className="language-toggle" 
      onClick={toggleLanguage}
      aria-label={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
      title={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
    >
      <Languages size={18} />
      <span>{language === 'en' ? 'عربي' : 'English'}</span>
    </button>
  )
}

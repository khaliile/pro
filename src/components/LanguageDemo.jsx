import { useTranslation } from '../hooks/useTranslation'

export default function LanguageDemo() {
  const { t, language } = useTranslation()
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: '#fff', 
      border: '2px solid #9580aa', 
      padding: '10px 15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div><strong>Current Language:</strong> {language}</div>
      <div><strong>Navigation Test:</strong> {t('nav.dashboard')}</div>
      <div><strong>Profile Test:</strong> {t('profile.mySpace')}</div>
    </div>
  )
}

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Languages
import enLang from './langs/en.json'
import ptLang from './langs/pt.json'

export interface Languages {
  [code: string]: string
}

export const langs: Languages = {
  en: 'English',
  pt: 'Português'
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enLang
      },
      pt: {
        translation: ptLang
      }
    },
    fallbackLng: 'en',
    debug: true
  })


export default i18n
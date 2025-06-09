
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, Language, TranslationKey } from '@/constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first, then browser language, then default to English
    const saved = localStorage.getItem('language') as Language;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
    
    const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    return browserLang;
  });

  const isRTL = language === 'ar';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: TranslationKey): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || key;
  };

  useEffect(() => {
    // Apply RTL direction to document
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

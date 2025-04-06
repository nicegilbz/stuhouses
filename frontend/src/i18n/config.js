import { createContext, useContext, useState, useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files directly
import enGB from './locales/en-GB.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import zh from './locales/zh.json';
import he from './locales/he.json';

// Supported languages with their locale codes
export const languages = {
  'en-GB': { name: 'English (UK)', dir: 'ltr', flag: '🇬🇧' },
  'es': { name: 'Español', dir: 'ltr', flag: '🇪🇸' },
  'fr': { name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  'it': { name: 'Italiano', dir: 'ltr', flag: '🇮🇹' },
  'zh': { name: '中文', dir: 'ltr', flag: '🇨🇳' },
  'he': { name: 'עברית', dir: 'rtl', flag: '🇮🇱' },
};

// Default language is English UK
export const defaultLanguage = 'en-GB';

// Load all language resources up front
const resources = {
  'en-GB': { translation: enGB },
  'es': { translation: es },
  'fr': { translation: fr },
  'it': { translation: it },
  'zh': { translation: zh },
  'he': { translation: he }
};

// Initialize i18next
i18next
  .use(initReactI18next)
  .init({
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    resources: resources,
    interpolation: {
      escapeValue: false
    }
  });

// Create context for language settings
export const LanguageContext = createContext({
  language: defaultLanguage,
  setLanguage: () => {},
  dir: languages[defaultLanguage].dir
});

// Custom hook to use language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export function LanguageProvider({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguageState] = useState(defaultLanguage);
  const [dir, setDir] = useState(languages[defaultLanguage].dir);

  // Mark component as mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to set a new language
  const setLanguage = (newLanguage) => {
    if (!languages[newLanguage]) return;

    // Update language state
    setLanguageState(newLanguage);
    setDir(languages[newLanguage].dir);
    
    // Skip browser APIs during SSR
    if (typeof window !== 'undefined') {
      document.documentElement.lang = newLanguage;
      document.documentElement.dir = languages[newLanguage].dir;
      localStorage.setItem('preferred-language', newLanguage);
    }
    
    // Update i18next
    i18next.changeLanguage(newLanguage);
  };

  // Initialize client-side language detection once mounted
  useEffect(() => {
    if (!isMounted) return;

    // Try to load language preference
    const initializeLanguage = () => {
      let detectedLanguage = defaultLanguage;

      // 1. Check localStorage first
      const savedLang = localStorage.getItem('preferred-language');
      if (savedLang && languages[savedLang]) {
        detectedLanguage = savedLang;
      } 
      // 2. Check browser language
      else {
        const browserLang = navigator.language;
        const langCode = browserLang.split('-')[0];
        
        // Check exact match first, then language code
        if (languages[browserLang]) {
          detectedLanguage = browserLang;
        } else {
          // Find language by code
          const match = Object.keys(languages).find(key => key === langCode || key.startsWith(langCode + '-'));
          if (match) detectedLanguage = match;
        }
      }

      // Only update if different from current language
      if (detectedLanguage !== language) {
        setLanguage(detectedLanguage);
      }
    };

    // Initialize language detection
    initializeLanguage();
  }, [isMounted, language]);

  // Location detection (only if not already set)
  useEffect(() => {
    if (!isMounted || localStorage.getItem('location-checked')) return;
    
    // Delay detection to avoid early rerendering
    const timeoutId = setTimeout(() => {
      try {
        fetch('https://ipapi.co/json/')
          .then(response => response.json())
          .then(data => {
            const countryCode = data.country_code || '';
            
            // Map country code to language
            const countryToLanguage = {
              'GB': 'en-GB',
              'US': 'en-GB',
              'ES': 'es',
              'MX': 'es',
              'FR': 'fr',
              'IT': 'it',
              'CN': 'zh',
              'HK': 'zh',
              'TW': 'zh',
              'IL': 'he',
            };
            
            localStorage.setItem('location-checked', 'true');
            
            const suggestedLanguage = countryToLanguage[countryCode];
            
            // Only prompt if detected language is different
            if (suggestedLanguage && suggestedLanguage !== language) {
              const userWantsToSwitch = confirm(
                `Would you like to view the site in ${languages[suggestedLanguage].name}?`
              );
              
              if (userWantsToSwitch) {
                setLanguage(suggestedLanguage);
              }
            }
          })
          .catch(() => {
            localStorage.setItem('location-checked', 'true');
          });
      } catch (error) {
        localStorage.setItem('location-checked', 'true');
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [isMounted, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default i18next; 
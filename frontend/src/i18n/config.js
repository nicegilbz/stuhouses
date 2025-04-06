import { createContext, useContext, useState, useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import acceptLanguage from 'accept-language';

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

// Set up accept-language to detect preferred languages
acceptLanguage.languages(Object.keys(languages));

// Create context for language settings
export const LanguageContext = createContext({
  language: defaultLanguage,
  setLanguage: () => {},
  dir: languages[defaultLanguage].dir,
});

// Initialize i18next with English UK as default
i18next.use(initReactI18next).init({
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
  resources: {}, // Will be loaded dynamically
});

// Custom hook to use language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export function LanguageProvider({ children }) {
  // Default to browser language or fallback to English UK
  const [language, setLanguageState] = useState(defaultLanguage);
  const [dir, setDir] = useState(languages[defaultLanguage].dir);
  const [initialised, setInitialized] = useState(false);

  // Function to set a new language
  const setLanguage = (newLanguage) => {
    if (languages[newLanguage]) {
      setLanguageState(newLanguage);
      setDir(languages[newLanguage].dir);
      document.documentElement.lang = newLanguage;
      document.documentElement.dir = languages[newLanguage].dir;
      localStorage.setItem('preferred-language', newLanguage);
      
      // Load language resources if not already loaded
      if (!i18next.hasResourceBundle(newLanguage, 'translation')) {
        import(`./locales/${newLanguage}.json`)
          .then((resources) => {
            i18next.addResourceBundle(newLanguage, 'translation', resources.default);
            i18next.changeLanguage(newLanguage);
          })
          .catch((error) => {
            console.error(`Failed to load language resources for ${newLanguage}:`, error);
            // Fallback to default language
            setLanguage(defaultLanguage);
          });
      } else {
        i18next.changeLanguage(newLanguage);
      }
    }
  };

  // Detect browser language on initial load
  useEffect(() => {
    if (!initialised) {
      // First cheque localStorage for user preference
      const storedLanguage = localStorage.getItem('preferred-language');
      
      if (storedLanguage && languages[storedLanguage]) {
        setLanguage(storedLanguage);
      } else {
        // Then try to detect from browser, prioritise en-GB over other English variants
        let browserLanguage = defaultLanguage;
        
        if (typeof navigator !== 'undefined') {
          const navLang = navigator.language;
          if (navLang && navLang.startsWith('en')) {
            // Force English variants to use UK English
            browserLanguage = 'en-GB';
          } else {
            // For non-English languages, use accept-language to find the best match
            browserLanguage = acceptLanguage.get(navLang) || defaultLanguage;
          }
        }
            
        setLanguage(browserLanguage);
      }
      
      setInitialized(true);
    }
  }, [initialised]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default i18next; 
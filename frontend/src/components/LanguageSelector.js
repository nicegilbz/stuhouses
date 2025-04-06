import { useState, useRef, useEffect } from 'react';
import { useLanguage, languages, defaultLanguage } from '../i18n/config';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ className = '' }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);

  // Only render dropdown on client side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mounted]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  // Get language display name from translations or fallback to native name
  const getDisplayName = (code) => {
    return t(`languages.${code}`, { defaultValue: languages[code].name });
  };

  if (!mounted) {
    // Server-side rendering placeholder (minimal version to avoid hydration mismatch)
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span className="mr-1">{languages[defaultLanguage].flag}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center p-2 text-sm font-medium rounded-md hover:bg-grey-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-1">{languages[language].flag}</span>
        <span className="hidden md:inline">{getDisplayName(language)}</span>
        <svg
          className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg z-50 border border-grey-200">
          <div className="py-1">
            {Object.entries(languages).map(([code, langData]) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageChange(code)}
                className={`${
                  language === code ? 'bg-grey-100 text-grey-900' : 'text-grey-700'
                } flex items-center w-full px-4 py-2 text-sm hover:bg-grey-100 text-left transition-colors duration-200`}
                role="menuitem"
              >
                <span className="mr-2">{langData.flag}</span>
                <span>{getDisplayName(code)}</span>
                {language === code && (
                  <svg
                    className="ml-auto h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 
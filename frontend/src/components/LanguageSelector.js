import { useState, useRef, useEffect } from 'react';
import { useLanguage, languages } from '../i18n/config';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ className = '' }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center p-2 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-1">{languages[language].flag}</span>
        <span className="hidden md:inline">{languages[language].name}</span>
        <svg
          className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-1">
            {Object.entries(languages).map(([code, { name, flag }]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`${
                  language === code ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-left`}
                role="menuitem"
              >
                <span className="mr-2">{flag}</span>
                <span>{name}</span>
                {language === code && (
                  <svg
                    className="ml-auto h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
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
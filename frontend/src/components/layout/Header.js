import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon, 
  HeartIcon, 
  ChevronDownIcon, 
  ArrowRightOnRectangleIcon, 
  UserCircleIcon, 
  CreditCardIcon,
  HomeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import LanguageSelector from '../LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../utils/authContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();

  // Define navigation with translations
  const navigation = [
    { name: t('nav.properties'), href: '/properties', current: false },
    { name: t('nav.cities'), href: '/cities', current: false },
    { name: t('nav.universities'), href: '/universities', current: false },
    { name: t('nav.about'), href: '/about', current: false },
    { name: t('nav.contact'), href: '/contact', current: false },
  ];

  // Update current page in navigation
  const activeNavigation = navigation.map(item => ({
    ...item,
    current: router.pathname === item.href || 
             (item.href !== '/' && router.pathname.startsWith(item.href))
  }));

  // Add scroll event listener to change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef]);

  // Handle user logout
  const handleLogout = async () => {
    await logout();
    router.push('/');
    setUserMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">StuHouses</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {activeNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link ${
                  item.current ? 'nav-link-active' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector className="mr-2" />
            
            <Link
              href="/shortlist"
              className="p-2 text-neutral hover:text-primary hover:bg-neutral-light rounded-full transition-colours"
              aria-label={t('nav.shortlist')}
            >
              <HeartIcon className="h-6 w-6" />
            </Link>
            
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 text-grey-600 hover:text-primary focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-neutral-light p-1 flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="hidden lg:block font-medium">
                    {user?.name || 'Account'}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-grey-200">
                    <Link
                      href="/account"
                      className="flex items-center px-4 py-2 text-sm text-grey-700 hover:bg-grey-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 mr-2" />
                      My Account
                    </Link>
                    <Link
                      href="/account/bookings"
                      className="flex items-center px-4 py-2 text-sm text-grey-700 hover:bg-grey-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <HomeIcon className="h-5 w-5 mr-2" />
                      My Bookings
                    </Link>
                    <Link
                      href="/account/payments"
                      className="flex items-center px-4 py-2 text-sm text-grey-700 hover:bg-grey-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      My Payments
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-grey-700 hover:bg-grey-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="h-5 w-5 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-grey-700 hover:bg-grey-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="button-outline-primary"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                <span>{t('nav.login')} / {t('nav.signup')}</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* Mobile Language Selector */}
            <LanguageSelector className="mr-2" />
            
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-dark hover:text-primary hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">
                {isOpen ? t('common.close') : t('common.open')}
              </span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-grey-200">
          {activeNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                item.current
                  ? 'text-primary font-bold bg-neutral-light'
                  : 'text-neutral hover:text-primary hover:bg-neutral-light'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="border-t border-grey-200 pt-4 mt-4">
            <Link
              href="/shortlist"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral hover:text-primary hover:bg-neutral-light"
              onClick={() => setIsOpen(false)}
            >
              <HeartIcon className="h-5 w-5 mr-3" />
              {t('nav.shortlist')}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral hover:text-primary hover:bg-neutral-light"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  My Account
                </Link>
                <Link
                  href="/account/bookings"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral hover:text-primary hover:bg-neutral-light"
                  onClick={() => setIsOpen(false)}
                >
                  <HomeIcon className="h-5 w-5 mr-3" />
                  My Bookings
                </Link>
                <Link
                  href="/account/payments"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral hover:text-primary hover:bg-neutral-light"
                  onClick={() => setIsOpen(false)}
                >
                  <CreditCardIcon className="h-5 w-5 mr-3" />
                  My Payments
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral hover:text-primary hover:bg-neutral-light"
                    onClick={() => setIsOpen(false)}
                  >
                    <Cog6ToothIcon className="h-5 w-5 mr-3" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral hover:text-primary hover:bg-neutral-light"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral hover:text-primary hover:bg-neutral-light"
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="h-5 w-5 mr-3" />
                {t('nav.login')} / {t('nav.signup')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bars3Icon, XMarkIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Student Accommodation', href: '/properties', current: false },
  { name: 'Cities', href: '/cities', current: false },
  { name: 'Universities', href: '/universities', current: false },
  { name: 'About', href: '/about', current: false },
  { name: 'Contact', href: '/contact', current: false },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

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
            <Link
              href="/shortlist"
              className="p-2 text-neutral hover:text-primary hover:bg-neutral-light rounded-full transition-colors"
              aria-label="My Shortlist"
            >
              <HeartIcon className="h-6 w-6" />
            </Link>
            <Link
              href="/auth"
              className="button-outline-primary"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              <span>Login / Register</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-dark hover:text-primary hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">
                {isOpen ? 'Close main menu' : 'Open main menu'}
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
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
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
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <Link
              href="/shortlist"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral hover:text-primary hover:bg-neutral-light"
              onClick={() => setIsOpen(false)}
            >
              <HeartIcon className="h-5 w-5 mr-3" />
              My Shortlist
            </Link>
            <Link
              href="/auth"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral hover:text-primary hover:bg-neutral-light"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="h-5 w-5 mr-3" />
              Login / Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 
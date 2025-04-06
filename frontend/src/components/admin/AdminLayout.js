import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  UsersIcon,
  NewspaperIcon,
  UserIcon,
  Cog6ToothIcon,
  PhotoIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

// Navigation items for admin sidebar
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
  { name: 'Properties', href: '/admin/properties', icon: HomeIcon },
  { name: 'Cities', href: '/admin/cities', icon: BuildingOfficeIcon },
  { name: 'Universities', href: '/admin/universities', icon: AcademicCapIcon },
  { name: 'Agents', href: '/admin/agents', icon: UsersIcon },
  { name: 'Blog Posts', href: '/admin/blog', icon: NewspaperIcon },
  { name: 'Users', href: '/admin/users', icon: UserIcon },
  { name: 'Media', href: '/admin/media', icon: PhotoIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add current path for highlighting current nav item
  const navWithActive = navigation.map((item) => ({
    ...item,
    current: router.pathname === item.href || 
             (item.href !== '/admin' && router.pathname.startsWith(item.href))
  }));

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // This should be replaced with your actual authentication logic
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.data.user);
        } else {
          // Redirect to login if not authenticated
          router.push('/auth/login?redirect=/admin');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-grey-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-grey-600 opacity-75" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="text-2xl font-bold text-primary">StuHouses Admin</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navWithActive.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-primary-light text-primary'
                      : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      item.current ? 'text-primary' : 'text-grey-400 group-hover:text-grey-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-grey-200 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="inline-block h-9 w-9 rounded-full bg-grey-300 overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-full w-full p-1 text-grey-700" />
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-grey-700 group-hover:text-grey-900">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium text-grey-500 group-hover:text-grey-700">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-grey-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-2xl font-bold text-primary">StuHouses Admin</span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navWithActive.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      item.current
                        ? 'bg-primary-light text-primary'
                        : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        item.current ? 'text-primary' : 'text-grey-400 group-hover:text-grey-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-grey-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="inline-block h-9 w-9 rounded-full bg-grey-300 overflow-hidden">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-full w-full p-1 text-grey-700" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-grey-700 group-hover:text-grey-900">
                      {user?.name}
                    </p>
                    <p className="text-xs font-medium text-grey-500 group-hover:text-grey-700">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-grey-500 hover:text-grey-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  UserCircleIcon,
  HeartIcon,
  CreditCardIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import authService from '../../utils/auth';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/account',
    icon: HomeIcon
  },
  {
    name: 'Profile',
    href: '/account/profile',
    icon: UserCircleIcon
  },
  {
    name: 'Shortlist',
    href: '/account/shortlist',
    icon: HeartIcon
  },
  {
    name: 'Payments',
    href: '/account/payments',
    icon: CreditCardIcon
  },
  {
    name: 'Notifications',
    href: '/account/notifications',
    icon: BellIcon
  },
  {
    name: 'Settings',
    href: '/account/settings',
    icon: Cog6ToothIcon
  }
];

const AccountSidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    };
    
    getCurrentUser();
  }, []);
  
  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* User Info */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user?.name || 'User'} 
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-8 w-8 text-gray-500" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {user?.name || 'Welcome'}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {user?.email || 'User'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Menu Items */}
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    isActive 
                      ? 'bg-primary-50 text-primary' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}>
                    <item.icon className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 ${
                      isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-500'
                    }`} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
          
          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              <ArrowRightOnRectangleIcon className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-red-500" />
              <span>Log out</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AccountSidebar; 
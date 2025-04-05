import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  AcademicCapIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Dummy data for development
const stats = [
  { name: 'Properties', count: 245, icon: HomeIcon, href: '/admin/properties', color: 'bg-indigo-500' },
  { name: 'Cities', count: 38, icon: BuildingOfficeIcon, href: '/admin/cities', color: 'bg-green-500' },
  { name: 'Universities', count: 24, icon: AcademicCapIcon, href: '/admin/universities', color: 'bg-yellow-500' },
  { name: 'Users', count: 1204, icon: UsersIcon, href: '/admin/users', color: 'bg-pink-500' },
];

const recentActivity = [
  { id: 1, user: 'Admin User', action: 'created', resourceType: 'property', resourceName: 'Luxury Apartment in London', date: '2025-04-05T08:12:00' },
  { id: 2, user: 'Admin User', action: 'updated', resourceType: 'property', resourceName: 'Student House in Manchester', date: '2025-04-05T07:45:00' },
  { id: 3, user: 'John Doe', action: 'registered', resourceType: 'user', resourceName: 'John Doe', date: '2025-04-04T14:30:00' },
  { id: 4, user: 'Admin User', action: 'created', resourceType: 'city', resourceName: 'Birmingham', date: '2025-04-03T09:20:00' },
  { id: 5, user: 'Admin User', action: 'deleted', resourceType: 'property', resourceName: 'Studio Flat in Leeds', date: '2025-04-02T11:45:00' },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [dashboardStats, setDashboardStats] = useState(stats);
  const [activities, setActivities] = useState(recentActivity);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In production, you would fetch this data from your API
        // const response = await fetch('/api/admin/dashboard');
        // const data = await response.json();
        // setDashboardStats(data.counts);
        // setActivities(data.recentActivity);
        
        // Using dummy data for now
        // This delay simulates a network request
        setTimeout(() => {
          setDashboardStats(stats);
          setActivities(recentActivity);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;

    // Otherwise, show the date
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats Cards */}
        <div className="mt-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Overview</h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              // Loading skeleton
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Actual stats
              dashboardStats.map((item) => (
                <Link 
                  href={item.href} 
                  key={item.name}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-3 rounded-md ${item.color}`}>
                        <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {item.name}
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {item.count}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h2>
            <Link href="/admin/activity" className="text-sm text-primary hover:text-primary-dark">
              View all
            </Link>
          </div>
          <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, i) => (
                  <li key={i} className="px-4 py-4 sm:px-6">
                    <div className="animate-pulse flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </li>
                ))
              ) : activities.length > 0 ? (
                // Actual activity data
                activities.map((activity) => (
                  <li key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary truncate">
                          {activity.user} {activity.action} {activity.resourceType}{' '}
                          <span className="font-semibold">{activity.resourceName}</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(activity.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 text-sm text-gray-500">
                        {formatRelativeTime(activity.date)}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                  No recent activity found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Custom getLayout function to wrap the page in the AdminLayout
AdminDashboard.getLayout = function getLayout(page) {
  return page; // AdminLayout is already included in the page
}; 
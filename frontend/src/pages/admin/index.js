import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  AcademicCapIcon, 
  UsersIcon,
  ChartBarIcon,
  CurrencyPoundIcon,
  ClockIcon,
  EnvelopeIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import InitDatabaseButton from '../../components/admin/InitDatabaseButton';

// Dummy data for development
const stats = [
  { 
    name: 'Properties', 
    count: 245, 
    change: 12,
    trend: 'up',
    icon: HomeIcon, 
    href: '/admin/properties', 
    color: 'bg-indigo-500',
    chartData: [28, 35, 42, 45, 50, 58, 64, 70, 72, 78, 82, 91]
  },
  { 
    name: 'Cities', 
    count: 38, 
    change: 3,
    trend: 'up',
    icon: BuildingOfficeIcon, 
    href: '/admin/cities', 
    color: 'bg-green-500',
    chartData: [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38]
  },
  { 
    name: 'Universities', 
    count: 24, 
    change: 1,
    trend: 'up',
    icon: AcademicCapIcon, 
    href: '/admin/universities', 
    color: 'bg-yellow-500',
    chartData: [12, 14, 15, 16, 18, 18, 19, 20, 21, 22, 23, 24]
  },
  { 
    name: 'Users', 
    count: 1204, 
    change: 256,
    trend: 'up',
    icon: UsersIcon, 
    href: '/admin/users', 
    color: 'bg-pink-500',
    chartData: [320, 380, 420, 490, 540, 610, 670, 780, 860, 950, 1050, 1204]
  },
];

const revenueData = [
  { month: 'Jan', amount: 12500 },
  { month: 'Feb', amount: 14200 },
  { month: 'Mar', amount: 15800 },
  { month: 'Apr', amount: 16300 },
  { month: 'May', amount: 18200 },
  { month: 'Jun', amount: 20500 },
  { month: 'Jul', amount: 22100 },
  { month: 'Aug', amount: 24000 },
  { month: 'Sep', amount: 25500 },
  { month: 'Oct', amount: 27800 },
  { month: 'Nov', amount: 29400 },
  { month: 'Dec', amount: 32000 },
];

const recentActivity = [
  { id: 1, user: 'Admin User', action: 'created', resourceType: 'property', resourceName: 'Luxury Apartment in London', date: '2025-04-05T08:12:00' },
  { id: 2, user: 'Admin User', action: 'updated', resourceType: 'property', resourceName: 'Student House in Manchester', date: '2025-04-05T07:45:00' },
  { id: 3, user: 'John Doe', action: 'registered', resourceType: 'user', resourceName: 'John Doe', date: '2025-04-04T14:30:00' },
  { id: 4, user: 'Admin User', action: 'created', resourceType: 'city', resourceName: 'Birmingham', date: '2025-04-03T09:20:00' },
  { id: 5, user: 'Admin User', action: 'deleted', resourceType: 'property', resourceName: 'Studio Flat in Leeds', date: '2025-04-02T11:45:00' },
  { id: 6, user: 'Jane Smith', action: 'registered', resourceType: 'user', resourceName: 'Jane Smith', date: '2025-04-02T10:15:00' },
  { id: 7, user: 'Admin User', action: 'updated', resourceType: 'university', resourceName: 'University of Manchester', date: '2025-04-01T16:30:00' },
];

const quickStats = [
  { name: 'Total Revenue', value: '£258,500', change: '12.5%', trend: 'up', icon: CurrencyPoundIcon, color: 'text-green-500' },
  { name: 'Active Bookings', value: '143', change: '8.2%', trend: 'up', icon: ClockIcon, color: 'text-blue-500' },
  { name: 'New Inquiries', value: '36', change: '5.3%', trend: 'up', icon: EnvelopeIcon, color: 'text-purple-500' },
  { name: 'Page Views', value: '28.4K', change: '-2.1%', trend: 'down', icon: EyeIcon, color: 'text-orange-500' },
];

// Mini chart component
const MiniChart = ({ data, height = 40, color = 'stroke-primary' }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full overflow-hidden" style={{ height }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color.replace('bg-', 'stroke-')}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Revenue chart component
const RevenueChart = ({ data }) => {
  const maxAmount = Math.max(...data.map(item => item.amount));
  
  return (
    <div className="relative h-64">
      <div className="absolute inset-0 flex items-end">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div 
              key={index}
              className="flex-1 flex flex-col items-center"
            >
              <div className="w-full px-1">
                <div 
                  className="bg-primary hover:bg-primary-600 rounded-t w-full transition-all duration-200"
                  style={{ height: `${height}%` }}
                  title={`£${item.amount.toLocaleString()}`}
                />
              </div>
              <span className="text-xs text-grey-500 mt-1">{item.month}</span>
            </div>
          );
        })}
      </div>
      {/* Y-axis labels */}
      <div className="absolute left-0 inset-y-0 flex flex-col justify-between pointer-events-none">
        <span className="text-xs text-grey-500">£{maxAmount.toLocaleString()}</span>
        <span className="text-xs text-grey-500">£0</span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [dashboardStats, setDashboardStats] = useState(stats);
  const [activities, setActivities] = useState(recentActivity);
  const [isLoading, setIsLoading] = useState(false);
  const [revenueData, setRevenueData] = useState(revenueData);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard stats from API
        const response = await fetch('/api/admin');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Set dashboard stats from API response
          setDashboardStats(data.data.counts.map(count => {
            // Map icon names to actual imported icons
            const iconMap = {
              'HomeIcon': HomeIcon,
              'BuildingOfficeIcon': BuildingOfficeIcon,
              'AcademicCapIcon': AcademicCapIcon,
              'UsersIcon': UsersIcon
            };
            
            return {
              ...count,
              icon: iconMap[count.icon] || HomeIcon
            };
          }));
          
          setActivities(data.data.recentActivity);
          
          // Use revenue data if available
          if (data.data.revenue) {
            setRevenueData(data.data.revenue);
          }
        } else {
          console.error('Failed to fetch dashboard data:', data.message);
          toast.error('Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to connect to the server');
        
        // Fall back to dummy data if API fails
        setTimeout(() => {
          setDashboardStats(stats);
          setActivities(recentActivity);
          setIsLoading(false);
        }, 500);
      } finally {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-neutral-dark">Dashboard</h1>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <ClockIcon className="h-4 w-4 mr-1" />
              Last 30 days
            </Button>
            <Button variant="primary" size="sm">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              Generate Report
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <InitDatabaseButton />
            )}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grey-500">{stat.name}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-')}/10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                {stat.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="text-grey-500 ml-1">vs previous month</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-grey-200 h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-grey-200 rounded w-3/4"></div>
                      <div className="h-4 bg-grey-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="mt-4 animate-pulse">
                    <div className="h-24 bg-grey-200 rounded"></div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-3 rounded-md ${item.color}`}>
                        <item.icon className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-grey-500">
                          {item.name}
                        </p>
                        <div className="flex items-center">
                          <p className="text-lg font-bold text-grey-900">
                            {item.count.toLocaleString()}
                          </p>
                          <div className="flex items-center ml-2">
                            {item.trend === 'up' ? (
                              <ArrowUpIcon className="h-3 w-3 text-green-500" />
                            ) : (
                              <ArrowDownIcon className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`text-xs ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                              {item.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <MiniChart data={item.chartData} color={item.color} />
                    <div className="text-center mt-1">
                      <span className="text-xs text-grey-500">Last 12 months</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Revenue Chart and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-grey-900">Revenue (2025)</h2>
              <div className="text-sm text-grey-500">Total: £258,500</div>
            </div>
            <RevenueChart data={revenueData} />
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm">
                View Detailed Report
              </Button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
              <h2 className="text-lg font-medium text-grey-900">Recent Activity</h2>
              <Link href="/admin/activity" className="text-sm text-primary hover:text-primary-dark">
                View all
              </Link>
            </div>
            <div className="divide-y divide-grey-200 max-h-96 overflow-y-auto">
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-grey-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-grey-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : activities.length > 0 ? (
                // Actual activity data
                activities.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-grey-50">
                    <p className="text-sm font-medium text-primary">
                      <span className="font-bold">{activity.user}</span> {activity.action} {activity.resourceType}{' '}
                      <span className="font-semibold">{activity.resourceName}</span>
                    </p>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-grey-500">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                      <p className="text-xs text-grey-500">
                        {formatRelativeTime(activity.date)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-5 text-center text-grey-500">
                  No recent activity found
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-grey-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/properties/create"
              className="flex flex-col items-center justify-center p-4 border border-grey-200 rounded-lg hover:bg-grey-50 transition-colors"
            >
              <HomeIcon className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium">Add Property</span>
            </Link>
            <Link
              href="/admin/cities/create"
              className="flex flex-col items-center justify-center p-4 border border-grey-200 rounded-lg hover:bg-grey-50 transition-colors"
            >
              <BuildingOfficeIcon className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">Add City</span>
            </Link>
            <Link
              href="/admin/universities/create"
              className="flex flex-col items-center justify-center p-4 border border-grey-200 rounded-lg hover:bg-grey-50 transition-colors"
            >
              <AcademicCapIcon className="h-8 w-8 text-yellow-500 mb-2" />
              <span className="text-sm font-medium">Add University</span>
            </Link>
            <Link
              href="/admin/blog/create"
              className="flex flex-col items-center justify-center p-4 border border-grey-200 rounded-lg hover:bg-grey-50 transition-colors"
            >
              <EnvelopeIcon className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Write Blog Post</span>
            </Link>
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
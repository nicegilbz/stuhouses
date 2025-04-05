import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  UserIcon, 
  HomeIcon, 
  HeartIcon, 
  BellIcon, 
  ShieldCheckIcon,
  EnvelopeIcon,
  KeyIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

// Mock user data (in a real app, this would come from an API)
const mockUser = {
  id: 1,
  firstName: 'Jamie',
  lastName: 'Smith',
  email: 'jamie.smith@example.com',
  phone: '+44 7123 456789',
  createdAt: '2023-11-15T10:30:00Z',
  university: 'University of Manchester',
  course: 'Computer Science',
  graduationYear: '2026',
  profileComplete: 85,
};

// Navigation items
const navigation = [
  { name: 'Profile', href: '/account', icon: UserIcon, current: true },
  { name: 'My Properties', href: '/account/properties', icon: HomeIcon, current: false },
  { name: 'Shortlist', href: '/shortlist', icon: HeartIcon, current: false },
  { name: 'Notifications', href: '/account/notifications', icon: BellIcon, current: false },
  { name: 'Security', href: '/account/security', icon: ShieldCheckIcon, current: false },
];

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    course: '',
    graduationYear: '',
  });
  
  // Simulate loading user data
  useEffect(() => {
    // In a real app, this would be an API call with authentication
    const fetchUserData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (!isLoggedIn) {
          // Redirect to login if not logged in
          router.push('/auth?redirect=/account');
          return;
        }
        
        setUser(mockUser);
        setFormData({
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          phone: mockUser.phone,
          university: mockUser.university,
          course: mockUser.course,
          graduationYear: mockUser.graduationYear,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // In a real app, this would be an API call to update the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local user state to reflect changes
      setUser(prev => ({
        ...prev,
        ...formData
      }));
      
      // Show success message (in a real app)
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleLogout = () => {
    // In a real app, this would call an API to logout
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };
  
  // Function to simulate login for demo purposes
  const simulateLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.reload();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
        <p className="mb-6 text-neutral">Please log in to access your account.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth?redirect=/account" className="button-primary">
            Log In
          </Link>
          {/* Demo-only button to simulate login without backend */}
          <button onClick={simulateLogin} className="button-outline">
            Simulate Login (Demo Only)
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>My Account | StuHouses</title>
        <meta name="description" content="Manage your account settings, saved properties, and personal information." />
      </Head>

      <div className="bg-neutral-light py-6 md:py-12">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-2 px-4">My Account</h1>
          <p className="text-neutral mb-6 px-4">Manage your profile, properties, and account settings</p>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">{user.firstName} {user.lastName}</h2>
                    <p className="text-neutral text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-neutral-light rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{width: `${user.profileComplete}%`}}
                    ></div>
                  </div>
                  <p className="text-sm text-neutral mt-2">Profile {user.profileComplete}% complete</p>
                </div>
              </div>
              
              <nav className="p-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      item.current
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-neutral-dark hover:bg-neutral-light'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 rounded-lg text-neutral-dark hover:bg-neutral-light transition-colors mt-4"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <p className="text-neutral">Update your personal information and preferences</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-neutral-dark font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-neutral-dark font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-neutral-dark font-medium mb-1">
                      Email Address
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <EnvelopeIcon className="h-5 w-5" />
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input rounded-l-none w-full"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-neutral-dark font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="font-bold mb-4">Student Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="university" className="block text-neutral-dark font-medium mb-1">
                        University
                      </label>
                      <input
                        type="text"
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="course" className="block text-neutral-dark font-medium mb-1">
                        Course / Degree
                      </label>
                      <input
                        type="text"
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="input w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="graduationYear" className="block text-neutral-dark font-medium mb-1">
                      Expected Graduation Year
                    </label>
                    <select
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="select w-full md:w-1/3"
                    >
                      <option value="">Select Year</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Account Security</h3>
                    <Link href="/account/security" className="text-primary hover:text-primary-700 text-sm">
                      Manage
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <KeyIcon className="h-5 w-5 text-neutral mr-3" />
                      <span>Password</span>
                    </div>
                    <Link href="/account/security" className="text-sm text-primary hover:text-primary-700">
                      Change
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-neutral mr-3" />
                      <span>Two-factor authentication</span>
                    </div>
                    <span className="text-sm text-red-500">Not enabled</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Communication Preferences</h3>
                    <Link href="/account/notifications" className="text-primary hover:text-primary-700 text-sm">
                      Manage
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <BellIcon className="h-5 w-5 text-neutral mr-3" />
                      <span>Property Alerts</span>
                    </div>
                    <span className="text-sm text-green-500">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-neutral mr-3" />
                      <span>Marketing communications</span>
                    </div>
                    <span className="text-sm text-red-500">Disabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { handleImageError } from '@/utils/imageUtils';

// Dummy data for development
const dummyProperties = [
  {
    id: 1,
    title: 'Modern 3-Bedroom Apartment',
    price: 1500,
    bedrooms: 3,
    bathrooms: 2,
    type: 'Apartment',
    city: 'London',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
    created_at: '2025-03-10T10:00:00'
  },
  {
    id: 2,
    title: 'Cozy Studio Near University',
    price: 800,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Studio',
    city: 'Manchester',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=500',
    created_at: '2025-03-15T14:30:00'
  },
  {
    id: 3,
    title: 'Spacious 5-Bedroom House',
    price: 2200,
    bedrooms: 5,
    bathrooms: 3,
    type: 'House',
    city: 'Birmingham',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500',
    created_at: '2025-03-20T09:15:00'
  },
  {
    id: 4,
    title: 'Modern Townhouse with Garden',
    price: 1800,
    bedrooms: 4,
    bathrooms: 2,
    type: 'Townhouse',
    city: 'Leeds',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500',
    created_at: '2025-03-25T16:45:00'
  },
  {
    id: 5,
    title: 'City Center Loft',
    price: 1200,
    bedrooms: 2,
    bathrooms: 1,
    type: 'Apartment',
    city: 'Edinburgh',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=500',
    created_at: '2025-03-30T11:20:00'
  }
];

export default function AdminProperties() {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // Fetch properties data
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // In production, you would fetch this data from your API
        // const response = await fetch('/api/admin/properties');
        // const data = await response.json();
        // setProperties(data.properties);
        
        // Using dummy data for now
        // This delay simulates a network request
        setTimeout(() => {
          setProperties(dummyProperties);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle property deletion
  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    
    try {
      // In production, you would call your API
      // await fetch(`/api/admin/properties/${propertyToDelete.id}`, {
      //   method: 'DELETE'
      // });
      
      // Update the local state
      setProperties(properties.filter(p => p.id !== propertyToDelete.id));
      // Close the modal
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Failed to delete property:', error);
      // Show error message
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field with default descending direction
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort properties
  const filteredAndSortedProperties = properties
    .filter(property => {
      // Apply status filter
      if (statusFilter !== 'all' && property.status !== statusFilter) {
        return false;
      }
      
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          property.title.toLowerCase().includes(search) ||
          property.city.toLowerCase().includes(search) ||
          property.type.toLowerCase().includes(search)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === 'price') {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortField === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else if (sortField === 'city') {
        return sortDirection === 'asc' 
          ? a.city.localeCompare(b.city) 
          : b.city.localeCompare(a.city);
      } else if (sortField === 'created_at') {
        return sortDirection === 'asc' 
          ? new Date(a.created_at) - new Date(b.created_at) 
          : new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="h-4 w-4 ml-1" /> 
      : <ArrowDownIcon className="h-4 w-4 ml-1" />;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-grey-900">Properties</h1>
            <p className="mt-2 text-sm text-grey-700">
              Manage all properties listed on the platform.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/properties/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Property
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mt-6 sm:flex sm:items-center">
          {/* Status Filter */}
          <div className="relative sm:w-48 sm:mr-4">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 text-grey-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full py-2 pl-3 pr-10 text-base border-grey-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draught">Draught</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 sm:mt-0 relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-grey-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties..."
              className="block w-full pl-10 pr-3 py-2 border border-grey-300 rounded-md leading-5 bg-white placeholder-grey-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        {/* Properties Table */}
        <div className="mt-6 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-grey-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-grey-200">
                  <thead className="bg-grey-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider"
                        onClick={() => handleSort('title')}
                      >
                        <div className="flex items-center cursor-pointer hover:text-grey-700">
                          Property
                          {renderSortIndicator('title')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center cursor-pointer hover:text-grey-700">
                          Price
                          {renderSortIndicator('price')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider"
                        onClick={() => handleSort('city')}
                      >
                        <div className="flex items-center cursor-pointer hover:text-grey-700">
                          City
                          {renderSortIndicator('city')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center cursor-pointer hover:text-grey-700">
                          Date Added
                          {renderSortIndicator('created_at')}
                        </div>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-grey-200">
                    {isLoading ? (
                      // Loading skeletons
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="animate-pulse h-10 w-10 bg-grey-200 rounded-md mr-4"></div>
                              <div className="animate-pulse h-4 w-40 bg-grey-200 rounded"></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="animate-pulse h-4 w-16 bg-grey-200 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="animate-pulse h-4 w-20 bg-grey-200 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="animate-pulse h-4 w-16 bg-grey-200 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="animate-pulse h-4 w-24 bg-grey-200 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="animate-pulse h-4 w-16 bg-grey-200 rounded ml-auto"></div>
                          </td>
                        </tr>
                      ))
                    ) : filteredAndSortedProperties.length > 0 ? (
                      filteredAndSortedProperties.map((property) => (
                        <tr key={property.id} className="hover:bg-grey-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  src={property.image || '/images/placeholders/property.jpg'}
                                  alt={property.title}
                                  className="h-10 w-10 rounded-md object-cover"
                                  onError={(e) => handleImageError(e, 'property')}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-grey-900 line-clamp-1">
                                  {property.title}
                                </div>
                                <div className="text-sm text-grey-500">
                                  {property.bedrooms} BD · {property.bathrooms} BA · {property.type}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-grey-900">£{property.price}</div>
                            <div className="text-sm text-grey-500">per month</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-grey-900">{property.city}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              property.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : property.status === 'draught' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-grey-100 text-grey-800'
                            }`}>
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">
                            {new Date(property.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <Link
                                href={`/admin/properties/${property.id}/edit`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="sr-only">Edit</span>
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(property)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="sr-only">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-sm text-grey-500">
                          No properties found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-grey-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-grey-900">Delete Property</h3>
                    <div className="mt-2">
                      <p className="text-sm text-grey-500">
                        Are you sure you want to delete this property? This action cannot be undone.
                      </p>
                      {propertyToDelete && (
                        <p className="mt-2 text-sm font-medium text-grey-900">
                          "{propertyToDelete.title}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-grey-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-grey-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-grey-700 hover:bg-grey-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setPropertyToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Custom getLayout function to wrap the page in the AdminLayout
AdminProperties.getLayout = function getLayout(page) {
  return page; // AdminLayout is already included in the page
}; 
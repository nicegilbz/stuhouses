import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../../components/admin/AdminLayout';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button';

// Dummy data for development
const cities = [
  { 
    id: 1, 
    name: 'London', 
    slug: 'london',
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    description: 'London is the capital and largest city of England and the United Kingdom.',
    property_count: 87,
    created_at: '2025-04-01T10:00:00',
    updated_at: '2025-04-04T15:30:00'
  },
  { 
    id: 2, 
    name: 'Manchester', 
    slug: 'manchester',
    image_url: 'https://images.unsplash.com/photo-1565006106640-65d00958db94',
    description: 'Manchester is a major city in the northwest of England with a rich industrial heritage.',
    property_count: 76,
    created_at: '2025-04-01T10:05:00',
    updated_at: '2025-04-03T11:45:00'
  },
  { 
    id: 3, 
    name: 'Birmingham', 
    slug: 'birmingham',
    image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b3e3f82',
    description: 'Birmingham is a major city in England\'s West Midlands region.',
    property_count: 72,
    created_at: '2025-04-01T10:10:00',
    updated_at: '2025-04-02T09:20:00'
  },
  { 
    id: 4, 
    name: 'Leeds', 
    slug: 'leeds',
    image_url: 'https://images.unsplash.com/photo-1594969805813-69c26e5d5eae',
    description: 'Leeds is a city in West Yorkshire, England.',
    property_count: 65,
    created_at: '2025-04-01T10:15:00',
    updated_at: '2025-04-05T16:10:00'
  },
  { 
    id: 5, 
    name: 'Liverpool', 
    slug: 'liverpool',
    image_url: 'https://images.unsplash.com/photo-1580820664149-aca10cb87567',
    description: 'Liverpool is a maritime city in northwest England.',
    property_count: 58,
    created_at: '2025-04-01T10:20:00',
    updated_at: '2025-04-03T14:25:00'
  },
  { 
    id: 6, 
    name: 'Nottingham', 
    slug: 'nottingham',
    image_url: 'https://images.unsplash.com/photo-1578229949691-ba5624ade139',
    description: 'Nottingham is a city in central England\'s Midlands region.',
    property_count: 43,
    created_at: '2025-04-01T10:25:00',
    updated_at: '2025-04-04T12:50:00'
  },
  { 
    id: 7, 
    name: 'Bristol', 
    slug: 'bristol',
    image_url: 'https://images.unsplash.com/photo-1574282263429-f7f2af5a1fd1',
    description: 'Bristol is a city straddling the River Avon in southwest England.',
    property_count: 49,
    created_at: '2025-04-01T10:30:00',
    updated_at: '2025-04-02T10:15:00'
  },
  { 
    id: 8, 
    name: 'Sheffield', 
    slug: 'sheffield',
    image_url: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd',
    description: 'Sheffield is a city in South Yorkshire, England.',
    property_count: 54,
    created_at: '2025-04-01T10:35:00',
    updated_at: '2025-04-05T09:30:00'
  },
];

export default function AdminCities() {
  const { t } = useTranslation();
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage);
        queryParams.append('limit', itemsPerPage);
        
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }
        
        // Fetch cities from API
        const response = await fetch(`/api/admin/cities?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setAllCities(data.data.cities);
          setFilteredCities(data.data.cities);
          setTotalCities(data.data.pagination.total);
        } else {
          console.error('Failed to fetch cities:', data.message);
          toast.error('Failed to load cities');
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        toast.error('Failed to connect to the server');
        
        // Fall back to dummy data if API fails
        setAllCities(cities);
        setFilteredCities(cities);
        setTotalCities(cities.length);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [currentPage, itemsPerPage, searchQuery]);

  // Filter and sort cities when dependencies change
  useEffect(() => {
    let result = [...allCities];
    
    // Filter based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        city => 
          city.name.toLowerCase().includes(query) || 
          city.description.toLowerCase().includes(query)
      );
    }
    
    // Sort the data
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle special case for sorting strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Handle numeric sorting
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    setFilteredCities(result);
  }, [allCities, searchQuery, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);  // Reset to first page on new search
  };

  const confirmDelete = (city) => {
    setCityToDelete(city);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Call API to delete city
      const response = await fetch(`/api/admin/cities/${cityToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete city: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Remove city from state
        setAllCities(allCities.filter(city => city.id !== cityToDelete.id));
        setFilteredCities(filteredCities.filter(city => city.id !== cityToDelete.id));
        setTotalCities(prevTotal => prevTotal - 1);
        toast.success('City deleted successfully');
        setShowDeleteModal(false);
        setCityToDelete(null);
      } else {
        console.error('Failed to delete city:', data.message);
        toast.error(data.message || 'Failed to delete city');
      }
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.error('Failed to delete city');
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredCities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCities.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-dark">Cities</h1>
          <Link 
            href="/admin/cities/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add City
          </Link>
        </div>
        
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-grey-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-grey-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <select
              className="mt-1 block pl-3 pr-10 py-2 text-base border border-grey-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
        
        {/* Cities Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-grey-200">
              <thead className="bg-grey-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider"
                  >
                    <button
                      className="flex items-center"
                      onClick={() => handleSort('name')}
                    >
                      City
                      <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider"
                  >
                    <button
                      className="flex items-center"
                      onClick={() => handleSort('property_count')}
                    >
                      Properties
                      <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider"
                  >
                    <button
                      className="flex items-center"
                      onClick={() => handleSort('updated_at')}
                    >
                      Last Updated
                      <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-grey-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-grey-200">
                {isLoading ? (
                  // Loading skeleton
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="animate-pulse h-4 bg-grey-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="animate-pulse h-10 w-10 bg-grey-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="animate-pulse h-4 bg-grey-200 rounded w-10"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="animate-pulse h-4 bg-grey-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <div className="animate-pulse h-8 w-8 bg-grey-200 rounded"></div>
                          <div className="animate-pulse h-8 w-8 bg-grey-200 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : currentItems.length > 0 ? (
                  currentItems.map((city) => (
                    <tr key={city.id} className="hover:bg-grey-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-grey-900">{city.name}</div>
                            <div className="text-sm text-grey-500">{city.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-16 relative">
                          <Image
                            src={city.image_url}
                            alt={city.name}
                            fill
                            className="object-cover rounded"
                            sizes="40px"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {city.property_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">
                        {new Date(city.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/cities/${city.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-md hover:bg-indigo-50"
                          >
                            <PencilIcon className="h-5 w-5" />
                            <span className="sr-only">Edit {city.name}</span>
                          </Link>
                          <button
                            onClick={() => confirmDelete(city)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50"
                          >
                            <TrashIcon className="h-5 w-5" />
                            <span className="sr-only">Delete {city.name}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-grey-500">
                      {searchQuery ? 'No cities match your search.' : 'No cities found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-grey-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-grey-100 text-grey-400 cursor-default'
                    : 'bg-white text-grey-700 hover:bg-grey-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-grey-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-grey-100 text-grey-400 cursor-default'
                    : 'bg-white text-grey-700 hover:bg-grey-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-grey-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredCities.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredCities.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-grey-300 text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-grey-100 text-grey-400 cursor-default'
                        : 'bg-white text-grey-500 hover:bg-grey-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    
                    // Show limited pages for better UI if many pages
                    if (
                      totalPages <= 7 ||
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          aria-current={isCurrentPage ? 'page' : undefined}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            isCurrentPage
                              ? 'z-10 bg-primary border-primary text-white'
                              : 'bg-white border-grey-300 text-grey-500 hover:bg-grey-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-grey-300 bg-white text-grey-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-grey-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-grey-100 text-grey-400 cursor-default'
                        : 'bg-white text-grey-500 hover:bg-grey-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-grey-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-grey-900" id="modal-title">
                      Delete City
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-grey-500">
                        Are you sure you want to delete {cityToDelete?.name}? This action cannot be undone.
                      </p>
                      {cityToDelete?.property_count > 0 && (
                        <p className="mt-2 text-sm text-red-500">
                          Warning: This city has {cityToDelete.property_count} associated properties.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-grey-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  className="w-full sm:w-auto sm:ml-3"
                  isLoading={isLoading}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="secondary"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Custom getLayout function to wrap the page in the AdminLayout
AdminCities.getLayout = function getLayout(page) {
  return page; // AdminLayout is already included in the page
}; 
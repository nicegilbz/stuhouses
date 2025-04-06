import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Button from '../../../components/common/Button';
import toast from 'react-hot-toast';

export default function BlogList() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [pageSize] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage);
        queryParams.append('limit', pageSize);
        
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }
        
        if (filterCategory) {
          queryParams.append('category', filterCategory);
        }
        
        // Fetch posts from API
        const response = await fetch(`/api/admin/blog?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setBlogPosts(data.data.posts || []);
          setTotalPosts(data.data.pagination?.total || 0);
          
          // Extract unique categories
          const allCategories = [...new Set((data.data.posts || []).map(post => post.category))].filter(Boolean);
          setCategories(allCategories);
        } else {
          console.error('Failed to fetch blog posts:', data.message);
          toast.error('Failed to load blog posts');
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        toast.error('Failed to connect to the server');
        
        // Fall back to empty state if API fails
        setBlogPosts([]);
        setTotalPosts(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [currentPage, pageSize, searchQuery, filterCategory]);

  // Handle delete
  const handleDeletePost = async (postId) => {
    if (!postId) return;
    
    try {
      setDeleteLoading(true);
      
      // Call API to delete post
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Remove post from state
        setBlogPosts(blogPosts.filter(post => post.id !== postId));
        setTotalPosts(prevTotal => prevTotal - 1);
        toast.success('Blog post deleted successfully');
        setDeleteConfirmOpen(false);
        setPostToDelete(null);
      } else {
        console.error('Failed to delete post:', data.message);
        toast.error(data.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalPosts / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-dark">Blog Posts</h1>
          <Link href="/admin/blog/create">
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
        
        {/* Filters and search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="secondary"
                    className="ml-3"
                  >
                    Search
                  </Button>
                </form>
              </div>
              
              <div className="md:w-64">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('');
                  setCurrentPage(1);
                }}
                className="md:w-auto"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
        
        {/* Blog posts list */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {isLoading ? (
            <div className="py-10 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-2 text-neutral">Loading blog posts...</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {post.imageUrl && (
                            <div className="flex-shrink-0 h-10 w-10 mr-4">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={post.imageUrl}
                                alt={post.title}
                              />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {post.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {post.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.author || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.publishedDate 
                          ? formatDistanceToNow(new Date(post.publishedDate), { addSuffix: true })
                          : 'Draft'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.isExternal ? (
                          <span className="text-yellow-600">External</span>
                        ) : (
                          <span className="text-green-600">Original</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {!post.isExternal && (
                            <Link href={`/admin/blog/edit/${post.id}`}>
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit post"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              setPostToDelete(post);
                              setDeleteConfirmOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete post"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-neutral-dark">No blog posts found</p>
              {(searchQuery || filterCategory) && (
                <p className="mt-2 text-neutral-light">Try adjusting your filters</p>
              )}
              {!searchQuery && !filterCategory && (
                <div className="mt-4">
                  <Link href="/admin/blog/create">
                    <Button variant="primary" size="sm">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Create First Post
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {blogPosts.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage >= Math.ceil(totalPosts / pageSize)}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalPosts)}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * pageSize, totalPosts)}</span> of{' '}
                    <span className="font-medium">{totalPosts}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(Math.ceil(totalPosts / pageSize), 5) }).map((_, i) => {
                      const page = i + 1;
                      const isCurrentPage = page === currentPage;
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            isCurrentPage
                              ? 'z-10 bg-primary border-primary text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= Math.ceil(totalPosts / pageSize)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {deleteConfirmOpen && postToDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Blog Post</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{postToDelete.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={() => handleDeletePost(postToDelete.id)}
                  variant="danger"
                  className="w-full sm:ml-3 sm:w-auto"
                  isLoading={deleteLoading}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setPostToDelete(null);
                  }}
                  variant="outline"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  disabled={deleteLoading}
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
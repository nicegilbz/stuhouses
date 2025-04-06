import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button';

// Validation schema for city form
const CitySchema = Yup.object().shape({
  name: Yup.string()
    .required('City name is required')
    .min(2, 'City name must be at least 2 characters')
    .max(50, 'City name cannot exceed 50 characters'),
  slug: Yup.string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug cannot exceed 50 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  image_url: Yup.string()
    .required('Image URL is required')
    .url('Must be a valid URL'),
});

export default function CreateCity() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: '',
    slug: '',
    description: '',
    image_url: '',
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // In production, you would send this data to your API
      // const response = await fetch('/api/admin/cities', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(values),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to create city');
      // }
      
      // For demo, simulate a successful response
      console.log('Creating city:', values);
      
      // Show success message
      toast.success(`City "${values.name}" created successfully`);
      
      // Redirect to cities list
      setTimeout(() => {
        router.push('/admin/cities');
      }, 1000);
    } catch (error) {
      console.error('Error creating city:', error);
      toast.error('Failed to create city. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to generate slug from name
  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-8 flex items-center">
          <Link
            href="/admin/cities"
            className="inline-flex items-center text-sm text-primary hover:text-primary-600 transition-colors mr-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Cities
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-dark">Add New City</h1>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={CitySchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-dark">
                      City Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className={`mt-1 block w-full border ${
                        errors.name && touched.name
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-grey-300 focus:ring-primary focus:border-primary'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                      placeholder="Enter city name"
                      onChange={(e) => {
                        const name = e.target.value;
                        setFieldValue('name', name);
                        
                        // Only auto-generate slug if it hasn't been manually edited
                        if (!touched.slug || values.slug === generateSlug(values.name)) {
                          setFieldValue('slug', generateSlug(name));
                        }
                      }}
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="mt-2 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-neutral-dark">
                      Slug
                    </label>
                    <Field
                      type="text"
                      name="slug"
                      id="slug"
                      className={`mt-1 block w-full border ${
                        errors.slug && touched.slug
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-grey-300 focus:ring-primary focus:border-primary'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                      placeholder="Enter URL slug"
                    />
                    <p className="mt-1 text-sm text-grey-500">
                      This will be used in the URL: https://example.com/properties/<span className="font-medium">{values.slug || 'your-slug'}</span>
                    </p>
                    <ErrorMessage
                      name="slug"
                      component="p"
                      className="mt-2 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-dark">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      className={`mt-1 block w-full border ${
                        errors.description && touched.description
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-grey-300 focus:ring-primary focus:border-primary'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                      placeholder="Enter city description"
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="mt-2 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-neutral-dark">
                      Image URL
                    </label>
                    <Field
                      type="text"
                      name="image_url"
                      id="image_url"
                      className={`mt-1 block w-full border ${
                        errors.image_url && touched.image_url
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-grey-300 focus:ring-primary focus:border-primary'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                      placeholder="Enter image URL"
                    />
                    <ErrorMessage
                      name="image_url"
                      component="p"
                      className="mt-2 text-sm text-red-600"
                    />
                    {values.image_url && !errors.image_url && (
                      <div className="mt-2">
                        <p className="text-sm text-grey-500 mb-2">Image Preview:</p>
                        <img
                          src={values.image_url}
                          alt="City preview"
                          className="h-32 w-full object-cover rounded-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x150?text=Image+Error';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Link
                      href="/admin/cities"
                      className="inline-flex justify-center py-2 px-4 border border-grey-300 shadow-sm text-sm font-medium rounded-md text-grey-700 bg-white hover:bg-grey-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Cancel
                    </Link>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Create City
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Custom getLayout function to wrap the page in the AdminLayout
CreateCity.getLayout = function getLayout(page) {
  return page; // AdminLayout is already included in the page
}; 
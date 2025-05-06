import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, X, Search } from 'lucide-react';
import ResourceCard from '../components/resources/ResourceCard';
import FormInput from '../components/common/FormInput';
import { validationRules } from '../utils/validation';
import useFormValidation from '../hooks/useFormValidation';

type ResourceType = 'ARTICLE' | 'VIDEO' | 'BOOK' | 'TOOL';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  resourceType: ResourceType;
  skillCategory: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
  likes: number;
  isLiked: boolean;
}

interface ResourceFormData {
  title: string;
  description: string;
  url: string;
  resourceType: string;
  skillCategory: string;
}

const ResourceLibraryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Define validation schema
  const validationSchema = {
    title: [
      validationRules.required('Title is required'),
      validationRules.minLength(3, 'Title must be at least 3 characters long'),
      validationRules.maxLength(100, 'Title must be less than 100 characters')
    ],
    description: [
      validationRules.required('Description is required'),
      validationRules.minLength(10, 'Description must be at least 10 characters long'),
      validationRules.maxLength(500, 'Description must be less than 500 characters')
    ],
    url: [
      validationRules.required('URL is required'),
      validationRules.url('Please enter a valid URL')
    ],
    resourceType: [
      validationRules.required('Resource type is required')
    ],
    skillCategory: [
      validationRules.required('Skill category is required')
    ]
  };

  // Use our custom form validation hook
  const {
    values: formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    handleSubmit,
    isValid,
    validateForm
  } = useFormValidation<ResourceFormData>(
    {
      title: '',
      description: '',
      url: '',
      resourceType: 'ARTICLE',
      skillCategory: '',
    },
    validationSchema
  );

  // Set form data when editing
  useEffect(() => {
    if (editingId) {
      const resourceToEdit = resources.find(r => r.id === editingId);
      if (resourceToEdit) {
        setFieldValue('title', resourceToEdit.title);
        setFieldValue('description', resourceToEdit.description);
        setFieldValue('url', resourceToEdit.url);
        setFieldValue('resourceType', resourceToEdit.resourceType);
        setFieldValue('skillCategory', resourceToEdit.skillCategory);
      }
    }
  }, [editingId, resources, setFieldValue]);

  useEffect(() => {
    fetchResources();
  }, [searchQuery, selectedType, selectedCategory]);

  const fetchResources = async () => {
    try {
      setError(null);
      let url = '/api/resources';
      
      if (searchQuery) {
        url = `/api/resources/search?keyword=${encodeURIComponent(searchQuery)}`;
      } else if (selectedType) {
        url = `/api/resources/type/${selectedType}`;
      } else if (selectedCategory) {
        url = `/api/resources/category/${selectedCategory}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      // Check if the response has a content property (spring pagination)
      const resources = Array.isArray(data) ? data : (data.content || []);
      setResources(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError(typeof error === 'string' ? error : (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ResourceFormData) => {
    if (!currentUser) {
      setError('You must be logged in to submit resources');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `/api/resources/${editingId}`
        : '/api/resources';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          ...values,
          user: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to save resource');
      }

      // Reset form and refresh resources
      setShowForm(false);
      resetForm();
      setEditingId(null);
      await fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      setError(typeof error === 'string' ? error : (error as Error).message || 'Failed to save resource. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!currentUser) return;
    
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        setError(null);
        const response = await fetch(`/api/resources/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete resource');
        }

        await fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        setError(typeof error === 'string' ? error : (error as Error).message);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resource Library</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Resource
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="VIDEO">Videos</option>
          <option value="ARTICLE">Articles</option>
          <option value="BOOK">Books</option>
          <option value="TOOL">Tools</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="DevOps">DevOps</option>
          <option value="Mobile">Mobile</option>
          <option value="UI/UX">UI/UX</option>
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                id="title"
                label="Title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter resource title"
                required
                errorMessage={touched.title ? errors.title : undefined}
                validationRules={validationSchema.title}
              />

              <FormInput
                id="description"
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe the resource"
                required
                rows={3}
                errorMessage={touched.description ? errors.description : undefined}
                validationRules={validationSchema.description}
              />

              <FormInput
                id="url"
                label="URL"
                type="url"
                value={formData.url}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://example.com"
                required
                errorMessage={touched.url ? errors.url : undefined}
                validationRules={validationSchema.url}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="resourceType"
                    name="resourceType"
                    required
                    value={formData.resourceType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${
                      errors.resourceType && touched.resourceType 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  >
                    <option value="VIDEO">Video</option>
                    <option value="ARTICLE">Article</option>
                    <option value="BOOK">Book</option>
                    <option value="TOOL">Tool</option>
                  </select>
                  {errors.resourceType && touched.resourceType && (
                    <div className="mt-1 flex items-center text-sm text-red-600">
                      <span>{errors.resourceType}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="skillCategory"
                    name="skillCategory"
                    required
                    value={formData.skillCategory}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${
                      errors.skillCategory && touched.skillCategory 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  >
                    <option value="">Select a category</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                  {errors.skillCategory && touched.skillCategory && (
                    <div className="mt-1 flex items-center text-sm text-red-600">
                      <span>{errors.skillCategory}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={submitting || !isValid}
                >
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Add'} Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No resources found</p>
          {(searchQuery || selectedType || selectedCategory) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('');
                setSelectedCategory('');
              }}
              className="mt-2 text-blue-500 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={currentUser?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceLibraryPage;
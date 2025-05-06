import { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import ResourceCard from '../components/resources/ResourceCard';
import { useAuth } from '../contexts/AuthContext';

type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  resourceType: 'VIDEO' | 'ARTICLE' | 'BOOK' | 'TOOL';
  skillCategory: string;
  likes: number;
  createdAt: string;
  isOwner: boolean;
  userId: string;
  userName: string;
  userEmail: string;
};

type ResourceFormData = {
  title: string;
  description: string;
  url: string;
  resourceType: 'VIDEO' | 'ARTICLE' | 'BOOK' | 'TOOL';
  skillCategory: string;
};

const ResourceLibraryPage = () => {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    url: '',
    resourceType: 'ARTICLE',
    skillCategory: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Advanced System Design Patterns in Distributed Systems',
        description: 'A comprehensive guide to implementing scalable distributed systems. Covers consensus algorithms, distributed transactions, and fault tolerance strategies.',
        url: 'https://example.com/system-design-patterns',
        resourceType: 'ARTICLE',
        skillCategory: 'System Design',
        likes: 856,
        createdAt: '2025-04-01T10:00:00Z',
        isOwner: false,
        userId: '1',
        userName: 'Dr. Sarah Chen',
        userEmail: 'sarah.chen@techcorp.com'
      },
      {
        id: '2',
        title: 'Machine Learning Engineering Best Practices',
        description: 'Essential practices for deploying ML models in production. Learn about model monitoring, A/B testing, and performance optimization techniques.',
        url: 'https://example.com/ml-engineering',
        resourceType: 'VIDEO',
        skillCategory: 'Machine Learning',
        likes: 723,
        createdAt: '2025-04-02T15:30:00Z',
        isOwner: true,
        userId: '2',
        userName: 'Prof. Alex Kumar',
        userEmail: 'alex.kumar@ailab.com'
      },
      {
        id: '3',
        title: 'Cloud-Native Application Security Guide',
        description: 'Deep dive into securing cloud-native applications. Topics include container security, service mesh authentication, and zero-trust architecture.',
        url: 'https://example.com/cloud-security',
        resourceType: 'BOOK',
        skillCategory: 'Security',
        likes: 645,
        createdAt: '2025-04-03T09:15:00Z',
        isOwner: false,
        userId: '3',
        userName: 'Emma Thompson',
        userEmail: 'emma.t@securityfirm.com'
      },
      {
        id: '4',
        title: 'Modern Frontend Performance Optimization',
        description: 'Advanced techniques for optimizing web application performance. Covers bundle optimization, lazy loading, and modern rendering patterns.',
        url: 'https://example.com/frontend-perf',
        resourceType: 'TOOL',
        skillCategory: 'Frontend',
        likes: 589,
        createdAt: '2025-04-04T14:20:00Z',
        isOwner: false,
        userId: '4',
        userName: 'David Park',
        userEmail: 'david.park@webperf.com'
      }
    ];
    
    setResources(mockResources);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          ...formData,
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
      setFormData({
        title: '',
        description: '',
        url: '',
        resourceType: 'ARTICLE',
        skillCategory: '',
      });
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
    setFormData({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      resourceType: resource.resourceType,
      skillCategory: resource.skillCategory,
    });
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
        setError('Failed to delete resource. Please try again.');
      }
    }
  };

  const handleLike = async (resourceId: string) => {
    if (!currentUser) {
      setError('You must be logged in to like resources');
      return;
    }

    try {
      const response = await fetch(`/api/resources/${resourceId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to like resource');
      }

      await fetchResources();
    } catch (error) {
      console.error('Error liking resource:', error);
      setError('Failed to like resource. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
                  setFormData({
                    title: '',
                    description: '',
                    url: '',
                    resourceType: 'ARTICLE',
                    skillCategory: '',
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    required
                    value={formData.resourceType}
                    onChange={(e) => setFormData({ ...formData, resourceType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="VIDEO">Video</option>
                    <option value="ARTICLE">Article</option>
                    <option value="BOOK">Book</option>
                    <option value="TOOL">Tool</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={formData.skillCategory}
                    onChange={(e) => setFormData({ ...formData, skillCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Add'} Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onEdit={() => handleEdit(resource)}
            onDelete={() => handleDelete(resource.id)}
            onLike={() => handleLike(resource.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourceLibraryPage;
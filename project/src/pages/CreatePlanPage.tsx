import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement plan creation logic
    navigate('/learning-plans');
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Learning Plan</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Learning Plan Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Cloud Architecture Mastery',
              description: 'Comprehensive path to master cloud architecture with AWS, Azure, and GCP. Includes certification preparation and hands-on projects.',
              milestones: [
                'Cloud Fundamentals & Core Services',
                'Infrastructure as Code (Terraform)',
                'Container Orchestration (Kubernetes)',
                'Service Mesh Implementation',
                'Cloud Security & Compliance',
                'Cost Optimization Strategies'
              ],
              duration: '6 months'
            },
            {
              title: 'Full-Stack Development Path',
              description: 'Modern full-stack development covering React, Node.js, and cloud deployment. Focus on scalable architecture and best practices.',
              milestones: [
                'Advanced React Patterns',
                'Backend API Design',
                'Database Optimization',
                'CI/CD Implementation',
                'Performance Optimization',
                'Security Best Practices'
              ],
              duration: '4 months'
            },
            {
              title: 'Machine Learning Engineering',
              description: 'Production ML engineering path covering model deployment, MLOps, and scalable AI systems.',
              milestones: [
                'ML System Design',
                'Model Deployment Patterns',
                'Feature Engineering at Scale',
                'Model Monitoring & Maintenance',
                'A/B Testing Framework',
                'ML Infrastructure Management'
              ],
              duration: '5 months'
            }
          ].map((template, index) => (
            <button
              key={index}
              onClick={() => {
                setFormData({
                  ...formData,
                  title: template.title,
                  description: template.description,
                  milestones: template.milestones.map(title => ({
                    id: crypto.randomUUID(),
                    title,
                    isCompleted: false
                  }))
                });
              }}
              className="p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:shadow-sm transition-all text-left"
            >
              <h3 className="font-medium text-gray-900 mb-2">{template.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{template.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Plan Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Plan Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Advanced Cloud Architecture Mastery"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your learning objectives and what you plan to achieve..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Milestones
              </label>
              <div className="space-y-2">
                {formData.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => handleMilestoneChange(index, e.target.value)}
                      placeholder="Enter milestone"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(index)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="mt-2 flex items-center text-sm text-teal-600 hover:text-teal-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Milestone
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="e.g. Cloud, AWS, Architecture, DevOps"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                to="/plans"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Create Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanPage;
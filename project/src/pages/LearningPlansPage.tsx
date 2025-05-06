import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LearningPlanCard from '../components/plans/LearningPlanCard';
import { Plus, TrendingUp, BookOpen, Search } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalMilestones: number;
  completedMilestones: number;
  milestones: Milestone[];
  startDate: Date;
  targetDate: Date;
  tags: string[];
}

const LearningPlansPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('my-plans');
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  
  useEffect(() => {
    // Mock plans data
    const mockPlans: LearningPlan[] = [
      {
        id: '1',
        title: 'Advanced React & TypeScript',
        description: 'Master React with TypeScript including hooks, context API, and performance optimization techniques.',
        progress: 65,
        totalMilestones: 12,
        completedMilestones: 8,
        milestones: [
          { id: '1', title: 'TypeScript basics', isCompleted: true },
          { id: '2', title: 'React hooks with TypeScript', isCompleted: true },
          { id: '3', title: 'Custom hooks development', isCompleted: true },
          { id: '4', title: 'Performance optimization', isCompleted: false },
          { id: '5', title: 'Build a full project', isCompleted: false }
        ],
        startDate: new Date(2024, 1, 10),
        targetDate: new Date(2024, 3, 30),
        tags: ['React', 'TypeScript', 'Frontend']
      },
      {
        id: '2',
        title: 'Machine Learning Fundamentals',
        description: 'Learn the core concepts of machine learning including supervised and unsupervised learning, neural networks, and practical implementations.',
        progress: 30,
        totalMilestones: 10,
        completedMilestones: 3,
        milestones: [
          { id: '1', title: 'Linear regression', isCompleted: true },
          { id: '2', title: 'Classification algorithms', isCompleted: true },
          { id: '3', title: 'Neural networks basics', isCompleted: true },
          { id: '4', title: 'Deep learning', isCompleted: false },
          { id: '5', title: 'Model deployment', isCompleted: false }
        ],
        startDate: new Date(2024, 2, 5),
        targetDate: new Date(2024, 5, 15),
        tags: ['ML', 'AI', 'Python', 'Data Science']
      },
      {
        id: '3',
        title: 'Digital Photography Masterclass',
        description: 'Comprehensive guide to mastering digital photography from camera settings to advanced post-processing techniques.',
        progress: 80,
        totalMilestones: 15,
        completedMilestones: 12,
        milestones: [
          { id: '1', title: 'Camera basics', isCompleted: true },
          { id: '2', title: 'Composition techniques', isCompleted: true },
          { id: '3', title: 'Lighting essentials', isCompleted: true },
          { id: '4', title: 'Advanced editing', isCompleted: false },
          { id: '5', title: 'Portfolio building', isCompleted: false }
        ],
        startDate: new Date(2023, 11, 15),
        targetDate: new Date(2024, 2, 15),
        tags: ['Photography', 'Creative', 'Editing']
      },
      {
        id: '4',
        title: 'Full-Stack Web Development',
        description: 'Complete journey from frontend to backend development including React, Node.js, databases, and deployment.',
        progress: 45,
        totalMilestones: 20,
        completedMilestones: 9,
        milestones: [
          { id: '1', title: 'HTML/CSS fundamentals', isCompleted: true },
          { id: '2', title: 'JavaScript essentials', isCompleted: true },
          { id: '3', title: 'React basics', isCompleted: true },
          { id: '4', title: 'Node.js & Express', isCompleted: false },
          { id: '5', title: 'Database integration', isCompleted: false }
        ],
        startDate: new Date(2024, 0, 5),
        targetDate: new Date(2024, 6, 30),
        tags: ['Web Dev', 'React', 'Node.js', 'Full-Stack']
      }
    ];
    
    setPlans(mockPlans);
  }, []);
  
  const filteredPlans = plans.filter(plan => 
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Plans</h1>
        <Link 
          to="/create-plan"
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
        >
          <Plus className="h-5 w-5 mr-1.5" />
          Create Plan
        </Link>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for learning plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              activeTab === 'my-plans' ? 'text-teal-600 border-b-2 border-teal-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('my-plans')}
          >
            <div className="flex items-center justify-center">
              <BookOpen className="h-4 w-4 mr-1.5" />
              <span>My Plans</span>
            </div>
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              activeTab === 'trending' ? 'text-teal-600 border-b-2 border-teal-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            <div className="flex items-center justify-center">
              <TrendingUp className="h-4 w-4 mr-1.5" />
              <span>Trending Plans</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Plans Grid */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlans.map(plan => (
            <LearningPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">No learning plans found.</p>
        </div>
      )}
    </div>
  );
};

export default LearningPlansPage;
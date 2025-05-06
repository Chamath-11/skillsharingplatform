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
        title: 'Cloud Architecture & DevOps Excellence',
        description: 'Master modern cloud architecture patterns and DevOps practices. Cover AWS services, Kubernetes orchestration, CI/CD pipelines, and infrastructure as code.',
        progress: 65,
        totalMilestones: 15,
        completedMilestones: 10,
        milestones: [
          { id: '1', title: 'AWS basics', isCompleted: true },
          { id: '2', title: 'Kubernetes orchestration', isCompleted: true },
          { id: '3', title: 'CI/CD pipelines', isCompleted: true },
          { id: '4', title: 'Infrastructure as code', isCompleted: false },
          { id: '5', title: 'Advanced cloud patterns', isCompleted: false }
        ],
        startDate: new Date(2024, 3, 1),
        targetDate: new Date(2024, 8, 30),
        tags: ['Cloud', 'AWS', 'Kubernetes', 'DevOps'],
        isOwner: true
      },
      {
        id: '2',
        title: 'Advanced Machine Learning Engineering',
        description: 'Deep dive into MLOps, model deployment, and production ML systems. Learn model monitoring, A/B testing, and ML infrastructure management.',
        progress: 40,
        totalMilestones: 12,
        completedMilestones: 5,
        milestones: [
          { id: '1', title: 'MLOps basics', isCompleted: true },
          { id: '2', title: 'Model deployment', isCompleted: true },
          { id: '3', title: 'Production ML systems', isCompleted: true },
          { id: '4', title: 'Model monitoring', isCompleted: false },
          { id: '5', title: 'A/B testing', isCompleted: false }
        ],
        startDate: new Date(2024, 4, 15),
        targetDate: new Date(2024, 9, 15),
        tags: ['Machine Learning', 'MLOps', 'Python', 'TensorFlow'],
        isOwner: false
      },
      {
        id: '3',
        title: 'System Design & Distributed Systems',
        description: 'Master the principles of designing large-scale distributed systems. Topics include scalability patterns, data consistency, fault tolerance, and system optimization.',
        progress: 85,
        totalMilestones: 10,
        completedMilestones: 8,
        milestones: [
          { id: '1', title: 'Scalability patterns', isCompleted: true },
          { id: '2', title: 'Data consistency', isCompleted: true },
          { id: '3', title: 'Fault tolerance', isCompleted: true },
          { id: '4', title: 'System optimization', isCompleted: false },
          { id: '5', title: 'Advanced system design', isCompleted: false }
        ],
        startDate: new Date(2024, 2, 1),
        targetDate: new Date(2024, 7, 31),
        tags: ['System Design', 'Architecture', 'Scalability'],
        isOwner: true
      },
      {
        id: '4',
        title: 'Full-Stack Performance Engineering',
        description: 'Comprehensive approach to optimizing application performance across the stack. Cover frontend optimization, backend efficiency, and database tuning.',
        progress: 25,
        totalMilestones: 14,
        completedMilestones: 3,
        milestones: [
          { id: '1', title: 'Frontend optimization', isCompleted: true },
          { id: '2', title: 'Backend efficiency', isCompleted: true },
          { id: '3', title: 'Database tuning', isCompleted: true },
          { id: '4', title: 'Performance monitoring', isCompleted: false },
          { id: '5', title: 'Advanced performance techniques', isCompleted: false }
        ],
        startDate: new Date(2024, 5, 1),
        targetDate: new Date(2024, 10, 30),
        tags: ['Performance', 'Frontend', 'Backend', 'Database'],
        isOwner: false
      }
    ];

    // Featured templates for creating new plans
    const planTemplates = [
      {
        id: 'template1',
        title: 'Cloud Architecture Path',
        description: 'AWS Solutions Architect certification path with hands-on projects',
        duration: '6 months',
        difficulty: 'Advanced',
        topics: ['AWS', 'Infrastructure', 'Security']
      },
      {
        id: 'template2',
        title: 'Frontend Engineering Path',
        description: 'Modern frontend development with React, TypeScript, and performance optimization',
        duration: '4 months',
        difficulty: 'Intermediate',
        topics: ['React', 'TypeScript', 'Performance']
      },
      {
        id: 'template3',
        title: 'Data Engineering Path',
        description: 'Build scalable data pipelines and processing systems',
        duration: '5 months',
        difficulty: 'Advanced',
        topics: ['Big Data', 'ETL', 'Analytics']
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LearningPlanCard from '../components/plans/LearningPlanCard';
import { Plus, TrendingUp, BookOpen, Search } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  const [selectedTag, setSelectedTag] = useState('');
  const [plans, setPlans] = useState<LearningPlan[]>([]);

  // Activity data generation
  const generateActivityData = () => {
    const today = new Date();
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const data = Array(30).fill(0);
    plans.forEach((plan: LearningPlan) => {
      plan.milestones.forEach((milestone: Milestone) => {
        if (milestone.isCompleted) {
          const randomDay = Math.floor(Math.random() * 30);
          data[randomDay] += 1;
        }
      });
    });

    return { labels, data };
  };

  const activityData = generateActivityData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Learning Activity',
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold' as const // Type assertion for font weight
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const chartData = {
    labels: activityData.labels,
    datasets: [
      {
        data: activityData.data,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      }
    ]
  };

  // Extract unique tags from all plans
  const getAllTags = (plans: LearningPlan[]) => {
    const tagSet = new Set<string>();
    plans.forEach(plan => {
      plan.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };
  
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
  
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !selectedTag || plan.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const availableTags = getAllTags(plans);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Plans</h1>
          {(searchTerm || selectedTag) && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'}
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedTag && ` tagged with "${selectedTag}"`}
            </p>
          )}
        </div>
        <Link 
          to="/create-plan"
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
        >
          <Plus className="h-5 w-5 mr-1.5" />
          Create Plan
        </Link>
      </div>
      
      {/* Activity Graph */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="h-64">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for learning plans..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                !selectedTag 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Tags
            </button>
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  tag === selectedTag
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
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
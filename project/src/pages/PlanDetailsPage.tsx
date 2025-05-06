import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, CheckCircle2, PlusCircle, Edit, Trash2 } from 'lucide-react';

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

const PlanDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMilestone, setNewMilestone] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        // This would be replaced with actual API call
        // const response = await fetch(`/api/learning-plans/${id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockPlan: LearningPlan = {
          id: id || '1',
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
        };
        
        setPlan(mockPlan);
      } catch (err) {
        setError('Failed to load learning plan');
        console.error('Error fetching plan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const toggleMilestoneCompletion = (milestoneId: string) => {
    if (!plan) return;
    
    const updatedMilestones = plan.milestones.map(milestone =>
      milestone.id === milestoneId
        ? { ...milestone, isCompleted: !milestone.isCompleted }
        : milestone
    );

    const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
    
    setPlan({
      ...plan,
      milestones: updatedMilestones,
      completedMilestones: completedCount,
      progress: Math.round((completedCount / plan.totalMilestones) * 100)
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !newMilestone.trim()) return;

    const newMilestoneItem: Milestone = {
      id: Date.now().toString(),
      title: newMilestone.trim(),
      isCompleted: false
    };

    setPlan({
      ...plan,
      milestones: [...plan.milestones, newMilestoneItem],
      totalMilestones: plan.totalMilestones + 1
    });

    setNewMilestone('');
    setIsAddingMilestone(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Plan not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Learning Plans
      </button>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div></div>
            <h1 className="text-2xl">
              {plan.title}
            </h1>
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full">
              {plan.progress}% Complete
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-6 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Started: {format(plan.startDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Target: {format(plan.targetDate, 'MMM d, yyyy')}</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{plan.completedMilestones}/{plan.totalMilestones} milestones</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-teal-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${plan.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {plan.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
              <button
                onClick={() => setIsAddingMilestone(true)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Milestone
              </button>
            </div>

            {isAddingMilestone && (
              <form onSubmit={handleAddMilestone} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    placeholder="Enter new milestone"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingMilestone(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <ul className="space-y-3">
              {plan.milestones.map(milestone => (
                <li 
                  key={milestone.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleMilestoneCompletion(milestone.id)}
                      className={`p-1 rounded-full transition-colors ${
                        milestone.isCompleted ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      <CheckCircle2 
                        className="h-5 w-5"
                        fill={milestone.isCompleted ? 'currentColor' : 'none'}
                      />
                    </button>
                    <span className={`ml-3 ${milestone.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {milestone.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-500">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsPage;
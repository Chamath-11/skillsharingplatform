import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { ArrowLeft, Calendar, Clock, CheckCircle2, PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  commitment?: {
    hours: number;
    frequency: 'daily' | 'weekly';
  };
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMilestone, setNewMilestone] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<string | null>(null);
  const [commitmentHours, setCommitmentHours] = useState<number>(1);
  const [commitmentFrequency, setCommitmentFrequency] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const mockPlan: LearningPlan = {
          id: id || '1',
          title: 'Advanced React & TypeScript',
          description: 'Master React with TypeScript including hooks, context API, and performance optimization techniques.',
          progress: 92,
          totalMilestones: 12,
          completedMilestones: 11,
          milestones: [
            { id: '1', title: 'TypeScript basics', isCompleted: true },
            { id: '2', title: 'React hooks with TypeScript', isCompleted: true },
            { id: '3', title: 'Custom hooks development', isCompleted: true },
            { id: '4', title: 'Performance optimization', isCompleted: true },
            { id: '5', title: 'State management patterns', isCompleted: true },
            { id: '6', title: 'Advanced component patterns', isCompleted: true },
            { id: '7', title: 'Testing strategies', isCompleted: true },
            { id: '8', title: 'Code splitting & lazy loading', isCompleted: true },
            { id: '9', title: 'Authentication & authorization', isCompleted: true },
            { id: '10', title: 'API integration patterns', isCompleted: true },
            { id: '11', title: 'Deployment & CI/CD', isCompleted: true },
            { id: '12', title: 'Final project implementation', isCompleted: false }
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

  const handleCommitmentUpdate = (milestoneId: string) => {
    if (!plan) return;
    
    const updatedMilestones = plan.milestones.map(milestone =>
      milestone.id === milestoneId
        ? { 
            ...milestone, 
            commitment: {
              hours: commitmentHours,
              frequency: commitmentFrequency
            }
          }
        : milestone
    );
    
    setPlan({
      ...plan,
      milestones: updatedMilestones
    });
    
    setEditingCommitment(null);
  };

  const calculateTotalWeeklyCommitment = (): number => {
    if (!plan) return 0;
    
    return plan.milestones.reduce((total, milestone) => {
      if (!milestone.commitment) return total;
      
      if (milestone.commitment.frequency === 'daily') {
        return total + (milestone.commitment.hours * 7);
      } else {
        return total + milestone.commitment.hours;
      }
    }, 0);
  };

  const getMilestoneAlert = (milestone: Milestone) => {
    if (!milestone.commitment || milestone.isCompleted) return null;
    
    const daysUntilTarget = differenceInDays(plan?.targetDate || new Date(), new Date());
    const weeklyHours = milestone.commitment.frequency === 'daily' 
      ? milestone.commitment.hours * 7 
      : milestone.commitment.hours;
    
    if (daysUntilTarget < 7 && !milestone.isCompleted) {
      return {
        type: 'urgent',
        message: 'Due soon! Consider increasing time commitment'
      };
    } else if (weeklyHours < 2) {
      return {
        type: 'warning',
        message: 'Low time commitment'
      };
    }
    return null;
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

          {/* Time Commitment Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Time Commitment</h3>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-blue-900">
                Total weekly commitment: {calculateTotalWeeklyCommitment().toFixed(1)} hours
              </span>
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
                  className="flex flex-col p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
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
                      <span className={`ml-3 flex items-center gap-2 ${milestone.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {milestone.title}
                        {milestone.commitment && (
                          <Clock className="h-3.5 w-3.5 text-blue-500" />
                        )}
                        {getMilestoneAlert(milestone) && (
                          <div className="relative group">
                            <AlertCircle className={`h-3.5 w-3.5 ${
                              getMilestoneAlert(milestone)?.type === 'urgent' ? 'text-red-500' : 'text-amber-500'
                            }`} />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block">
                              <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                {getMilestoneAlert(milestone)?.message}
                              </div>
                            </div>
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          if (milestone.commitment) {
                            setCommitmentHours(milestone.commitment.hours);
                            setCommitmentFrequency(milestone.commitment.frequency);
                          }
                          setEditingCommitment(milestone.id);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-500">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Commitment Display */}
                  {milestone.commitment && editingCommitment !== milestone.id && (
                    <div className="mt-2 ml-9 text-sm text-gray-500">
                      Committed: {milestone.commitment.hours} hours {milestone.commitment.frequency}
                    </div>
                  )}

                  {/* Commitment Edit Form */}
                  {editingCommitment === milestone.id && (
                    <div className="mt-2 ml-9 flex items-center gap-2">
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={commitmentHours}
                        onChange={(e) => setCommitmentHours(parseFloat(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <select
                        value={commitmentFrequency}
                        onChange={(e) => setCommitmentFrequency(e.target.value as 'daily' | 'weekly')}
                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="daily">hours daily</option>
                        <option value="weekly">hours weekly</option>
                      </select>
                      <button
                        onClick={() => handleCommitmentUpdate(milestone.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommitment(null)}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
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
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  commitment?: {
    hours: number;
    frequency: 'daily' | 'weekly';
  };
}

interface LearningPlanProps {
  plan: {
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
  };
}

const LearningPlanCard: React.FC<LearningPlanProps> = ({ plan }) => {
  const getTotalWeeklyCommitment = () => {
    return plan.milestones.reduce((total, milestone) => {
      if (!milestone.commitment) return total;
      return total + (milestone.commitment.frequency === 'daily' 
        ? milestone.commitment.hours * 7 
        : milestone.commitment.hours);
    }, 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900">{plan.title}</h3>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Time Commitment</h4>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-blue-900">
              {getTotalWeeklyCommitment().toFixed(1)} hours/week
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {plan.milestones
            .filter(m => m.commitment)
            .map(milestone => (
              <div 
                key={milestone.id} 
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <CheckCircle 
                    className={`h-4 w-4 ${milestone.isCompleted ? 'text-green-500' : 'text-gray-300'}`}
                    fill={milestone.isCompleted ? 'currentColor' : 'none'}
                  />
                  <span className="ml-2 text-sm text-gray-700">{milestone.title}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {milestone.commitment?.hours} hrs {milestone.commitment?.frequency}
                </span>
              </div>
          ))}
        </div>
        
        <Link 
          to={`/plan/${plan.id}`}
          className="flex items-center justify-center w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium mt-4"
        >
          View Details <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default LearningPlanCard;
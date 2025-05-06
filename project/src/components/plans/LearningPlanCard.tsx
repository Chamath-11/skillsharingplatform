import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
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
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900">{plan.title}</h3>
          <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full">
            {plan.progress}% Complete
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            <span>Started: {format(plan.startDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            <span>Target: {format(plan.targetDate, 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{plan.completedMilestones}/{plan.totalMilestones} milestones</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-500 h-2 rounded-full"
              style={{ width: `${plan.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Milestones:</h4>
          <ul className="space-y-2">
            {plan.milestones.slice(0, 3).map(milestone => (
              <li key={milestone.id} className="flex items-start">
                <CheckCircle 
                  className={`h-4 w-4 mt-0.5 mr-2 ${milestone.isCompleted ? 'text-green-500' : 'text-gray-300'}`} 
                  fill={milestone.isCompleted ? '#10B981' : 'none'}
                />
                <span className={`text-sm ${milestone.isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                  {milestone.title}
                </span>
              </li>
            ))}
            {plan.milestones.length > 3 && (
              <li className="text-xs text-gray-500 pl-6">
                +{plan.milestones.length - 3} more milestones
              </li>
            )}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {plan.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <Link 
          to={`/plan/${plan.id}`}
          className="flex items-center justify-center w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium mt-2"
        >
          View Plan <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default LearningPlanCard;
import React from 'react';
import { Book, Video, FileText, Wrench, Heart, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  resourceType: 'VIDEO' | 'ARTICLE' | 'BOOK' | 'TOOL';
  skillCategory: string;
  likes: number;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  isOwner: boolean;
  isLiked?: boolean;
};

interface ResourceCardProps {
  resource: Resource;
  onEdit: () => void;
  onDelete: () => void;
  onLike: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onEdit, onDelete, onLike }) => {
  const { currentUser } = useAuth();

  const getResourceIcon = () => {
    switch (resource.resourceType) {
      case 'VIDEO':
        return <Video className="h-5 w-5" />;
      case 'BOOK':
        return <Book className="h-5 w-5" />;
      case 'ARTICLE':
        return <FileText className="h-5 w-5" />;
      case 'TOOL':
        return <Wrench className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              resource.resourceType === 'VIDEO' ? 'bg-red-100 text-red-600' :
              resource.resourceType === 'ARTICLE' ? 'bg-blue-100 text-blue-600' :
              resource.resourceType === 'BOOK' ? 'bg-purple-100 text-purple-600' :
              'bg-green-100 text-green-600'
            }`}>
              {getResourceIcon()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{resource.title}</h3>
              <span className="text-xs text-gray-500">
                Added {format(new Date(resource.createdAt), 'MMM d, yyyy')} by {resource.userName}
              </span>
            </div>
          </div>
          
          {resource.isOwner && (
            <div className="flex space-x-2">
              <button 
                onClick={onEdit}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onLike}
              disabled={!currentUser}
              className={`inline-flex items-center text-sm ${
                resource.isLiked 
                  ? 'text-pink-500 hover:text-pink-600' 
                  : 'text-gray-500 hover:text-pink-500'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Heart 
                className={`h-4 w-4 mr-1 ${resource.isLiked ? 'fill-current' : ''}`} 
              />
              {resource.likes}
            </button>
            <span className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {resource.skillCategory}
            </span>
          </div>

          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            Visit Resource
            <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
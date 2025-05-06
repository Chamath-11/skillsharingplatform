import React from 'react';
import { Book, Video, FileText, Wrench, Heart, ExternalLink, Edit, Trash2, MoreVertical, Share2, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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
  onShare: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onEdit, onDelete, onLike, onShare }) => {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        {/* Resource Header */}
        <div className="flex items-start justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              resource.resourceType === 'VIDEO' ? 'bg-red-100 text-red-600' :
              resource.resourceType === 'ARTICLE' ? 'bg-blue-100 text-blue-600' :
              resource.resourceType === 'BOOK' ? 'bg-purple-100 text-purple-600' :
              'bg-green-100 text-green-600'
            }`}>
              {resource.resourceType === 'VIDEO' && <Video className="h-5 w-5" />}
              {resource.resourceType === 'ARTICLE' && <FileText className="h-5 w-5" />}
              {resource.resourceType === 'BOOK' && <Book className="h-5 w-5" />}
              {resource.resourceType === 'TOOL' && <Wrench className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.title}
                </a>
              </h3>
              <p className="text-sm text-gray-500">{resource.skillCategory}</p>
            </div>
          </div>

          {resource.isOwner && (
            <Menu as="div" className="relative">
              <Menu.Button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onEdit}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Resource
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onDelete}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex w-full items-center px-4 py-2 text-sm text-red-600`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Resource
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>

        {/* Resource Description */}
        <div className="px-4 pb-4">
          <p className="text-gray-600 text-sm line-clamp-2">
            {resource.description}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onLike}
                className={`flex items-center space-x-1.5 ${
                  resource.isLiked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                } transition-colors`}
              >
                <Heart className={`h-5 w-5 ${resource.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{resource.likes}</span>
              </button>
              
              <button 
                onClick={onShare}
                className="flex items-center space-x-1.5 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span className="text-sm">Share</span>
              </button>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock, MoreVertical, Edit, Trash2, Target, Bookmark } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from './CommentSection';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface PostCardProps {
  post: {
    id: string;
    userId: string;
    userName: string;
    userImage: string;
    content: string;
    images: string[];
    videoUrl?: string;
    createdAt: Date;
    likes: number;
    comments: number;
    isLiked: boolean;
    commitmentGoal?: number;
    commits?: number;
    commitmentDeadline?: Date;
    isCommitmentComplete?: boolean;
    isCommitted?: boolean;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const toggleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const isOwner = currentUser && currentUser.id === post.userId;

  const onEdit = () => {
    // Handle edit post
  };

  const onDelete = () => {
    // Handle delete post
  };

  const onLike = () => {
    toggleLike();
  };

  const onComment = () => {
    toggleComments();
  };

  const onShare = () => {
    // Handle share post
  };

  const onBookmark = () => {
    // Handle bookmark post
  };

  const handleCommitClick = () => {
    // Handle commit click
  };

  const onImageClick = (image: string) => {
    // Handle image click
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100 transition-all hover:shadow-md">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img 
            src={post.userImage} 
            alt={post.userName}
            className="h-10 w-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {post.userName}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </p>
              </div>
              {isOwner && (
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
                              Edit Post
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
                              Delete Post
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>
            
            <div className="mt-2">
              <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap break-words">
                {post.content}
              </div>
              
              {post.commitmentGoal > 0 && (
                <div className="mt-3 bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-blue-800">
                        Learning Commitment
                      </span>
                    </div>
                    <span className="text-sm text-blue-600">
                      {post.commits}/{post.commitmentGoal} days
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(post.commits / post.commitmentGoal) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-blue-600">
                      Target: {format(post.commitmentDeadline, 'MMM d, yyyy')}
                    </span>
                    {!post.isCommitmentComplete && (
                      <button
                        onClick={handleCommitClick}
                        disabled={post.isCommitted}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {post.isCommitted ? 'Committed' : 'Join Challenge'}
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {post.images && post.images.length > 0 && (
                <div className={`mt-3 grid ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => onImageClick?.(image)}
                    />
                  ))}
                </div>
              )}
              
              {post.videoUrl && (
                <div className="mt-3">
                  <video
                    src={post.videoUrl}
                    controls
                    className="rounded-lg w-full"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex space-x-4">
                <button 
                  onClick={onLike}
                  className={`flex items-center space-x-1.5 ${
                    post.isLiked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                  } transition-colors`}
                >
                  <Heart 
                    className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`}
                  />
                  <span className="text-sm">{post.likes}</span>
                </button>
                
                <button 
                  onClick={onComment}
                  className="flex items-center space-x-1.5 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                
                <button 
                  onClick={onShare}
                  className="flex items-center space-x-1.5 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
              
              <button 
                onClick={onBookmark}
                className={`p-1 rounded-full ${
                  isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                } transition-colors`}
              >
                <Bookmark 
                  className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <CommentSection postId={post.id} />
      )}
    </div>
  );
};

export default PostCard;
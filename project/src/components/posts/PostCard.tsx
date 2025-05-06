import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from './CommentSection';

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

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100 transition-all hover:shadow-md">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <Link to={`/profile/${post.userId}`} className="flex items-center space-x-3">
          <img 
            src={post.userImage} 
            alt={post.userName} 
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-gray-900">{post.userName}</h3>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
        </Link>
        
        <div className="relative">
          <button 
            onClick={toggleOptions}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-500" />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Save Post
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Report Post
              </button>
              {currentUser && currentUser.id === post.userId && (
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 mb-3">{post.content}</p>
      </div>
      
      {/* Post Media */}
      {post.images && post.images.length > 0 && (
        <div className={`grid ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
          {post.images.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Post image ${index + 1}`}
              className="w-full h-64 object-cover"
            />
          ))}
        </div>
      )}
      
      {post.videoUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <video 
            src={post.videoUrl} 
            controls 
            className="w-full h-64 object-cover"
          />
        </div>
      )}
      
      {/* Post Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div className="flex space-x-6">
          <button 
            onClick={toggleLike}
            className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-red-500' : ''}`} />
            <span>{likesCount}</span>
          </button>
          
          <button 
            onClick={toggleComments}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </button>
        </div>
        
        <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <CommentSection postId={post.id} />
      )}
    </div>
  );
};

export default PostCard;
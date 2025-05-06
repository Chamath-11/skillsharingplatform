import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, Edit2 } from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  createdAt: Date;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Jane Smith',
      userImage: 'https://randomuser.me/api/portraits/women/57.jpg',
      content: "This is really helpful! I've been trying to learn this skill for a while.",
      createdAt: new Date(Date.now() - 60 * 60000),
    },
    {
      id: '2',
      userId: '3',
      userName: 'Mike Johnson',
      userImage: 'https://randomuser.me/api/portraits/men/22.jpg',
      content: 'Great explanation! Do you have any recommended resources for beginners?',
      createdAt: new Date(Date.now() - 24 * 60000),
    }
  ]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userImage: currentUser.profileImage,
      content: commentText,
      createdAt: new Date(),
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const saveEdit = (id: string) => {
    if (!editText.trim()) return;
    
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, content: editText } : comment
    ));
    setEditingCommentId(null);
  };

  const deleteComment = (id: string) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  return (
    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
      {/* Comment List */}
      <div className="mb-4 space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="flex space-x-3">
            <img 
              src={comment.userImage} 
              alt={comment.userName} 
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{comment.userName}</h4>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  
                  {currentUser && (currentUser.id === comment.userId) && (
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => startEditing(comment)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteComment(comment.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {editingCommentId === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button 
                        onClick={() => setEditingCommentId(null)}
                        className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => saveEdit(comment.id)}
                        className="px-3 py-1 text-xs text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-gray-800 text-sm">{comment.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <img 
            src={currentUser.profileImage} 
            alt={currentUser.name} 
            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-sm text-gray-500">
          <a href="/login" className="text-blue-500 hover:underline">Log in</a> to leave a comment
        </p>
      )}
    </div>
  );
};

export default CommentSection;
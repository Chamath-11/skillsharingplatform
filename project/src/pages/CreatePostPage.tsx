import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Image, Film, Send, ArrowLeft } from 'lucide-react';

const CreatePostPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Check if adding new files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert('You can only upload up to 3 media files per post');
      return;
    }
    
    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    
    Array.from(files).forEach(file => {
      // Check file type
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        newFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    });
    
    setMediaFiles([...mediaFiles, ...newFiles]);
    setMediaPreviewUrls([...mediaPreviewUrls, ...newPreviewUrls]);
  };
  
  const removeMedia = (index: number) => {
    const newFiles = [...mediaFiles];
    const newPreviewUrls = [...mediaPreviewUrls];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setMediaFiles(newFiles);
    setMediaPreviewUrls(newPreviewUrls);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && mediaFiles.length === 0) {
      alert('Please add some content or media to your post');
      return;
    }
    
    // Here you would typically send the post data to your backend
    console.log('Submitting post:', { content, mediaFiles });
    
    // Navigate back to home after successful submission
    navigate('/');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Create New Post</h1>
          <div className="w-9"></div> {/* Empty div for flex alignment */}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex space-x-3 mb-4">
            <img 
              src={currentUser.profileImage} 
              alt={currentUser.name} 
              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                placeholder="Share your skills or learning progress..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>
          </div>
          
          {/* Media Previews */}
          {mediaPreviewUrls.length > 0 && (
            <div className={`grid ${mediaPreviewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-4`}>
              {mediaPreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  {mediaFiles[index].type.startsWith('image/') ? (
                    <img 
                      src={url} 
                      alt={`Preview ${index}`} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <video 
                      src={url} 
                      controls 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <label className="cursor-pointer p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                <Image className="h-5 w-5" />
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleMediaChange}
                  className="hidden"
                  disabled={mediaFiles.length >= 3}
                />
              </label>
              <label className="cursor-pointer p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                <Film className="h-5 w-5" />
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={handleMediaChange}
                  className="hidden"
                  disabled={mediaFiles.length >= 3}
                />
              </label>
              <div className="text-xs text-gray-500 self-center ml-1">
                {mediaFiles.length}/3 files
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={(!content.trim() && mediaFiles.length === 0)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
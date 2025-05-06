import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PostCard from '../components/posts/PostCard';

interface Post {
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
}

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // This would be replaced with actual API call
        // const response = await fetch(`/api/posts/${id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockPost: Post = {
          id: id || '1',
          userId: '1',
          userName: 'John Doe',
          userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
          content: 'This is a detailed post about web development and best practices...',
          images: ['https://source.unsplash.com/random/800x600'],
          createdAt: new Date(),
          likes: 42,
          comments: 5,
          isLiked: false
        };
        
        setPost(mockPost);
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Post not found'}</p>
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>
      
      <PostCard post={post} />
    </div>
  );
};

export default PostDetailsPage;
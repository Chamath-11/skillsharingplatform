import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/posts/PostCard';
import ResourceCard from '../components/resources/ResourceCard';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, TrendingUp, Book } from 'lucide-react';

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

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  resourceType: 'VIDEO' | 'ARTICLE' | 'BOOK' | 'TOOL';
  skillCategory: string;
  likes: number;
  createdAt: string;
  isOwner: boolean;
}

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('forYou');
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  
  useEffect(() => {
    // Mock posts data
    const mockPosts: Post[] = [
      {
        id: '1',
        userId: '2',
        userName: 'Dr. Sarah Chen',
        userImage: 'https://randomuser.me/api/portraits/women/57.jpg',
        content: 'Just completed an in-depth course on Machine Learning with TensorFlow! Key takeaways for aspiring ML engineers:\n\n1. Focus on understanding the math behind algorithms\n2. Start with simple linear models before diving into deep learning\n3. Practice with real-world datasets\n4. Document your experiments meticulously\n\nHappy to share more insights and resources. What areas of ML are you focusing on?',
        images: ['https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        createdAt: new Date(Date.now() - 3 * 3600000),
        likes: 245,
        comments: 52,
        isLiked: false,
        commitmentGoal: 30,
        commitmentDeadline: new Date(Date.now() + 30 * 24 * 3600000),
        commits: 12,
        isCommitted: true,
        isCommitmentComplete: false
      },
      {
        id: '2',
        userId: '3',
        userName: 'Prof. Michael Roberts',
        userImage: 'https://randomuser.me/api/portraits/men/22.jpg',
        content: "Just finished leading a workshop on cloud architecture best practices. Here's a system design diagram showcasing microservices deployment with Kubernetes and service mesh. Implemented with high availability and scalability in mind. Would love to hear your thoughts on this approach.",
        images: [
          'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        ],
        createdAt: new Date(Date.now() - 12 * 3600000),
        likes: 189,
        comments: 34,
        isLiked: true,
        commitmentGoal: 0,
        commitmentDeadline: new Date(),
        commits: 0,
        isCommitted: false,
        isCommitmentComplete: false
      },
      {
        id: '3',
        userId: '4',
        userName: 'Emily Zhang',
        userImage: 'https://randomuser.me/api/portraits/women/31.jpg',
        content: 'Excited to share my latest tech talk on "Building Scalable APIs with GraphQL". Covers schema design, performance optimization, and security best practices. Full presentation with code examples available in the video. Looking forward to your feedback!',
        videoUrl: 'https://example.com/graphql-tech-talk.mp4',
        images: [],
        createdAt: new Date(Date.now() - 24 * 3600000),
        likes: 312,
        comments: 67,
        isLiked: false,
        commitmentGoal: 15,
        commitmentDeadline: new Date(Date.now() + 15 * 24 * 3600000),
        commits: 8,
        isCommitted: true,
        isCommitmentComplete: false
      }
    ];
    
    setPosts(mockPosts);

    // Mock featured resources
    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Enterprise Architecture Patterns in Microservices',
        description: 'A comprehensive guide to designing and implementing scalable microservices architecture, including patterns for service discovery, resilience, and monitoring.',
        url: 'https://example.com/microservices-architecture',
        resourceType: 'ARTICLE',
        skillCategory: 'System Architecture',
        likes: 1256,
        createdAt: new Date().toISOString(),
        isOwner: false
      },
      {
        id: '2',
        title: 'Advanced Data Science with Python',
        description: 'Master data science techniques using Python, covering advanced statistical analysis, machine learning algorithms, and deep learning with practical industry examples.',
        url: 'https://example.com/data-science-course',
        resourceType: 'VIDEO',
        skillCategory: 'Data Science',
        likes: 892,
        createdAt: new Date().toISOString(),
        isOwner: false
      }
    ];
    
    setFeaturedResources(mockResources);
  }, []);
  
  return (
    <div className="pb-10">
      {/* Welcome Section for Guest Users */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 mb-6 shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to SkillShare</h1>
          <p className="text-white/80 mb-4">
            Join our community to share your skills, track your learning journey, and connect with other learners.
          </p>
          <div className="flex flex-wrap gap-3">
            <a 
              href="/login" 
              className="px-5 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Get Started
            </a>
            <a 
              href="/about" 
              className="px-5 py-2 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      )}
      
      {/* Featured Resources */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Featured Resources</h2>
          <Link 
            to="/resources"
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Book className="h-4 w-4 mr-1" />
            Browse All Resources
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
      
      {/* Feed Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              activeTab === 'forYou' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('forYou')}
          >
            <div className="flex items-center justify-center">
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>For You</span>
            </div>
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              activeTab === 'trending' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            <div className="flex items-center justify-center">
              <TrendingUp className="h-4 w-4 mr-1.5" />
              <span>Trending</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Feed Content */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No posts to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
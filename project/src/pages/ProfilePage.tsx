import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/posts/PostCard';
import LearningPlanCard from '../components/plans/LearningPlanCard';
import { Calendar, MapPin, Briefcase, Link as LinkIcon, Edit, UserPlus, Users } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  username: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  location: string;
  occupation: string;
  website: string;
  joinDate: Date;
  stats: {
    posts: number;
    plans: number;
    followers: number;
    following: number;
  };
  isFollowing: boolean;
}

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

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface LearningPlan {
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
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const isOwnProfile = currentUser && userId === currentUser.id;
  
  useEffect(() => {
    // Mock profile data
    const mockProfile: Profile = {
      id: userId || '1',
      name: 'John Doe',
      username: 'johndoe',
      bio: 'Software developer passionate about learning and sharing knowledge. Currently focused on web development, UI/UX, and machine learning.',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      coverImage: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      location: 'San Francisco, CA',
      occupation: 'Frontend Developer',
      website: 'johndoe.com',
      joinDate: new Date(2024, 0, 15),
      stats: {
        posts: 42,
        plans: 8,
        followers: 256,
        following: 184
      },
      isFollowing: false
    };
    
    setProfile(mockProfile);
    setIsFollowing(mockProfile.isFollowing);
    
    // Mock posts data
    const mockPosts: Post[] = [
      {
        id: '1',
        userId: userId || '1',
        userName: 'John Doe',
        userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: 'Just completed this React tutorial series! Really helped me understand hooks and context API better. What are your favorite React learning resources?',
        images: ['https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        createdAt: new Date(Date.now() - 2 * 3600000),
        likes: 18,
        comments: 4,
        isLiked: false
      },
      {
        id: '2',
        userId: userId || '1',
        userName: 'John Doe',
        userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: 'Made significant progress on my machine learning course today. Finished the section on neural networks and started working on my first classification model!',
        images: [],
        createdAt: new Date(Date.now() - 24 * 3600000),
        likes: 35,
        comments: 7,
        isLiked: true
      }
    ];
    
    setPosts(mockPosts);
    
    // Mock learning plans
    const mockPlans: LearningPlan[] = [
      {
        id: '1',
        title: 'Advanced React & TypeScript',
        description: 'Master React with TypeScript including hooks, context API, and performance optimization techniques.',
        progress: 65,
        totalMilestones: 12,
        completedMilestones: 8,
        milestones: [
          { id: '1', title: 'TypeScript basics', isCompleted: true },
          { id: '2', title: 'React hooks with TypeScript', isCompleted: true },
          { id: '3', title: 'Custom hooks development', isCompleted: true },
          { id: '4', title: 'Performance optimization', isCompleted: false },
          { id: '5', title: 'Build a full project', isCompleted: false }
        ],
        startDate: new Date(2024, 1, 10),
        targetDate: new Date(2024, 3, 30),
        tags: ['React', 'TypeScript', 'Frontend']
      },
      {
        id: '2',
        title: 'Machine Learning Fundamentals',
        description: 'Learn the core concepts of machine learning including supervised and unsupervised learning, neural networks, and practical implementations.',
        progress: 30,
        totalMilestones: 10,
        completedMilestones: 3,
        milestones: [
          { id: '1', title: 'Linear regression', isCompleted: true },
          { id: '2', title: 'Classification algorithms', isCompleted: true },
          { id: '3', title: 'Neural networks basics', isCompleted: true },
          { id: '4', title: 'Deep learning', isCompleted: false },
          { id: '5', title: 'Model deployment', isCompleted: false }
        ],
        startDate: new Date(2024, 2, 5),
        targetDate: new Date(2024, 5, 15),
        tags: ['ML', 'AI', 'Python', 'Data Science']
      }
    ];
    
    setPlans(mockPlans);
  }, [userId]);
  
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  
  if (!profile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="pb-10">
      {/* Cover Photo */}
      <div 
        className="h-56 md:h-64 w-full bg-cover bg-center rounded-xl overflow-hidden relative"
        style={{ backgroundImage: `url(${profile.coverImage})` }}
      >
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors">
            <Edit className="h-5 w-5 text-gray-700" />
          </button>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>
      </div>
      
      {/* Profile Info */}
      <div className="relative px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-20 mb-4 sm:mb-6">
          {/* Profile Picture */}
          <div className="z-10 relative">
            <img 
              src={profile.profileImage} 
              alt={profile.name} 
              className="h-32 w-32 sm:h-36 sm:w-36 rounded-full border-4 border-white object-cover"
            />
            {isOwnProfile && (
              <button className="absolute bottom-1 right-1 bg-white hover:bg-gray-100 rounded-full p-1.5 shadow-md transition-colors">
                <Edit className="h-4 w-4 text-gray-700" />
              </button>
            )}
          </div>
          
          {/* Name and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-1 sm:ml-4 mt-4 sm:mt-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500">@{profile.username}</p>
            </div>
            
            <div className="mt-3 sm:mt-0">
              {isOwnProfile ? (
                <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Edit Profile
                </button>
              ) : (
                <button 
                  onClick={toggleFollow}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isFollowing 
                      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } transition-colors`}
                >
                  {isFollowing ? (
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1.5" />
                      Following
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-1.5" />
                      Follow
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Bio and Details */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">{profile.bio}</p>
          
          <div className="flex flex-wrap gap-y-2">
            {profile.location && (
              <div className="flex items-center text-gray-500 text-sm mr-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            )}
            
            {profile.occupation && (
              <div className="flex items-center text-gray-500 text-sm mr-4">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{profile.occupation}</span>
              </div>
            )}
            
            {profile.website && (
              <div className="flex items-center text-gray-500 text-sm mr-4">
                <LinkIcon className="h-4 w-4 mr-1" />
                <a 
                  href={`https://${profile.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
            
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Joined {profile.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900">{profile.stats.posts}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900">{profile.stats.plans}</p>
            <p className="text-xs text-gray-500">Plans</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900">{profile.stats.followers}</p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900">{profile.stats.following}</p>
            <p className="text-xs text-gray-500">Following</p>
          </div>
        </div>
        
        {/* Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                activeTab === 'posts' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button 
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                activeTab === 'plans' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('plans')}
            >
              Learning Plans
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'posts' ? (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">No posts to display.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.length > 0 ? (
              plans.map(plan => <LearningPlanCard key={plan.id} plan={plan} />)
            ) : (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm col-span-2">
                <p className="text-gray-500">No learning plans to display.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
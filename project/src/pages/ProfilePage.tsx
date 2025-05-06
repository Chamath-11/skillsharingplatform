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
      name: 'Dr. James Wilson',
      username: 'jwilson',
      bio: 'Senior Software Architect with 12+ years of experience. Specializing in distributed systems and cloud architecture. Currently leading technical workshops on microservices and cloud-native development. Active contributor to open-source projects.',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      coverImage: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      location: 'San Francisco, CA',
      occupation: 'Senior Software Architect @ TechCorp',
      website: 'jameswilson.dev',
      joinDate: new Date(2024, 0, 15),
      stats: {
        posts: 89,
        plans: 12,
        followers: 1420,
        following: 384
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
        userName: 'Dr. James Wilson',
        userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: `Published my research paper on "Optimizing Microservices Performance in Large-Scale Distributed Systems" 📚

Key findings:
• Service mesh implementation reduced latency by 40%
• Custom load balancing algorithm improved throughput by 25%
• New caching strategy reduced database load by 60%

Full paper available at: arxiv.org/papers/2025/microservices-opt
#SystemDesign #Microservices #Performance`,
        images: ['https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        createdAt: new Date(Date.now() - 2 * 3600000),
        likes: 342,
        comments: 56,
        isLiked: false
      },
      {
        id: '2',
        userId: userId || '1',
        userName: 'Dr. James Wilson',
        userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: `Just wrapped up a technical workshop series on "Building Resilient Cloud-Native Applications" at @TechCorp! 🚀

Topics covered:
• Kubernetes deployment strategies
• Circuit breaker patterns
• Distributed tracing
• Chaos engineering practices

Slides and demo code available on my GitHub. Let me know if you have any questions!`,
        images: [],
        createdAt: new Date(Date.now() - 24 * 3600000),
        likes: 289,
        comments: 41,
        isLiked: true
      }
    ];
    
    setPosts(mockPosts);
    
    // Mock learning plans
    const mockPlans: LearningPlan[] = [
      {
        id: '1',
        title: 'Advanced Cloud Architecture Mastery',
        description: 'Comprehensive study plan covering advanced cloud architecture patterns, focusing on AWS, Azure, and GCP. Includes hands-on projects and certifications.',
        progress: 75,
        totalMilestones: 12,
        completedMilestones: 9,
        milestones: [
          { id: '1', title: 'AWS Solutions Architect Professional Certification', isCompleted: true },
          { id: '2', title: 'Multi-Cloud Architecture Patterns', isCompleted: true },
          { id: '3', title: 'Serverless Architecture Implementation', isCompleted: true },
          { id: '4', title: 'Cloud Security Best Practices', isCompleted: false },
          { id: '5', title: 'Cost Optimization Strategies', isCompleted: false }
        ],
        startDate: new Date(2024, 1, 10),
        targetDate: new Date(2024, 6, 30),
        tags: ['Cloud', 'AWS', 'Azure', 'Architecture']
      },
      {
        id: '2',
        title: 'Distributed Systems Engineering',
        description: 'Deep dive into distributed systems design and implementation, focusing on scalability, reliability, and performance optimization.',
        progress: 40,
        totalMilestones: 10,
        completedMilestones: 4,
        milestones: [
          { id: '1', title: 'Consensus Algorithms', isCompleted: true },
          { id: '2', title: 'Distributed Caching', isCompleted: true },
          { id: '3', title: 'Message Queue Systems', isCompleted: true },
          { id: '4', title: 'Distributed Tracing', isCompleted: false },
          { id: '5', title: 'Service Mesh Implementation', isCompleted: false }
        ],
        startDate: new Date(2024, 3, 5),
        targetDate: new Date(2024, 8, 15),
        tags: ['Distributed Systems', 'System Design', 'Performance']
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
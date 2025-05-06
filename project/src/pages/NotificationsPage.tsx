import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const mockNotifications = [
    {
      id: '1',
      type: 'MILESTONE_COMPLETED',
      title: 'AWS Solutions Architect Certification Milestone Completed',
      content: 'Congratulations! You\'ve completed the AWS Solutions Architect Professional certification milestone in your Cloud Architecture learning plan.',
      timestamp: new Date(Date.now() - 30 * 60000),
      isRead: false,
      link: '/plans/1'
    },
    {
      id: '2',
      type: 'RESOURCE_SHARED',
      title: 'New Resource Shared: System Design Interview Guide',
      content: 'Dr. Elena Martinez shared a comprehensive guide on approaching system design interviews with scalable architecture patterns.',
      timestamp: new Date(Date.now() - 2 * 3600000),
      isRead: false,
      link: '/resources/2'
    },
    {
      id: '3',
      type: 'PLAN_MILESTONE_DUE',
      title: 'Upcoming Milestone Due',
      content: 'The "Implement Service Mesh with Istio" milestone in your Cloud Architecture & DevOps Excellence plan is due in 2 days.',
      timestamp: new Date(Date.now() - 12 * 3600000),
      isRead: true,
      link: '/plans/1'
    },
    {
      id: '4',
      type: 'POST_COMMENT',
      title: 'New Comment on Your Post',
      content: 'Prof. Michael Roberts commented on your post about microservices architecture patterns: "Great insights on using service mesh for resilience..."',
      timestamp: new Date(Date.now() - 24 * 3600000),
      isRead: true,
      link: '/posts/1'
    },
    {
      id: '5',
      type: 'LEARNING_ACHIEVEMENT',
      title: 'Learning Streak Achievement',
      content: 'You\'ve maintained a 30-day learning streak! Keep up the great work on your professional development journey.',
      timestamp: new Date(Date.now() - 48 * 3600000),
      isRead: true,
      link: '/profile'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.isRead ? 'bg-white' : 'bg-blue-50'
              }`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
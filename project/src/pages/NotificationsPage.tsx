import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

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
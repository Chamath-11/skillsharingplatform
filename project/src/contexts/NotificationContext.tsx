import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  message: string;
  isRead: boolean;
  timestamp: Date;
  userId: string;
  postId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        message: 'Jane Smith liked your post on React Hooks',
        isRead: false,
        timestamp: new Date(Date.now() - 30 * 60000),
        userId: '2',
        postId: '101'
      },
      {
        id: '2',
        type: 'comment',
        message: 'Mike Johnson commented on your learning plan',
        isRead: false,
        timestamp: new Date(Date.now() - 2 * 3600000),
        userId: '3',
        postId: '102'
      },
      {
        id: '3',
        type: 'follow',
        message: 'Sarah Williams started following you',
        isRead: true,
        timestamp: new Date(Date.now() - 24 * 3600000),
        userId: '4'
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
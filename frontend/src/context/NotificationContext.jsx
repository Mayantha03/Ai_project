import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "AI Engine Initialized",
      message: "Genetic Timetable Optimizer & Random Forest models are active.",
      type: "SYSTEM",
      time: "Just now",
      read: false
    },
    {
      id: 2,
      title: "Cross-Faculty Room Shared",
      message: "Room FOE-E201 (Engineering) shared with Computing Faculty (CS22023).",
      type: "CROSS_FACULTY",
      time: "10 mins ago",
      read: false
    },
    {
      id: 3,
      title: "Smart Swap Executed",
      message: "Swapped FOC-L101 and FOE-E202. Utilization increased by +18.4%.",
      type: "ROOM_SWAP",
      time: "25 mins ago",
      read: false
    }
  ]);

  const addNotification = (title, message, type = "INFO") => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

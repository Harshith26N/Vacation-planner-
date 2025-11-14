// frontend/src/ActivityLogContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the context
const ActivityLogContext = createContext(null);

// Custom hook to use the activity log
export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (!context) {
    throw new Error('useActivityLog must be used within an ActivityLogProvider');
  }
  return context;
};

// Provider component
export const ActivityLogProvider = ({ children }) => {
  const [recentActivities, setRecentActivities] = useState([]);
  const localStorageKeyActivities = 'app_recent_activities'; // Global key for simplicity

  // Load activities from localStorage on initial mount
  useEffect(() => {
    const savedActivities = localStorage.getItem(localStorageKeyActivities);
    if (savedActivities) {
      try {
        setRecentActivities(JSON.parse(savedActivities));
      } catch (e) {
        console.error("Failed to parse saved activities from localStorage", e);
        setRecentActivities([]);
      }
    }
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(localStorageKeyActivities, JSON.stringify(recentActivities));
  }, [recentActivities]);

  // Function to log a new activity
  const logActivity = useCallback((activityText) => {
    const newActivity = { id: Date.now(), text: activityText, timestamp: new Date().toLocaleString() };
    setRecentActivities(prevActivities => {
      const updatedActivities = [newActivity, ...prevActivities].slice(0, 5); // Keep only the last 5 activities
      return updatedActivities;
    });
  }, []);

  return (
    <ActivityLogContext.Provider value={{ recentActivities, logActivity }}>
      {children}
    </ActivityLogContext.Provider>
  );
};

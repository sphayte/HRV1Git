import React, { createContext, useContext, useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const checkDueDates = (tasks, documents, additionalNotifications = []) => {
    let newNotifications = [...additionalNotifications]; // Start with success notifications

    // Add warning notifications for upcoming tasks
    tasks?.forEach(task => {
      if (task.status !== 'Completed') {  // Only check non-completed tasks
        const dueDate = new Date(task.dueDate);
        const daysUntilDue = differenceInDays(dueDate, new Date());

        if (daysUntilDue <= 7 && daysUntilDue >= 0) {
          newNotifications.push({
            id: `task-${task.id}-${Date.now()}`,
            type: 'task',
            title: task.title,
            message: `Task due in ${daysUntilDue} days`,
            severity: daysUntilDue <= 2 ? 'error' : 'warning',
            date: new Date().toISOString()
          });
        }
      }
    });

    // Add warning notifications for documents
    documents?.forEach(doc => {
      if (doc.status !== 'Archived') {  // Only check non-archived documents
        const daysUntilExpiry = differenceInDays(
          new Date(doc.expiryDate),
          new Date()
        );

        if (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) {
          newNotifications.push({
            id: `doc-${doc.id}-${Date.now()}`,
            type: 'document',
            title: doc.name,
            message: `Document expires in ${daysUntilExpiry} days`,
            severity: daysUntilExpiry <= 7 ? 'error' : 'warning',
            date: new Date().toISOString()
          });
        }
      }
    });

    // Sort notifications by date (newest first)
    newNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    setNotifications(newNotifications);
  };

  return (
    <NotificationContext.Provider value={{ notifications, checkDueDates }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext); 
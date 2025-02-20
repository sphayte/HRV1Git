import React, { createContext, useContext, useState } from 'react';
import { 
  updateUserData, 
  addItem, 
  removeItem, 
  updateItem, 
  getUserData 
} from '../utils/firebaseUtils';
import { useAuth } from './AuthContext'; // We'll create this next

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleData = async (operation, ...args) => {
    if (!user) throw new Error('User must be logged in');
    setLoading(true);
    setError(null);
    try {
      const result = await operation(user.uid, ...args);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateData = (path, data) => handleData(updateUserData, path, data);
  const add = (path, item) => handleData(addItem, path, item);
  const remove = (path, itemId) => handleData(removeItem, path, itemId);
  const update = (path, itemId, updates) => handleData(updateItem, path, itemId, updates);
  const getData = (path) => handleData(getUserData, path);

  return (
    <UserDataContext.Provider value={{
      updateData,
      add,
      remove,
      update,
      getData,
      loading,
      error
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext); 